/*
  Warnings:

  - You are about to drop the column `company` on the `Contact` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "company",
ALTER COLUMN "message" DROP NOT NULL;
