# 資格管理機能

## 概要

資格管理機能は、システム全体で使用される資格情報を管理するための機能です。
スクールに依存しない独立したマスターデータとして管理されます。

## データベース設計

### Certification (資格マスタ)

| カラム名      | 型        | 説明                 |
| ------------- | --------- | -------------------- |
| id            | String    | 主キー               |
| name          | String    | 資格名 (ユニーク)    |
| description   | String    | 資格の説明           |
| created_at    | DateTime  | 作成日時             |
| updated_at    | DateTime  | 更新日時             |
| deleted_at    | DateTime? | 削除日時 (論理削除)  |

### CertificationRequest (資格追加リクエスト)

| カラム名                  | 型                            | 説明                     |
| ------------------------- | ----------------------------- | ------------------------ |
| id                        | String                        | 主キー                   |
| certification_id          | String?                       | 承認後の資格ID           |
| requested_name            | String                        | リクエスト資格名         |
| requested_description     | String                        | リクエスト資格説明       |
| requested_by_user_id      | String                        | リクエストユーザーID     |
| status                    | CertificationRequestStatus    | ステータス               |
| created_at                | DateTime                      | 作成日時                 |
| updated_at                | DateTime                      | 更新日時                 |
| deleted_at                | DateTime?                     | 削除日時 (論理削除)      |

### CertificationRequestVote (資格リクエストへの投票)

| カラム名    | 型       | 説明              |
| ----------- | -------- | ----------------- |
| id          | String   | 主キー            |
| request_id  | String   | リクエストID      |
| user_id     | String   | 投票ユーザーID    |
| created_at  | DateTime | 投票日時          |

### Enum: CertificationRequestStatus

- `PENDING`: 審議中
- `APPROVED`: 承認済み
- `REJECTED`: 却下

## API エンドポイント

### 資格管理 API

#### GET /api/manage/v1/certifications

資格一覧を取得します。

**権限**: 管理画面アクセス可能なユーザー (MODERATOR以上)

**クエリパラメータ**:
- `page`: ページ番号 (デフォルト: 1)
- `count`: 取得件数 (デフォルト: 10)

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "certifications": [
      {
        "id": "cert_xxx",
        "name": "基本情報技術者試験",
        "description": "ITに関する基本的な知識を問う国家資格",
        "createdAt": "2025-01-01T00:00:00.000Z",
        "updatedAt": "2025-01-01T00:00:00.000Z"
      }
    ],
    "totalCount": 100,
    "nextPage": 2
  }
}
```

#### POST /api/manage/v1/certifications

資格を新規作成します。

**権限**: ADMINユーザーのみ

**リクエストボディ**:
```json
{
  "name": "基本情報技術者試験",
  "description": "ITに関する基本的な知識を問う国家資格"
}
```

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "id": "cert_xxx",
    "name": "基本情報技術者試験",
    "description": "ITに関する基本的な知識を問う国家資格",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

#### PATCH /api/manage/v1/certifications

資格情報を更新します。

**権限**: ADMINユーザーのみ

**リクエストボディ**:
```json
{
  "id": "cert_xxx",
  "name": "基本情報技術者試験 (更新版)",
  "description": "更新された説明文"
}
```

#### DELETE /api/manage/v1/certifications

資格を削除します (論理削除)。

**権限**: ADMINユーザーのみ

**クエリパラメータ**:
- `id`: 削除する資格のID

### 資格リクエスト API

#### GET /api/manage/v1/certification-requests

資格追加リクエストの一覧を取得します。

**権限**: 管理画面アクセス可能なユーザー (MODERATOR以上)

**クエリパラメータ**:
- `page`: ページ番号 (デフォルト: 1)
- `count`: 取得件数 (デフォルト: 10)
- `status`: ステータスでフィルタ (PENDING, APPROVED, REJECTED)

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "requests": [
      {
        "id": "req_xxx",
        "requestedName": "応用情報技術者試験",
        "requestedDescription": "IT知識の応用力を問う資格",
        "status": "PENDING",
        "requestedBy": {
          "id": "user_xxx",
          "name": "山田太郎",
          "email": "yamada@example.com"
        },
        "votes": [
          {
            "id": "vote_xxx",
            "userId": "user_yyy",
            "userName": "鈴木花子",
            "createdAt": "2025-01-01T00:00:00.000Z"
          }
        ],
        "voteCount": 1,
        "createdAt": "2025-01-01T00:00:00.000Z",
        "updatedAt": "2025-01-01T00:00:00.000Z"
      }
    ],
    "totalCount": 50,
    "nextPage": 2
  }
}
```

#### POST /api/manage/v1/certification-requests

新しい資格追加リクエストを作成します。

**権限**: 管理画面アクセス可能なユーザー (MODERATOR以上)

**リクエストボディ**:
```json
{
  "name": "応用情報技術者試験",
  "description": "IT知識の応用力を問う資格"
}
```

#### POST /api/manage/v1/certification-requests/vote

資格リクエストに賛成投票します。

**権限**: 管理画面アクセス可能なユーザー (MODERATOR以上)

**リクエストボディ**:
```json
{
  "requestId": "req_xxx"
}
```

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "id": "vote_xxx",
    "requestId": "req_xxx",
    "userId": "user_xxx",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

## アクセス権限

### ADMIN (管理者)
- 資格の作成、更新、削除が可能
- 資格リクエストの閲覧、作成、投票が可能

### MODERATOR / TEACHER (準管理者)
- 資格リクエストの閲覧、作成、投票が可能
- 資格の直接編集は不可

### USER (一般ユーザー)
- アクセス不可

## ビジネスロジック

### 資格の作成
1. ADMINユーザーのみが資格を直接作成可能
2. 同じ名前の資格が既に存在する場合はエラー
3. 資格名は1-100文字、説明は1-500文字の制限

### 資格リクエストの作成
1. MODERATOR以上のユーザーが資格追加をリクエスト可能
2. 同じ名前の資格が既に存在する場合はエラー
3. リクエストのステータスは初期状態でPENDING

### 投票機能
1. 管理者ユーザー(MODERATOR以上)が賛成投票可能
2. 同じリクエストに対して1ユーザー1回まで投票可能
3. 投票数が一定数に達した場合の自動承認は今後実装予定

## テスト

### ManageV1Certifications.test.ts
- 資格CRUD操作のテスト
- 権限チェックのテスト
- バリデーションのテスト

### ManageV1CertificationRequests.test.ts
- 資格リクエスト機能のテスト
- 投票機能のテスト
- 二重投票防止のテスト
