const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

let count = 0;
walkDir('src', function(filePath) {
  if (filePath.endsWith('.tsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // The previous script added `<TouchableOpacity accessibilityRole="button"${attrs}>`
    // So there is NO space before accessibilityRole="button".
    
    let parts = content.split('<TouchableOpacity accessibilityRole="button"');
    for (let i = 1; i < parts.length; i++) {
        let tagEnd = parts[i].indexOf('>');
        if (tagEnd !== -1) {
            let tagContent = parts[i].substring(0, tagEnd);
            let roles = tagContent.match(/accessibilityRole/g);
            if (roles && roles.length > 0) {
                // There's already another one in the tag!
                // We should NOT have injected it. So we leave it as `<TouchableOpacity` without the injected one.
                parts[i] = parts[i];
                // Wait, if we join with '<TouchableOpacity ', we need to add the space if there isn't one?
                // Wait, if we join with '<TouchableOpacity', then if parts[i] started with ` `, it's fine.
            } else {
                // There is NO other one, so we MUST KEEP our injection.
                parts[i] = ' accessibilityRole="button"' + parts[i];
            }
        } else {
            // Not found end tag, restore
            parts[i] = ' accessibilityRole="button"' + parts[i];
        }
    }
    content = parts.join('<TouchableOpacity');
    
    parts = content.split('<Pressable accessibilityRole="button"');
    for (let i = 1; i < parts.length; i++) {
        let tagEnd = parts[i].indexOf('>');
        if (tagEnd !== -1) {
            let tagContent = parts[i].substring(0, tagEnd);
            let roles = tagContent.match(/accessibilityRole/g);
            if (roles && roles.length > 0) {
                parts[i] = parts[i];
            } else {
                parts[i] = ' accessibilityRole="button"' + parts[i];
            }
        } else {
            parts[i] = ' accessibilityRole="button"' + parts[i];
        }
    }
    content = parts.join('<Pressable');

    if (content !== original) {
        fs.writeFileSync(filePath, content);
        count++;
    }
  }
});
console.log('Fixed duplicate roles in', count, 'files.');
