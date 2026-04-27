import React, { useState, useCallback, useEffect } from 'react';
import {
  WikiEntry,
  HistoryEntry,
  PRODUCT_AREAS,
  CONSTRAINT_AREAS,
  ProductArea,
  ConstraintType,
} from './data/mockData';
import { fetchWikiEntries, addWikiEntry, fetchHistoryEntries, addHistoryEntry } from '../lib/api';
import { WikiScreen } from './screens/WikiScreen';
import { SearchScreen } from './screens/SearchScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { ContributeModal } from './components/ContributeModal';
import { Toast } from './components/Toast';

type View = 'wiki' | 'search' | 'history';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return isMobile;
}

export default function App() {
  const isMobile = useIsMobile();
  const [activeView, setActiveView] = useState<View>('wiki');
  const [activeSidebarItem, setActiveSidebarItem] = useState<string>('Project Management');
  const [showModal, setShowModal] = useState(false);
  const [entries, setEntries] = useState<WikiEntry[]>([]);
  const [historyEntries, setHistoryEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEntryId, setNewEntryId] = useState<string | null>(null);
  const [toast, setToast] = useState({ message: '', visible: false });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    Promise.all([fetchWikiEntries(), fetchHistoryEntries()])
      .then(([wiki, history]) => {
        setEntries(wiki);
        setHistoryEntries(history);
      })
      .catch(err => console.error('Failed to load data:', err))
      .finally(() => setLoading(false));
  }, []);

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: '', visible: false }), 2500);
  };

  const handleSaveEntry = useCallback(async (entryData: Omit<WikiEntry, 'id' | 'timestamp' | 'isNew'>) => {
    try {
      const saved = await addWikiEntry(entryData);
      setEntries(prev => [{ ...saved, isNew: true }, ...prev]);

      addHistoryEntry({
        contributor: entryData.contributor,
        contributorInitials: entryData.contributorInitials,
        source: entryData.source ?? 'Text',
        summary: `Added new entry: "${entryData.title}".`,
        added: 1,
        updated: 0,
        flagged: false,
        pages: entryData.areas,
      }).then(savedHistory => {
        setHistoryEntries(prev => [savedHistory, ...prev]);
      }).catch(console.error);

      if (entryData.areas.length > 0) {
        setActiveSidebarItem(entryData.areas[0]);
        setActiveView('wiki');
      }

      setShowModal(false);
      setNewEntryId(saved.id);
      showToast('Entry saved to wiki ✓');
      setTimeout(() => setNewEntryId(null), 3000);
    } catch (err) {
      console.error('Failed to save entry:', err);
      showToast('Failed to save entry — please try again');
    }
  }, []);

  const getCount = (item: string) => {
    const constraintTypes = ['Time', 'Money', 'Resource'];
    if (constraintTypes.includes(item)) {
      return entries.filter(e => e.constraints.includes(item as ConstraintType)).length;
    }
    return entries.filter(e => e.areas.includes(item as ProductArea)).length;
  };

  const SidebarContent = () => (
    <>
      <div style={{
        fontSize: '10px',
        fontWeight: 500,
        color: '#888888',
        textTransform: 'uppercase',
        letterSpacing: '0.07em',
        margin: '10px 0 5px 4px',
      }}>
        Product Areas
      </div>

      {PRODUCT_AREAS.map(area => {
        const isActive = activeSidebarItem === area.name && activeView === 'wiki';
        return (
          <button
            key={area.name}
            onClick={() => {
              setActiveSidebarItem(area.name);
              setActiveView('wiki');
              setSidebarOpen(false);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              width: '100%',
              fontSize: '12px',
              fontWeight: isActive ? 500 : 400,
              padding: '5px 8px',
              borderRadius: '6px',
              border: isActive ? '0.5px solid #E0E0E0' : '0.5px solid transparent',
              backgroundColor: isActive ? '#FFFFFF' : 'transparent',
              color: isActive ? '#0D0D0D' : '#888888',
              cursor: 'pointer',
              textAlign: 'left',
              fontFamily: 'Inter, system-ui, sans-serif',
              marginBottom: '2px',
              transition: 'background-color 0.1s, color 0.1s',
            }}
            onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = '#FFFFFF'; }}
            onMouseLeave={e => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <div style={{
              width: '7px', height: '7px', borderRadius: '50%',
              backgroundColor: area.color, flexShrink: 0,
            }} />
            <span style={{ flex: 1 }}>{area.name}</span>
            <span style={{ fontSize: '10px', color: '#AAAAAA' }}>{getCount(area.name)}</span>
          </button>
        );
      })}

      <div style={{
        fontSize: '10px',
        fontWeight: 500,
        color: '#888888',
        textTransform: 'uppercase',
        letterSpacing: '0.07em',
        margin: '14px 0 5px 4px',
      }}>
        Constraints
      </div>

      {CONSTRAINT_AREAS.map(c => {
        const isActive = activeSidebarItem === c.name && activeView === 'wiki';
        return (
          <button
            key={c.name}
            onClick={() => {
              setActiveSidebarItem(c.name);
              setActiveView('wiki');
              setSidebarOpen(false);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              width: '100%',
              fontSize: '12px',
              fontWeight: isActive ? 500 : 400,
              padding: '5px 8px',
              borderRadius: '6px',
              border: isActive ? '0.5px solid #E0E0E0' : '0.5px solid transparent',
              backgroundColor: isActive ? '#FFFFFF' : 'transparent',
              color: isActive ? '#0D0D0D' : '#888888',
              cursor: 'pointer',
              textAlign: 'left',
              fontFamily: 'Inter, system-ui, sans-serif',
              marginBottom: '2px',
              transition: 'background-color 0.1s, color 0.1s',
            }}
            onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = '#FFFFFF'; }}
            onMouseLeave={e => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <div style={{
              width: '7px', height: '7px', borderRadius: '50%',
              backgroundColor: c.color, flexShrink: 0,
            }} />
            <span style={{ flex: 1 }}>{c.name}</span>
            <span style={{ fontSize: '10px', color: '#AAAAAA' }}>{getCount(c.name)}</span>
          </button>
        );
      })}

      {isMobile && (
        <>
          <div style={{
            fontSize: '10px',
            fontWeight: 500,
            color: '#888888',
            textTransform: 'uppercase',
            letterSpacing: '0.07em',
            margin: '14px 0 5px 4px',
          }}>
            Views
          </div>
          {(['wiki', 'search', 'history'] as View[]).map(view => (
            <button
              key={view}
              onClick={() => { setActiveView(view); setSidebarOpen(false); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                width: '100%',
                fontSize: '12px',
                fontWeight: activeView === view ? 500 : 400,
                padding: '5px 8px',
                borderRadius: '6px',
                border: activeView === view ? '0.5px solid #E0E0E0' : '0.5px solid transparent',
                backgroundColor: activeView === view ? '#FFFFFF' : 'transparent',
                color: activeView === view ? '#0D0D0D' : '#888888',
                cursor: 'pointer',
                textAlign: 'left',
                fontFamily: 'Inter, system-ui, sans-serif',
                marginBottom: '2px',
                textTransform: 'capitalize',
              }}
            >
              {view}
            </button>
          ))}
        </>
      )}
    </>
  );

  return (
    <div style={{
      fontFamily: 'Inter, system-ui, Arial, sans-serif',
      backgroundColor: '#F4F5F7',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Navbar */}
      <header style={{
        height: '44px',
        minHeight: '44px',
        backgroundColor: '#FFFFFF',
        borderBottom: '0.5px solid #E0E0E0',
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        zIndex: 5,
        flexShrink: 0,
      }}>
        {isMobile && (
          <button
            onClick={() => setSidebarOpen(o => !o)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
            <div style={{ width: '16px', height: '1.5px', backgroundColor: '#333333' }} />
            <div style={{ width: '16px', height: '1.5px', backgroundColor: '#333333' }} />
            <div style={{ width: '16px', height: '1.5px', backgroundColor: '#333333' }} />
          </button>
        )}

        <div style={{ display: 'flex', alignItems: 'baseline', flexShrink: 0 }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#0D0D0D' }}>ProductWiki</span>
          <span style={{ fontSize: '10px', fontWeight: 400, color: '#AAAAAA', marginLeft: '6px' }}>v1.0</span>
        </div>

        {!isMobile && (
          <nav style={{ display: 'flex', alignItems: 'stretch', gap: '16px' }}>
            {(['wiki', 'search', 'history'] as View[]).map(view => (
              <button
                key={view}
                onClick={() => setActiveView(view)}
                style={{
                  fontSize: '12px',
                  fontWeight: activeView === view ? 500 : 400,
                  color: activeView === view ? '#0D0D0D' : '#888888',
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeView === view ? '2px solid #0D0D0D' : '2px solid transparent',
                  height: '44px',
                  padding: '0 2px',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  textTransform: 'capitalize',
                  transition: 'color 0.1s',
                }}
              >
                {view === 'wiki' ? 'Wiki' : view === 'search' ? 'Search' : 'History'}
              </button>
            ))}
          </nav>
        )}

        <div style={{ marginLeft: 'auto' }}>
          <button
            onClick={() => setShowModal(true)}
            style={{
              fontSize: '12px',
              fontWeight: 500,
              padding: '5px 12px',
              borderRadius: '6px',
              backgroundColor: '#0D0D0D',
              color: '#FFFFFF',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'Inter, system-ui, sans-serif',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.98)')}
            onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
          >
            + Contribute
          </button>
        </div>
      </header>

      {/* Body */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>

        {isMobile && sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.35)',
              zIndex: 8,
            }}
          />
        )}

        {isMobile ? (
          <aside style={{
            position: 'fixed',
            top: '44px',
            bottom: 0,
            left: 0,
            width: '220px',
            backgroundColor: '#F7F7F7',
            borderRight: '0.5px solid #E0E0E0',
            padding: '14px 10px',
            overflowY: 'auto',
            zIndex: 9,
            transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.25s ease',
          }}>
            <SidebarContent />
          </aside>
        ) : (
          <aside style={{
            width: '190px',
            minWidth: '190px',
            backgroundColor: '#F7F7F7',
            borderRight: '0.5px solid #E0E0E0',
            padding: '14px 10px',
            overflowY: 'auto',
            flexShrink: 0,
          }}>
            <SidebarContent />
          </aside>
        )}

        <main style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
        }}>
          {loading ? (
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#888888',
              fontSize: '12px',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}>
              Loading…
            </div>
          ) : (
            <>
              {activeView === 'wiki' && (
                <WikiScreen
                  entries={entries}
                  activeSidebarItem={activeSidebarItem}
                  newEntryId={newEntryId}
                />
              )}
              {activeView === 'search' && <SearchScreen entries={entries} />}
              {activeView === 'history' && <HistoryScreen historyEntries={historyEntries} />}
            </>
          )}
        </main>
      </div>

      {showModal && (
        <ContributeModal
          onClose={() => setShowModal(false)}
          onSave={handleSaveEntry}
        />
      )}

      <Toast message={toast.message} visible={toast.visible} />
    </div>
  );
}
