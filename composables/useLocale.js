// Detect browser language (e.g. 'fr-FR' → 'fr'), fallback to 'en'
const getBrowserLocale = () => {
  if (typeof navigator === 'undefined') return 'en'
  const lang = (navigator.language || navigator.userLanguage || 'en').slice(0, 2).toLowerCase()
  return /^[a-z]{2}$/.test(lang) ? lang : 'en'
}

const DEFAULT_LOCALE = getBrowserLocale()

// Accept any valid 2-letter language code (dynamic from API)
const isLangCode = (s) => typeof s === 'string' && /^[a-z]{2}$/.test(s)

export const useLocale = () => {
  const route = useRoute()

  // Read locale from route param (reactive — updates when route changes)
  const locale = computed(() => {
    const param = route.params.locale
    return isLangCode(param) ? param : DEFAULT_LOCALE
  })

  // Helper to check if a locale string is valid
  const isValidLocale = (loc) => isLangCode(loc)

  // Helper to build a locale-prefixed path
  // e.g. localePath('/rooms/deluxe-suite') => '/fr/rooms/deluxe-suite'
  const localePath = (path) => {
    const cleanPath = path.startsWith('/') ? path : `/${path}`
    return `/${locale.value}${cleanPath}`
  }

  // Helper to switch locale (returns new full path with different locale)
  const switchLocalePath = (newLocale) => {
    if (!isValidLocale(newLocale)) return route.fullPath
    const currentLocale = route.params.locale
    if (currentLocale) {
      return route.fullPath.replace(`/${currentLocale}`, `/${newLocale}`)
    }
    return `/${newLocale}${route.fullPath}`
  }

  // Direction for RTL support (Arabic, Hebrew)
  const dir = computed(() => ['ar', 'he'].includes(locale.value) ? 'rtl' : 'ltr')

  return {
    locale,
    dir,
    isValidLocale,
    localePath,
    switchLocalePath,
    DEFAULT_LOCALE,
  }
}
