-next step: 
1. Làm breadcrum

https://dev.to/dan_starner/building-dynamic-breadcrumbs-in-nextjs-17oa

2. pagination - phân trang


3. yoats seo wpgraphql:
https://dev.to/franadev/seo-in-headless-wordpress-with-yoast-nextjs-and-wpgraphql-126e



4. prisma 
npm install prisma --save-dev


Các lệnh cơ bản
prisma init:

Khởi tạo một dự án Prisma mới.
Tạo file schema.prisma để định nghĩa schema của bạn.
Cài đặt các phụ thuộc cần thiết.

npx prisma generate

: Tạo Prisma Client dựa trên schema đã định nghĩa.
Prisma Client là một thư viện TypeScript cho phép bạn tương tác với database một cách type-safe và dễ dàng.

npx prisma studio:

Khởi chạy một giao diện đồ họa để trực quan hóa và tương tác với database của bạn.
Đây là một công cụ hữu ích để khám phá dữ liệu và thực hiện các truy vấn nhanh.
Các lệnh quản lý migration

npx prisma migrate dev:

Tạo một migration mới để thực hiện các thay đổi đối với schema.
Áp dụng migration vào database.
Thường được sử dụng trong môi trường phát triển.

prisma migrate deploy:

Tương tự như prisma migrate dev nhưng được sử dụng trong môi trường sản xuất.
Thường được tích hợp vào pipeline CI/CD.
prisma migrate reset:

Xoá tất cả các migration và đặt lại database về trạng thái ban đầu.
prisma migrate show:

Hiển thị danh sách các migration đã tạo.
Các lệnh khác
prisma introspect:

Tạo một schema Prisma dựa trên một database hiện có.
Hữu ích khi bạn muốn chuyển đổi một database hiện có sang sử dụng Prisma.
prisma format:

Định dạng lại file schema.prisma theo một style nhất định.

npx prisma db push:

Lưu ý: Lệnh này đã bị ngừng hỗ trợ. Thay vào đó, hãy sử dụng prisma migrate dev hoặc prisma migrate deploy.
Ví dụ