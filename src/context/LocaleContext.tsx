import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Region, UserSettings } from '../types';

const LOCALE_KEY = '@sleepapp:user_selected_locale';

type LocaleValue = UserSettings['language'];

interface LocaleContextType {
  locale: LocaleValue;
  region: Region;
  setLocale: (locale: LocaleValue) => Promise<void>;
}

const localeToRegion: Record<LocaleValue, Region> = {
  'pt-BR': 'BR',
  'es-MX': 'MX',
  'es-AR': 'AR',
  'es-CO': 'CO',
  'es-CL': 'CL',
  'es-PE': 'PE',
  'es-EC': 'EC',
  'es-VE': 'VE',
  'es-UY': 'UY',
  'es-PA': 'PA',
};

const VALID_LOCALES = new Set<string>(Object.keys(localeToRegion));

export const LocaleContext = createContext<LocaleContextType>({
  locale: 'pt-BR',
  region: 'BR',
  setLocale: async () => {},
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<LocaleValue>('pt-BR');

  useEffect(() => {
    AsyncStorage.getItem(LOCALE_KEY).then(saved => {
      if (saved && VALID_LOCALES.has(saved)) {
        setLocaleState(saved as LocaleValue);
      }
    });
  }, []);

  async function setLocale(newLocale: LocaleValue) {
    setLocaleState(newLocale);
    await AsyncStorage.setItem(LOCALE_KEY, newLocale);
  }

  return (
    <LocaleContext.Provider value={{ locale, region: localeToRegion[locale], setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}
