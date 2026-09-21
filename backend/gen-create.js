const fs = require('fs');
fs.writeFileSync('backend/create-table.ts', import { prisma } from './src/index';

async function createTable() {
    await prisma.\\('CREATE TABLE IF NOT EXISTS "PartnerRegistryEntity" ("id" TEXT NOT NULL, "registryId" TEXT NOT NULL, "orgName" TEXT NOT NULL, "collection" TEXT NOT NULL, "entityType" TEXT NOT NULL, "parentId" TEXT, "parentName" TEXT, "country" TEXT, "status" TEXT NOT NULL DEFAULT \\'ACTIVE\\', "collaborationType" JSONB, "collaborationAreas" JSONB, "projectDescription" TEXT, "website" TEXT, "displayOrder" INTEGER NOT NULL DEFAULT 0, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "PartnerRegistryEntity_pkey" PRIMARY KEY ("id"));');
    
    await prisma.\\('CREATE UNIQUE INDEX IF NOT EXISTS "PartnerRegistryEntity_registryId_key" ON "PartnerRegistryEntity"("registryId");');

    console.log("Table PartnerRegistryEntity created!");
}

createTable().catch(console.error).finally(() => process.exit(0));
);
