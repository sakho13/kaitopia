import {
  Exercise,
  Question,
  QuestionAnswer,
  QuestionVersion,
} from "@prisma/client"

type QuestionTypeFor = {
  questionId: string
  title: string
  content: string
  hint?: string
  correct: boolean
}

const questionList: QuestionTypeFor[] = [
  {
    questionId: "moped_license_1_1",
    title: "踏切通過時の変速チェンジ1",
    content:
      "踏切は少しでも早く通過した方がよいので、スピードを上げ変速チェンジをして通過する。",
    hint: "変速チェンジすると何が起こる可能性があるか考えてみましょう。",
    correct: false,
  },
  {
    questionId: "moped_license_1_2",
    title: "二人乗り1",
    content: "荷台のある原動機付自転車は、二人乗りができる。",
    hint: "そもそも原動機付自転車で二人乗りはできますか？",
    correct: false,
  },
  {
    questionId: "moped_license_1_3",
    title: "山道のカーブ1",
    content:
      "山道のカーブの手前では、速度を落とさなくても、惰力で通過すれば安全である。",
    hint: "カーブの手前で速度を落とす必要があるか考えてみましょう。",
    correct: false,
  },
  {
    questionId: "moped_license_1_4",
    title: "服装1",
    content:
      "原動機付自転車は、手軽な乗り物であるが、転倒すると大怪我につながるので、長そでや長ズボンなど身体の露出が少ない複数がよい。",
    correct: true,
  },
  {
    questionId: "moped_license_1_5",
    title: "視界不良でライト点灯1",
    content:
      "昼間でも、トンネルの中や霧のために50メートル先が見えない場所を通行するときは、ライトを点灯しなければならない。",
    correct: true,
  },
  {
    questionId: "moped_license_1_6",
    title: "正面衝突しそうなとき1",
    content:
      "対向車と正面衝突しそうになったとき、道路外で危険な場所でない場合であっても、道路からでてはならない。",
    correct: false,
  },
  {
    questionId: "moped_license_1_7",
    title: "エンジン停止時の歩行者扱い1",
    content:
      "原動機付自転車のエンジンを止めて押して歩くときは歩行者として扱われるので、歩道を通行することができる。（牽引時を除く）",
    correct: true,
  },
  {
    questionId: "moped_license_1_8",
    title: "運転の頼み1",
    content:
      "免許を持たない人や酒気を帯びた人に、自動車や原動機付自転車の運転を頼んではいけない。",
    correct: true,
  },
  {
    questionId: "moped_license_1_9",
    title: "歩行者のそばを通るとき1",
    content: "歩行者のそばを通るときは、必ず徐行しなければならない。",
    hint: "「必ず」徐行しなければならないですか？",
    correct: false,
  },
  {
    questionId: "moped_license_1_10",
    title: "エンジンブレーキの制動効果1",
    content: "エンジンブレーキの制動効果は、低速ギアより高速ギアのほうが高い。",
    correct: false,
  },
  {
    questionId: "moped_license_1_11",
    title: "ブレーキの制動力1",
    content: "走行中、右にハンドルを切ると車には左に飛び出そうとする力が働く。",
    correct: true,
  },
]

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

  questions: questionList.map((q) => ({
    id: q.questionId,
    schoolId: "kaitopia_1",
    title: q.title,
    questionType: "TEXT",
    answerType: "SELECT",
    isPublished: true,
    currentVersionId: null,
    draftVersionId: null,
  })) as Question[],

  questionVersions: questionList.map((q) => ({
    questionId: q.questionId,
    version: 1,
    content: q.content,
    hint: q.hint,
  })) as QuestionVersion[],

  questionAnswers: questionList
    .map((q) => [
      {
        questionId: q.questionId,
        version: 1,
        answerId: "1",
        selectContent: "正しい",
        isCorrect: q.correct,
      },
      {
        questionId: q.questionId,
        version: 1,
        answerId: "2",
        selectContent: "誤り",
        isCorrect: !q.correct,
      },
    ])
    .flat() as QuestionAnswer[],

  questionCurrentVersion: [
    {
      questionId: "moped_license_1_1",
      version: 1,
    },
  ],
}
