import { Prisma, PrismaClient } from "@prisma/client"

export abstract class ServiceBase {
  protected dbConnection: PrismaClient

  constructor(connection: PrismaClient) {
    this.dbConnection = connection
  }

  public resetDbConnection(dbConnection: PrismaClient) {
    this.dbConnection = dbConnection
  }

  protected async executeTransaction<T>(
    transaction: (tx: Prisma.TransactionClient) => Promise<T>,
  ): Promise<T> {
    return await this.dbConnection.$transaction(transaction)
  }
}
