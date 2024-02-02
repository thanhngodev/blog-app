import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from './assets/locales/en.json';
import viTranslation from './assets/locales/vi.json';

const resources = {
    en: {
        translation: enTranslation,
    },
    vi: {
        translation: viTranslation,
    },
};

i18n.use(initReactI18next).init({
    resources,
    lng: 'vi',
    keySeparator: false,
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;