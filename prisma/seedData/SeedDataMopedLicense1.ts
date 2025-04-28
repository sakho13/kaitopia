import {
  Exercise,
  Question,
  QuestionAnswer,
  QuestionVersion,
} from "@prisma/client"

export const SeedDataMopedLicense1 = {
  exercise: {
    id: "moped_license_1",
    title: "原付免許問題集1",
    schoolId: "kaitopia_1",
    description: "原付免許の問題集です。",
    isPublished: false,
  } as Exercise,

  questions: [
    {
      id: "moped_license_1_1",
      schoolId: "kaitopia_1",
      title: "踏切通過時の変速チェンジ1",
      questionType: "TEXT",
      answerType: "SELECT",
      isPublished: true,
      currentVersionId: null,
      draftVersionId: null,
    },
  ] as Question[],

  questionVersions: [
    {
      questionId: "moped_license_1_1",
      version: 1,
      content:
        "踏切は少しでも早く通過した方がよいので、スピードを上げ変速チェンジをして通過する。",
      hint: "変速チェンジすると何が起こる可能性があるか考えてみましょう。",
    },
  ] as QuestionVersion[],

  questionAnswers: [
    {
      questionId: "moped_license_1_1",
      version: 1,
      answerId: "1",
      selectContent: "正しい",
      isCorrect: false,
    },
    {
      questionId: "moped_license_1_1",
      version: 1,
      answerId: "2",
      selectContent: "誤り",
      isCorrect: true,
    },
  ] as QuestionAnswer[],

  questionCurrentVersion: [
    {
      questionId: "moped_license_1_1",
      version: 1,
    },
  ],
}
