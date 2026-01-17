# Phân Tích Lỗi Build Timeout Trên Vercel

**Ngày phân tích:** 7 tháng 12, 2025  
**Dự án:** idoarchitects_ver2  
**Nhánh:** feature/fix-deploy-vercel  
**Vercel Plan:** Hobby (Free Tier)

---

## 1. Tóm Tắt Lỗi

### Thông tin lỗi chính:
```
Error occurred prerendering page "/du-an"
TypeError: fetch failed
[cause]: AggregateError: code: 'ETIMEDOUT'
```

### Stack trace:
```javascript
at async cF (.next/server/chunks/ssr/src_lib_api_ts_b3f9cce5._.js:1:58830)
at async cG (.next/server/chunks/ssr/src_lib_api_ts_b3f9cce5._.js:1:59400)
at async e (.next/server/chunks/ssr/[root-of-the-server]__ed30ee78._.js:1:2699)
at async j (.next/server/chunks/ssr/[root-of-the-server]__425db0e4._.js:1:4633)
```

**Trang bị lỗi:** `/(dynamicPages)/du-an/page`  
**Mã lỗi:** `ETIMEDOUT`  
**Exit code:** 1

---

## 2. Phân Tích Chi Tiết

### 2.1 Nguyên Nhân Gốc Rễ

#### A. Network Timeout
- **Hiện tượng:** Fetch request đến WordPress GraphQL API không nhận được response trong thời gian cho phép
- **Code ETIMEDOUT:** Connection timeout, không phải request timeout
- **Vị trí:** `src/lib/api.ts` - hàm `FetchAPI()`

#### B. Vercel Hobby Plan Limitations
| Giới hạn | Hobby Plan | Pro Plan |
|----------|-----------|----------|
| **Serverless Function Timeout** | 10 giây | 60 giây |
| **Build Timeout** | 45 phút | 45 phút |
| **Edge Function Timeout** | N/A | 30 giây |
| **Bandwidth** | 100GB | 1TB |

**⚠️ Vấn đề:** Build time functions có thể bị giới hạn timeout ngầm khi fetch external API

---

## 6. So Sánh Giải Pháp: AWS vs Vercel Hobby

### 6.1 AWS Amplify

#### Ưu điểm:
- ✅ **Không giới hạn timeout** cho build process (mặc định 30 phút)
- ✅ **Control hoàn toàn** môi trường build (custom Docker image)
- ✅ **Free tier generous:** 1000 phút build/tháng
- ✅ **Tích hợp tốt** với AWS services (CloudFront CDN, S3)
- ✅ **Custom environment variables** không giới hạn
- ✅ **Build caching** tốt hơn (có thể custom)

#### Chi phí:
- Build: $0.01/phút build (sau 1000 phút miễn phí)
- Hosting: $0.15/GB served
- **Ước tính:** ~$5-10/tháng cho traffic nhỏ/trung bình

#### Setup:
```bash
# 1. Install Amplify CLI
npm install -g @aws-amplify/cli

# 2. Configure AWS credentials
amplify configure

# 3. Initialize project
amplify init

# 4. Add hosting
amplify add hosting
amplify publish
```

#### Build settings (amplify.yml):
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm install -g pnpm
        - pnpm install
    build:
      commands:
        - pnpm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```

---

### 6.2 AWS EC2 + PM2 (Self-hosted)

#### Ưu điểm:
- ✅ **Kiểm soát 100%** server và timeout
- ✅ **Không giới hạn** build time
- ✅ **Chi phí cố định** dễ dự đoán
- ✅ **Scale dễ dàng** khi traffic tăng
- ✅ **Access logs** đầy đủ

#### Chi phí:
- EC2 t3.small: ~$15/tháng (2 vCPU, 2GB RAM)
- EC2 t3.medium: ~$30/tháng (2 vCPU, 4GB RAM) - **Khuyên dùng**
- Bandwidth: Miễn phí 100GB/tháng, sau đó $0.09/GB

#### Setup:
```bash
# 1. Launch EC2 instance (Ubuntu 22.04)
# 2. Install Node.js & PM2
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2 pnpm

# 3. Clone & build
git clone <your-repo>
cd idoarchitects_ver2
pnpm install
pnpm run build

# 4. Start with PM2
pm2 start npm --name "idoarchitects" -- start
pm2 startup
pm2 save

# 5. Setup Nginx reverse proxy
sudo apt install nginx
# Configure nginx for port 80/443
```

#### Nginx config:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

### 6.3 AWS ECS Fargate (Container)

#### Ưu điểm:
- ✅ **Serverless container** - không quản lý EC2
- ✅ **Auto-scaling** tốt
- ✅ **CI/CD** tích hợp với CodePipeline
- ✅ **Zero downtime** deployment
- ✅ **Health checks** tự động

#### Chi phí:
- Fargate: ~$20-40/tháng (0.25 vCPU, 0.5GB RAM)
- Load Balancer: ~$16/tháng
- **Tổng:** ~$36-56/tháng

#### Dockerfile:
```dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm install -g pnpm && pnpm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

---

### 6.4 So Sánh Chi Phí & Features

| Tiêu chí | Vercel Hobby | Vercel Pro | AWS Amplify | AWS EC2 | AWS ECS |
|----------|--------------|------------|-------------|---------|---------|
| **Chi phí/tháng** | $0 | $20 | $5-10 | $15-30 | $36-56 |
| **Build timeout** | ~10s* | 60s | 30 phút | Không giới hạn | Không giới hạn |
| **Bandwidth** | 100GB | 1TB | Pay-as-go | 100GB free | Pay-as-go |
| **Custom domain** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **SSL/HTTPS** | ✅ Auto | ✅ Auto | ✅ Auto | ⚠️ Manual | ⚠️ Manual |
| **CI/CD** | ✅ Auto | ✅ Auto | ✅ Auto | ⚠️ Manual | ✅ CodePipeline |
| **Monitoring** | ⚠️ Limited | ✅ | ✅ CloudWatch | ✅ CloudWatch | ✅ CloudWatch |
| **Scale** | Auto | Auto | Auto | Manual | Auto |
| **Setup complexity** | ⭐ | ⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |

*Không có giới hạn chính thức nhưng observed behavior cho thấy timeout khoảng 10s cho external API calls

---

### 6.5 Khuyến Nghị Cho Dự Án idoarchitects_ver2

#### ✅ **Giải pháp ngắn hạn (1-2 tuần):**
**AWS EC2 t3.small** + PM2 + Nginx

**Lý do:**
- Chi phí thấp ($15/tháng)
- Setup nhanh (1-2 giờ)
- Không bị timeout
- Đủ performance cho giai đoạn đầu
- Dễ debug và monitor

**Các bước:**
1. Launch EC2 t3.small với Ubuntu 22.04
2. Setup Node.js 20 + PM2 + Nginx
3. Clone repo và build
4. Point domain DNS đến Elastic IP
5. Setup SSL với Let's Encrypt (certbot)

---

#### ✅ **Giải pháp dài hạn (khi scale):**
**AWS Amplify** hoặc **Upgrade Vercel Pro**

**Lý do chọn Amplify:**
- Tận dụng free tier (1000 phút build)
- Auto-scaling như Vercel
- Tích hợp tốt với AWS ecosystem
- Chi phí rẻ hơn Vercel Pro (~$5-10 vs $20)

**Lý do chọn Vercel Pro:**
- Nếu đã quen workflow Vercel
- DX (Developer Experience) tốt nhất
- Support tốt
- Analytics & monitoring built-in

---

### 6.6 Migration Plan: Vercel → AWS EC2

#### Phase 1: Chuẩn bị (30 phút)
```bash
# 1. Tạo Elastic IP trên AWS Console
# 2. Launch EC2 instance:
#    - AMI: Ubuntu 22.04 LTS
#    - Instance type: t3.small
#    - Storage: 20GB gp3
#    - Security Group: Allow 22, 80, 443
# 3. Associate Elastic IP với EC2
```

#### Phase 2: Setup môi trường (45 phút)
```bash
# SSH vào EC2
ssh -i your-key.pem ubuntu@<elastic-ip>

# Install dependencies
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs git nginx certbot python3-certbot-nginx
sudo npm install -g pm2 pnpm

# Clone repo (sử dụng deploy key hoặc personal access token)
git clone https://github.com/Vietphu1211/idoarchitects_ver2.git
cd idoarchitects_ver2

# Copy environment variables
nano .env.production.local
# Paste tất cả biến từ Vercel

# Build
pnpm install
pnpm run build
```

#### Phase 3: Deploy (30 phút)
```bash
# Start app với PM2
pm2 start npm --name "idoarchitects" -- start
pm2 startup
pm2 save

# Configure Nginx
sudo nano /etc/nginx/sites-available/idoarchitects
# Paste nginx config từ section 6.2

sudo ln -s /etc/nginx/sites-available/idoarchitects /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Setup SSL
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

#### Phase 4: DNS Migration (5 phút)
```
# Trong DNS provider (Cloudflare, Route53, etc.)
# Đổi A record từ Vercel IP sang AWS Elastic IP
A    @              <elastic-ip>    TTL 300
A    www            <elastic-ip>    TTL 300
```

#### Phase 5: Monitoring (15 phút)
```bash
# Setup CloudWatch agent (optional)
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i amazon-cloudwatch-agent.deb

# PM2 monitoring
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7

# Check logs
pm2 logs idoarchitects
pm2 monit
```

---

### 6.7 Chi Phí Ước Tính Chi Tiết

#### Scenario 1: Traffic thấp (< 10k visitors/tháng)
**AWS EC2 t3.small:**
- Instance: $0.0208/giờ × 730 giờ = $15.18/tháng
- Storage 20GB: $2/tháng
- Bandwidth: 100GB miễn phí
- **Tổng:** $17.18/tháng

**So với:**
- Vercel Hobby: $0 (nhưng bị timeout)
- Vercel Pro: $20/tháng

---

#### Scenario 2: Traffic trung bình (50k-100k visitors/tháng)
**AWS EC2 t3.medium:**
- Instance: $0.0416/giờ × 730 giờ = $30.37/tháng
- Storage 30GB: $3/tháng
- Bandwidth: ~200GB = $9/tháng (sau 100GB miễn phí)
- **Tổng:** $42.37/tháng

**AWS Amplify:**
- Build: ~100 phút = $0 (trong free tier)
- Hosting: ~200GB = $30/tháng
- **Tổng:** $30/tháng

**So với:**
- Vercel Pro: $20 + overage charges (~$40-50/tháng)

---

### 6.8 Checklist Trước Khi Migrate

- [ ] **Backup code:** Đảm bảo code đã push lên GitHub
- [ ] **Export env variables:** Download từ Vercel Dashboard
- [ ] **Test build local:** `pnpm run build` thành công
- [ ] **Note DNS settings:** Ghi lại current DNS config
- [ ] **Setup AWS account:** Tạo IAM user với đủ quyền
- [ ] **Generate SSH key:** Cho EC2 access
- [ ] **Buy domain (nếu chưa có):** Hoặc note DNS provider credentials
- [ ] **Plan downtime window:** Thường < 5 phút nếu migrate DNS

---

### 6.9 Troubleshooting AWS Deployment

#### Lỗi thường gặp:

**1. Port 3000 không accessible:**
```bash
# Check app đang chạy
pm2 status

# Check port binding
sudo netstat -tulpn | grep :3000

# Check firewall
sudo ufw status
sudo ufw allow 3000
```

**2. Nginx 502 Bad Gateway:**
```bash
# Check upstream (Next.js app)
curl http://localhost:3000

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log

# Restart services
pm2 restart idoarchitects
sudo systemctl restart nginx
```

**3. SSL certificate issues:**
```bash
# Renew certificate
sudo certbot renew --dry-run
sudo certbot renew

# Check certificate
sudo certbot certificates
```

**4. Out of memory:**
```bash
# Check memory usage
free -h
pm2 monit

# Add swap (temporary fix)
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Permanent: Upgrade to t3.medium
```

---

### 6.10 Kết Luận

**TL;DR:**
- ✅ **Migrate sang AWS EC2 t3.small là khả thi và được khuyên dùng**
- ✅ Chi phí tương đương Vercel Pro ($15-20/tháng)
- ✅ Không bị timeout, control hoàn toàn
- ✅ Setup time: 1-2 giờ
- ✅ Zero downtime migration với DNS switch

**Next steps:**
1. Tạo AWS account (nếu chưa có)
2. Follow migration plan Phase 1-5
3. Test thoroughly trước khi switch DNS
4. Monitor performance 24-48 giờ đầu
5. Scale up nếu cần (t3.medium)

---

## 7. Multi-Project Hosting trên AWS EC2

### 7.1 AWS EC2 t3.small Capacity

**Thông số kỹ thuật:**
- **CPU:** 2 vCPU (Intel Xeon hoặc AMD EPYC, burstable)
- **RAM:** 2GB
- **Network:** Up to 5 Gbps
- **Storage:** Tùy chỉnh (thường 20-30GB SSD)

**Khả năng chạy đa dự án:**

#### Scenario 1: Traffic thấp (< 5k visitors/tháng/site)
✅ **3-4 dự án Next.js** có thể chạy tốt

**Phân bổ resources:**
- Mỗi Next.js app: ~300-500MB RAM
- PM2 overhead: ~50-100MB
- System + Nginx: ~200-300MB
- **Tổng:** ~1.5-1.8GB (để lại buffer 200-500MB)

**Setup Nginx reverse proxy cho nhiều domain:**
```nginx
# Site 1: idoarchitects.com (Port 3000)
server {
    listen 80;
    server_name idoarchitects.com www.idoarchitects.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Site 2: project2.com (Port 3001)
server {
    listen 80;
    server_name project2.com www.project2.com;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Site 3: project3.com (Port 3002)
server {
    listen 80;
    server_name project3.com www.project3.com;
    
    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**PM2 ecosystem file:**
```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'idoarchitects',
      cwd: '/var/www/idoarchitects',
      script: 'npm',
      args: 'start',
      env: {
        PORT: 3000,
        NODE_ENV: 'production'
      },
      max_memory_restart: '400M'
    },
    {
      name: 'project2',
      cwd: '/var/www/project2',
      script: 'npm',
      args: 'start',
      env: {
        PORT: 3001,
        NODE_ENV: 'production'
      },
      max_memory_restart: '400M'
    },
    {
      name: 'project3',
      cwd: '/var/www/project3',
      script: 'npm',
      args: 'start',
      env: {
        PORT: 3002,
        NODE_ENV: 'production'
      },
      max_memory_restart: '400M'
    }
  ]
};

// Start tất cả:
// pm2 start ecosystem.config.js
```

---

#### Scenario 2: Traffic trung bình (10k-20k visitors/tháng/site)
⚠️ **2-3 dự án** (khuyên dùng 2)

**Lưu ý:**
- Memory pressure cao hơn
- CPU có thể throttle (burstable instance)
- Cần monitor chặt chẽ

**Optimization cần thiết:**
```javascript
// next.config.mjs - Giảm memory usage
const nextConfig = {
  // Reduce memory during build
  experimental: {
    workerThreads: false,
    cpus: 1
  },
  // Enable SWC minification (faster, less memory)
  swcMinify: true,
  // Compress responses
  compress: true,
  // Image optimization
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96],
    minimumCacheTTL: 60,
  }
};
```

---

#### Scenario 3: Traffic cao (> 50k visitors/tháng/site)
❌ **Không khuyên dùng t3.small**

**Nên upgrade lên:**
- **t3.medium** (2 vCPU, 4GB RAM) - 3-4 dự án traffic cao
- **t3.large** (2 vCPU, 8GB RAM) - 6-8 dự án
- Hoặc tách riêng mỗi dự án ra instance riêng

---

### 7.2 Monitoring & Resource Management

#### Kiểm tra resource usage:
```bash
# Memory usage
free -h
pm2 monit

# Disk usage
df -h

# CPU usage
top
htop  # nếu đã cài

# Per-app memory
pm2 list
pm2 show <app-name>

# Check logs
pm2 logs
pm2 logs <app-name> --lines 100
```

#### Setup alerts khi memory cao:
```bash
# Cài đặt PM2 monitoring
pm2 install pm2-logrotate

# Set max memory per app
pm2 start app.js --max-memory-restart 400M

# Auto restart nếu app crash
pm2 start app.js --exp-backoff-restart-delay=100
```

#### Thêm swap space (temporary solution):
```bash
# Tạo 2GB swap
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make permanent
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Check swap
swapon --show
free -h
```

---

### 7.3 Cost Breakdown Khi Chạy Nhiều Dự Án

#### 3 dự án trên t3.small:
- Instance: $15.18/tháng
- Storage: $2-3/tháng
- Bandwidth: ~150GB = $4.50/tháng (sau 100GB free)
- **Tổng:** ~$21.68/tháng
- **Chi phí/dự án:** ~$7.23/tháng

**So với Vercel:**
- 3 dự án × Vercel Pro: $60/tháng
- **Tiết kiệm:** $38.32/tháng (64%)

---

#### 2 dự án trên t3.small (an toàn hơn):
- Instance: $15.18/tháng
- Storage: $2/tháng
- Bandwidth: ~100GB = $0 (trong free tier)
- **Tổng:** ~$17.18/tháng
- **Chi phí/dự án:** ~$8.59/tháng

---

#### 4 dự án trên t3.medium (khuyên dùng nếu scale):
- Instance: $30.37/tháng
- Storage: $3/tháng
- Bandwidth: ~200GB = $9/tháng
- **Tổng:** ~$42.37/tháng
- **Chi phí/dự án:** ~$10.59/tháng

**So với Vercel:**
- 4 dự án × Vercel Pro: $80/tháng
- **Tiết kiệm:** $37.63/tháng (47%)

---

### 7.4 Best Practices Khi Chạy Multi-Project

#### 1. Folder structure:
```bash
/var/www/
├── idoarchitects/
│   ├── .next/
│   ├── node_modules/
│   ├── .env.production.local
│   └── package.json
├── project2/
│   ├── .next/
│   ├── node_modules/
│   ├── .env.production.local
│   └── package.json
└── project3/
    ├── .next/
    ├── node_modules/
    ├── .env.production.local
    └── package.json
```

#### 2. Deploy script cho mỗi dự án:
```bash
#!/bin/bash
# deploy.sh

PROJECT_NAME=$1
BRANCH=${2:-main}

cd /var/www/$PROJECT_NAME
git pull origin $BRANCH
pnpm install --production
pnpm run build
pm2 restart $PROJECT_NAME

echo "✅ Deployed $PROJECT_NAME from $BRANCH"
```

**Sử dụng:**
```bash
chmod +x deploy.sh
./deploy.sh idoarchitects main
./deploy.sh project2 develop
```

#### 3. Backup automation:
```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/home/ubuntu/backups"
DATE=$(date +%Y%m%d_%H%M%S)

for project in idoarchitects project2 project3; do
    tar -czf $BACKUP_DIR/${project}_${DATE}.tar.gz \
        /var/www/$project/.env.production.local \
        /var/www/$project/public
done

# Xóa backup cũ hơn 7 ngày
find $BACKUP_DIR -type f -mtime +7 -delete

echo "✅ Backup completed: $DATE"
```

**Crontab:**
```bash
# Backup hàng ngày lúc 2AM
0 2 * * * /home/ubuntu/backup.sh
```

#### 4. SSL cho nhiều domain:
```bash
# Certbot multi-domain
sudo certbot --nginx \
  -d idoarchitects.com -d www.idoarchitects.com \
  -d project2.com -d www.project2.com \
  -d project3.com -d www.project3.com

# Auto-renewal (certbot tự động setup cron)
sudo certbot renew --dry-run
```

#### 5. Firewall security:
```bash
# Chỉ mở port cần thiết
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable

# Fail2ban để chống brute force SSH
sudo apt install fail2ban
sudo systemctl enable fail2ban
```

---

### 7.5 Khi Nào Cần Scale Up/Out?

#### Scale Up (Vertical - Upgrade instance):
**Dấu hiệu:**
- ✅ Memory usage > 85% liên tục
- ✅ Swap usage > 500MB
- ✅ CPU throttling thường xuyên
- ✅ Response time tăng đáng kể

**Action:**
```bash
# Stop instance
aws ec2 stop-instances --instance-ids i-xxxxx

# Change instance type
aws ec2 modify-instance-attribute \
  --instance-id i-xxxxx \
  --instance-type t3.medium

# Start instance
aws ec2 start-instances --instance-ids i-xxxxx
```

**Downtime:** ~5 phút

---

#### Scale Out (Horizontal - Thêm instance):
**Dấu hiệu:**
- ✅ Traffic > 100k visitors/tháng/site
- ✅ Cần high availability (99.9% uptime)
- ✅ Multi-region deployment

**Setup Load Balancer:**
```bash
# Tạo Application Load Balancer
# Launch 2-3 EC2 instances giống nhau
# ALB sẽ distribute traffic

# Cost: ALB ~$16/tháng + EC2 instances
```

---

### 7.6 Alternative: Docker Compose cho Multi-Project

**Advantages:**
- ✅ Isolated environments
- ✅ Easy port management
- ✅ Simple deployment
- ✅ Resource limits per container

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  idoarchitects:
    build: ./idoarchitects
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: always
    mem_limit: 400m
    cpus: 0.5

  project2:
    build: ./project2
    ports:
      - "3001:3000"
    environment:
      - NODE_ENV=production
    restart: always
    mem_limit: 400m
    cpus: 0.5

  project3:
    build: ./project3
    ports:
      - "3002:3000"
    environment:
      - NODE_ENV=production
    restart: always
    mem_limit: 400m
    cpus: 0.5

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./certs:/etc/nginx/certs
    depends_on:
      - idoarchitects
      - project2
      - project3
    restart: always
```

**Deploy:**
```bash
docker-compose up -d
docker-compose ps
docker-compose logs -f
```

---

### 7.7 Tổng Kết: Số Dự Án Tối Ưu

| Instance Type | RAM | Số dự án khuyên dùng | Traffic/dự án | Chi phí/dự án |
|---------------|-----|---------------------|---------------|---------------|
| **t3.micro** | 1GB | 1-2 | < 5k/tháng | $5-8 |
| **t3.small** | 2GB | **2-3** ⭐ | 5k-15k/tháng | **$6-9** |
| **t3.medium** | 4GB | 3-5 | 15k-50k/tháng | $8-12 |
| **t3.large** | 8GB | 6-8 | 50k-100k/tháng | $10-15 |

**Khuyến nghị cho dự án hiện tại:**
- ✅ **t3.small với 2 dự án** là sweet spot
- ✅ Để lại buffer cho traffic spike
- ✅ Monitor và scale khi cần

**Chi phí so sánh:**
- 2 dự án trên t3.small: **~$17/tháng** (~$8.5/dự án)
- 2 dự án Vercel Pro: **$40/tháng** ($20/dự án)
- **Tiết kiệm: 57%** 💰

#### C. WordPress API Response Time
- **URL:** `https://ido-architects.io/graphql`
- **Test từ local:** API phản hồi bình thường (~1-2 giây)
- **Test từ Vercel:** Timeout sau ~50 giây
- **Sự khác biệt:** Network latency từ Vercel datacenter (Washington DC) đến WordPress server

### 2.2 Flow Gây Lỗi

```mermaid
graph TD
    A[Vercel Build Start] --> B[Next.js Prerendering]
    B --> C[/du-an/page.tsx]
    C --> D[Call allPortfolios()]
    D --> E[datafromWP.ts]
    E --> F[FetchAPI in api.ts]
    F --> G{Fetch WordPress API}
    G -->|Success < 50s| H[Build Success]
    G -->|Timeout > 50s| I[ETIMEDOUT Error]
    I --> J[Build Failed]
```

### 2.3 File Liên Quan

#### 1. `src/app/(dynamicPages)/du-an/page.tsx`
```typescript
export default async function PortfolioPage() {
    const portfolios = await allPortfolios();  // ← Gọi API
    const porfolioCategoryArray = await allPortfolioCategories();  // ← Gọi API
    return (...)
}
```
**Vấn đề:** Page này được prerender lúc build time → fetch API bị timeout

#### 2. `src/data/datafromWP.ts`
```typescript
export const allPortfolios = async () => {
    const data = await FetchAPI(/* GraphQL query */);
    // Xử lý data
}
```
**Vấn đề:** Hàm này được gọi trong build time, không có error handling cho timeout

#### 3. `src/lib/api.ts`
```typescript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 50000); // 50 giây

const res = await fetch(API_URL, {
    signal: controller.signal,
    // ...
});
```
**Vấn đề:** 
- Timeout 50 giây quá lâu cho Vercel Hobby plan
- Không có retry logic
- Không có fallback khi timeout

---

## 3. Các Trang Bị Ảnh Hưởng

### Static Generated Pages (SSG) - Bị timeout lúc build:
1. ✅ **Homepage** (`/`) - Fetch: posts, portfolios, services
2. ❌ **Du-an** (`/du-an/page.tsx`) - **FAILED HERE**
3. ❌ **Du-an-da-hoan-thien** (`/du-an-da-hoan-thien/page.tsx`)
4. ❌ **Du-an-noi-bat** (`/du-an-noi-bat/page.tsx`)
5. ❌ **Blog** (`/blog/page.tsx`)
6. ❌ **Gioi-thieu** (`/gioi-thieu/page.tsx`)
7. ❌ **Cac-dich-vu/[id]** (`/cac-dich-vu/[id]/page.tsx`)

### Dynamic Routes với generateStaticParams:
8. ❌ **Blog posts** (`/blog/[post]/page.tsx`)
9. ❌ **Portfolio details** (`/du-an/[portfolio]/page.tsx`)

### Sitemap Routes:
10. ❌ **Blog sitemap** (`/blog/sitemap.ts`)
11. ❌ **Portfolio sitemap** (`/du-an/sitemap.ts`)

**Tổng:** 11/20+ pages cần fetch WordPress API lúc build

---

## 4. Timeline Lỗi

### Build Process Timeline:
```
12:53:25 - Start build
12:53:27 - Turbopack compilation
12:53:42 - TypeScript check ✓
12:53:50 - Start collecting page data
12:53:51 - Attempt 1/3 failed
12:53:52 - Attempt 2/3 failed
12:53:55 - Attempt 3/3 failed
12:53:55 - Error: generateStaticParams timeout
12:54:00 - Multiple pages timeout
12:54:04 - /du-an FAILED (final error)
```

**Thời gian từ bắt đầu fetch đến lỗi:** ~4-5 giây  
**Thời gian retry logic:** 3 attempts × ~1.2 giây = 3.6 giây  
**⚠️ Lưu ý:** Lỗi xảy ra NHANH hơn timeout 50s được cấu hình → Network connection failed

---

## 5. So Sánh Local vs Vercel

| Aspect | Local Build | Vercel Build |
|--------|-------------|--------------|
| **Network** | LAN/Home ISP | AWS/Vercel Datacenter |
| **Location** | Vietnam | Washington DC (iad1) |
| **WordPress API** | ~1-2s response | Connection timeout |
| **Build time** | 3-4 giây (Turbopack) | 14-15 giây compile |
| **Success rate** | 100% | 0% (all timeout) |
| **Environment vars** | .env.local | Vercel Dashboard |

**Kết luận:** WordPress server có thể:
- Block IP từ Vercel datacenter
- Rate limiting requests từ AWS
- Firewall/WAF blocking automated requests
- Slow response từ shared hosting

---

## 6. Giả Thuyết Nguyên Nhân

### Giả thuyết 1: WordPress Hosting Firewall ⭐⭐⭐⭐⭐
**Độ ưu tiên:** CAO  
**Bằng chứng:**
- API hoạt động bình thường từ local (Vietnam)
- Timeout ngay lập tức từ Vercel (USA)
- Trước đây deploy thành công → có thể firewall rules mới

**Giải pháp:**
- Whitelist Vercel IP ranges: `76.76.21.0/24`, `76.223.0.0/20`
- Kiểm tra Cloudflare/security plugin settings
- Tắt rate limiting cho `/graphql` endpoint

### Giả thuyết 2: Rate Limiting ⭐⭐⭐⭐
**Độ ưu tiên:** TRUNG BÌNH  
**Bằng chứng:**
- Multiple concurrent requests lúc build
- 11+ pages fetch API cùng lúc
- Shared hosting có giới hạn concurrent connections

**Giải pháp:**
- Giảm số lượng pages generate lúc build
- Sequential fetching thay vì parallel
- Cache responses giữa các pages

### Giả thuyết 3: Vercel Hobby Timeout ⭐⭐⭐
**Độ ưu tiên:** TRUNG BÌNH  
**Bằng chứng:**
- 10s function timeout
- Build timeout không được document rõ
- Timeout xảy ra nhanh (~5s)

**Giải pháp:**
- Upgrade Vercel Pro plan ($20/tháng)
- Disable SSG, dùng ISR (Incremental Static Regeneration)
- Dynamic rendering cho các pages phức tạp

### Giả thuyết 4: DNS/Network Issues ⭐⭐
**Độ ưu tiên:** THẤP  
**Bằng chứng:**
- Lỗi ETIMEDOUT = connection timeout
- Không phải request timeout
- Có thể DNS resolution failed

**Giải pháp:**
- Dùng IP thay vì domain
- Thêm custom DNS resolver
- Test từ Vercel edge functions

### Giả thuyết 5: WordPress Plugin Conflicts ⭐
**Độ ưu tiên:** THẤP  
**Bằng chứng:**
- WPGraphQL + JWT Auth plugins
- Có thể conflict với security plugins

**Giải pháp:**
- Review plugin settings
- Test với minimal plugins
- Check error logs trên WordPress

---

## 7. Dữ Liệu Kỹ Thuật

### Request Headers từ Vercel:
```javascript
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <JWT_TOKEN_FROM_REDIS>",
  "User-Agent": "Next.js Static Site Generator"
}
```

### WordPress GraphQL Query (ví dụ):
```graphql
query GetAllPortfolios {
  portfolios(first: 100, where: {orderby: {field: DATE, order: DESC}}) {
    nodes {
      id
      title
      slug
      date
      excerpt
      featuredImage {
        node {
          sourceUrl
        }
      }
      tags {
        nodes {
          name
        }
      }
    }
  }
}
```

### AbortController Config:
```typescript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 50000); // 50s

try {
  const res = await fetch(API_URL, {
    signal: controller.signal,
    next: { revalidate: 120 }
  });
} catch (error) {
  // Error: ETIMEDOUT
}
```

---

## 8. Environment Variables

### Required on Vercel:
```bash
NEXT_PUBLIC_WORDPRESS_API_URL=https://ido-architects.io/graphql
WORDPRESS_AUTH_REFRESH_TOKEN=eyJ0eXAiOiJKV1Qi... (288 chars)
WP_USER=ido.architectss@gmail.com
WP_PASSWORD=Idoarchitects93@
KV_REST_API_URL=https://shining-octopus-22617.upstash.io
KV_REST_API_TOKEN=AVhZAAInc...
CRON_SECRET=ido-cron-secret-2025
```

**✅ Status:** All variables đã được set trên Vercel Dashboard (verified via `vercel env pull`)

---

## 9. Thử Nghiệm Đã Thực Hiện

### ✅ Thử nghiệm 1: Tăng timeout
- **Code:** Tăng từ 50s lên 60s, 120s
- **Kết quả:** FAILED - vẫn timeout
- **Kết luận:** Không phải vấn đề timeout duration

### ✅ Thử nghiệm 2: Thêm retry logic
- **Code:** 3 attempts với exponential backoff
- **Kết quả:** FAILED - cả 3 attempts đều timeout
- **Kết luận:** Network connection issue

### ✅ Thử nghiệm 3: Disable generateStaticParams
- **Code:** Comment out generateStaticParams, thêm `dynamic = 'force-dynamic'`
- **Kết quả:** FAILED - homepage và /du-an vẫn timeout
- **Kết luận:** Không chỉ generateStaticParams, mà cả page rendering

### ✅ Thử nghiệm 4: Disable sitemaps
- **Code:** Rename sitemap.ts → sitemap.ts.disabled
- **Kết quả:** FAILED - /du-an page vẫn timeout
- **Kết luận:** Sitemap không phải nguyên nhân chính

### ❌ Thử nghiệm 5: Test API từ Vercel serverless
- **Status:** CHƯA THỰC HIỆN
- **Plan:** Deploy một edge function để test connectivity

### ❌ Thử nghiệm 6: Whitelist Vercel IPs
- **Status:** CHƯA THỰC HIỆN (không có quyền truy cập WordPress hosting)
- **Plan:** Liên hệ WordPress admin

---

## 10. Khuyến Nghị Giải Pháp

### 🔴 Giải pháp ngắn hạn (Immediate - 1-2 giờ)

#### Option 1: Disable SSG hoàn toàn ⭐⭐⭐⭐⭐
**Ưu điểm:**
- Build sẽ pass ngay lập tức
- Deploy thành công
- Pages vẫn hoạt động (SSR at runtime)

**Nhược điểm:**
- Performance giảm (không có pre-generated HTML)
- Tốn Vercel function invocations
- First-load chậm hơn

**Implementation:**
```typescript
// Thêm vào tất cả pages fetch WordPress API
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // 1 hour cache
```

#### Option 2: Mock data cho build time ⭐⭐⭐⭐
**Ưu điểm:**
- Build pass
- Pages có content cơ bản
- Dữ liệu thật fetch at runtime

**Nhược điểm:**
- Phải maintain mock data
- SEO kém hơn (initial HTML không có data thật)

**Implementation:**
```typescript
// src/data/mockedData/portfolios.ts
export const MOCK_PORTFOLIOS = [...];

// src/data/datafromWP.ts
export const allPortfolios = async () => {
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return MOCK_PORTFOLIOS; // Use mock in build
  }
  return await FetchAPI(...); // Real data at runtime
}
```

### 🟡 Giải pháp trung hạn (1-3 ngày)

#### Option 3: Whitelist Vercel IPs trên WordPress ⭐⭐⭐⭐⭐
**Ưu điểm:**
- Giữ nguyên kiến trúc SSG
- Performance tốt nhất
- SEO tốt

**Nhược điểm:**
- Cần access WordPress hosting
- Có thể cần upgrade hosting plan

**Implementation:**
1. Login WordPress hosting control panel
2. Firewall → Add IP allowlist:
   - `76.76.21.0/24`
   - `76.223.0.0/20`
3. Security plugins → Disable rate limiting cho `/graphql`
4. Cloudflare → Add firewall rule allow Vercel IPs

#### Option 4: Cached Build Strategy ⭐⭐⭐⭐
**Ưu điểm:**
- Giảm số API calls
- Build nhanh hơn
- Fallback khi API unavailable

**Nhược điểm:**
- Phức tạp hơn
- Cần Redis/cache layer

**Implementation:**
```typescript
// Fetch once, cache, reuse for all pages
const cachedData = await redis.get('build_cache_portfolios');
if (cachedData) return cachedData;

const freshData = await FetchAPI(...);
await redis.set('build_cache_portfolios', freshData, { ex: 300 });
return freshData;
```

### 🟢 Giải pháp dài hạn (1-2 tuần)

#### Option 5: Upgrade Vercel Pro Plan ⭐⭐⭐
**Chi phí:** $20/tháng  
**Ưu điểm:**
- 60s function timeout
- Better performance
- More bandwidth

**Nhược điểm:**
- Tốn tiền
- Vẫn có thể timeout nếu API quá chậm

#### Option 6: Migrate WordPress sang VPS ⭐⭐⭐⭐⭐
**Chi phí:** $5-10/tháng  
**Ưu điểm:**
- Full control
- Better performance
- No firewall issues
- Có thể optimize database

**Nhược điểm:**
- Cần maintain server
- Migration effort

#### Option 7: Headless CMS Alternative ⭐⭐⭐⭐
**Options:** Strapi, Contentful, Sanity  
**Ưu điểm:**
- Better API performance
- Built for headless
- No WordPress overhead

**Nhược điểm:**
- Migration effort lớn
- Học curve mới
- Có thể tốn tiền

---

## 11. Action Items

### ✅ Đã hoàn thành:
- [x] Phân tích lỗi chi tiết
- [x] Test local build
- [x] Verify environment variables
- [x] Test WordPress API từ local
- [x] Document tất cả thử nghiệm

### 🔄 Đang thực hiện:
- [ ] Tạo branch `feature/fix-deploy-vercel`
- [ ] Document giải pháp

### ⏳ Chờ quyết định:
- [ ] Chọn giải pháp phù hợp (Option 1-7)
- [ ] Test giải pháp được chọn
- [ ] Deploy và verify

---

## 12. Metrics & Monitoring

### Cần theo dõi:
- Build time trên Vercel
- API response time từ Vercel
- Error rate trong Vercel logs
- WordPress server logs
- Redis cache hit rate

### Setup monitoring:
```typescript
// src/lib/api.ts
const startTime = Date.now();
try {
  const res = await fetch(...);
  console.log(`API call took ${Date.now() - startTime}ms`);
} catch (error) {
  console.error(`API failed after ${Date.now() - startTime}ms`, error);
}
```

---

## 13. References

- Next.js Prerender Error: https://nextjs.org/docs/messages/prerender-error
- Vercel Limits (Hobby): https://vercel.com/docs/limits/overview#hobby
- Vercel IP Ranges: https://vercel.com/docs/edge-network/regions#ip-addresses
- WPGraphQL Documentation: https://www.wpgraphql.com/
- Upstash Redis: https://upstash.com/docs/redis

---

**Người phân tích:** GitHub Copilot  
**Lần cập nhật cuối:** 7/12/2025  
**Version:** 1.0
