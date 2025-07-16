-- CreateEnum
CREATE TYPE "UserHistoryActionType" AS ENUM ('QUIT', 'RE_JOIN');

-- CreateTable
CREATE TABLE "UserHistory" (
    "user_id" TEXT NOT NULL,
    "history_no" SERIAL NOT NULL,
    "action_type" "UserHistoryActionType" NOT NULL,
    "quit_code" TEXT,
    "quit_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserHistory_pkey" PRIMARY KEY ("user_id","history_no")
);

-- AddForeignKey
ALTER TABLE "UserHistory" ADD CONSTRAINT "UserHistory_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
