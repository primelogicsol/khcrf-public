/**
 * SKC Hearing Lifecycle Migration
 * ─────────────────────────────────
 * Adds canonical timestamp + policy columns to SkcHearing.
 * Backfills hearingStartsAt / hearingEndsAt from scheduledDate.
 * Reclassifies Youth in Crafts as PRE_HEARING_PARTICIPATION_FORUM.
 * Sets registrationOpensAt = 2026-08-17 programme default for all public hearings.
 * Sets per-hearing registrationClosesAt = hearingStartsAt - 24h.
 * Sets testimonyClosesAt = hearingEndsAt + 72h.
 *
 * SAFE: additive only. No records deleted. No IDs changed.
 */
const { Client } = require('pg');

const DB = 'postgresql://govtech:PQsQ3OL6@127.0.0.1:5432/hcrf_db_clean';

async function run() {
  const client = new Client({ connectionString: DB });
  await client.connect();
  console.log('Connected to hcrf_db_clean');

  // ── Step 1: Add columns (idempotent) ─────────────────────────────────────
  const addCols = `
    ALTER TABLE "SkcHearing"
      ADD COLUMN IF NOT EXISTS "hearingStartsAt"       TIMESTAMPTZ,
      ADD COLUMN IF NOT EXISTS "hearingEndsAt"         TIMESTAMPTZ,
      ADD COLUMN IF NOT EXISTS "registrationOpensAt"   TIMESTAMPTZ,
      ADD COLUMN IF NOT EXISTS "registrationClosesAt"  TIMESTAMPTZ,
      ADD COLUMN IF NOT EXISTS "testimonyOpensAt"      TIMESTAMPTZ,
      ADD COLUMN IF NOT EXISTS "testimonyClosesAt"     TIMESTAMPTZ,
      ADD COLUMN IF NOT EXISTS "statusOverride"        TEXT,
      ADD COLUMN IF NOT EXISTS "allowLateSubmission"   BOOLEAN NOT NULL DEFAULT true,
      ADD COLUMN IF NOT EXISTS "lateSubmissionReviewRequired" BOOLEAN NOT NULL DEFAULT true;
  `;
  await client.query(addCols);
  console.log('Columns added (idempotent).');

  // ── Step 2: Fetch all hearings with their scheduledDate ──────────────────
  const { rows } = await client.query(`
    SELECT id, title, slug, date
    FROM "SkcHearing"
    WHERE "hearingVisible" = true
    ORDER BY date ASC NULLS LAST
  `);
  console.log(`Found ${rows.length} public hearings to backfill.`);

  // ── Step 3: Backfill per-hearing timestamps ───────────────────────────────
  // Programme global registration open = 17 Aug 2026 00:00 IST
  const REGISTRATION_OPENS = '2026-08-17T00:00:00+05:30';

  let updated = 0;
  for (const row of rows) {
    const dateObj = row.date instanceof Date ? row.date : (row.date ? new Date(row.date) : null);
    if (!dateObj || isNaN(dateObj.getTime())) {

      console.log(`  SKIP (no date): ${row.title}`);
      continue;
    }

    // Extract YYYY-MM-DD in IST (UTC+5:30)
    const IST_OFFSET = (5 * 60 + 30) * 60 * 1000;
    const istDate = new Date(dateObj.getTime() + IST_OFFSET);
    const date = istDate.toISOString().slice(0, 10); // YYYY-MM-DD in IST

    // All hearings: 11:00 AM – 3:00 PM IST
    const startISO = `${date}T11:00:00+05:30`;
    const endISO   = `${date}T15:00:00+05:30`;

    // Registration closes 24h before hearing start
    const regCloseDate = new Date(new Date(startISO).getTime() - 24 * 60 * 60 * 1000);

    // Testimony closes 72h after hearing end
    const testCloseDate = new Date(new Date(endISO).getTime() + 72 * 60 * 60 * 1000);

    await client.query(`
      UPDATE "SkcHearing"
      SET
        "hearingStartsAt"      = $1::TIMESTAMPTZ,
        "hearingEndsAt"        = $2::TIMESTAMPTZ,
        "registrationOpensAt"  = $3::TIMESTAMPTZ,
        "registrationClosesAt" = $4::TIMESTAMPTZ,
        "testimonyOpensAt"     = $1::TIMESTAMPTZ,
        "testimonyClosesAt"    = $5::TIMESTAMPTZ
      WHERE id = $6
    `, [startISO, endISO, REGISTRATION_OPENS, regCloseDate.toISOString(), testCloseDate.toISOString(), row.id]);


    updated++;
    console.log(`  SET: ${row.title} (${date}) → reg closes ${regCloseDate.toISOString().slice(0,16)}, testimony closes ${testCloseDate.toISOString().slice(0,16)}`);
  }
  console.log(`Backfilled ${updated} hearings.`);

  // ── Step 4: Reclassify Youth in Crafts ───────────────────────────────────
  const ycResult = await client.query(`
    UPDATE "SkcHearing"
    SET "activityType" = 'PRE_HEARING_PARTICIPATION_FORUM'
    WHERE slug = 'youth-in-crafts'
       OR (title ILIKE '%Youth in Crafts%' AND date::date = '2026-09-01')
  `);

  console.log(`Reclassified Youth in Crafts: ${ycResult.rowCount} row(s) updated.`);

  // ── Step 5: Verify ───────────────────────────────────────────────────────
  const { rows: check } = await client.query(`
    SELECT title, date, "hearingStartsAt", "registrationClosesAt", "testimonyClosesAt", "activityType"
    FROM "SkcHearing"
    WHERE "hearingVisible" = true
    ORDER BY date ASC NULLS LAST
    LIMIT 5
  `);
  console.log('\nVerification (first 5 public hearings):');
  for (const r of check) {
    console.log(` ${r.title}`);
    console.log(`   date:        ${r.date}`);
    console.log(`   startAt:     ${r.hearingStartsAt}`);
    console.log(`   regCloses:   ${r.registrationClosesAt}`);
    console.log(`   testCloses:  ${r.testimonyClosesAt}`);
    console.log(`   type:        ${r.activityType}`);
  }


  await client.end();
  console.log('\nDone. No records deleted.');
}

run().catch(e => { console.error(e); process.exit(1); });
