import { RepositoryBase } from "../common/RepositoryBase"

/**
 * 資格データアクセスリポジトリ
 */
export class CertificationRepository extends RepositoryBase {
  /**
   * 資格を全件取得
   */
  public async findAllCertifications(limit?: number, offset?: number) {
    return await this.dbConnection.certification.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      skip: offset,
    })
  }

  /**
   * 資格をIDで取得
   */
  public async findCertificationById(id: string) {
    return await this.dbConnection.certification.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    })
  }

  /**
   * 資格を名前で取得
   */
  public async findCertificationByName(name: string) {
    return await this.dbConnection.certification.findFirst({
      where: {
        name,
        deletedAt: null,
      },
    })
  }

  /**
   * 資格を作成
   */
  public async createCertification(name: string, description: string) {
    return await this.dbConnection.certification.create({
      data: {
        name,
        description,
      },
    })
  }

  /**
   * 資格を更新
   */
  public async updateCertification(
    id: string,
    data: { name?: string; description?: string },
  ) {
    return await this.dbConnection.certification.update({
      where: {
        id,
      },
      data,
    })
  }

  /**
   * 資格を削除(論理削除)
   */
  public async deleteCertification(id: string) {
    return await this.dbConnection.certification.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    })
  }

  /**
   * 資格の総数を取得
   */
  public async countAllCertifications() {
    return await this.dbConnection.certification.count({
      where: {
        deletedAt: null,
      },
    })
  }

  /**
   * 資格リクエストを全件取得
   */
  public async findAllCertificationRequests(
    limit?: number,
    offset?: number,
    status?: string,
  ) {
    return await this.dbConnection.certificationRequest.findMany({
      where: {
        deletedAt: null,
        ...(status && { status: status as any }),
      },
      include: {
        requestedByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        votes: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      skip: offset,
    })
  }

  /**
   * 資格リクエストをIDで取得
   */
  public async findCertificationRequestById(id: string) {
    return await this.dbConnection.certificationRequest.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        requestedByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        votes: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    })
  }

  /**
   * 資格リクエストを作成
   */
  public async createCertificationRequest(
    userId: string,
    name: string,
    description: string,
  ) {
    return await this.dbConnection.certificationRequest.create({
      data: {
        requestedByUserId: userId,
        requestedName: name,
        requestedDescription: description,
        status: "PENDING",
      },
    })
  }

  /**
   * 資格リクエストのステータスを更新
   */
  public async updateCertificationRequestStatus(
    id: string,
    status: "PENDING" | "APPROVED" | "REJECTED",
    certificationId?: string,
  ) {
    return await this.dbConnection.certificationRequest.update({
      where: {
        id,
      },
      data: {
        status,
        ...(certificationId && { certificationId }),
      },
    })
  }

  /**
   * 資格リクエストに賛成投票
   */
  public async voteForCertificationRequest(requestId: string, userId: string) {
    return await this.dbConnection.certificationRequestVote.create({
      data: {
        requestId,
        userId,
      },
    })
  }

  /**
   * ユーザーが既に投票しているか確認
   */
  public async hasUserVoted(requestId: string, userId: string) {
    const vote = await this.dbConnection.certificationRequestVote.findFirst({
      where: {
        requestId,
        userId,
      },
    })
    return vote !== null
  }

  /**
   * 資格リクエストの総数を取得
   */
  public async countAllCertificationRequests(status?: string) {
    return await this.dbConnection.certificationRequest.count({
      where: {
        deletedAt: null,
        ...(status && { status: status as any }),
      },
    })
  }
}
