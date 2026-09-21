import re
import os

path = 'frontend/src/app/(main)/state-of-kashmir-crafts/participate/ParticipateClient.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add AdminPreviewToolbar import
if 'AdminPreviewToolbar' not in content:
    content = content.replace(
        "import CivilSocietyPathwayClient from './CivilSocietyPathwayClient';",
        "import CivilSocietyPathwayClient from './CivilSocietyPathwayClient';\nimport AdminPreviewToolbar from './AdminPreviewToolbar';"
    )

# Find the start of the component
comp_start_idx = content.find('export default function ParticipateClient() {')
if comp_start_idx == -1:
    print("Could not find ParticipateClient()")
    exit(1)

# Find the state definitions to replace
state_block_match = re.search(r'const \[category, setCategory\] = useState\(""\);\s*// Registration status states\s*const \[regLoading, setRegLoading\] = useState\(true\);\s*const \[hasReg, setHasReg\] = useState\(false\);\s*const \[regStatus, setRegStatus\] = useState\(""\);\s*const \[regType, setRegType\] = useState\(""\);\s*const \[regRef, setRegRef\] = useState\(""\);\s*const \[regData, setRegData\] = useState<any>\(null\);', content)

if not state_block_match:
    print("Could not find state block")
    exit(1)

new_state_block = """const [realCategory, setRealCategory] = useState("");
  // Registration status states
  const [regLoading, setRegLoading] = useState(true);
  const [realHasReg, setRealHasReg] = useState(false);
  const [realRegStatus, setRealRegStatus] = useState("");
  const [realRegType, setRealRegType] = useState("");
  const [realRegRef, setRealRegRef] = useState("");
  const [realRegData, setRealRegData] = useState<any>(null);

  const [previewActive, setPreviewActive] = useState(false);
  const [previewCategory, setPreviewCategory] = useState("");
  const [previewStatus, setPreviewStatus] = useState("APPROVED");
  const [impersonatedUser, setImpersonatedUser] = useState<any>(null);

  const isAdmin = user?.isAdmin || user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN';
  const isPreviewing = previewActive && isAdmin;

  const category = isPreviewing ? (impersonatedUser ? impersonatedUser.categoryLabel : previewCategory) : realCategory;
  const hasReg = isPreviewing ? (previewStatus !== 'NOT_REGISTERED' || !!impersonatedUser) : realHasReg;
  const regStatus = isPreviewing ? (impersonatedUser ? impersonatedUser.status : (previewStatus === 'NOT_REGISTERED' ? '' : previewStatus)) : realRegStatus;
  const regType = isPreviewing ? (impersonatedUser ? impersonatedUser.registrationType : 'INDIVIDUAL') : realRegType;
  const regRef = isPreviewing ? (impersonatedUser ? impersonatedUser.referenceNumber : 'SKC-PREVIEW-0000') : realRegRef;
  const regData = isPreviewing ? (impersonatedUser || {}) : realRegData;
  const effectiveUser = (isPreviewing && impersonatedUser) ? { ...user, ...impersonatedUser, isAdmin: false } : user;

  const setCategory = (val: string) => {
    if (isPreviewing && !impersonatedUser) {
      setPreviewCategory(val);
    } else {
      setRealCategory(val);
    }
  };
  const setHasReg = (val: boolean) => setRealHasReg(val);
  const setRegStatus = (val: string) => setRealRegStatus(val);
  const setRegType = (val: string) => setRealRegType(val);
  const setRegRef = (val: string) => setRealRegRef(val);
  const setRegData = (val: any) => setRealRegData(val);
"""
content = content.replace(state_block_match.group(0), new_state_block)

render_start_idx = content.find('if (authLoading || (user && regLoading)) {')
if render_start_idx == -1:
    print("Could not find render start")
    exit(1)

before_render = content[:render_start_idx]
render_body = content[render_start_idx:]

last_brace_idx = render_body.rfind('}')
inner_body = render_body[:last_brace_idx]

# Replace `user` with `effectiveUser` inside inner_body for rendering logic
# to correctly impersonate without overriding the context user
inner_body = re.sub(r'\buser\b', 'effectiveUser', inner_body)

new_render_body = f"""
  const renderContent = () => {{
    {inner_body}
  }};

  return (
    <>
      {{isAdmin && (
        <AdminPreviewToolbar 
          isActive={{previewActive}}
          onActivatePreview={{() => setPreviewActive(true)}}
          onExitPreview={{() => {{ setPreviewActive(false); setPreviewCategory(''); setImpersonatedUser(null); }}}}
          onPreviewCategory={{setPreviewCategory}}
          onPreviewStatus={{setPreviewStatus}}
          onImpersonate={{setImpersonatedUser}}
          currentCategory={{previewCategory}}
          currentStatus={{previewStatus}}
          impersonatedUser={{impersonatedUser}}
        />
      )}}
      {{renderContent()}}
    </>
  );
}}
"""

content = before_render + new_render_body

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("ParticipateClient wrapped successfully")
