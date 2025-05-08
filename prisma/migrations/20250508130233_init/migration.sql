-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'MODERATOR', 'TEACHER', 'ADMIN');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('TEXT', 'IMAGE', 'VIDEO', 'AUDIO');

-- CreateEnum
CREATE TYPE "AnswerType" AS ENUM ('SELECT', 'MULTI_SELECT', 'TEXT');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "firebase_uid" TEXT NOT NULL,
    "is_guest" BOOLEAN NOT NULL DEFAULT false,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone_number" TEXT,
    "birth_day_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "School" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "is_self_school" BOOLEAN NOT NULL DEFAULT false,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "is_global" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "School_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchoolOwner" (
    "school_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "priority" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "SchoolOwner_pkey" PRIMARY KEY ("school_id","user_id")
);

-- CreateTable
CREATE TABLE "SchoolMember" (
    "school_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "limitAt" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SchoolMember_pkey" PRIMARY KEY ("school_id","user_id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "question_type" "QuestionType" NOT NULL,
    "answer_type" "AnswerType" NOT NULL,
    "current_version" INTEGER,
    "draft_version" INTEGER,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionVersion" (
    "question_id" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "content" TEXT NOT NULL,
    "hint" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuestionVersion_pkey" PRIMARY KEY ("question_id","version")
);

-- CreateTable
CREATE TABLE "QuestionAnswer" (
    "question_id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "answer_id" TEXT NOT NULL,
    "select_content" TEXT,
    "is_correct" BOOLEAN DEFAULT false,
    "min_length" INTEGER,
    "max_length" INTEGER,

    CONSTRAINT "QuestionAnswer_pkey" PRIMARY KEY ("question_id","version","answer_id")
);

-- CreateTable
CREATE TABLE "Exercise" (
    "id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "is_can_skip" BOOLEAN NOT NULL DEFAULT false,
    "is_scoring_batch" BOOLEAN NOT NULL DEFAULT false,
    "random" BOOLEAN NOT NULL DEFAULT false,
    "question_count" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExerciseQuestion" (
    "exercise_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExerciseQuestion_pkey" PRIMARY KEY ("exercise_id","question_id")
);

-- CreateTable
CREATE TABLE "AnswerLogSheet" (
    "user_id" TEXT NOT NULL,
    "answerLogSheetId" TEXT NOT NULL,
    "is_in_progress" BOOLEAN NOT NULL DEFAULT false,
    "total_correct_count" INTEGER NOT NULL DEFAULT 0,
    "total_incorrect_count" INTEGER NOT NULL DEFAULT 0,
    "total_unanswered_count" INTEGER NOT NULL DEFAULT 0,
    "exercise_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnswerLogSheet_pkey" PRIMARY KEY ("user_id","answerLogSheetId")
);

-- CreateTable
CREATE TABLE "QuestionUserLog" (
    "questionUserLogId" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "answer_log_sheet_id" TEXT NOT NULL,
    "order_index" INTEGER NOT NULL DEFAULT 1,
    "question_id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "is_answered" BOOLEAN NOT NULL DEFAULT false,
    "skipped" BOOLEAN NOT NULL DEFAULT false,
    "select_answer_order_id" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "is_correct" BOOLEAN NOT NULL DEFAULT false,
    "score" INTEGER NOT NULL DEFAULT 0,
    "text_answer" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuestionUserLog_pkey" PRIMARY KEY ("questionUserLogId")
);

-- CreateTable
CREATE TABLE "AnswerSelectUserLog" (
    "answer_select_user_log_id" TEXT NOT NULL,
    "question_user_log_id" TEXT NOT NULL,
    "select_answer_id" TEXT NOT NULL,
    "is_correct" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnswerSelectUserLog_pkey" PRIMARY KEY ("answer_select_user_log_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_firebase_uid_key" ON "User"("firebase_uid");

-- CreateIndex
CREATE UNIQUE INDEX "Question_id_current_version_key" ON "Question"("id", "current_version");

-- CreateIndex
CREATE UNIQUE INDEX "Question_id_draft_version_key" ON "Question"("id", "draft_version");

-- AddForeignKey
ALTER TABLE "SchoolOwner" ADD CONSTRAINT "SchoolOwner_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolOwner" ADD CONSTRAINT "SchoolOwner_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolMember" ADD CONSTRAINT "SchoolMember_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolMember" ADD CONSTRAINT "SchoolMember_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_id_current_version_fkey" FOREIGN KEY ("id", "current_version") REFERENCES "QuestionVersion"("question_id", "version") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_id_draft_version_fkey" FOREIGN KEY ("id", "draft_version") REFERENCES "QuestionVersion"("question_id", "version") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionVersion" ADD CONSTRAINT "QuestionVersion_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionAnswer" ADD CONSTRAINT "QuestionAnswer_question_id_version_fkey" FOREIGN KEY ("question_id", "version") REFERENCES "QuestionVersion"("question_id", "version") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseQuestion" ADD CONSTRAINT "ExerciseQuestion_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseQuestion" ADD CONSTRAINT "ExerciseQuestion_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnswerLogSheet" ADD CONSTRAINT "AnswerLogSheet_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "Exercise"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionUserLog" ADD CONSTRAINT "QuestionUserLog_question_id_version_fkey" FOREIGN KEY ("question_id", "version") REFERENCES "QuestionVersion"("question_id", "version") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionUserLog" ADD CONSTRAINT "QuestionUserLog_user_id_answer_log_sheet_id_fkey" FOREIGN KEY ("user_id", "answer_log_sheet_id") REFERENCES "AnswerLogSheet"("user_id", "answerLogSheetId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnswerSelectUserLog" ADD CONSTRAINT "AnswerSelectUserLog_question_user_log_id_fkey" FOREIGN KEY ("question_user_log_id") REFERENCES "QuestionUserLog"("questionUserLogId") ON DELETE CASCADE ON UPDATE CASCADE;
