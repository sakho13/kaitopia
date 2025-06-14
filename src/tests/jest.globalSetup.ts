import { prisma } from "@/lib/prisma"

const globalSetup = async () => {
  await prisma.$connect()
}

export default globalSetup
