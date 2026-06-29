---
name: canvas-project-init
description: チャットUI＋Canvas表示を組み合わせたReactアプリのプロジェクトを、ユーザーと対話しながら一貫して生成するskill。ユーザーが `/canvas-project-init` と入力したときに発動する。assets/template/ の雛形ファイルをベースに mockFlow.js・カードコンポーネント・CanvasRegistry.js を生成・上書きする。見積もりアプリ、ライティングアプリなど、チャットで選択・入力を進めてCanvasに結果を表示するあらゆるプロジェクトに対応。
---

# Canvas Project Init

フレームワーク仕様・カード種別一覧は `references/framework.md` を参照。

## テンプレートファイル

`assets/template/` に雛形が用意されている。**必ずこれをベースに生成すること。**

```
assets/template/
  data/
    mockFlow.js              ← フロー定義の雛形
  canvas/
    CanvasRegistry.js        ← Registry雛形（既存登録済み）
  components/cards/
    SimpleCard.js            ← 表示のみ＋確定ボタン
    CarouselCard.js          ← 複数候補をカルーセルで選択
    GridSelectCard.js        ← 2×2グリッドでラジオ選択
```

## 対話ステップ

### Step 1 — プロジェクト概要ヒアリング

以下を1メッセージで質問する：

- アプリの目的（何をするアプリか）
- エンドユーザーが達成したいこと
- 想定する主なフェーズ数（目安）

### Step 2 — フェーズ設計

ヒアリング内容をもとに **フェーズ案** を提示し、確認する：

```
フェーズ案：
1. [フェーズ名] — [説明]  カラー: [色イメージ]
2. ...
```

- カラーは `references/framework.md` のフェーズカラー例から選ぶ
- ユーザーが修正・追加したらそれに従う

### Step 3 — ステップ設計（フェーズごと）

フェーズを1つずつ確認しながら、各ステップを設計する。

各ステップで決めること：
1. **チャット発言** — どのエージェントが何を言うか、ユーザーへの問いかけ
2. **Canvas表示** — カード種別（既存 or 新規）と表示内容
3. **ユーザーの操作** — 選択 / 入力フォーム / 確定ボタンのみ

カード種別の選び方：

| 状況 | 使うテンプレート / 既存カード |
|------|---------------------------|
| 結果・情報を表示して確認させる | `SimpleCard.js` |
| AI生成の複数案から1つ選ぶ | `CarouselCard.js` |
| 4件前後の短い候補から選ぶ | `GridSelectCard.js` / 既存 `naming_select` |
| セグメントをバブルチャートで選ぶ | 既存 `cluster_chart` |
| 訴求軸×ターゲットのグリッド | 既存 `banner_grid` |
| シナリオ形式の複数案を選ぶ | 既存 `cm_storyboard` |
| 処理待ち（自動進行） | 既存 `loading` |

既存カードで代替できる場合は新規作成しない。

### Step 4 — 確認と生成

全ステップを一覧表示して最終確認を取る：

```
【プロジェクト名】

フェーズ1: [名前]（カラー: [accent色]）
  [step_id]: split_transition — [チャット概要]
  [step_id]: loading         — [処理内容]
  [step_id]: card            — Canvas: [card_type] / [概要]
  ...

生成ファイル:
- src/data/mockFlow.js（上書き）
- src/components/cards/[CardName].js（新規: N件）
- src/canvas/CanvasRegistry.js（上書き）
```

確認が取れたら生成を開始する。

## 生成手順

### 1. mockFlow.js
`assets/template/data/mockFlow.js` を読み込み、以下を埋める：
- `PHASES` にフェーズキーを追加
- `PHASE_COLORS` に各フェーズのカラーを設定
- `AGENT_ICONS` にプロジェクト固有エージェントを追加
- `QUICK_ACTIONS` をプロジェクト内容に合わせて設定
- `FLOW_STEPS` を対話で決めたステップで構成する
  - 最初は必ず `{ id: 'welcome', phase: PHASES.HOME, type: 'welcome' }`
  - フェーズ境界は `split_transition` で開始
  - 処理待ちは `loading` ステップを挟む
  - `chatMessages` の id はファイル全体でユニーク

### 2. カードコンポーネント
新規カードが必要な場合：
- UIの種類に合ったテンプレートファイルを読み込む
  - 表示のみ → `assets/template/components/cards/SimpleCard.js`
  - カルーセル選択 → `assets/template/components/cards/CarouselCard.js`
  - グリッド選択 → `assets/template/components/cards/GridSelectCard.js`
- ファイル名・関数名・JSDocをプロジェクト内容に合わせて変更
- `ItemCard` などの内部コンポーネントにプロジェクト固有のUIを実装
- ビジュアル（SVG・CSS）はプロジェクトのテーマに合わせてゼロから作る
- `src/components/cards/[CardName].js` として保存

### 3. CanvasRegistry.js
`assets/template/canvas/CanvasRegistry.js` を読み込み：
- 新規カードの `import` と `registerCard` を末尾に追加
- 既存の登録はすべて保持
- `src/canvas/CanvasRegistry.js` として保存

## 生成後

`npm run build` を実行してビルドエラーがないことを確認する。
エラーがあれば自己修正してから完了を報告する。
