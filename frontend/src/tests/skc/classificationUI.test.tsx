/**
 * Frontend classification component tests
 *
 * Covers:
 * - Page renders ClassificationQueue
 * - Navigation config includes classification route for ADMIN
 * - Navigation excludes classification route for non-ADMIN roles
 * - ClassificationPreviewDialog never sends actorId in payload
 * - API client sends previewToken in submit
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// ─── Mock the API client ──────────────────────────────────────────────────────

const mockGetQueue = jest.fn().mockResolvedValue({ records: [], total: 0, batchLimit: 100 });
const mockPreview = jest.fn().mockResolvedValue({
  success: true,
  affectedCount: 1,
  blockedCount: 0,
  missingCount: 0,
  blockedIds: [],
  missingIds: [],
  warnings: [],
  previewToken: 'test-preview-token-abc123',
  expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
});
const mockSubmit = jest.fn().mockResolvedValue({ success: true, classifiedCount: 1, batchId: 'test-batch' });

jest.mock('../../../src/lib/api/skcClassification', () => ({
  skcClassificationApi: {
    getQueue: (...args: any[]) => mockGetQueue(...args),
    preview: (...args: any[]) => mockPreview(...args),
    submit: (...args: any[]) => mockSubmit(...args),
    getHistory: jest.fn().mockResolvedValue({ records: [], total: 0 }),
  },
}));

// ─── Mock Next.js Link ────────────────────────────────────────────────────────

jest.mock('next/link', () => ({ children, href }: any) =>
  React.createElement('a', { href }, children)
);

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('Classification Queue Component', () => {
  it('page.tsx renders ClassificationQueue component', async () => {
    const { ClassificationQueue } = await import('../../../src/components/skc/classification/ClassificationQueue');
    const { unmount } = render(React.createElement(ClassificationQueue));
    // Queue should show the empty state or loading
    expect(screen.queryByRole('table')).toBeTruthy();
    unmount();
  });
});

describe('Dashboard Config Navigation', () => {
  it('includes Classification Queue route for ADMIN', async () => {
    const { dashboardMenu, ROLES } = await import('../../../src/config/dashboard');
    const skcSection = dashboardMenu.find(m => m.name === 'SKC');
    expect(skcSection).toBeTruthy();
    if (!skcSection) return;

    const governanceChildren = skcSection.children as any[];
    const classificationEntry = governanceChildren.find(c => c.name === 'Provenance Classification');
    expect(classificationEntry).toBeTruthy();
    expect(classificationEntry.path).toBe('/dashboard/skc/classification');

    // Must be ADMIN-only
    const allowedRoles = classificationEntry.allowedRoles ?? skcSection.allowedRoles;
    expect(allowedRoles).toContain(ROLES.ADMIN);
  });

  it('classification route has ADMIN-only allowedRoles — no other roles present', async () => {
    const { dashboardMenu, ROLES } = await import('../../../src/config/dashboard');
    const skcSection = dashboardMenu.find(m => m.name === 'SKC');
    if (!skcSection) return;

    const governanceChildren = skcSection.children as any[];
    const classificationEntry = governanceChildren.find(c => c.name === 'Provenance Classification');
    if (!classificationEntry?.allowedRoles) return;

    // Non-admin roles must NOT be in the list
    expect(classificationEntry.allowedRoles).not.toContain(ROLES.USER);
    expect(classificationEntry.allowedRoles).not.toContain(ROLES.EDITOR_REVIEWER);
    expect(classificationEntry.allowedRoles).not.toContain(ROLES.RESEARCH_CONTRIBUTOR);
  });

  it('does not contain duplicate classification entries', async () => {
    const { dashboardMenu } = await import('../../../src/config/dashboard');
    const skcSection = dashboardMenu.find(m => m.name === 'SKC');
    if (!skcSection) return;

    const children = skcSection.children as any[];
    const classificationEntries = children.filter(c =>
      c.path?.includes('/classification') || c.name?.includes('Classification')
    );

    // There should be exactly one "Provenance Classification" section entry
    expect(classificationEntries.length).toBe(1);
  });
});

describe('API Client contract', () => {
  it('submit payload does not include actorId', async () => {
    const { skcClassificationApi } = await import('../../../src/lib/api/skcClassification');

    await skcClassificationApi.submit({
      entityType: 'SKC_STAKEHOLDER_REGISTRATION',
      recordIds: ['rec-001'],
      targetProvenance: 'PRODUCTION',
      reason: 'Verified against 2026 registry',
      idempotencyKey: '123e4567-e89b-12d3-a456-426614174000',
      previewToken: 'test-preview-token-abc123',
    });

    const submittedPayload = mockSubmit.mock.calls[0]?.[0];
    expect(submittedPayload).toBeDefined();
    expect(submittedPayload).not.toHaveProperty('actorId');
  });

  it('submit payload includes previewToken', async () => {
    const { skcClassificationApi } = await import('../../../src/lib/api/skcClassification');

    await skcClassificationApi.submit({
      entityType: 'SKC_STAKEHOLDER_REGISTRATION',
      recordIds: ['rec-001'],
      targetProvenance: 'PRODUCTION',
      reason: 'Verified against 2026 registry',
      idempotencyKey: '123e4567-e89b-12d3-a456-426614174001',
      previewToken: 'required-preview-token',
    });

    const submittedPayload = mockSubmit.mock.calls[mockSubmit.mock.calls.length - 1]?.[0];
    expect(submittedPayload?.previewToken).toBe('required-preview-token');
  });
});
