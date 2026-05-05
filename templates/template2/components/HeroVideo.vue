<template>
  <section class="relative h-screen min-h-[600px] flex flex-col overflow-hidden bg-[#0A0A0A]">

    <!-- Video background -->
    <video v-if="videoSrc"
      :src="videoSrc"
      :poster="posterSrc"
      autoplay muted loop playsinline
      class="absolute inset-0 w-full h-full object-cover"
    ></video>

    <!-- Fallback image -->
    <img v-else-if="posterSrc"
      :src="posterSrc"
      :alt="hotelName"
      class="absolute inset-0 w-full h-full object-cover"
    />

    <!-- Very subtle gradient — only bottom fade for the booking bar -->
    <div class="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/55"></div>

    <!-- Rate-Match Widget (top) -->
    <div v-if="widgetCode" class="absolute top-20 sm:top-24 left-0 right-0 z-30">
      <div class="container mx-auto px-4 sm:px-6">
        <div id="RMW_widget_container"></div>
      </div>
    </div>

    <!-- Reservation bar pinned at bottom -->
    <div class="absolute bottom-0 left-0 right-0 z-10">
      <ReservationBar />
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue'

const videoSrc  = ref('')
const posterSrc = ref('')
const hotelName = ref('Hotel')

const { locale, localePath } = useLocale()
const route = useRoute()
const selectedCurrency = useCurrency()

const isHomePage = computed(() => {
  const path = route.path.replace(/\/$/, '')
  const home = localePath('/').replace(/\/$/, '')
  return path === home || path === ''
})

const widgetCode = ref('')

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
  const { fetchGallery, fetchHotelData, fetchHotelInfo } = useHotel()
  
  const [hotelData, info, gallery] = await Promise.all([
    fetchHotelData(), fetchHotelInfo(), fetchGallery()
  ])
  const etab = hotelData?.etablissment || {}
  videoSrc.value  = etab.video || 'https://vz-f039b225-dfa.b-cdn.net/e45edabd-c11b-4f47-94fb-f5c15083aa7f/play_1080p.mp4'
  posterSrc.value = gallery[0]?.url || ''
  hotelName.value = info.name || etab.etablissementNom || 'Hotel'

  // Load widget if on homepage
  if (isHomePage.value) {
    const code = etab.code_widget
    if (code) {
      widgetCode.value = code
      await nextTick()
      loadWidget(code, selectedCurrency.value, locale.value)
    }
  }
})

onUnmounted(() => {
  const script = document.getElementById('RMW_script_tag')
  if (script) script.remove()
  
  const floatingElements = document.querySelectorAll('[id^="RMW_"], [class^="RMW_"]')
  floatingElements.forEach(el => {
    if (el.id !== 'RMW_widget_container') {
      el.remove()
    }
  })
})
</script>
