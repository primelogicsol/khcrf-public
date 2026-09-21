const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://govtech:PQsQ3OL6@127.0.0.1:5432/hcrf_db_clean' });

async function run() {
  await client.connect();

  // ── Step 1: Add columns ──────────────────────────────────────────────────
  console.log('Adding columns...');
  await client.query(`
    ALTER TABLE "SkcHearing"
      ADD COLUMN IF NOT EXISTS "activityType"       TEXT    DEFAULT 'PUBLIC_HEARING',
      ADD COLUMN IF NOT EXISTS "timelineVisible"    BOOLEAN DEFAULT true,
      ADD COLUMN IF NOT EXISTS "hearingVisible"     BOOLEAN DEFAULT true,
      ADD COLUMN IF NOT EXISTS "publicNoticeVisible" BOOLEAN DEFAULT false
  `);
  console.log('Columns added.');

  // ── Step 2: Classification map ────────────────────────────────────────────
  // Rows 1-8: Internal Pre-Launch Milestones
  const INTERNAL_MILESTONES = [
    'Assessment Launch & Internal Briefing',
    'Stakeholder Registry Activation & Approvals',
    'Registration Portal & Outreach Launch',
    'Hearing Schedule Finalization',
    'Venue Confirmations & Safety Inspections',
    'Panel Invitations & Speakers Briefing',
    'Media Planning & Communication Campaign',
    'Technical Rehearsals & Hybrid Stream Setup',
  ];

  // Rows 9-24: Public Thematic Hearings / Consultations
  const PUBLIC_HEARINGS = [
    'Youth in Crafts',
    'Exports',
    'Future of Pashmina',
    'Digital Commerce',
    'Future of Carpets',
    'Technology & Design',
    'Artisan Livelihoods',
    'GI & Authenticity',
    'Women in Crafts',
    'Finance & Investment',
    'Raw Material Access',
    'Climate & Sustainability',
    'Cultural Heritage',
    'Education & Skills',
    'Global Markets',
    'Policy & Governance',
  ];

  // Rows 25-29: Internal Review Phase
  const REVIEW_MILESTONES = [
    'Evidence Review Begins',
    'Expert Evidence Panel',
    'Statistical Analysis Review',
    'Draft Recommendation Workshop',
    'Advisory Council Review',
  ];

  // Row 30: Public Publication Milestone
  const PUBLICATION_MILESTONES = [
    'State of Kashmir Crafts Report Released',
  ];

  // Rows 31-34: TBD Internal Milestones
  const TBD_INTERNAL = [
    'Draft Report Validation',
    'Final Editorial Review',
    'Advisory Council Approval',
    'Government Briefing',
  ];

  // ── Step 3: Apply classifications ────────────────────────────────────────
  const toList = (arr) => arr.map(t => `'${t.replace(/'/g, "''")}'`).join(', ');

  // Internal milestones: timeline only
  if (INTERNAL_MILESTONES.length) {
    const r = await client.query(`
      UPDATE "SkcHearing"
      SET "activityType"        = 'INTERNAL_MILESTONE',
          "timelineVisible"     = true,
          "hearingVisible"      = false,
          "publicNoticeVisible" = false
      WHERE title IN (${toList(INTERNAL_MILESTONES)})
    `);
    console.log(`Internal milestones (rows 1-8): ${r.rowCount} updated`);
  }

  // Public hearings: all three visible
  if (PUBLIC_HEARINGS.length) {
    const r = await client.query(`
      UPDATE "SkcHearing"
      SET "activityType"        = 'THEMATIC_CONSULTATION',
          "timelineVisible"     = true,
          "hearingVisible"      = true,
          "publicNoticeVisible" = true
      WHERE title IN (${toList(PUBLIC_HEARINGS)})
    `);
    console.log(`Public hearings (rows 9-24): ${r.rowCount} updated`);
  }

  // Review milestones: timeline only
  if (REVIEW_MILESTONES.length) {
    const r = await client.query(`
      UPDATE "SkcHearing"
      SET "activityType"        = 'REVIEW_MILESTONE',
          "timelineVisible"     = true,
          "hearingVisible"      = false,
          "publicNoticeVisible" = false
      WHERE title IN (${toList(REVIEW_MILESTONES)})
    `);
    console.log(`Review milestones (rows 25-29): ${r.rowCount} updated`);
  }

  // Publication milestone: timeline + public notice, NOT a hearing
  if (PUBLICATION_MILESTONES.length) {
    const r = await client.query(`
      UPDATE "SkcHearing"
      SET "activityType"        = 'PUBLICATION_MILESTONE',
          "timelineVisible"     = true,
          "hearingVisible"      = false,
          "publicNoticeVisible" = true
      WHERE title IN (${toList(PUBLICATION_MILESTONES)})
    `);
    console.log(`Publication milestones (row 30): ${r.rowCount} updated`);
  }

  // TBD internal milestones: timeline only
  if (TBD_INTERNAL.length) {
    const r = await client.query(`
      UPDATE "SkcHearing"
      SET "activityType"        = 'INTERNAL_MILESTONE',
          "timelineVisible"     = true,
          "hearingVisible"      = false,
          "publicNoticeVisible" = false
      WHERE title IN (${toList(TBD_INTERNAL)})
    `);
    console.log(`TBD internal (rows 31-34): ${r.rowCount} updated`);
  }

  // ── Step 4: Verify ────────────────────────────────────────────────────────
  const { rows } = await client.query(`
    SELECT "activityType", "timelineVisible", "hearingVisible", "publicNoticeVisible", COUNT(*) as cnt
    FROM "SkcHearing"
    GROUP BY "activityType", "timelineVisible", "hearingVisible", "publicNoticeVisible"
    ORDER BY "activityType"
  `);
  console.log('\nVerification:');
  rows.forEach(r => console.log(`  ${r.activityType} | timeline=${r.timelinevisible} hearing=${r.hearingvisible} publicNotice=${r.publicnoticevisible} → ${r.cnt} records`));

  const { rows: total } = await client.query('SELECT COUNT(*) as total FROM "SkcHearing"');
  console.log(`\nTotal records: ${total[0].total}`);

  await client.end();
}

run().catch(e => { console.error(e); process.exit(1); });
