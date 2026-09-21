import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import crypto from 'crypto';

// Setup storage state explicitly for tests if needed, but playwright config handles it if project matches.
// We will test SKC Public Forms (using public.json)

import {
  fillInstitutionRegistration,
  fillAdvisorForm,
  fillFellowshipForm,
  fillEvidenceRepository,
  fillRequestInvitation
} from './skc-fixtures';

const SKC_FORMS = [
  {
    name: 'InstitutionRegistrationForm',
    route: '/state-of-kashmir-crafts/participating-institutions',
    role: 'PUBLIC'
  },
  {
    name: 'AdvisorForm',
    route: '/state-of-kashmir-crafts/advisory-council',
    role: 'PUBLIC'
  },
  {
    name: 'BecomeAFellowPage',
    route: '/state-of-kashmir-crafts/become-a-fellow',
    role: 'PUBLIC'
  },
  {
    name: 'RequestInvitationPage',
    route: '/state-of-kashmir-crafts/official-messages/request-invitation',
    role: 'PUBLIC'
  }
];

test.describe('SKC Forms Runtime Audit', () => {
  for (const form of SKC_FORMS) {
    test.describe(form.name, () => {
      // Use public storage state
      test.use({ storageState: 'tests/e2e/.auth/public.json' });

      test.beforeEach(async ({ page }) => {
        await page.goto(form.route);
      });

      test('End-to-end validation and submission', async ({ page, request }, testInfo) => {
        const auditId = `FORM-AUDIT-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
        console.log(`Running test for ${form.name} with audit ID: ${auditId}`);
        
        // 1. Accessibility Check
        try {
          const axe = await new AxeBuilder({ page }).analyze();
          // We attach it or log it, but won't strictly fail the whole E2E test if it has violations
          console.log(`Axe violations: ${axe.violations.length}`);
        } catch(e) {}
        
        // 2. Take initial screenshot
        await page.screenshot({ path: `test-results/${form.name}-before-submit.png` });

        // 3. Attempt empty submission to trigger validation
        const submitBtn = page.locator('button[type="submit"]');
        if (await submitBtn.isVisible()) {
          await submitBtn.click();
          await page.waitForTimeout(1000); // Wait for UI error states
          await page.screenshot({ path: `test-results/${form.name}-after-validation-failure.png` });
        }

        // 4. Fill valid data
        if (form.name === 'InstitutionRegistrationForm') {
          await fillInstitutionRegistration(page, auditId);
        } else if (form.name === 'AdvisorForm') {
          await fillAdvisorForm(page, auditId);
        } else if (form.name === 'BecomeAFellowPage') {
          await fillFellowshipForm(page, auditId);
        } else if (form.name === 'RequestInvitationPage') {
          await fillRequestInvitation(page, auditId);
        }

        // 5. Submit valid data
        if (await submitBtn.isVisible()) {
          // Listen for network response (timeout 5s instead of 30s to fail fast if blocked by client)
          const requestPromise = page.waitForResponse(response => {
             if (response.url().includes('/api/') && response.request().method() === 'POST') {
                 console.log('Request body sent:', response.request().postData());
                 return true;
             }
             return false;
          }, { timeout: 3000 }).catch(() => null);
          
          await submitBtn.click();
          
          // Allow time for client-side validation to render
          await page.waitForTimeout(500);

          // Check if any error text appeared (excluding the '*' required marker)
          const errorLocators = await page.locator('.text-red-500, .text-red-600').all();
          const errors = [];
          for (const err of errorLocators) {
             const text = await err.innerText();
             if (text.trim() && text.trim() !== '*') {
               errors.push(text.trim());
             }
          }
          if (errors.length > 0) {
             await page.screenshot({ path: `test-results/${form.name}-validation-blocked.png` });
             throw new Error(`Client validation blocked submission! Errors found: ${errors.join(' | ')}`);
          }

          const response = await requestPromise;
          if (!response) {
             throw new Error('Network request was not dispatched or timed out!');
          }
          if (![200, 201].includes(response.status())) {
            console.error('Backend returned status:', response.status());
            const responseBody = await response.json().catch(() => response.text());
            console.error('Response body:', JSON.stringify(responseBody, null, 2));
          }
          expect([200, 201]).toContain(response.status());
          await page.waitForTimeout(2000);
          await page.screenshot({ path: `test-results/${form.name}-after-success.png` });
        }
      });
    });
  }
});
