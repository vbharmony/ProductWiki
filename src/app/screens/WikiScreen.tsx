import React from 'react';
import { WikiEntry, ProductArea, ConstraintType, PAGE_DESCRIPTIONS, EntryType } from '../data/mockData';
import { EntryCard } from '../components/EntryCard';
import { ConstraintPill } from '../components/Badge';

interface WikiScreenProps {
  entries: WikiEntry[];
  activeSidebarItem: string;
  newEntryId: string | null;
}

const SECTION_ORDER: EntryType[] = ['Feature', 'Architecture', 'Known Issue', 'Limitation', 'Reporting'];
const UNTYPED_KEY = '__notes__';

export function WikiScreen({ entries, activeSidebarItem, newEntryId }: WikiScreenProps) {
  const pageInfo = PAGE_DESCRIPTIONS[activeSidebarItem] ?? {
    title: activeSidebarItem,
    description: '',
    constraints: [],
  };

  // Filter entries by sidebar item
  const filteredEntries = entries.filter(entry => {
    const constraintTypes: ConstraintType[] = ['Time', 'Money', 'Resource'];
    if (constraintTypes.includes(activeSidebarItem as ConstraintType)) {
      return entry.constraints.includes(activeSidebarItem as ConstraintType);
    }
    return entry.areas.includes(activeSidebarItem as ProductArea);
  });

  // Group by type; entries with no type go under UNTYPED_KEY
  const grouped: Record<string, WikiEntry[]> = {};
  for (const entry of filteredEntries) {
    const key = entry.type ?? UNTYPED_KEY;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(entry);
  }

  const sections = SECTION_ORDER.filter(t => grouped[t]?.length > 0);
  const hasUntyped = (grouped[UNTYPED_KEY]?.length ?? 0) > 0;

  const contributors = [...new Set(filteredEntries.map(e => e.contributor))].length;

  return (
    <div style={{ padding: '20px 22px', maxWidth: '1200px', width: '100%', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Page header */}
      <div style={{ paddingBottom: '14px', marginBottom: '16px', borderBottom: '0.5px solid #E0E0E0' }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: 700,
          color: '#0D0D0D',
          margin: '0 0 4px',
          lineHeight: 1.2,
        }}>
          {pageInfo.title}
        </h1>
        <p style={{
          fontSize: '14px',
          fontWeight: 400,
          color: '#888888',
          lineHeight: 1.55,
          margin: '0 0 8px',
        }}>
          {pageInfo.description}
        </p>

        {/* Constraint strip */}
        {pageInfo.constraints.length > 0 && (
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginTop: '8px', marginBottom: '8px' }}>
            {pageInfo.constraints.map(c => (
              <ConstraintPill key={c} constraint={c} />
            ))}
          </div>
        )}

        {/* Meta */}
        <p style={{ fontSize: '11px', color: '#AAAAAA', margin: 0 }}>
          {filteredEntries.length} entries · {contributors} contributors · Last updated {filteredEntries[0]?.timestamp ?? 'recently'}
        </p>
      </div>

      {/* Sections */}
      {sections.length === 0 && !hasUntyped ? (
        <div style={{ fontSize: '13px', color: '#AAAAAA', textAlign: 'center', padding: '40px 0' }}>
          No entries yet for this area.
        </div>
      ) : (
        <>
          {sections.map(sectionType => (
            <div key={sectionType}>
              <div style={{
                fontSize: '10px',
                fontWeight: 500,
                color: '#888888',
                textTransform: 'uppercase',
                letterSpacing: '0.07em',
                marginTop: '16px',
                marginBottom: '8px',
                paddingBottom: '5px',
                borderBottom: '0.5px solid #E0E0E0',
              }}>
                {sectionType === 'Known Issue' ? 'Known Issues' : sectionType + 's'}
              </div>
              {grouped[sectionType].map(entry => (
                <EntryCard key={entry.id} entry={entry} isNew={entry.id === newEntryId} />
              ))}
            </div>
          ))}

          {hasUntyped && (
            <div key={UNTYPED_KEY}>
              <div style={{
                fontSize: '10px',
                fontWeight: 500,
                color: '#888888',
                textTransform: 'uppercase',
                letterSpacing: '0.07em',
                marginTop: '16px',
                marginBottom: '8px',
                paddingBottom: '5px',
                borderBottom: '0.5px solid #E0E0E0',
              }}>
                Notes
              </div>
              {grouped[UNTYPED_KEY].map(entry => (
                <EntryCard key={entry.id} entry={entry} isNew={entry.id === newEntryId} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}