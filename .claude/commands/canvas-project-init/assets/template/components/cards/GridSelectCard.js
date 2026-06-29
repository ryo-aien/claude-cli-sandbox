// ============================================================
// TEMPLATE: GridSelectCard — 2×2グリッドでラジオ選択
// 使いどき: 4件前後の短いテキスト候補（名前・プラン・コピー等）から1つ選ぶステップ。
//           選択肢が多い場合は CarouselCard を使うこと。
//
// content: { type:'[card_type]', label, sublabel, selected:{name}, otherItems:[{name},...] }
// ============================================================

import React, { useState } from 'react';
import { useCanvas } from '../../canvas/CanvasContext';
import { PrimaryButton } from '../ui';

/**
 * [カード名]: [このカードの使いどきを1行で説明]
 *
 * content: { type:'[card_type]', label, sublabel, selected:{name}, otherItems:[{name},...] }
 */
export default function GridSelectCard({ content }) {
  const { phaseColor, onConfirm } = useCanvas();
  const { label, sublabel, selected: defaultSelected, otherItems } = content;
  const allItems = [defaultSelected, ...otherItems];
  const [selectedIdx, setSelectedIdx] = useState(null);

  return (
    <div>
      {/* ---- ヘッダー ---- */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 700, fontSize: 18, color: phaseColor.accent }}>{label}</div>
        {sublabel && <div style={{ fontSize: 12, color: '#888' }}>{sublabel}</div>}
      </div>

      {/* ---- 2×2グリッド ---- */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {allItems.map((item, i) => {
          const isSelected = selectedIdx === i;
          return (
            <div
              key={i}
              onClick={() => setSelectedIdx(i)}
              style={{
                position: 'relative',
                border: isSelected ? `2px solid ${phaseColor.accent}` : '1.5px solid #dde3e8',
                borderRadius: 14,
                padding: '28px 20px',
                background: isSelected ? 'rgba(255,255,255,0.98)' : 'rgba(255,255,255,0.78)',
                cursor: 'pointer',
                minHeight: 120,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'border-color 0.2s, background 0.2s',
              }}
              onMouseEnter={e => { if (!isSelected) e.currentTarget.style.borderColor = '#b0c0cc'; }}
              onMouseLeave={e => { if (!isSelected) e.currentTarget.style.borderColor = '#dde3e8'; }}
            >
              {/* ラジオインジケーター */}
              <div style={{
                position: 'absolute', top: 12, right: 12,
                width: 22, height: 22, borderRadius: '50%',
                border: isSelected ? 'none' : `1.5px solid ${phaseColor.accent}`,
                background: isSelected ? phaseColor.accent : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s',
              }}>
                {isSelected && <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>✓</span>}
              </div>

              {/* アイテムテキスト */}
              <div style={{ fontWeight: 600, fontSize: 15, color: '#1a1a1a', textAlign: 'center' }}>
                {item.name}
              </div>
            </div>
          );
        })}
      </div>

      {/* ---- 確定ボタン ---- */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
        <PrimaryButton
          onClick={() => selectedIdx !== null && onConfirm(allItems[selectedIdx]?.name)}
          disabled={selectedIdx === null}
        >確定</PrimaryButton>
      </div>
    </div>
  );
}
