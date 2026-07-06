import os
import re

TARGET = r'C:\Users\shlok\Desktop\CoBuddyCompanion\src\screens\application'
results = []
# Match texts that are inside > < and not inside curly braces
rx = re.compile(r'>\s*([^<>{]+?)\s*<')

for root, _, files in os.walk(TARGET):
    for f in files:
        if f.endswith('.tsx'):
            p = os.path.join(root, f)
            with open(p, encoding='utf-8') as f_obj:
                content = f_obj.read()
                matches = rx.findall(content)
                for m in matches:
                    m = m.strip()
                    if m and not m.startswith('{') and len(m) > 1:
                        results.append(f + ': ' + m)

print('Found', len(results), 'JSX hardcoded texts. Examples:')
print('\n'.join(results[:50]))
