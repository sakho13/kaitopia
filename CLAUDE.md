# CLAUDE.md

日本語で回答しなさい。

## 開発環境準備

すでに下記の環境が整っている場合は、以下の手順は不要です。

1. Docker コンテナを起動し、DB と FirebaseEmulator をセットアップします。
   ```bash
   docker-compose up -d
   ```
2. DB コンテナへダンプを追加します。
   ```bash
   npm run prisma:init
   ```
3. 依存関係をインストールします。
   ```bash
   npm install
   ```
4. Prisma スキーマを生成します。
   ```bash
   npm run prisma:generate
   ```

環境準備が完了すると、下記のコマンドを実行することで `localhost:3000` でアプリケーションにアクセスできるようになります。

```bash
 npm run dev
```

## 開発フロー

1. 開発環境準備が整っていること。
2. 修正方針を検討します。
   1. 修正内容を明確にします。不明な場合は質問すること。
   2. 修正による影響範囲を確認します。
   3. 修正方針を策定します。
3. 修正方針の確認を行う。
   1. 修正方針に問題がないか確認します。
   2. 必要に応じて修正方針を見直します。
4. 修正を実施します。
   1. `npm run lint` を実行してコードの整形と静的解析を行い、修正箇所に伴ってエラーが発生しているか調査すること。
   2. エラーが発生している場合は、修正を行います。
   3. `npm run test` を実行してユニットテストを実行し、修正箇所に伴ってテストが失敗しているか調査すること。
   4. テストが失敗している場合は、修正したプログラムの修正を行います。絶対にテストは修正しないこと。

### リファクタリング時の注意点

1. リファクタリングによる影響範囲を調査すること。
2. リファクタリングを行う場合は、必ずテストコードが実装されているか調査すること。
3. 修正前後でテストコードが全て成功することを確認すること。

## プロジェクト構造

- `src/` - Next.js アプリケーションのソースコード
- `src/app/` - Next.js アプリケーションのルートディレクトリ
  - `src/app/api/` - API 基底エンドポイント
  - `src/app/api/user/` - 通常ユーザ向けの API エンドポイント
  - `src/app/api/manage/` - 管理者画面向けの API エンドポイント
- `src/tests/` - ユニットテスト(Jest) テストコード
- `src/components/` - 再利用可能なコンポーネント(Atomic Design)
- `src/components/ui/` - shadcn/ui コンポーネント専用
- `src/lib/`
  - `src/lib/functions/` - 単独で成立する基本的な関数群
  - `src/lib/interfaces/` - クリーンアーキテクチャにおけるインターフェース定義
  - `src/lib/classes/`
    - `src/lib/classes/entities` - エンティティクラス
    - `src/lib/classes/repositories/` - リポジトリクラス
    - `src/lib/classes/services/` - サービスクラス
    - `src/lib/classes/utilities/` - グルーピングされた関数群 静的メソッドのみを持つクラス
  - `src/lib/types/` - プロジェクトに関連する型定義
    - `src/lib/types/common` - プログラミングにおける基本的な型定義
    - `src/lib/types/base/` - 機能に関連する型定義
- `prisma/` - Prisma スキーマとマイグレーション
- `docs/` - 各種設計書
- `__tests__/` - UI/インテグレーションテスト(Playwright) テストコード

## コーディング規約

- TypeScript を使用
- アプリは Next.js のフレームワークに基づいています。
- スタイルは Tailwind CSS を使用
- shadcn/ui を使用して UI コンポーネントを構築します。
- ESLint と Prettier を使用してコードの整形と静的解析を行います。
  ```bash
  npm run lint
  ```
- フォルダ名は複数形である必要があります。
- コンポーネント名は PascalCase で命名します。
- 関数名は camelCase で命名します。
- 定数は大文字の SNAKE_CASE で命名します。
- ファイル名は camelCase で命名します。
- プログラム中のコメントは行わず、TsDoc に準拠したコメントを使用します。
  - 関数やクラスの説明は TsDoc コメントを使用します。
  - 重要な定数の説明は TsDoc コメントを使用します。
- クリーンアーキテクチャを意識した設計を行います。
  - `entity` - ドメインモデルを定義します。
  - `repository` - データアクセスを抽象化します。
  - `service` - ビジネスロジックを実装します。
- 関数のグループ化のため `utility` クラスを使用します。
- `as T` を使った型定義は避け、明示的な型定義を行います。

## テストの実行

- Docker コンテナを起動している状態である必要があります。
  ```bash
  docker-compose up -d
  npm run prisma:init
  ```
- ユニットテストは Jest を使用して実行します。
  ```bash
  npm run test
  ```

## CI/CD

- GitHub Actions を使用して CI/CD を実行します。
- プッシュやプルリクエスト時に自動でテストが実行されます。
  - ユニットテスト `npm run test`
  - ビルドテスト `npm run build`
- PR ごとのテストに成功した場合のみ、マージが許可されます。
- CI/CD の設定は `.github/workflows/` フォルダにあります。

## Git ルール

### ブランチ名

- ブランチ名は `(issue番号)-(type)/(内容)` の形式で命名します。
  - 例: `123-feature/add-login`
- `type` は以下のいずれかを使用します。
  - `feature` - 新機能の追加
  - `fix` - バグ修正
  - `hotfix` - 緊急修正
  - `chore` - その他の変更
- 内容は英語で記述し、スペースはハイフンで区切ります。
  - 例: `123-feature/add-login`

### コミットメッセージ

- コミットメッセージは以下の形式で記述します。
  ```
  (gitmoji): (内容)
  ```
- プレフィクスは [gitmoji](https://gitmoji.dev/) のルールに従います。
  - 例: `✨ 新しい機能を追加しました`

### プルリクエスト

- プルリクエストのタイトルは `(issue番号) (内容)` の形式で命名します。
  - 例: `123 新しい機能を追加しました`
- プルリクエストは `.github/PULL_REQUEST_TEMPLATE.md` を使用したテンプレートに従って作成します。
  - プルリクエストの説明は日本語で記述します。
- テストが全て成功することを確認してからマージします。
  - PR 単位で GitHub Actions の CI が実行され、テストが成功した場合のみマージを許可します。
