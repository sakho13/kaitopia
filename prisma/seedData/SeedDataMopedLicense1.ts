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
    random: true,
    questionCount: 50,
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
    {
      id: "moped_license_1_2",
      schoolId: "kaitopia_1",
      title: "二人乗り1",
      questionType: "TEXT",
      answerType: "SELECT",
      isPublished: true,
      currentVersionId: null,
      draftVersionId: null,
    },
    {
      id: "moped_license_1_3",
      schoolId: "kaitopia_1",
      title: "山道のカーブ1",
      questionType: "TEXT",
      answerType: "SELECT",
      isPublished: true,
      currentVersionId: null,
      draftVersionId: null,
    },
    {
      id: "moped_license_1_4",
      schoolId: "kaitopia_1",
      title: "服装1",
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
    {
      questionId: "moped_license_1_2",
      version: 1,
      content: "荷台のある原動機付自転車は、二人乗りができる。",
      hint: "そもそも原動機付自転車で二人乗りはできますか？",
    },
    {
      questionId: "moped_license_1_3",
      version: 1,
      content:
        "山道のカーブの手前では、速度を落とさなくても、惰力で通過すれば安全である。",
      hint: "カーブの手前で速度を落とす必要があるか考えてみましょう。",
    },
    {
      questionId: "moped_license_1_4",
      version: 1,
      content:
        "原動機付自転車は、手軽な乗り物であるが、転倒すると大怪我につながるので、長そでや長ズボンなど身体の露出が少ない複数がよい。",
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
    {
      questionId: "moped_license_1_2",
      version: 1,
      answerId: "1",
      selectContent: "正しい",
      isCorrect: false,
    },
    {
      questionId: "moped_license_1_2",
      version: 1,
      answerId: "2",
      selectContent: "誤り",
      isCorrect: true,
    },
    {
      questionId: "moped_license_1_3",
      version: 1,
      answerId: "1",
      selectContent: "正しい",
      isCorrect: false,
    },
    {
      questionId: "moped_license_1_3",
      version: 1,
      answerId: "2",
      selectContent: "誤り",
      isCorrect: true,
    },
    {
      questionId: "moped_license_1_4",
      version: 1,
      answerId: "1",
      selectContent: "正しい",
      isCorrect: true,
    },
    {
      questionId: "moped_license_1_4",
      version: 1,
      answerId: "2",
      selectContent: "誤り",
      isCorrect: false,
    },
  ] as QuestionAnswer[],

  questionCurrentVersion: [
    {
      questionId: "moped_license_1_1",
      version: 1,
    },
  ],
}
