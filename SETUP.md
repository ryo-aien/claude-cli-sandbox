# セットアップ手順

## 1. リポジトリのクローン

```bash
git clone <repository-url>
cd claude-cli-sandbox
```

## 2. 環境変数の設定

```bash
cp .env.example .env
```

必要に応じて `.env` を編集してください。

## 3. コンテナのビルドと起動

```bash
docker compose up --build -d
```

## 4. コンテナに接続

```bash
docker compose exec claude bash
```

## 5. Claude CLI のインストール

コンテナ内で以下を実行：

```bash
install-claude
```

## 6. GitHub CLI の認証

コンテナ内で以下を実行：

```bash
gh auth login
```

対話形式で以下の項目を選択してください：

1. **What account do you want to log into?** → `GitHub.com`
2. **What is your preferred protocol for Git operations on this host?** → `HTTPS`
3. **Authenticate Git with your GitHub credentials?** → `Yes`
4. **How would you like to authenticate GitHub CLI?** → `Login with a web browser`
5. ターミナルに表示されるワンタイムコードをコピーします
6. 表示された URL（https://github.com/login/device）をブラウザで開きます
7. コピーしたワンタイムコードを入力し、認証を承認します
8. ターミナルに戻ると `Logged in as <ユーザー名>` と表示され、認証完了です

> **注意**: コンテナ内ではブラウザが起動しないため、URL を手動でブラウザにコピーする必要があります。

## 7. Claude CLI の起動

```bash
claude
claude --dangerously-skip-permissions
claude --enable-auto-mode
```
