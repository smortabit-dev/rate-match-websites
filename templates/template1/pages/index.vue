<template>
  <div>
    <!-- Hero Carousel -->
    <HeroCarousel />

    <!-- Introduction / About -->
    <section class="py-16 sm:py-24 lg:py-0 lg:h-screen bg-stone-50 overflow-hidden flex items-center">
      <div class="container mx-auto px-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <!-- Left: Text -->
          <div>
            <p class="section-subtitle">{{ t.welcome }}</p>
            <h1 class="section-title mb-6">{{ etab.name || info.name }}</h1>
            <div class="flex items-start gap-4 mb-6">
              <div class="w-12 h-px bg-amber-700 mt-3 flex-shrink-0"></div>
              <div class="text-gray-600 leading-relaxed text-sm sm:text-base" v-html="pageDesc"></div>
            </div>
            <p v-if="etab.slogan" class="text-gray-500 italic text-sm leading-relaxed">
              {{ etab.slogan }}
            </p>
          </div>
          <!-- Right: 2-column scrolling photo grid -->
          <div v-if="aboutPhotos.length" class="hidden lg:block h-screen overflow-hidden relative">
            <div class="grid grid-cols-2 gap-3 absolute inset-x-0">
              <!-- Left column — scrolls up -->
              <div class="scroll-col-up flex flex-col gap-3">
                <div v-for="(photo, i) in [...aboutPhotosLeft, ...aboutPhotosLeft]" :key="'l'+i" class="overflow-hidden flex-shrink-0">
                  <img :src="photo.url" :alt="photo.caption || ''" class="w-full object-cover" loading="lazy" :class="i % 2 === 0 ? 'aspect-[3/4]' : 'aspect-square'" />
                </div>
              </div>
              <!-- Right column — scrolls down -->
              <div class="scroll-col-down flex flex-col gap-3">
                <div v-for="(photo, i) in [...aboutPhotosRight, ...aboutPhotosRight]" :key="'r'+i" class="overflow-hidden flex-shrink-0">
                  <img :src="photo.url" :alt="photo.caption || ''" class="w-full object-cover" loading="lazy" :class="i % 2 === 0 ? 'aspect-square' : 'aspect-[3/4]'" />
                </div>
              </div>
            </div>
            <!-- Fade edges -->
            <div class="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-stone-50 to-transparent z-10 pointer-events-none"></div>
            <div class="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-stone-50 to-transparent z-10 pointer-events-none"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Rooms Carousel -->
    <LazyRoomsCarousel id="rooms" />

    <!-- Testimonials -->
    <LazyTestimonialsSection id="testimonials" />

    <!-- Featured Services -->
    <LazyFeaturedServices id="services" />

    <!-- Amenities -->
    <LazyAmenitiesSection id="amenities" />

    <!-- Gallery -->
    <LazyGallerySection id="galerie" />

    <!-- Location & Surroundings -->
    <LazyLocationMap id="alentours" />

    <!-- Contact -->
    <LazyContactSection id="contact" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const info = ref({ name: '' })
const etab = ref({ name: '', desc: '', slogan: '' })
const aboutPhotos = ref([])

const STATIC_KEYS = ['welcome']
const pageDesc = ref('')
const t = ref(Object.fromEntries(STATIC_KEYS.map(k => [k, k])))

const { locale } = useLocale()

const aboutPhotosLeft = computed(() => aboutPhotos.value.filter((_, i) => i % 2 === 0))
const aboutPhotosRight = computed(() => aboutPhotos.value.filter((_, i) => i % 2 === 1))

onMounted(async () => {
  const { fetchGallery, fetchHotelInfo, fetchHotelData } = useHotel()
  
  const { loadCatalogue, transStatic, trans, getEtabTranslations, ETAB_ID } = useTranslations()
  const [hotelInfo, catalogue, gallery, hotelData] = await Promise.all([
    fetchHotelInfo(),
    loadCatalogue(locale.value),
    fetchGallery(),
    fetchHotelData()
  ])
  info.value = hotelInfo
  etab.value = getEtabTranslations(catalogue)
  aboutPhotos.value = (gallery || []).slice(0, 8)
  const translated = {}
  for (const key of STATIC_KEYS) translated[key] = transStatic(key, catalogue)
  t.value = translated

  const pageId = hotelData?.page?.pId || '58752'
  const rawDesc = trans(`${pageId}-description`, {}, `${ETAB_ID}_Page`, catalogue, '')
  const tmp = document.createElement('div')
  tmp.innerHTML = rawDesc
  pageDesc.value = tmp.innerHTML
})

useHead({
  title: 'Hotel - One Page Carousel',
})
</script>

<style scoped>
@keyframes scrollUp {
  0%   { transform: translateY(0); }
  100% { transform: translateY(-50%); }
}
@keyframes scrollDown {
  0%   { transform: translateY(-50%); }
  100% { transform: translateY(0); }
}
.scroll-col-up {
  animation: scrollUp 30s linear infinite;
}
.scroll-col-down {
  animation: scrollDown 30s linear infinite;
}
.scroll-col-up:hover,
.scroll-col-down:hover {
  animation-play-state: paused;
}
</style>
