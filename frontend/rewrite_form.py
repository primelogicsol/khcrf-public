import re
import os

filepath = r"C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\master-artisans\contributor\page.tsx"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add getFieldError
get_field_error = """  const getFieldError = (fieldName: string) => {
    return fieldErrors[fieldName] ? (
      <p className="mt-1.5 text-sm text-red-600 font-medium animate-fadeIn flex items-center">
        <span className="inline-block w-1.5 h-1.5 bg-red-600 rounded-full mr-2"></span>
        {fieldErrors[fieldName]}
      </p>
    ) : null;
  };

  if (isSuccess) {"""
content = content.replace("  if (isSuccess) {", get_field_error, 1)

# 2. Main form container & error message
old_form_container = """      <div className="container mx-auto px-4 max-w-4xl mt-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-brand-dark mb-4">Become a Master Artisans Contributor</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-4">
            Help document, preserve, and responsibly share the knowledge of Kashmir’s artisans, workshops, craft communities, techniques, tools, materials, oral histories, and cultural memory.
          </p>
          <p className="text-sm text-gray-500 max-w-2xl mx-auto">
            Contributor opportunities may be voluntary, commissioned, grant-funded, fellowship-based, internship-based, or project-specific. The applicable terms, deliverables, expenses, attribution, intellectual-property rights, and compensation will be defined in writing before any assignment begins.
          </p>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-gray-100">
          <form className="space-y-10" onSubmit={handleSubmit}>
            {errorMsg && (
              <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-sm">
                <div className="font-bold mb-1">{errorMsg}</div>
                {Object.keys(fieldErrors).length > 0 && (
                  <ul className="mt-3 space-y-2">
                    {Object.entries(fieldErrors).map(([field, msg]) => (
                      <li key={field} className="flex items-start gap-2">
                        <span className="text-red-500 mt-0.5">❌</span> 
                        <span><strong className="capitalize">{field}</strong>: {msg}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}"""

new_form_container = """      <section className="container mx-auto px-4 max-w-4xl mt-[-40px] relative z-10 mb-12">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
          <h2 className="text-3xl font-black text-brand-dark mb-6">Become a Master Artisans Contributor</h2>
          <div className="prose prose-lg text-gray-600 mb-8 max-w-none">
            <p>Help document, preserve, and responsibly share the knowledge of Kashmir’s artisans, workshops, craft communities, techniques, tools, materials, oral histories, and cultural memory.</p>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 my-6">
              <h4 className="text-amber-800 font-bold mb-2 flex items-center">Important Notice</h4>
              <p className="text-amber-900 text-sm m-0">Contributor opportunities may be voluntary, commissioned, grant-funded, fellowship-based, internship-based, or project-specific. The applicable terms, deliverables, expenses, attribution, intellectual-property rights, and compensation will be defined in writing before any assignment begins.</p>
            </div>
          </div>

          {errorMsg && (
            <div className="bg-red-50 text-red-700 p-6 rounded-2xl mb-8 font-medium border border-red-100 flex items-start">
              <span className="text-xl mr-3">⚠️</span>
              <div>
                <p>{errorMsg}</p>
                {Object.keys(fieldErrors).length > 0 && (
                  <ul className="mt-2 space-y-1 text-sm">
                    {Object.entries(fieldErrors).map(([field, msg]) => (
                      <li key={field} className="flex items-start gap-2">
                        <span className="text-red-500 mt-0.5">❌</span> 
                        <span><strong className="capitalize">{field}</strong>: {msg}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-12">"""

content = content.replace(old_form_container, new_form_container, 1)

# Fix Sections wrapper and titles
sections = [
    ("Section 1: Applicant Information", "1", "Applicant Information"),
    ("Section 2: Contribution Profile", "2", "Contribution Profile"),
    ("Section 3: Skills and Work Samples", "3", "Skills and Work Samples"),
    ("Section 4: Motivation and Proposal", "4", "Motivation and Proposal"),
    ("Section 5: Declarations", "5", "Declarations")
]

for old_title, num, new_title in sections:
    old_section_start = f'<section className="space-y-6">\n              <h3 className="text-xl font-bold border-b pb-2">{old_title}</h3>'
    old_section_start_alt = f'<section className="space-y-4">\n              <h3 className="text-xl font-bold border-b pb-2">{old_title}</h3>'
    
    new_section_start = f'<div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">\n              <h3 className="text-xl font-bold text-brand-dark mb-6 flex items-center border-b pb-4">\n                <span className="bg-brand-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">{num}</span>\n                {new_title}\n              </h3>\n              <div className="space-y-6">'
    
    content = content.replace(old_section_start, new_section_start, 1)
    content = content.replace(old_section_start_alt, new_section_start, 1)

content = content.replace('</section>', '</div>\n            </div>')
content = content.replace('      </div>\n    </main>', '      </section>\n    </main>')

# Fix labels and inputs
# Find all labels that enclose an input/select/textarea
# Regex to match <label ...> Text ... <input/textarea/select ... /> </label>
import re

# First, separate labels and inputs for text-like inputs
def fix_label_input(match):
    # match.group(0) is the whole thing
    label_start = match.group(1) # <label className="block text-sm font-bold">
    label_text = match.group(2) # Full Name * \n
    input_tag = match.group(3) # <input ... />
    
    # We add getFieldError by parsing the name attr
    name_match = re.search(r'name="([^"]+)"', input_tag)
    name = name_match.group(1) if name_match else None
    
    error_tag = f"{{getFieldError('{name}')}}" if name else ""
    
    # fix label class
    new_label_start = '<label className="block text-sm font-bold text-gray-700 mb-2">'
    
    # fix input class
    # Replace anything that looks like `className="..."` with the new class
    new_class = 'className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition"'
    if 'className="' in input_tag:
        input_tag = re.sub(r'className="[^"]*"', new_class, input_tag)
    else:
        # insert class before closing tag or />
        pass # simplified

    # Put it all together
    return f'<div>\n                {new_label_start}{label_text.strip()}</label>\n                {input_tag}\n                {error_tag}\n              </div>'

# For simple ones:
pattern_simple = r'(<label[^>]*>)(.*?)(<input[^>]+type="(?:text|email|url)"[^>]*>)\s*</label>'
content = re.sub(pattern_simple, fix_label_input, content, flags=re.DOTALL)

pattern_select = r'(<label[^>]*>)(.*?)(<select[^>]*>.*?</select>)\s*</label>'
content = re.sub(pattern_select, fix_label_input, content, flags=re.DOTALL)

pattern_textarea = r'(<label[^>]*>)(.*?)(<textarea[^>]*>.*?</textarea>|(<textarea[^>]*/>))\s*</label>'
def fix_textarea(match):
    label_start = match.group(1)
    label_text = match.group(2)
    input_tag = match.group(3)
    
    name_match = re.search(r'name="([^"]+)"', input_tag)
    name = name_match.group(1) if name_match else None
    error_tag = f"{{getFieldError('{name}')}}" if name else ""
    
    new_label_start = '<label className="block text-sm font-bold text-gray-700 mb-2">'
    new_class = 'className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition resize-y"'
    
    # Textareas might have some nested p tags in the old version (motivation)
    # Let's extract any nested p tags to place them below label but before input
    p_tags = ""
    # wait, it's easier to just do it manually if it gets complex, but let's try
    if 'className="' in input_tag:
        input_tag = re.sub(r'className="[^"]*"', new_class, input_tag)
        
    return f'<div>\n                {new_label_start}{label_text.strip()}</label>\n                {input_tag}\n                {error_tag}\n              </div>'

content = re.sub(pattern_textarea, fix_textarea, content, flags=re.DOTALL)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
