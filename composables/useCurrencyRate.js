// Cache: key = "FROM_TO" → rate number
const rateCache = {}

/**
 * Returns a reactive tauxConversion rate from etabCurrency → selectedCurrency.
 * Fetches once per currency pair and caches the result.
 *
 * @param {Ref<string>|string} etabCurrency  - Hotel's base currency (e.g. 'EUR')
 * @param {Ref<string>|string} targetCurrency - Desired display currency (e.g. 'MAD')
 * @returns {{ rate: Ref<number>, loading: Ref<boolean> }}
 */
export const useCurrencyRate = (etabCurrency, targetCurrency) => {
  const rate    = ref(1)
  const loading = ref(false)

  const fetchRate = async () => {
    const from = isRef(etabCurrency)    ? etabCurrency.value    : etabCurrency
    const to   = isRef(targetCurrency)  ? targetCurrency.value  : targetCurrency

    if (!from || !to || from === to) { rate.value = 1; return }

    const key = `${from}_${to}`
    if (rateCache[key] !== undefined) { rate.value = rateCache[key]; return }

    loading.value = true
    try {
      const res  = await $fetch(
        `https://aws.checkprice.rate-match.com/internal/taux?etabCurrency=${from}&currency=${to}`
      )
      const taux = res?.response ?? 1
      rateCache[key] = taux
      rate.value = taux
    } catch {
      rate.value = 1
    } finally {
      loading.value = false
    }
  }

  // Re-fetch when targetCurrency changes
  if (isRef(targetCurrency)) {
    watch(targetCurrency, fetchRate, { immediate: true })
  } else {
    fetchRate()
  }

  return { rate, loading }
}
