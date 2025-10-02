-- CreateEnum
CREATE TYPE "CertificationRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "Certification" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Certification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CertificationRequest" (
    "id" TEXT NOT NULL,
    "certification_id" TEXT,
    "requested_name" TEXT NOT NULL,
    "requested_description" TEXT NOT NULL,
    "requested_by_user_id" TEXT NOT NULL,
    "status" "CertificationRequestStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "CertificationRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CertificationRequestVote" (
    "id" TEXT NOT NULL,
    "request_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CertificationRequestVote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Certification_name_key" ON "Certification"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CertificationRequestVote_request_id_user_id_key" ON "CertificationRequestVote"("request_id", "user_id");

-- AddForeignKey
ALTER TABLE "CertificationRequest" ADD CONSTRAINT "CertificationRequest_certification_id_fkey" FOREIGN KEY ("certification_id") REFERENCES "Certification"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CertificationRequest" ADD CONSTRAINT "CertificationRequest_requested_by_user_id_fkey" FOREIGN KEY ("requested_by_user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CertificationRequestVote" ADD CONSTRAINT "CertificationRequestVote_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "CertificationRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CertificationRequestVote" ADD CONSTRAINT "CertificationRequestVote_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
