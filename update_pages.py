import os
import re

directories = ['crafts', 'materials', 'techniques', 'motifs', 'taxonomy']
base_path = r"C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\dashboard"

for d in directories:
    file_path = os.path.join(base_path, d, 'page.tsx')
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        continue
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Update useSWR to include mutate
    content = re.sub(r'const { data, error, isLoading } = useSWR\(`(/api/[^?]+)\?\$\{query\.toString\(\)\}`, fetcher\);',
                     r'const { data, error, isLoading, mutate } = useSWR(`\1?${query.toString()}`, fetcher);\n  const apiEndpoint = `\1`;', content)
    
    # 2. Add state and handlers
    handlers = """
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const openCreateModal = () => {
    setEditingRecord(null);
    setFormData({});
    setSubmitError('');
    setIsModalOpen(true);
  };

  const openEditModal = (record: any) => {
    setEditingRecord(record);
    setFormData(record);
    setSubmitError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const url = editingRecord ? `${apiEndpoint}/${editingRecord.id}` : apiEndpoint;
      const method = editingRecord ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Failed to save record');
      await mutate();
      setIsModalOpen(false);
    } catch (err: any) {
      setSubmitError(err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };
"""
    if "const [isModalOpen" not in content:
        content = content.replace('const records = data?.data || [];', handlers + '\n  const records = data?.data || [];')

    # 3. Update Create New button
    content = re.sub(r'<button className="([^"]+)">Create New</button>',
                     r'<button className="\1" onClick={openCreateModal}>Create New</button>', content)

    # 4. Update Edit button
    content = re.sub(r'<button className="([^"]+)"(?:\s+onClick=\{[^}]+\})?>Edit</button>',
                     r'<button className="\1" onClick={() => openEditModal(record)}>Edit</button>', content)

    # 5. Add Modal
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
        content = re.sub(r'(</div>\n\s*</div>\n\s*);\n}', modal_code + r'\1', content)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated {d}/page.tsx")
