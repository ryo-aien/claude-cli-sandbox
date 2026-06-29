// ============================================================
// TEMPLATE: CarouselCard — 複数候補から1つ選ぶ（カルーセル付き）
// 使いどき: AIが生成した複数案をユーザーが比較・選択するステップ。
//           「他を見る」でカルーセル展開、選択後「確定」で次へ進む。
//
// content: { type:'[card_type]', label, sublabel, selected:{...}, otherItems:[...] }
// ============================================================

import React from 'react';
import OtherCarousel from '../OtherCarousel';
import useCarouselCard from '../../hooks/useCarouselCard';
import { CardHeader, SelectedCardFrame, CardActions, CarouselWrapper } from '../ui';
import { useCanvas } from '../../canvas/CanvasContext';

/**
 * [カード名]: [このカードの使いどきを1行で説明]
 *
 * content: { type:'[card_type]', label, sublabel, selected:{...}, otherItems:[...] }
 */
export default function CarouselCard({ content }) {
  const { phaseColor, onConfirm, onExpandOther, onCollapseOther } = useCanvas();
  const { label, sublabel, selected, otherItems } = content;

  const {
    allItems, showCarousel, selectedIdx, currentItem,
    handleOther, handleClose, handleCarouselSelect, handleConfirm,
  } = useCarouselCard({ defaultItem: selected, otherItems, onConfirm, onExpandOther, onCollapseOther });

  // カルーセル内の各アイテムの表示
  const carouselItems = allItems.map((item, i) => ({
    id: i,
    renderFn: () => <ItemCard item={item} />,
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

      {/* ---- 選択中アイテムの表示 ---- */}
      <SelectedCardFrame accentColor={phaseColor.accent}>
        <ItemCard item={currentItem} />
      </SelectedCardFrame>

      {/* ---- 「他を見る」＋「確定」ボタン ---- */}
      <CardActions
        onOther={handleOther}
        otherCount={allItems.length - 1}
        onConfirm={handleConfirm}
        confirmColor={phaseColor.accent}
      />
    </div>
  );
}

// カルーセル・選択枠内で共通利用するアイテム表示
function ItemCard({ item }) {
  return (
    <div>
      {/* item のデータをここで表示する */}
    </div>
  );
}
