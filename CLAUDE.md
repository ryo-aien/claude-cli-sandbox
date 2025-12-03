# Claude Code 使用ガイド

このドキュメントでは、Claude CLI Sandbox 環境での Claude Code の使い方を説明します。

## Claude Code とは

**Claude Code** は、Anthropic が提供する AI アシスタント「Claude」をターミナルから利用できる公式ツールです。コードの生成、バグ修正、リファクタリング、ドキュメント作成など、様々な開発タスクを直接ターミナル内で実行できます。

### 主な機能

- **機能開発**: 自然言語のリクエストを実際に動作するコードに変換
- **デバッグ**: コードベースを分析し、問題を特定して修正を実装
- **コードベースナビゲーション**: プロジェクト構造を理解し、コードに関する質問に回答
- **タスク自動化**: リント、テスト、マージ競合の解決などの反復作業を処理
- **コードレビュー**: 品質保証とベストプラクティスの提案
- **Git 操作**: バージョン管理の統合とコミット管理
- **マルチファイル編集**: 承認ワークフローによる複数ファイルの同時編集

## 基本的な使い方

### 起動方法

```bash
# 対話型 REPL を起動
claude

# 初期プロンプトで開始
claude "あなたの依頼内容"

# クイック質問（回答後に終了）
claude -p "質問内容"

# ファイルから入力をパイプ
cat file.txt | claude -p "このファイルを解析してください"
```

初回起動時は、ブラウザで認証ページが開きます。Anthropic アカウントでログインしてください。

### 終了方法

以下のいずれかの方法で終了できます：

- `/exit` コマンドを入力
- `Ctrl+D` を押す
- `Ctrl+C` で操作をキャンセル

## キーボードショートカット

### 基本操作

| ショートカット | 説明 |
|--------------|------|
| `Ctrl+C` | 現在の操作をキャンセル |
| `Ctrl+D` | Claude Code を終了 |
| `Ctrl+L` | 画面をクリア |
| `Ctrl+R` | 履歴を逆順検索（過去の入力を再利用） |
| `Ctrl+B` | 長時間実行プロセスをバックグラウンド化 |
| `Tab` | 拡張思考モードの切り替え（複雑な作業向け） |
| `Shift+Enter` または `Ctrl+J` | 複数行入力 |
| `↑` / `↓` | コマンド履歴のナビゲーション |

### 便利なヒント

- **`Ctrl+R`**: 過去に使用したコマンドを検索して再利用できます
- **`Tab`**: 複雑なアーキテクチャ変更には拡張思考モードを使用
- **`Ctrl+B`**: テスト実行などの長時間処理中も作業を継続できます

## スラッシュコマンド

Claude Code には多数のスラッシュコマンドが用意されています。

### セッション管理

```bash
/clear          # 会話履歴を削除
/exit           # REPL を終了
/resume         # 前回の会話を継続
/rewind         # 会話/コードを巻き戻す
/compact        # 会話履歴を圧縮してトークンを削減
/export         # 会話をファイルに保存
```

### 設定とカスタマイズ

```bash
/config         # 設定インターフェースにアクセス
/model          # AI モデルを切り替え
/status         # バージョン、モデル、アカウント情報を表示
/privacy-settings  # プライバシー設定を調整
/terminal-setup    # 改行動作を設定
/vim            # vim スタイルの編集を有効化
```

### 開発支援

```bash
/review         # コードレビューを依頼
/bug            # Anthropic に問題を報告
/doctor         # インストールの健全性をチェック
/todos          # 現在のタスクリストを表示
/init           # CLAUDE.md でプロジェクトをセットアップ
/memory         # CLAUDE.md ファイルを編集
```

### パフォーマンスとコンテキスト

```bash
/context        # トークン使用量を視覚化
/cost           # トークン統計を表示
/compact        # 会話履歴を圧縮（定期的に使用推奨）
/add-dir        # 追加のディレクトリを含める
```

### 統合と拡張

```bash
/mcp            # MCP サーバー接続を管理
/plugin         # Claude Code プラグインを処理
/ide            # IDE 統合を設定
/sandbox        # 隔離された bash 実行を有効化
```

## コマンドラインフラグ

```bash
# 基本的なフラグ
-p, --print                    # 対話モードなしで応答を出力
--verbose                      # 詳細なターンごとのログを有効化
--max-turns <n>               # エージェントの反復回数を制限
--model <model>               # モデルを指定 (sonnet, opus, または完全な名前)

# システムプロンプトのカスタマイズ
--system-prompt <text>        # システムプロンプト全体を置き換え
--append-system-prompt <text> # デフォルトに指示を追加

# 高度な機能
--agents <json>               # カスタムサブエージェントを定義
--output-format <format>      # text、JSON、または stream-json を選択
--json-schema <schema>        # 検証済み JSON 出力を取得
--add-dir <path>              # アクセス可能なディレクトリを拡張
--permission-mode <mode>      # パーミッション処理を制御
-c, -r                        # 特定のセッションを再開
```

## ファイルとコンテキストの参照

### ファイル参照構文

```bash
# 特定のファイルを参照
@path/to/file.js

# ディレクトリ全体を参照
@src/

# 重要な情報をメモリに保存
#覚えておいて：この重要な情報を記憶してください
```

### メモリ管理

Claude Code は `CLAUDE.md` ファイルを使用してプロジェクト固有の情報を保存します：

```bash
# CLAUDE.md の初期化
/init

# CLAUDE.md の編集
/memory

# メモリショートカット（# プレフィックス）
#remember この情報を保存
```

## 主な使用例

### 1. コードの生成

```
プロンプト: Python でフィボナッチ数列を計算する関数を書いてください
```

Claude が関数を生成し、ファイルに保存するか尋ねます。

### 2. バグ修正

```
プロンプト: @app.py の 42 行目で ZeroDivisionError が発生しています。修正してください
```

Claude がファイルを読み込み、問題を分析して修正を提案します。

### 3. コードレビュー

```
/review

または

プロンプト: @src/main.py をレビューして、改善点を教えてください
```

Claude がコードを分析し、改善提案を行います。

### 4. リファクタリング

```
プロンプト: @utils.py をよりモダンな Python コードにリファクタリングしてください
```

Claude がコードを読み込み、リファクタリングを提案します。

### 5. ドキュメント作成

```
プロンプト: @api.py のドキュメント文字列を追加してください
```

Claude が関数やクラスにドキュメントを追加します。

### 6. テストコード生成

```
プロンプト: @calculator.py の単体テストを作成してください
```

Claude がテストコードを生成します。

### 7. エラーデバッグ

```
プロンプト: 以下のエラーを修正してください：

Traceback (most recent call last):
  File "app.py", line 10, in <module>
    result = divide(10, 0)
ZeroDivisionError: division by zero
```

エラーメッセージを共有すると、Claude が問題を特定して修正します。

## ベストプラクティス

### 1. 具体的な指示を出す

**悪い例**:
```
コードを良くしてください
```

**良い例**:
```
app.py の関数名を PEP 8 に準拠した命名規則に変更してください
```

### 2. ファイル参照構文を使用する

**悪い例**:
```
この関数を修正してください
```

**良い例**:
```
@src/utils.py の parse_data 関数を修正してください
```

### 3. 変更の範囲を限定する

**悪い例**:
```
プロジェクト全体をリファクタリングしてください
```

**良い例**:
```
@models/user.py の User クラスをリファクタリングしてください
```

### 4. すべての変更を確認する

Claude がファイルを編集する際、変更内容を確認してから適用してください：

```
Claude: 以下の変更を適用しますか？

--- app.py
+++ app.py
@@ -1,5 +1,5 @@
-def add(a, b):
-    return a + b
+def add(a: int, b: int) -> int:
+    return a + b

[y/n]:
```

### 5. コンテキスト管理

```bash
# トークン使用量を定期的に確認
/context

# 会話が長くなったら圧縮
/compact

# トークン統計を表示
/cost
```

### 6. 段階的に進める

大きなタスクは小さなステップに分けて依頼：

```
1. まず、User モデルを作成してください
2. 次に、User モデルの CRUD 操作を追加してください
3. 最後に、テストを作成してください
```

### 7. CLAUDE.md を活用する

プロジェクト固有の規約や重要な情報を CLAUDE.md に記録：

```markdown
# プロジェクト概要
- このプロジェクトは...

# 開発規約
- インデント: 2 スペース
- 命名規則: snake_case
- 型ヒント必須

# よく使うコマンド
- ビルド: `npm run build`
- テスト: `npm test`
- リント: `npm run lint`
```

## セキュリティと制限事項

### ビルトインセキュリティ機能

Claude Code には以下のセキュリティ機能が組み込まれています：

- **デフォルトで読み取り専用**: ファイルへの書き込みには明示的な承認が必要
- **プロジェクトフォルダに制限**: プロジェクトフォルダ外のファイルは編集不可
- **サンドボックス実行**: ファイルシステムとネットワークの隔離
- **コマンドブロックリスト**: `curl`、`wget` などの危険なコマンドをブロック
- **ネットワーク要求の承認**: ネットワークアクセスには明示的な承認が必要
- **プロンプトインジェクション対策**: コンテキスト認識分析による防御

### ガードレールによる制限

このサンドボックス環境では、以下のコマンドが追加でブロックされます：

- システムの破壊的操作（`rm -rf /` など）
- ルートディレクトリのパーミッション変更
- Git の強制プッシュやハードリセット
- `/workspace` 以外のディレクトリへのファイル編集

### パッケージインストール

`npm install` や `apt install` などのコマンドは、実行前に確認が求められます。

### 責任

Claude Code は安全性を高めるための多くの機能を提供していますが、**最終的には提案されたコードとコマンドの安全性を確認する責任はユーザーにあります**。重要な変更を承認する前に必ず確認してください。

## トラブルシューティング

### インストールの健全性チェック

```bash
/doctor
```

このコマンドで Claude Code のインストール状態を確認できます。

### 認証エラーが発生する

```bash
# 認証情報をリセット
/logout

# または手動で削除
rm -rf ~/.config/claude-code/auth.json

# Claude Code を再起動して再認証
claude
```

### パフォーマンスが低下する

```bash
# 会話履歴を圧縮
/compact

# 主要なタスク間で再起動
exit
claude

# トークン使用量を確認
/context
/cost
```

### Claude が応答しない

```bash
# Claude Code を再起動
exit
claude

# バージョンを確認
claude --version

# 詳細ログで実行
claude --verbose
```

### ファイルが見つからないと言われる

```bash
# 現在のディレクトリを確認
pwd

# ファイルの存在を確認
ls -la

# ファイル参照構文を使用
@path/to/file.js
```

### 変更が保存されない

ホスト側のエディタでファイルを開いている場合、エディタを再読み込みしてください。

### Windows/WSL での問題

```bash
# WSL の場合、npm の OS 設定を変更
npm config set os linux

# または、ネイティブインストーラーを使用
curl -fsSL https://claude.ai/install.sh | bash

# または、npm インストーラーからネイティブビルドに移行
claude migrate-installer
```

## よくある質問

### Q: Claude Code は無料で使えますか？

A: Anthropic のアカウントに基づいた利用プランが適用されます。詳細は [Anthropic の公式サイト](https://www.anthropic.com/pricing) を確認してください。

### Q: インターネット接続は必要ですか？

A: はい、Claude Code は Anthropic の API と通信するため、インターネット接続が必要です。

### Q: 複数のプロジェクトで使用できますか？

A: はい、異なるディレクトリで `claude` を起動することで、複数のプロジェクトで使用できます。各プロジェクトは独自の `CLAUDE.md` を持つことができます。

### Q: Claude Code の設定をカスタマイズできますか？

A: はい、`/config` コマンドまたは `~/.config/claude-code/` ディレクトリ内の設定ファイルを編集できます。

### Q: 会話履歴は保存されますか？

A: はい、会話履歴はコンテナ内の `~/.config/claude-code/` に保存されます。コンテナを削除すると履歴も削除されます。`/resume` コマンドで以前の会話を再開できます。

### Q: どのモデルが使用されていますか？

A: デフォルトでは最新の Sonnet モデルが使用されます。`/model` コマンドまたは `--model` フラグでモデルを切り替えることができます。

### Q: MCP（Model Context Protocol）とは何ですか？

A: MCP は外部ツールやサービスを Claude Code に統合するための拡張プロトコルです。`/mcp` コマンドで MCP サーバーを管理できます。

## パフォーマンス最適化

### トークン使用量の管理

```bash
# トークン使用量を視覚化
/context

# 会話を圧縮してトークンを削減
/compact

# トークン統計を表示
/cost

# 会話を保存して新しくスタート
/export
/clear
```

### 効率的なワークフロー

1. **大きなディレクトリを `.gitignore` に追加**: `node_modules`、`dist` などの大きなディレクトリはコンテキストから除外
2. **定期的に `/compact` を使用**: 会話が長くなったら圧縮
3. **主要なタスク間で再起動**: 大きなタスクが完了したら新しいセッションを開始
4. **`/resume` で継続**: 以前の会話の重要なコンテキストを保持

## 高度な機能

### バックグラウンド処理

長時間実行されるコマンドをバックグラウンド化：

```bash
# Ctrl+B を押すと、プロセスがバックグラウンドで実行され、他の作業を続けられます
```

### 拡張思考モード

複雑な問題には拡張思考モードを使用：

```bash
# Tab キーを押して拡張思考モードを切り替え
# Claude がより深く考えて複雑なアーキテクチャ決定を行います
```

### Git 統合

Claude Code は Git と統合されています：

```bash
プロンプト: この変更をコミットしてください

# Claude が適切なコミットメッセージを生成してコミットを作成します
```

### CI/CD パイプラインでの使用

Claude Code はスクリプトや CI/CD パイプラインで使用できます：

```bash
# 非対話モードで使用
claude -p "lint エラーをすべて修正してください"

# JSON 出力
claude --output-format json -p "このコードの問題点をリストアップしてください"

# 最大ターン数を制限
claude --max-turns 5 "この機能を実装してください"
```

## CLAUDE.md ファイルのベストプラクティス

### 推奨される構造

```markdown
# プロジェクト名

## プロジェクト概要
- プロジェクトの簡単な説明
- 主要な技術とフレームワーク
- アーキテクチャパターン

## 開発規約

### コードスタイル
- インデント: 2 スペース
- 命名規則: camelCase
- 型アノテーション必須

### よく使うコマンド
```
ビルド:  npm run build
テスト:  npm test
リント:  npm run lint
デプロイ: npm run deploy
```

## 重要なワークフロー
- PR レビューの方法
- Git コミットメッセージの規約
- 開発環境のセットアップ方法

## 重要な注意点
- セキュリティに関する考慮事項
- サードパーティ統合
- 既知の制限事項
```

### CLAUDE.md の階層構造

Claude Code は以下の階層で CLAUDE.md を管理します：

1. **組織レベル**: `~/.config/claude-code/memory/org.md`
2. **チームレベル**: `~/.config/claude-code/memory/team.md`
3. **プロジェクトレベル**: `./CLAUDE.md`（プロジェクトルート）
4. **個人レベル**: `~/.config/claude-code/memory/personal.md`

### インポート構文

CLAUDE.md ファイルは他のファイルをインポートできます：

```markdown
@path/to/import.md
```

## 参考リソース

### 公式ドキュメント

- [Claude Code 公式ドキュメント](https://code.claude.com/docs)
- [クイックスタートガイド](https://code.claude.com/docs/en/quickstart.md)
- [CLI リファレンス](https://code.claude.com/docs/en/cli-reference.md)
- [スラッシュコマンド一覧](https://code.claude.com/docs/en/slash-commands.md)
- [セキュリティガイド](https://code.claude.com/docs/en/security.md)
- [トラブルシューティング](https://code.claude.com/docs/en/troubleshooting.md)

### コミュニティとサポート

- [Anthropic 公式サイト](https://www.anthropic.com/)
- [Claude API ドキュメント](https://docs.anthropic.com/)
- [GitHub: Claude Code Issues](https://github.com/anthropics/claude-code/issues)

### フィードバックの送信

Claude Code 内から直接フィードバックを送信できます：

```bash
/bug
```

このコマンドで Anthropic に問題を報告できます。

## アップデート

### Claude Code のアップデート

```bash
# Claude Code をアップデート
claude update

# または npm の場合
npm update -g @anthropic-ai/claude-code

# バージョン確認
claude --version
```

### 最新情報の入手

Claude Code は定期的にアップデートされます。`/status` コマンドで現在のバージョンとアカウント情報を確認できます。

---

**Happy Coding with Claude Code!**

このガイドは [Anthropic の公式ドキュメント](https://code.claude.com/docs) に基づいて作成されています。最新情報については公式ドキュメントを参照してください。
