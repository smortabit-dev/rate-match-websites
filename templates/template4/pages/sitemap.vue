<template>
  <div class="template4-root min-h-screen bg-slate-50 pt-20">
    <!-- Return Bar -->
    <div class="bg-[#002B5B] w-full sticky top-0 z-20">
      <div class="container mx-auto px-6 py-4">
        <NuxtLink :to="localePath('/') + '#footer'" class="inline-flex items-center text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:text-blue-400 transition-colors">
          <Icon name="mdi:arrow-left" class="mr-3 text-lg" />
          {{ t.retour }}
        </NuxtLink>
      </div>
    </div>

    <!-- Content -->
    <div class="container mx-auto px-6 py-12 sm:py-20 max-w-5xl">
      <h1 class="section-title text-[#002B5B] mb-16 text-center">{{ t.plandesite }}</h1>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        <!-- Main Sections -->
        <div>
          <h2 class="text-xl font-serif text-[#002B5B] font-bold mb-6 border-b-2 border-blue-100 pb-2 uppercase tracking-wider">{{ t.hotel }}</h2>
          <ul class="space-y-4">
            <li>
              <NuxtLink :to="localePath('/')" class="text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-3">
                <div class="w-2 h-2 rounded-full bg-blue-400"></div>
                {{ t.accueil }}
              </NuxtLink>
            </li>
            <li v-for="link in homeLinks" :key="link.id">
              <NuxtLink :to="localePath('/') + link.id" class="text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-3">
                <div class="w-2 h-2 rounded-full bg-blue-400"></div>
                {{ link.name }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink :to="localePath('/faq')" class="text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-3">
                <div class="w-2 h-2 rounded-full bg-blue-400"></div>
                {{ t.faq2 }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Rooms List -->
        <div>
          <h2 class="text-xl font-serif text-[#002B5B] font-bold mb-6 border-b-2 border-blue-100 pb-2 uppercase tracking-wider">{{ t.noschambres }}</h2>
          <ul class="space-y-4">
            <li v-for="room in rooms" :key="room.id">
              <NuxtLink :to="localePath(`/rooms/${room.id}`)" class="text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-3">
                <div class="w-2 h-2 rounded-full bg-blue-400"></div>
                {{ room.name }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Information -->
        <div>
          <h2 class="text-xl font-serif text-[#002B5B] font-bold mb-6 border-b-2 border-blue-100 pb-2 uppercase tracking-wider">{{ t.legalinformation }}</h2>
          <ul class="space-y-4">
            <li>
              <NuxtLink :to="localePath('/privacy-policy')" class="text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-3">
                <div class="w-2 h-2 rounded-full bg-blue-400"></div>
                {{ t.politiquedeconfidentialite }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink :to="localePath('/legal-notice')" class="text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-3">
                <div class="w-2 h-2 rounded-full bg-blue-400"></div>
                {{ t.conditionsgenerales }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const { locale, localePath } = useLocale()
const { loadCatalogue, transStatic } = useTranslations()

const STATIC_KEYS = [
  'accueil', 'hotel', 'faq2', 'noschambres', 'nosservices', 'facilities', 
  'galerie', 'propertysurroundings', 'customerscomments', 'contact',
  'legalinformation', 'conditionsgenerales', 'politiquedeconfidentialite', 'plandesite', 'retour'
]

const t = ref(Object.fromEntries(STATIC_KEYS.map(k => [k, k])))
const rooms = ref([])

const homeLinks = computed(() => [
  { id: '#rooms', name: t.value.noschambres },
  { id: '#services', name: t.value.nosservices },
  { id: '#amenities', name: t.value.facilities },
  { id: '#gallery', name: t.value.galerie },
  { id: '#surroundings', name: t.value.propertysurroundings },
  { id: '#testimonials', name: t.value.customerscomments },
  { id: '#contact', name: t.value.contact },
])

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

<style scoped>
.template4-root {
  font-family: 'Outfit', sans-serif;
}
.font-serif {
  font-family: 'Playfair Display', serif;
}
.section-title {
  @apply font-serif text-3xl sm:text-4xl font-bold mb-6;
}
</style>
