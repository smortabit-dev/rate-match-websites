<template>
  <div class="min-h-screen bg-gray-50 pt-24 sm:pt-36 pb-20">
    <div class="container mx-auto px-4 sm:px-6">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl sm:text-4xl font-serif text-gray-900 mb-12 text-center">{{ t.sitemap }}</h1>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          <!-- Main Pages -->
          <div>
            <h2 class="text-lg font-serif text-gray-900 mb-6 border-b border-gray-200 pb-2 uppercase tracking-wider">{{ t.hotel }}</h2>
            <ul class="space-y-4">
              <li>
                <NuxtLink :to="localePath('/')" class="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2">
                  <span class="w-1.5 h-1.5 bg-amber-700"></span>
                  {{ t.accueil }}
                </NuxtLink>
              </li>
              <li>
                <NuxtLink :to="localePath('/faq')" class="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2">
                  <span class="w-1.5 h-1.5 bg-amber-700"></span>
                  FAQ
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Rooms -->
          <div>
            <h2 class="text-lg font-serif text-gray-900 mb-6 border-b border-gray-200 pb-2 uppercase tracking-wider">{{ t.noschambres }}</h2>
            <ul class="space-y-4">
              <li v-for="room in rooms" :key="room.id">
                <NuxtLink :to="localePath(`/rooms/${room.id}`)" class="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2">
                  <span class="w-1.5 h-1.5 bg-amber-700"></span>
                  {{ room.name || 'Room' }}
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Information -->
          <div>
            <h2 class="text-lg font-serif text-gray-900 mb-6 border-b border-gray-200 pb-2 uppercase tracking-wider">{{ t.legalinformation }}</h2>
            <ul class="space-y-4">
              <li>
                <NuxtLink :to="localePath('/legal-notice')" class="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2">
                  <span class="w-1.5 h-1.5 bg-amber-700"></span>
                  {{ t.legalnotice }}
                </NuxtLink>
              </li>
              <li>
                <NuxtLink :to="localePath('/privacy-policy')" class="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2">
                  <span class="w-1.5 h-1.5 bg-amber-700"></span>
                  {{ t.privacypolicy }}
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const { locale, localePath } = useLocale()
const { loadCatalogue, transStatic } = useTranslations()

const STATIC_KEYS = ['accueil', 'hotel', 'noschambres', 'legalinformation', 'legalnotice', 'privacypolicy', 'sitemap']
const t = ref(Object.fromEntries(STATIC_KEYS.map(k => [k, k])))
const rooms = ref([])

onMounted(async () => {
  const { fetchRooms } = useHotel()
  const [roomsData, catalogue] = await Promise.all([
    fetchRooms(locale.value),
    loadCatalogue(locale.value),
  ])
  
  rooms.value = roomsData.filter(r => !r.isBookingBasic)
  
  const translated = {}
  for (const key of STATIC_KEYS) translated[key] = transStatic(key, catalogue)
  t.value = translated
})
</script>
