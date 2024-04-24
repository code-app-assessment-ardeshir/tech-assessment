import { t } from "../src/services/translation"

jest.mock('../src/locales/en.json', () => ({
  POSTAGE_REQUIRED: "POSTAGE REQUIRED",
  }), { virtual: true })
  
  jest.mock('../src/locales/nl.json', () => ({
    POSTAGE_REQUIRED: "PORT VEREIST",
  }), { virtual: true })
  
describe('Translation functionality', () => {
  it('should retrieve the correct English translation', () => {
    const key = 'POSTAGE_REQUIRED'
    const translation = t(key, 'en')
    expect(translation).toBe('POSTAGE REQUIRED')
  })

  it('should retrieve the correct Dutch translation', () => {
    const key = 'POSTAGE_REQUIRED'
    const translation = t(key, 'nl')
    expect(translation).toBe('PORT VEREIST')
  })

  it('should fall back to English translation if language is not supported', () => {
    const key = 'POSTAGE_REQUIRED'
    const translation = t(key, 'es')
    expect(translation).toBe('POSTAGE REQUIRED')
  })

  it('should fall back to the key if translation is missing', () => {
    const key = 'none_existing_key' as any
    const translation = t(key, 'en')
    expect(translation).toBe(key)
  })
})
