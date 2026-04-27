import React from 'react';
import { WikiEntry } from '../data/mockData';
import { TypeBadge, ConstraintPill, SourceBadge } from './Badge';

interface EntryReferenceCardProps {
  entry: WikiEntry;
}

export function EntryReferenceCard({ entry }: EntryReferenceCardProps) {
  return (
    <div style={{
      marginTop: '8px',
      padding: '8px 10px',
      borderRadius: '6px',
      border: '0.5px solid #E0E0E0',
      backgroundColor: '#F7F7F7',
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '2px' }}>
        <span style={{ fontWeight: 500, fontSize: '11px', color: '#0D0D0D' }}>{entry.title}</span>
        <span style={{ fontSize: '10px', color: '#AAAAAA', marginLeft: '5px', fontFamily: 'monospace' }}>{entry.id}</span>
      </div>
      <p style={{ fontSize: '11px', color: '#888888', lineHeight: 1.5, margin: '0 0 5px' }}>
        {entry.body.length > 120 ? entry.body.slice(0, 120) + '…' : entry.body}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
        {entry.type && <TypeBadge type={entry.type} />}
        {entry.constraints.map(c => (
          <ConstraintPill key={c} constraint={c} />
        ))}
        {entry.source && <SourceBadge source={entry.source} />}
        <span style={{ fontSize: '10px', color: '#AAAAAA', marginLeft: 'auto', whiteSpace: 'nowrap' }}>
          {entry.contributor} · {entry.timestamp}
        </span>
      </div>
    </div>
  );
}
