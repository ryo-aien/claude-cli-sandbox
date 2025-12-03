# Claude CLI Sandbox 環境 システム仕様書

## 1. システム概要

### 1.1 目的
本システムは、Docker コンテナを使用した安全な Claude CLI 実行環境を提供します。macOS ホスト上でプロジェクトファイルを編集しながら、コンテナ内で Claude CLI を実行することで、開発環境への影響を最小限に抑えつつ、AI アシスタント機能を利用できます。

### 1.2 主要機能
- Docker コンテナによる隔離された実行環境
- ホストとコンテナ間のファイル同期
- Claude CLI の自動インストール機能
- ガードレールによる安全性確保
- 権限管理とファイル所有権の一貫性維持

### 1.3 対象ユーザー
- Claude CLI を安全に試したい開発者
- コンテナ化された開発環境を構築したい開発者
- AI アシスタントをプロジェクトに統合したい開発者

## 2. システムアーキテクチャ

### 2.1 全体構成

```
┌─────────────────────────────────────────┐
│         macOS Host (開発マシン)          │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  プロジェクトディレクトリ          │  │
│  │  - Dockerfile                     │  │
│  │  - docker-compose.yml             │  │
│  │  - .env                           │  │
│  └───────────────┬───────────────────┘  │
│                  │ Volume Mount         │
│  ┌───────────────▼───────────────────┐  │
│  │  Docker Container (Ubuntu 22.04)  │  │
│  │                                   │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │  /workspace                 │  │  │
│  │  │  (プロジェクトディレクトリ)  │  │  │
│  │  └─────────────────────────────┘  │  │
│  │                                   │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │  Claude CLI                 │  │  │
│  │  │  - Node.js 18               │  │  │
│  │  │  - npm グローバル環境       │  │  │
│  │  └─────────────────────────────┘  │  │
│  │                                   │  │
│  │  Environment Variables:           │  │
│  │  - CLAUDE_INSTALL_CMD             │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### 2.2 技術スタック

| レイヤー | 技術 | バージョン |
|---------|------|-----------|
| ホストOS | macOS | - |
| コンテナ化 | Docker / Docker Compose | - |
| ベースイメージ | Ubuntu | 22.04 |
| ランタイム | Node.js | 18.x |
| パッケージマネージャ | npm | 9.x |
| CLI ツール | Claude CLI | latest |

### 2.3 ネットワーク構成
- コンテナはホストネットワークとは独立
- stdin/stdout を通じたインタラクティブ通信
- API 通信: コンテナ → Anthropic API (HTTPS)

## 3. 環境構成

### 3.1 環境変数

#### 必須環境変数
| 変数名 | 説明 | デフォルト値 | 例 |
|-------|------|------------|---|
| `HOST_UID` | ホストユーザーの UID | 1000 | 501 |
| `HOST_GID` | ホストユーザーの GID | 1000 | 20 |

#### オプション環境変数
| 変数名 | 説明 | デフォルト値 |
|-------|------|-----------|
| `CLAUDE_INSTALL_CMD` | Claude CLI インストールコマンド | `npm install -g @anthropics/claude` |
| `CLAUDE_WORKSPACE_DIR` | ワークスペースディレクトリ | `./` |

### 3.2 ディレクトリ構造

```
claude-cli-sandbox/
├── .env.example              # 環境変数テンプレート
├── .gitignore                # Git 除外設定
├── Dockerfile                # Docker イメージ定義
├── docker-compose.yml        # Docker Compose 設定
├── README.md                 # 使い方ガイド
├── SPECIFICATION.md          # 本仕様書
├── CLAUDE.md                 # Claude CLI 使用ガイド
└── guardrails/               # ガードレール定義
    └── guardrails.yaml       # ガードレールルール（Claude CLI 最適化版）
```

## 4. コンポーネント詳細

### 4.1 Dockerfile

#### 4.1.1 ベースイメージ
```dockerfile
FROM ubuntu:22.04
```
- 安定版 Ubuntu LTS を使用
- 広範なパッケージサポート
- 長期サポート保証

#### 4.1.2 システムパッケージ
以下のパッケージがインストールされます：
- `bash`: シェル環境
- `ca-certificates`: SSL/TLS 証明書
- `curl`: HTTP クライアント
- `git`: バージョン管理
- `gnupg`: 暗号化ツール
- `python3` / `python3-pip`: Python 環境
- `nodejs`: Node.js 18.x

#### 4.1.3 ユーザー設定
```dockerfile
ARG USER_NAME=dev
ARG USER_UID=1000
ARG USER_GID=1000
```
- ホストとコンテナ間でファイル所有権を一致させる
- パスワードなし sudo を許可
- npm グローバルインストールをユーザー権限で実行可能

#### 4.1.4 環境変数
```dockerfile
ENV NPM_CONFIG_PREFIX="/home/${USER_NAME}/.npm-global"
ENV PATH="/home/${USER_NAME}/.npm-global/bin:${PATH}"
```
- npm のグローバルパッケージをユーザーディレクトリに配置
- PATH にグローバル bin ディレクトリを追加

### 4.2 docker-compose.yml

#### 4.2.1 サービス定義
```yaml
services:
  claude:
    build:
      context: .
      args:
        USER_UID: ${HOST_UID:-1000}
        USER_GID: ${HOST_GID:-1000}
```

#### 4.2.2 ボリュームマウント
```yaml
volumes:
  - .:/workspace
```
- プロジェクトルート → `/workspace` にマウント
- 双方向同期 (read/write)
- ホストでの編集が即座にコンテナに反映

#### 4.2.3 環境変数
```yaml
environment:
  CLAUDE_INSTALL_CMD: ${CLAUDE_INSTALL_CMD:-}
```
- Claude CLI のインストール方法を指定
- デフォルトは npm 経由でのインストール

#### 4.2.4 インタラクティブモード
```yaml
stdin_open: true
tty: true
```
- 対話型 CLI の実行を可能にする
- Ctrl+C などのシグナルを正しく処理


## 5. ガードレール仕様

### 5.1 概要
ガードレールは、Claude CLI エージェントが実行できるコマンドを制限し、システムの安全性を確保する仕組みです。

### 5.2 ガードレールルール

#### 5.2.1 破壊的シェルコマンドのブロック
```yaml
- id: block-destructive-shell
  when:
    tool: shell
    command:
      any:
        - regex: '(^|;)\\s*rm\\s+-rf\\s+(/|\\.|~)'
        - regex: '(^|;)\\s*(?:mkfs|fdisk|parted)\\b'
        - regex: '(^|;)\\s*(?:shutdown|reboot|halt)\\b'
  then:
    action: block
```

**ブロック対象:**
- `rm -rf /`, `rm -rf .`, `rm -rf ~`: ルートディレクトリの削除
- `mkfs`, `fdisk`, `parted`: ディスクパーティション操作
- `shutdown`, `reboot`, `halt`: システム停止

#### 5.2.2 パーミッション変更のブロック
```yaml
- id: block-host-wide-permissions
  when:
    tool: shell
    command:
      any:
        - regex: '(^|;)\\s*chmod\\s+.*\\s+/(?:\\s|$)'
        - regex: '(^|;)\\s*chown\\s+.*\\s+/(?:\\s|$)'
  then:
    action: block
```

**ブロック対象:**
- ルートディレクトリ (`/`) に対する chmod/chown

#### 5.2.3 パッケージマネージャの確認要求
```yaml
- id: require-confirmation-package-manager
  when:
    tool: shell
    command:
      any:
        - regex: '(^|;)\\s*apt(-get)?\\s+install\\b'
        - regex: '(^|;)\\s*npm\\s+(?:install|update|ci)\\b'
  then:
    action: require_confirmation
```

**確認が必要なコマンド:**
- `apt install`, `apt-get install`: システムパッケージのインストール
- `npm install`, `npm update`, `npm ci`: Node.js パッケージのインストール

#### 5.2.4 Git 履歴の保護
```yaml
- id: block-history-rewrite
  when:
    tool: shell
    command:
      any:
        - regex: 'git\\s+push\\s+.*--force'
        - regex: 'git\\s+reset\\s+--hard'
  then:
    action: block
```

**ブロック対象:**
- `git push --force`: 強制プッシュ
- `git reset --hard`: ハードリセット
- `git clean -fd`: 追跡されていないファイルの強制削除

#### 5.2.5 ファイル編集の制限
```yaml
- id: block-apply-patch-outside-workspace
  when:
    tool: apply_patch
    target_path:
      not_starts_with: /workspace
  then:
    action: block
```

**制限内容:**
- ファイル編集は `/workspace` 以下に限定
- バイナリファイル (.png, .jpg, .pdf, .zip など) の編集をブロック

#### 5.2.6 許可リスト
以下のコマンドは常に許可されます：
- `ls`: ファイル一覧表示
- `pwd`: 現在のディレクトリ表示
- `cat`: ファイル内容表示
- `grep`, `rg`: テキスト検索
- `git status`: Git ステータス確認

### 5.3 デフォルト動作
```yaml
defaults:
  decision: allow
```
- ルールにマッチしないコマンドは許可
- ホワイトリスト方式ではなく、ブラックリスト方式

## 6. セキュリティ

### 6.1 コンテナ分離
- Docker コンテナによるプロセス分離
- ホストシステムへの直接アクセスなし
- ネットワーク分離

### 6.2 権限管理
- コンテナ内は非 root ユーザーで実行
- sudo は許可されているが、ガードレールで危険なコマンドをブロック
- ファイル所有権はホストユーザーと一致

### 6.3 認証管理
- Claude CLI はブラウザ経由で認証を実施
- API キーは不要（Web 認証を使用）
- 設定ファイルは読み取り専用 (chmod 0400) に設定

### 6.4 ガードレール
- 破壊的コマンドのブロック
- Git 履歴保護
- ファイル編集範囲の制限

## 7. インストールとセットアップ

### 7.1 前提条件
- macOS (他の OS でも動作する可能性あり)
- Docker Desktop または Docker Engine + docker compose プラグイン
- Anthropic アカウント（ブラウザ認証用）

### 7.2 セットアップ手順

#### ステップ 1: リポジトリのクローン
```bash
git clone <repository-url>
cd claude-cli-sandbox
```

#### ステップ 2: 環境変数の設定
```bash
cp .env.example .env
```

`.env` ファイルを編集：
```bash
# ホストの UID/GID を確認
id -u  # HOST_UID
id -g  # HOST_GID

# .env ファイルに設定
HOST_UID=501
HOST_GID=20
```

#### ステップ 3: イメージのビルドとコンテナの起動
```bash
docker compose up --build -d
```

#### ステップ 4: コンテナへの接続
```bash
docker compose exec claude bash
```

#### ステップ 5: Claude CLI の実行
```bash
claude
```

初回実行時は、ブラウザで認証ページが開きます。Anthropic アカウントでログインしてください。認証情報はコンテナ内に保存され、次回以降は自動的に使用されます。

### 7.3 カスタムインストール

#### npm以外の方法でインストールする場合
1. Claude CLI バイナリを `./bin/claude` に配置
2. コンテナを再起動
3. `install-claude` を実行


## 8. 使用方法

### 8.1 基本的な使い方

#### コンテナの起動
```bash
docker compose up -d
```

#### コンテナへの接続
```bash
docker compose exec claude bash
```

#### Claude CLI の起動
```bash
claude
```

#### Claude CLI の終了
- `exit` と入力
- `Ctrl+D` (EOF) を送信
- `Ctrl+C` で強制終了

#### コンテナの停止
```bash
docker compose down
```

### 8.2 ファイル編集ワークフロー

1. ホスト側で Cursor / VS Code でプロジェクトを開く
2. コンテナ内で Claude CLI を起動
3. Claude CLI にファイル編集を依頼
4. 編集結果はホスト側のファイルに即座に反映
5. ホスト側のエディタで確認・追加編集

## 9. トラブルシューティング

### 9.1 よくある問題

#### 問題: ファイル所有権の不一致
**症状:**
- ホストでファイルが編集できない
- `Permission denied` エラー

**解決方法:**
```bash
# ホストの UID/GID を確認
id -u
id -g

# .env ファイルで HOST_UID と HOST_GID を正しく設定
# コンテナを再ビルド
docker compose down
docker compose up --build -d
```

#### 問題: Claude CLI がインストールできない
**症状:**
- `install-claude` が失敗する
- npm エラーが発生

**解決方法:**
```bash
# コンテナ内で手動インストールを試す
docker compose exec claude bash
npm install -g @anthropics/claude

# ログを確認
npm install -g @anthropics/claude --verbose
```

#### 問題: 認証エラーが発生する
**症状:**
- 認証エラーが発生
- Claude CLI が起動しない

**解決方法:**
```bash
# コンテナに接続
docker compose exec claude bash

# 認証情報を確認
ls -la ~/.config/claude/

# 認証情報をリセット
rm -rf ~/.config/claude/

# Claude CLI を再起動して再認証
claude
```

#### 問題: コンテナが起動しない
**症状:**
- `docker compose up` が失敗する

**解決方法:**
```bash
# ログを確認
docker compose logs

# イメージを再ビルド
docker compose build --no-cache

# 古いコンテナを削除
docker compose down -v
docker compose up --build
```

### 9.2 デバッグ

#### ログの確認
```bash
# コンテナログを表示
docker compose logs claude

# リアルタイムでログを表示
docker compose logs -f claude
```

#### コンテナ内のシェルに接続
```bash
docker compose exec claude bash
```

#### 環境変数の確認
```bash
docker compose exec claude env
```

#### ファイルシステムの確認
```bash
docker compose exec claude ls -la /workspace
docker compose exec claude ls -la ~/.config/claude
```

## 10. 保守とアップデート

### 10.1 Claude CLI のアップデート
```bash
docker compose exec claude bash
npm update -g @anthropics/claude
```

### 10.2 ベースイメージのアップデート
```bash
docker compose pull
docker compose up --build -d
```

### 10.3 バックアップ
重要なファイル:
- `.env`: 環境変数設定
- `guardrails/guardrails.yaml`: ガードレール設定
- カスタマイズした Dockerfile や docker-compose.yml

## 11. 制限事項

### 11.1 既知の制限
- コンテナ内からホストのファイルシステム全体にはアクセスできない
- GPU アクセレーションは非対応
- Windows WSL 環境では追加の設定が必要な場合がある

### 11.2 パフォーマンス
- ファイル I/O はホストとのマウントを経由するため、ネイティブより若干遅い
- 大量の小さなファイルを扱う場合、パフォーマンスが低下する可能性

## 12. 今後の拡張

### 12.1 検討中の機能
- マルチコンテナ構成（データベース、Web サーバーなど）
- CI/CD パイプラインとの統合
- ガードレールの動的更新
- ログ集約とモニタリング

### 12.2 カスタマイズ例
- Python 仮想環境の追加
- 他の AI CLI ツールとの統合
- プロジェクト固有のツールのインストール

## 13. 参考資料

### 13.1 外部リソース
- Docker 公式ドキュメント: https://docs.docker.com/
- Docker Compose 公式ドキュメント: https://docs.docker.com/compose/
- Anthropic API ドキュメント: https://docs.anthropic.com/
- Claude CLI ドキュメント: (適切なURLに置き換え)


---

## 付録 A: 環境変数一覧

| 変数名 | 必須 | デフォルト | 説明 |
|-------|------|-----------|------|
| HOST_UID | ○ | 1000 | ホストユーザーの UID |
| HOST_GID | ○ | 1000 | ホストユーザーの GID |
| CLAUDE_INSTALL_CMD | × | npm install -g @anthropics/claude | インストールコマンド |
| CLAUDE_WORKSPACE_DIR | × | ./ | ワークスペースディレクトリ |

## 付録 B: コマンドリファレンス

### Docker Compose コマンド
```bash
# コンテナをビルドして起動
docker compose up --build -d

# コンテナを停止
docker compose down

# コンテナのログを表示
docker compose logs claude

# コンテナに接続
docker compose exec claude bash

# コンテナを再起動
docker compose restart

# 状態を確認
docker compose ps
```

### コンテナ内コマンド
```bash
# Claude CLI をインストール
install-claude

# Claude CLI を起動
claude

# Claude CLI のバージョン確認
claude --version

# Node.js のバージョン確認
node --version

# npm のバージョン確認
npm --version
```

## 付録 D: トラブルシューティングチェックリスト

### インストール時
- [ ] Docker Desktop が起動しているか
- [ ] `.env` ファイルが正しく設定されているか
- [ ] `HOST_UID` と `HOST_GID` がホストの値と一致しているか

### 実行時
- [ ] コンテナが起動しているか (`docker compose ps`)
- [ ] Claude CLI がインストールされているか (`which claude`)
- [ ] ワークスペースディレクトリがマウントされているか (`ls /workspace`)
- [ ] 認証が完了しているか（初回起動時にブラウザで認証）

### ファイル編集時
- [ ] ファイル所有権が正しいか (`ls -la`)
- [ ] ホストでファイルが表示されているか
- [ ] コンテナ内でファイルが表示されているか
- [ ] ガードレールが正しく適用されているか

---


**文書終了**
