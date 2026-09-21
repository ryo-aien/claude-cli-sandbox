# Unified Web Design Standard v1.1.0（社内デザインガイドライン 要点）

出典: https://ryo-aien.github.io/icon-site-browser/design-guideline.html

Web UIの設計から運用までを統合した社内標準。`frontend-design` の審美的・アートディレクション的な指針（配色・タイポグラフィ・レイアウトの独自性）を、**アクセシビリティ・UXライティング・実装標準**の観点から補完するものとして扱う。両者が競合する場合、安全性・法令・アクセシビリティに関わる規定はこのガイドラインを優先する。

## 核となる原則（8項目）

1. **Task First** — ユーザーのタスク完了を装飾より優先
2. **Clarity over Cleverness** — 初見で理解できるUIを選択
3. **Accessible by Default** — アクセシビリティを後工程検査ではなく初期条件とする
4. **Consistent, not Uniform** — 同じ意味は同じ表現、無理な統一は避ける
5. **Content is Interface** — テキストやラベルもUIデザインの一部
6. **Responsive by Meaning** — 画面幅だけでなく情報優先度に応じて再配置
7. **Evidence Evolves the System** — ユーザー調査と実装知見で継続更新
8. **One Source of Truth** — トークンとコードで同期、二重管理を排除

## 判断優先順位

安全・法令・プライバシー → ユーザー目的達成 → 一貫性 → 運用性 → ブランド表現 → 新規性

## Foundations（基礎体系）

- **Color** — Semantic Token（役割ベース）で命名。状態を色だけで区別しない
- **Typography** — 本文16px基準。見出し階層は視覚サイズではなく文書構造に従う
- **Spacing** — 4px単位。基本スケール：4/8/12/16/24/32/48/64/96
- **Motion** — 目的は状態変化・因果関係の説明。Duration 100–400ms、`prefers-reduced-motion` を尊重
- **Dark Mode** — 反転ではなく Semantic Token値の差し替え。Shadow は Overlay・明度差で代替

## レスポンシブ設計

- **Breakpoint** — デバイス名ではなく「レイアウト破綻点」で決定。横スクロール非推奨。文字拡大時に機能を失わない設計
- **Grid** — Desktop 12-column標準。本文は最大幅制限。カード幅ではなく「読める最小幅」で折り返す

## コンポーネント必須項目

Purpose / When to use / Anatomy / Variants / States（default, hover, focus-visible, active, disabled, error等）/ Behavior / Content / Accessibility / Responsive / Design Tokens / Code API / Test cases

**必須状態** — Interactive componentは該当範囲で9状態を定義（default/hover/focus-visible/active/selected/disabled/loading/error/success）

## UXパターン標準

- **Loading** — 処理存在を即時告知。長時間は進捗・キャンセル・バックグラウンド化を検討
- **Empty State** — 理由と次アクションを表示
- **Error Recovery** — 何が起きたか・保持内容・次のステップを具体的に
- **Destructive Action** — 影響範囲を明示。Undo可能ならDialog確認より優先
- **Search & Filter** — 現在条件・件数・条件解除を明確化

## フォーム標準

- ラベルは必須（Placeholder代用禁止）
- エラーは入力内容を保持し、修正方法を具体的に記載
- 長いフォームは意味単位で分割し進捗表示
- Autocomplete属性（`autocomplete="name"` など）を活用
- **エラーサマリー** — 項目多数時は画面上部へ一覧＋アンカーリンク

## UXライティング（Voice & Tone）

**基本人格** — 明確・誠実・簡潔・落ち着き。ユーザーを責めない

- Buttonは動詞で開始
- 同概念は同用語（類義語装飾を避ける）
- 見出しは内容要約、「お知らせ」等抽象語のみ禁止
- エラー・空状態は次アクションまで記載
- Plain Language — 短文・受動態回避・直接ラベル（凡例依存をさせない）

## アクセシビリティ（WCAG 2.2 Level AA基準）

- **Perceivable** — 画像代替テキスト。色だけで意味を伝えない。テキスト・UI要素のコントラスト検証
- **Operable** — 全機能キーボード操作可能。Focus indicator 削除禁止。Drag/Swipe/Hover代替用意
- **Understandable** — ナビゲーション・ボタン・入力の一貫性。突然の画面変化禁止。エラー具体化
- **Robust** — Semantic HTML優先。ARIA は不足意味補足に。DOM順序と視覚順序逆転禁止

## キーボード操作（WAI-ARIA APG準拠）

| Widget | 主要キー |
|--------|---------|
| Tabs | 矢印・Home/End。Tabは外へ |
| Menu Button | Enter/Space/下矢印で開く。Escで閉じ元へ戻す |
| Combobox | 下矢印でリスト開く。矢印移動・Enterで確定・Escで保持閉じ |
| Dialog | 開時に内へフォーカス移動＆Trap。Escで閉じ元へ戻す |
| Disclosure | Enter/Spaceで開閉。`aria-expanded`で通知 |
| Listbox | 矢印・Home/End。複数選択時Shift+矢印で範囲選択 |
| Slider | 矢印・Home/End・Page Up/Down |
| Tooltip | Focus/Hover表示。Esc/フォーカス外で消去 |

## Design Token 3層構造

```
Global（生値）→ Semantic / Alias（役割）→ Component（部品固有）
```

- Figma変数とコード命名を一致
- Component内に直色・px値散在禁止
- Primitive から直参照しすぎず Semantic を介す

## 実装標準

- **HTML/CSS/JS** — Native HTML優先。意味と見た目の入れ替え禁止。JSなしでもコンテンツ構造保持。Layout は Flexbox/Grid。RTL対応時は論理プロパティ（`inset-inline-start`等）
- **Component API** — Props は視覚名でなく意味で設計（`variant="danger"` vs `red=true`）
- **Performance** — 画像形式・サイズ最適化。Web Font ウェイト限定。重要UIを巨大JSで操作不能にしない

## 品質保証（複数レイヤー）

Design / Content / Code / Visual / Interaction / Accessibility / User Research の7層検証

## 運用・ガバナンス

- **Component Lifecycle** — Proposal → Experimental → Stable → Deprecated → Removed
- **Versioning** — PATCH（表記修正）/ MINOR（新Component）/ MAJOR（API変更）
- **例外管理** — 理由・影響範囲・期限・標準復帰条件を記録

## Definition of Done（設計完了条件）

- ユーザー目的が一文で説明可能
- Loading/Empty/Error/Success/Disabled状態定義済み
- Mobile〜Wide 破綻なし
- 200% Zoom・Keyboard・Focus order考慮済み
- 見出し構造・ランドマーク・ラベル設計済み
- コントラスト・色以外の識別方法確認済み
- UIテキスト・エラー・空状態完成
- Token と Figma 意味一致
- 破壊操作・権限・個人情報確認済み
- Custom Widget は WAI-ARIA APG 準拠
- 多言語・RTL・文字数変動考慮済み
- ドキュメント化済み

## コンポーネント仕様書標準章立て

Overview / When to use / When not to use / Anatomy / Variants / States / Layout & Spacing / Responsive / Content / Behavior / Accessibility / Tokens / Code API / Examples / Tests / Changelog

## 国際化・多言語・RTL

- 固定幅に詰め込まない（言語で30–200%文字数変動）
- RTL対応時は論理プロパティ使用
- 日付・時刻・数値・通貨・氏名順をロケール切り替え
- アイコン意味が文化で変わらないか確認
- 和暦・郵便番号・全角半角ゆらぎはシステム正規化

## 参照体系（43資料統合）

デジタル庁 DADS / 同スタイルガイド / e-Gov / 東京都 Web / SmartHR / Ameba Spindle / LINE / GOV.UK / NHS / Apple HIG / Material Design / IBM Carbon / Microsoft Fluent 2 / Adobe Spectrum 2 / Shopify Polaris / Salesforce Lightning / SAP Fiori / Ant Design / WAI-ARIA APG 等から要素を統合再構成

---

**本質** — ルール遵守より「ユーザー目的達成」を優先。ただしアクセシビリティ・安全性・法令・データ保護は「好み」で例外化しない。企画から運用まで同じ判断体系を一貫適用する Living Standard。
