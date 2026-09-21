import os

filepath = '../controllers/partnerController.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

select_old = '''            select: {
                id: true,
                orgName: true,
                country: true,
                logoUrl: true,
                collaborationAreas: true,
                collaborationType: true,
                status: true,
                projectDescription: true, // Description for registry
                projectTitle: true,
                website: true
            }'''

select_new = '''            select: {
                id: true,
                orgName: true,
                country: true,
                logoUrl: true,
                collaborationAreas: true,
                collaborationType: true,
                status: true,
                projectDescription: true,
                projectTitle: true,
                website: true,
                organizationType: true,
                globalReachCategory: true,
                primaryCollaborationArea: true,
                ecosystemRelationship: true,
                relationshipClass: true,
                parentOrg: true,
                relationshipStatus: true,
                publicVisibility: true,
                countInGlobalReach: true,
                isTestRecord: true
            }'''

content = content.replace(select_old, select_new)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated getPublicPartners select")
