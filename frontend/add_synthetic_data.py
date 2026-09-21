import re

path = 'frontend/src/app/(main)/state-of-kashmir-crafts/participate/ParticipateClient.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add getSyntheticData import
import_str = "import { getSyntheticData } from '@/lib/skc/preview-data';"
content = content.replace("import ArtisanPathwayClient from './ArtisanPathwayClient';", import_str + "\nimport ArtisanPathwayClient from './ArtisanPathwayClient';")

# Replace regData mock
mock_regData_old = """const regData = isPreviewing ? (impersonatedUser || { 
    approvedParticipationModes: previewModes,
    categoryLabel: previewCategory,
    status: previewStatus,
    referenceNumber: "SKC-PREVIEW-0000",
    registrationType: "INDIVIDUAL"
  }) : realRegData;"""

mock_regData_new = """  const syntheticData = isPreviewing ? getSyntheticData(previewCategory) : null;
  const regData = isPreviewing ? (impersonatedUser || { 
    approvedParticipationModes: previewModes,
    categoryLabel: previewCategory,
    status: previewStatus,
    referenceNumber: previewStatus === 'PENDING' ? 'SKC-PREVIEW-PENDING-001' : 
                     previewStatus === 'UNDER_REVIEW' ? 'SKC-PREVIEW-REVIEW-001' : 
                     previewStatus === 'APPROVED' ? 'SKC-PREVIEW-APPROVED-001' : 
                     previewStatus === 'REVISION_REQUIRED' ? 'SKC-PREVIEW-REVISION-001' :
                     previewStatus === 'REJECTED' ? 'SKC-PREVIEW-REJECTED-001' :
                     previewStatus === 'SUSPENDED' ? 'SKC-PREVIEW-SUSPENDED-001' : 'SKC-PREVIEW-0000',
    registrationType: syntheticData?.registrationType || "INDIVIDUAL",
    fullName: syntheticData?.name,
    representativeName: syntheticData?.name,
    organization: syntheticData?.organization,
    institutionName: syntheticData?.organization,
    district: syntheticData?.district,
    craftSector: syntheticData?.craftSector,
    email: syntheticData?.email,
    isPreview: true,
    source: "ADMIN_PREVIEW"
  }) : realRegData;"""

content = content.replace(mock_regData_old, mock_regData_new)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated ParticipateClient with synthetic data")
