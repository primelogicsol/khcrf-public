import { Page } from '@playwright/test';

export async function fillInstitutionRegistration(page: Page, auditId: string) {
  // InstitutionRegistrationForm lacks 'name' attributes on inputs.
  const textInputs = await page.locator('input[type="text"]').all();
  if (textInputs.length > 0) await textInputs[0].fill(`Test Institution ${auditId}`);
  if (textInputs.length > 1) await textInputs[1].fill(`Rep ${auditId}`);
  if (textInputs.length > 2) await textInputs[2].fill('Director');
  
  const emailInputs = await page.locator('input[type="email"]').all();
  if (emailInputs.length > 0) {
    await emailInputs[0].fill(`test+${auditId}@example.com`);
  }

  const telInputs = await page.locator('input[type="tel"]').all();
  if (telInputs.length > 0) await telInputs[0].fill('9999999999');
  
  const selects = await page.locator('select').all();
  if (selects.length > 0) await selects[0].selectOption({ index: 1 }); // Category
  if (selects.length > 1) await selects[1].selectOption({ label: 'India' }); // Country
  
  // Wait for state dropdown to appear
  await page.waitForTimeout(200);
  
  // Re-fetch selects because the DOM changed
  const newSelects = await page.locator('select').all();
  if (newSelects.length > 2) await newSelects[2].selectOption({ label: 'Jammu & Kashmir' }); // State
  
  await page.waitForTimeout(200);
  const finalSelects = await page.locator('select').all();
  if (finalSelects.length > 3) {
    await finalSelects[3].evaluate((select: HTMLSelectElement) => {
      select.value = 'Anantnag';
      select.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }
  
  // Click first radio
  const radios = page.locator('input[type="radio"]');
  if (await radios.count() > 0) {
    await radios.first().click({ force: true });
  }

  // Click all checkboxes
  const checkboxes = page.locator('input[type="checkbox"]');
  const count = await checkboxes.count();
  for (let i = 0; i < count; i++) {
    await checkboxes.nth(i).click({ force: true });
  }

  const textareas = await page.locator('textarea').all();
  if (textareas.length > 0) await textareas[0].fill(`General Collaboration`);
}

export async function fillAdvisorForm(page: Page, auditId: string) {
  // AdvisorForm has 'name' attributes
  await page.locator('input[name="fullName"]').fill(`Advisor ${auditId}`);
  await page.locator('input[name="email"]').fill(`test+${auditId}@example.com`);
  await page.locator('input[name="phone"]').fill('9999999999');
  await page.locator('input[name="organization"]').fill('Test Institution');
  
  await page.locator('textarea[name="statement"]').fill(`This is a valid test statement that definitely exceeds fifty characters for the audit ${auditId}`);
  
  await page.locator('select[name="advisoryScope"]').selectOption({ index: 1 });
  await page.locator('select[name="category"]').selectOption({ index: 1 });
  await page.locator('select[name="district"]').selectOption({ index: 1 });

  const consent = page.locator('input[name="consentAccepted"]');
  if (await consent.count() > 0) await consent.check({ force: true });
}

export async function fillFellowshipForm(page: Page, auditId: string) {
  // BecomeAFellowPage lacks 'name' attributes
  const textInputs = await page.locator('input[type="text"]').all();
  if (textInputs.length > 0) await textInputs[0].fill(`Fellow ${auditId}`); // Full Name
  if (textInputs.length > 1) await textInputs[1].fill('Srinagar'); // District
  if (textInputs.length > 2) await textInputs[2].fill('BSc'); // Education
  if (textInputs.length > 3) await textInputs[3].fill('Test Institution'); // Institution
  if (textInputs.length > 4) await textInputs[4].fill('Analysis'); // Skills

  const telInputs = await page.locator('input[type="tel"]').all();
  if (telInputs.length > 0) await telInputs[0].fill('9999999999');
  
  const emailInputs = await page.locator('input[type="email"]').all();
  if (emailInputs.length > 0) await emailInputs[0].fill(`test+${auditId}@example.com`);
  
  const selects = await page.locator('select').all();
  if (selects.length > 0) await selects[0].selectOption({ index: 1 });

  const textareas = await page.locator('textarea').all();
  if (textareas.length > 0) await textareas[0].fill(`This is a valid test statement that definitely exceeds fifty characters for the audit ${auditId}`);

  const checkboxes = page.locator('input[type="checkbox"]');
  if (await checkboxes.count() > 0) {
    await checkboxes.first().click({ force: true });
  }
}

export async function fillEvidenceRepository(page: Page, auditId: string) {
  const inputs = await page.locator('input[type="text"]').all();
  if (inputs.length > 0) {
    await inputs[0].fill(`Search ${auditId}`);
  }
}

export async function fillRequestInvitation(page: Page, auditId: string) {
  // RequestInvitationPage has 'name' attributes
  await page.locator('input[name="fullName"]').fill(`Requester ${auditId}`);
  await page.locator('input[name="institution"]').fill('Test Institution');
  await page.locator('input[name="officialEmail"]').fill(`test+${auditId}@example.com`);
  
  await page.locator('select[name="contributorCategory"]').selectOption({ index: 1 });
  await page.locator('textarea[name="reasonForRequest"]').fill(`This is a valid test statement that definitely exceeds fifty characters for the audit ${auditId}`);

  const consent = page.locator('input[name="consentAccepted"]');
  if (await consent.count() > 0) await consent.check({ force: true });
}
