import os

# Update consultationController.ts to add getConsultations
ctrl_path = r'C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\backend\src\controllers\consultationController.ts'
with open(ctrl_path, 'r', encoding='utf-8') as f:
    content = f.read()

get_function = '''
export const getConsultations = async (req: Request, res: Response) => {
    try {
        const consultations = await prisma.consultationSubmission.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json({ success: true, data: consultations });
    } catch (error: any) {
        console.error('Error fetching consultations:', error);
        res.status(500).json({ error: 'Failed to fetch consultations.' });
    }
};
'''

if "export const getConsultations" not in content:
    content += "\n" + get_function
    with open(ctrl_path, 'w', encoding='utf-8') as f:
        f.write(content)

# Update consultationRoutes.ts to add GET route
route_path = r'C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\backend\src\routes\consultationRoutes.ts'
with open(route_path, 'r', encoding='utf-8') as f:
    r_content = f.read()

if "import { submitConsultation, getConsultations }" not in r_content and "getConsultations" not in r_content:
    r_content = r_content.replace(
        "import { submitConsultation } from '../controllers/consultationController.js';",
        "import { submitConsultation, getConsultations } from '../controllers/consultationController.js';"
    )
    r_content = r_content.replace(
        "export default router;",
        "router.get('/', getConsultations);\n\nexport default router;"
    )
    with open(route_path, 'w', encoding='utf-8') as f:
        f.write(r_content)

print("Backend GET endpoint added.")
