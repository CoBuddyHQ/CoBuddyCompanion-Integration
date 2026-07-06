const fs = require('fs');
const path = require('path');

function walk(dir) {
  fs.readdirSync(dir).forEach(f => {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      walk(p);
    } else if (p.endsWith('.tsx')) {
      let code = fs.readFileSync(p, 'utf8');
      let originalCode = code;

      // Fix t used before assigned: Move const { t } = useTranslation(); to the top of the function
      if (code.includes('const { t } = useTranslation();')) {
        // If there are arrays before const { t } = useTranslation(); inside the component
        // A simple way is to remove const { t } = useTranslation(); and insert it right after the component declaration
        code = code.replace(/\s*const\s+\{\s*t\s*\}\s*=\s*useTranslation\(\);\s*/g, '\n');
        
        const componentRegex = /(const\s+[A-Za-z]+Screen\s*(?::\s*React\.FC(?:<[^>]+>)?\s*)?=\s*(?:\([^)]*\)\s*)?=>\s*\{)/;
        code = code.replace(componentRegex, (match) => {
          return match + '\n  const { t } = useTranslation();\n';
        });
        
        const defaultExportRegex = /(export\s+default\s+function\s+[A-Za-z]+Screen\s*\([^)]*\)\s*\{)/;
        if (!componentRegex.test(originalCode) && defaultExportRegex.test(originalCode)) {
             code = code.replace(defaultExportRegex, (match) => {
                return match + '\n  const { t } = useTranslation();\n';
             });
        }
      }
      
      // Fix .map errors (both single and double quotes)
      code = code.replace(/t\("([^"]+)"\)\.map/g, '(t("$1", { returnObjects: true }) as any[]).map');
      code = code.replace(/t\('([^']+)'\)\.map/g, "(t('$1', { returnObjects: true }) as any[]).map");
      
      // Fix WorkPreferenceScreen explicit type issue:
      // Argument of type 'string' is not assignable to parameter of type 'readonly { id: string; label: string; sub?: string | undefined; }[]'
      // It passes t(...) to items={...} which expects an array.
      code = code.replace(/items=\{t\("content\.application_kyc\.WorkPreferencesContent\.DAYS"\)\}/g, 'items={(t("content.application_kyc.WorkPreferencesContent.DAYS", { returnObjects: true }) as any[])}');
      code = code.replace(/items=\{t\("content\.application_kyc\.WorkPreferencesContent\.FORMATS"\)\}/g, 'items={(t("content.application_kyc.WorkPreferencesContent.FORMATS", { returnObjects: true }) as any[])}');
      code = code.replace(/items=\{t\('content\.application_kyc\.WorkPreferencesContent\.DAYS'\)\}/g, "items={(t('content.application_kyc.WorkPreferencesContent.DAYS', { returnObjects: true }) as any[])}");
      code = code.replace(/items=\{t\('content\.application_kyc\.WorkPreferencesContent\.FORMATS'\)\}/g, "items={(t('content.application_kyc.WorkPreferencesContent.FORMATS', { returnObjects: true }) as any[])}");
      
      if (code !== originalCode) {
        fs.writeFileSync(p, code, 'utf8');
      }
    }
  });
}

walk('src/screens');
