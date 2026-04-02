<template>
  <section class="relative h-screen min-h-[600px] overflow-hidden bg-[#1a1410]">
    <!-- Background image -->
    <transition name="t3-hero-fade">
      <img v-if="bgImage" :src="bgImage" alt="Hero"
        class="absolute inset-0 w-full h-full object-cover" />
    </transition>

    <!-- Gradient: dark band at top (for header readability) -->
    <div class="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black/60 to-transparent"></div>
    <!-- Subtle gradient at bottom-left for text readability -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
    <div class="absolute bottom-0 left-0 w-2/3 h-2/3 bg-gradient-to-tr from-black/40 to-transparent pointer-events-none"></div>

    <!-- Bottom-left: hotel name + meta info -->
    <div class="absolute bottom-0 left-0 px-8 sm:px-12 pb-10 sm:pb-14 z-10 max-w-lg">
      <h1 class="font-['Cormorant_Garamond'] text-5xl sm:text-6xl lg:text-7xl text-white font-light leading-none mb-2">
        {{ hotelName }}
      </h1>
      <p class="text-white/70 text-sm sm:text-base font-light mb-2">{{ subtitle }}</p>
      <p v-if="city" class="text-white/50 text-xs sm:text-sm tracking-[0.08em] mb-4">{{ city }}</p>

      <!-- Stars -->
      <div class="flex items-center gap-1 mb-5">
        <svg v-for="s in stars" :key="s" class="w-3.5 h-3.5 text-[#f5c518]" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      </div>

      <!-- Booking.com badge -->
      <div v-if="avgRating" class="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/15 px-4 py-2.5">
        <div class="flex items-center justify-center w-9 h-9 bg-[#003580] text-white font-bold text-sm rounded-sm flex-shrink-0">
          {{ avgRating }}
        </div>
        <div>
          <p class="text-white text-xs font-semibold leading-tight">{{ ratingLabel }}</p>
          <p class="text-white/50 text-[10px] mt-0.5">booking.com {{ new Date().getFullYear() }}</p>
        </div>
      </div>
    </div>

    <!-- Bottom center: scroll arrow -->
    <div class="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1">
      <div class="w-px h-8 bg-gradient-to-b from-transparent to-white/40"></div>
      <Icon name="mdi:arrow-down" class="text-white/50 text-base animate-bounce" />
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const { locale } = useLocale()
const bgImage    = ref('')
const hotelName  = ref('Hotel')
const subtitle   = ref('Boutique Hôtel & Spa')
const city       = ref('')
const starCount  = ref(5)
const avgRating  = ref('')
const ratingLabel = ref('Fabuleux')

const stars = computed(() => Array.from({ length: starCount.value }))

onMounted(async () => {
  const { fetchHotelInfo, fetchHotelData, fetchGallery, fetchComments } = useHotel()
  const [info, hotelData, gallery, ta, bk] = await Promise.all([
    fetchHotelInfo(),
    fetchHotelData(),
    fetchGallery(),
    fetchComments('tripadvisor', locale.value),
    fetchComments('booking', locale.value),
  ])

  hotelName.value  = info.name || 'Hotel'
  city.value       = [info.city, info.country].filter(Boolean).join(', ')
  starCount.value  = parseInt(info.stars || info.starRating || 5) || 5
  bgImage.value    = gallery[0]?.url || ''

  const etab = hotelData?.etablissment || hotelData?.etablissement || {}
  subtitle.value = etab.etabSlogan || etab.slogan || subtitle.value

  // Calculate average rating from booking reviews
  const allReviews = [...(bk || []), ...(ta || [])].filter(r => r.rating)
  if (allReviews.length) {
    const avg = allReviews.reduce((a, r) => a + r.rating, 0) / allReviews.length
    avgRating.value = avg.toFixed(1)
    ratingLabel.value = avg >= 9 ? 'Exceptionnel' : avg >= 8 ? 'Fabuleux' : avg >= 7 ? 'Très bien' : 'Bien'
  }
})
</script>

<style scoped>
.t3-hero-fade-enter-active { transition: opacity 1.2s ease; }
.t3-hero-fade-enter-from   { opacity: 0; }
</style>
