<template>
  <section id="dining" class="bg-[#F5F5F5] py-24 px-6">
    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <!-- Image -->
        <div v-if="diningImage" class="relative aspect-[4/3] overflow-hidden">
          <img :src="diningImage" :alt="diningName" class="w-full h-full object-cover" loading="lazy" />
          <div class="absolute inset-0 bg-black/10"></div>
        </div>
        <div v-else class="aspect-[4/3] bg-gray-200 animate-pulse"></div>

        <!-- Text -->
        <div>
          <p class="text-[10px] uppercase tracking-[0.3em] text-[#C9A96E] mb-4">Gastronomy</p>
          <h2 class="font-['Cormorant_Garamond'] text-4xl sm:text-5xl text-[#111] font-light mb-6">{{ diningName }}</h2>
          <div class="w-10 h-px bg-[#C9A96E] mb-6"></div>
          <p class="text-gray-500 text-sm leading-relaxed mb-8">{{ diningDesc }}</p>
          <NuxtLink :to="localePath('/dining')"
            class="inline-block px-8 py-3.5 border border-[#111] text-[#111] text-[11px] uppercase tracking-[0.2em] hover:bg-[#111] hover:text-white transition-all">
            Discover More
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const { locale, localePath } = useLocale()
const diningName  = ref('Fine Dining')
const diningDesc  = ref('')
const diningImage = ref('')
const HOSTE = 'https://rate.picscache.com/images/11232/upload/'

onMounted(async () => {
  const { fetchHotelData } = useHotel()
  const hotelData = await fetchHotelData()
  const etab = hotelData?.etablissment || {}
  diningName.value  = etab.restoNom || etab.restoNomEn || 'Fine Dining'
  diningDesc.value  = etab.restoDescEn || etab.restoDesc || etab.restoDescription || ''
  const img = etab.restoImg || etab.restoImage || ''
  diningImage.value = img ? `${HOSTE}1024X680/${img}` : ''
})
</script>
