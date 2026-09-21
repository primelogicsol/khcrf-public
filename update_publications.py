import re

filepath = 'frontend/src/components/publications/PublicationsSection.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace apiState type and state
content = re.sub(
    r'const \[apiState, setApiState\] = useState<.*?>\("LOADING"\);',
    r'type CatalogueState = "LOADING" | "SUCCESS" | "EMPTY" | "ERROR";\n  const [catalogueState, setCatalogueState] = useState<CatalogueState>("LOADING");',
    content
)

# Update try-catch block for state changes
content = re.sub(r'setApiState\("SUCCESS_EMPTY"\);', r'setCatalogueState("EMPTY");', content)
content = re.sub(r'setApiState\("SUCCESS_WITH_RECORDS"\);', r'setCatalogueState("SUCCESS");', content)
content = re.sub(r'setApiState\("SERVICE_ERROR"\);', r'setCatalogueState("ERROR");', content)

# Remove the broken `if (loading)` block and insert proper state handling rendering
pattern = r'if \(loading\)\s*return <div[^>]+>.*?</div>;'
replacement = '''if (catalogueState === "LOADING") {
    return (
      <div className="text-center py-20 text-stone-400 font-medium animate-pulse">
        Loading KHCRF Press publications...
      </div>
    );
  }

  if (catalogueState === "ERROR") {
    return (
      <div className="text-center py-20">
        Publication catalogue is temporarily unavailable.
      </div>
    );
  }

  if (catalogueState === "EMPTY") {
    return (
      <div className="py-20 text-center">
        <h3 className="text-xl font-serif text-[#1C2024] mb-4">No Publications Currently Available</h3>
        <p className="text-gray-600">Please check back later for updates to our catalog.</p>
      </div>
    );
  }'''
content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated file")
