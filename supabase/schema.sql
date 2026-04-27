-- =============================================================
-- ProductWiki — Supabase Schema
-- Run this in the Supabase SQL Editor to bootstrap the database.
-- =============================================================

-- ---------------------------------------------------------------
-- Sequences for human-readable IDs
-- ---------------------------------------------------------------
CREATE SEQUENCE IF NOT EXISTS wiki_entry_number_seq START 16;
CREATE SEQUENCE IF NOT EXISTS history_entry_number_seq START 90;

-- ---------------------------------------------------------------
-- ID-generation helpers
-- ---------------------------------------------------------------
CREATE OR REPLACE FUNCTION next_wiki_entry_id() RETURNS TEXT AS $$
BEGIN
  RETURN 'ENT-' || LPAD(nextval('wiki_entry_number_seq')::TEXT, 3, '0');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION next_history_entry_id() RETURNS TEXT AS $$
BEGIN
  RETURN 'SUB-' || LPAD(nextval('history_entry_number_seq')::TEXT, 3, '0');
END;
$$ LANGUAGE plpgsql;

-- ---------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS wiki_entries (
  id                   TEXT PRIMARY KEY DEFAULT next_wiki_entry_id(),
  title                TEXT NOT NULL,
  body                 TEXT NOT NULL,
  type                 TEXT CHECK (type IN ('Feature','Known Issue','Limitation','Architecture','Reporting')),
  constraints          TEXT[] NOT NULL DEFAULT '{}',
  areas                TEXT[] NOT NULL DEFAULT '{}',
  source               TEXT CHECK (source IN ('PDF','DOCX','Text','Transcript','Code','Web')),
  tags                 TEXT[] DEFAULT '{}',
  contributor          TEXT NOT NULL,
  contributor_initials TEXT NOT NULL,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS history_entries (
  id                   TEXT PRIMARY KEY DEFAULT next_history_entry_id(),
  contributor          TEXT NOT NULL,
  contributor_initials TEXT NOT NULL,
  source               TEXT NOT NULL,
  summary              TEXT NOT NULL,
  added                INTEGER NOT NULL DEFAULT 0,
  updated              INTEGER NOT NULL DEFAULT 0,
  flagged              BOOLEAN NOT NULL DEFAULT FALSE,
  pages                TEXT[] NOT NULL DEFAULT '{}',
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------
-- Row-Level Security
-- ---------------------------------------------------------------
ALTER TABLE wiki_entries    ENABLE ROW LEVEL SECURITY;
ALTER TABLE history_entries ENABLE ROW LEVEL SECURITY;

-- Public read + insert (anon key is sufficient for this wiki)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='wiki_entries' AND policyname='wiki_entries_select') THEN
    CREATE POLICY wiki_entries_select ON wiki_entries FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='wiki_entries' AND policyname='wiki_entries_insert') THEN
    CREATE POLICY wiki_entries_insert ON wiki_entries FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='history_entries' AND policyname='history_entries_select') THEN
    CREATE POLICY history_entries_select ON history_entries FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='history_entries' AND policyname='history_entries_insert') THEN
    CREATE POLICY history_entries_insert ON history_entries FOR INSERT WITH CHECK (true);
  END IF;
END $$;

-- ---------------------------------------------------------------
-- Seed: wiki_entries (15 initial entries with explicit IDs)
-- ---------------------------------------------------------------
INSERT INTO wiki_entries (id, title, body, type, constraints, areas, source, tags, contributor, contributor_initials, created_at)
VALUES
('ENT-001','Gantt Chart Dependencies',
 'Supports finish-to-start, start-to-start, finish-to-finish, and start-to-finish dependency types. Dependencies are rendered as curved SVG arrows with automatic re-routing when tasks move.',
 'Feature','{"Time"}','{"Project Management"}','PDF','{}','Sarah Chen','SC', NOW() - INTERVAL '2 hours'),

('ENT-002','Resource Allocation Conflict Detection',
 'When a resource is allocated beyond 100% within the same time window, the system flags an overallocation warning. Resolution requires manual re-scheduling or capacity adjustment.',
 'Known Issue','{"Resource"}','{"Project Management","Resource Management"}','Transcript','{}','Marcus Webb','MW', NOW() - INTERVAL '5 hours'),

('ENT-003','Milestone Date Calculation Bug',
 'When a predecessor task spans a weekend and the project calendar excludes non-working days, milestone dates can be calculated incorrectly by 1–2 business days.',
 'Known Issue','{"Time","Money"}','{"Project Management"}','DOCX','{}','Priya Nair','PN', NOW() - INTERVAL '1 day'),

('ENT-004','Task Hierarchy Depth Limitation',
 'The task hierarchy supports a maximum of 8 levels of nesting. Attempts to create a 9th level will silently fail — the task is created at level 8 instead. No error message is shown to the user.',
 'Limitation','{"Resource"}','{"Project Management"}','Text','{}','James Park','JP', NOW() - INTERVAL '2 days'),

('ENT-005','Project Dashboard Widget Architecture',
 'Dashboard widgets are rendered via a plugin system. Each widget subscribes to a shared event bus for real-time updates. Widgets are lazy-loaded to minimise the initial bundle size.',
 'Architecture','{"Resource"}','{"Project Management"}','Code','{}','Lena Müller','LM', NOW() - INTERVAL '3 days'),

('ENT-006','Portfolio Health Score Algorithm',
 'Health score is computed from weighted averages of schedule performance index (SPI), cost performance index (CPI), and resource utilisation. Weights are configurable per organisation.',
 'Feature','{"Money","Time"}','{"Portfolio Management"}','PDF','{}','Sarah Chen','SC', NOW() - INTERVAL '4 hours'),

('ENT-007','Cross-Project Resource View',
 'Enables portfolio managers to view resource commitments across all active projects simultaneously. Filter by role, department, or named resource.',
 'Feature','{"Resource"}','{"Portfolio Management","Resource Management"}','Web','{}','Marcus Webb','MW', NOW() - INTERVAL '6 hours'),

('ENT-008','Budget Roll-up Currency Limitation',
 'Budget figures roll up from tasks to projects to portfolio automatically. However, currency conversion is applied only once daily via a scheduled job — intraday exchange rate changes are not reflected.',
 'Limitation','{"Money"}','{"Portfolio Management"}','DOCX','{}','Priya Nair','PN', NOW() - INTERVAL '1 day'),

('ENT-009','Portfolio Reporting Export',
 'Portfolio-level reports can be exported in XLSX and PDF formats. Scheduled exports are supported via email delivery at configurable intervals (daily, weekly, monthly).',
 'Reporting','{"Time"}','{"Portfolio Management"}','PDF','{}','James Park','JP', NOW() - INTERVAL '2 days'),

('ENT-010','Skill Matrix Filtering',
 'Resources can be tagged with skills and proficiency levels. Project managers can filter the resource pool by required skill combinations when assigning tasks to find the best match.',
 'Feature','{"Resource"}','{"Resource Management"}','PDF','{}','Lena Müller','LM', NOW() - INTERVAL '3 hours'),

('ENT-011','Capacity Planning Data Model',
 'Capacity is modelled as a time-series of availability windows per resource. Each window has a start date, end date, and percentage availability. Windows can overlap to represent partial availability.',
 'Architecture','{"Resource","Time"}','{"Resource Management"}','Code','{}','Marcus Webb','MW', NOW() - INTERVAL '1 day'),

('ENT-012','Overallocation Warning System',
 'Warning banners appear when resource utilisation exceeds configurable thresholds (default 100%). The system does not prevent overallocation — it only warns. Enforcement requires a separate policy setting.',
 'Known Issue','{"Resource"}','{"Resource Management"}','Transcript','{}','Sarah Chen','SC', NOW() - INTERVAL '3 days'),

('ENT-013','OKR Alignment Tracking',
 'Projects and portfolios can be linked to organisational OKRs. The platform calculates a weighted alignment score based on the proportion of completed key results linked to active projects.',
 'Feature','{"Time","Money"}','{"Strategic Planning"}','PDF','{}','Priya Nair','PN', NOW() - INTERVAL '7 hours'),

('ENT-014','Scenario Planning Module',
 'Allows planners to model alternative portfolio configurations by toggling projects in/out of a scenario. Each scenario maintains its own budget and resource allocation snapshot.',
 'Feature','{"Money","Resource"}','{"Strategic Planning"}','Web','{}','James Park','JP', NOW() - INTERVAL '2 days'),

('ENT-015','Strategic Report Export Row Limit',
 'Strategic planning exports are limited to 500 rows per export. Larger datasets must be broken into multiple exports. No pagination is available in the UI export dialog.',
 'Limitation','{"Time"}','{"Strategic Planning"}','Transcript','{}','Lena Müller','LM', NOW() - INTERVAL '4 days')
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------
-- Seed: history_entries (8 initial submissions)
-- ---------------------------------------------------------------
INSERT INTO history_entries (id, contributor, contributor_initials, source, summary, added, updated, flagged, pages, created_at)
VALUES
('SUB-089','Sarah Chen','SC','PDF',
 'Added documentation for Gantt chart dependency types and SVG rendering behaviour. Includes details on the four dependency type variants and automatic route recalculation.',
 1,0,false,'{"Project Management"}', NOW() - INTERVAL '2 hours'),

('SUB-088','Marcus Webb','MW','Transcript',
 'Documented resource allocation conflict detection from user interview transcript. Noted that manual resolution is required — automated re-scheduling is not currently supported.',
 1,0,true,'{"Project Management","Resource Management"}', NOW() - INTERVAL '5 hours'),

('SUB-087','Priya Nair','PN','DOCX',
 'Logged milestone date calculation bug found during QA sprint. Off-by-one error occurs specifically when predecessor task spans a weekend in a non-working-day calendar.',
 1,0,false,'{"Project Management"}', NOW() - INTERVAL '1 day'),

('SUB-086','James Park','JP','Web',
 'Added cross-project resource view feature documentation. Sourced from product changelog and public release notes. Updated existing portfolio entry with new filter details.',
 1,1,false,'{"Portfolio Management","Resource Management"}', NOW() - INTERVAL '1 day'),

('SUB-085','Lena Müller','LM','Code',
 'Documented project dashboard plugin architecture from codebase analysis. Widget lazy-loading strategy and event bus subscription model added to Architecture section.',
 1,0,false,'{"Project Management"}', NOW() - INTERVAL '2 days'),

('SUB-084','Priya Nair','PN','DOCX',
 'Budget roll-up limitation documented. Daily FX conversion job behaviour noted as a known constraint for multi-currency portfolios operating across time zones.',
 1,0,false,'{"Portfolio Management"}', NOW() - INTERVAL '2 days'),

('SUB-083','Marcus Webb','MW','PDF',
 'Added capacity planning data model documentation. Overlap windows for partial availability and time-series structure documented from technical specification PDF.',
 1,0,false,'{"Resource Management"}', NOW() - INTERVAL '3 days'),

('SUB-082','Sarah Chen','SC','Transcript',
 'Overallocation warning system behaviour documented. Confirmed via customer support transcript that the system warns only and does not prevent overallocation from occurring.',
 1,0,true,'{"Resource Management"}', NOW() - INTERVAL '3 days')
ON CONFLICT (id) DO NOTHING;
