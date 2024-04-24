import fs from 'fs'
import path from 'path'
import translations from '../locales/en.json';

export type TranslationKeys = keyof typeof translations;

type Translations = {
  [key: string]: string
}

const translationsCache: { [lang: string]: Translations } = {}

export function loadTranslations(language: string): Translations {
  if (translationsCache[language]) {
    return translationsCache[language]
  }

  const filePath = path.join(__dirname, `../locales/${language}.json`)
  let fileContents
  try {
    fileContents = fs.readFileSync(filePath, 'utf8') // for larger files better to use async readFile
  } catch (error) {
    fileContents = fs.readFileSync(path.join(__dirname, '../locales/en.json'), 'utf8')
  }
  const translations: Translations = JSON.parse(fileContents)
  translationsCache[language] = translations

  return translations
}

export function t(key: TranslationKeys, language = 'en'): string {
  const translations = loadTranslations(language)
  return translations[key] || key
}
