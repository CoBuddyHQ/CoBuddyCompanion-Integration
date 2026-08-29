const fs = require('fs');
let txt = fs.readFileSync('src/i18n/locales/en.json', 'utf8');
txt = txt.replace(
  /"minimum_session_rate_is_u20b9800_per_hou":.*/,
  '"rate_too_low": "Minimum session rate is ₹{{min}} per hour.",'
);
txt = txt.replace(
  /"maximum_session_rate_is_u20b910_000_per_":.*/,
  '"rate_too_high": "Maximum session rate is ₹{{max}} per hour.",'
);
fs.writeFileSync('src/i18n/locales/en.json', txt, { encoding: 'utf8' });
