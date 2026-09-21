import re

with open('frontend/src/app/(main)/master-artisans/registry/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("import Image from 'next/image';\n", "")
content = content.replace("FaSearch, FaUserPlus, FaUsers, FaCertificate, FaGem, FaFemale, FaStar, FaHandsHelping, FaCity", "FaSearch, FaUsers, FaCertificate, FaGem, FaFemale, FaStar, FaHandsHelping, FaCity")

with open('frontend/src/app/(main)/master-artisans/registry/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
