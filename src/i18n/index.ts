import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';

const resources = {
  en: {
    translation: en,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    parseMissingKeyHandler: () => '',
    returnEmptyString: false,
  });

export default i18n;
