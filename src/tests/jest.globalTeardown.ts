import { prisma } from "@/lib/prisma"

const globalTeardown = async () => {
  await prisma.$disconnect()
}

export default globalTeardown
