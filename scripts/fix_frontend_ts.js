const fs = require('fs');
const path = require('path');

const basePath = path.join(__dirname, '..', 'frontend', 'src', 'app', 'dashboard');

const sections = ['knowledge', 'taxonomy', 'relationships', 'verification', 'workflow', 'media', 'source-references'];

sections.forEach(section => {
  const pagePath = path.join(basePath, section, 'page.tsx');
  if (fs.existsSync(pagePath)) {
    let content = fs.readFileSync(pagePath, 'utf8');

    // Remove shadcn imports
    content = content.replace(/import { Card, CardHeader, CardTitle, CardContent } from '@\/components\/ui\/card';\n/g, '');
    content = content.replace(/import { Button } from '@\/components\/ui\/button';\n/g, '');
    content = content.replace(/import { Input } from '@\/components\/ui\/input';\n/g, '');
    content = content.replace(/import \{\n  Table,\n  TableBody,\n  TableCell,\n  TableHead,\n  TableHeader,\n  TableRow,\n\} from '@\/components\/ui\/table';\n/g, '');

    // Replace parameter 'e' with explicit type 'any'
    content = content.replace(/onChange={\(e\) => setSearchTerm\(e\.target\.value\)}/g, 'onChange={(e: any) => setSearchTerm(e.target.value)}');

    // Replace components with native HTML
    content = content.replace(/<Card>/g, '<div className="border rounded-lg shadow-sm">');
    content = content.replace(/<\/Card>/g, '</div>');
    
    content = content.replace(/<CardHeader>/g, '<div className="p-4 border-b">');
    content = content.replace(/<\/CardHeader>/g, '</div>');
    
    content = content.replace(/<CardTitle>/g, '<h2 className="text-xl font-semibold">');
    content = content.replace(/<\/CardTitle>/g, '</h2>');
    
    content = content.replace(/<CardContent>/g, '<div className="p-4">');
    content = content.replace(/<\/CardContent>/g, '</div>');
    
    content = content.replace(/<Button/g, '<button className="px-4 py-2 bg-blue-600 text-white rounded"');
    content = content.replace(/<\/Button>/g, '</button>');
    
    content = content.replace(/<Input /g, '<input className="px-3 py-2 border rounded" ');
    
    content = content.replace(/<Table>/g, '<table className="min-w-full divide-y">');
    content = content.replace(/<\/Table>/g, '</table>');
    
    content = content.replace(/<TableHeader>/g, '<thead className="bg-gray-50">');
    content = content.replace(/<\/TableHeader>/g, '</thead>');
    
    content = content.replace(/<TableBody>/g, '<tbody className="bg-white divide-y">');
    content = content.replace(/<\/TableBody>/g, '</tbody>');
    
    content = content.replace(/<TableRow>/g, '<tr>');
    content = content.replace(/<\/TableRow>/g, '</tr>');
    
    content = content.replace(/<TableHead>/g, '<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">');
    content = content.replace(/<\/TableHead>/g, '</th>');
    
    content = content.replace(/<TableCell/g, '<td className="px-6 py-4 whitespace-nowrap"');
    content = content.replace(/<\/TableCell>/g, '</td>');
    
    // Fix the variant properties left over on Button
    content = content.replace(/variant="[^"]*"/g, '');
    content = content.replace(/size="[^"]*"/g, '');

    fs.writeFileSync(pagePath, content);
  }
});

console.log('Successfully stripped non-existent UI components to resolve compilation errors.');
