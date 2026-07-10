-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "type" "PostType" NOT NULL DEFAULT 'BLOG_POST';

-- CreateIndex
CREATE INDEX "Category_type_idx" ON "Category"("type");
