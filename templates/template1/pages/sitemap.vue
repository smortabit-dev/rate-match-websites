<template>
  <div class="min-h-screen bg-gray-50 pt-14 sm:pt-14">
    <!-- Return Bar -->
    <div class="bg-[#5c544d] w-full">
      <div class="container mx-auto px-4 sm:px-6 py-4">
        <NuxtLink :to="localePath('/') + '#footer'" class="inline-flex items-center text-white text-[11px] font-bold uppercase tracking-[0.15em] hover:text-[#d4af37] transition-colors">
          <Icon name="mdi:arrow-left" class="mr-3 text-lg" />
          {{ t.retour }}
        </NuxtLink>
      </div>
    </div>
    <div class="container mx-auto px-4 sm:px-6">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl sm:text-4xl font-serif text-gray-900 mb-12 text-center">{{ t.plandesite }}</h1>

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
                <NuxtLink :to="localePath('/') + '#rooms'" class="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2">
                  <span class="w-1.5 h-1.5 bg-amber-700"></span>
                  {{ t.noschambres }}
                </NuxtLink>
              </li>
              <li>
                <NuxtLink :to="localePath('/') + '#testimonials'" class="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2">
                  <span class="w-1.5 h-1.5 bg-amber-700"></span>
                  {{ t.customerscomments }}
                </NuxtLink>
              </li>
              <li>
                <NuxtLink :to="localePath('/') + '#services'" class="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2">
                  <span class="w-1.5 h-1.5 bg-amber-700"></span>
                  {{ t.nosservices }}
                </NuxtLink>
              </li>
              <li>
                <NuxtLink :to="localePath('/') + '#amenities'" class="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2">
                  <span class="w-1.5 h-1.5 bg-amber-700"></span>
                  {{ t.facilities }}
                </NuxtLink>
              </li>
              <li>
                <NuxtLink :to="localePath('/') + '#galerie'" class="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2">
                  <span class="w-1.5 h-1.5 bg-amber-700"></span>
                  {{ t.galerie }}
                </NuxtLink>
              </li>
              <li>
                <NuxtLink :to="localePath('/') + '#alentours'" class="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2">
                  <span class="w-1.5 h-1.5 bg-amber-700"></span>
                  {{ t.propertysurroundings }}
                </NuxtLink>
              </li>
              <li>
                <NuxtLink :to="localePath('/') + '#contact'" class="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2">
                  <span class="w-1.5 h-1.5 bg-amber-700"></span>
                  {{ t.contact }}
                </NuxtLink>
              </li>
              <li>
                <NuxtLink :to="localePath('/faq')" class="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2">
                  <span class="w-1.5 h-1.5 bg-amber-700"></span>
                  {{ t.faq2 }}
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
                <NuxtLink :to="localePath('/privacy-policy')" class="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2">
                  <span class="w-1.5 h-1.5 bg-amber-700"></span>
                  {{ t.politiquedeconfidentialite }}
                </NuxtLink>
              </li>
              <li>
                <NuxtLink :to="localePath('/legal-notice')" class="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2">
                  <span class="w-1.5 h-1.5 bg-amber-700"></span>
                  {{ t.conditionsgenerales }}
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

const STATIC_KEYS = [
  'accueil', 'hotel', 'faq2', 'noschambres', 'nosservices', 'facilities', 
  'galerie', 'propertysurroundings', 'customerscomments', 'contact',
  'legalinformation', 'conditionsgenerales', 'politiquedeconfidentialite', 'plandesite', 'retour'
]
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
