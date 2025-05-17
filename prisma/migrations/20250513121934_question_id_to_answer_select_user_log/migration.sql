ALTER TABLE "AnswerSelectUserLog" ADD COLUMN     "question_id" TEXT,
ADD COLUMN     "version" INTEGER;

UPDATE "AnswerSelectUserLog" AS asul
SET
  "question_id" = qul."question_id",
  "version" = qul."version"
FROM "QuestionUserLog" AS qul
WHERE asul."question_user_log_id" = qul."questionUserLogId";

ALTER TABLE "AnswerSelectUserLog" ALTER COLUMN "question_id" SET NOT NULL;
ALTER TABLE "AnswerSelectUserLog" ALTER COLUMN "version" SET NOT NULL;

/*
  Warnings:

  - Added the required column `question_id` to the `AnswerSelectUserLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `version` to the `AnswerSelectUserLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
-- ALTER TABLE "AnswerSelectUserLog" ADD COLUMN     "question_id" TEXT NOT NULL,
-- ADD COLUMN     "version" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "AnswerSelectUserLog" ADD CONSTRAINT "AnswerSelectUserLog_question_id_version_select_answer_id_fkey" FOREIGN KEY ("question_id", "version", "select_answer_id") REFERENCES "QuestionAnswer"("question_id", "version", "answer_id") ON DELETE CASCADE ON UPDATE CASCADE;
