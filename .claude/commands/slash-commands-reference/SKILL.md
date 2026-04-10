---
name: commands-reference
description: Claude Code のデフォルト「/」コマンド（ビルトインコマンド＆バンドルスキル）のリファレンスを表示する
disable-model-invocation: true
---

# Claude Code スラッシュコマンド リファレンス

> 出典: https://code.claude.com/docs/en/commands
> 最終更新確認: 2026-03-18

`/` を入力するとすべてのコマンドが表示されます。文字を続けて入力するとフィルタリングできます。

> **注意**: 一部のコマンドはプラットフォーム・プラン・環境によって表示されない場合があります。
> 例: `/desktop` は macOS/Windows のみ、`/upgrade` や `/privacy-settings` は Pro/Max プランのみ。

---

## ビルトインコマンド一覧

`<arg>` は必須引数、`[arg]` は省略可能な引数を示します。

### セッション管理

| コマンド | 説明 |
|---|---|
| `/clear` | 会話履歴をクリアしてコンテキストを解放。エイリアス: `/reset`, `/new` |
| `/compact [instructions]` | 会話を圧縮（オプションで注目箇所を指定可能） |
| `/resume [session]` | IDまたは名前でセッションを再開、またはセッション選択画面を開く。エイリアス: `/continue` |
| `/export [filename]` | 現在の会話をプレーンテキストでエクスポート |
| `/rename [name]` | 現在のセッションに名前をつける。引数なしで会話履歴から自動生成 |
| `/branch [name]` | 現在の会話をこの時点でブランチ。エイリアス: `/fork` |
| `/rewind` | 会話やコードを以前の状態に巻き戻す。エイリアス: `/checkpoint` |
| `/exit` | CLI を終了。エイリアス: `/quit` |

### コンテキスト・コスト管理

| コマンド | 説明 |
|---|---|
| `/context` | 現在のコンテキスト使用量をカラーグリッドで可視化。最適化提案も表示 |
| `/cost` | トークン使用統計を表示 |
| `/usage` | プランの使用制限とレート制限の状態を表示 |
| `/stats` | 日次使用量、セッション履歴、ストリーク、モデル優先度を可視化 |
| `/add-dir <path>` | 現在のセッションに作業ディレクトリを追加 |

### モデル・設定

| コマンド | 説明 |
|---|---|
| `/model [model]` | AIモデルを選択・変更。矢印キーでエフォートレベルを調整可能。即時反映 |
| `/effort [low\|medium\|high\|max\|auto]` | モデルのエフォートレベルを設定。`max` は現セッションのみ（Opus 4.6 必須）。`auto` でデフォルトにリセット |
| `/fast [on\|off]` | ファストモードをON/OFF切り替え |
| `/config` | 設定インターフェースを開く（テーマ、モデル、出力スタイルなど）。エイリアス: `/settings` |
| `/theme` | カラーテーマを変更（ライト/ダーク、色覚サポート、ANSIテーマ） |
| `/color [color\|default]` | 現セッションのプロンプトバーの色を設定。利用可能: `red`, `blue`, `green`, `yellow`, `purple`, `orange`, `pink`, `cyan` |
| `/vim` | VimモードとNormalモードを切り替え |
| `/terminal-setup` | Shift+Enter などのターミナルキーバインドを設定 |
| `/keybindings` | キーバインド設定ファイルを開く・作成 |

### 認証・アカウント

| コマンド | 説明 |
|---|---|
| `/login` | Anthropic アカウントにサインイン |
| `/logout` | Anthropic アカウントからサインアウト |
| `/status` | バージョン、モデル、アカウント、接続状態を表示（設定 Status タブ） |
| `/privacy-settings` | プライバシー設定の確認・更新（Pro/Max プランのみ） |
| `/upgrade` | 上位プランへのアップグレードページを開く（Pro/Max プランのみ） |
| `/extra-usage` | レート制限時に作業を継続するための追加使用量を設定 |

### 開発・コードレビュー

| コマンド | 説明 |
|---|---|
| `/diff` | 未コミット変更とターンごとの差分をインタラクティブに表示。左右矢印でgit diff/ターン切り替え |
| `/security-review` | 現ブランチの変更をセキュリティ脆弱性の観点で分析（インジェクション、認証、データ露出など） |
| `/pr-comments [PR]` | GitHub プルリクエストのコメントを取得・表示。`gh` CLI 必須 |
| `/plan` | プロンプトから直接プランモードに入る |
| `/review` | **非推奨**。代替: `claude plugin install code-review@claude-code-marketplace` |

### メモリ・プロジェクト

| コマンド | 説明 |
|---|---|
| `/init` | `CLAUDE.md` でプロジェクトを初期化。`CLAUDE_CODE_NEW_INIT=true` でスキル/hooks/メモリも対話的に設定 |
| `/memory` | `CLAUDE.md` ファイルを編集、オートメモリの有効化/無効化、オートメモリエントリの確認 |

### スキル・エージェント・拡張

| コマンド | 説明 |
|---|---|
| `/skills` | 利用可能なスキルを一覧表示 |
| `/agents` | エージェント設定を管理 |
| `/permissions` | 権限の確認・更新。エイリアス: `/allowed-tools` |
| `/hooks` | ツールイベントのフック設定を確認 |
| `/mcp` | MCP サーバー接続と OAuth 認証を管理 |
| `/plugin` | Claude Code プラグインを管理 |
| `/reload-plugins` | アクティブなプラグインをすべて再読み込み（再起動不要） |
| `/sandbox` | サンドボックスモードを切り替え（対応プラットフォームのみ） |

### インサイト・分析

| コマンド | 説明 |
|---|---|
| `/insights` | セッション分析レポートを生成（プロジェクト領域、インタラクションパターン、摩擦点など） |

### ユーティリティ・その他

| コマンド | 説明 |
|---|---|
| `/help` | ヘルプと利用可能なコマンドを表示 |
| `/btw <question>` | 会話履歴に残さずにクイック質問 |
| `/copy [N]` | 最後のアシスタント応答をクリップボードにコピー。`N` で N 番目前の応答をコピー |
| `/tasks` | バックグラウンドタスクの一覧と管理 |
| `/doctor` | Claude Code のインストールと設定を診断・検証 |
| `/release-notes` | 最新バージョンのチェンジログを表示 |
| `/feedback [report]` | Claude Code についてフィードバックを送信。エイリアス: `/bug` |

### IDE・デスクトップ・モバイル連携

| コマンド | 説明 |
|---|---|
| `/ide` | IDE インテグレーションの管理と状態表示 |
| `/desktop` | 現セッションを Claude Code Desktop アプリで継続（macOS/Windows のみ）。エイリアス: `/app` |
| `/mobile` | Claude モバイルアプリのダウンロード QR コードを表示。エイリアス: `/ios`, `/android` |
| `/statusline` | Claude Code のステータスラインを設定 |
| `/remote-control` | このセッションを claude.ai からのリモートコントロール対象にする。エイリアス: `/rc` |
| `/remote-env` | `--remote` で起動する Web セッションのデフォルトリモート環境を設定 |

### インテグレーション

| コマンド | 説明 |
|---|---|
| `/install-github-app` | リポジトリへの Claude GitHub Actions アプリをセットアップ |
| `/install-slack-app` | Claude Slack アプリをインストール（ブラウザで OAuth フロー） |
| `/chrome` | Claude in Chrome の設定 |
| `/voice` | プッシュトゥトーク音声入力のON/OFF切り替え（Claude.ai アカウント必須） |

### その他

| コマンド | 説明 |
|---|---|
| `/passes` | 友人に Claude Code の無料1週間を贈る（対象アカウントのみ表示） |
| `/stickers` | Claude Code ステッカーを注文 |

---

## バンドルスキル（組み込みスキル）

ビルトインコマンドとは異なり、これらは **プロンプトベースのスキル** で、ファイル読み込みや並列エージェント起動など柔軟に動作します。

| スキル | 説明 |
|---|---|
| `/batch <instruction>` | コードベース全体に対して大規模な変更を並列実行。作業を5〜30の独立したユニットに分解し、git worktree で並列エージェントを起動。各エージェントが実装・テスト・PRを作成。git リポジトリ必須。例: `/batch migrate src/ from Solid to React` |
| `/claude-api` | プロジェクトの言語（Python, TypeScript, Java, Go, Ruby, C#, PHP, cURL）に応じた Claude API リファレンスを読み込む。ツール使用、ストリーミング、バッチ、構造化出力などをカバー。`anthropic` などのインポートがあると自動起動 |
| `/debug [description]` | 現在の Claude Code セッションのデバッグログを読んでトラブルシューティング。問題の説明を渡すと分析を絞り込める |
| `/loop [interval] <prompt>` | セッションが開いている間、指定間隔でプロンプトを繰り返し実行。デプロイ監視や PR の定期チェックなどに使用。例: `/loop 5m check if the deploy finished` |
| `/simplify [focus]` | 最近変更したファイルのコード品質・効率・再利用性を並列3エージェントでレビューして修正。例: `/simplify focus on memory efficiency` |

---

## MCP プロンプト

MCP サーバーが公開するプロンプトもコマンドとして利用できます。
形式: `/mcp__<server>__<prompt>`
接続されたサーバーから動的に検出されます。

---

## 関連リンク

- [スキル（カスタムコマンド）](/en/skills)
- [インタラクティブモード（ショートカット等）](/en/interactive-mode)
- [CLI リファレンス（起動時フラグ）](/en/cli-reference)
- [サブエージェント](/en/sub-agents)
- [パーミッション](/en/permissions)
