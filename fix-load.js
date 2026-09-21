const fs = require('fs');
const filePath = 'frontend/src/app/(main)/about/partner-network/registry/RegistryClient.tsx';
let c = fs.readFileSync(filePath, 'utf8');

c = c.replace(/const loadPartners = async \(\) => \{[\s\S]*?finally \{\s*setPartners\(ECOSYSTEM_PARTNERS\);\s*setLoading\(false\);\s*\}\s*\};/, 
`const loadPartners = async () => {
    try {
      const data = await partnerApi.getPublic().catch(() => null);
      const actualPartners = data && Array.isArray(data) ? data : (data && Array.isArray(data?.data) ? data.data : (data && Array.isArray(data?.data?.data) ? data.data.data : []));
      setPartners(actualPartners);
    } catch (error) {
      console.error("Failed to load registry:", error);
    } finally {
      setLoading(false);
    }
  };`);

fs.writeFileSync(filePath, c);
console.log('Fixed loadPartners to use database');
