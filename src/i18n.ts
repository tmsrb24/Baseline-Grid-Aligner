import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
import translationEN from './locales/en/translation.json';
import translationCS from './locales/cs/translation.json';

// the translations
const resources = {
  en: {
    translation: translationEN
  },
  cs: {
    translation: translationCS
  }
};

// Get user's preferred language from localStorage or browser settings
const getUserLanguage = (): string => {
  const savedLanguage = localStorage.getItem('language');
  if (savedLanguage) {
    return savedLanguage;
  }
  
  // Get browser language
  const browserLang = navigator.language.split('-')[0];
  return Object.keys(resources).includes(browserLang) ? browserLang : 'en';
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: getUserLanguage(),
    fallbackLng: 'en',
    
    interpolation: {
      escapeValue: false // react already safes from xss
    },
    
    react: {
      useSuspense: true
    }
  });

export default i18n;
