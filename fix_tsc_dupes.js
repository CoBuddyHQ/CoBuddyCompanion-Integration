const fs = require('fs');

let log = fs.readFileSync('C:/Users/shlok/.gemini/antigravity/brain/07b9a1fa-e9ce-4f48-985c-3f812d511d5d/.system_generated/tasks/task-1443.log', 'utf8');
let lines = log.split('\n');
let edits = {};

lines.forEach(line => {
    let match = line.match(/(src\/.*?\.tsx)\((\d+),\d+\): error TS17001/);
    if (match) {
        let file = match[1];
        let lineNum = parseInt(match[2], 10);
        if (!edits[file]) edits[file] = [];
        edits[file].push(lineNum);
    }
});

let fileCount = Object.keys(edits).length;
console.log(`Found ${fileCount} files with duplicates.`);

Object.keys(edits).forEach(file => {
    let content = fs.readFileSync(file, 'utf8').split('\n');
    
    // We sort descending so splicing/replacing doesn't shift line numbers below it
    edits[file].sort((a,b) => b - a).forEach(lineNum => {
        let idx = lineNum - 1;
        // The duplicate is exactly on this line. 
        // We will remove accessibilityRole="button" or accessibilityRole={'button'} etc
        // If it was injected by us, it might be on the <TouchableOpacity line.
        // Wait, the lineNum in the error usually points to the SECOND attribute!
        // So this is the original one! We remove the original one.
        // OR we can remove the injected one. The injected one is EXACTLY: `<TouchableOpacity accessibilityRole="button"` or `<Pressable accessibilityRole="button"`.
        // Let's just remove the FIRST accessibilityRole="button" from the file if we can't be sure? No, there might be multiple CTAs.
        // It's safest to remove it from `idx`.
        
        let originalLine = content[idx];
        content[idx] = content[idx].replace(/accessibilityRole\s*=\s*(["'][^"']+["']|\{[^}]+\})/, '');
        
        console.log(`File: ${file}:${lineNum}`);
        console.log(`- ${originalLine.trim()}`);
        console.log(`+ ${content[idx].trim()}`);
    });
    fs.writeFileSync(file, content.join('\n'));
});
console.log('Fixed files successfully.');
