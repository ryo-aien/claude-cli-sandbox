// ============================================================
// TEMPLATE: SimpleCard — 表示のみ・確定ボタン付き
// 使いどき: 結果・情報・サマリーを表示してユーザーに確認・承認させるステップ。
//
// content: { type:'[card_type]', label, sublabel, ...表示データ }
// ============================================================

import React from 'react';
import { useCanvas } from '../../canvas/CanvasContext';
import { CardHeader, PrimaryButton } from '../ui';

/**
 * [カード名]: [このカードの使いどきを1行で説明]
 *
 * content: { type:'[card_type]', label, sublabel, ... }
 */
export default function SimpleCard({ content }) {
  const { phaseColor, onConfirm } = useCanvas();
  const { label, sublabel } = content;

  return (
    <div>
      <CardHeader label={label} sublabel={sublabel} accentColor={phaseColor.accent} />

      {/* ---- 表示エリア ---- */}
      <div style={{
        background: 'rgba(255,255,255,0.6)',
        border: `1px solid ${phaseColor.accent}30`,
        borderRadius: 14,
        padding: '20px 24px',
        marginBottom: 16,
      }}>
        {/* contentのデータをここで表示する */}
      </div>

      {/* ---- 確定ボタン ---- */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
        <PrimaryButton onClick={() => onConfirm()}>確定</PrimaryButton>
      </div>
    </div>
  );
}
