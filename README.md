# ことばの贈りもの 〜お客様の声〜

「心のおまもりボイス」をお聴きくださった方から届いたご感想を紹介する静的HTMLサイトです。

## 概要

このプロジェクトは、お客様から寄せられた心温まるメッセージや感想を美しく表示する静的Webサイトです。

## ファイル構成

- `index.html` - メインページ（ローディング画面付き）
- `customer-voices.html` - お客様の声を表示するメインページ
- `package.json` - プロジェクト設定
- `.gitignore` - Git除外ファイル

## ローカル開発

### 依存関係のインストール

```bash
npm install
```

### 開発サーバーの起動

```bash
npm run dev
```

または

```bash
npm start
```

ブラウザで `http://localhost:3000` にアクセスしてサイトを確認できます。

## Vercelでのデプロイ

このサイトはVercelでの静的サイトホスティングに最適化されています。

### デプロイ手順

1. GitHubリポジトリを作成してコードをプッシュ
2. Vercelにログインして「New Project」を選択
3. GitHubリポジトリを接続
4. デプロイ設定はデフォルトのままで「Deploy」をクリック

### 設定

- Build Command: 不要（静的HTMLサイト）
- Output Directory: `.` （ルートディレクトリ）
- Install Command: `npm install`

## 特徴

- レスポンシブデザイン
- 美しい森をテーマとしたグラデーション背景
- ローディング画面付きのユーザー体験
- SEOとSNSシェア用のメタタグ設定
- Google Fontsを使用した読みやすいタイポグラフィ

## ライセンス

MIT License