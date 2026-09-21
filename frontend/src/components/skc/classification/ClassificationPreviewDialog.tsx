"use client";

import React, { useState, useId } from 'react';
import { skcClassificationApi } from '@/lib/api/skcClassification';
import { ProvenanceBadge } from '@/components/skc/classification/ProvenanceBadge';

interface Props {
  selectedIds: string[];
  entityType: string;
  onClose: () => void;
  onSuccess: () => void;
}

const PROVENANCE_OPTIONS = [
  { value: 'PRODUCTION', label: 'PRODUCTION — Verified, public-eligible record' },
  { value: 'TEST', label: 'TEST — Internal testing record, excluded from public metrics' },
];

export function ClassificationPreviewDialog({ selectedIds, entityType, onClose, onSuccess }: Props) {
  const formId = useId();
  const [step, setStep] = useState<'configure' | 'preview' | 'submitting' | 'error'>('configure');
  const [targetProvenance, setTargetProvenance] = useState('PRODUCTION');
  const [reason, setReason] = useState('');
  const [preview, setPreview] = useState<any>(null);
  const [previewToken, setPreviewToken] = useState('');
  const [previewExpiry, setPreviewExpiry] = useState('');
  const [error, setError] = useState('');

  const handlePreview = async () => {
    setError('');
    try {
      const data = await skcClassificationApi.preview({
        entityType,
        recordIds: selectedIds,
        targetProvenance,
      });
      setPreview(data);
      setPreviewToken(data.previewToken);
      setPreviewExpiry(data.expiresAt ?? '');
      setStep('preview');
    } catch (err: any) {
      setError(err.response?.data?.error ?? err.message ?? 'Preview failed');
    }
  };

  const handleSubmit = async () => {
    if (!previewToken) return;
    setStep('submitting');
    setError('');
    try {
      await skcClassificationApi.submit({
        entityType,
        recordIds: selectedIds,
        targetProvenance,
        reason,
        idempotencyKey: crypto.randomUUID(),
        previewToken,
      });
      onSuccess();
    } catch (err: any) {
      const code = err.response?.data?.code;
      const msg = err.response?.data?.error ?? err.message ?? 'Classification failed';
      if (code === 'STALE_PREVIEW') {
        setError('Preview is stale — records changed since preview was generated. Close and generate a new preview.');
      } else {
        setError(msg);
      }
      setStep('error');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${formId}-title`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div className="bg-background rounded-xl shadow-2xl w-full max-w-lg mx-4 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b">
          <h2 id={`${formId}-title`} className="text-lg font-bold">
            {step === 'configure' ? 'Configure Classification' : 'Preview Classification'}
          </h2>
          <button onClick={onClose} aria-label="Close dialog" className="text-muted-foreground hover:text-foreground text-xl leading-none">&times;</button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {error && (
            <div role="alert" className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
              {error}
            </div>
          )}

          {step === 'configure' && (
            <>
              <p className="text-sm text-muted-foreground">
                You are classifying <strong>{selectedIds.length}</strong> {entityType.replace(/_/g, ' ')} record{selectedIds.length !== 1 ? 's' : ''}.
              </p>

              <div className="space-y-2">
                <label className="block text-sm font-medium" htmlFor={`${formId}-provenance`}>
                  Target Provenance
                </label>
                <select
                  id={`${formId}-provenance`}
                  value={targetProvenance}
                  onChange={e => setTargetProvenance(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                >
                  {PROVENANCE_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium" htmlFor={`${formId}-reason`}>
                  Reason <span className="text-muted-foreground font-normal">(required, min 10 chars)</span>
                </label>
                <textarea
                  id={`${formId}-reason`}
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  rows={4}
                  placeholder="Provide a clear justification for this provenance change..."
                  className="w-full border rounded-md px-3 py-2 text-sm bg-background resize-none"
                />
              </div>
            </>
          )}

          {(step === 'preview' || step === 'error') && preview && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-700">{preview.affectedCount}</p>
                  <p className="text-xs text-green-600">Will be classified</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <p className="text-2xl font-bold text-orange-700">{preview.blockedCount}</p>
                  <p className="text-xs text-orange-600">Blocked (invalid transition)</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-700">{preview.missingCount}</p>
                  <p className="text-xs text-gray-600">Not found</p>
                </div>
              </div>

              {preview.warnings?.length > 0 && (
                <ul className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded p-3 space-y-1">
                  {preview.warnings.map((w: string, i: number) => <li key={i}>⚠ {w}</li>)}
                </ul>
              )}

              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Target:</span>
                <ProvenanceBadge provenance={targetProvenance} />
                {previewExpiry && (
                  <span className="ml-auto text-xs text-muted-foreground">
                    Token expires {new Date(previewExpiry).toLocaleTimeString()}
                  </span>
                )}
              </div>

              {preview.affectedCount === 0 && (
                <p className="text-sm text-muted-foreground text-center py-2">
                  No records can be classified with the selected target provenance.
                </p>
              )}
            </div>
          )}

          {step === 'submitting' && (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={step === 'submitting'}
            className="px-4 py-2 border rounded-md text-sm"
          >
            Cancel
          </button>

          {step === 'configure' && (
            <button
              onClick={handlePreview}
              disabled={reason.trim().length < 10}
              id="preview-btn"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium disabled:opacity-40"
            >
              Generate Preview
            </button>
          )}

          {step === 'preview' && preview?.affectedCount > 0 && (
            <button
              onClick={handleSubmit}
              id="confirm-classify-btn"
              className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
            >
              Confirm: Classify {preview.affectedCount} Record{preview.affectedCount !== 1 ? 's' : ''}
            </button>
          )}

          {step === 'error' && (
            <button
              onClick={() => { setPreviewToken(''); setStep('configure'); }}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium"
            >
              Start Over
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
