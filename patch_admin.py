import os
import re

directories = [
    r"C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\state-of-kashmir-crafts",
    r"C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\dashboard\skc"
]

defensive_code_res = """const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        const text = await res.text();
        throw new Error(`Expected JSON but received ${contentType}. Response preview: ${text.slice(0, 200)}`);
      }
      const data = await res.json();"""

defensive_code_response = """const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(`Expected JSON but received ${contentType}. Response preview: ${text.slice(0, 200)}`);
      }
      const data = await response.json();"""

for d in directories:
    for root, dirs, files in os.walk(d):
        for file in files:
            if file.endswith(".tsx"):
                path = os.path.join(root, file)
                with open(path, "r", encoding="utf-8") as f:
                    content = f.read()

                original_content = content

                if "const data = await res.json();" in content and "Expected JSON but received" not in content:
                    content = content.replace("const data = await res.json();", defensive_code_res)
                
                if "const data = await response.json();" in content and "Expected JSON but received" not in content:
                    content = content.replace("const data = await response.json();", defensive_code_response)
                
                if content != original_content:
                    with open(path, "w", encoding="utf-8") as f:
                        f.write(content)
                    print(f"Patched {file}")
