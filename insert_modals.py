import os
import re

directories = ['crafts', 'materials', 'techniques', 'motifs', 'taxonomy']
base_path = r"C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\dashboard"

for d in directories:
    file_path = os.path.join(base_path, d, 'page.tsx')
    if not os.path.exists(file_path):
        continue
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    modal_code = """
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4">{editingRecord ? 'Edit Record' : 'Create Record'}</h2>
            {submitError && <div className="text-red-500 mb-4">{submitError}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Data payload (JSON)</label>
                <textarea 
                  className="w-full px-3 py-2 border rounded font-mono text-sm"
                  rows={4}
                  value={JSON.stringify(formData, null, 2)}
                  onChange={e => {
                    try {
                      setFormData(JSON.parse(e.target.value));
                    } catch(err) {
                      // ignore parse errors while typing
                    }
                  }}
                  placeholder='{"canonicalEntityId": "example"}'
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <button type="button" className="px-4 py-2 border rounded" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded flex items-center" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
"""
    
    if "isModalOpen && (" not in content:
        # replace the last </div> before );
        idx = content.rfind("</div>\n  );\n}")
        if idx == -1:
            idx = content.rfind("</div>\n    </div>\n  );")
        if idx == -1:
            idx = content.rfind("</div>")
            
        content = content[:idx] + modal_code + content[idx:]

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated {d}/page.tsx")
