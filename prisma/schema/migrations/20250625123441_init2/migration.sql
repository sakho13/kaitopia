-- CreateTable
CREATE TABLE "QuestionGroup" (
    "school_id" TEXT NOT NULL,
    "question_group_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "QuestionGroup_pkey" PRIMARY KEY ("school_id","question_group_id")
);

-- CreateTable
CREATE TABLE "QuestionGroupQuestion" (
    "school_id" TEXT NOT NULL,
    "question_group_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuestionGroupQuestion_pkey" PRIMARY KEY ("school_id","question_group_id","question_id")
);

-- AddForeignKey
ALTER TABLE "QuestionGroup" ADD CONSTRAINT "QuestionGroup_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionGroupQuestion" ADD CONSTRAINT "QuestionGroupQuestion_school_id_question_group_id_fkey" FOREIGN KEY ("school_id", "question_group_id") REFERENCES "QuestionGroup"("school_id", "question_group_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionGroupQuestion" ADD CONSTRAINT "QuestionGroupQuestion_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
