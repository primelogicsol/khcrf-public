import { prisma } from './config/db.js';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const UPLOAD_DIR = path.join(process.cwd(), 'secure_uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Helper to write a basic dummy PDF structure
const writeDummyPdf = (filename: string, content: string): { storageKey: string, sizeBytes: number, checksum: string } => {
  const storageKey = crypto.randomBytes(16).toString('hex') + '.pdf';
  const filePath = path.join(UPLOAD_DIR, storageKey);
  
  // Basic minimal PDF format content
  const pdfHeader = '%PDF-1.4\n';
  const pdfBody = `1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>\nendobj\n4 0 obj\n<< /Length 44 >>\nstream\nBT /F1 24 Tf 100 700 Td (${content}) Tj ET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f\n0000000009 00000 n\n0000000056 00000 n\n0000000111 00000 n\n0000000212 00000 n\ntrailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n307\n%%EOF\n`;
  const fullContent = pdfHeader + pdfBody;
  
  fs.writeFileSync(filePath, fullContent);
  const stats = fs.statSync(filePath);
  
  const hash = crypto.createHash('sha256');
  hash.update(fullContent);
  const checksum = hash.digest('hex');
  
  return {
    storageKey,
    sizeBytes: stats.size,
    checksum
  };
};

async function main() {
  console.log('Seeding Registry Resources...');

  const initialDocs = [
    {
      title: 'Registry Guidelines 2026',
      slug: 'registry-guidelines-2026',
      shortDescription: 'Complete guide on stakeholder categories and registration process.',
      longDescription: 'Detailed instructions on eligibility criteria, required data points, and validation pathways for individual and institutional registrants.',
      category: 'Registration',
      documentType: 'Guidelines',
      version: '1.0.0',
      status: 'ACTIVE',
      language: 'en',
      displayOrder: 1,
      publicFilename: 'HCRF_Stakeholder_Registry_Guidelines_2026_v1.0.0.pdf'
    },
    {
      title: 'Verification Checklist',
      slug: 'verification-checklist',
      shortDescription: 'List of required documents for professional verification.',
      longDescription: 'A step-by-step checklist detailing acceptable credentials, organizational letters, and identity proofs required for verified public profile listings.',
      category: 'Verification',
      documentType: 'Checklist',
      version: '1.0.0',
      status: 'ACTIVE',
      language: 'en',
      displayOrder: 2,
      publicFilename: 'HCRF_Stakeholder_Registry_Verification_Checklist_v1.0.0.pdf'
    },
    {
      title: 'Benefits Handbook',
      slug: 'benefits-handbook',
      shortDescription: 'Overview of benefits and rights for registered stakeholders.',
      longDescription: 'A comprehensive handbook listing details on directory visibility options, support priority, evidence citation rights, and access to physical/virtual consultation tracks.',
      category: 'Benefits',
      documentType: 'Handbook',
      version: '1.0.0',
      status: 'ACTIVE',
      language: 'en',
      displayOrder: 3,
      publicFilename: 'HCRF_Stakeholder_Registry_Benefits_Handbook_v1.0.0.pdf'
    },
    {
      title: 'Offline Form',
      slug: 'offline-form',
      shortDescription: 'Printable offline registration form for manual submissions.',
      longDescription: 'A print-ready PDF form for individuals and communities lacking internet access, supporting manual data intake at district facilitation desks.',
      category: 'Offline Forms',
      documentType: 'Intake Form',
      version: '1.0.0',
      status: 'ACTIVE',
      language: 'en',
      displayOrder: 4,
      publicFilename: 'HCRF_Stakeholder_Registry_Offline_Form_v1.0.0.pdf'
    }
  ];

  for (const doc of initialDocs) {
    // Check if slug exists
    const existing = await prisma.skcRegistryResource.findUnique({
      where: { slug: doc.slug }
    });

    if (existing) {
      console.log(`Resource ${doc.title} already exists, skipping.`);
      continue;
    }

    // Write dummy file
    const fileMeta = writeDummyPdf(doc.publicFilename, doc.title);
    const fileUrl = `/api/backend/skc/stakeholder-registry/resources/${doc.slug}/download`;

    const resource = await prisma.skcRegistryResource.create({
      data: {
        title: doc.title,
        slug: doc.slug,
        shortDescription: doc.shortDescription,
        longDescription: doc.longDescription,
        category: doc.category,
        documentType: doc.documentType,
        version: doc.version,
        status: doc.status,
        language: doc.language,
        fileUrl,
        storageKey: fileMeta.storageKey,
        originalFilename: doc.publicFilename,
        publicFilename: doc.publicFilename,
        mimeType: 'application/pdf',
        fileSizeBytes: fileMeta.sizeBytes,
        checksum: fileMeta.checksum,
        publicationDate: new Date(),
        effectiveDate: new Date(),
        displayOrder: doc.displayOrder,
        isFeatured: true,
        isPublic: true,
        createdBy: 'seeder',
        updatedBy: 'seeder',
      }
    });

    // Create version
    await prisma.skcRegistryResourceVersion.create({
      data: {
        resourceId: resource.id,
        title: resource.title,
        version: resource.version,
        status: resource.status,
        fileUrl: resource.fileUrl,
        storageKey: resource.storageKey,
        originalFilename: resource.originalFilename,
        publicFilename: resource.publicFilename,
        mimeType: resource.mimeType,
        fileSizeBytes: resource.fileSizeBytes,
        checksum: resource.checksum,
        createdBy: 'seeder',
        notes: 'Initial seed version'
      }
    });

    console.log(`Created resource: ${doc.title} with key: ${fileMeta.storageKey}`);
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
