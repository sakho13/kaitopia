# AGENTS.md

日本語で回答しなさい。

## 開発の始め方

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
5. Next.js アプリケーションを起動します。
   ```bash
    npm run dev
   ```
6. ブラウザで `http://localhost:3000` を開き、アプリケーションを確認します。

## プロジェクト構造

- `src/` - Next.js アプリケーションのソースコード
- `src/tests/` - ユニットテスト(Jest) テストコード
- `src/components/` - 再利用可能なコンポーネント(Atomic Design)
- `src/components/ui/` - shadcn/ui コンポーネント専用
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
