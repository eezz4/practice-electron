import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import translationEn from "./translation.en.json";
import translationKo from "./translation.ko.json";

i18next.use(initReactI18next).init({
  resources: {
    en: {
      translation: translationEn,
    },
    kr: {
      translation: translationKo,
    },
  },
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
});

export default i18next;
