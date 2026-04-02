<template>
  <div class="bg-white min-h-screen">
    <PageHero title="Dining" :image="diningImage" />
    <div class="max-w-7xl mx-auto px-6 py-16">
      <div v-if="loaded" class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div>
          <img v-if="diningImage" :src="diningImage" :alt="diningName" class="w-full aspect-[4/3] object-cover" />
          <div v-else class="aspect-[4/3] bg-[#141414] animate-pulse"></div>
        </div>
        <div class="space-y-6">
          <h2 class="font-['Cormorant_Garamond'] text-4xl text-white font-light">{{ diningName }}</h2>
          <div class="w-10 h-px bg-[#C9A96E]"></div>
          <p class="text-white/60 leading-relaxed">{{ diningDesc }}</p>
          <div v-if="hours" class="border-t border-white/10 pt-6">
            <p class="text-[9px] uppercase tracking-[0.25em] text-[#C9A96E] mb-3">Opening Hours</p>
            <p class="text-white/60 text-sm">{{ hours }}</p>
          </div>
          <NuxtLink :to="localePath('/contact')"
            class="inline-block px-8 py-4 border border-[#C9A96E] text-[#C9A96E] text-[11px] uppercase tracking-[0.2em] hover:bg-[#C9A96E] hover:text-[#0A0A0A] transition-all">
            Reserve a Table
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const { localePath } = useLocale()
const HOSTE = 'https://rate.picscache.com/images/11232/upload/1024X680/'
const diningName = ref('Fine Dining'); const diningDesc = ref(''); const diningImage = ref(''); const hours = ref(''); const loaded = ref(false)

onMounted(async () => {
  const { fetchHotelData } = useHotel()
  const hotelData = await fetchHotelData()
  const etab = hotelData?.etablissment || {}
  diningName.value  = etab.restoNom || etab.restoNomEn || 'Fine Dining'
  diningDesc.value  = etab.restoDescEn || etab.restoDesc || etab.restoDescription || 'Discover exceptional gastronomy crafted with the finest local ingredients.'
  const img = etab.restoImg || etab.restoImage || ''
  diningImage.value = img ? `${HOSTE}${img}` : ''
  hours.value = etab.restoHours || etab.restoHoraire || ''
  loaded.value = true
})
</script>
