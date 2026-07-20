/*
  Warnings:

  - You are about to drop the column `userEmail` on the `Resume` table. All the data in the column will be lost.
  - You are about to drop the column `userName` on the `Resume` table. All the data in the column will be lost.
  - Added the required column `clerkUserId` to the `Resume` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Resume" DROP COLUMN "userEmail",
DROP COLUMN "userName",
ADD COLUMN     "clerkUserId" TEXT NOT NULL;
