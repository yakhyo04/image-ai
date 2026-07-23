import { en, type Dict } from "./dictionaries/en";
import { uz } from "./dictionaries/uz";
import { ru } from "./dictionaries/ru";
import type { Locale } from "./config";

export type { Dict };

const DICTS: Record<Locale, Dict> = { en, uz, ru };

export function getDictionary(locale: Locale): Dict {
  return DICTS[locale] ?? en;
}
