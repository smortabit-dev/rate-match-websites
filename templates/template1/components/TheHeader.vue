<template>
  <header class="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
          :class="scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'">
    <div class="container mx-auto px-6">
      <div class="flex items-center justify-between">
        <!-- Left: Phone + Language -->
        <div class="flex items-center space-x-4 w-1/3">
          <a v-if="info.phone" :href="`tel:${info.phone}`"
             class="text-xs font-medium tracking-wide transition-colors hidden sm:inline"
             :class="menuOpen ? 'text-gray-700' : (scrolled ? 'text-gray-700' : 'text-white')">
            <Icon name="mdi:phone" class="text-sm mr-1 inline" />{{ info.phone }}
          </a>
          <LanguageSwitcher :class="menuOpen ? 'text-gray-700' : (scrolled ? 'text-gray-700' : 'text-white')" />
          <button @click="currencyPanelOpen = true"
                  class="text-xs font-medium tracking-wide transition-colors flex items-center gap-1"
                  :class="menuOpen ? 'text-gray-700' : (scrolled ? 'text-gray-700' : 'text-white')">
            <Icon name="mdi:currency-usd" class="text-sm" />
            {{ selectedCurrency }}
            <Icon name="mdi:chevron-down" class="text-xs" />
          </button>
        </div>
        <!-- Center: spacer -->
        <div class="w-1/3"></div>
        <!-- Right: Reservation + Burger/Close -->
        <div class="flex items-center justify-end space-x-4 w-1/3">
          <button @click="openReservation"
                  class="hidden sm:inline-block px-5 py-2.5 text-xs uppercase tracking-[0.15em] font-semibold transition-all duration-300"
                  :class="menuOpen
                    ? 'border border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white'
                    : (scrolled
                      ? 'bg-amber-700 text-white hover:bg-amber-800'
                      : 'bg-white/10 backdrop-blur-sm text-white border border-white/40 hover:bg-white hover:text-gray-900')">
            {{ t.verifierladisponibilite }}
          </button>
          <button @click="menuOpen = !menuOpen" class="flex items-center gap-2 p-2 transition-colors"
                  :class="menuOpen ? 'text-gray-900' : (scrolled ? 'text-gray-900' : 'text-white')">
            <Icon v-if="menuOpen" name="mdi:close" class="text-2xl" />
            <Icon v-else name="mdi:menu" class="text-2xl" />
            <span v-if="menuOpen" class="text-xs uppercase tracking-[0.15em] font-semibold hidden sm:inline">Close</span>
          </button>
        </div>
      </div>
    </div>
  </header>

  <!-- Fixed centered logo -->
  <NuxtLink :to="localePath('/')"
            class="fixed top-0 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 pointer-events-auto"
            :class="scrolled ? 'mt-1' : 'mt-3'">
    <img v-if="info.logo" :src="info.logo" :alt="info.name"
         class="w-auto object-contain transition-all"
         :class="scrolled ? 'h-[50px] sm:h-[80px]' : 'h-[80px] sm:h-[150px]'" />
    <div v-else class="font-serif text-center transition-colors"
         :class="menuOpen ? 'text-gray-900' : (scrolled ? 'text-gray-900' : 'text-white')">
      <span class="text-xs tracking-[0.3em] uppercase block">The</span>
      <span class="text-2xl font-bold block leading-tight">{{ info.name || 'Hotel' }}</span>
      <span v-if="info.city" class="text-[10px] tracking-[0.3em] uppercase block text-gray-400">{{ info.city }}</span>
    </div>
  </NuxtLink>

  <!-- Menu Backdrop -->
  <transition name="menu-overlay">
    <div v-if="menuOpen" class="fixed inset-0 z-30 bg-black/80" @click="menuOpen = false"></div>
  </transition>

  <!-- Menu Panel -->
  <transition name="menu-slide">
    <div v-if="menuOpen" class="fixed inset-0 sm:bottom-auto z-40 bg-white shadow-xl overflow-y-auto">
      <!-- Hotel name under logo -->
      <div class="text-center pt-24 sm:pt-32 pb-4 sm:pb-8">
        <!-- <p class="text-xs tracking-[0.3em] uppercase text-gray-500">The</p>
        <h2 class="text-3xl md:text-4xl font-serif font-bold uppercase tracking-wide text-gray-900">{{ info.name || 'Hotel' }}</h2>
        <p v-if="info.city" class="text-xs tracking-[0.3em] uppercase text-gray-400 mt-1">{{ info.city }}</p> -->
      </div>

      <!-- Navigation as image cards -->
      <div class="container mx-auto px-6 pb-16">
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <a v-for="(item, idx) in navigation" :key="item.section" href="#"
             @click.prevent="scrollToSection(item.section)"
             class="group text-center cursor-pointer">
            <div class="aspect-[3/4] overflow-hidden mb-3">
              <img v-if="menuImages[idx]" :src="menuImages[idx]" :alt="item.name"
                   class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div v-else class="w-full h-full bg-gray-100 flex items-center justify-center">
                <Icon name="mdi:image" class="text-4xl text-gray-300" />
              </div>
            </div>
            <div class="w-8 h-px bg-gray-800 mx-auto mb-2"></div>
            <span class="text-sm font-serif text-gray-800 group-hover:text-amber-700 transition-colors">{{ item.name }}</span>
          </a>
        </div>
      </div>
    </div>
  </transition>

  <ReservationModal v-if="reservationOpen" @close="reservationOpen = false" />

  <!-- Currency Panel (slide from right) -->
  <transition name="slide-panel">
    <div v-if="currencyPanelOpen" class="fixed inset-0 z-[60] flex justify-end">
      <div class="absolute inset-0 bg-black/60" @click="currencyPanelOpen = false"></div>
      <div class="relative w-full max-w-sm bg-white h-full overflow-y-auto shadow-2xl">
        <button @click="currencyPanelOpen = false"
                class="absolute top-6 right-6 z-10 text-gray-400 hover:text-gray-800 transition-colors">
          <Icon name="mdi:close" class="text-2xl" />
        </button>
        <div class="p-6 sm:p-8">
          <h3 class="text-xl font-serif mb-6">Currency</h3>
          <!-- Search -->
          <div class="relative mb-6">
            <Icon name="mdi:magnify" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input v-model="currencySearch" type="text" placeholder="Search..."
                   class="w-full pl-10 pr-4 py-2.5 border border-gray-200 text-sm focus:border-amber-700 focus:outline-none" />
          </div>
          <!-- Currency list -->
          <div class="space-y-1">
            <button v-for="curr in filteredCurrencies" :key="curr.cCode"
                    @click="selectCurrency(curr.cCode)"
                    class="w-full flex items-center justify-between px-4 py-3 text-sm transition-colors hover:bg-gray-50"
                    :class="selectedCurrency === curr.cCode ? 'bg-amber-50 text-amber-700' : 'text-gray-700'">
              <span class="font-medium">{{ curr.cCode }}</span>
              <span class="text-gray-400 text-xs capitalize">{{ curr.cNom }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import ReservationModal from './ReservationModal.vue'

const scrolled = ref(false)
const menuOpen = ref(false)
const reservationOpen = ref(false)
const info = ref({ name: '', logo: null, phone: '', city: '', currency: 'EUR' })
const menuImages = ref([])
const currencyPanelOpen = ref(false)
const currencies = ref([])
const selectedCurrency = useCurrency()
const currencySearch = ref('')

const filteredCurrencies = computed(() => {
  const q = currencySearch.value.toLowerCase()
  if (!q) return currencies.value
  return currencies.value.filter(c =>
    c.cCode.toLowerCase().includes(q) || c.cNom.toLowerCase().includes(q)
  )
})

const selectCurrency = (code) => {
  selectedCurrency.value = code
  currencyPanelOpen.value = false
  currencySearch.value = ''
}

const STATIC_KEYS = ['verifierladisponibilite', 'accueil', 'noschambres', 'customerscomments', 'nosservices', 'facilities', 'gallery', 'contact']
const t = ref(Object.fromEntries(STATIC_KEYS.map(k => [k, k])))

onMounted(async () => {
  const { fetchCurrencies, fetchGallery, fetchHotelInfo } = useHotel()
  
  const { loadCatalogue, transStatic } = useTranslations()
  const [hotelInfo, catalogue, gallery, currList] = await Promise.all([
    fetchHotelInfo(),
    loadCatalogue(locale.value),
    fetchGallery(),
    fetchCurrencies(),
  ])
  info.value = hotelInfo
  currencies.value = currList
  selectedCurrency.value = hotelInfo.currency || 'EUR'
  const translated = {}
  for (const key of STATIC_KEYS) translated[key] = transStatic(key, catalogue)
  t.value = translated

  // Pick gallery images for menu nav items
  if (gallery.length > 0) {
    menuImages.value = gallery.slice(0, 7).map(img => img.url)
  }

  handleScroll()
  window.addEventListener('scroll', handleScroll)
})
onUnmounted(() => window.removeEventListener('scroll', handleScroll))

const handleScroll = () => { scrolled.value = !isHomePage.value || window.scrollY > 50 }
const openReservation = () => { reservationOpen.value = true; menuOpen.value = false }

// Lock body scroll when menu is open
watch(menuOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : 'auto'
})

const route = useRoute()
const { localePath, locale } = useLocale()

// On non-home pages, force the "scrolled" (white bg) header state
const isHomePage = computed(() => {
  const path = route.path.replace(/\/$/, '')
  const home = localePath('/').replace(/\/$/, '')
  return path === home
})

const navigation = computed(() => [
  { name: t.value.accueil,           section: 'hero' },
  { name: t.value.noschambres,       section: 'rooms' },
  { name: t.value.customerscomments, section: 'testimonials' },
  { name: t.value.nosservices,       section: 'services' },
  { name: t.value.facilities,        section: 'amenities' },
  { name: t.value.gallery,           section: 'gallery' },
  { name: t.value.contact,           section: 'contact' },
])

const router = useRouter()

const scrollToSection = (sectionId) => {
  menuOpen.value = false
  if (!isHomePage.value) {
    // Navigate to homepage with hash, then scroll after arrival
    router.push(localePath('/') + (sectionId === 'hero' ? '' : `#${sectionId}`))
    return
  }
  nextTick(() => {
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      const el = document.getElementById(sectionId)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  })
}
</script>

<style scoped>
.menu-overlay-enter-active, .menu-overlay-leave-active {
  transition: opacity 0.4s ease;
}
.menu-overlay-enter-from, .menu-overlay-leave-to {
  opacity: 0;
}
.menu-slide-enter-active, .menu-slide-leave-active {
  transition: transform 0.4s ease, opacity 0.4s ease;
}
.menu-slide-enter-from, .menu-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
.slide-panel-enter-active, .slide-panel-leave-active { transition: opacity 0.3s ease; }
.slide-panel-enter-active > :last-child, .slide-panel-leave-active > :last-child { transition: transform 0.3s ease; }
.slide-panel-enter-from, .slide-panel-leave-to { opacity: 0; }
.slide-panel-enter-from > :last-child, .slide-panel-leave-to > :last-child { transform: translateX(100%); }
</style>
