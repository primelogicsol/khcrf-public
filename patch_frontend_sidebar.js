const fs = require('fs');
let c = fs.readFileSync('frontend/src/lib/api.ts', 'utf8');

c = c.replace(
    'getSidebarStats: async () => {\n        const response = await api.get(\'/users/sidebar-stats\');\n        return response.data;\n    }',
    'getSidebarStats: async () => {\n        const response = await api.get(\'/users/sidebar-stats\');\n        return response.data?.data || response.data;\n    }'
);

fs.writeFileSync('frontend/src/lib/api.ts', c);
