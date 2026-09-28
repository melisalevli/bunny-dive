// This file displays the user's progress through the rabbit hole and shows the history of topics they have explored.

import React from 'react';
import { TARGET_DEPTH, pad2 } from '../utils/constants';

export const ProgressBar = ({ visitedCount, history, t, onSelectHistoryItem }) => {
  return (
    <footer style={{ borderTop: '3px solid var(--purple)', padding: '16px 48px' }}>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', gap: '4px' }}>
          {Array.from({ length: TARGET_DEPTH }).map((_, i) => (
            <div key={i} style={{ width: 10, height: 10, border: '1px solid var(--lavender)', background: i < visitedCount ? 'var(--mint)' : 'transparent' }} />
          ))}
        </div>
        <span style={{ fontSize: 12, opacity: 0.7 }}>{visitedCount} / {TARGET_DEPTH} {t.exploredText}</span>
      </div>

      <div style={{ display: 'flex', gap: '14px', overflowX: 'auto', fontSize: 13 }}>
        {history.map((tItem, i) => (
          <span key={i} style={{ opacity: i === history.length - 1 ? 1 : 0.5, whiteSpace: 'nowrap' }}>
            <button
              onClick={() => onSelectHistoryItem && onSelectHistoryItem(tItem)}
              style={{ background: 'transparent', border: 'none', color: 'var(--mint)', fontWeight: 'bold', fontSize: 'inherit', fontFamily: 'inherit', padding: 0, cursor: 'pointer' }}
            >
              {pad2(i + 1)}
            </button>{' '}
            {tItem}
          </span>
        ))}
      </div>
    </footer>
  );
};