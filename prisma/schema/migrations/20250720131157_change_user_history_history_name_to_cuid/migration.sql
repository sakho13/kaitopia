/*
  Warnings:

  - The primary key for the `UserHistory` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/

-- Step 1: 一時的なTEXTカラムを追加
ALTER TABLE "UserHistory" ADD COLUMN "history_no_tmp" TEXT;

-- Step 2: 既存のhistory_noの値をTEXT形式でhistory_no_tmpにコピー
UPDATE "UserHistory" SET "history_no_tmp" = "history_no"::TEXT;

-- Step 3: history_no_tmpにNOT NULL制約を追加
ALTER TABLE "UserHistory" ALTER COLUMN "history_no_tmp" SET NOT NULL;

-- Step 4: 既存の主キー制約を削除
ALTER TABLE "UserHistory" DROP CONSTRAINT "UserHistory_pkey";

-- Step 5: 古いhistory_noカラムを削除
ALTER TABLE "UserHistory" DROP COLUMN "history_no";

-- Step 6: history_no_tmpをhistory_noにリネーム
ALTER TABLE "UserHistory" RENAME COLUMN "history_no_tmp" TO "history_no";

-- Step 7: 新しい主キー制約を追加
ALTER TABLE "UserHistory" ADD CONSTRAINT "UserHistory_pkey" PRIMARY KEY ("user_id", "history_no");

-- Step 8: シーケンスを削除（もう不要）
DROP SEQUENCE IF EXISTS "UserHistory_history_no_seq";
