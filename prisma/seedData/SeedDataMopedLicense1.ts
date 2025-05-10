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
  {
    questionId: "moped_license_1_12",
    title: "天候による運転1",
    content:
      "雨の日は視界が悪く路面がすべりやすいので、晴れの日よりも速度を落とし、車間距離をおおめにとって運転することが大切である。",
    hint: "車間距離をおおめにとる理由を考えてみましょう。",
    correct: true,
  },
  {
    questionId: "moped_license_1_13",
    title: "運転中の携帯電話1",
    content:
      "携帯電話は、運転する前に電源をきるか、ドライブモードに設定して、呼び出し音がならないようにしておく。",
    hint: "運転中に呼び出し音がなると、あなたはどうしますか？",
    correct: true,
  },
  {
    questionId: "moped_license_1_14",
    title: "二輪車の特性1",
    content:
      "二輪車は、身体で安定を保ちながら走り、停止すれば安定を失うという構造上の特性があり、これが四輪車と根本的に違うところである。",
    correct: true,
  },
  {
    questionId: "moped_license_1_15",
    title: "運転前のタイヤ点検1",
    content:
      "タイヤの点検は、空気圧、亀裂や損傷、クギや石などの異物の有無、異常な摩擦、溝の深さなどを点検する。",
    correct: true,
  },
  {
    questionId: "moped_license_1_16",
    title: "自分本位の運転1",
    content:
      "交通規則にないことは運転者の自由であるから、自分本位の判断で運転してもよい。",
    correct: false,
  },
  {
    questionId: "moped_license_1_17",
    title: "カーブの運転1",
    content: "二輪車でカーブを曲がるときは、車体をカーブの外側に傾ける。",
    correct: false,
  },
  {
    questionId: "moped_license_1_18",
    title: "かもしれない運転1",
    content:
      "運転中は「大丈夫だろう」と自分に都合よく考えず「ひょっとしたら危ないかもしれない」と考え運転するほうが安全である。",
    correct: true,
  },
  {
    questionId: "moped_license_1_19",
    title: "右左折の合図1",
    content: "右折や左折の合図は、右折や左折をしようとする3秒前に出す。",
    hint: "車線変更の合図と右左折の合図のタイミングは同じですか？",
    correct: false,
  },
  {
    questionId: "moped_license_1_20",
    title: "後退の禁止1",
    content:
      "標識や標示によって横断や転回が禁止されているところでは、後退も禁止されている。",
    hint: "「後退」は禁止されていますか？",
    correct: false,
  },
  {
    questionId: "moped_license_1_21",
    title: "危険防止のための警音器1",
    content:
      "霧が発生したときは、危険を防止するために、必要に応じて警音器を使用するとよい。",
    correct: true,
  },
  {
    questionId: "moped_license_1_22",
    title: "ブレーキのかけ方1",
    content:
      "原動機付自転車のブレーキは、やむを得ない場合を除き、はじめはやわらかく、その後必要な強さまで徐々にかけていくのがよい。",
    correct: true,
  },
  {
    questionId: "moped_license_1_23",
    title: "対向車の死角1",
    content: "対向車によってできる死角は、対向車が接近するほど大きくなる。",
    correct: true,
  },
  {
    questionId: "moped_license_1_24",
    title: "半ヘルメット1",
    content:
      "原動機付自転車を運転するときのヘルメットは、工事用安全帽（通称、半ヘル）でもかまわない。",
    correct: false,
  },
  {
    questionId: "moped_license_1_25",
    title: "自転車横断帯の通行1",
    content:
      "自転車横断帯の直前で停止している車があっても、進路の前方を横断している自転車が見えないときは、そのまま通過してもよい。",
    hint: "かもしれない運転を思い出しましょう。",
    correct: false,
  },
  {
    questionId: "moped_license_1_26",
    title: "発進時の合図1",
    content:
      "道路の端から発信する場合は、後方から車が来ないことを確かめなければ、とくに合図をする必要はない。",
    correct: false,
  },
  {
    questionId: "moped_license_1_27",
    title: "環状交差点の合図1",
    content: "環状交差点に入るときは合図を行うが、出るときは合図を行わない。",
    hint: "環状交差点に入るときと出るときの合図は同じですか？",
    correct: false,
  },
  {
    questionId: "moped_license_1_28",
    title: "転回時の合図1",
    content: "転回するときの合図をする時期は、転回しようとする3秒前である。",
    hint: "右左折の合図と転回の合図のタイミングは同じですか？",
    correct: false,
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
