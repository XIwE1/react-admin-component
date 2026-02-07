import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import defaultNs from './locales/default';
import enUS from './locales/en-US';

const LANG_ZH_CN = 'zh-CN';
const LANG_EN_US = 'en-US';

i18n.use(initReactI18next).init({
  resources: {
    [LANG_ZH_CN]: defaultNs,
    [LANG_EN_US]: enUS,
  },
  lng: LANG_ZH_CN,
  fallbackLng: LANG_ZH_CN,
  defaultNS: 'common',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
