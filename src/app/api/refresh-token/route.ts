import { redis, WP_AUTH_TOKEN_KEY } from '@/lib/redis';
import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route để sync WordPress authentication token vào Redis
 * 
 * Logic đơn giản:
 * 1. Lấy refreshToken từ WORDPRESS_AUTH_REFRESH_TOKEN (env)
 * 2. Verify token vẫn còn hoạt động
 * 3. Lưu vào Redis để FetchAPI sử dụng
 * 
 * Note: Token hiện tại hết hạn năm 2027, không cần lo refresh
 */
export async function GET(request: NextRequest) {
    try {
        // Vercel Cron Jobs security: check CRON_SECRET in all environments
        const authHeader = request.headers.get('authorization');

        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const currentToken = process.env.WORDPRESS_AUTH_REFRESH_TOKEN;
        const wpUser = process.env.WP_USER;
        const wpPassword = process.env.WP_PASSWORD;

        if (!currentToken && (!wpUser || !wpPassword)) {
            return NextResponse.json(
                { error: 'Missing credentials. Need either WORDPRESS_AUTH_REFRESH_TOKEN or WP_USER + WP_PASSWORD' },
                { status: 500 }
            );
        }

        let tokenToSave: string | null = null;
        let method = '';
        let userEmail = '';

        // Strategy 1: Verify token hiện tại còn hoạt động
        if (currentToken) {
            try {
                const testQuery = `
          query TestToken {
            viewer {
              id
              name
              email
            }
          }
        `;

                console.log('🔍 Validating refreshToken...');

                const testResponse = await fetch(process.env.NEXT_PUBLIC_WORDPRESS_API_URL || '', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${currentToken}`,
                    },
                    body: JSON.stringify({ query: testQuery }),
                });

                const testData = await testResponse.json();

                if (testResponse.ok && !testData.errors && testData.data?.viewer) {
                    // Token còn hạn!
                    tokenToSave = currentToken;
                    method = 'token_still_valid';
                    userEmail = testData.data.viewer.email;
                    console.log('✅ Token is valid, user:', userEmail);
                } else {
                    console.warn('⚠️ Token invalid or expired:', testData.errors?.[0]?.message);
                }
            } catch (error) {
                console.warn('⚠️ Token validation error:', error);
            }
        }

        // Strategy 2: Fallback - Login với username/password nếu token hết hạn
        if (!tokenToSave && wpUser && wpPassword) {
            try {
                console.log('🔄 Token expired, logging in with credentials...');

                const loginMutation = `
          mutation LoginUser {
            login(input: { username: "${wpUser}", password: "${wpPassword}" }) {
              authToken
              refreshToken
              user {
                id
                name
                email
              }
            }
          }
        `;

                const loginResponse = await fetch(process.env.NEXT_PUBLIC_WORDPRESS_API_URL || '', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query: loginMutation }),
                });

                const loginData = await loginResponse.json();

                if (loginData.errors) {
                    console.error('❌ Login failed:', loginData.errors);
                    return NextResponse.json(
                        {
                            error: 'Login failed',
                            details: loginData.errors,
                            suggestion: 'Check WP_USER and WP_PASSWORD are correct'
                        },
                        { status: 500 }
                    );
                }

                // Lưu refreshToken (dài hạn), không phải authToken
                tokenToSave = loginData.data?.login?.refreshToken;
                method = 'new_login';
                userEmail = loginData.data?.login?.user?.email;

                console.log('✅ Logged in successfully, user:', userEmail);
                console.log('⚠️ IMPORTANT: New token generated. Check Vercel logs for full token if needed.');
            } catch (error) {
                console.error('❌ Login error:', error);
                return NextResponse.json(
                    { error: 'Login error', message: error instanceof Error ? error.message : 'Unknown' },
                    { status: 500 }
                );
            }
        }

        if (!tokenToSave) {
            return NextResponse.json(
                {
                    error: 'Failed to obtain valid token',
                    message: 'Token is invalid and no fallback credentials provided'
                },
                { status: 500 }
            );
        }

        // Lưu token vào Redis
        await redis.set(WP_AUTH_TOKEN_KEY, tokenToSave);

        console.log('✅ Token synced to Redis at:', new Date().toISOString());

        return NextResponse.json({
            success: true,
            message: 'Token synced to Redis successfully',
            method,
            timestamp: new Date().toISOString(),
            user: userEmail,
            tokenPreview: tokenToSave.substring(0, 10) + '...',
            expiresAt: method === 'new_login' ? 'January 2026 (1 year from now)' : 'January 2027',
            note: method === 'new_login'
                ? '⚠️ NEW TOKEN! Copy from logs and update WORDPRESS_AUTH_REFRESH_TOKEN in env'
                : '✅ Existing token still valid'
        });

    } catch (error) {
        console.error('Error in refresh-token:', error);
        return NextResponse.json(
            { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown' },
            { status: 500 }
        );
    }
}
