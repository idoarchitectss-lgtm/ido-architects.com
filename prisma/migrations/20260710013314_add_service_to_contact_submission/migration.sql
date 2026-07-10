-- AlterTable
ALTER TABLE "ContactSubmission" ADD COLUMN     "serviceId" TEXT;

-- CreateIndex
CREATE INDEX "ContactSubmission_serviceId_idx" ON "ContactSubmission"("serviceId");

-- AddForeignKey
ALTER TABLE "ContactSubmission" ADD CONSTRAINT "ContactSubmission_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;
