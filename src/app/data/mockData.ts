export type EntryType = 'Feature' | 'Known Issue' | 'Limitation' | 'Architecture' | 'Reporting';
export type ConstraintType = 'Time' | 'Money' | 'Resource';
export type ProductArea = 'Project Management' | 'Portfolio Management' | 'Resource Management' | 'Strategic Planning';
export type SourceType = 'PDF' | 'DOCX' | 'Text' | 'Transcript' | 'Code' | 'Web';

export interface WikiEntry {
  id: string;
  title: string;
  body: string;
  type?: EntryType;
  constraints: ConstraintType[];
  areas: ProductArea[];
  source?: SourceType;
  tags?: string[];
  contributor: string;
  contributorInitials: string;
  timestamp: string;
  isNew?: boolean;
}

export interface HistoryEntry {
  id: string;
  contributor: string;
  contributorInitials: string;
  source: SourceType;
  timestamp: string;
  summary: string;
  added: number;
  updated: number;
  flagged: boolean;
  pages: ProductArea[];
}

export const INITIAL_WIKI_ENTRIES: WikiEntry[] = [
  {
    id: 'ENT-001',
    title: 'Gantt Chart Dependencies',
    body: 'Supports finish-to-start, start-to-start, finish-to-finish, and start-to-finish dependency types. Dependencies are rendered as curved SVG arrows with automatic re-routing when tasks move.',
    type: 'Feature',
    constraints: ['Time'],
    areas: ['Project Management'],
    source: 'PDF',
    contributor: 'Sarah Chen',
    contributorInitials: 'SC',
    timestamp: '2 hours ago',
  },
  {
    id: 'ENT-002',
    title: 'Resource Allocation Conflict Detection',
    body: 'When a resource is allocated beyond 100% within the same time window, the system flags an overallocation warning. Resolution requires manual re-scheduling or capacity adjustment.',
    type: 'Known Issue',
    constraints: ['Resource'],
    areas: ['Project Management', 'Resource Management'],
    source: 'Transcript',
    contributor: 'Marcus Webb',
    contributorInitials: 'MW',
    timestamp: '5 hours ago',
  },
  {
    id: 'ENT-003',
    title: 'Milestone Date Calculation Bug',
    body: 'When a predecessor task spans a weekend and the project calendar excludes non-working days, milestone dates can be calculated incorrectly by 1–2 business days.',
    type: 'Known Issue',
    constraints: ['Time', 'Money'],
    areas: ['Project Management'],
    source: 'DOCX',
    contributor: 'Priya Nair',
    contributorInitials: 'PN',
    timestamp: '1 day ago',
  },
  {
    id: 'ENT-004',
    title: 'Task Hierarchy Depth Limitation',
    body: 'The task hierarchy supports a maximum of 8 levels of nesting. Attempts to create a 9th level will silently fail — the task is created at level 8 instead. No error message is shown to the user.',
    type: 'Limitation',
    constraints: ['Resource'],
    areas: ['Project Management'],
    source: 'Text',
    contributor: 'James Park',
    contributorInitials: 'JP',
    timestamp: '2 days ago',
  },
  {
    id: 'ENT-005',
    title: 'Project Dashboard Widget Architecture',
    body: 'Dashboard widgets are rendered via a plugin system. Each widget subscribes to a shared event bus for real-time updates. Widgets are lazy-loaded to minimise the initial bundle size.',
    type: 'Architecture',
    constraints: ['Resource'],
    areas: ['Project Management'],
    source: 'Code',
    contributor: 'Lena Müller',
    contributorInitials: 'LM',
    timestamp: '3 days ago',
  },
  {
    id: 'ENT-006',
    title: 'Portfolio Health Score Algorithm',
    body: 'Health score is computed from weighted averages of schedule performance index (SPI), cost performance index (CPI), and resource utilisation. Weights are configurable per organisation.',
    type: 'Feature',
    constraints: ['Money', 'Time'],
    areas: ['Portfolio Management'],
    source: 'PDF',
    contributor: 'Sarah Chen',
    contributorInitials: 'SC',
    timestamp: '4 hours ago',
  },
  {
    id: 'ENT-007',
    title: 'Cross-Project Resource View',
    body: 'Enables portfolio managers to view resource commitments across all active projects simultaneously. Filter by role, department, or named resource.',
    type: 'Feature',
    constraints: ['Resource'],
    areas: ['Portfolio Management', 'Resource Management'],
    source: 'Web',
    contributor: 'Marcus Webb',
    contributorInitials: 'MW',
    timestamp: '6 hours ago',
  },
  {
    id: 'ENT-008',
    title: 'Budget Roll-up Currency Limitation',
    body: 'Budget figures roll up from tasks to projects to portfolio automatically. However, currency conversion is applied only once daily via a scheduled job — intraday exchange rate changes are not reflected.',
    type: 'Limitation',
    constraints: ['Money'],
    areas: ['Portfolio Management'],
    source: 'DOCX',
    contributor: 'Priya Nair',
    contributorInitials: 'PN',
    timestamp: '1 day ago',
  },
  {
    id: 'ENT-009',
    title: 'Portfolio Reporting Export',
    body: 'Portfolio-level reports can be exported in XLSX and PDF formats. Scheduled exports are supported via email delivery at configurable intervals (daily, weekly, monthly).',
    type: 'Reporting',
    constraints: ['Time'],
    areas: ['Portfolio Management'],
    source: 'PDF',
    contributor: 'James Park',
    contributorInitials: 'JP',
    timestamp: '2 days ago',
  },
  {
    id: 'ENT-010',
    title: 'Skill Matrix Filtering',
    body: 'Resources can be tagged with skills and proficiency levels. Project managers can filter the resource pool by required skill combinations when assigning tasks to find the best match.',
    type: 'Feature',
    constraints: ['Resource'],
    areas: ['Resource Management'],
    source: 'PDF',
    contributor: 'Lena Müller',
    contributorInitials: 'LM',
    timestamp: '3 hours ago',
  },
  {
    id: 'ENT-011',
    title: 'Capacity Planning Data Model',
    body: 'Capacity is modelled as a time-series of availability windows per resource. Each window has a start date, end date, and percentage availability. Windows can overlap to represent partial availability.',
    type: 'Architecture',
    constraints: ['Resource', 'Time'],
    areas: ['Resource Management'],
    source: 'Code',
    contributor: 'Marcus Webb',
    contributorInitials: 'MW',
    timestamp: '1 day ago',
  },
  {
    id: 'ENT-012',
    title: 'Overallocation Warning System',
    body: 'Warning banners appear when resource utilisation exceeds configurable thresholds (default 100%). The system does not prevent overallocation — it only warns. Enforcement requires a separate policy setting.',
    type: 'Known Issue',
    constraints: ['Resource'],
    areas: ['Resource Management'],
    source: 'Transcript',
    contributor: 'Sarah Chen',
    contributorInitials: 'SC',
    timestamp: '3 days ago',
  },
  {
    id: 'ENT-013',
    title: 'OKR Alignment Tracking',
    body: 'Projects and portfolios can be linked to organisational OKRs. The platform calculates a weighted alignment score based on the proportion of completed key results linked to active projects.',
    type: 'Feature',
    constraints: ['Time', 'Money'],
    areas: ['Strategic Planning'],
    source: 'PDF',
    contributor: 'Priya Nair',
    contributorInitials: 'PN',
    timestamp: '7 hours ago',
  },
  {
    id: 'ENT-014',
    title: 'Scenario Planning Module',
    body: 'Allows planners to model alternative portfolio configurations by toggling projects in/out of a scenario. Each scenario maintains its own budget and resource allocation snapshot.',
    type: 'Feature',
    constraints: ['Money', 'Resource'],
    areas: ['Strategic Planning'],
    source: 'Web',
    contributor: 'James Park',
    contributorInitials: 'JP',
    timestamp: '2 days ago',
  },
  {
    id: 'ENT-015',
    title: 'Strategic Report Export Row Limit',
    body: 'Strategic planning exports are limited to 500 rows per export. Larger datasets must be broken into multiple exports. No pagination is available in the UI export dialog.',
    type: 'Limitation',
    constraints: ['Time'],
    areas: ['Strategic Planning'],
    source: 'Transcript',
    contributor: 'Lena Müller',
    contributorInitials: 'LM',
    timestamp: '4 days ago',
  },
];

export const INITIAL_HISTORY_ENTRIES: HistoryEntry[] = [
  {
    id: 'SUB-089',
    contributor: 'Sarah Chen',
    contributorInitials: 'SC',
    source: 'PDF',
    timestamp: '2 hours ago',
    summary: 'Added documentation for Gantt chart dependency types and SVG rendering behaviour. Includes details on the four dependency type variants and automatic route recalculation.',
    added: 1,
    updated: 0,
    flagged: false,
    pages: ['Project Management'],
  },
  {
    id: 'SUB-088',
    contributor: 'Marcus Webb',
    contributorInitials: 'MW',
    source: 'Transcript',
    timestamp: '5 hours ago',
    summary: 'Documented resource allocation conflict detection from user interview transcript. Noted that manual resolution is required — automated re-scheduling is not currently supported.',
    added: 1,
    updated: 0,
    flagged: true,
    pages: ['Project Management', 'Resource Management'],
  },
  {
    id: 'SUB-087',
    contributor: 'Priya Nair',
    contributorInitials: 'PN',
    source: 'DOCX',
    timestamp: '1 day ago',
    summary: 'Logged milestone date calculation bug found during QA sprint. Off-by-one error occurs specifically when predecessor task spans a weekend in a non-working-day calendar.',
    added: 1,
    updated: 0,
    flagged: false,
    pages: ['Project Management'],
  },
  {
    id: 'SUB-086',
    contributor: 'James Park',
    contributorInitials: 'JP',
    source: 'Web',
    timestamp: '1 day ago',
    summary: 'Added cross-project resource view feature documentation. Sourced from product changelog and public release notes. Updated existing portfolio entry with new filter details.',
    added: 1,
    updated: 1,
    flagged: false,
    pages: ['Portfolio Management', 'Resource Management'],
  },
  {
    id: 'SUB-085',
    contributor: 'Lena Müller',
    contributorInitials: 'LM',
    source: 'Code',
    timestamp: '2 days ago',
    summary: 'Documented project dashboard plugin architecture from codebase analysis. Widget lazy-loading strategy and event bus subscription model added to Architecture section.',
    added: 1,
    updated: 0,
    flagged: false,
    pages: ['Project Management'],
  },
  {
    id: 'SUB-084',
    contributor: 'Priya Nair',
    contributorInitials: 'PN',
    source: 'DOCX',
    timestamp: '2 days ago',
    summary: 'Budget roll-up limitation documented. Daily FX conversion job behaviour noted as a known constraint for multi-currency portfolios operating across time zones.',
    added: 1,
    updated: 0,
    flagged: false,
    pages: ['Portfolio Management'],
  },
  {
    id: 'SUB-083',
    contributor: 'Marcus Webb',
    contributorInitials: 'MW',
    source: 'PDF',
    timestamp: '3 days ago',
    summary: 'Added capacity planning data model documentation. Overlap windows for partial availability and time-series structure documented from technical specification PDF.',
    added: 1,
    updated: 0,
    flagged: false,
    pages: ['Resource Management'],
  },
  {
    id: 'SUB-082',
    contributor: 'Sarah Chen',
    contributorInitials: 'SC',
    source: 'Transcript',
    timestamp: '3 days ago',
    summary: 'Overallocation warning system behaviour documented. Confirmed via customer support transcript that the system warns only and does not prevent overallocation from occurring.',
    added: 1,
    updated: 0,
    flagged: true,
    pages: ['Resource Management'],
  },
];

export const PRODUCT_AREAS: { name: ProductArea; color: string }[] = [
  { name: 'Project Management', color: '#378ADD' },
  { name: 'Portfolio Management', color: '#1D9E75' },
  { name: 'Resource Management', color: '#BA7517' },
  { name: 'Strategic Planning', color: '#9F77DD' },
];

export const CONSTRAINT_AREAS: { name: ConstraintType; color: string }[] = [
  { name: 'Time', color: '#185FA5' },
  { name: 'Money', color: '#3B6D11' },
  { name: 'Resource', color: '#854F0B' },
];

export const PAGE_DESCRIPTIONS: Record<string, { title: string; description: string; constraints: ConstraintType[] }> = {
  'Project Management': {
    title: 'Project Management',
    description: 'Features, limitations, and architecture notes for the core project management module — tasks, Gantt charts, milestones, and dependencies.',
    constraints: ['Time', 'Resource'],
  },
  'Portfolio Management': {
    title: 'Portfolio Management',
    description: 'Knowledge base for portfolio-level views, health scoring, budget roll-ups, and cross-project reporting capabilities.',
    constraints: ['Money', 'Time'],
  },
  'Resource Management': {
    title: 'Resource Management',
    description: 'Documentation covering resource allocation, capacity planning models, skill matrix filtering, and overallocation handling.',
    constraints: ['Resource'],
  },
  'Strategic Planning': {
    title: 'Strategic Planning',
    description: 'Strategic planning module covering OKR alignment tracking, scenario planning, and executive reporting capabilities.',
    constraints: ['Time', 'Money', 'Resource'],
  },
  'Time': {
    title: 'Time Constraints',
    description: 'All wiki entries tagged with the Time constraint — scheduling, deadline, and calendar-related features and limitations.',
    constraints: ['Time'],
  },
  'Money': {
    title: 'Money Constraints',
    description: 'All wiki entries tagged with the Money constraint — budget, cost, currency, and financial planning features and limitations.',
    constraints: ['Money'],
  },
  'Resource': {
    title: 'Resource Constraints',
    description: 'All wiki entries tagged with the Resource constraint — capacity, allocation, staffing, and resource planning features.',
    constraints: ['Resource'],
  },
};

export interface ChatMessage {
  id: string;
  role: 'user' | 'agent';
  text: string;
  entries?: WikiEntry[];
  isTyping?: boolean;
}

export const MOCK_AI_RESPONSES: { trigger: string; response: string; entryIds: string[] }[] = [
  {
    trigger: 'limitation',
    response: "I found several limitations documented in the wiki. The most significant ones relate to task hierarchy depth (max 8 levels), budget roll-up currency conversion (daily FX refresh only), and strategic report exports (500 row limit). Here are the relevant entries:",
    entryIds: ['ENT-004', 'ENT-008', 'ENT-015'],
  },
  {
    trigger: 'resource',
    response: "The resource management area has several important entries. Resource allocation uses a conflict detection system that flags overallocation but doesn't prevent it. The capacity planning model uses time-series availability windows, and there's also a skill matrix filtering feature for better task assignment:",
    entryIds: ['ENT-002', 'ENT-011', 'ENT-012'],
  },
  {
    trigger: 'portfolio',
    response: "Portfolio management includes a health score algorithm that weights SPI, CPI, and resource utilisation. There's also a cross-project resource view and scheduled reporting exports. One notable limitation is around daily currency conversion for multi-currency portfolios:",
    entryIds: ['ENT-006', 'ENT-007', 'ENT-008'],
  },
  {
    trigger: 'budget',
    response: "Budget-related entries focus on the portfolio health score (which incorporates CPI), the budget roll-up mechanism, and the OKR alignment tracking feature. There's a known limitation where currency conversions only refresh once daily:",
    entryIds: ['ENT-006', 'ENT-008', 'ENT-013'],
  },
  {
    trigger: 'default',
    response: "Based on the wiki entries I searched, here are the most relevant results for your query. The wiki covers features, known issues, limitations, and architecture notes across all product areas:",
    entryIds: ['ENT-001', 'ENT-006', 'ENT-013'],
  },
];