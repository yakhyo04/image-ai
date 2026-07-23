import "server-only";
import { cookies } from "next/headers";
import { LOCALE_COOKIE, resolveLocale, type Locale } from "./config";
import { getDictionary, type Dict } from "./index";

// Reads the chosen locale from the cookie. Use in server components / layouts.
export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  return resolveLocale(store.get(LOCALE_COOKIE)?.value);
}

// Convenience: the dictionary for the current request's locale.
export async function getDict(): Promise<Dict> {
  return getDictionary(await getLocale());
}
