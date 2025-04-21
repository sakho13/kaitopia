import { Prisma, PrismaClient } from "@prisma/client"

export abstract class ControllerBase {
  protected dbConnection: PrismaClient | Prisma.TransactionClient

  constructor(dbConnection: PrismaClient | Prisma.TransactionClient) {
    this.dbConnection = dbConnection
  }

  public set resetDbConnection(
    dbConnection: PrismaClient | Prisma.TransactionClient,
  ) {
    this.dbConnection = dbConnection
  }
}
