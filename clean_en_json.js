const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/i18n/locales/en.json');
const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// 1. Delete hdfc_bank, savings_1234
if (json.earnings) {
  delete json.earnings.hdfc_bank;
  delete json.earnings.savings_1234;
}
if (json.settings) {
  delete json.settings.hdfc_bank;
  // delete json.settings.savings_1234; // user said BankDetailsScreen had t("content.settings.BankDetailsScreen.1234"), let's check
}

// Check "content" section
if (json.content && json.content.earnings && json.content.earnings.PayoutReviewScreen && json.content.earnings.PayoutReviewScreen.details) {
  // delete details.0.value and details.1.value
  delete json.content.earnings.PayoutReviewScreen.details['0'].value;
  delete json.content.earnings.PayoutReviewScreen.details['1'].value;
}
if (json.content && json.content.settings && json.content.settings.BankDetailsScreen) {
  delete json.content.settings.BankDetailsScreen['1234'];
}

// 2. Add accessibility.fix_missing
if (!json.accessibility) {
  json.accessibility = {};
}
json.accessibility.fix_missing = "Fix missing: {{item}}";

fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf8');
console.log('Successfully updated en.json');
