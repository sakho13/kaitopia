import { PrismaClient } from "@prisma/client"
import { SeedDataIntroProgramming1 } from "./seedData/SeedDataIntroProgramming1"
const prisma = new PrismaClient()

async function main() {
  console.log(`Start seeding ...`)

  await transferSchools()
  await Promise.all([transferExcises(), transferQuestions()])

  await prisma.question.updateMany({
    data: { currentVersionId: 1 },
    where: {
      id: {
        in: SeedDataIntroProgramming1.questions.map((q) => q.id),
      },
      schoolId: SeedDataIntroProgramming1.exercise.schoolId,
    },
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

async function transferSchools() {
  return await prisma.school.createMany({
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
      // {
      //   id: "kaitopia_test",
      //   name: "Kaitopia Test",
      //   description: "誰でも学べる学校(テスト用)",
      //   isGlobal: true,
      //   isPublic: true,
      //   isSelfSchool: true,
      // },
    ],
  })
}

async function transferExcises() {
  return await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      SeedDataIntroProgramming1.exercise,
{
        id: "it_passport_1",
        title: "ITパスポート 問題集1",
        schoolId: "kaitopia_1",
        description: "ITパスポートの問題集です。",
      },
      {
        id: "fundamental_information_technology_engineer_exam_1",
        title: "基本情報技術者試験 問題集1",
        schoolId: "kaitopia_1",
        description: "基本情報技術者試験の過去問を集めた問題集です。",
      },
      {
        id: "moped_license_1",
        title: "原付免許問題集1",
        schoolId: "kaitopia_1",
        description: "原付免許の問題集です。",
      },

      {
        id: "hazardous_material_handling_category_C_1",
        title: "危険物取扱者丙種 問題集1",
        schoolId: "kaitopia_1",
        description: "危険物取扱者丙種の問題集です。",
      },

      {
        id: "hazardous_material_handling_1_category_B_1",
        title: "危険物取扱者乙種1類 問題集1",
        schoolId: "kaitopia_1",
        description: "危険物取扱者乙種1類の問題集です。",
      },
      {
        id: "hazardous_material_handling_2_category_B_1",
        title: "危険物取扱者乙種2類 問題集1",
        schoolId: "kaitopia_1",
        description: "危険物取扱者乙種2類の問題集です。",
      },
      {
        id: "hazardous_material_handling_3_category_B_1",
        title: "危険物取扱者乙種3類 問題集1",
        schoolId: "kaitopia_1",
        description: "危険物取扱者乙種3類の問題集です。",
      },
      {
        id: "hazardous_material_handling_4_category_B_1",
        title: "危険物取扱者乙種4類 問題集1",
        schoolId: "kaitopia_1",
        description: "危険物取扱者乙種4類の問題集です。",
      },
      {
        id: "hazardous_material_handling_5_category_B_1",
        title: "危険物取扱者乙種5類 問題集1",
        schoolId: "kaitopia_1",
        description: "危険物取扱者乙種5類の問題集です。",
      },
      {
        id: "hazardous_material_handling_6_category_B_1",
        title: "危険物取扱者乙種6類 問題集1",
        schoolId: "kaitopia_1",
        description: "危険物取扱者乙種6類の問題集です。",
      },
    ],
  })
}

async function transferQuestions() {
  await prisma.question.createMany({
    skipDuplicates: true,
    data: SeedDataIntroProgramming1.questions,
  })

  await prisma.questionVersion.createMany({
    skipDuplicates: true,
    data: SeedDataIntroProgramming1.questionVersions,
  })

  await prisma.questionAnswer.createMany({
    skipDuplicates: true,
    data: SeedDataIntroProgramming1.questionAnswers,
  })
}
