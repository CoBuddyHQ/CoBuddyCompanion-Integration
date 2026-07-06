const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '../src/screens/application');

const REPLACEMENTS = [
  { regex: /(<Text[^>]*>)Cancel(<\/Text>)/g, replacement: '$1{CommonKycContent.CANCEL}$2' },
  { regex: /(<Text[^>]*>)Confirm(<\/Text>)/g, replacement: '$1{CommonKycContent.CONFIRM}$2' },
  { regex: /(<Text[^>]*>)Required(<\/Text>)/g, replacement: '$1{CommonKycContent.REQUIRED}$2' },
  { regex: /(<Text[^>]*>)Next step(<\/Text>)/g, replacement: '$1{CommonKycContent.NEXT_STEP}$2' },
  { regex: /(<Text[^>]*>)Corrections Required(<\/Text>)/g, replacement: '$1{CommonKycContent.CORRECTIONS_REQUIRED}$2' },
  { regex: /(<Text[^>]*>)REVIEW STARTED(<\/Text>)/g, replacement: '$1{CommonKycContent.REVIEW_STARTED}$2' },
  { regex: /(<Text[^>]*>)WHAT HAPPENS NEXT(<\/Text>)/g, replacement: '$1{CommonKycContent.WHAT_HAPPENS_NEXT}$2' },
  { regex: /(<Text[^>]*>)REVIEW TIMELINE(<\/Text>)/g, replacement: '$1{CommonKycContent.REVIEW_TIMELINE}$2' },
  { regex: /(<Text[^>]*>)Overall readiness(<\/Text>)/g, replacement: '$1{CommonKycContent.OVERALL_READINESS}$2' },
  { regex: /(<Text[^>]*>)Final review required(<\/Text>)/g, replacement: '$1{CommonKycContent.FINAL_REVIEW_REQUIRED}$2' },
  { regex: /(<Text[^>]*>)VERIFICATION COMPLETE(<\/Text>)/g, replacement: '$1{CommonKycContent.VERIFICATION_COMPLETE}$2' },
  { regex: /(<Text[^>]*>)Approved(<\/Text>)/g, replacement: '$1{CommonKycContent.APPROVED}$2' },
  { regex: /(<Text[^>]*>)Verification not approved(<\/Text>)/g, replacement: '$1{CommonKycContent.VERIFICATION_NOT_APPROVED}$2' },
  { regex: /(<Text[^>]*>)Edit review not approved(<\/Text>)/g, replacement: '$1{CommonKycContent.EDIT_REVIEW_NOT_APPROVED}$2' },
  { regex: /(<Text[^>]*>)Verification Progress(<\/Text>)/g, replacement: '$1{CommonKycContent.VERIFICATION_PROGRESS}$2' },
  { regex: /(<Text[^>]*>)Profile Setup Progress(<\/Text>)/g, replacement: '$1{CommonKycContent.PROFILE_SETUP_PROGRESS}$2' },
  { regex: /(<Text[^>]*>)REQUIRED STEPS(<\/Text>)/g, replacement: '$1{CommonKycContent.REQUIRED_STEPS}$2' },
  { regex: /(<Text[^>]*>)Tap to complete(<\/Text>)/g, replacement: '$1{CommonKycContent.TAP_TO_COMPLETE}$2' },
  { regex: /(<Text[^>]*>)Submitted(<\/Text>)/g, replacement: '$1{CommonKycContent.SUBMITTED}$2' },
];

function processFiles() {
  const files = fs.readdirSync(DIR).filter(f => f.endsWith('.tsx'));
  let totalModifications = 0;

  files.forEach(file => {
    const filePath = path.join(DIR, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    REPLACEMENTS.forEach(({ regex, replacement }) => {
      if (regex.test(content)) {
        content = content.replace(regex, replacement);
        modified = true;
      }
    });

    if (modified) {
      // Inject import if not present
      if (!content.includes('CommonKycContent')) {
        const importRegex = /import\s+\{([^}]*)\}\s+from\s+['"]\.\.\/\.\.\/content\/applicationKycContent['"];/;
        const match = content.match(importRegex);
        if (match) {
          const importStatement = match[0];
          const importedItems = match[1];
          if (!importedItems.includes('CommonKycContent')) {
            const newImport = importStatement.replace('{', '{CommonKycContent, ');
            content = content.replace(importStatement, newImport);
          }
        } else {
          // Add a new import right after the last import
          const lastImportIndex = content.lastIndexOf('import ');
          if (lastImportIndex !== -1) {
            const endOfLine = content.indexOf('\n', lastImportIndex);
            content = content.slice(0, endOfLine + 1) + "import {CommonKycContent} from '../../content/applicationKycContent';\n" + content.slice(endOfLine + 1);
          }
        }
      }
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${file}`);
      totalModifications++;
    }
  });

  console.log(`\nSuccessfully modified ${totalModifications} files.`);
}

processFiles();
