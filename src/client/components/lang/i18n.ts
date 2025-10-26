import { createI18n } from "vue-i18n";
import en from "./en.json";
import hu from "./hun.json";

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem("lang") || "en-US",
  fallbackLocale: "en-US",
  messages: {
    "en": en,
    "hu": hu,
  },
});


export default i18n;
