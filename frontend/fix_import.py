import os
import re

path = r'C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\state-of-kashmir-crafts\media-center\page.tsx'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add FaFilePdf to the react-icons/fa import list
content = content.replace("FaComments \n} from 'react-icons/fa';", "FaComments, FaFilePdf \n} from 'react-icons/fa';")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
