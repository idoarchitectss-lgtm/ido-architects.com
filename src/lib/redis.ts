import { Redis } from '@upstash/redis';

// Khởi tạo Redis client
// Sử dụng REST API của Upstash (không cần connection pooling)
// Vercel tạo biến với tên KV_REST_API_URL và KV_REST_API_TOKEN
export const redis = new Redis({
    url: process.env.KV_REST_API_URL || '',
    token: process.env.KV_REST_API_TOKEN || '',
});

// Key để lưu WordPress auth token
export const WP_AUTH_TOKEN_KEY = 'wordpress_auth_token';
