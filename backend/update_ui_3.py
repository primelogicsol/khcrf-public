import os

filepath = '../frontend/src/app/(main)/about/partner-network/registry/RegistryClient.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

old_block = '''                            <div>
                              <h4 className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">Ecosystem Relationship</h4>
                              <p className="text-gray-900 font-medium">{item.ecosystemRelationship || "KHCRF Partner Network"}</p>
                            </div>'''

new_block = '''                            <div>
                              <h4 className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">Relationship Class</h4>
                              <p className="text-gray-900 font-medium">{item.relationshipClass || "Ecosystem-Affiliated Organization"}</p>
                            </div>
                            {item.ecosystemRelationship && (
                              <div>
                                <h4 className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">Ecosystem Relationship</h4>
                                <p className="text-gray-900 font-medium">{item.ecosystemRelationship}</p>
                              </div>
                            )}
                            {item.parentOrg && (
                              <div>
                                <h4 className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">Parent</h4>
                                <p className="text-gray-900 font-medium">{item.parentOrg}</p>
                              </div>
                            )}'''

content = content.replace(old_block, new_block)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated RegistryClient.tsx UI")
