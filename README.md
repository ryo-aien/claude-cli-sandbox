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

### 6. Claude CLI の起動

```bash
claude
```

### 7. スキルのインストール（オプション）

Claude CLI 内で以下のコマンドを実行して、追加のスキルをインストールできます：

```
/install-skill
```

このコマンドは `skills.json` に定義されたスキル/プラグインを一括インストールします。

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
├── .env.example              # 環境変数テンプレート
├── .gitignore                # Git 除外設定
├── Dockerfile                # Docker イメージ定義
├── docker-compose.yml        # Docker Compose 設定
├── README.md                 # 本ドキュメント
├── SPECIFICATION.md          # 詳細仕様書
├── CLAUDE.md                 # Claude CLI 使用ガイド
└── guardrails/               # ガードレール定義
    └── guardrails.yaml       # ガードレールルール
```

### ワークスペースディレクトリの変更

`.env` ファイルで `CLAUDE_WORKSPACE_DIR` を設定：

```bash
CLAUDE_WORKSPACE_DIR=./my-project
```

## セキュリティについて

- コンテナは非 root ユーザーで実行されます
- ファイル編集は `/workspace` 以下に制限されます
- 認証情報はコンテナ内に安全に保存されます

## 詳細ドキュメント

- [SPECIFICATION.md](SPECIFICATION.md): 詳細なシステム仕様書
- [CLAUDE.md](CLAUDE.md): Claude CLI の使い方ガイド