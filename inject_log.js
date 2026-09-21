const fs = require('fs');
let c = fs.readFileSync('frontend/src/app/(main)/state-of-kashmir-crafts/become-a-fellow/page.tsx', 'utf8');

c = c.replace(/const handleSubmit = async \(e: React\.FormEvent\) => \{/, 
`const handleSubmit = async (e: React.FormEvent) => {
    console.log('handleSubmit Triggered!');
    console.log(formData);
    console.log(cvFile);`);

fs.writeFileSync('frontend/src/app/(main)/state-of-kashmir-crafts/become-a-fellow/page.tsx', c);
