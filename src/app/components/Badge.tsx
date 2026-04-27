import React from 'react';
import { EntryType, ConstraintType, SourceType } from '../data/mockData';

export function TypeBadge({ type }: { type: EntryType }) {
  const styles: Record<EntryType, { bg: string; color: string }> = {
    'Feature':      { bg: '#E6F1FB', color: '#0C447C' },
    'Known Issue':  { bg: '#FCEBEB', color: '#791F1F' },
    'Limitation':   { bg: '#FAEEDA', color: '#633806' },
    'Architecture': { bg: '#F1EFE8', color: '#444441' },
    'Reporting':    { bg: '#EEEDFE', color: '#3C3489' },
  };
  const s = styles[type];
  return (
    <span style={{
      backgroundColor: s.bg,
      color: s.color,
      fontSize: '10px',
      fontWeight: 500,
      padding: '2px 6px',
      borderRadius: '8px',
      whiteSpace: 'nowrap',
      lineHeight: 1,
      display: 'inline-block',
    }}>
      {type}
    </span>
  );
}

export function ConstraintPill({ constraint }: { constraint: ConstraintType }) {
  const styles: Record<ConstraintType, { bg: string; color: string }> = {
    'Time':     { bg: '#E6F1FB', color: '#0C447C' },
    'Money':    { bg: '#E1F5EE', color: '#085041' },
    'Resource': { bg: '#FAEEDA', color: '#633806' },
  };
  const s = styles[constraint];
  return (
    <span style={{
      backgroundColor: s.bg,
      color: s.color,
      fontSize: '10px',
      fontWeight: 500,
      padding: '2px 8px',
      borderRadius: '10px',
      whiteSpace: 'nowrap',
      lineHeight: 1,
      display: 'inline-block',
    }}>
      {constraint}
    </span>
  );
}

export function SourceBadge({ source }: { source: SourceType }) {
  const styles: Record<SourceType, { bg: string; color: string }> = {
    'PDF':        { bg: '#E6F1FB', color: '#0C447C' },
    'DOCX':       { bg: '#E1F5EE', color: '#085041' },
    'Text':       { bg: '#F1EFE8', color: '#444441' },
    'Transcript': { bg: '#FAEEDA', color: '#633806' },
    'Code':       { bg: '#F1EFE8', color: '#444441' },
    'Web':        { bg: '#EEEDFE', color: '#3C3489' },
  };
  const s = styles[source];
  return (
    <span style={{
      backgroundColor: s.bg,
      color: s.color,
      fontSize: '10px',
      fontWeight: 500,
      padding: '2px 6px',
      borderRadius: '8px',
      whiteSpace: 'nowrap',
      lineHeight: 1,
      display: 'inline-block',
    }}>
      {source}
    </span>
  );
}

export function TagBadge({ tag }: { tag: string }) {
  return (
    <span style={{
      backgroundColor: '#F1F1F1',
      color: '#555555',
      fontSize: '10px',
      fontWeight: 500,
      padding: '2px 7px',
      borderRadius: '8px',
      whiteSpace: 'nowrap',
      lineHeight: 1,
      display: 'inline-block',
      border: '0.5px solid #E0E0E0',
    }}>
      {tag}
    </span>
  );
}