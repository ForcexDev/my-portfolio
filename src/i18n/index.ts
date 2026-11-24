import es from "./es.json";
import en from "./en.json";

export type Language = "es" | "en";
const dictionaries: Record<Language, Record<string, string | string[]>> = {
  es,
  en,
};
export const translate = (lang: Language) => (key: string) =>
  String(dictionaries[lang][key] ?? key);
export const base = import.meta.env.BASE_URL.replace(/\/$/, "") + "/";
