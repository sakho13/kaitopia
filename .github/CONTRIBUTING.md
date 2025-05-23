# 開発ガイド

## Git 運用

### ブランチ

- `main` 最新ブランチ
- `develop` 次回リリースブランチ
  - `main` からの派生
- `(fix|feature)/xxxx-(issue_no)` 修正ブランチ
  - `develop`からの派生

### コミットメッセージ

コミットメッセージは下記のフォーマットで行う

```plain
{プレフィクス} {コミット概要}
```

or

```plain
{プレフィクス} {コミット概要}

{詳細説明}
```

#### プレフィクス

[gitmoji](https://gitmoji.dev/) を参考にしたプレフィックス構成

- ✨ ... 新機能追加
- 🐛 ... バグ修正
- ♻️ ... リファクタリング
- ⚡️ ... パフォーマンス改善
- 💄 ... デザインの修正・改善
- ✅ ... テストコードの修正・追加
- 📝 ... ドキュメントファイルの修正・追加
- 🚚 ... ファイルの移動・ファイル名の変更
- ✏️ ... タイポの修正
- 👷 ... CI/CD 関連の修正・追加
- 📦️ ... ライブラリの追加・アップデート
- 🔧 ... コンフィグ修正・追加
- 🚧 ... 実装中・一時的な追加

## 開発環境
