import { PrismaClient } from "@prisma/client"

export class QuestionRepository {
  private dbConnection: PrismaClient

  constructor(dbConnection: PrismaClient) {
    this.dbConnection = dbConnection
  }

  public set resetDbConnection(dbConnection: PrismaClient) {
    this.dbConnection = dbConnection
  }
}
