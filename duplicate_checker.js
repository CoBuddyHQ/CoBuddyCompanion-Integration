const fs = require('fs');

const text = fs.readFileSync('src/i18n/locales/en.json', 'utf8');

function checkDuplicates(jsonString) {
    let position = 0;
    
    function skipWhitespace() {
        while (position < jsonString.length && /\s/.test(jsonString[position])) {
            position++;
        }
    }

    function parseValue() {
        skipWhitespace();
        const char = jsonString[position];
        
        if (char === '{') return parseObject();
        if (char === '[') return parseArray();
        if (char === '"') return parseString();
        if (char === 't' || char === 'f' || char === 'n' || /[\d-]/.test(char)) return parsePrimitive();
        
        throw new Error(`Unexpected character ${char} at ${position}`);
    }

    function parseObject() {
        const obj = {};
        const keys = new Set();
        position++; // skip {
        
        while (position < jsonString.length) {
            skipWhitespace();
            if (jsonString[position] === '}') {
                position++;
                return obj;
            }
            
            const key = parseString();
            if (keys.has(key)) {
                throw new Error(`DUPLICATE KEY DETECTED: "${key}"`);
            }
            keys.add(key);
            
            skipWhitespace();
            if (jsonString[position] !== ':') throw new Error(`Expected : at ${position}`);
            position++; // skip :
            
            obj[key] = parseValue();
            
            skipWhitespace();
            if (jsonString[position] === ',') {
                position++;
            } else if (jsonString[position] !== '}') {
                throw new Error(`Expected , or } at ${position}`);
            }
        }
    }

    function parseArray() {
        const arr = [];
        position++; // skip [
        while (position < jsonString.length) {
            skipWhitespace();
            if (jsonString[position] === ']') {
                position++;
                return arr;
            }
            arr.push(parseValue());
            skipWhitespace();
            if (jsonString[position] === ',') {
                position++;
            } else if (jsonString[position] !== ']') {
                throw new Error(`Expected , or ] at ${position}`);
            }
        }
    }

    function parseString() {
        position++; // skip "
        let str = "";
        while (position < jsonString.length) {
            if (jsonString[position] === '\\') {
                str += jsonString[position];
                position++;
                str += jsonString[position];
                position++;
                continue;
            }
            if (jsonString[position] === '"') {
                position++;
                return str;
            }
            str += jsonString[position];
            position++;
        }
    }

    function parsePrimitive() {
        let start = position;
        while (position < jsonString.length && /[a-z0-9.+-]/i.test(jsonString[position])) {
            position++;
        }
        return jsonString.slice(start, position);
    }

    parseValue();
    console.log("No duplicate keys found at any nesting level.");
}

try {
    checkDuplicates(text);
} catch (e) {
    console.error(e.message);
    process.exit(1);
}
