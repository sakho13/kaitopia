-- CreateEnum
CREATE TYPE "AuthProviderType" AS ENUM ('FIREBASE_GUEST', 'FIREBASE_EMAIL');

-- CreateTable
CREATE TABLE "AuthProvider" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "provider_type" "AuthProviderType" NOT NULL,
    "provider_uid" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "AuthProvider_provider_uid_provider_type_key" ON "AuthProvider"("provider_uid", "provider_type");

-- AddForeignKey
ALTER TABLE "AuthProvider" ADD CONSTRAINT "AuthProvider_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "firebase_uid";
ALTER TABLE "User" DROP COLUMN "is_guest";
