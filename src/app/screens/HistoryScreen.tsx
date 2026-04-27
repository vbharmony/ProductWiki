import React from 'react';
import { HistoryEntry } from '../data/mockData';
import { SourceBadge } from '../components/Badge';

interface HistoryScreenProps {
  historyEntries: HistoryEntry[];
}

function HistoryCard({ entry }: { entry: HistoryEntry }) {
  return (
    <div style={{
      border: '0.5px solid #E0E0E0',
      borderRadius: '8px',
      padding: '12px 14px',
      marginBottom: '9px',
      backgroundColor: '#FFFFFF',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Contributor avatar */}
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: '#F7F7F7',
            border: '0.5px solid #E0E0E0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span style={{ fontSize: '9px', fontWeight: 500, color: '#444441' }}>{entry.contributorInitials}</span>
          </div>
          <div>
            <span style={{ fontSize: '10px', color: '#AAAAAA', fontFamily: 'monospace', marginRight: '6px' }}>
              {entry.id}
            </span>
            <span style={{ fontSize: '13px', fontWeight: 500, color: '#0D0D0D' }}>
              {entry.contributor}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <SourceBadge source={entry.source} />
          <span style={{ fontSize: '11px', color: '#AAAAAA', whiteSpace: 'nowrap' }}>{entry.timestamp}</span>
        </div>
      </div>

      {/* Summary */}
      <p style={{
        fontSize: '12px',
        fontWeight: 400,
        color: '#888888',
        lineHeight: 1.5,
        margin: '0 0 7px',
      }}>
        {entry.summary}
      </p>

      {/* Stat pills + flag */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap', marginBottom: '5px' }}>
        {entry.added > 0 && (
          <span style={{
            fontSize: '10px',
            border: '0.5px solid #E0E0E0',
            borderRadius: '8px',
            padding: '2px 7px',
            color: '#333333',
          }}>
            +{entry.added} added
          </span>
        )}
        {entry.updated > 0 && (
          <span style={{
            fontSize: '10px',
            border: '0.5px solid #E0E0E0',
            borderRadius: '8px',
            padding: '2px 7px',
            color: '#333333',
          }}>
            ~{entry.updated} updated
          </span>
        )}
        {entry.flagged && (
          <span style={{
            fontSize: '10px',
            border: '0.5px solid #F09595',
            borderRadius: '8px',
            padding: '2px 7px',
            color: '#A32D2D',
          }}>
            ⚑ Flagged for review
          </span>
        )}
      </div>

      {/* Pages line */}
      {entry.pages.length > 0 && (
        <p style={{ fontSize: '10px', color: '#AAAAAA', margin: '5px 0 0' }}>
          Pages: {entry.pages.join(', ')}
        </p>
      )}
    </div>
  );
}

export function HistoryScreen({ historyEntries }: HistoryScreenProps) {
  return (
    <div style={{ padding: '20px 22px', maxWidth: '1200px', width: '100%', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <h2 style={{
        fontSize: '16px',
        fontWeight: 500,
        color: '#0D0D0D',
        margin: '0 0 14px',
        lineHeight: 1.3,
      }}>
        Change History
      </h2>
      <p style={{ fontSize: '12px', color: '#888888', margin: '0 0 20px', lineHeight: 1.5 }}>
        Chronological log of every wiki contribution. Newest first.
      </p>

      {historyEntries.map(entry => (
        <HistoryCard key={entry.id} entry={entry} />
      ))}
    </div>
  );
}
