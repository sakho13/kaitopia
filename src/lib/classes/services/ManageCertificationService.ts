import { prisma } from "@/lib/prisma"
import { ApiV1Error } from "../common/ApiV1Error"
import { CertificationRepository } from "../repositories/CertificationRepository"
import { UserEntity } from "../entities/UserEntity"

/**
 * 管理用資格操作サービスクラス
 */
export class ManageCertificationService {
  constructor(
    private readonly _dbConnection: typeof prisma,
    private readonly _user: UserEntity,
  ) {}

  /**
   * 資格一覧を取得
   * 管理画面アクセス可能なユーザーのみ実行可能
   */
  public async getCertifications(limit: number = 10, page: number = 1) {
    if (!this._user.canAccessManagePage)
      throw new ApiV1Error([{ key: "RoleTypeError", params: null }])

    const offset = page ? (page - 1) * limit : undefined

    const certificationRepository = new CertificationRepository(
      this._dbConnection,
    )

    const certifications =
      await certificationRepository.findAllCertifications(limit, offset)
    const totalCount =
      await certificationRepository.countAllCertifications()
    const nextPage = certifications.length < limit ? null : page ? page + 1 : 2

    return { certifications, totalCount, nextPage }
  }

  /**
   * 資格を作成
   * ADMINユーザーのみ実行可能
   */
  public async createCertification(name: string, description: string) {
    if (!this._user.isAdmin)
      throw new ApiV1Error([{ key: "RoleTypeError", params: null }])

    const certificationRepository = new CertificationRepository(
      this._dbConnection,
    )

    // 同じ名前の資格が存在しないかチェック
    const existing = await certificationRepository.findCertificationByName(name)
    if (existing) {
      throw new ApiV1Error([
        { key: "AlreadyExistsError", params: { key: "資格名" } },
      ])
    }

    return await certificationRepository.createCertification(name, description)
  }

  /**
   * 資格を更新
   * ADMINユーザーのみ実行可能
   */
  public async updateCertification(
    id: string,
    data: { name?: string; description?: string },
  ) {
    if (!this._user.isAdmin)
      throw new ApiV1Error([{ key: "RoleTypeError", params: null }])

    const certificationRepository = new CertificationRepository(
      this._dbConnection,
    )

    // 資格が存在するかチェック
    const certification =
      await certificationRepository.findCertificationById(id)
    if (!certification) {
      throw new ApiV1Error([{ key: "NotFoundError", params: { key: "資格" } }])
    }

    // 名前を変更する場合、同じ名前の資格が存在しないかチェック
    if (data.name && data.name !== certification.name) {
      const existing =
        await certificationRepository.findCertificationByName(data.name)
      if (existing) {
        throw new ApiV1Error([
          { key: "AlreadyExistsError", params: { key: "資格名" } },
        ])
      }
    }

    return await certificationRepository.updateCertification(id, data)
  }

  /**
   * 資格を削除
   * ADMINユーザーのみ実行可能
   */
  public async deleteCertification(id: string) {
    if (!this._user.isAdmin)
      throw new ApiV1Error([{ key: "RoleTypeError", params: null }])

    const certificationRepository = new CertificationRepository(
      this._dbConnection,
    )

    // 資格が存在するかチェック
    const certification =
      await certificationRepository.findCertificationById(id)
    if (!certification) {
      throw new ApiV1Error([{ key: "NotFoundError", params: { key: "資格" } }])
    }

    return await certificationRepository.deleteCertification(id)
  }

  /**
   * 資格リクエスト一覧を取得
   * 管理画面アクセス可能なユーザーのみ実行可能
   */
  public async getCertificationRequests(
    limit: number = 10,
    page: number = 1,
    status?: string,
  ) {
    if (!this._user.canAccessManagePage)
      throw new ApiV1Error([{ key: "RoleTypeError", params: null }])

    const offset = page ? (page - 1) * limit : undefined

    const certificationRepository = new CertificationRepository(
      this._dbConnection,
    )

    const requests =
      await certificationRepository.findAllCertificationRequests(
        limit,
        offset,
        status,
      )
    const totalCount =
      await certificationRepository.countAllCertificationRequests(status)
    const nextPage = requests.length < limit ? null : page ? page + 1 : 2

    return { requests, totalCount, nextPage }
  }

  /**
   * 資格リクエストを作成
   * 管理画面アクセス可能なユーザーのみ実行可能
   */
  public async createCertificationRequest(
    userId: string,
    name: string,
    description: string,
  ) {
    if (!this._user.canAccessManagePage)
      throw new ApiV1Error([{ key: "RoleTypeError", params: null }])

    const certificationRepository = new CertificationRepository(
      this._dbConnection,
    )

    // 同じ名前の資格が既に存在しないかチェック
    const existing = await certificationRepository.findCertificationByName(name)
    if (existing) {
      throw new ApiV1Error([
        { key: "AlreadyExistsError", params: { key: "資格名" } },
      ])
    }

    return await certificationRepository.createCertificationRequest(
      userId,
      name,
      description,
    )
  }

  /**
   * 資格リクエストに賛成投票
   * 管理画面アクセス可能なユーザーのみ実行可能
   */
  public async voteForCertificationRequest(requestId: string, userId: string) {
    if (!this._user.canAccessManagePage)
      throw new ApiV1Error([{ key: "RoleTypeError", params: null }])

    const certificationRepository = new CertificationRepository(
      this._dbConnection,
    )

    // リクエストが存在するかチェック
    const request =
      await certificationRepository.findCertificationRequestById(requestId)
    if (!request) {
      throw new ApiV1Error([
        { key: "NotFoundError", params: { key: "資格リクエスト" } },
      ])
    }

    // 既に投票済みかチェック
    const hasVoted = await certificationRepository.hasUserVoted(
      requestId,
      userId,
    )
    if (hasVoted) {
      throw new ApiV1Error([
        { key: "AlreadyExistsError", params: { key: "投票" } },
      ])
    }

    return await certificationRepository.voteForCertificationRequest(
      requestId,
      userId,
    )
  }
}
