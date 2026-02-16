# Claude CLI Sandbox

Docker コンテナを使用した安全な Claude CLI 実行環境です。macOS ホスト上でプロジェクトファイルを編集しながら、コンテナ内で Claude CLI を実行することで、開発環境への影響を最小限に抑えつつ、AI アシスタント機能を利用できます。

## 特徴

- **隔離された実行環境**: Docker コンテナによる安全な実行環境
- **ファイル同期**: ホストとコンテナ間でファイルをシームレスに共有
- **簡単なセットアップ**: Claude CLI の自動インストール
- **安全性**: ガードレールによる危険なコマンドの制限
- **権限管理**: ホストとコンテナ間でファイル所有権を一致

## 前提条件

- macOS (他の OS でも動作する可能性あり)
- Docker Desktop または Docker Engine + docker compose プラグイン
- Anthropic アカウント（ブラウザ認証用）

## クイックスタート

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd claude-cli-sandbox
```

### 2. 環境変数の設定

```bash
# .env.example をコピー
cp .env.example .env
```

### 3. コンテナのビルドと起動

```bash
docker compose up --build -d
```

### 4. コンテナに接続

```bash
docker compose exec claude bash
```

### 5. Claude CLI のインストール

コンテナ内で以下のコマンドを実行：

```bash
install-claude
```

### 6. GitHub CLI の認証

コンテナ内で以下のコマンドを実行し、GitHub アカウントを認証します：

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

### 7. Claude CLI の起動

```bash
claude
```


**初回実行時の認証について**:

1. Claude CLI を起動すると、ターミナルに認証用の URL が表示されます
2. 表示された URL をブラウザで開いてください（自動的にブラウザが起動する場合もあります）
3. Anthropic アカウントでログインします（アカウントがない場合は作成が必要です）
4. ブラウザ上で認証を承認すると、「認証が完了しました」というメッセージが表示されます
5. ターミナルに戻ると、Claude CLI が使用可能になります
6. 認証情報は `~/.config/claude/` に保存され、次回以降は再認証不要です

## 基本的な使い方

### コンテナの操作

```bash
# コンテナの起動
docker compose up --build -d

# コンテナへの接続
docker compose exec claude bash

# コンテナの停止
docker compose down
```

### Claude CLI の操作

```bash
# Claude CLI の起動
claude
claude --dangerously-skip-permissions # すべての確認をスキップ
```

### Claude CLI の終了方法

- `exit` と入力
- `Ctrl+D` (EOF) を送信
- `Ctrl+C` で強制終了

## ファイル編集ワークフロー

1. **ホスト側**: Cursor / VS Code でプロジェクトを開く
2. **コンテナ側**: `docker compose exec claude bash` でコンテナに接続
3. **コンテナ側**: `claude` で Claude CLI を起動
4. **Claude CLI**: ファイル編集を依頼
5. **ホスト側**: 編集結果がリアルタイムで反映され、エディタで確認可能

## ディレクトリ構造

```
claude-cli-sandbox/
├── .claude/                  # Claude Code 設定
│   ├── commands/             # カスタムスキル
│   ├── plans/                # プランモード保存先
│   └── settings.local.json   # ローカル設定（Hooks 等）
├── .env.example              # 環境変数テンプレート
├── .gitignore                # Git 除外設定
├── CLAUDE.md                 # Claude CLI 使用ガイド
├── Dockerfile                # Docker イメージ定義
├── README.md                 # 本ドキュメント
├── SPECIFICATION.md          # 詳細仕様書
└── docker-compose.yml        # Docker Compose 設定
```

### ワークスペースディレクトリの変更

`.env` ファイルで `CLAUDE_WORKSPACE_DIR` を設定：


## LINE 通知設定

Claude Code の Hooks 機能を利用して、タスク完了時や確認待ち時に LINE へ通知を送ることができます。

### 通知タイミング

| イベント | タイミング | メッセージ |
|---------|-----------|-----------|
| Stop | タスク完了時 | 🎉 Claude Code のタスクが完了しました！ |
| Notification | 確認待ち時 | ⏸️ Claude Code が確認を求めています |

### セットアップ

1. [LINE Developers Console](https://developers.line.biz/console/) で Messaging API チャネルを作成
2. Channel Access Token を発行
3. 作成した Bot を友だち追加
4. `.env` に以下を設定：

```bash
LINE_NOTIFY_ENABLED=true
LINE_NOTIFY_TOKEN=発行した Channel Access Token
```

### 通知の ON/OFF

`.env` の `LINE_NOTIFY_ENABLED` で切り替えできます。

```bash
# 通知ON
LINE_NOTIFY_ENABLED=true

# 通知OFF（true 以外の値はすべて OFF）
LINE_NOTIFY_ENABLED=false
```

### 仕組み

- `.claude/settings.local.json` の Hooks で設定
- LINE Messaging API の [broadcast エンドポイント](https://developers.line.biz/en/reference/messaging-api/#send-broadcast-message)を使用（Bot の友だち全員に送信）
- トークンは `.env` から実行時に読み取り（設定ファイルに秘密情報を含めない）

## セキュリティについて

- コンテナは非 root ユーザーで実行されます
- ファイル編集は `/workspace` 以下に制限されます
- 認証情報はコンテナ内に安全に保存されます

## 詳細ドキュメント

- [SPECIFICATION.md](SPECIFICATION.md): 詳細なシステム仕様書
- [CLAUDE.md](CLAUDE.md): Claude CLI の使い方ガイド