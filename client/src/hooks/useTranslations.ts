import useAppStore from "store/useStore";
import { en } from "translations/en";
import { he } from "translations/he";


const translations = {
    en: en,
    he: he,
};

export const useTranslations = () => {
  const language = useAppStore((state) => state.language);
  return translations[language];
}; 