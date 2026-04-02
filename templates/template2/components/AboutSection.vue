<template>
  <section id="about" class="bg-white py-24 px-6">
    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch">

        <!-- Image column -->
        <div class="relative overflow-hidden">
          <!-- Main photo -->
          <div class="h-full min-h-[520px] overflow-hidden">
            <img v-if="photo" :src="photo" :alt="hotelName"
              class="w-full h-full object-cover transition-transform duration-700 hover:scale-105" loading="lazy" />
            <div v-else class="w-full h-full bg-[#F0F0F0] animate-pulse"></div>
          </div>

          <!-- Floating stat card -->
          <div class="absolute bottom-8 right-0 translate-x-0 bg-white px-8 py-6 shadow-sm">
            <p class="text-[10px] uppercase tracking-[0.3em] text-[#C9A96E] mb-1">Est.</p>
            <p class="font-['Cormorant_Garamond'] text-4xl text-[#111] font-light">{{ founded }}</p>
          </div>
        </div>

        <!-- Text column -->
        <div class="flex flex-col justify-center lg:pl-20 pt-12 lg:pt-0">
          <p class="text-[10px] uppercase tracking-[0.3em] text-[#C9A96E] mb-5">Welcome</p>

          <h2 class="font-['Cormorant_Garamond'] text-4xl sm:text-5xl text-[#111] font-light leading-tight mb-6">
            {{ hotelName }}
          </h2>

          <div class="w-10 h-px bg-[#C9A96E] mb-8"></div>

          <div class="text-[#111]/55 text-sm leading-relaxed mb-10" v-html="description"></div>

          <!-- Key highlights -->
          <div class="grid grid-cols-3 gap-6 mb-10 border-t border-[#111]/8 pt-10">
            <div v-for="stat in stats" :key="stat.label" class="text-center">
              <p class="font-['Cormorant_Garamond'] text-3xl text-[#111] font-light mb-1">{{ stat.value }}</p>
              <p class="text-[10px] uppercase tracking-[0.2em] text-[#111]/40">{{ stat.label }}</p>
            </div>
          </div>

          <div class="flex items-center gap-8">
            <NuxtLink :to="localePath('/contact')"
              class="px-8 py-3.5 bg-[#111] text-white text-[10px] uppercase tracking-[0.25em] hover:bg-[#333] transition-all">
              Contact Us
            </NuxtLink>
            <NuxtLink :to="localePath('/facilities')"
              class="text-[#111] text-[10px] uppercase tracking-[0.2em] border-b border-[#111]/30 pb-0.5 hover:text-[#C9A96E] hover:border-[#C9A96E] transition-colors">
              Our Facilities
            </NuxtLink>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const { localePath } = useLocale()

const hotelName   = ref('')
const description = ref('')
const photo       = ref('')
const roomCount   = ref(0)
const starRating  = ref(0)
const city        = ref('')
const founded     = ref('')

const stats = computed(() => [
  { value: starRating.value ? '★'.repeat(starRating.value) : '★★★★★', label: 'Rating' },
  { value: roomCount.value || '—', label: 'Rooms' },
  { value: city.value || '—', label: 'Location' },
])

onMounted(async () => {
  const { fetchGallery, fetchHotelData, fetchHotelInfo } = useHotel()
  const { loadCatalogue, trans, ETAB_ID } = useTranslations()

  const { locale } = useLocale()
  const [info, hotelData, gallery, catalogue] = await Promise.all([
    fetchHotelInfo(),
    fetchHotelData(),
    fetchGallery(),
    loadCatalogue(locale.value),
  ])

  hotelName.value = info.name || ''
  city.value      = info.city || info.address || ''
  starRating.value = parseInt(info.stars || info.starRating || info.etoiles || 5) || 5

  const etab = hotelData?.etablissment || {}
  roomCount.value = etab.nombreChambres || etab.roomCount || etab.nbChambres || ''
  founded.value   = etab.founded || etab.anneeCreation || etab.yearFounded || new Date().getFullYear()

  // pageDesc: same as template 1
  const rawDesc = trans('61402-description', {}, `${ETAB_ID}_Page`, catalogue, '')
  const tmp = document.createElement('div')
  tmp.innerHTML = rawDesc
  description.value = tmp.innerHTML

  photo.value = gallery[2]?.url || gallery[1]?.url || gallery[0]?.url || ''
})
</script>
