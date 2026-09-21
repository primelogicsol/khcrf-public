import re
path = 'frontend/src/app/(main)/state-of-kashmir-crafts/participate/ParticipateClient.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

fetch_interceptor = """
  useEffect(() => {
    if (isPreviewing) {
      const originalFetch = window.fetch;
      window.fetch = async (...args) => {
        const url = typeof args[0] === 'string' ? args[0] : (args[0] as Request).url;
        const method = (args[1]?.method || 'GET').toUpperCase();
        
        if (method !== 'GET' && url.includes('/api')) {
          alert("Preview Mode\\n\\nAction disabled.\\nNo data has been written.");
          return new Response(JSON.stringify({ success: true, message: "Mocked success" }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        return originalFetch(...args);
      };
      return () => {
        window.fetch = originalFetch;
      };
    }
  }, [isPreviewing]);
"""

# Insert right after `const effectiveUser = ...`
insert_search = "const effectiveUser = (isPreviewing && impersonatedUser) ? { ...user, ...impersonatedUser, isAdmin: false } : user;"
insert_replace = insert_search + "\n" + fetch_interceptor

content = content.replace(insert_search, insert_replace)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Added fetch interceptor to ParticipateClient")
