# Canvas Framework Reference

## ファイル構成

```
src/
  canvas/
    CanvasContext.js    ← Context提供・useCanvas()フック
    CanvasRegistry.js  ← type→Componentマップ（登録テーブル）
    CanvasRenderer.js  ← typeを見てRegistryから解決して描画
  data/
    mockFlow.js        ← プロジェクト定義（毎回上書き）
  components/
    cards/             ← カードコンポーネント（毎回上書き・追加）
```

## mockFlow.js の構造

```js
export const PHASES = {
  HOME: 'home',
  [PHASE_KEY]: '[phase_id]',  // フェーズキー定義
};

export const PHASE_COLORS = {
  [PHASES.HOME]: { bg: '#ebebeb', chat: '#e4e4e4', accent: '#111', agentColor: '#111' },
  [PHASES.[PHASE_KEY]]: { bg: '[背景色]', chat: '[チャット背景色]', accent: '[アクセント色]', agentColor: '[エージェント色]' },
};

export const AGENT_ICONS = {
  agent: { emoji: '✳', color: '#111', bg: '#e8e8e8', label: 'エージェント' },
  [agent_key]: { emoji: '[emoji]', color: '[color]', bg: '[bg]', label: '[表示名]' },
};

export const QUICK_ACTIONS = ['[アクション1]', '[アクション2]'];

export const FLOW_STEPS = [
  { id: 'welcome', phase: PHASES.HOME, type: 'welcome' },
  // --- [PHASE_NAME] ---
  {
    id: '[step_id]',
    phase: PHASES.[PHASE_KEY],
    type: 'split_transition' | 'card',
    chatMessages: [
      { id: '[msg_id]', agent: '[agent_key]', text: '[発言]', delay: 600 },
      { id: '[msg_id]', type: 'user', text: '[発言]', delay: 300 },
    ],
    cardContent: { type: '[card_type]', ...cardProps },
    chatInputForm: { type: 'theme_keywords', themePlaceholder: '', keywordCount: 3 }, // 任意
    topInputs: { theme: '...', keywords: [] }, // 任意
    topPanel: { type: 'visual_settings', prompt: '', ratio: '' }, // 任意
    sectionTitle: '[セクションタイトル]', // 任意
    cardTitle: '[カードタイトル]',        // 任意
  },
];
```

## ステップのtype

| type | 説明 |
|------|------|
| `welcome` | ウェルカム画面（HOME専用、id='welcome'固定） |
| `split_transition` | チャットのみ表示（Canvas側は待機アニメーション） |
| `card` | チャット＋Canvasにカードを表示 |

## loadingステップの自動進行

`cardContent.type === 'loading'` のステップは chatMessages の再生が終わると自動で次ステップへ進む。

```js
{ type: 'loading', label: '[ラベル]', sublabel: '[英語サブ]', loadingText: '[処理中テキスト]' }
```

## chatMessages の delay ガイド

- エージェントの最初の発言: `delay: 600`
- 続けての発言: `delay: 400〜600`
- ユーザー発言（モック）: `delay: 200〜300`
- 長いテキストを読む時間が必要な場合: `delay: 800〜1200`

id は step内でユニークであること（例: `'a1'`, `'r2'`, `'u_form'`）。

## カードコンポーネントの規約

```jsx
import { useCanvas } from '../../canvas/CanvasContext';

export default function MyCard({ content }) {
  const { phaseColor, onConfirm, onExpandOther, onCollapseOther } = useCanvas();
  // ...
}
```

- `props` は `content` のみ
- `phaseColor / onConfirm / onExpandOther / onCollapseOther` は必ず `useCanvas()` から取得
- カルーセル対応カードは `useCarouselCard` フックを使う

## カルーセル対応カードのパターン

```jsx
import useCarouselCard from '../../hooks/useCarouselCard';
import OtherCarousel from '../OtherCarousel';
import { SelectedCardFrame, CardActions, CarouselWrapper } from '../ui';

export default function MyCard({ content }) {
  const { phaseColor, onConfirm, onExpandOther, onCollapseOther } = useCanvas();
  const { selected, otherItems, label, sublabel } = content;

  const {
    allItems, showCarousel, selectedIdx, currentItem,
    handleOther, handleClose, handleCarouselSelect, handleConfirm,
  } = useCarouselCard({ defaultItem: selected, otherItems, onConfirm, onExpandOther, onCollapseOther });

  const carouselItems = allItems.map((item, i) => ({
    id: i,
    renderFn: () => <MyItemCard item={item} />,
  }));

  if (showCarousel) {
    return (
      <CarouselWrapper>
        <OtherCarousel
          items={carouselItems}
          selectedIdx={selectedIdx}
          onSelect={handleCarouselSelect}
          onConfirm={handleConfirm}
          onClose={handleClose}
          phaseColor={phaseColor}
          closeLabel="閉じる"
        />
      </CarouselWrapper>
    );
  }

  return (
    <div>
      <CardHeader label={label} sublabel={sublabel} accentColor={phaseColor.accent} />
      <SelectedCardFrame accentColor={phaseColor.accent}>
        {/* currentItem の内容を表示 */}
      </SelectedCardFrame>
      <CardActions onOther={handleOther} otherCount={allItems.length - 1} onConfirm={handleConfirm} />
    </div>
  );
}
```

## CanvasRegistry.js への登録

```js
import MyCard from '../components/cards/MyCard';
registerCard('my_card_type', MyCard);
```

既存の登録は保持したまま、新しいカードを末尾に追加する。

## 既存カード種別（再利用可能）

| type | 使いどき | content の主なフィールド |
|------|---------|------------------------|
| `loading` | API処理・生成中の待機。chatMessages再生終了後に自動で次ステップへ進む | `label`, `sublabel`, `loadingText` |
| `idea` | AIが生成した複数のアイデア・企画案から1つ選ぶ。初回は2秒ローディングを挟む | `theme`, `keywords`, `selected:{title,description}`, `otherItems:[]` |
| `persona` | ターゲットクラスタから生成した仮想人物（ペルソナ）を選ぶ。インタビュー対象の選択にも使う | `label`, `sublabel`, `persona:{name,age,job,traits[]}`, `otherItems:[]` |
| `proposition` | 価値提案・訴求軸を複数案から選ぶ。着眼点・インサイト・差別化・ポジショニングをリスト表示 | `label`, `sublabel`, `selected:{title,tagline,points[]}`, `otherItems:[]` |
| `interview_result` | インタビュー結果・ユーザーの声をクォート形式で表示。複数人の発言をカルーセルで切り替え可能 | `label`, `sublabel`, `quote`, `speaker`, `otherItems:[{quote,speaker}]` |
| `naming_select` | 商品名・コピー・プラン名など短いテキスト候補を2×2グリッドで並べて1つ選ぶ | `label`, `sublabel`, `selected:{name}`, `otherItems:[{name}]` |
| `cluster_chart` | 受容度×関与度の2軸バブルチャートでセグメントを可視化してターゲットを選ぶ | `label`, `sublabel`, `clusters:[{name,x,y,size,color}]` |
| `banner_grid` | 訴求軸（列）×ターゲット（行）の組み合わせグリッドで広告案を比較・選択。詳細意図のオーバーレイ表示あり | `label`, `sublabel`, `axes:[]`, `targets:[]`, `intents:{'軸×ターゲット':{headline,body}}` |
| `cm_storyboard` | CMコンテ・動画シナリオを複数案カード横並びで表示し採用案を選ぶ。カルーセルで全案閲覧可能 | `label`, `sublabel`, `stories:[{title,scenes[],selected?}]` |
| `agent_list` | セッション開始時にAIエージェントチームを紹介する。選択操作なし・表示のみ。AGENT_ICONSから自動取得 | （contentフィールド不要） |

## フェーズカラーの例

| 雰囲気 | bg | accent |
|--------|-----|--------|
| グリーン系 | `#e6f0e8` | `#419655` |
| オレンジ系 | `#edebdc` | `#c8900a` |
| ブルー系  | `#e7f0f3` | `#1d72cb` |
| レッド系  | `#f0dfe1` | `#be232f` |
| パープル系 | `#e8e6f5` | `#6a60c0` |
| ニュートラル | `#ebebeb` | `#111` |
