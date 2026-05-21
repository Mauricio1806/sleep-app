import { useContext } from 'react';
import { LocaleContext } from '../context/LocaleContext';
import { ptBR } from './locales/pt-BR';
import { esMX } from './locales/es-MX';
import { esAR } from './locales/es-AR';
import { esCO } from './locales/es-CO';
import { esCL } from './locales/es-CL';
import { esPE } from './locales/es-PE';
import { esEC } from './locales/es-EC';
import { esVE } from './locales/es-VE';
import { esUY } from './locales/es-UY';
import { esPA } from './locales/es-PA';

const translations = {
  'pt-BR': ptBR,
  'es-MX': esMX,
  'es-AR': esAR,
  'es-CO': esCO,
  'es-CL': esCL,
  'es-PE': esPE,
  'es-EC': esEC,
  'es-VE': esVE,
  'es-UY': esUY,
  'es-PA': esPA,
};

type Locale = keyof typeof translations;

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  return path.split('.').reduce((acc: unknown, key: string) => {
    if (acc && typeof acc === 'object') {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj) as string;
}

function interpolate(str: string, params: Record<string, string | number>): string {
  return Object.entries(params).reduce((acc, [key, value]) => {
    return acc.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
  }, str);
}

export function useTranslation() {
  const { locale } = useContext(LocaleContext);
  const dict = translations[locale as Locale] ?? ptBR;

  function t(key: string, params?: Record<string, string | number>): string {
    const value = getNestedValue(dict as unknown as Record<string, unknown>, key);
    if (typeof value !== 'string') {
      return key;
    }
    if (params) {
      return interpolate(value, params);
    }
    return value;
  }

  return { t };
}
