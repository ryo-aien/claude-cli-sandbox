---
name: 3d-card-carousel
description: 3DカードカルーセルUIコンポーネントの作成。CSS 3D transformとperspectiveを使用した回転カルーセル、カードギャラリー、チームメンバー紹介、製品ショーケースなどのインタラクティブな3D表示を作成する際に使用。「カルーセル」「3Dカード」「回転ギャラリー」「チーム紹介」などのリクエストで発動。
disable-model-invocation: true
---

# 3D Card Carousel

CSS 3D transformsを使用した無限ループ対応の3Dカードカルーセルを作成する。

## テンプレート

`assets/carousel-template.html` に完全動作するテンプレートあり。このテンプレートをベースにカスタマイズする。

## 主要な技術要素

### CSS変数（カスタマイズポイント）
```css
:root {
  --card-w: 240px;      /* カード幅 */
  --card-h: 320px;      /* カード高さ */
  --duration: 900ms;    /* アニメーション時間 */
  --ease: cubic-bezier(.25,.8,.25,1);  /* イージング */
  --radius: 420px;      /* 円周の半径（奥行き） */
}
```

### 3D空間の構成
```
.stage (perspective: 1200px)
  └── .carousel (transform-style: preserve-3d)
        └── .card × N (rotateY + translateZ)
```

### カード配置の計算
```javascript
const step = 360 / n;  // n = カード枚数
cards.forEach((card, i) => {
  card.style.transform = `rotateY(${i * step}deg) translateZ(${radius}px)`;
});
```

### 無限ループの実装
- `angle`変数で回転角度を蓄積（リセットしない）
- `active`インデックスは`% n`で正規化
- 回転方向: next → `angle -= step`, prev → `angle += step`

## カスタマイズ例

### カード枚数変更
HTMLで`.card`要素を増減するだけで自動対応。

### カードコンテンツ
```html
<article class="card" data-i="0">
  <div>
    <div class="avatar"><img src="..." alt=""></div>
    <div class="name">名前</div>
    <div class="role">役割</div>
  </div>
</article>
```

### 視覚効果（data-state属性）
- `front`: 正面カード（フル表示）
- `side`: 隣接カード（opacity: 0.55, blur軽め）
- `back`: 背面カード（opacity: 0.25, blur強め）

## 使用時の注意

1. カード枚数は3枚以上を推奨（2枚以下だと見栄えが悪い）
2. `--radius`を大きくすると円周が広がり、カード同士の間隔が開く
3. 画像はpicsum.photosなどのプレースホルダーを使用可能
