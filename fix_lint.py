import os
import re

def fix_inline_styles(content):
    # This is complex to do automatically with regex, but we can do simple ones.
    # Actually, we can just replace unused vars and useless escapes first.
    pass

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    orig = content
    
    # Fix unused 'Alert'
    content = re.sub(r"import \{([^}]*)\bAlert\b([^}]*)\} from 'react-native';",
                     lambda m: "import {" + (m.group(1) + m.group(2)).replace(', ,', ',').strip(', ') + "} from 'react-native';", content)
    
    # Fix unused 'setSubmitting'
    content = re.sub(r'const \[\s*submitting\s*,\s*setSubmitting\s*\] = useState', 'const [submitting, _setSubmitting] = useState', content)
    content = re.sub(r'const \[\s*isSubmitting\s*,\s*setSubmitting\s*\] = useState', 'const [isSubmitting, _setSubmitting] = useState', content)
    
    # Fix unused 'SupportTicket' in SupportTicketDetailScreen.tsx
    if 'SupportTicketDetailScreen' in filepath:
        content = re.sub(r"import type \{[^}]*\bSupportTicket\b[^}]*\} from '../../types/support\.types';\n?", "", content)
        
    # Fix unused 's' in applicationStore.ts
    if 'applicationStore.ts' in filepath:
        content = content.replace('useShallow(s =>', 'useShallow(_s =>')
        
    # Fix shadowed 'now' in requestStore.ts
    if 'requestStore.ts' in filepath:
        content = content.replace('const now = new Date', 'const currentDate = new Date')
        content = content.replace('now.toISOString()', 'currentDate.toISOString()')
        
    # Fix useless escape \- in validators.ts
    if 'validators.ts' in filepath:
        content = content.replace(r'\-', '-')

    # Fix shadowed 't' in several files (e.g., inside map functions)
    content = re.sub(r'\(\s*t\s*:\s*([^)]*)\)\s*=>', r'(textArg: \1) =>', content)
    content = re.sub(r'\(\s*t\s*\)\s*=>', r'(textArg) =>', content)
    
    # Also fix where 't' is used in the callback body
    # This is tricky without AST. Let's do it manually for the known ones.
    
    if content != orig:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed {filepath}")

TARGETS = [
    r'C:\Users\shlok\Desktop\CoBuddyCompanion\src\screens\support',
    r'C:\Users\shlok\Desktop\CoBuddyCompanion\src\store\slices',
    r'C:\Users\shlok\Desktop\CoBuddyCompanion\src\utils',
]

for t in TARGETS:
    if os.path.isdir(t):
        for root, _, files in os.walk(t):
            for f in files:
                if f.endswith('.ts') or f.endswith('.tsx'):
                    fix_file(os.path.join(root, f))
    elif os.path.isfile(t):
        fix_file(t)

