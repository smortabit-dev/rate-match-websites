<template>
  <footer id="footer" class="bg-[#002B5B] text-white pb-10">
    <div class="container mx-auto px-6">
      <!-- Bottom Bar -->
      <div class="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-blue-100/50">
        <p>&copy; {{ new Date().getFullYear() }} {{ info.name }}. All rights reserved.</p>
        <div class="flex space-x-6 text-xs uppercase tracking-widest">
          <NuxtLink :to="localePath('/privacy-policy')" class="hover:text-white">{{ t.politiquedeconfidentialite }}</NuxtLink>
          <NuxtLink :to="localePath('/legal-notice')" class="hover:text-white">{{ t.mentionslegales }}</NuxtLink>
          <NuxtLink :to="localePath('/sitemap')" class="hover:text-white">{{ t.plandesite }}</NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const info = ref({ name: '', logo: null, address: '', phone: '', email: '' })
const { locale, localePath } = useLocale()
const { loadCatalogue, transStatic } = useTranslations()

const STATIC_KEYS = ['politiquedeconfidentialite', 'mentionslegales', 'plandesite']
const t = ref(Object.fromEntries(STATIC_KEYS.map(k => [k, k])))

onMounted(async () => {
  const { fetchHotelInfo } = useHotel()
  const [hotelInfo, catalogue] = await Promise.all([
    fetchHotelInfo(),
    loadCatalogue(locale.value)
  ])
  
  info.value = hotelInfo
  
  const translated = {}
  for (const key of STATIC_KEYS) {
    translated[key] = transStatic(key, catalogue)
  }
  t.value = translated
})
</script>
