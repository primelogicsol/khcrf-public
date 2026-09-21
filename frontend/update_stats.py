import os

filepath = 'src/components/common/PartnerStats.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

import_old = 'import { cmsApi } from "@/lib/api";'
import_new = 'import { partnerApi } from "@/lib/api";'
content = content.replace(import_old, import_new)

fetch_old = '''    const fetchContent = async () => {
      try {
        const data = await cmsApi.getContent("partner-network-stats");
        if (data && data.content) {
          setStats(data.content);
        }
      } catch (error) {
        console.error("Failed to fetch partner stats, using defaults:", error);
      }
    };'''

fetch_new = '''    const fetchContent = async () => {
      try {
        const data = await partnerApi.getStats();
        if (data && Array.isArray(data)) {
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch partner stats, using defaults:", error);
      }
    };'''

content = content.replace(fetch_old, fetch_new)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated PartnerStats.tsx")
