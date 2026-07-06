const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '../src/screens/auth');

const REPLACEMENTS = [
  { regex: /(<Text[^>]*>)Fast, private, and secure(<\/Text>)/g, replacement: '$1{BiometricContent.FAST_PRIVATE}$2' },
  { regex: /(<Text[^>]*>)WHY ENABLE BIOMETRIC ACCESS\?(<\/Text>)/g, replacement: '$1{BiometricContent.WHY_ENABLE}$2' },
  { regex: /(<Text[^>]*>)Your biometric data stays on your device(<\/Text>)/g, replacement: '$1{BiometricContent.STAYS_ON_DEVICE}$2' },
  
  { regex: /(<Text[^>]*>)Secure access confirmation(<\/Text>)/g, replacement: '$1{ConfirmPINContent.SECURE_ACCESS}$2' },
  { regex: /(<Text[^>]*>)RE-ENTER PIN(<\/Text>)/g, replacement: '$1{ConfirmPINContent.RE_ENTER}$2' },
  
  { regex: /(<Text[^>]*>)Protects bookings, earnings, and safety tools(<\/Text>)/g, replacement: '$1{CreatePINContent.PROTECTS}$2' },
  { regex: /(<Text[^>]*>)Back to OTP verification(<\/Text>)/g, replacement: '$1{CreatePINContent.BACK_TO_OTP}$2' },
  
  { regex: /(<Text[^>]*>)App Interface Language(<\/Text>)/g, replacement: '$1{LanguageContent.APP_INTERFACE}$2' },
  { regex: /(<Text[^>]*>)APP INTERFACE LANGUAGE(<\/Text>)/g, replacement: '$1{LanguageContent.APP_INTERFACE_CAPS}$2' },
  { regex: /(<Text[^>]*>)Use English for Now(<\/Text>)/g, replacement: '$1{LanguageContent.USE_ENGLISH}$2' },
  
  { regex: /(<Text[^>]*>)HOW LOCATION HELPS(<\/Text>)/g, replacement: '$1{LocationPermContent.HOW_HELPS}$2' },
  { regex: /(<Text[^>]*>)Private by design(<\/Text>)/g, replacement: '$1{LocationPermContent.PRIVATE_DESIGN}$2' },
  
  { regex: /(<Text[^>]*>)WHY NOTIFICATIONS MATTER(<\/Text>)/g, replacement: '$1{NotificationPermContent.WHY_MATTER}$2' },
  
  { regex: /(<Text[^>]*>)ENTER OTP(<\/Text>)/g, replacement: '$1{OTPContent.ENTER_OTP}$2' },
  { regex: /(<Text[^>]*>)Secure verification(<\/Text>)/g, replacement: '$1{OTPContent.SECURE_VERIFICATION}$2' },
  { regex: /(<Text[^>]*>)Use another number(<\/Text>)/g, replacement: '$1{OTPContent.USE_ANOTHER_NUMBER}$2' },
  
  { regex: /(<Text[^>]*>)Secure companion login(<\/Text>)/g, replacement: '$1{PhoneLoginContent.SECURE_LOGIN}$2' },
  { regex: /(<Text[^>]*>)Your account stays protected(<\/Text>)/g, replacement: '$1{PhoneLoginContent.ACCOUNT_PROTECTED}$2' },
  { regex: /(<Text[^>]*>)Terms(<\/Text>)/g, replacement: '$1{PhoneLoginContent.TERMS}$2' },
  { regex: /(<Text[^>]*>)Safety Standards(<\/Text>)/g, replacement: '$1{PhoneLoginContent.SAFETY_STANDARDS}$2' },
  { regex: /(<Text[^>]*>)Privacy Policy(<\/Text>)/g, replacement: '$1{PhoneLoginContent.PRIVACY_POLICY}$2' },
  { regex: /(<Text[^>]*>)Select Country Code(<\/Text>)/g, replacement: '$1{PhoneLoginContent.SELECT_COUNTRY}$2' },
  
  { regex: /(<Text[^>]*>)Verified Companion Partner Platform(<\/Text>)/g, replacement: '$1{SplashContent.VERIFIED_PLATFORM}$2' },
  { regex: /(<Text[^>]*>)SAFE • VERIFIED • PROFESSIONAL(<\/Text>)/g, replacement: '$1{SplashContent.TRUST_LINE}$2' },
];

function processFiles() {
  const files = fs.readdirSync(DIR).filter(f => f.endsWith('.tsx'));
  let totalModifications = 0;

  files.forEach(file => {
    const filePath = path.join(DIR, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    REPLACEMENTS.forEach(({ regex, replacement }) => {
      // Because we use • in strings instead of hyphens, let's also do a generic replace for SplashContent
      if (replacement.includes('SplashContent.TRUST_LINE')) {
        const fallbackRegex = /(<Text[^>]*>)SAFE(.*)VERIFIED(.*)PROFESSIONAL(<\/Text>)/g;
        if (fallbackRegex.test(content)) {
          content = content.replace(fallbackRegex, '$1{SplashContent.TRUST_LINE}$4');
          modified = true;
        }
      }
      
      if (regex.test(content)) {
        content = content.replace(regex, replacement);
        modified = true;
      }
    });

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${file}`);
      totalModifications++;
    }
  });

  console.log(`\nSuccessfully modified ${totalModifications} files.`);
}

processFiles();
