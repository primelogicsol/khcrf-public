'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────
interface IssueFormData {
  title: string;
  subtitle: string;
  edition: string;
  coverImage: string;
  thumbnail: string;
  coverImageAlt: string;
  shortDescription: string;
  issueOverview: string;
  coverStoryTitle: string;
  coverStory: string;
  featuredCraft: string;
  featuredCraftName: string;
  featuredCraftLabel: string;
  featureHighlights: string[];
  visibility: string;
  downloadable: boolean;
  readerAssetKey: string;
  publicationMasthead: string;
  heroKicker: string;
  heroEyebrow: string;
  heroFooterLine: string;
  heroOverlayStrength: string;
  heroTextPosition: string;
}

const EMPTY_FORM: IssueFormData = {
  title:             '',
  subtitle:          '',
  edition:           '',
  coverImage:        '',
  thumbnail:         '',
  coverImageAlt:     '',
  shortDescription:  '',
  issueOverview:     '',
  coverStoryTitle:   '',
  coverStory:        '',
  featuredCraft:     '',
  featuredCraftName: '',
  featuredCraftLabel:'',
  featureHighlights: [''],
  visibility:        'MEMBERS_ONLY',
  downloadable:      false,
  readerAssetKey:    '',
  publicationMasthead: '',
  heroKicker:        '',
  heroEyebrow:       '',
  heroFooterLine:    '',
  heroOverlayStrength: 'MEDIUM',
  heroTextPosition:  'BOTTOM_LEFT',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
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

const inputCls = 'border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black placeholder-gray-400 w-full';
const textareaCls = `${inputCls} resize-y min-h-[90px]`;

export default function CreateMagazineIssuePage() {
  const router = useRouter();
  const [form, setForm] = useState<IssueFormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugOverride, setSlugOverride] = useState('');

  // Derived slug preview
  const slugPreview = slugOverride || slugify(form.title) || '—';

  function set(field: keyof IssueFormData, value: any) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function setHighlight(i: number, value: string) {
    const next = [...form.featureHighlights];
    next[i] = value;
    setForm(prev => ({ ...prev, featureHighlights: next }));
  }
  function addHighlight()    { setForm(prev => ({ ...prev, featureHighlights: [...prev.featureHighlights, ''] })); }
  function removeHighlight(i: number) {
    setForm(prev => ({ ...prev, featureHighlights: prev.featureHighlights.filter((_, idx) => idx !== i) }));
  }

  async function submit(status: 'DRAFT' | 'PUBLISHED') {
    if (!form.title.trim()) { setError('Title is required.'); return; }
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...form,
        slug:       slugOverride || undefined,
        status,
        featureHighlights: form.featureHighlights.filter(Boolean),
        coverImage:    form.coverImage    || undefined,
        thumbnail:     form.thumbnail     || undefined,
        readerAssetKey:form.readerAssetKey|| undefined,
        publicationMasthead: form.publicationMasthead || undefined,
        heroKicker:        form.heroKicker || undefined,
        heroEyebrow:       form.heroEyebrow || undefined,
        heroFooterLine:    form.heroFooterLine || undefined,
        heroOverlayStrength: form.heroOverlayStrength || undefined,
        heroTextPosition:  form.heroTextPosition || undefined,
      };
      const res = await api.post('/magazine-issues', payload);
      router.push(`/dashboard/master-artisans/magazine-issues/${res.data.id}/edit?created=1`);
    } catch (e: any) {
      const detail = e?.response?.data?.details?.fieldErrors;
      if (detail) {
        setError(Object.entries(detail).map(([k, v]) => `${k}: ${(v as string[]).join(', ')}`).join('\n'));
      } else {
        setError(e?.response?.data?.error ?? e?.message ?? 'Failed to create issue.');
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Topbar */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/master-artisans/magazine-issues" className="text-gray-400 hover:text-gray-700 text-sm">
            ← Issues
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-sm font-semibold text-gray-900">New Issue</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => submit('DRAFT')}
            disabled={saving}
            className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 font-medium disabled:opacity-50 transition"
          >
            {saving ? 'Saving…' : 'Save Draft'}
          </button>
          <button
            onClick={() => submit('PUBLISHED')}
            disabled={saving}
            className="px-4 py-2 text-sm bg-black text-white rounded hover:bg-gray-800 font-medium disabled:opacity-50 transition"
          >
            {saving ? 'Publishing…' : 'Publish Now'}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-8 space-y-8">
        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm whitespace-pre-wrap">
            {error}
          </div>
        )}

        {/* Identity */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <SectionHeader title="Issue Identity" subtitle="Core metadata that identifies this issue" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Title" required>
              <input className={inputCls} value={form.title} onChange={e => set('title', e.target.value)}
                placeholder="The Pashmina Heritage" />
            </Field>
            <Field label="Subtitle">
              <input className={inputCls} value={form.subtitle} onChange={e => set('subtitle', e.target.value)}
                placeholder="A Definitive Guide to Kashmir's Textile" />
            </Field>
            <Field label="Edition" hint="e.g. Spring 2026">
              <input className={inputCls} value={form.edition} onChange={e => set('edition', e.target.value)}
                placeholder="Spring 2026" />
            </Field>
            <Field label="Slug" hint={`Will be: ${slugPreview}`}>
              <input className={inputCls} value={slugOverride} onChange={e => setSlugOverride(slugify(e.target.value))}
                placeholder={slugify(form.title) || 'auto-generated-from-title'} />
            </Field>
            <Field label="Visibility" required>
              <select className={inputCls} value={form.visibility} onChange={e => set('visibility', e.target.value)}>
                <option value="PUBLIC">Public — visible to everyone</option>
                <option value="MEMBERS_ONLY">Members Only — approved members only</option>
                <option value="HIDDEN">Hidden — not discoverable</option>
              </select>
            </Field>
            <Field label="Downloadable">
              <label className="flex items-center gap-2 text-sm text-gray-700 mt-2 cursor-pointer">
                <input type="checkbox" checked={form.downloadable} onChange={e => set('downloadable', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300" />
                Allow approved members to download PDF
              </label>
            </Field>
          </div>
        </div>

        {/* Cover & Craft */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <SectionHeader title="Cover & Featured Craft" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Cover Image URL" hint="Full URL to cover image (1:1.4 ratio recommended)">
              <input className={inputCls} value={form.coverImage} onChange={e => set('coverImage', e.target.value)}
                placeholder="https://…/cover.jpg" />
            </Field>
            <Field label="Thumbnail URL" hint="Smaller preview image">
              <input className={inputCls} value={form.thumbnail} onChange={e => set('thumbnail', e.target.value)}
                placeholder="https://…/thumb.jpg" />
            </Field>
            <Field label="Cover Image Alt Text">
              <input className={inputCls} value={form.coverImageAlt} onChange={e => set('coverImageAlt', e.target.value)}
                placeholder="Artisan weaving Pashmina on a handloom" />
            </Field>
            <Field label="Featured Craft" hint="Free text or taxonomy name">
              <input className={inputCls} value={form.featuredCraft} onChange={e => set('featuredCraft', e.target.value)}
                placeholder="Pashmina Weaving" />
            </Field>
            <Field label="Craft Display Name">
              <input className={inputCls} value={form.featuredCraftName} onChange={e => set('featuredCraftName', e.target.value)}
                placeholder="Pashmina" />
            </Field>
            <Field label="Craft Label">
              <input className={inputCls} value={form.featuredCraftLabel} onChange={e => set('featuredCraftLabel', e.target.value)}
                placeholder="Featured Craft" />
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

        {/* Descriptions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <SectionHeader title="Editorial Content" />
          <div className="grid grid-cols-1 gap-4">
            <Field label="Short Description" hint="Shown on listing cards (max 1000 chars)">
              <textarea className={textareaCls} value={form.shortDescription}
                onChange={e => set('shortDescription', e.target.value)}
                placeholder="Brief editorial summary for the listing page…" />
            </Field>
            <Field label="Issue Overview" hint="Full editorial overview shown on detail page">
              <textarea className={`${textareaCls} min-h-[140px]`} value={form.issueOverview}
                onChange={e => set('issueOverview', e.target.value)}
                placeholder="Detailed editorial description of this issue's scope and significance…" />
            </Field>
            <Field label="Cover Story Title">
              <input className={inputCls} value={form.coverStoryTitle} onChange={e => set('coverStoryTitle', e.target.value)}
                placeholder="From Changthangi Goat to Global Luxury" />
            </Field>
            <Field label="Cover Story" hint="Extended cover story teaser or intro paragraph">
              <textarea className={`${textareaCls} min-h-[120px]`} value={form.coverStory}
                onChange={e => set('coverStory', e.target.value)}
                placeholder="Lead editorial copy for the cover story…" />
            </Field>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <SectionHeader title="Feature Highlights" subtitle="Key topics covered in this issue (up to 10)" />
          <div className="space-y-2">
            {form.featureHighlights.map((h, i) => (
              <div key={i} className="flex gap-2">
                <input
                  className={inputCls}
                  value={h}
                  onChange={e => setHighlight(i, e.target.value)}
                  placeholder={`Highlight ${i + 1}`}
                />
                <button
                  onClick={() => removeHighlight(i)}
                  disabled={form.featureHighlights.length === 1}
                  className="px-3 py-2 text-red-400 hover:text-red-600 disabled:opacity-30 border border-gray-200 rounded text-sm"
                >
                  ×
                </button>
              </div>
            ))}
            {form.featureHighlights.length < 10 && (
              <button onClick={addHighlight} className="text-sm text-blue-600 hover:text-blue-800 mt-1">
                + Add highlight
              </button>
            )}
          </div>
        </div>

        {/* Reader */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <SectionHeader title="Reader Content" subtitle="PDF URL for the digital reader (members-only delivery)" />
          <Field label="Reader Asset URL" hint="Direct URL to the PDF file (Cloudinary, S3, or any public CDN)">
            <input className={inputCls} value={form.readerAssetKey}
              onChange={e => set('readerAssetKey', e.target.value)}
              placeholder="https://res.cloudinary.com/…/hcrf-mi-2026-001.pdf" />
          </Field>
          <p className="text-xs text-amber-600 mt-3 bg-amber-50 border border-amber-100 rounded px-3 py-2">
            ⚠ This URL is never exposed publicly. It is only delivered to authorized members through the server-side reader endpoint.
          </p>
        </div>

        {/* Bottom actions */}
        <div className="flex justify-end gap-3 pt-2">
          <Link href="/dashboard/master-artisans/magazine-issues"
            className="px-5 py-2.5 text-sm border border-gray-300 rounded hover:bg-gray-50 font-medium">
            Cancel
          </Link>
          <button onClick={() => submit('DRAFT')} disabled={saving}
            className="px-5 py-2.5 text-sm border border-gray-300 rounded hover:bg-gray-50 font-medium disabled:opacity-50">
            {saving ? 'Saving…' : 'Save Draft'}
          </button>
          <button onClick={() => submit('PUBLISHED')} disabled={saving}
            className="px-5 py-2.5 text-sm bg-black text-white rounded hover:bg-gray-800 font-medium disabled:opacity-50">
            {saving ? 'Publishing…' : 'Publish Now'}
          </button>
        </div>
      </div>
    </div>
  );
}
