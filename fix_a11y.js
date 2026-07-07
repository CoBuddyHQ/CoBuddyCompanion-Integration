const fs = require('fs');

const replacements = [
  {
    file: 'src/screens/application/ApplicationReviewInfoScreen.tsx',
    find: /accessibilityLabel=\{`Complete missing: \$\{item\.label\}`\}/g,
    replace: 'accessibilityLabel={t("accessibility.complete_missing", { item: t(item.label) })}'
  },
  {
    file: 'src/screens/application/ProfileCompletionChecklistScreen.tsx',
    find: /accessibilityLabel=\{`Edit \$\{label\}`\}/g,
    replace: 'accessibilityLabel={t("accessibility.edit_item", { label: label })}'
  },
  {
    file: 'src/screens/application/SubmitProfileForApprovalScreen.tsx',
    find: /accessibilityLabel=\{`Fix: \$\{item\.label\}`\}/g,
    replace: 'accessibilityLabel={t("accessibility.fix_item", { item: t(item.label) })}'
  },
  {
    file: 'src/screens/auth/LanguageSelectionScreen.tsx',
    find: /accessibilityLabel=\{`\$\{lang\.nativeLabel\} - \$\{lang\.label\}`\}/g,
    replace: 'accessibilityLabel={t("accessibility.language_selection", { native: lang.nativeLabel, en: lang.label })}'
  },
  {
    file: 'src/screens/auth/OTPVerificationScreen.tsx',
    find: /accessibilityLabel=\{`OTP digit \$\{idx \+ 1\}`\}/g,
    replace: 'accessibilityLabel={t("accessibility.otp_digit", { digit: idx + 1 })}'
  },
  {
    file: 'src/screens/auth/PhoneLoginScreen.tsx',
    find: /accessibilityLabel=\{`\$\{item\.name\} \$\{item\.code\}`\}/g,
    replace: 'accessibilityLabel={t("accessibility.country_code", { name: item.name, code: item.code })}'
  },
  {
    file: 'src/screens/profile/GalleryPhotoManagerScreen.tsx',
    find: /accessibilityLabel=\{`Delete photo \$\{index \+ 1\}`\}/g,
    replace: 'accessibilityLabel={t("accessibility.delete_photo_num", { num: index + 1 })}'
  },
  {
    file: 'src/screens/safety/TrustedContactsScreen.tsx',
    find: /accessibilityLabel=\{`\$\{item\.name\}, \$\{item\.relationship\}`\}/g,
    replace: 'accessibilityLabel={t("accessibility.trusted_contact", { name: item.name, relationship: item.relationship })}'
  },
  {
    file: 'src/screens/sessions/ArrivalCheckInScreen.tsx',
    find: /accessibilityLabel=\{`PIN digit \$\{i \+ 1\}`\}/g,
    replace: 'accessibilityLabel={t("accessibility.pin_digit", { digit: i + 1 })}'
  },
  {
    file: 'src/screens/sessions/CustomerRatingFeedbackScreen.tsx',
    find: /accessibilityLabel=\{`Rate \$\{star\} star\$\{star > 1 \? 's' : ''\}`\}/g,
    replace: 'accessibilityLabel={t("accessibility.rate_stars", { count: star })}'
  }
];

for (let r of replacements) {
  if (fs.existsSync(r.file)) {
    let content = fs.readFileSync(r.file, 'utf-8');
    content = content.replace(r.find, r.replace);
    fs.writeFileSync(r.file, content);
    console.log(`Updated ${r.file}`);
  }
}
