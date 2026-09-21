const fs = require('fs');
let c = fs.readFileSync('frontend/src/lib/api.ts', 'utf8');

c = c.replace(
    /getSidebarStats:\s*async\s*\(\)\s*=>\s*\{[^}]+\}/,
    'getSidebarStats: async () => { const response = await api.get("/users/sidebar-stats"); return response.data?.data || response.data; }'
);

fs.writeFileSync('frontend/src/lib/api.ts', c);
