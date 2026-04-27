import React, { useState, useRef, useCallback, KeyboardEvent } from 'react';
import { ConstraintType, ProductArea, WikiEntry } from '../data/mockData';

interface ContributeModalProps {
  onClose: () => void;
  onSave: (entry: Omit<WikiEntry, 'id' | 'timestamp' | 'isNew'>) => void;
}

const PRODUCT_AREAS: ProductArea[] = [
  'Project Management',
  'Portfolio Management',
  'Resource Management',
  'Strategic Planning',
];

const CONSTRAINTS: ConstraintType[] = ['Time', 'Money', 'Resource'];

interface FormErrors {
  contributor?: boolean;
  title?: boolean;
  body?: boolean;
  areas?: boolean;
  constraints?: boolean;
}

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  file: File;
}

const MIME_TO_EXT: Record<string, string> = {
  'application/pdf': 'PDF',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
  'application/msword': 'DOCX',
  'text/plain': 'TXT',
  'text/markdown': 'MD',
  'application/json': 'JSON',
  'text/csv': 'CSV',
};

const FILE_COLORS: Record<string, { bg: string; color: string }> = {
  PDF:  { bg: '#E6F1FB', color: '#0C447C' },
  DOCX: { bg: '#E1F5EE', color: '#085041' },
  TXT:  { bg: '#F1EFE8', color: '#444441' },
  MD:   { bg: '#F1EFE8', color: '#444441' },
  JSON: { bg: '#EEEDFE', color: '#3C3489' },
  CSV:  { bg: '#E1F5EE', color: '#085041' },
};

function getFileExt(file: UploadedFile): string {
  return MIME_TO_EXT[file.type]
    ?? file.name.split('.').pop()?.toUpperCase()
    ?? 'FILE';
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Tag colours cycle through a palette
const TAG_PALETTE: { bg: string; color: string }[] = [
  { bg: '#E6F1FB', color: '#0C447C' },
  { bg: '#E1F5EE', color: '#085041' },
  { bg: '#FAEEDA', color: '#633806' },
  { bg: '#EEEDFE', color: '#3C3489' },
  { bg: '#F1EFE8', color: '#444441' },
  { bg: '#FCEBEB', color: '#791F1F' },
];

function tagColor(tag: string): { bg: string; color: string } {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  return TAG_PALETTE[Math.abs(hash) % TAG_PALETTE.length];
}

export function ContributeModal({ onClose, onSave }: ContributeModalProps) {
  const [contributor, setContributor] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [selectedAreas, setSelectedAreas] = useState<ProductArea[]>([]);
  const [selectedConstraints, setSelectedConstraints] = useState<ConstraintType[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);

  const toggleArea = (area: ProductArea) => {
    setSelectedAreas(prev =>
      prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]
    );
    if (errors.areas) setErrors(e => ({ ...e, areas: false }));
  };

  const toggleConstraint = (c: ConstraintType) => {
    setSelectedConstraints(prev =>
      prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]
    );
    if (errors.constraints) setErrors(e => ({ ...e, constraints: false }));
  };

  /* ── Tags ────────────────────────────────────────────────── */
  const addTag = useCallback((raw: string) => {
    const value = raw.trim().replace(/,+$/, '').trim();
    if (!value) return;
    setTags(prev => prev.includes(value) ? prev : [...prev, value]);
    setTagInput('');
  }, []);

  const removeTag = (tag: string) =>
    setTags(prev => prev.filter(t => t !== tag));

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(tagInput);
    } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  /* ── Files ───────────────────────────────────────────────── */
  const addFiles = useCallback((fileList: FileList | null) => {
    if (!fileList) return;
    const newFiles: UploadedFile[] = Array.from(fileList).map(f => ({
      name: f.name,
      size: f.size,
      type: f.type,
      file: f,
    }));
    setUploadedFiles(prev => {
      const existing = new Set(prev.map(f => f.name));
      return [...prev, ...newFiles.filter(f => !existing.has(f.name))];
    });
    // Auto-add extension tag for each file
    newFiles.forEach(f => {
      const ext = getFileExt(f);
      addTag(ext);
    });
  }, [addTag]);

  const removeFile = (name: string) =>
    setUploadedFiles(prev => prev.filter(f => f.name !== name));

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  /* ── Save ────────────────────────────────────────────────── */
  const handleSave = () => {
    const newErrors: FormErrors = {};
    if (!contributor.trim()) newErrors.contributor = true;
    if (!title.trim()) newErrors.title = true;
    if (!body.trim()) newErrors.body = true;
    if (selectedAreas.length === 0) newErrors.areas = true;
    if (selectedConstraints.length === 0) newErrors.constraints = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      title: title.trim(),
      body: body.trim(),
      constraints: selectedConstraints,
      areas: selectedAreas,
      tags: tags.length > 0 ? tags : undefined,
      contributor: contributor.trim(),
      contributorInitials: contributor.trim().split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
    });
  };

  /* ── Styles ──────────────────────────────────────────────── */
  const inputStyle = (hasError?: boolean): React.CSSProperties => ({
    width: '100%',
    fontSize: '12px',
    padding: '7px 10px',
    borderRadius: '6px',
    border: `0.5px solid ${hasError ? '#E24B4A' : '#E0E0E0'}`,
    backgroundColor: '#F7F7F7',
    color: '#0D0D0D',
    fontFamily: 'Inter, system-ui, sans-serif',
    outline: 'none',
    boxSizing: 'border-box',
  });

  const labelStyle: React.CSSProperties = {
    fontSize: '11px',
    fontWeight: 500,
    color: '#888888',
    display: 'block',
    marginBottom: '5px',
  };

  const fieldGroupStyle: React.CSSProperties = { marginBottom: '14px' };

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.35)',
          zIndex: 10,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '30px 20px',
          overflowY: 'auto',
        }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        {/* Modal panel */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '0.5px solid #E0E0E0',
            padding: '20px',
            maxWidth: '500px',
            width: '100%',
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h2 style={{ fontSize: '15px', fontWeight: 500, color: '#0D0D0D', margin: 0, lineHeight: 1.3 }}>
                Add Wiki Entry
              </h2>
              <p style={{ fontSize: '12px', color: '#888888', margin: '4px 0 0' }}>
                Contribute a new entry to the product knowledge base.
              </p>
            </div>
            <button
              onClick={onClose}
              title="Close"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#AAAAAA',
                borderRadius: '4px',
                flexShrink: 0,
                marginLeft: '12px',
                marginTop: '1px',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#0D0D0D'; e.currentTarget.style.backgroundColor = '#F0F0F0'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#AAAAAA'; e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* File Upload */}
          <div style={fieldGroupStyle}>
            <label style={labelStyle}>
              Source Files
              <span style={{ fontWeight: 400, marginLeft: '4px' }}>— file type auto-tags on upload</span>
            </label>

            {/* Drop zone */}
            <div
              onDrop={handleDrop}
              onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `1px dashed ${isDragOver ? '#0D0D0D' : '#CCCCCC'}`,
                borderRadius: '6px',
                backgroundColor: isDragOver ? '#F0F0F0' : '#FAFAFA',
                padding: '14px 12px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'border-color 0.15s, background-color 0.15s',
              }}
            >
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: '#EBEBEB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 8px',
              }}>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M6.5 9V2M3.5 5L6.5 2 9.5 5" stroke="#888888" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M1.5 10.5v1a0.5 0.5 0 00.5.5h9a0.5 0.5 0 00.5-.5v-1" stroke="#888888" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
              </div>
              <p style={{ fontSize: '11px', fontWeight: 500, color: '#333333', margin: '0 0 2px' }}>
                Drop files here or <span style={{ color: '#0D0D0D', textDecoration: 'underline' }}>browse</span>
              </p>
              <p style={{ fontSize: '10px', color: '#AAAAAA', margin: 0 }}>
                PDF, DOCX, TXT, MD, CSV, JSON
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt,.md,.csv,.json"
              style={{ display: 'none' }}
              onChange={e => { addFiles(e.target.files); e.target.value = ''; }}
            />

            {/* File list */}
            {uploadedFiles.length > 0 && (
              <div style={{ marginTop: '7px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {uploadedFiles.map(f => {
                  const ext = getFileExt(f);
                  const colors = FILE_COLORS[ext] ?? { bg: '#F1EFE8', color: '#444441' };
                  return (
                    <div
                      key={f.name}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 9px',
                        borderRadius: '6px',
                        border: '0.5px solid #E0E0E0',
                        backgroundColor: '#FFFFFF',
                      }}
                    >
                      <span style={{
                        fontSize: '9px',
                        fontWeight: 600,
                        padding: '2px 5px',
                        borderRadius: '4px',
                        backgroundColor: colors.bg,
                        color: colors.color,
                        flexShrink: 0,
                        letterSpacing: '0.03em',
                      }}>
                        {ext}
                      </span>
                      <span style={{
                        flex: 1,
                        fontSize: '11px',
                        color: '#0D0D0D',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {f.name}
                      </span>
                      <span style={{ fontSize: '10px', color: '#AAAAAA', flexShrink: 0 }}>
                        {formatBytes(f.size)}
                      </span>
                      <button
                        onClick={() => removeFile(f.name)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '2px',
                          display: 'flex',
                          alignItems: 'center',
                          color: '#AAAAAA',
                          flexShrink: 0,
                        }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#E24B4A')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#AAAAAA')}
                      >
                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                          <path d="M2 2l7 7M9 2L2 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                        </svg>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Product Areas */}
          <div style={fieldGroupStyle}>
            <label style={{ ...labelStyle, color: errors.areas ? '#E24B4A' : '#888888' }}>
              Product Area * {errors.areas && '— Select at least one'}
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              {PRODUCT_AREAS.map(area => {
                const checked = selectedAreas.includes(area);
                return (
                  <button
                    key={area}
                    onClick={() => toggleArea(area)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '12px',
                      padding: '6px 8px',
                      borderRadius: '6px',
                      border: `0.5px solid ${checked ? '#5DCAA5' : '#E0E0E0'}`,
                      backgroundColor: checked ? '#E1F5EE' : '#FFFFFF',
                      color: '#0D0D0D',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontFamily: 'Inter, system-ui, sans-serif',
                      transition: 'background-color 0.1s, border-color 0.1s',
                    }}
                  >
                    <div style={{
                      width: '14px',
                      height: '14px',
                      borderRadius: '3px',
                      border: `1.5px solid ${checked ? '#1D9E75' : '#CCCCCC'}`,
                      backgroundColor: checked ? '#1D9E75' : 'transparent',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {checked && (
                        <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                          <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    {area}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Constraints */}
          <div style={fieldGroupStyle}>
            <label style={{ ...labelStyle, color: errors.constraints ? '#E24B4A' : '#888888' }}>
              Constraint * {errors.constraints && '— Select at least one'}
            </label>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {CONSTRAINTS.map(c => {
                const checked = selectedConstraints.includes(c);
                return (
                  <button
                    key={c}
                    onClick={() => toggleConstraint(c)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '12px',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      border: `0.5px solid ${checked ? '#5DCAA5' : '#E0E0E0'}`,
                      backgroundColor: checked ? '#E1F5EE' : '#FFFFFF',
                      color: '#0D0D0D',
                      cursor: 'pointer',
                      fontFamily: 'Inter, system-ui, sans-serif',
                      transition: 'background-color 0.1s, border-color 0.1s',
                    }}
                  >
                    <div style={{
                      width: '14px',
                      height: '14px',
                      borderRadius: '3px',
                      border: `1.5px solid ${checked ? '#1D9E75' : '#CCCCCC'}`,
                      backgroundColor: checked ? '#1D9E75' : 'transparent',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {checked && (
                        <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                          <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    {c}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div style={{ borderTop: '0.5px solid #E0E0E0', margin: '4px 0 14px' }} />

          {/* Contributor Name */}
          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Your Name *</label>
            <input
              type="text"
              placeholder="e.g. Sarah Chen"
              value={contributor}
              onChange={e => { setContributor(e.target.value); if (errors.contributor) setErrors(err => ({ ...err, contributor: false })); }}
              style={inputStyle(errors.contributor)}
              onFocus={e => { e.target.style.borderColor = '#0D0D0D'; e.target.style.boxShadow = '0 0 0 3px rgba(13,13,13,0.1)'; }}
              onBlur={e => { e.target.style.borderColor = errors.contributor ? '#E24B4A' : '#E0E0E0'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          {/* Title */}
          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Entry Title *</label>
            <input
              type="text"
              placeholder="e.g. Task Recurrence Limitation"
              value={title}
              onChange={e => { setTitle(e.target.value); if (errors.title) setErrors(err => ({ ...err, title: false })); }}
              style={inputStyle(errors.title)}
              onFocus={e => { e.target.style.borderColor = '#0D0D0D'; e.target.style.boxShadow = '0 0 0 3px rgba(13,13,13,0.1)'; }}
              onBlur={e => { e.target.style.borderColor = errors.title ? '#E24B4A' : '#E0E0E0'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          {/* Description */}
          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Description *</label>
            <textarea
              placeholder="Describe the feature, issue, or limitation in detail…"
              value={body}
              onChange={e => { setBody(e.target.value); if (errors.body) setErrors(err => ({ ...err, body: false })); }}
              style={{ ...inputStyle(errors.body), minHeight: '80px', resize: 'vertical', padding: '8px 10px' }}
              onFocus={e => { e.target.style.borderColor = '#0D0D0D'; e.target.style.boxShadow = '0 0 0 3px rgba(13,13,13,0.1)'; }}
              onBlur={e => { e.target.style.borderColor = errors.body ? '#E24B4A' : '#E0E0E0'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          {/* Tags */}
          <div style={fieldGroupStyle}>
            <label style={labelStyle}>
              Tags
              <span style={{ fontWeight: 400, marginLeft: '4px' }}>— press Enter or comma to add</span>
            </label>
            <div
              onClick={() => tagInputRef.current?.focus()}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 8px',
                borderRadius: '6px',
                border: '0.5px solid #E0E0E0',
                backgroundColor: '#F7F7F7',
                cursor: 'text',
                minHeight: '34px',
              }}
            >
              {tags.map(tag => {
                const c = tagColor(tag);
                return (
                  <span
                    key={tag}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      backgroundColor: c.bg,
                      color: c.color,
                      fontSize: '10px',
                      fontWeight: 500,
                      padding: '2px 6px 2px 7px',
                      borderRadius: '8px',
                      whiteSpace: 'nowrap',
                      lineHeight: 1,
                    }}
                  >
                    {tag}
                    <button
                      onClick={e => { e.stopPropagation(); removeTag(tag); }}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: '0 1px',
                        cursor: 'pointer',
                        color: 'inherit',
                        opacity: 0.6,
                        display: 'flex',
                        alignItems: 'center',
                        lineHeight: 1,
                      }}
                      onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                      onMouseLeave={e => (e.currentTarget.style.opacity = '0.6')}
                    >
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <path d="M1.5 1.5l5 5M6.5 1.5l-5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </span>
                );
              })}
              <input
                ref={tagInputRef}
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                onBlur={() => { if (tagInput.trim()) addTag(tagInput); }}
                placeholder={tags.length === 0 ? 'e.g. bug, performance, ui…' : ''}
                style={{
                  border: 'none',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  fontSize: '12px',
                  color: '#0D0D0D',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  minWidth: '120px',
                  flex: 1,
                  padding: '1px 2px',
                }}
              />
            </div>
          </div>

          {/* Footer */}
          <div style={{
            display: 'flex',
            gap: '8px',
            justifyContent: 'flex-end',
            borderTop: '0.5px solid #E0E0E0',
            paddingTop: '14px',
            marginTop: '4px',
          }}>
            <button
              onClick={onClose}
              style={{
                fontSize: '12px',
                fontWeight: 400,
                padding: '5px 12px',
                borderRadius: '6px',
                backgroundColor: '#FFFFFF',
                color: '#0D0D0D',
                border: '0.5px solid #CCCCCC',
                cursor: 'pointer',
                fontFamily: 'Inter, system-ui, sans-serif',
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F7F7F7')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
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
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.98)')}
              onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
              Save Entry{uploadedFiles.length > 0 ? ` · ${uploadedFiles.length} file${uploadedFiles.length > 1 ? 's' : ''}` : ''}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}