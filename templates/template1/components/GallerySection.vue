<template>
  <section id="galerie" class="py-16 sm:py-24 bg-white overflow-hidden">
    <div class="container mx-auto px-4 sm:px-6">
      <!-- Header -->
      <div class="mb-10 sm:mb-16" :class="dir === 'rtl' ? 'text-right' : 'text-left'">
        <p class="section-subtitle">{{ subtitleText }}</p>
        <h2 class="section-title">{{ titleText }}</h2>
      </div>
    </div>

    <div class="w-full px-6">
      <div v-if="loading" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-700"></div>
      </div>

      <!-- Gallery -->
      <div v-else class="relative overflow-hidden">
        <!-- Left nav button -->
        <button @click="manualLeft"
                class="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-amber-700 transition-all group">
          <Icon name="mdi:arrow-left" class="text-xl text-gray-700 group-hover:text-white" />
        </button>

        <!-- Scrollable track -->
        <div class="flex gap-4"
             :style="{ transform: `translateX(${dir === 'rtl' ? offset : -offset}px)`, transition: isSnapping ? 'transform 0.4s ease' : 'none' }">
          <div v-for="(image, idx) in duplicatedImages" :key="idx"
               class="flex-shrink-0 w-[180px] sm:w-[240px] lg:w-[280px]"
               @click="openLightbox(idx % galleryImages.length)">
            <div class="aspect-[2/4] overflow-hidden cursor-pointer group">
              <img :src="image.url" :alt="image.alt"
                   class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
          </div>
        </div>

        <!-- Right nav button -->
        <button @click="manualRight"
                class="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-amber-700 transition-all group">
          <Icon name="mdi:arrow-right" class="text-xl text-gray-700 group-hover:text-white" />
        </button>
      </div>
    </div>

    <!-- Lightbox -->
    <transition name="fade">
      <div v-if="lightboxOpen" @click="closeLightbox"
           class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
        <button @click="closeLightbox" class="absolute top-4 right-4 text-white text-3xl hover:text-amber-400 transition-colors">
          <Icon name="mdi:close" />
        </button>
        <button @click.stop="lightboxPrev" class="absolute left-2 sm:left-4 text-white text-3xl sm:text-4xl hover:text-amber-400 transition-colors">
          <Icon name="mdi:chevron-left" />
        </button>
        <img :src="galleryImages[lightboxIndex]?.url" :alt="galleryImages[lightboxIndex]?.alt"
             class="max-w-full max-h-[90vh] object-contain" @click.stop />
        <button @click.stop="lightboxNext" class="absolute right-2 sm:right-4 text-white text-3xl sm:text-4xl hover:text-amber-400 transition-colors">
          <Icon name="mdi:chevron-right" />
        </button>
        <div class="absolute bottom-4 text-white text-sm">
          {{ lightboxIndex + 1 }} / {{ galleryImages.length }}
        </div>
      </div>
    </transition>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const galleryImages = ref([])
const loading       = ref(true)
const lightboxOpen  = ref(false)
const lightboxIndex = ref(0)

const titleText    = ref('galerie')
const subtitleText = ref('galeriedaccueil')

const { locale, dir } = useLocale()

const duplicatedImages = computed(() => [...galleryImages.value, ...galleryImages.value])

// JS-driven auto-scroll position (px)
const offset     = ref(0)
const isSnapping = ref(false)
let   autoTimer  = null
let   isPaused   = false

const ITEM_WIDTH = () => {
  const w = window.innerWidth
  if (w >= 1024) return 280 + 16
  if (w >= 640)  return 240 + 16
  return 180 + 16
}

const halfWidth = computed(() => galleryImages.value.length * ITEM_WIDTH())

const tick = () => {
  if (isPaused) return
  offset.value += 0.5
  // Loop seamlessly at the halfway point (duplicated list)
  if (offset.value >= halfWidth.value) {
    offset.value = 0
  }
}

const manualLeft = () => {
  isSnapping.value = true
  isPaused = true
  offset.value = Math.max(0, offset.value - ITEM_WIDTH() * 2)
  setTimeout(() => { isSnapping.value = false; isPaused = false }, 450)
}

const manualRight = () => {
  isSnapping.value = true
  isPaused = true
  offset.value += ITEM_WIDTH() * 2
  if (offset.value >= halfWidth.value) offset.value = 0
  setTimeout(() => { isSnapping.value = false; isPaused = false }, 450)
}

const openLightbox  = (idx) => { lightboxIndex.value = idx; lightboxOpen.value = true; document.body.style.overflow = 'hidden' }
const closeLightbox = () => { lightboxOpen.value = false; document.body.style.overflow = 'auto' }
const lightboxNext  = () => { lightboxIndex.value = (lightboxIndex.value + 1) % galleryImages.value.length }
const lightboxPrev  = () => { lightboxIndex.value = (lightboxIndex.value - 1 + galleryImages.value.length) % galleryImages.value.length }

const handleKeydown = (e) => {
  if (!lightboxOpen.value) return
  if (e.key === 'Escape')      closeLightbox()
  if (e.key === 'ArrowRight')  lightboxNext()
  if (e.key === 'ArrowLeft')   lightboxPrev()
}

onMounted(async () => {
  const { fetchGallery } = useHotel()
  const { loadCatalogue, transStatic } = useTranslations()
  const [images, catalogue] = await Promise.all([
    fetchGallery(),
    loadCatalogue(locale.value),
  ])
  galleryImages.value = images
  titleText.value    = transStatic('galerie',         catalogue, 'Galerie')
  subtitleText.value  = transStatic('decouvreznotreetablissementenimages', catalogue, 'Découvrez notre établissement en images')
  loading.value = false

  autoTimer = setInterval(tick, 16)
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  clearInterval(autoTimer)
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = 'auto'
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
