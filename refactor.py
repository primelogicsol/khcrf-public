import re
import os

filepath = r'frontend/src/app/(main)/master-artisans/submit-story/page.tsx'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add getFieldError function
get_field_error_func = """
  const getFieldError = (fieldName: string) => {
    return fieldErrors[fieldName] ? (
      <p className="mt-1.5 text-sm text-red-600 font-medium animate-fadeIn flex items-center">
        <span className="inline-block w-1.5 h-1.5 bg-red-600 rounded-full mr-2"></span>
        {fieldErrors[fieldName]}
      </p>
    ) : null;
  };
"""
content = content.replace('  if (isSuccess) {', get_field_error_func + '\n  if (isSuccess) {')

# 2. Update the main form container
content = content.replace('<div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-gray-100">', '<div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">')

# 3. Form section wrappers
content = content.replace('<section className="space-y-6">', '<div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">\n              <div className="space-y-6">')
content = content.replace('</section>', '</div>\n            </div>')

# 4. Update section headings
def replace_heading(match):
    num = match.group(1)
    title = match.group(2)
    return f'<h3 className="text-xl font-bold text-brand-dark mb-6 flex items-center border-b pb-4">\n                <span className="bg-brand-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">{num}</span>\n                {title}\n              </h3>'

content = re.sub(r'<div className="border-b border-gray-200 pb-4 mb-6">\s*<h3 className="text-2xl font-bold text-brand-dark">(\d+)\.\s*(.*?)</h3>\s*</div>', replace_heading, content)

# 5, 6, 7. Update labels and inputs
# Let's replace the standard class for label
content = re.sub(r'<label className="block text-sm font-bold text-gray-700 mb-2">', r'<label className="block text-sm font-bold text-gray-700 mb-2">', content) 
content = re.sub(r'<label className="block text-sm font-bold text-gray-700">', r'<label className="block text-sm font-bold text-gray-700 mb-2">', content)

# Standard input/textarea/select class
standard_class = 'w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition'
content = re.sub(r'className="w-full p-3 bg-gray-50 border [^"]*rounded-xl( text-lg font-medium)?"', f'className="{standard_class}"', content)
content = re.sub(r'className={`w-full p-3 bg-gray-50 border [^"]*rounded-xl`}', f'className="{standard_class}"', content)
content = re.sub(r'className={`w-full p-3 bg-gray-50 border \${[^}]*} rounded-xl`}', f'className="{standard_class}"', content)

# Add getFieldError
def add_field_error(match):
    name = match.group(1)
    full_match = match.group(0)
    # Don't add for file inputs
    if 'type="file"' in full_match or 'type="checkbox"' in full_match or 'type="radio"' in full_match:
        return full_match
    return full_match + f'\n                  {{getFieldError(\'{name}\')}}'

content = re.sub(r'<input [^>]*name="([^"]+)"[^>]*>', add_field_error, content)
content = re.sub(r'<select [^>]*name="([^"]+)"[^>]*>.*?</select>', add_field_error, content, flags=re.DOTALL)
content = re.sub(r'<textarea [^>]*name="([^"]+)"[^>]*/>', add_field_error, content)
content = re.sub(r'<textarea [^>]*name="([^"]+)"[^>]*>.*?</textarea>', add_field_error, content, flags=re.DOTALL)

# Refactor checkboxes in Section 4 and Section 5
# Section 4 checkboxes
content = re.sub(
    r'<label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl border border-gray-200">\s*<input type="checkbox" name="([^"]+)" checked={([^}]+)} onChange={handleChange} className="w-5 h-5 text-brand-primary" />\s*<span className="text-sm font-medium text-gray-700">([^<]+)</span>\s*</label>',
    r'<div className="flex items-center space-x-3 p-3 bg-white rounded-xl border border-gray-200">\n                  <input type="checkbox" id="\1" name="\1" checked={\2} onChange={handleChange} className="w-5 h-5 text-brand-primary rounded border-gray-300 focus:ring-brand-primary" />\n                  <label htmlFor="\1" className="block text-sm font-bold text-gray-700 mb-2 !mb-0 cursor-pointer">\3</label>\n                </div>',
    content
)

# Section 5 checkboxes
content = re.sub(
    r'<label className="flex items-start space-x-3 cursor-pointer group">\s*<input type="checkbox" required name="([^"]+)" checked={([^}]+)} onChange={handleChange} className="mt-1 w-5 h-5 text-brand-primary cursor-pointer" />\s*<div>\s*<strong className="block text-sm text-brand-dark group-hover:text-brand-primary">([^<]+)</strong>\s*<span className="text-xs text-gray-600">([^<]+)</span>\s*</div>\s*</label>',
    r'<div className="flex items-start space-x-3 bg-white p-4 rounded-xl border border-gray-200">\n                  <input type="checkbox" id="\1" required name="\1" checked={\2} onChange={handleChange} className="mt-1 w-5 h-5 text-brand-primary rounded border-gray-300 focus:ring-brand-primary" />\n                  <label htmlFor="\1" className="block text-sm font-bold text-gray-700 mb-2 !mb-0 cursor-pointer">\n                    <strong className="block text-brand-dark hover:text-brand-primary">\3</strong>\n                    <span className="text-xs text-gray-600 font-normal">\4</span>\n                  </label>\n                </div>',
    content
)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
