import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend, { type HttpBackendOptions } from "i18next-http-backend";
import config from "./utils/config";
i18n
  .use(initReactI18next)
  .use(HttpBackend)
  .init<HttpBackendOptions>({
    lng: config.lang,
    fallbackLng: "ja",
    debug: config.debug,
    nsSeparator: "::",
  });
export default i18n;
