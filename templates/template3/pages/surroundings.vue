<template>
  <div class="bg-[#f5ede3] min-h-screen">
    <TheHeader />
    <PageHero title="Surroundings" subtitle="Nearby" :image="heroImg" />

    <div class="max-w-5xl mx-auto px-6 py-16">
      <div class="text-center mb-14">
        <p class="text-[10px] uppercase tracking-[0.35em] text-[#b7825c] mb-4">Explore the Area</p>
        <h2 class="font-['Cormorant_Garamond'] text-4xl text-[#1a1410] font-light">What's Nearby</h2>
        <div class="flex items-center justify-center gap-3 mt-6">
          <div class="w-10 h-px bg-[#b7825c]"></div>
          <div class="w-2 h-2 border border-[#b7825c] rotate-45 flex-shrink-0"></div>
          <div class="w-10 h-px bg-[#b7825c]"></div>
        </div>
      </div>

      <div v-if="loading" class="flex justify-center py-20">
        <div class="w-10 h-10 border-2 border-[#b7825c] border-t-transparent rounded-full animate-spin"></div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div v-for="cat in surroundings" :key="cat.name" class="bg-white p-8">
          <h3 class="font-['Cormorant_Garamond'] text-2xl text-[#1a1410] font-light mb-2">{{ cat.name }}</h3>
          <div class="w-8 h-px bg-[#b7825c] mb-6"></div>
          <ul class="space-y-4">
            <li v-for="place in cat.places" :key="place.name" class="flex items-start justify-between gap-4">
              <div>
                <p class="text-sm text-[#1a1410] font-medium">{{ place.name }}</p>
                <p v-if="place.detail" class="text-xs text-[#1a1410]/50 mt-0.5">{{ place.detail }}</p>
              </div>
              <span v-if="place.distance" class="flex-shrink-0 text-[10px] uppercase tracking-[0.1em] text-[#b7825c] border border-[#b7825c]/30 px-2 py-0.5">
                {{ place.distance }}
              </span>
            </li>
          </ul>
        </div>
      </div>
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
const surroundings = ref([])
const loading      = ref(true)
const heroImg      = ref('')

onMounted(async () => {
  const { fetchSurroundings, fetchGallery } = useHotel()
  const [data, gallery] = await Promise.all([fetchSurroundings(locale.value), fetchGallery()])
  surroundings.value = data || []
  heroImg.value = gallery[5]?.url || gallery[0]?.url || ''
  loading.value = false
})
</script>
