import { prisma } from '../src/config/db.js';
import fetch from 'node-fetch';

const PROD_LIST_URL = 'https://khcrf.org/api/backend/publications';
const PROD_DETAIL_URL = 'https://khcrf.org/api/backend/publications/details/';

async function sync() {
  const isDryRun = process.argv.includes('--dry-run');
  console.log(`Starting Sync ${isDryRun ? '(DRY RUN)' : ''}`);

  const dbHost = process.env.DATABASE_URL.split('@')[1];
  console.log(`Destination DB: ${dbHost}`);
  if (dbHost.includes('khcrf.org') || process.env.NODE_ENV === 'production') {
    console.error('Refusing to run against production database.');
    process.exit(1);
  }

  const listRes = await fetch(PROD_LIST_URL);
  const listJson = await listRes.json();
  const pubs = listJson.data || [];
  console.log(`Production records discovered: ${pubs.length}`);

  let creates = 0;
  let updates = 0;
  let skipped = 0;
  let unchanged = 0;
  let errors = 0;

  for (const p of pubs) {
    try {
      const detailRes = await fetch(PROD_DETAIL_URL + p.slug);
      const detailJson = await detailRes.json();
      const d = detailJson.data;

      if (!d) {
        errors++;
        continue;
      }

      const existing = await prisma.publication.findUnique({
        where: { slug: d.slug },
        include: { editions: true }
      });

      if (isDryRun) {
        if (!existing) creates++;
        else updates++;
        continue;
      }

      // Upsert Category
      let catId = null;
      if (p.category) {
        const cat = await prisma.publicationCategory.upsert({
          where: { slug: p.category.slug },
          update: { name: p.category.name },
          create: { slug: p.category.slug, name: p.category.name, description: '' }
        });
        catId = cat.id;
      }

      // Upsert Publication
      const pub = await prisma.publication.upsert({
        where: { slug: d.slug },
        update: {
          title: d.title,
          subtitle: d.subtitle || null,
          author: d.authors?.[0] || p.contributors?.[0]?.name || 'KHCRF',
          published: d.publicationYear || '2026',
          category: p.category?.name || 'Uncategorized',
          categoryId: catId,
          price: d.pricing?.amount || 0,
          pages: d.pageCount || 0,
          description: d.executiveSummary || '',
          imagePath: d.coverImageUrl || '',
          accessType: d.accessTier || 'PUBLIC',
          publicationType: d.publicationType || 'RESEARCH_PAPER'
        },
        create: {
          slug: d.slug,
          title: d.title,
          subtitle: d.subtitle || null,
          author: d.authors?.[0] || p.contributors?.[0]?.name || 'KHCRF',
          published: d.publicationYear || '2026',
          category: p.category?.name || 'Uncategorized',
          categoryId: catId,
          price: d.pricing?.amount || 0,
          pages: d.pageCount || 0,
          description: d.executiveSummary || '',
          imagePath: d.coverImageUrl || '',
          accessType: d.accessTier || 'PUBLIC',
          publicationType: d.publicationType || 'RESEARCH_PAPER'
        }
      });

      // Upsert Edition
      const editionLabel = p.edition?.label || 'First Edition';
      const editionVersion = p.edition?.version || '1.0';
      const existingEd = existing?.editions.find((e: any) => e.version === editionVersion && e.edition === editionLabel);
      if (!existingEd) {
        await prisma.publicationEdition.create({
          data: {
            publicationId: pub.id,
            version: editionVersion,
            edition: editionLabel,
            publicationDate: p.edition?.publicationDate ? new Date(p.edition.publicationDate) : new Date(),
            status: 'PUBLISHED'
          }
        });
      } else if (existingEd.status !== 'PUBLISHED') {
        await prisma.publicationEdition.update({
          where: { id: existingEd.id },
          data: { status: 'PUBLISHED' }
        });
      }

      if (!existing) creates++;
      else updates++;

    } catch(err) {
      errors++;
      console.error('Error on slug:', p.slug, err.message);
    }
  }

  console.log(`Local canonical matches: ${pubs.length}`);
  console.log(`Would create: ${creates}`);
  console.log(`Would update: ${updates}`);
  console.log(`Would leave unchanged: ${unchanged}`);
  console.log(`Would skip: ${skipped}`);
  console.log(`Errors: ${errors}`);
}

sync().then(()=>process.exit(0)).catch(console.error);
