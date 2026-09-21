import os

filepath = 'src/app/(main)/about/partner-network/registry/RegistryClient.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

header_old = '''                    <div className="hidden md:block text-right">
                      <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">
                        Collaboration Type
                      </p>
                      <div className="flex flex-wrap justify-end gap-1">
                        {item.collaborationType?.map((type: string) => (
                          <span
                            key={type}
                            className="text-sm font-semibold text-brand-secondary bg-brand-secondary/5 px-2 py-0.5 rounded"
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>'''

header_new = '''                    <div className="hidden md:block text-right">
                      <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">
                        Network Category
                      </p>
                      <div className="flex justify-end">
                        <span className="text-sm font-semibold text-brand-secondary bg-brand-secondary/5 px-3 py-1 rounded">
                          {item.globalReachCategory || "Not Categorized"}
                        </span>
                      </div>
                    </div>'''

content = content.replace(header_old, header_new)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated header UI")
