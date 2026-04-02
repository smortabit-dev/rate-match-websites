<template>
  <div class="bg-[#f5ede3] min-h-screen">
    <TheHeader />
    <PageHero title="Facilities" subtitle="Amenities" :image="heroImg" />

    <div class="max-w-7xl mx-auto px-6 py-16">
      <div v-if="loading" class="flex justify-center py-20">
        <div class="w-10 h-10 border-2 border-[#b7825c] border-t-transparent rounded-full animate-spin"></div>
      </div>

      <div v-else-if="categories.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        <div v-for="cat in categories" :key="cat.name">
          <div class="flex items-center gap-3 mb-6">
            <Icon :name="cat.icon || 'mdi:check-circle-outline'" class="text-[#b7825c] text-xl" />
            <h3 class="font-['Cormorant_Garamond'] text-xl text-[#1a1410] font-light tracking-wide">{{ cat.name }}</h3>
          </div>
          <div class="w-8 h-px bg-[#b7825c] mb-6"></div>
          <ul class="space-y-3">
            <li v-for="item in cat.items" :key="item" class="flex items-start gap-3 text-sm text-[#1a1410]/70">
              <Icon name="mdi:check" class="text-[#b7825c] text-sm flex-shrink-0 mt-0.5" />
              {{ item }}
            </li>
          </ul>
        </div>
      </div>

      <div v-else class="text-center py-20 text-[#1a1410]/40 text-sm">No facilities found.</div>
    </div>

    <TheFooter />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import TheHeader from '../components/TheHeader.vue'
import TheFooter from '../components/TheFooter.vue'
import PageHero  from '../components/PageHero.vue'

const { locale } = useLocale()
const categories = ref([])
const loading    = ref(true)
const heroImg    = ref('')

onMounted(async () => {
  const { fetchRooms, fetchGallery } = useHotel()
  const [rooms, gallery] = await Promise.all([fetchRooms(locale.value), fetchGallery()])
  heroImg.value = gallery[4]?.url || gallery[0]?.url || ''
  // Aggregate all unique amenity categories from all rooms
  const catMap = {}
  for (const room of rooms) {
    for (const cat of (room.amenitiesCategories || [])) {
      if (!catMap[cat.name]) catMap[cat.name] = { name: cat.name, icon: cat.icon, items: new Set() }
      cat.items.forEach(i => catMap[cat.name].items.add(i))
    }
  }
  categories.value = Object.values(catMap).map(c => ({ ...c, items: [...c.items] }))
  loading.value = false
})
</script>
