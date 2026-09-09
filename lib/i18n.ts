import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const locales = ['en', 'mr'] as const;
export const defaultLocale = 'en' as const;

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;
  if (!locale || !locales.includes(locale as typeof locales[number])) notFound();

  return {
    locale: locale as string,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});