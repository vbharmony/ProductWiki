Product Wiki
Design Specification for Figma Make
Version 1.0  ·  April 2026  ·  Ready for Figma Make import

Product	Product Wiki — collaborative knowledge base
Screens	5 (Wiki, Search, History, Contribute modal, Entry detail)
Breakpoints	Desktop 1440px primary · Tablet 768px · Mobile 375px
Design tokens	Colors, typography, spacing, radius, shadow
Components	Navbar, Sidebar, Entry card, Badge, Constraint pill, Chat bubble, Modal, Toast



1. Design tokens
All values below should be defined as Figma variables before building any component. Reference these tokens in every frame — never hardcode raw hex or pixel values.

1.1  Colour palette
Brand & UI
Name	Hex	Usage	Text on	Notes
Navy / Brand	#1A1A2E	Primary headings, navbar bg, table headers	#FFFFFF	Primary brand colour
Ink	#0D0D0D	Page titles, critical text	#FFFFFF	Max contrast
Charcoal	#333333	Body copy	#FFFFFF	Default text
Mid grey	#888888	Labels, metadata, timestamps	#FFFFFF	Tertiary text
Light grey	#F7F7F7	Table row alternates, sidebar bg	#333333	Surface fill
White	#FFFFFF	Card backgrounds, modal bg	#333333	Base surface
Page bg	#F4F5F7	App background behind panels	#333333	Canvas fill
Border default	#E0E0E0	All card and table borders	—	1px solid
Border strong	#CCCCCC	Focused inputs, hover states	—	1px solid

Constraint colours — Time / Money / Resource
Name	Hex	Usage	Text on	Notes
Time fill	#E6F1FB	Time constraint pill background	#0C447C	Blue family
Time text	#0C447C	Time constraint pill text	#FFFFFF	Blue 800
Money fill	#E1F5EE	Money constraint pill background	#085041	Teal family
Money text	#085041	Money constraint pill text	#FFFFFF	Teal 800
Resource fill	#FAEEDA	Resource pill background	#633806	Amber family
Resource text	#633806	Resource pill text	#FFFFFF	Amber 800

Entry type colours
Name	Hex	Usage	Text on	Notes
Feature fill	#E6F1FB	Feature badge bg	#0C447C	Blue
Known Issue fill	#FCEBEB	Known Issue badge bg	#791F1F	Red
Limitation fill	#FAEEDA	Limitation badge bg	#633806	Amber
Architecture fill	#F1EFE8	Architecture badge bg	#444441	Gray
Reporting fill	#EEEDFE	Reporting badge bg	#3C3489	Purple

Product area sidebar dots
Name	Hex	Usage	Text on	Notes
Project Mgmt	#378ADD	Sidebar dot	—	Blue 400
Portfolio Mgmt	#1D9E75	Sidebar dot	—	Teal 400
Resource Mgmt	#BA7517	Sidebar dot	—	Amber 400
Strategic Planning	#9F77DD	Sidebar dot	—	Purple 400
Time constraint	#185FA5	Sidebar dot	—	Blue 600
Money constraint	#3B6D11	Sidebar dot	—	Green 600
Resource constraint	#854F0B	Sidebar dot	—	Amber 600
1.2  Typography
Typeface
Primary: Inter (Google Fonts). Fallback: system-ui, Arial, sans-serif.
Use Inter for all UI text. No serif or monospace in the main UI except code/ID labels.

Token	Size	Weight	Line height	Usage
--text-display	32px / 2rem	700	1.2	Page title (wiki page heading)
--text-title	20px / 1.25rem	600	1.3	Card title, modal heading
--text-body	14px / 0.875rem	400	1.6	Entry body copy, descriptions
--text-label	12px / 0.75rem	500	1.4	Section headings, nav items
--text-caption	11px / 0.688rem	400	1.4	Timestamps, contributor names, IDs
--text-badge	10px / 0.625rem	500	1.0	Badge text, constraint pills
--text-mono	12px / 0.75rem	400	1.5	Entry IDs (ENT-001), code values
1.3  Spacing scale
Use an 4px base grid. All spacing values are multiples of 4.

Token	Value	Usage
--space-1	4px	Icon gap, tight badge padding
--space-2	8px	Inline gap between badge + constraint pill
--space-3	12px	Card internal row gap, input padding vertical
--space-4	16px	Card padding, section gap
--space-5	20px	Page content horizontal padding
--space-6	24px	Between sections on a wiki page
--space-8	32px	Between major layout zones
--space-10	40px	Top margin on page header
1.4  Border radius
--radius-sm	4px  — badges, pills, small chips
--radius-md	6px  — inputs, buttons, small cards
--radius-lg	8px  — entry cards, modals, sidebar items
--radius-xl	12px — modal overlay container
--radius-full	9999px — avatar circles
1.5  Elevation & shadow
--shadow-none	none — flat cards, sidebar items
--shadow-sm	0 1px 3px rgba(0,0,0,0.08) — entry cards on hover
--shadow-md	0 4px 16px rgba(0,0,0,0.12) — modal
--shadow-focus	0 0 0 3px rgba(26,26,46,0.15) — focused inputs


2. Layout & grid
2.1  App shell — desktop (1440px)
Overall height	100vh — no page scroll, internal panels scroll independently
Structure	Navbar (44px fixed top) + body row below
Body row	Sidebar (190px fixed) + Main content (flex: 1)
Sidebar	190px wide, full height, independent scroll
Main content	Remaining width, padding 20px 22px, independent scroll
Max content width	1200px centred inside main on very wide viewports

2.2  Navbar — 44px
Height	44px
Background	#FFFFFF border-bottom 0.5px #E0E0E0
Padding	0 20px
Left zone	Logo (13px/600) + nav links (12px/400) with 16px gap between items
Right zone	margin-left: auto — Contribute button
Active link	border-bottom: 2px solid #0D0D0D, color: #0D0D0D
Inactive link	color: #888888, no underline
2.3  Sidebar — 190px
Width	190px, flex-shrink: 0
Background	#F7F7F7, border-right: 0.5px solid #E0E0E0
Padding	14px 10px
Section label	10px/500, #888888, uppercase, letter-spacing: 0.07em, margin 10px 0 5px 4px
Nav item	12px/400, padding 5px 8px, border-radius 6px, color #888888
Nav item hover	background #FFFFFF
Nav item active	background #FFFFFF, color #0D0D0D, font-weight 500, border: 0.5px solid #E0E0E0
Area dot	7×7px circle, border-radius 50%, flex-shrink 0
Count badge	margin-left auto, 10px, color #AAAAAA
2.4  Tablet (768px)
Sidebar	Hidden by default, slides in as drawer on hamburger tap
Main	Full width, padding 16px
Navbar	Hamburger icon replaces nav links
2.5  Mobile (375px)
Layout	Single column, no sidebar
Navbar	Logo + hamburger only
Entry cards	Full width, stacked vertically
Modal	Full screen sheet from bottom
Chat	Full screen view


3. Screens
3.1  Wiki screen
Wiki screen
Default landing view. Shows wiki entries for the selected product area or constraint.

Page header
Page title	--text-display, color #0D0D0D, margin-bottom 4px
Page description	--text-body, color #888888, line-height 1.55, margin-bottom 8px
Constraint strip	Row of constraint pills, gap 5px, margin-top 8px
Page meta	--text-caption, color #AAAAAA — '{n} entries · {n} contributors · Last updated {date}'
Bottom border	0.5px solid #E0E0E0, padding-bottom 14px, margin-bottom 16px

Section heading
Text	10px/500, #888888, uppercase, letter-spacing 0.07em
Spacing	margin-top 16px, margin-bottom 8px
Bottom border	0.5px solid #E0E0E0, padding-bottom 5px

Entry card
Container	border: 0.5px solid #E0E0E0, border-radius 8px, padding 11px 13px, margin-bottom 7px, background #FFFFFF
Hover state	border-color #CCCCCC, box-shadow --shadow-sm
New entry	border-color #1D9E75 (teal) to highlight freshly added entries
Title row	--text-title (13px/500), color #0D0D0D
Entry ID	10px/400, color #AAAAAA, margin-left 6px, font-family mono
Body	--text-body (12px/400), color #888888, line-height 1.55, margin 3px 0 7px
Footer row	display flex, align-items center, gap 5px, flex-wrap wrap
Type badge	See component spec § 4.3
Constraint pills	See component spec § 4.4
Source badge	Same size as type badge, color varies by source type
Who + when	10px/400, color #AAAAAA, margin-left auto
3.2  Search screen
Search / AI chat screen
Full-height chat interface. Left: message thread. Bottom: input bar.

Welcome state (empty thread)
Layout	Vertically centred within the chat area
Title	15px/500, color #0D0D0D
Subtitle	12px/400, color #888888, line-height 1.6
Suggestion chips	Row of tappable chips — border: 0.5px solid #CCCCCC, border-radius 16px, 11px/400, padding 5px 10px, gap 6px, flex-wrap wrap
Chip hover	background #F7F7F7, color #0D0D0D

Chat message — user
Alignment	flex-direction: row-reverse (right-aligned)
Avatar	26×26px circle, background #F7F7F7, text #444441, initials 10px/500
Bubble	max-width 85%, font-size 12px, line-height 1.6, padding 9px 12px, border-radius 10px
Bubble bg	#F7F7F7, border: 0.5px solid #E0E0E0

Chat message — agent
Alignment	flex-direction: row (left-aligned)
Avatar	26×26px circle, background #E6F1FB, text #0C447C, label 'W' for Wiki, 10px/500
Bubble	max-width 85%, 12px/400, line-height 1.6, padding 9px 12px, border-radius 10px
Bubble bg	#FFFFFF, border: 0.5px solid #E0E0E0
Referenced entries	Inline entry cards inside the bubble — see § 4.5 Entry reference card

Typing indicator
Position	Agent avatar + bubble, same layout as agent message
Bubble content	Three dots, 6×6px circles, color #AAAAAA
Animation	Opacity pulse 0.2 → 1 → 0.2, staggered 0.2s per dot, 1.2s cycle

Input bar
Container	padding 12px 16px, border-top: 0.5px solid #E0E0E0, background #FFFFFF
Textarea	flex: 1, font-size 12px, padding 8px 12px, border-radius 8px, border: 0.5px solid #E0E0E0, background #F7F7F7, auto-resize up to 100px
Send button	34×34px, border-radius 6px, background #0D0D0D, color #FFFFFF, icon: arrow-up 14px
Send disabled	opacity 0.4, cursor default
3.3  Change history screen
Change history screen
Chronological log of every wiki contribution. Newest first.

Page title	16px/500, margin-bottom 14px
History card	border: 0.5px solid #E0E0E0, border-radius 8px, padding 12px 14px, margin-bottom 9px, background #FFFFFF
Card top row	flex, justify-content space-between — left: SUB-ID (10px, #AAAAAA) + contributor name (13px/500); right: source badge + timestamp (11px, #AAAAAA)
Summary text	12px/400, color #888888, line-height 1.5, margin-bottom 7px
Stat pills	10px, border: 0.5px solid #E0E0E0, border-radius 8px, padding 2px 7px
Flag pill	border-color #F09595, color #A32D2D for flagged items
Pages line	10px, color #AAAAAA, margin-top 5px — 'Pages: Portfolio Management, ...'
3.4  Contribute modal
Contribute modal
Overlay form for adding new wiki entries. Triggered by '+ Contribute' button in navbar.

Overlay
Backdrop	position absolute, full screen, background rgba(0,0,0,0.35), z-index 10
Modal panel	background #FFFFFF, border-radius 12px, border: 0.5px solid #E0E0E0, padding 20px, max-width 500px, centred horizontally, margin-top 30px

Form fields
Modal title	15px/500, color #0D0D0D
Modal subtitle	12px/400, color #888888, margin-bottom 16px
Field label	11px/500, color #888888, display block, margin-bottom 5px
Text input	width 100%, font-size 12px, padding 7px 10px, border-radius 6px, border: 0.5px solid #E0E0E0, background #F7F7F7
Textarea	Same as text input, min-height 80px, resize vertical
Select	Same as text input
Checkbox grid	display grid, grid-template-columns 1fr 1fr, gap 6px
Checkbox item	display flex, align-items center, gap 6px, 12px, padding 6px 8px, border-radius 6px, border: 0.5px solid #E0E0E0
Checked item	background #E1F5EE, border-color #5DCAA5
Field group gap	margin-bottom 14px between each field group

Modal footer
Layout	flex, gap 8px, justify-content flex-end
Top border	0.5px solid #E0E0E0, padding-top 14px, margin-top 16px
Cancel button	Secondary style — see § 4.7
Save button	Primary style — see § 4.7


4. Components
4.1  Navbar
Navbar
Height	44px
Background	#FFFFFF
Border	border-bottom: 0.5px solid #E0E0E0
Padding	0 20px
Logo	font-size 13px, font-weight 500, color #0D0D0D
Logo sub	font-size 10px, font-weight 400, color #AAAAAA, margin-left 6px
Nav links	font-size 12px, color #888888, gap 16px, cursor pointer
Active link	color #0D0D0D, border-bottom: 2px solid #0D0D0D
Right CTA	margin-left: auto

4.2  Sidebar nav item
Sidebar nav item
Size	font-size 12px, padding 5px 8px
Border radius	6px
Gap	7px between dot and label
Default	color #888888, background transparent
Hover	background #FFFFFF
Active	background #FFFFFF, color #0D0D0D, font-weight 500, border: 0.5px solid #E0E0E0
Dot	7×7px, border-radius 50%, colour varies per area (see § 1.1)
Count	margin-left auto, font-size 10px, color #AAAAAA

4.3  Entry type badge
Entry type badge
Font	10px / 500
Padding	2px 6px
Border radius	8px
Feature	bg #E6F1FB, text #0C447C
Known Issue	bg #FCEBEB, text #791F1F
Limitation	bg #FAEEDA, text #633806
Architecture	bg #F1EFE8, text #444441
Reporting	bg #EEEDFE, text #3C3489

4.4  Constraint pill
Constraint pill
Font	10px / 500
Padding	2px 8px
Border radius	10px (more rounded than badge)
Time	bg #E6F1FB, text #0C447C
Money	bg #E1F5EE, text #085041
Resource	bg #FAEEDA, text #633806

4.5  Entry reference card (in chat)
Entry reference card
Container	margin-top 8px, padding 8px 10px, border-radius 6px, border: 0.5px solid #E0E0E0, background #F7F7F7
Title	font-weight 500, font-size 11px, margin-bottom 2px
Body	font-size 11px, color #888888, line-height 1.5
Footer	display flex, gap 4px, flex-wrap wrap, margin-top 5px
Who+when	font-size 10px, color #AAAAAA, margin-left auto

4.6  Source badge
Source badge
Font	10px / 500
Padding	2px 6px
Border radius	8px
PDF	bg #E6F1FB, text #0C447C
DOCX	bg #E1F5EE, text #085041
Text	bg #F1EFE8, text #444441
Transcript	bg #FAEEDA, text #633806
Code	bg #F1EFE8, text #444441
Web	bg #EEEDFE, text #3C3489

4.7  Buttons
Button — primary
Font	12px / 500
Padding	5px 12px
Border radius	6px
Background	#0D0D0D
Text color	#FFFFFF
Border	none
Hover	opacity 0.85
Active	transform: scale(0.98)

Button — secondary
Font	12px / 400
Padding	5px 12px
Border radius	6px
Background	#FFFFFF
Text color	#0D0D0D
Border	0.5px solid #CCCCCC
Hover	background #F7F7F7

4.8  Toast notification
Toast
Position	absolute, bottom 16px, right 16px, z-index 20
Background	#1A1A2E
Text	#FFFFFF, font-size 12px
Padding	8px 14px
Border radius	8px
Duration	Show for 2500ms, then hide
Animation	Fade in over 150ms, fade out over 150ms

4.9  Form inputs
Text input / Textarea / Select
Font	12px / 400, font-family Inter
Padding	7px 10px (input) · 8px 10px (textarea)
Border radius	6px
Border	0.5px solid #E0E0E0
Background	#F7F7F7
Text color	#0D0D0D
Focus	border-color #0D0D0D, box-shadow: 0 0 0 3px rgba(13,13,13,0.1), outline none
Placeholder	color #AAAAAA
Textarea	min-height 80px, resize vertical



5. Interactions & states
5.1  Navigation
•	Clicking a nav link in the navbar switches the active view (Wiki / Search / History)
•	Active nav link: border-bottom 2px solid #0D0D0D, color #0D0D0D
•	Clicking a sidebar item changes the active page within the wiki view
•	Active sidebar item retains active style until another item is clicked
5.2  Contribute flow
•	1. User clicks '+ Contribute' → modal overlays with backdrop
•	2. User fills form: name, title, description, area checkboxes, constraint checkboxes, type select
•	3. Validation: name + title + description required; at least one area; at least one constraint
•	4. On validation fail: inline error state on empty required fields (border-color #E24B4A)
•	5. On save: modal closes, toast appears for 2500ms, sidebar count increments, new entry appears with teal border highlight
•	6. New entry highlight fades after 3000ms
5.3  Search / chat flow
•	1. User arrives at Search view → welcome state with suggestion chips
•	2. User types or taps a chip → message appended to thread, welcome state hidden
•	3. Typing indicator appears immediately (3-dot animation)
•	4. API response arrives → typing indicator removed, agent message appended
•	5. If entries referenced → entry reference cards appear below agent bubble
•	6. Thread maintains history for follow-up questions within the session
•	7. Send button disabled while response is pending
5.4  Hover & focus states
•	Entry card hover: border #CCCCCC, box-shadow 0 1px 3px rgba(0,0,0,0.08)
•	Sidebar item hover: background #FFFFFF
•	Suggestion chip hover: background #F7F7F7, color #0D0D0D
•	All interactive elements: cursor pointer
•	All inputs on focus: border #0D0D0D, focus ring (see § 4.9)
•	Buttons on active: transform scale(0.98)


6. Figma Make setup instructions
6.1  Variables to define first
Before building any component in Figma Make, define these as local variables:

•	All colour tokens from § 1.1 as Colour variables
•	All spacing tokens from § 1.3 as Number variables
•	All radius tokens from § 1.4 as Number variables
•	All shadow tokens from § 1.5 as Effect variables
•	All text style tokens from § 1.2 as Text Style presets
6.2  Component build order
Build in this order to avoid dependency issues:

1.	Badges (type badge, constraint pill, source badge) — no dependencies
2.	Buttons (primary, secondary)
3.	Form inputs (text input, textarea, select, checkbox item)
4.	Entry reference card (uses badges)
5.	Entry card (uses badges, pills, source badge)
6.	Chat bubble — user and agent variants (agent uses entry reference card)
7.	History card (uses source badge, stat pill)
8.	Sidebar nav item (uses area dot)
9.	Navbar (uses buttons)
10.	Toast notification
11.	Contribute modal (uses form inputs, checkbox items, buttons)
12.	Screens: Wiki → Search → History → Contribute modal overlay
6.3  Frame sizes
Desktop	1440 × 900px — primary design target
Tablet	768 × 1024px
Mobile	375 × 812px
Component	Hug contents unless otherwise specified
6.4  Prompt for Figma Make
Paste this prompt directly into Figma Make after setting up variables:

Build a product wiki web application with the following screens:
1. Wiki screen — left sidebar navigation with product areas (Project Management, Portfolio Management, Resource Management, Strategic Planning) and constraint filters (Time, Money, Resource). Main content area shows a page title, description, constraint pills, and a list of entry cards grouped by section. Each card has a title, body text, type badge, constraint pills, source badge, contributor name and timestamp.
2. Search screen — full-height chat interface with a welcome state showing suggestion chips, a message thread with user and agent bubbles, agent bubbles containing inline entry reference cards, a typing indicator (three animated dots), and a bottom input bar with auto-resizing textarea and send button.
3. Change history screen — chronological log of contribution cards each showing contributor, timestamp, source badge, summary text, stat pills (+N added), and page names.
4. Contribute modal — overlay with backdrop, form fields for name, title, description, product area checkboxes (2-col grid), constraint checkboxes, entry type select, and a footer with Cancel and Save buttons.
Use the colour palette, typography scale, spacing tokens, and component specs defined in the attached design specification document. Font is Inter. Desktop frame 1440×900px. All colours defined as Figma variables.


Product Wiki Design Specification  ·  v1.0  ·  April 2026  ·  For use with Figma Make
