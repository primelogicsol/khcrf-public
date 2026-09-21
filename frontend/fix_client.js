const fs = require('fs');
let code = fs.readFileSync('src/app/(main)/state-of-kashmir-crafts/participate/ParticipateClient.tsx', 'utf-8');

code = code.replace(/isAdminPreview/g, 'isPreviewing');

const oldUseEffect = \  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setRegLoading(false);
      return;
    }\;

const newUseEffect = \  useEffect(() => {
    if (authLoading) return;
    if (!user || isPublicLandingPreview) {
      setRegLoading(false);
      return;
    }\;

if (code.includes(oldUseEffect)) {
  code = code.replace(oldUseEffect, newUseEffect);
  code = code.replace(/}, \\\[user, authLoading\\\]\\);/g, '}, [user, authLoading, isPublicLandingPreview]);');
  console.log('Fixed useEffect and isAdminPreview');
} else {
  console.log('Could not find useEffect block to replace!');
}

fs.writeFileSync('src/app/(main)/state-of-kashmir-crafts/participate/ParticipateClient.tsx', code);
