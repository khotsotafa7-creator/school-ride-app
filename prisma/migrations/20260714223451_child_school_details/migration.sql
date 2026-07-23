/*
  Warnings:

  - You are about to drop the column `schoolId` on the `Child` table. All the data in the column will be lost.
  - Added the required column `postalCode` to the `Child` table without a default value. This is not possible if the table is not empty.
  - Added the required column `schoolAddress` to the `Child` table without a default value. This is not possible if the table is not empty.
  - Added the required column `schoolCity` to the `Child` table without a default value. This is not possible if the table is not empty.
  - Added the required column `schoolName` to the `Child` table without a default value. This is not possible if the table is not empty.
  - Added the required column `schoolProvince` to the `Child` table without a default value. This is not possible if the table is not empty.
  - Added the required column `schoolSuburb` to the `Child` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Child" DROP CONSTRAINT "Child_schoolId_fkey";

-- DropIndex
DROP INDEX "Child_schoolId_idx";

-- AlterTable
ALTER TABLE "Child" DROP COLUMN "schoolId",
ADD COLUMN     "postalCode" TEXT NOT NULL,
ADD COLUMN     "schoolAddress" TEXT NOT NULL,
ADD COLUMN     "schoolCity" TEXT NOT NULL,
ADD COLUMN     "schoolName" TEXT NOT NULL,
ADD COLUMN     "schoolProvince" TEXT NOT NULL,
ADD COLUMN     "schoolSuburb" TEXT NOT NULL;
