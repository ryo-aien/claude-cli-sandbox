// ============================================================
// PROJECT FLOW DEFINITION
// このファイルをプロジェクトごとに上書きする。
// フレームワーク本体（canvas/*, components/ChatPanel等）は触らない。
// ============================================================

// --- フェーズ定義 ---
export const PHASES = {
  HOME: 'home',
  // 例: ESTIMATE: 'estimate',
  // 例: REVIEW:   'review',
};

// --- フェーズカラー ---
// bg:チャット背景 / chat:チャットパネル背景 / accent:強調色 / agentColor:エージェントアイコン色
export const PHASE_COLORS = {
  [PHASES.HOME]: { bg: '#ebebeb', chat: '#e4e4e4', accent: '#111', agentColor: '#111' },
  // [PHASES.ESTIMATE]: { bg: '#e6f0e8', chat: '#d2dcd4', accent: '#419655', agentColor: '#419655' },
};

// --- エージェント定義 ---
// emoji / color / bg / label を設定する。
// agent（汎用）は必須。プロジェクト固有のエージェントを追加する。
export const AGENT_ICONS = {
  agent: { emoji: '✳',  color: '#111',    bg: '#e8e8e8', label: 'エージェント' },
  // 例: consultant: { emoji: '💼', color: '#419655', bg: '#e6f0e8', label: 'コンサルタント' },
};

// --- ウェルカム画面のクイックアクション ---
export const QUICK_ACTIONS = [
  // 例: '見積もりを作りたい',
  // 例: 'その他',
];

// --- フローステップ定義 ---
// 各ステップの type:
//   'welcome'          → ウェルカム画面（HOME専用・id='welcome'固定）
//   'split_transition' → チャットのみ（Canvas側は待機アニメーション）
//   'card'             → チャット＋Canvasにカードを表示
//
// cardContent.type が 'loading' のステップはchatMessages再生後に自動で次へ進む。
export const FLOW_STEPS = [
  // ウェルカム（変更不要）
  {
    id: 'welcome',
    phase: PHASES.HOME,
    type: 'welcome',
  },

  // ============================================================
  // フェーズ1: [フェーズ名]
  // ============================================================

  // split_transition: フェーズ開始。チャットでエージェント紹介→入力フォーム表示
  {
    id: 'phase1_start',
    phase: PHASES.HOME, // → PHASES.[YOUR_PHASE] に変更
    type: 'split_transition',
    chatMessages: [
      { id: 'p1_a1', agent: 'agent', text: 'こんにちは。\nどのようなことをお手伝いしますか？', delay: 600 },
    ],
    // ユーザーにテキスト入力させる場合:
    // chatInputForm: { type: 'theme_keywords', themePlaceholder: '', keywordCount: 3 },
  },

  // loading: 処理中（自動進行）
  {
    id: 'phase1_loading',
    phase: PHASES.HOME, // → PHASES.[YOUR_PHASE] に変更
    type: 'card',
    cardContent: { type: 'loading', label: '[ラベル]', sublabel: '[英語サブ]', loadingText: '処理中' },
    chatMessages: [],
  },

  // card: 結果表示
  {
    id: 'phase1_result',
    phase: PHASES.HOME, // → PHASES.[YOUR_PHASE] に変更
    type: 'card',
    sectionTitle: '[セクションタイトル]',
    cardContent: {
      type: '[card_type]', // カード種別を指定（framework.md参照）
      label: '[ラベル]',
      sublabel: '[英語サブ]',
      // カード種別ごとのフィールドをここに追加
    },
    chatMessages: [
      { id: 'p1_a2', agent: 'agent', text: '結果をご確認ください。', delay: 400 },
    ],
  },
];
