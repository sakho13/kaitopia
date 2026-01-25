/*
  Warnings:

  - You are about to drop the column `firebase_uid` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `is_guest` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_firebase_uid_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "firebase_uid",
DROP COLUMN "is_guest";
