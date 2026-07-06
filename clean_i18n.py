import os
import re

src_dir = r"C:\Users\shlok\Desktop\CoBuddyCompanion\src"
count = 0

# Regex to match different variations of i18n import
import_pattern = re.compile(r'import\s+i18n\s+from\s+[\'"](?:\.\./)+i18n[\'"];?\n?', re.MULTILINE)

for root, dirs, files in os.walk(src_dir):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            filepath = os.path.join(root, file)
            
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                
            # If the file imports i18n but doesn't actually use it anywhere like `i18n.t` or `i18n.language`
            if import_pattern.search(content) and 'i18n.' not in content:
                # Remove the import line
                new_content = import_pattern.sub('', content)
                
                if new_content != content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Cleaned unused i18n from: {file}")
                    count += 1

print(f"\nDone! Automatically removed unused i18n imports from {count} files.")
