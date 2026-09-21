'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

// ─── Status & visibility config ───────────────────────────────────────────────
const STATUSES = ['DRAFT', 'REVIEW', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED'] as const;
type Status = typeof STATUSES[number];

const STATUS_COLOUR: Record<Status, string> = {
  DRAFT:     'bg-yellow-100 text-yellow-800',
  REVIEW:    'bg-blue-100   text-blue-800',
  SCHEDULED: 'bg-sky-100    text-sky-800',
  PUBLISHED: 'bg-emerald-100 text-emerald-800',
  ARCHIVED:  'bg-gray-100   text-gray-600',
};

// Valid lifecycle actions available per status
const LIFECYCLE: Record<Status, { label: string; action: string; colour: string }[]> = {
  DRAFT:     [{ label: 'Submit for Review', action: 'review',   colour: 'bg-blue-600 hover:bg-blue-700' },
              { label: 'Publish Now',        action: 'publish',  colour: 'bg-emerald-600 hover:bg-emerald-700' }],
  REVIEW:    [{ label: 'Publish Now',        action: 'publish',  colour: 'bg-emerald-600 hover:bg-emerald-700' },
              { label: 'Return to Draft',    action: 'revert',   colour: 'bg-gray-600 hover:bg-gray-700' }],
  SCHEDULED: [{ label: 'Publish Now',        action: 'publish',  colour: 'bg-emerald-600 hover:bg-emerald-700' },
              { label: 'Back to Draft',      action: 'revert',   colour: 'bg-gray-600 hover:bg-gray-700' }],
  PUBLISHED: [{ label: 'Archive',            action: 'archive',  colour: 'bg-amber-600 hover:bg-amber-700' }],
  ARCHIVED:  [{ label: 'Restore to Draft',   action: 'revert',   colour: 'bg-gray-600 hover:bg-gray-700' }],
};

const inputCls  = 'border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black placeholder-gray-400 w-full';
const textareaCls = `${inputCls} resize-y`;

function slugify(s: string) {
  return s.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/(^-|-$)/g, '');
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-4 pb-2 border-b border-gray-100">
      <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">{title}</h2>
      {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
    </div>
  );
}

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-700">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

export default function EditMagazineIssuePage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params?.id as string;
  const justCreated = searchParams?.get('created') === '1';

  const [issue, setIssue] = useState<any>(null);
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionBusy, setActionBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch existing issue
  useEffect(() => {
    if (!id) return;
    api.get(`/magazine-issues/admin`)
      .then(res => {
        const list = Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
        const found = list.find((i: any) => i.id === id);
        if (!found) throw new Error('Issue not found');
        setIssue(found);
        setForm({
          title:             found.title             ?? '',
          subtitle:          found.subtitle          ?? '',
          edition:           found.edition           ?? '',
          coverImage:        found.coverImage        ?? '',
          thumbnail:         found.thumbnail         ?? '',
          coverImageAlt:     found.coverImageAlt     ?? '',
          shortDescription:  found.shortDescription  ?? '',
          issueOverview:     found.issueOverview     ?? '',
          coverStoryTitle:   found.coverStoryTitle   ?? '',
          coverStory:        found.coverStory        ?? '',
          featuredCraft:     found.featuredCraft     ?? '',
          featuredCraftName: found.featuredCraftName ?? '',
          featuredCraftLabel:found.featuredCraftLabel?? '',
          featureHighlights: found.featureHighlights?.length ? found.featureHighlights : [''],
          visibility:        found.visibility        ?? 'MEMBERS_ONLY',
          downloadable:      found.downloadable      ?? false,
          readerAssetKey:    found.readerAssetKey    ?? '',
          publicationMasthead: found.publicationMasthead ?? '',
          heroKicker:        found.heroKicker        ?? '',
          heroEyebrow:       found.heroEyebrow       ?? '',
          heroFooterLine:    found.heroFooterLine    ?? '',
          heroOverlayStrength: found.heroOverlayStrength ?? 'MEDIUM',
          heroTextPosition:  found.heroTextPosition  ?? 'BOTTOM_LEFT',
          slug:              found.slug              ?? '',
          issueNumber:       found.issueNumber       ?? '',
        });
      })
      .catch(e => setError(e?.response?.data?.error ?? e.message))
      .finally(() => setLoading(false));
  }, [id]);

  function set(field: string, value: any) {
    setForm((prev: any) => ({ ...prev, [field]: value }));
  }

  function setHighlight(i: number, value: string) {
    const next = [...form.featureHighlights];
    next[i] = value;
    set('featureHighlights', next);
  }

  async function save() {
    if (!form?.title?.trim()) { setError('Title is required.'); return; }
    setSaving(true); setError(null); setSuccess(null);
    try {
      const payload = {
        ...form,
        featureHighlights: form.featureHighlights.filter(Boolean),
        coverImage:     form.coverImage     || null,
        thumbnail:      form.thumbnail      || null,
        readerAssetKey: form.readerAssetKey || null,
        publicationMasthead: form.publicationMasthead || null,
        heroKicker:        form.heroKicker || null,
        heroEyebrow:       form.heroEyebrow || null,
        heroFooterLine:    form.heroFooterLine || null,
        heroOverlayStrength: form.heroOverlayStrength || null,
        heroTextPosition:  form.heroTextPosition || null,
      };
      const res = await api.patch(`/magazine-issues/${id}`, payload);
      setIssue(res.data);
      setSuccess('Changes saved successfully.');
      setTimeout(() => setSuccess(null), 3000);
    } catch (e: any) {
      const detail = e?.response?.data?.details?.fieldErrors;
      setError(detail
        ? Object.entries(detail).map(([k, v]) => `${k}: ${(v as string[]).join(', ')}`).join('\n')
        : e?.response?.data?.error ?? e?.message ?? 'Failed to save.');
    } finally {
      setSaving(false);
    }
  }

  async function runAction(action: string) {
    const confirmMap: Record<string, string> = {
      review:  'Submit this issue for editorial review?',
      publish: 'Publish this issue? It will become publicly visible immediately.',
      archive: 'Archive this issue? It will be removed from all public listings.',
      revert:  'Return this issue to Draft status?',
      duplicate: 'Duplicate this issue? A new DRAFT will be created.',
    };
    if (confirmMap[action] && !window.confirm(confirmMap[action])) return;

    setActionBusy(action); setError(null); setSuccess(null);
    try {
      let res: any;
      if (action === 'review')    res = await api.post(`/magazine-issues/${id}/review`);
      else if (action === 'publish')   res = await api.post(`/magazine-issues/${id}/publish`);
      else if (action === 'archive')   res = await api.post(`/magazine-issues/${id}/archive`);
      else if (action === 'revert')    res = await api.patch(`/magazine-issues/${id}`, { status: 'DRAFT' });
      else if (action === 'duplicate') {
        const d = await api.post(`/magazine-issues/${id}/duplicate`);
        router.push(`/dashboard/master-artisans/magazine-issues/${d.data.id}/edit`);
        return;
      }
      setIssue(res.data);
      setForm((prev: any) => ({ ...prev, ...res.data }));
      setSuccess(`Status updated to ${res.data.status}.`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (e: any) {
      setError(e?.response?.data?.error ?? e?.message ?? 'Action failed.');
    } finally {
      setActionBusy(null);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="inline-block w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        {error ?? 'Issue not found.'}
      </div>
    );
  }

  const currentStatus: Status = (issue?.status ?? 'DRAFT') as Status;
  const availableActions = LIFECYCLE[currentStatus] ?? [];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Topbar */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <Link href="/dashboard/master-artisans/magazine-issues" className="text-gray-400 hover:text-gray-700 text-sm shrink-0">
            ← Issues
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-sm font-semibold text-gray-900 truncate">{issue?.issueNumber}</span>
          <span className={`hidden sm:inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase ${STATUS_COLOUR[currentStatus]}`}>
            {currentStatus}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {/* Lifecycle actions */}
          {availableActions.map(a => (
            <button
              key={a.action}
              onClick={() => runAction(a.action)}
              disabled={!!actionBusy || saving}
              className={`hidden sm:block px-3 py-2 text-xs text-white rounded font-medium disabled:opacity-50 transition ${a.colour}`}
            >
              {actionBusy === a.action ? '…' : a.label}
            </button>
          ))}
          <Link
            href={`/master-artisans/issues/${issue?.slug}`}
            target="_blank"
            className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 font-medium"
          >
            Preview ↗
          </Link>
          <button
            onClick={save}
            disabled={saving || !!actionBusy}
            className="px-4 py-2 text-sm bg-black text-white rounded hover:bg-gray-800 font-medium disabled:opacity-50 transition"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-8 space-y-6">
        {/* Banners */}
        {justCreated && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded text-sm">
            ✓ Issue created as a Draft. Complete the form and save, then publish when ready.
          </div>
        )}
        {success && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded text-sm">
            ✓ {success}
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm whitespace-pre-wrap">
            {error}
          </div>
        )}

        {/* Mobile lifecycle buttons */}
        {availableActions.length > 0 && (
          <div className="flex sm:hidden gap-2 flex-wrap">
            {availableActions.map(a => (
              <button
                key={a.action}
                onClick={() => runAction(a.action)}
                disabled={!!actionBusy || saving}
                className={`px-3 py-2 text-xs text-white rounded font-medium disabled:opacity-50 transition ${a.colour}`}
              >
                {actionBusy === a.action ? '…' : a.label}
              </button>
            ))}
          </div>
        )}

        {/* Identity */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <SectionHeader title="Issue Identity" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Issue Number" hint="Auto-generated — do not edit unless fixing a typo">
              <input className={`${inputCls} font-mono text-xs bg-gray-50`} value={form.issueNumber}
                onChange={e => set('issueNumber', e.target.value)} />
            </Field>
            <Field label="Slug" hint="URL path — must be unique, lowercase, hyphens only">
              <input className={`${inputCls} font-mono text-xs`} value={form.slug}
                onChange={e => set('slug', slugify(e.target.value))} />
            </Field>
            <Field label="Title" required>
              <input className={inputCls} value={form.title} onChange={e => set('title', e.target.value)} />
            </Field>
            <Field label="Subtitle">
              <input className={inputCls} value={form.subtitle} onChange={e => set('subtitle', e.target.value)} />
            </Field>
            <Field label="Edition">
              <input className={inputCls} value={form.edition} onChange={e => set('edition', e.target.value)}
                placeholder="Spring 2026" />
            </Field>
            <Field label="Visibility">
              <select className={inputCls} value={form.visibility} onChange={e => set('visibility', e.target.value)}>
                <option value="PUBLIC">Public</option>
                <option value="MEMBERS_ONLY">Members Only</option>
                <option value="HIDDEN">Hidden</option>
              </select>
            </Field>
          </div>
        </div>

        {/* Cover */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <SectionHeader title="Cover & Featured Craft" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Cover Image URL">
              <input className={inputCls} value={form.coverImage} onChange={e => set('coverImage', e.target.value)}
                placeholder="https://…/cover.jpg" />
            </Field>
            <Field label="Thumbnail URL">
              <input className={inputCls} value={form.thumbnail} onChange={e => set('thumbnail', e.target.value)}
                placeholder="https://…/thumb.jpg" />
            </Field>
            <Field label="Cover Image Alt Text">
              <input className={inputCls} value={form.coverImageAlt} onChange={e => set('coverImageAlt', e.target.value)} />
            </Field>
            <Field label="Featured Craft">
              <input className={inputCls} value={form.featuredCraft} onChange={e => set('featuredCraft', e.target.value)} />
            </Field>
            <Field label="Craft Display Name">
              <input className={inputCls} value={form.featuredCraftName} onChange={e => set('featuredCraftName', e.target.value)} />
            </Field>
            <Field label="Craft Label">
              <input className={inputCls} value={form.featuredCraftLabel} onChange={e => set('featuredCraftLabel', e.target.value)} />
            </Field>
          </div>
        </div>

        {/* Hero Presentation */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <SectionHeader title="Hero Presentation" subtitle="Editorial copy and layout over the cover image" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Publication Masthead" hint="e.g. MASTER ARTISANS or KHCRF Magazine">
              <input className={inputCls} value={form.publicationMasthead} onChange={e => set('publicationMasthead', e.target.value)}
                placeholder="MASTER ARTISANS" />
            </Field>
            <Field label="Hero Kicker" hint="Italic subtitle below masthead">
              <input className={inputCls} value={form.heroKicker} onChange={e => set('heroKicker', e.target.value)}
                placeholder="Kashmir’s Vanishing Crafts & the Artisans Defending a Legacy" />
            </Field>
            <Field label="Hero Eyebrow" hint="Small uppercase text above title">
              <input className={inputCls} value={form.heroEyebrow} onChange={e => set('heroEyebrow', e.target.value)}
                placeholder="Quarterly Review" />
            </Field>
            <Field label="Hero Footer Line" hint="Bottom accent line">
              <input className={inputCls} value={form.heroFooterLine} onChange={e => set('heroFooterLine', e.target.value)}
                placeholder="A journey into the heart of endangered artistry" />
            </Field>
            <Field label="Overlay Strength">
              <select className={inputCls} value={form.heroOverlayStrength} onChange={e => set('heroOverlayStrength', e.target.value)}>
                <option value="LIGHT">Light</option>
                <option value="MEDIUM">Medium</option>
                <option value="STRONG">Strong</option>
              </select>
            </Field>
            <Field label="Text Position">
              <select className={inputCls} value={form.heroTextPosition} onChange={e => set('heroTextPosition', e.target.value)}>
                <option value="BOTTOM_LEFT">Bottom Left</option>
                <option value="BOTTOM_CENTER">Bottom Center</option>
                <option value="CENTER">Center</option>
                <option value="TOP_LEFT">Top Left</option>
              </select>
            </Field>
          </div>
        </div>

        {/* Editorial */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <SectionHeader title="Editorial Content" />
          <div className="space-y-4">
            <Field label="Short Description">
              <textarea className={`${textareaCls} min-h-[80px]`} value={form.shortDescription}
                onChange={e => set('shortDescription', e.target.value)} />
            </Field>
            <Field label="Issue Overview">
              <textarea className={`${textareaCls} min-h-[120px]`} value={form.issueOverview}
                onChange={e => set('issueOverview', e.target.value)} />
            </Field>
            <Field label="Cover Story Title">
              <input className={inputCls} value={form.coverStoryTitle} onChange={e => set('coverStoryTitle', e.target.value)} />
            </Field>
            <Field label="Cover Story">
              <textarea className={`${textareaCls} min-h-[120px]`} value={form.coverStory}
                onChange={e => set('coverStory', e.target.value)} />
            </Field>
          </div>
        </div>

        {/* Highlights */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <SectionHeader title="Feature Highlights" subtitle="Key topics covered in this issue" />
          <div className="space-y-2">
            {form.featureHighlights.map((h: string, i: number) => (
              <div key={i} className="flex gap-2">
                <input className={inputCls} value={h} onChange={e => setHighlight(i, e.target.value)}
                  placeholder={`Highlight ${i + 1}`} />
                <button
                  onClick={() => set('featureHighlights', form.featureHighlights.filter((_: any, idx: number) => idx !== i))}
                  disabled={form.featureHighlights.length === 1}
                  className="px-3 py-2 text-red-400 hover:text-red-600 disabled:opacity-30 border border-gray-200 rounded text-sm"
                >×</button>
              </div>
            ))}
            {form.featureHighlights.length < 10 && (
              <button onClick={() => set('featureHighlights', [...form.featureHighlights, ''])}
                className="text-sm text-blue-600 hover:text-blue-800 mt-1">
                + Add highlight
              </button>
            )}
          </div>
        </div>

        {/* Reader */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <SectionHeader title="Reader Content" subtitle="PDF asset for the digital reader" />
          <div className="space-y-3">
            <Field label="Reader Asset URL (PDF)" hint="Only delivered to authorized members server-side — never exposed publicly">
              <input className={inputCls} value={form.readerAssetKey}
                onChange={e => set('readerAssetKey', e.target.value)}
                placeholder="https://res.cloudinary.com/…/issue.pdf" />
            </Field>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={form.downloadable} onChange={e => set('downloadable', e.target.checked)}
                className="w-4 h-4 rounded border-gray-300" />
              Allow approved members to download this PDF
            </label>
          </div>
        </div>

        {/* Danger zone */}
        <div className="bg-white rounded-lg border border-red-100 p-6">
          <SectionHeader title="Danger Zone" />
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => runAction('duplicate')}
              disabled={!!actionBusy || saving}
              className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 font-medium disabled:opacity-50"
            >
              {actionBusy === 'duplicate' ? 'Duplicating…' : 'Duplicate Issue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
