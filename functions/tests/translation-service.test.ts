import { t } from "../src/services/translation"

jest.mock('../src/locales/en.json', () => ({
    postage_required: "POSTAGE REQUIRED",
    // ... other strings
  }), { virtual: true })
  
  jest.mock('../src/locales/fr.json', () => ({
    postage_required: "AFFRANCHISSEMENT NÉCESSAIRE",
    // ... other strings
  }), { virtual: true })
  
describe('Translation functionality', () => {
  it('should retrieve the correct English translation', () => {
    const key = 'postage_required'
    const translation = t(key, 'en')
    expect(translation).toBe('POSTAGE REQUIRED')
  })

  it('should retrieve the correct French translation', () => {
    const key = 'postage_required'
    const translation = t(key, 'fr')
    expect(translation).toBe('AFFRANCHISSEMENT NÉCESSAIRE')
  })

  it('should fall back to English translation if language is not supported', () => {
    const key = 'postage_required'
    const translation = t(key, 'es') // Assume Spanish is not supported
    expect(translation).toBe('POSTAGE REQUIRED')
  })

  it('should fall back to the key if translation is missing', () => {
    const key = 'non_existent_key'
    const translation = t(key, 'en')
    expect(translation).toBe(key)
  })
})
