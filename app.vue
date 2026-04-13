<template>
  <div>
    <NuxtLayout>
      <NuxtPage :page-key="route => route.fullPath" />
    </NuxtLayout>

    <TemplateSwitcher v-if="showTemplateSwitcher" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const showTemplateSwitcher = ref(true)

const { dir, locale } = useLocale()
const { fetchHotelInfo, fetchHotelData } = useHotel()
const { loadCatalogue } = useTranslations()

// Pre-fetch data once at the root level to ensure it's available for all components
const { data: ready } = await useAsyncData('init-data', async () => {
  await Promise.all([
    fetchHotelInfo(),
    fetchHotelData(), // Prefetch raw data as well
    loadCatalogue(locale.value)
  ])
  return true
}, { watch: [locale] })

const hotelInfo = useState('hotel-info')

useHead({
  htmlAttrs: { dir },
  title: computed(() => hotelInfo.value?.name
    ? `${hotelInfo.value.name} | Site Officiel`
    : 'Site Officiel'
  ),
  link: computed(() => hotelInfo.value?.logo
    ? [{ rel: 'icon', type: 'image/png', href: hotelInfo.value.logo }]
    : []
  ),
})
</script>
