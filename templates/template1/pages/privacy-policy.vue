<template>
  <div class="min-h-screen bg-gray-50 pt-24 sm:pt-36">
    <div class="container mx-auto px-4 sm:px-6 py-10 sm:py-16 max-w-3xl">
      <div v-if="content" class="prose prose-gray max-w-none text-sm text-gray-600 leading-relaxed space-y-8"
           v-html="content"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const { locale } = useLocale()
const { loadCatalogue, trans, transStatic, ETAB_ID } = useTranslations()

const STATIC_KEYS = ['privacypolicy']
const t = ref(Object.fromEntries(STATIC_KEYS.map(k => [k, k])))
const content = ref('')

onMounted(async () => {
  const { fetchHotelInfo } = useHotel()
  const [hotelInfo, catalogue] = await Promise.all([
    fetchHotelInfo(),
    loadCatalogue(locale.value),
  ])

  const translated = {}
  for (const key of STATIC_KEYS) translated[key] = transStatic(key, catalogue)
  t.value = translated

  const email = Array.isArray(hotelInfo.emails) ? hotelInfo.emails[0] : (hotelInfo.emails || '')

  content.value = trans('confidentialite', {
    '%val1%': (hotelInfo.name || '').replace(/\b\w/g, c => c.toUpperCase()),
    '%val2%': hotelInfo.address || '',
    '%val3%': hotelInfo.postalCode || '',
    '%val4%': hotelInfo.city || '',
    '%val5%': hotelInfo.country || '',
    '%val6%': email,
  }, `${ETAB_ID}_static`, catalogue)
})
</script>
