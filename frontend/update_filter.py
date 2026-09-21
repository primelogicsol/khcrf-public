import os

filepath = 'src/app/(main)/about/partner-network/registry/RegistryClient.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

filter_old = '''  const filteredData = safePartners.filter((item) => {
    const matchesSearch =
      item.orgName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesArea =
      selectedArea === "All" ||
      item.primaryCollaborationArea === selectedArea ||
      (Array.isArray(item.collaborationAreas) && item.collaborationAreas.includes(selectedArea));

    const matchesCategory =
      selectedCategory === "All" ||
      item.globalReachCategory === selectedCategory;

    return matchesSearch && matchesArea && matchesCategory;
  });'''

filter_new = '''  const filteredData = safePartners.filter((item) => {
    // 1. Strict Public Visibility Gate
    // Exclude QA, Test, and Audit fixtures
    const isTestName = item.orgName?.toLowerCase().includes("test") || item.orgName?.toLowerCase().includes("audit inst");
    const isTestRecord = item.isTestRecord === true || isTestName;
    
    // Exclude explicitly private records
    const isPrivate = item.publicVisibility === false || item.publicVisibility === "Private" || item.publicVisibility === "PRIVATE";
    
    // Require APPROVED status
    const isApproved = item.status === "APPROVED" || item.status === "ACTIVE";
    
    // Hide incomplete/unclassified records from public registry until migration
    const isIncomplete = !item.organizationType || !item.globalReachCategory || !item.primaryCollaborationArea;

    if (isTestRecord || isPrivate || !isApproved || isIncomplete) {
      return false;
    }

    // 2. Search & Filter Matches
    const matchesSearch =
      item.orgName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesArea =
      selectedArea === "All" ||
      item.primaryCollaborationArea === selectedArea ||
      (Array.isArray(item.collaborationAreas) && item.collaborationAreas.includes(selectedArea));

    const matchesCategory =
      selectedCategory === "All" ||
      item.globalReachCategory === selectedCategory;

    return matchesSearch && matchesArea && matchesCategory;
  });'''

content = content.replace(filter_old, filter_new)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated filtering logic")
