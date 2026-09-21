import os

filepath = 'src/lib/api.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

getPublic = '''    getPublic: async () => {
        const response = await api.get('/partner/registry');
        return response.data;
    },'''

getStats = '''    getPublic: async () => {
        const response = await api.get('/partner/registry');
        return response.data;
    },
    getStats: async () => {
        const response = await api.get('/partner/stats');
        return response.data;
    },'''

content = content.replace(getPublic, getStats)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated api.ts")
