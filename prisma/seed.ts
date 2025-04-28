import { Prisma, PrismaClient } from "@prisma/client"
import { SeedDataIntroProgramming1 } from "./seedData/SeedDataIntroProgramming1"
import { SeedDataMopedLicense1 } from "./seedData/SeedDataMopedLicense1"
const prisma = new PrismaClient()

async function main() {
  console.log(`Start seeding ...`)

  await prisma.$transaction(async (t) => {
    await transferUsers(t)
    await transferSchools(t)
    await transferExcises(t)
    await transferQuestions(t)

    await t.question.updateMany({
      data: { currentVersionId: 1 },
      where: {
        id: {
          in: SeedDataIntroProgramming1.questions.map((q) => q.id),
        },
        schoolId: SeedDataIntroProgramming1.exercise.schoolId,
      },
    })
  })

  console.log(`Seeding finished.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

async function transferUsers(db: Prisma.TransactionClient) {
  await db.user.createMany({
    skipDuplicates: true,
    data: [
      {
        id: "kaitopia-user+001",
        firebaseUid: "3na1wqgfg7Jj71amJifrwGrCtkCg",
        name: "Kaitopia User 001",
        isGuest: false,
        role: "USER",
      },
      {
        id: "kaitopia-admin+001",
        firebaseUid: "SgOxbbAadPt2Ii0hwjsuVPLrnPH3",
        name: "Kaitopia Admin 001",
        isGuest: false,
        role: "ADMIN",
      },
    ],
  })
}

async function transferSchools(db: Prisma.TransactionClient) {
  await db.school.createMany({
    skipDuplicates: true,
    data: [
      {
        id: "kaitopia_1",
        name: "Kaitopia",
        description: "誰でも学べる学校",
        isGlobal: true,
        isPublic: true,
        isSelfSchool: true,
      },
      {
        id: "kaitopia_user_001_school",
        name: "Kaitopia User 001's スクール",
        description: "あなただけのスクールです",
        isSelfSchool: true,
        isGlobal: false,
        isPublic: false,
      },
    ],
  })

  await db.schoolOwner.createMany({
    skipDuplicates: true,
    data: [
      {
        userId: "kaitopia-user+001",
        schoolId: "kaitopia_user_001_school",
        priority: 1,
      },
    ],
  })
}

async function transferExcises(db: Prisma.TransactionClient) {
  return await db.exercise.createMany({
    skipDuplicates: true,
    data: [
      SeedDataIntroProgramming1.exercise,
      {
        id: "it_passport_1",
        title: "ITパスポート 問題集1",
        schoolId: "kaitopia_1",
        description: "ITパスポートの問題集です。",
        isPublished: false,
      },
      {
        id: "fundamental_information_technology_engineer_exam_1",
        title: "基本情報技術者試験 問題集1",
        schoolId: "kaitopia_1",
        description: "基本情報技術者試験の過去問を集めた問題集です。",
        isPublished: false,
      },

      SeedDataMopedLicense1.exercise,

      {
        id: "hazardous_material_handling_category_C_1",
        title: "危険物取扱者丙種 問題集1",
        schoolId: "kaitopia_1",
        description: "危険物取扱者丙種の問題集です。",
        isPublished: false,
      },

      {
        id: "hazardous_material_handling_1_category_B_1",
        title: "危険物取扱者乙種1類 問題集1",
        schoolId: "kaitopia_1",
        description: "危険物取扱者乙種1類の問題集です。",
        isPublished: false,
      },
      {
        id: "hazardous_material_handling_2_category_B_1",
        title: "危険物取扱者乙種2類 問題集1",
        schoolId: "kaitopia_1",
        description: "危険物取扱者乙種2類の問題集です。",
        isPublished: false,
      },
      {
        id: "hazardous_material_handling_3_category_B_1",
        title: "危険物取扱者乙種3類 問題集1",
        schoolId: "kaitopia_1",
        description: "危険物取扱者乙種3類の問題集です。",
        isPublished: false,
      },
      {
        id: "hazardous_material_handling_4_category_B_1",
        title: "危険物取扱者乙種4類 問題集1",
        schoolId: "kaitopia_1",
        description: "危険物取扱者乙種4類の問題集です。",
        isPublished: false,
      },
      {
        id: "hazardous_material_handling_5_category_B_1",
        title: "危険物取扱者乙種5類 問題集1",
        schoolId: "kaitopia_1",
        description: "危険物取扱者乙種5類の問題集です。",
        isPublished: false,
      },
      {
        id: "hazardous_material_handling_6_category_B_1",
        title: "危険物取扱者乙種6類 問題集1",
        schoolId: "kaitopia_1",
        description: "危険物取扱者乙種6類の問題集です。",
        isPublished: false,
      },
    ],
  })
}

async function transferQuestions(db: Prisma.TransactionClient) {
  await db.question.createMany({
    skipDuplicates: true,
    data: SeedDataIntroProgramming1.questions,
  })
  // await db.question.createMany({
  //   skipDuplicates: true,
  //   data: SeedDataMopedLicense1.questions,
  // })

  await db.questionVersion.createMany({
    skipDuplicates: true,
    data: SeedDataIntroProgramming1.questionVersions,
  })
  // await db.questionVersion.createMany({
  //   skipDuplicates: true,
  //   data: SeedDataMopedLicense1.questionVersions,
  // })

  await db.questionAnswer.createMany({
    skipDuplicates: true,
    data: SeedDataIntroProgramming1.questionAnswers,
  })
  // await db.questionAnswer.createMany({
  //   skipDuplicates: true,
  //   data: SeedDataMopedLicense1.questionAnswers,
  // })

  await db.exerciseQuestion.createMany({
    skipDuplicates: true,
    data: SeedDataIntroProgramming1.questions.map((q) => ({
      exerciseId: SeedDataIntroProgramming1.exercise.id,
      questionId: q.id,
    })),
  })
  // await db.exerciseQuestion.createMany({
  //   skipDuplicates: true,
  //   data: SeedDataMopedLicense1.questions.map((q) => ({
  //     exerciseId: SeedDataMopedLicense1.exercise.id,
  //     questionId: q.id,
  //   })),
  // })
}
