import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import translationEn from "./locales/en/EnTranslation.json";
import translationFr from "./locales/fr/FrTranslation.json";

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
<<<<<<< HEAD
    supportedLngs: ["en", "fr"],
=======
    supportedLngs: ["fr", "en"],
>>>>>>> raj_appideas
    resources: {
      en: {
        translation: translationEn,
      },
      fr: {
        translation: translationFr,
      },
    },
<<<<<<< HEAD
    fallbackLng: "en",
=======
    fallbackLng: "fr",
>>>>>>> raj_appideas
    detection: { order: ["path", "cookie", "htmlTag"], caches: ["cookie"] },
    react: { useSuspense: true },
    backend: {
      loadPath: "./locales/{{lng}}/translation.json",
    },
  });
