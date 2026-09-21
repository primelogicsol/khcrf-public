import re
path = 'frontend/src/app/(main)/state-of-kashmir-crafts/participate/ParticipateClient.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add previewModes to state
state_search = """const [previewStatus, setPreviewStatus] = useState("APPROVED");
  const [impersonatedUser, setImpersonatedUser] = useState<any>(null);"""

state_replace = """const [previewStatus, setPreviewStatus] = useState("APPROVED");
  const [previewModes, setPreviewModes] = useState<string[]>(["Online Survey"]);
  const [impersonatedUser, setImpersonatedUser] = useState<any>(null);"""

content = content.replace(state_search, state_replace)

# Add previewModes to regData mock
regData_search = "const regData = isPreviewing ? (impersonatedUser || {}) : realRegData;"
regData_replace = "const regData = isPreviewing ? (impersonatedUser || { approvedParticipationModes: previewModes }) : realRegData;"
content = content.replace(regData_search, regData_replace)

# Pass previewModes to AdminPreviewToolbar
toolbar_search = """<AdminPreviewToolbar 
          isActive={previewActive}
          onActivatePreview={() => setPreviewActive(true)}
          onExitPreview={() => { setPreviewActive(false); setPreviewCategory(''); setImpersonatedUser(null); }}
          onPreviewCategory={setPreviewCategory}
          onPreviewStatus={setPreviewStatus}
          onImpersonate={setImpersonatedUser}
          currentCategory={previewCategory}
          currentStatus={previewStatus}
          impersonatedUser={impersonatedUser}
        />"""

toolbar_replace = """<AdminPreviewToolbar 
          isActive={previewActive}
          onActivatePreview={() => setPreviewActive(true)}
          onExitPreview={() => { setPreviewActive(false); setPreviewCategory(''); setImpersonatedUser(null); }}
          onPreviewCategory={setPreviewCategory}
          onPreviewStatus={setPreviewStatus}
          onPreviewModes={setPreviewModes}
          onImpersonate={setImpersonatedUser}
          currentCategory={previewCategory}
          currentStatus={previewStatus}
          currentModes={previewModes}
          impersonatedUser={impersonatedUser}
        />"""

content = content.replace(toolbar_search, toolbar_replace)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated ParticipateClient with previewModes")
