import { supabase } from './supabase';
import type { WikiEntry, HistoryEntry } from '../app/data/mockData';

// ── helpers ──────────────────────────────────────────────────────────────────

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} minute${mins === 1 ? '' : 's'} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs === 1 ? '' : 's'} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

// ── wiki entries ──────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToWikiEntry(row: any): WikiEntry {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    type: row.type,
    constraints: row.constraints ?? [],
    areas: row.areas ?? [],
    source: row.source,
    tags: row.tags ?? [],
    contributor: row.contributor,
    contributorInitials: row.contributor_initials,
    timestamp: formatRelativeTime(row.created_at),
  };
}

export async function fetchWikiEntries(): Promise<WikiEntry[]> {
  const { data, error } = await supabase
    .from('wiki_entries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map(rowToWikiEntry);
}

export async function addWikiEntry(
  entry: Omit<WikiEntry, 'id' | 'timestamp' | 'isNew'>
): Promise<WikiEntry> {
  const { data, error } = await supabase
    .from('wiki_entries')
    .insert({
      title: entry.title,
      body: entry.body,
      type: entry.type ?? null,
      constraints: entry.constraints,
      areas: entry.areas,
      source: entry.source ?? null,
      tags: entry.tags ?? [],
      contributor: entry.contributor,
      contributor_initials: entry.contributorInitials,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return rowToWikiEntry(data);
}

// ── history entries ───────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToHistoryEntry(row: any): HistoryEntry {
  return {
    id: row.id,
    contributor: row.contributor,
    contributorInitials: row.contributor_initials,
    source: row.source,
    timestamp: formatRelativeTime(row.created_at),
    summary: row.summary,
    added: row.added,
    updated: row.updated,
    flagged: row.flagged,
    pages: row.pages ?? [],
  };
}

export async function fetchHistoryEntries(): Promise<HistoryEntry[]> {
  const { data, error } = await supabase
    .from('history_entries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map(rowToHistoryEntry);
}

export async function addHistoryEntry(
  entry: Omit<HistoryEntry, 'id' | 'timestamp'>
): Promise<HistoryEntry> {
  const { data, error } = await supabase
    .from('history_entries')
    .insert({
      contributor: entry.contributor,
      contributor_initials: entry.contributorInitials,
      source: entry.source,
      summary: entry.summary,
      added: entry.added,
      updated: entry.updated,
      flagged: entry.flagged,
      pages: entry.pages,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return rowToHistoryEntry(data);
}
