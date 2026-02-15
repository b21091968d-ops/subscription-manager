/*
  Warnings:

  - The primary key for the `Subscription` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `billingDay` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `billingPeriod` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Subscription` table. All the data in the column will be lost.
  - The `id` column on the `Subscription` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `billingCycle` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nextBillingDate` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_userId_fkey";

-- DropIndex
DROP INDEX "Subscription_userId_idx";

-- AlterTable
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_pkey",
DROP COLUMN "billingDay",
DROP COLUMN "billingPeriod",
DROP COLUMN "isActive",
DROP COLUMN "updatedAt",
ADD COLUMN     "billingCycle" TEXT NOT NULL,
ADD COLUMN     "nextBillingDate" TIMESTAMP(3) NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "currency" DROP DEFAULT,
ADD CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
