import { prisma } from "@/lib/prisma"

const globalTeardown = async () => {
  try {
    await prisma.$disconnect()
  } catch (error) {
    console.error("テスト終了時のDB切断エラー:", error)
    throw error
  }
}

export default globalTeardown
