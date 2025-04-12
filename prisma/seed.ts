import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

async function main() {
  console.log(`Start seeding ...`)

  await Promise.all([transferSchools(), transferExcises()])

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
      {
        id: "kaitopia_test",
        name: "Kaitopia Test",
        description: "誰でも学べる学校(テスト用)",
        isGlobal: true,
        isPublic: true,
        isSelfSchool: true,
      },
    ],
  })
}

async function transferExcises() {
  return await prisma.exercise.createMany({
    skipDuplicates: true,
    data: [
      {
        id: "intro_programming",
        title: "プログラミング入門",
        schoolId: "kaitopia_1",
      },
    ],
  })
}
