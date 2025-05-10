import { PrismaClient } from "@prisma/client"

export abstract class ControllerBase {
  protected dbConnection: PrismaClient

  constructor(dbConnection: PrismaClient) {
    this.dbConnection = dbConnection
  }

  public resetDbConnection(dbConnection: PrismaClient) {
    this.dbConnection = dbConnection
  }
}
