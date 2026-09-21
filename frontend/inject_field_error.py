import sys
import os

filepath = r'C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\master-artisans\nominate\page.tsx'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

if 'const getFieldError' not in content:
    idx = content.find('  if (success) {')
    get_field_error = '''  const getFieldError = (fieldName: string) => {
    return fieldErrors[fieldName] ? (
      <p className="mt-1.5 text-sm text-red-600 font-medium animate-fadeIn flex items-center">
        <span className="inline-block w-1.5 h-1.5 bg-red-600 rounded-full mr-2"></span>
        {fieldErrors[fieldName]}
      </p>
    ) : null;
  };

'''
    content = content[:idx] + get_field_error + content[idx:]

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
