import { test, expect } from '@playwright/test';

test.describe('Full Participation Forms E2E Suite', () => {

  test('1. Submit a Story E2E Flow', async ({ page }) => {
    await page.goto('http://localhost:3000/master-artisans/submit-story');

    // Section 1: Classification
    await page.selectOption('select[name="submissionType"]', 'Feature Story');
    await page.selectOption('select[name="submissionStage"]', 'Pitch');
    await page.fill('input[name="primaryEditorialTheme"]', 'Craft Processes & Technique Documentation');
    await page.selectOption('select[name="primaryCraft"]', { index: 1 });
    await page.fill('input[name="geographicScope"]', 'District-level');

    // Section 2: Author & Contributor Profile
    const uniqueTitle = `The Vanishing Looms of Kashmir ${Date.now()}`;
    await page.fill('input[name="authorName"]', 'Dr. Playwright Storyteller');
    await page.fill('input[name="authorEmail"]', `story_${Date.now()}@hcrf.org`);
    await page.fill('input[name="authorPhone"]', '+919906002233');
    await page.selectOption('select[name="contributorCategory"]', 'Independent Researcher');
    await page.fill('input[name="country"]', 'India');
    await page.fill('textarea[name="shortBio"]', 'Senior craft historian and independent researcher specializing in South Asian textile heritage.');

    // Section 3: Proposal
    await page.fill('input[name="title"]', uniqueTitle);
    
    // Generate a synopsis between 100 and 300 words
    const synopsisWords = Array(120).fill('heritage').join(' ');
    await page.fill('textarea[name="synopsis"]', synopsisWords);
    await page.selectOption('select[name="previousPublicationStatus"]', 'Unpublished');

    // Section 5: Declarations
    await page.check('input[name="originalityDeclaration"]');
    await page.check('input[name="copyrightDeclaration"]');
    await page.check('input[name="interviewConsent"]');
    await page.check('input[name="accuracyDeclaration"]');
    await page.check('input[name="priorPublicationDeclaration"]');
    await page.check('input[name="sensitiveKnowledgeDeclaration"]');
    await page.check('input[name="editorialReviewAcknowledgement"]');

    // Monitor Network Response
    const responsePromise = page.waitForResponse(
      response =>
        response.url().includes('/api/backend/participation/story') &&
        response.request().method() === 'POST'
    );

    // Submit Form
    await page.click('button[type="submit"]');

    const response = await responsePromise;
    expect(response.status()).toBe(201);
    expect(response.headers()['content-type']).toContain('application/json');

    const body = await response.json();
    const submissionNumber = body?.data?.data?.submissionNumber || body?.data?.submissionNumber;
    expect(submissionNumber).toMatch(/^STY-\d{6}-\d{3}$/);
    console.log('[STORY_E2E_SUCCESS] Submission Number:', submissionNumber);

    // Check UI success
    await expect(page.getByText('Manuscript Received')).toBeVisible();
  });

  test('2. Become a Contributor E2E Flow', async ({ page }) => {
    await page.goto('http://localhost:3000/master-artisans/contributor');

    // Section 1: Contact Details
    const uniqueEmail = `contributor_${Date.now()}@hcrf.org`;
    await page.fill('input[name="fullName"]', 'Playwright Contributor');
    await page.fill('input[name="email"]', uniqueEmail);
    await page.fill('input[name="phone"]', '+919906003344');
    await page.fill('input[name="country"]', 'India');
    await page.fill('input[name="stateRegion"]', 'Jammu & Kashmir');
    await page.fill('input[name="districtCity"]', 'Srinagar');

    // Section 2: Professional Profile
    await page.selectOption('select[name="contributorCategory"]', 'Independent Contributor');
    await page.fill('input[name="currentProfession"]', 'Archive Specialist');
    await page.fill('textarea[name="shortBio"]', 'Experienced archivist focusing on digital documentation of traditional crafts.');
    await page.fill('input[name="portfolioUrl"]', 'https://example.com/portfolio');

    // Section 3: Contribution Preferences
    await page.fill('input[name="yearsOfExperience"]', '7 years');
    await page.fill('input[name="geographicAvailability"]', 'Srinagar district');
    await page.selectOption('select[name="preferredEngagementType"]', 'Voluntary');
    await page.fill('input[name="availability"]', 'Part-time');
    await page.fill('input[name="timeCommitment"]', '2–5 hours per week');

    // Select Area of Contribution (Label Click for Custom Checkbox UI)
    await page.click('text=Field Researcher');

    // Section 5: Statement of Purpose (150 - 500 words)
    const motivationWords = Array(160).fill('dedication').join(' ');
    await page.fill('textarea[name="motivation"]', motivationWords);

    // Section 6: Declarations
    await page.check('input[name="declarationAccuracy"]');
    await page.check('input[name="declarationRights"]');
    await page.check('input[name="declarationEthical"]');
    await page.check('input[name="declarationConfidentiality"]');
    await page.check('input[name="declarationRepresentation"]');
    await page.check('input[name="declarationSelection"]');
    await page.check('input[name="declarationPrivacy"]');

    // Monitor Network Response
    const responsePromise = page.waitForResponse(
      response =>
        response.url().includes('/api/backend/participation/contributor') &&
        response.request().method() === 'POST'
    );

    // Submit Form
    await page.click('button[type="submit"]');

    const response = await responsePromise;
    expect(response.status()).toBe(201);
    expect(response.headers()['content-type']).toContain('application/json');

    const body = await response.json();
    const submissionNumber = body?.data?.data?.submissionNumber || body?.data?.submissionNumber;
    expect(submissionNumber).toMatch(/^CON-\d{6}-\d{3}$/);
    console.log('[CONTRIBUTOR_E2E_SUCCESS] Submission Number:', submissionNumber);

    // Check UI success
    await expect(page.getByText('Application Received')).toBeVisible();
  });

  test('3. Support Documentation E2E Flow', async ({ page }) => {
    await page.goto('http://localhost:3000/master-artisans/support');

    // Section 1: Submission Overview
    await page.selectOption('select[name="purpose"]', 'Submit a Digital Copy for Archival Review');
    await page.fill('input[name="title"]', 'Rare Pashmina Loom Photographs 1950');
    await page.selectOption('select[name="materialType"]', 'Historical Photograph');
    await page.selectOption('select[name="primaryCraft"]', { index: 1 });
    await page.selectOption('select[name="identifiablePersons"]', 'No');

    // Section 2: Historical & Technical Description (100 - 1500 words)
    const historyWords = Array(110).fill('historical').join(' ');
    await page.fill('textarea[name="historicalContext"]', historyWords);
    await page.selectOption('select[name="dateType"]', 'Exact Date Known');

    // Section 4: Ownership & Custody
    await page.fill('input[name="legalOwner"]', 'Playwright Archive Trust');
    await page.fill('input[name="relationshipToOwner"]', 'Owner / Rightsholder');
    await page.check('input[name="ownerAuthorisation"]');

    // Section 5: Copyright & Usage Permissions
    await page.selectOption('select[name="copyrightStatus"]', 'I Own the Copyright');
    await page.check('input[name="permissionPrivateReview"]');
    await page.selectOption('select[name="attributionPreference"]', 'Credit the Submitter');

    // Section 6: Sensitivity
    await page.selectOption('select[name="containsSensitiveInfo"]', 'No');

    // Section 7: Attach a Digital Artifact File (Required by frontend validation)
    await page.evaluate(() => {
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (input) input.classList.remove('hidden');
    });
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'document-sample.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('fake image content')
    });
    await fileInput.dispatchEvent('change');

    // Section 8: Submitter Information & Declarations
    await page.fill('input[name="submitterName"]', 'Playwright Archival Officer');
    await page.fill('input[name="submitterEmail"]', 'archive@hcrf.org');
    await page.fill('input[name="submitterPhone"]', '+919906004455');
    await page.selectOption('select[name="relationshipToMaterial"]', 'Owner');

    // Section 9: Declarations
    await page.check('input[name="authToSubmit"]');
    await page.check('input[name="accuracyDeclaration"]');
    await page.check('input[name="rightsDisclosure"]');
    await page.check('input[name="sensitiveDisclosure"]');
    await page.check('input[name="noAutomaticTransfer"]');
    await page.check('input[name="noGuaranteedPublication"]');

    // Monitor Network Response
    const responsePromise = page.waitForResponse(
      response =>
        response.url().includes('/api/backend/participation/documentation') &&
        response.request().method() === 'POST'
    );

    // Submit Form
    await page.click('button[type="submit"]');

    const response = await responsePromise;
    expect(response.status()).toBe(201);
    expect(response.headers()['content-type']).toContain('application/json');

    const body = await response.json();
    const submissionNumber = body?.data?.data?.submissionNumber || body?.data?.submissionNumber;
    expect(submissionNumber).toMatch(/^DOC-\d{6}-\d{3}$/);
    console.log('[DOCUMENTATION_E2E_SUCCESS] Submission Number:', submissionNumber);

    // Check UI success
    await expect(page.getByText('Submission Received')).toBeVisible();
  });

});
