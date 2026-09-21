import os
import re

public_dir = r"C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\state-of-kashmir-crafts"

safe_fetch_code = """
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api$/, '') : 'http://localhost:4000';

async function safeFetch(path: string) {
  const url = path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
  const response = await fetch(url);
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    const text = await response.text();
    throw new Error(`Expected JSON but received ${contentType}. Response preview: ${text.slice(0, 200)}`);
  }
  return response.json();
}
"""

for root, dirs, files in os.walk(public_dir):
    for file in files:
        if file.endswith("Client.tsx") and file != "ParticipateClient.tsx":
            path = os.path.join(root, file)
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()

            if "safeFetch" not in content and "fetch('/api/public/skc" in content:
                # Add safeFetch before the component definition
                content = re.sub(r'(export default function .*? \{)', safe_fetch_code + r'\1', content)
                # Replace fetch('/api/public/skc...').then(r => r.json()) with safeFetch('/api/public/skc...')
                content = re.sub(r"fetch\('(/api/public/skc/[^']+)'\)\.then\(r => r\.json\(\)\)", r"safeFetch('\1')", content)
                
                with open(path, "w", encoding="utf-8") as f:
                    f.write(content)
                print(f"Patched {file}")
