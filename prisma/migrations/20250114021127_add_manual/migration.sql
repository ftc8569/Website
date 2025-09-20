/*
  Warnings:

  - A unique constraint covering the columns `[manualId]` on the table `BlogPost` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "BlogPost" ADD COLUMN     "manualId" INTEGER,
ADD COLUMN     "manualOverride" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_manualId_key" ON "BlogPost"("manualId");
