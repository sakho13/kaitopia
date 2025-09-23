-- CreateEnum
CREATE TYPE "ProviderType" AS ENUM ('FIREBASE_GUEST', 'FIREBASE_EMAIL', 'FIREBASE_GOOGLE');

-- CreateTable
CREATE TABLE "AuthProvider" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "provider_type" "ProviderType" NOT NULL,
    "external_id" TEXT NOT NULL,
    "metadata" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuthProvider_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AuthProvider_user_id_is_active_idx" ON "AuthProvider"("user_id", "is_active");

-- CreateIndex
CREATE UNIQUE INDEX "AuthProvider_provider_type_external_id_key" ON "AuthProvider"("provider_type", "external_id");

-- AddForeignKey
ALTER TABLE "AuthProvider" ADD CONSTRAINT "AuthProvider_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Migrate existing user data to AuthProvider table
INSERT INTO "AuthProvider" ("id", "user_id", "provider_type", "external_id", "is_active", "created_at", "updated_at")
SELECT
    'auth_' || "User"."id" || '_' || EXTRACT(EPOCH FROM NOW())::text,
    "User"."id",
    CASE
        WHEN "User"."is_guest" = true THEN 'FIREBASE_GUEST'::"ProviderType"
        ELSE 'FIREBASE_EMAIL'::"ProviderType"
    END,
    "User"."firebase_uid",
    true,
    "User"."created_at",
    "User"."updated_at"
FROM "User"
WHERE "User"."firebase_uid" IS NOT NULL;
