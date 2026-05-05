<template>
  <section id="hero" class="relative h-screen">
    <!-- Carousel Images -->
    <div class="absolute inset-0">
      <TransitionGroup name="fade">
        <div v-for="(image, index) in galleryImages" :key="image.id"
             v-show="currentSlide === index" class="absolute inset-0">
          <img :src="image.url" :alt="image.alt" class="w-full h-full object-cover"
               :loading="index === 0 ? 'eager' : 'lazy'"
               :fetchpriority="index === 0 ? 'high' : 'low'" />
          <div class="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/60"></div>
        </div>
      </TransitionGroup>
    </div>

    <!-- Rate-Match Widget (top) -->
    <div v-if="widgetCode" class="absolute top-20 sm:top-24 left-0 right-0 z-30">
      <div class="container mx-auto px-4 sm:px-6">
        <div id="RMW_widget_container"></div>
      </div>
    </div>

    <!-- Content Overlay — centered -->
    <div class="relative h-full flex items-center justify-start text-white z-10">
      <div class="text-left fade-in-up px-6">
        <p class="section-subtitle text-amber-300 mb-4">{{ t.welcome }}</p>
        <h1 class="text-3xl md:text-5xl lg:text-7xl mb-8 leading-tight font-serif capitalize">
          {{ info.name }}
        </h1>
        <!-- <div class="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
          <button @click="openBooking" class="btn-primary text-center">
            {{ t.reserveroom }}
          </button>
          <NuxtLink :to="localePath('/rooms')" class="btn-outline-white">
            {{ t.voirlesdetails }}
          </NuxtLink>
        </div> -->
      </div>
    </div>

    <!-- Slide Counter + Navigation Arrows (bottom-right) -->
    <div class="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 z-20 flex items-center gap-3 sm:gap-4">
      <button @click="prevSlide" class="w-10 h-10 sm:w-12 sm:h-12 border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-gray-900 transition-all">
        <Icon name="mdi:chevron-left" class="text-lg sm:text-xl" />
      </button>
      <div class="text-white text-sm font-medium tracking-wider">
        <span class="text-xl sm:text-2xl font-serif">{{ String(currentSlide + 1).padStart(2, '0') }}</span>
        <span class="text-gray-400 mx-1 sm:mx-2">/</span>
        <span class="text-gray-400">{{ String(galleryImages.length).padStart(2, '0') }}</span>
      </div>
      <button @click="nextSlide" class="w-10 h-10 sm:w-12 sm:h-12 border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-gray-900 transition-all">
        <Icon name="mdi:chevron-right" class="text-lg sm:text-xl" />
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'

const info = ref({ name: '' })
const galleryImages = ref([])
const currentSlide = ref(0)
const widgetCode = ref('')
const selectedCurrency = useCurrency()
let intervalId = null

const STATIC_KEYS = ['welcome', 'reserveroom', 'voirlesdetails']
const t = ref(Object.fromEntries(STATIC_KEYS.map(k => [k, k])))

const { localePath, locale } = useLocale()

const nextSlide = () => {
  if (galleryImages.value.length > 0) {
    currentSlide.value = (currentSlide.value + 1) % galleryImages.value.length
  }
  resetInterval()
}

const prevSlide = () => {
  if (galleryImages.value.length > 0) {
    currentSlide.value = (currentSlide.value - 1 + galleryImages.value.length) % galleryImages.value.length
  }
  resetInterval()
}

const startInterval = () => { intervalId = setInterval(nextSlide, 5000) }
const resetInterval = () => { if (intervalId) clearInterval(intervalId); startInterval() }

const openBooking = () => { window.dispatchEvent(new Event('open-reservation')) }

const route = useRoute()
const isHomePage = computed(() => {
  const path = route.path.replace(/\/$/, '')
  const home = localePath('/').replace(/\/$/, '')
  return path === home || path === ''
})

function loadWidget(code, currency, lang) {
  if (!isHomePage.value) return

  // 1. Clear our primary container
  const container = document.getElementById('RMW_widget_container')
  if (container) container.innerHTML = ''

  // 2. Remove the widget script tag
  const existing = document.getElementById('RMW_script_tag')
  if (existing) existing.remove()

  // 3. Remove any other scripts injected by the RateMatch loader
  document.querySelectorAll('script[src*="rate-match.com"]').forEach(s => s.remove())

  // 4. Cleanup floating elements
  const floatingElements = document.querySelectorAll('[id^="RMW_"], [class^="RMW_"]')
  floatingElements.forEach(el => {
    if (el.id !== 'RMW_widget_container') el.remove()
  })
  
  // 5. Cleanup high z-index elements
  document.querySelectorAll('div').forEach(div => {
    if (div.style.zIndex === '10000' || div.style.zIndex === '10001') {
      div.remove()
    }
  })

  // 6. Clear globals
  delete window.RMW
  delete window.RateMatch
  delete window.RateMatchWidget

  if (!code) return

  // Use a small timeout to ensure DOM changes are processed before new script runs
  setTimeout(() => {
    const script = document.createElement('script')
    script.id = 'RMW_script_tag'
    script.src = `https://widget.rate-match.com/scripts/widget-loader.min.js?key=${code}&currency=${currency}&lang=${lang}&v=${Date.now()}`
    script.async = true
    document.body.appendChild(script)
  }, 100)
}

watch(selectedCurrency, (currency) => {
  if (widgetCode.value) loadWidget(widgetCode.value, currency, locale.value)
})

watch(locale, async (lang) => {
  await nextTick()
  if (widgetCode.value) loadWidget(widgetCode.value, selectedCurrency.value, lang)
})

onMounted(async () => {
  startInterval()
  const { fetchGallery, fetchHotelData, fetchHotelInfo } = useHotel()
  
  const { loadCatalogue, transStatic } = useTranslations()

  // Critical path: only what's needed to show images & text
  const [hotelInfo, images, catalogue] = await Promise.all([
    fetchHotelInfo(),
    fetchGallery(),
    loadCatalogue(locale.value),
  ])
  info.value = hotelInfo
  galleryImages.value = images.slice(0, 5)

  const translated = {}
  for (const key of STATIC_KEYS) translated[key] = transStatic(key, catalogue)
  t.value = translated

  // Non-critical: load widget in background after images are shown
  if (isHomePage.value) {
    fetchHotelData().then(async (hotelData) => {
      const code = hotelData?.etablissment?.code_widget
      if (code) {
        widgetCode.value = code
        await nextTick()
        loadWidget(code, selectedCurrency.value, locale.value)
      }
    })
  }
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
  
  // Cleanup widget script and any floating elements it might have created
  const script = document.getElementById('RMW_script_tag')
  if (script) script.remove()
  
  // Some widgets create floating containers at the body level
  // We look for common IDs or patterns used by RateMatch widgets
  const floatingElements = document.querySelectorAll('[id^="RMW_"], [class^="RMW_"]')
  floatingElements.forEach(el => {
    if (el.id !== 'RMW_widget_container') { // Don't remove the one in our template, Vue handles it
      el.remove()
    }
  })
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 1.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
