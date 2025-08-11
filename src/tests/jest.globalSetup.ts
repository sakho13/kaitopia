import { prisma } from "@/lib/prisma"

const globalSetup = async () => {
  try {
    await prisma.$connect()
  } catch (error) {
    console.error("テスト初期化時のDB接続エラー:", error)
    throw error
  }
}

export default globalSetup
