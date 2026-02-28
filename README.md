# 📊 Stock Analysis Dashboard

Accenture (ACN) の総合株式分析ダッシュボード。ファンダメンタル・テクニカル・ニュース分析を1つのインタラクティブなダッシュボードで表示します。

## 🚀 セットアップ & デプロイ手順

### 前提条件
- [Node.js](https://nodejs.org/) (v18以上)
- [Git](https://git-scm.com/downloads/win)
- GitHubアカウント

### 1. ローカルで開発

```bash
# 依存パッケージをインストール
npm install

# 開発サーバーを起動（http://localhost:5173 で確認）
npm run dev
```

### 2. GitHubにプッシュ

```bash
# Gitを初期化
git init
git add .
git commit -m "初回コミット: 株分析ダッシュボード"

# GitHubでリポジトリ「stock-analysis-dashboard」を作成後:
git remote add origin https://github.com/<あなたのユーザー名>/stock-analysis-dashboard.git
git branch -M main
git push -u origin main
```

### 3. GitHub Pagesにデプロイ

```bash
# ビルド & デプロイ（gh-pagesブランチに自動プッシュ）
npm run deploy
```

### 4. GitHub Pages を有効化

1. GitHubリポジトリの **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: **gh-pages** / **(root)**
4. Save

数分後に `https://<ユーザー名>.github.io/stock-analysis-dashboard/` で公開されます！

## 🛠 技術スタック
- React 18
- Vite 5
- Recharts (グラフ)
- Lucide React (アイコン)
- GitHub Pages (ホスティング)

## ⚠️ 免責事項
本ダッシュボードは情報提供のみを目的としており、投資助言ではありません。
