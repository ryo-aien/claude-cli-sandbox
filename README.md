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

# ホストの UID/GID を確認
id -u  # HOST_UID
id -g  # HOST_GID
```

`.env` ファイルを編集して、ホストの UID/GID を設定：

```bash
HOST_UID=501
HOST_GID=20
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

初回実行時は、ブラウザで認証ページが開きます。Anthropic アカウントでログインしてください。

## 基本的な使い方

### コンテナの操作

```bash
# コンテナの起動
docker compose up -d

# コンテナへの接続
docker compose exec claude bash

# コンテナの停止
docker compose down

# コンテナのログを表示
docker compose logs -f claude
```

### Claude CLI の操作

```bash
# Claude CLI の起動
claude

# バージョン確認
claude --version

# ヘルプ表示
claude --help
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

## ガードレールについて

このプロジェクトには、Claude CLI エージェントが実行できるコマンドを制限するガードレールが含まれています。

### ブロックされるコマンド

- `rm -rf /`, `rm -rf .`, `rm -rf ~`: ルートディレクトリの削除
- `mkfs`, `fdisk`, `parted`: ディスクパーティション操作
- `shutdown`, `reboot`, `halt`: システム停止
- ルートディレクトリに対する `chmod`/`chown`
- `git push --force`: 強制プッシュ
- `git reset --hard`: ハードリセット
- `/workspace` 以外へのファイル編集

### 確認が必要なコマンド

- `apt install`, `apt-get install`: システムパッケージのインストール
- `npm install`, `npm update`: Node.js パッケージのインストール

詳細は `guardrails/guardrails.yaml` を参照してください。

## トラブルシューティング

### ファイル所有権の不一致

**症状**: ホストでファイルが編集できない、`Permission denied` エラー

**解決方法**:
```bash
# ホストの UID/GID を再確認
id -u
id -g

# .env ファイルで HOST_UID と HOST_GID を修正
# コンテナを再ビルド
docker compose down
docker compose up --build -d
```

### Claude CLI がインストールできない

**症状**: `install-claude` が失敗する、npm エラーが発生

**解決方法**:
```bash
# コンテナ内で手動インストールを試す
docker compose exec claude bash
npm install -g @anthropics/claude

# 詳細ログを確認
npm install -g @anthropics/claude --verbose
```

### 認証エラーが発生する

**症状**: 認証エラーが発生、Claude CLI が起動しない

**解決方法**:
```bash
# コンテナに接続
docker compose exec claude bash

# 認証情報をリセット
rm -rf ~/.config/claude/

# Claude CLI を再起動して再認証
claude
```

### コンテナが起動しない

**解決方法**:
```bash
# ログを確認
docker compose logs

# イメージを再ビルド
docker compose build --no-cache

# 古いコンテナを削除
docker compose down -v
docker compose up --build
```

## カスタマイズ

### カスタムインストールコマンドの使用

`.env` ファイルで `CLAUDE_INSTALL_CMD` を設定：

```bash
CLAUDE_INSTALL_CMD="npm install -g @anthropics/claude@beta"
```

### ローカルバイナリの使用

1. Claude CLI バイナリを `./bin/claude` に配置
2. コンテナを再起動: `docker compose restart`
3. `install-claude` を実行

### ワークスペースディレクトリの変更

`.env` ファイルで `CLAUDE_WORKSPACE_DIR` を設定：

```bash
CLAUDE_WORKSPACE_DIR=./my-project
```

## セキュリティについて

- コンテナは非 root ユーザーで実行されます
- ガードレールにより危険なコマンドがブロックされます
- ファイル編集は `/workspace` 以下に制限されます
- 認証情報はコンテナ内に安全に保存されます

## アップデート

### Claude CLI のアップデート

```bash
docker compose exec claude bash
npm update -g @anthropics/claude
```

### ベースイメージのアップデート

```bash
docker compose pull
docker compose up --build -d
```

## 詳細ドキュメント

- [SPECIFICATION.md](SPECIFICATION.md): 詳細なシステム仕様書
- [CLAUDE.md](CLAUDE.md): Claude CLI の使い方ガイド

## ライセンス

MIT License

## 貢献

プルリクエストを歓迎します。大きな変更の場合は、まず issue を開いて変更内容を議論してください。
