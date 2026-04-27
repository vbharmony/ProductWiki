import React, { useState, useEffect } from 'react';
import { WikiEntry } from '../data/mockData';
import { TypeBadge, ConstraintPill, SourceBadge, TagBadge } from './Badge';

interface EntryCardProps {
  entry: WikiEntry;
  isNew?: boolean;
}

export function EntryCard({ entry, isNew }: EntryCardProps) {
  const [hovered, setHovered] = useState(false);
  const [highlight, setHighlight] = useState(isNew ?? false);

  useEffect(() => {
    if (isNew) {
      setHighlight(true);
      const timer = setTimeout(() => setHighlight(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isNew]);

  let borderColor = '#E0E0E0';
  if (highlight) borderColor = '#1D9E75';
  else if (hovered) borderColor = '#CCCCCC';

  return (
    <div
      style={{
        border: `0.5px solid ${borderColor}`,
        borderRadius: '8px',
        padding: '11px 13px',
        marginBottom: '7px',
        backgroundColor: '#FFFFFF',
        boxShadow: hovered ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
        cursor: 'pointer',
        transition: 'border-color 0.3s, box-shadow 0.15s',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Title row */}
      <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '2px' }}>
        <span style={{ fontSize: '13px', fontWeight: 500, color: '#0D0D0D', lineHeight: 1.3 }}>
          {entry.title}
        </span>
        <span style={{
          fontSize: '10px',
          fontWeight: 400,
          color: '#AAAAAA',
          marginLeft: '6px',
          fontFamily: 'monospace',
          whiteSpace: 'nowrap',
        }}>
          {entry.id}
        </span>
      </div>

      {/* Body */}
      <p style={{
        fontSize: '12px',
        fontWeight: 400,
        color: '#888888',
        lineHeight: 1.55,
        margin: '3px 0 7px',
      }}>
        {entry.body}
      </p>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>
        {entry.type && <TypeBadge type={entry.type} />}
        {entry.constraints.map(c => (
          <ConstraintPill key={c} constraint={c} />
        ))}
        {entry.source && <SourceBadge source={entry.source} />}
        {entry.tags?.map(tag => (
          <TagBadge key={tag} tag={tag} />
        ))}
        <span style={{
          fontSize: '10px',
          fontWeight: 400,
          color: '#AAAAAA',
          marginLeft: 'auto',
          whiteSpace: 'nowrap',
        }}>
          {entry.contributor} · {entry.timestamp}
        </span>
      </div>
    </div>
  );
}