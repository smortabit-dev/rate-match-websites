// Global shared currency state — persisted in cookies to survive page reloads
export const useCurrency = () => {
  return useCookie('selectedCurrency', {
    default: () => 'EUR',
    watch: true,
    maxAge: 60 * 60 * 24 * 365 // 1 year
  })
}
