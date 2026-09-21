import os
import re

base_dir = r"C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\master-artisans"

replacements = {
    r'https://images.unsplash.com/photo-1544168190-79c15427015f[^"\'`]*': '/assets/images/artisan-portrait.jpg',
    r'https://images.unsplash.com/photo-1610992015732-2808058b475d[^"\'`]*': '/assets/images/master-artisans-hero.jpg',
    r'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93[^"\'`]*': '/assets/images/master-artisans-hero.jpg',
    r'https://images.unsplash.com/photo-1590727264875-520e5db197d1[^"\'`]*': '/assets/images/heritage-object.jpg'
}

for root, dirs, files in os.walk(base_dir):
    for file in files:
        if file.endswith('.tsx'):
            file_path = os.path.join(root, file)
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            original = content
            for pattern, repl in replacements.items():
                content = re.sub(pattern, repl, content)
                
            if original != content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Updated {file_path}")

print("Replacement complete.")
