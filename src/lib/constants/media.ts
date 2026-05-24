/** MIME types được phép upload */
export const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
] as const;

/** Kích thước tối đa: 10MB */
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

/** Số item mỗi trang trong admin media */
export const MEDIA_PAGE_SIZE = 24;
