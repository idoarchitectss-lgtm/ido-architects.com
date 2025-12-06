# Cron Job - Tự động Refresh WordPress Token

## 📋 Tổng quan

Hệ thống sử dụng **Vercel Cron Jobs** để tự động validate và refresh WordPress authentication token mỗi 11 tháng, đảm bảo ứng dụng luôn có token hợp lệ mà không cần can thiệp thủ công.

## 🏗️ Kiến trúc

```
┌─────────────────────────────────────────────────────────────────┐
│                      Vercel Cron Scheduler                       │
│              Schedule: "0 0 1 */11 *" (mỗi 11 tháng)            │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ HTTP GET + Authorization Header
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│           /api/refresh-token (Serverless Function)              │
│                                                                  │
│  1. Check CRON_SECRET authorization                             │
│  2. Validate current token với WordPress GraphQL                │
│  3. Nếu token hết hạn → Login lại với WP_USER + WP_PASSWORD    │
│  4. Lưu token mới vào Upstash Redis                             │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Upstash Redis (Vercel KV)                    │
│         Key: "wordpress_auth_token" | Value: JWT Token          │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ Read token on every GraphQL request
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                 FetchAPI (src/lib/api.ts)                       │
│   - Đọc token từ Redis                                          │
│   - Fallback sang env variable nếu Redis lỗi                    │
│   - Thêm Authorization header vào mọi GraphQL request           │
└─────────────────────────────────────────────────────────────────┘
```

## ⚙️ Setup Instructions

### **Bước 1: Environment Variables**

Thêm các biến sau vào **Vercel Dashboard** → Project Settings → Environment Variables:

```bash
# Upstash Redis (Vercel KV)
KV_REST_API_URL=https://shining-octopus-22617.upstash.io
KV_REST_API_TOKEN=AVhZAAInc...

# WordPress Credentials (cho fallback login)
WP_USER=ido.architectss@gmail.com
WP_PASSWORD=Idoarchitects93@

# Token hiện tại (hết hạn 2027)
WORDPRESS_AUTH_REFRESH_TOKEN=eyJ0eXAiOiJKV1QiLCJhbGci...

# Bảo mật Cron Job
CRON_SECRET=ido-cron-secret-2025
```

⚠️ **Lưu ý:** Thêm cho **Production**, **Preview**, và **Development** environments.

### **Bước 2: Cron Configuration**

File `vercel.json` đã được cấu hình:

```json
{
  "crons": [{
    "path": "/api/refresh-token",
    "schedule": "0 0 1 */11 *"
  }]
}
```

**Giải thích schedule:**
- `0 0` = 00:00 (midnight)
- `1` = Ngày 1 hàng tháng
- `*/11` = Mỗi 11 tháng
- `*` = Mọi năm

→ Chạy vào **00:00 ngày 1 của tháng, mỗi 11 tháng** (trước khi token hết hạn 1 tháng)

### **Bước 3: Deploy**

```bash
git add .
git commit -m "feat: add cron job for auto token refresh"
git push origin main
```

Vercel sẽ tự động:
1. Đọc `vercel.json`
2. Tạo cron job
3. Schedule theo cấu hình

## 🔐 Bảo mật

### **Authorization Header**

Mọi request đến `/api/refresh-token` PHẢI có header:

```
Authorization: Bearer ido-cron-secret-2025
```

Vercel tự động thêm header này khi gọi cron job. Nếu sai hoặc thiếu → **401 Unauthorized**.

### **Code Implementation**

```typescript
// src/app/api/refresh-token/route.ts
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // ... xử lý refresh token
}
```

## 🔄 Luồng hoạt động chi tiết

### **Scenario 1: Token còn hạn**

```
1. Cron job trigger → GET /api/refresh-token
2. Validate token hiện tại với WordPress GraphQL:
   query TestToken {
     viewer { id, name, email }
   }
3. Response OK → Token vẫn valid
4. Lưu token hiện tại vào Redis (refresh TTL)
5. Return: { success: true, method: "token_still_valid" }
```

### **Scenario 2: Token hết hạn**

```
1. Cron job trigger → GET /api/refresh-token
2. Validate token → GraphQL error: "cannot be accessed without authentication"
3. Fallback: Login lại với WP_USER + WP_PASSWORD:
   mutation LoginUser {
     login(input: { username: "...", password: "..." }) {
       refreshToken
       user { email }
     }
   }
4. Nhận refreshToken mới (hết hạn sau 1 năm)
5. Lưu token mới vào Redis
6. Return: { 
     success: true, 
     method: "new_login",
     note: "⚠️ NEW TOKEN! Copy from logs..." 
   }
```

⚠️ **Quan trọng:** Khi có token mới, cần cập nhật `WORDPRESS_AUTH_REFRESH_TOKEN` trong Vercel Environment Variables để làm fallback cho lần sau.

## 🧪 Testing

### **Test Manual (với authorization)**

```bash
# Production
curl -H "Authorization: Bearer ido-cron-secret-2025" \
  https://idoarchitects-ver2.vercel.app/api/refresh-token

# Local Development
curl -H "Authorization: Bearer ido-cron-secret-2025" \
  http://localhost:3000/api/refresh-token
```

### **Test trong Vercel Dashboard**

1. Vào **Vercel Dashboard** → Project → **Cron Jobs**
2. Chọn `/api/refresh-token`
3. Click **"Run Now"**
4. Xem logs để kiểm tra kết quả

### **Test Token Expiration Scenario**

1. Tạm thời đổi `WORDPRESS_AUTH_REFRESH_TOKEN` thành giá trị fake:
   ```
   WORDPRESS_AUTH_REFRESH_TOKEN=FAKE_TOKEN_TEST
   ```

2. Gọi API refresh-token

3. Kiểm tra logs:
   ```
   🔍 Validating refreshToken...
   ⚠️ Token invalid or expired: Internal server error
   🔄 Token expired, logging in with credentials...
   ✅ Logged in successfully, user: ido.architectss@gmail.com
   ⚠️ IMPORTANT: New token generated...
   ✅ Token synced to Redis at: 2025-12-06T...
   ```

4. Đổi lại token thật

## 📊 Monitoring

### **Kiểm tra Cron Job Status**

**Vercel Dashboard:**
- Navigate to: Project → Cron Jobs
- Xem: Next run time, Last run status, Execution history

### **Kiểm tra Token trong Redis**

Token được lưu tại key: `wordpress_auth_token`

Có thể kiểm tra qua Upstash Dashboard hoặc tạo API endpoint debug (chỉ dùng local).

### **Logs**

Vercel Function Logs sẽ hiển thị:
- ✅ Token validation results
- 🔄 Login attempts
- ⚠️ Token generation events
- ❌ Errors

## 🚨 Troubleshooting

### **Lỗi: "Unauthorized" (401)**

**Nguyên nhân:** CRON_SECRET không khớp

**Giải pháp:**
1. Kiểm tra `CRON_SECRET` trong Vercel Environment Variables
2. Đảm bảo không có khoảng trắng thừa
3. Redeploy sau khi sửa

### **Lỗi: "Login failed"**

**Nguyên nhân:** WP_USER hoặc WP_PASSWORD sai

**Giải pháp:**
1. Kiểm tra credentials trong WordPress
2. Đảm bảo user có quyền GraphQL access
3. Kiểm tra WordPress setting: **Bỏ tích** "Restrict Endpoint to Authenticated Users"

### **Lỗi: "Failed to get token from Redis"**

**Nguyên nhân:** Redis credentials sai hoặc quota hết

**Giải pháp:**
1. Kiểm tra `KV_REST_API_URL` và `KV_REST_API_TOKEN`
2. Vào Upstash Dashboard kiểm tra database status
3. Kiểm tra free tier limits (10,000 commands/day)

### **Token không được refresh**

**Nguyên nhân:** Cron job không chạy

**Giải pháp:**
1. Kiểm tra Cron Jobs tab trong Vercel Dashboard
2. Verify feature "Cron Jobs" đang Enabled
3. Check "Next Run" timestamp
4. Thử "Run Now" manually

## 📝 Files liên quan

```
src/
├── app/
│   └── api/
│       └── refresh-token/
│           └── route.ts          # Cron job handler
├── lib/
│   ├── api.ts                    # FetchAPI - đọc token từ Redis
│   └── redis.ts                  # Redis client config
└── ...

vercel.json                        # Cron schedule config
.env.local                         # Local env variables (development)
```

## 🔗 Dependencies

- `@upstash/redis`: ^1.35.7 - REST API client cho Redis
- `next`: ^14.2.4 - App Router + API Routes
- Vercel Cron Jobs (built-in) - Không cần package thêm

## 📅 Schedule Recommendations

| Token Expiration | Recommended Schedule | Cron Expression | Mô tả |
|------------------|---------------------|-----------------|-------|
| 1 năm (hiện tại) | Mỗi 11 tháng | `0 0 1 */11 *` | Chạy trước hết hạn 1 tháng |
| 6 tháng | Mỗi 5 tháng | `0 0 1 */5 *` | Chạy trước hết hạn 1 tháng |
| 1 tháng | Mỗi 3 tuần | `0 0 * * 0` | Chạy mỗi Chủ Nhật |
| 1 tuần | Mỗi 5 ngày | `0 0 */5 * *` | Chạy mỗi 5 ngày |

## ✅ Checklist Deployment

- [ ] Environment variables đã thêm vào Vercel (tất cả environments)
- [ ] `vercel.json` có cron configuration
- [ ] CRON_SECRET đã được tạo và bảo mật
- [ ] WordPress setting "Restrict Endpoint" đã tắt
- [ ] Test manual API với Authorization header thành công
- [ ] Code đã push lên branch main/develop
- [ ] Vercel auto-deploy thành công
- [ ] Cron Jobs tab hiển thị job đã được tạo
- [ ] Test "Run Now" thành công
- [ ] Logs hiển thị token validation hoạt động
- [ ] Redis có token được lưu

## 🎯 Best Practices

1. **Security:**
   - ✅ Luôn dùng CRON_SECRET
   - ✅ Không log full token (chỉ 10 ký tự đầu)
   - ✅ Không expose Redis credentials

2. **Reliability:**
   - ✅ Fallback từ Redis → env variable
   - ✅ Fallback từ validate → login
   - ✅ Schedule trước thời gian hết hạn 1 tháng

3. **Monitoring:**
   - ✅ Check Vercel Cron Jobs tab định kỳ
   - ✅ Review Function Logs sau mỗi execution
   - ✅ Alert khi có errors liên tục

4. **Maintenance:**
   - ✅ Cập nhật WORDPRESS_AUTH_REFRESH_TOKEN khi có token mới
   - ✅ Review schedule khi WordPress thay đổi token expiration policy
   - ✅ Backup credentials trong password manager

## 📞 Support

Nếu gặp vấn đề, kiểm tra:
1. [Vercel Cron Jobs Documentation](https://vercel.com/docs/cron-jobs)
2. [Upstash Redis Documentation](https://upstash.com/docs/redis)
3. [WordPress GraphQL JWT Authentication](https://www.wpgraphql.com/docs/authentication-and-authorization)
4. Project logs trong Vercel Dashboard

---

**Last Updated:** December 6, 2025  
**Version:** 1.0  
**Author:** IDO Architects Development Team
