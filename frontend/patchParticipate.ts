import fs from 'fs';
import path from 'path';

const dir = 'C:\\Users\\Fayaz\\Sufipulseupdate2026\\HCRF 2026\\hcr_foundation_full_govind\\frontend\\src\\app\\(main)\\state-of-kashmir-crafts\\participate';

const files = fs.readdirSync(dir).filter(f => f.endsWith('PathwayClient.tsx'));

console.log(`Found ${files.length} pathway files to patch.`);

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  const roleMatch = file.replace('PathwayClient.tsx', ''); // e.g. Artisan

  // Fix ArtisanPathwayClient (has setStep(11))
  if (content.includes('// Submit logic here')) {
    const fetchLogic = `
                      try {
                        const payload = {
                          participantType: "${roleMatch}",
                          district: consultationData.profile?.district || "Unknown",
                          rawConsultationData: consultationData
                        };
                        const formData = new FormData();
                        formData.append("payload", JSON.stringify(payload));
                        if (uploadedFiles && uploadedFiles.length > 0) {
                          uploadedFiles.forEach((f: any) => formData.append("evidenceFiles", f.file || f));
                        }
                        await fetch("/api/backend/consultation/submit", { method: "POST", body: formData });
                      } catch (e) {
                        console.error("Submission failed", e);
                      }
                      
                      setTimeout(() => {`;
    content = content.replace(/\/\/\s*Submit logic here\s*setTimeout\(\(\) => \{/g, fetchLogic);
    modified = true;
  }

  // Fix other 24 files
  const alertStr = `onClick={() => alert("Submission functionality will connect to the API here.")}`;
  if (content.includes(alertStr)) {
    const fetchLogic = `onClick={async () => {
                      try {
                        const payload = {
                          participantType: "${roleMatch}",
                          district: consultationData?.profile?.district || "Unknown",
                          rawConsultationData: consultationData || {}
                        };
                        const formData = new FormData();
                        formData.append("payload", JSON.stringify(payload));
                        if (typeof uploadedFiles !== 'undefined' && uploadedFiles.length > 0) {
                          uploadedFiles.forEach((f: any) => formData.append("evidenceFiles", f.file || f));
                        }
                        const res = await fetch("/api/backend/consultation/submit", { method: "POST", body: formData });
                        if (res.ok) {
                          alert("Submission Successful!");
                          window.location.href = '/state-of-kashmir-crafts/participate';
                        } else {
                          alert("Submission Failed.");
                        }
                      } catch (e) {
                        alert("Submission Error.");
                      }
                    }}`;
    content = content.replace(alertStr, fetchLogic);
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Patched ${file}`);
  }
}

console.log('Patching complete.');
