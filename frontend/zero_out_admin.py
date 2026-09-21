import os
import re

directory = r'C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\admin'

replacements = [
    (r'"1,850"', '"0"'),
    (r'"830"', '"0"'),
    (r'"45"', '"0"'),
    (r'"10"', '"0"'),
    (r'"412"', '"0"'),
    (r'"1,245"', '"0"'),
    (r'"620"', '"0"'),
    (r'"480"', '"0"'),
    (r'count: 420', 'count: 0'),
    (r'refs: 156', 'refs: 0'),
    (r'count: 290', 'count: 0'),
    (r'refs: 112', 'refs: 0'),
    (r'count: 385', 'count: 0'),
    (r'refs: 145', 'refs: 0'),
    (r'count: 310', 'count: 0'),
    (r'refs: 86', 'refs: 0'),
    (r'count: 450', 'count: 0'),
    (r'refs: 94', 'refs: 0'),
    (r'count: 245', 'count: 0'),
    (r'refs: 78', 'refs: 0'),
    (r'count: 520', 'count: 0'),
    (r'refs: 185', 'refs: 0'),
    (r'count: 180', 'count: 0'),
    (r'refs: 62', 'refs: 0'),
    (r'count: 155', 'count: 0'),
    (r'refs: 45', 'refs: 0'),
    (r'"145"', '"0"'),
    (r'"82"', '"0"'),
    (r'"31"', '"0"'),
    (r'"142"', '"0"'),
    (r'"340"', '"0"'),
    (r'"3,210"', '"0"'),
    (r'"42"', '"0"'),
    (r'"115"', '"0"'),
    (r'"14,205"', '"0"'),
    (r'"18"', '"0"'),
    (r'"5"', '"0"'),
    (r'"1.2M"', '"0"'),
    (r'mentions: 1240', 'mentions: 0'),
    (r'mentions: 985', 'mentions: 0'),
    (r'mentions: 750', 'mentions: 0'),
    (r'mentions: 420', 'mentions: 0'),
    (r'mentions: 395', 'mentions: 0'),
    (r'>142<', '>0<'),
    (r'>1,850<', '>0<'),
    (r'>830<', '>0<'),
    (r'>45<', '>0<'),
    (r'>10<', '>0<'),
    (r'>412<', '>0<'),
    (r'>1,245<', '>0<'),
    (r'>620<', '>0<'),
    (r'>480<', '>0<'),
    (r'>14<', '>0<'),
    (r'>128<', '>0<'),
    (r'>315<', '>0<'),
    (r'>30<', '>0<'),
    (r'>340<', '>0<'),
    (r'>8<', '>0<'),
    (r'"8"', '"0"'),
    (r'"Completed"', '"Pending"'),
    (r'"In Progress"', '"Pending"'),
    (r'Dec 15, 2026', 'July 15, 2026'),
]

for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith('.tsx'):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            for pattern, repl in replacements:
                content = re.sub(pattern, repl, content)
            
            with open(path, 'w', encoding='utf-8') as f:
                f.write(content)

print("Done replacing.")
