import os

directory = r"C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\dashboard\skc"

for root, dirs, files in os.walk(directory):
    for file in files:
        if file.endswith(".tsx"):
            path = os.path.join(root, file)
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()

            original_content = content

            content = content.replace("fetch(`${API_BASE_URL}/api/consultation`);", "fetch(`${API_BASE_URL}/api/consultation`, { credentials: 'include' });")
            content = content.replace("fetch(`${API_URL}/api/advisory?status=${filterStatus}&category=${filterCategory}`);", "fetch(`${API_URL}/api/advisory?status=${filterStatus}&category=${filterCategory}`, { credentials: 'include' });")
            content = content.replace("fetch(`${API_BASE_URL}/api/consultation/${consultationId}`);", "fetch(`${API_BASE_URL}/api/consultation/${consultationId}`, { credentials: 'include' });")

            if content != original_content:
                with open(path, "w", encoding="utf-8") as f:
                    f.write(content)
                print(f"Patched {file}")
