<template>
  <header 
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
    :class="scrolled ? 'bg-[#003c7e] backdrop-blur-md py-2' : 'bg-transparent py-4 md:py-8'"
  >
    <!-- Top Bar (Mobile/Tablets) -->
    <div class="container mx-auto px-6">
      <div class="flex items-center justify-between lg:justify-end gap-6 mb-4 lg:mb-0">
        <div class="lg:hidden">
           <NuxtLink :to="localePath('/')" class="block p-0 border border-white/20">
            <img v-if="info.logo" :src="info.logo" :alt="info.name" class="h-8 w-auto object-contain" />
            <span v-else class="text-white font-serif text-lg">Hotel</span>
          </NuxtLink>
        </div>
        
        <div class="flex items-center gap-6 lg:hidden">
          <div @click="langPanelOpen = true" class="flex items-center gap-2 text-white text-xs uppercase tracking-widest font-bold cursor-pointer hover:text-[#D4AF37] transition-colors">
            <Icon name="mdi:flag-variant" class="text-lg" />
            <span>{{ locale === 'fr' ? 'Fr.' : 'En.' }}</span>
          </div>
          <div @click="currPanelOpen = true" class="flex items-center gap-2 text-white text-xs uppercase tracking-widest font-bold cursor-pointer hover:text-[#D4AF37] transition-colors">
            <Icon name="mdi:currency-eur" class="text-lg" />
            <span>{{ selectedCurrency }}</span>
          </div>
          
           <!-- Mobile toggle -->
           <button @click="menuOpen = !menuOpen" class="text-white">
            <Icon :name="menuOpen ? 'mdi:close' : 'mdi:menu'" class="text-3xl" />
          </button>
        </div>
      </div>

      <div class="hidden lg:flex items-center justify-between">
        <!-- Logo Desktop (Boxed) -->
        <NuxtLink :to="localePath('/')" class="relative z-10 block bg-black p-0 border border-white/20 transform hover:scale-105 transition-transform">
          <img v-if="info.logo" :src="info.logo" :alt="info.name" class="h-35 w-auto object-contain" />
          <div v-else class="text-white text-center">
            <p class="text-[8px] uppercase tracking-[0.3em] mb-1">Luxury</p>
            <p class="text-xl font-serif font-bold italic">{{ info.name || 'Hotel' }}</p>
          </div>
        </NuxtLink>

        <!-- Right Side: Nav + Book Now -->
        <div class="flex flex-col items-end gap-6 pr-6">
          <!-- Language & Currency (Desktop Only) -->
          <div class="hidden lg:flex items-center gap-6 mb-1">
            <div @click="langPanelOpen = true" class="flex items-center gap-2 text-white text-[10px] uppercase tracking-widest font-bold hover:text-[#D4AF37] transition-colors cursor-pointer">
              <Icon name="mdi:flag-variant" class="text-sm" />
              <span>{{ locale === 'fr' ? 'Fr.' : 'En.' }}</span>
            </div>
            <div @click="currPanelOpen = true" class="flex items-center gap-2 text-white text-[10px] uppercase tracking-widest font-bold hover:text-[#D4AF37] transition-colors cursor-pointer">
              <Icon name="mdi:currency-eur" class="text-sm" />
              <span>{{ selectedCurrency }}</span>
            </div>
          </div>

          <!-- Navigation (Right Aligned) -->
          <nav class="flex items-center justify-end space-x-6">
            <a v-for="item in navigation" :key="item.section" 
               :href="item.url || '#'" @click.prevent="scrollToSection(item)"
               class="text-xs font-bold tracking-widest text-white hover:text-[#D4AF37] transition-colors uppercase">
              {{ item.name }}
            </a>
          </nav>

          <!-- Book Now Button (New Line) -->
          <button 
            @click="openReservation"
            class="flex items-center gap-3 bg-[#D4AF37] hover:bg-[#B8941F] text-black px-12 py-4 font-bold uppercase tracking-[0.2em] transition-all shadow-2xl"
          >
            <Icon name="mdi:calendar-month" class="text-xl" />
            {{ t.booknow }}
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu Overlay -->
    <transition name="fade">
      <div v-if="menuOpen" class="fixed inset-0 bg-black z-40 p-12 lg:hidden flex flex-col justify-center items-center">
        <nav class="flex flex-col gap-8 text-center">
          <a v-for="item in navigation" :key="item.section" 
             :href="item.url || '#'" @click.prevent="scrollToSection(item)"
             class="text-3xl font-serif text-white hover:text-[#D4AF37] transition-colors uppercase">
            {{ item.name }}
          </a>
          <button 
            @click="openReservation"
            class="mt-12 bg-[#D4AF37] text-black px-12 py-5 font-bold uppercase tracking-[0.2em] rounded-sm"
          >
            {{ t.booknow }}
          </button>
        </nav>
      </div>
    </transition>
  </header>

  <ReservationModal v-if="reservationOpen" @close="reservationOpen = false" />

  <!-- Language Panel -->
  <transition name="slide-panel">
    <div v-if="langPanelOpen" class="fixed inset-0 z-[60] flex justify-end">
      <div class="absolute inset-0 bg-black/60" @click="langPanelOpen = false"></div>
      <div class="relative w-full max-w-2xl bg-[#002B5B] h-full overflow-y-auto shadow-2xl flex flex-col">
        <!-- Close button -->
        <div class="flex justify-end p-0">
           <button @click="langPanelOpen = false" class="bg-[#D4AF37] text-[#002B5B] px-8 py-5 font-bold uppercase tracking-widest flex items-center gap-3 hover:bg-[#c4a132] transition-colors shadow-lg">
             <Icon name="mdi:close" class="text-2xl" />
             {{ t.fermer || 'Fermer' }}
           </button>
        </div>
        <!-- Content -->
        <div class="p-8 md:p-12 text-white">
          <h2 class="text-3xl md:text-4xl font-serif font-bold mb-4">{{ t.choisissezvotrelanguepreferee }}</h2>
          <p class="text-white/70 mb-12">Nous parlons {{ t.nousparlonsfrancaiset40langues }}.</p>
          <h3 class="text-sm uppercase tracking-widest font-bold text-white/50 mb-6">{{ t.toutesleslangues }}</h3>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-6 text-sm">
            <button v-for="lang in languages" :key="lang.code"
                @click="switchLocale(lang.code)"
                class="text-left py-2 hover:text-[#D4AF37] transition-colors"
                :class="lang.code === locale ? 'text-[#D4AF37] font-bold' : 'text-white'">
              {{ lang.title }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>

  <!-- Currency Panel -->
  <transition name="slide-panel">
    <div v-if="currPanelOpen" class="fixed inset-0 z-[60] flex justify-end">
      <div class="absolute inset-0 bg-black/60" @click="currPanelOpen = false"></div>
      <div class="relative w-full max-w-2xl bg-[#002B5B] h-full overflow-y-auto shadow-2xl flex flex-col">
        <!-- Close button -->
        <div class="flex justify-end p-0">
           <button @click="currPanelOpen = false" class="bg-[#D4AF37] text-[#002B5B] px-8 py-5 font-bold uppercase tracking-widest flex items-center gap-3 hover:bg-[#c4a132] transition-colors shadow-lg">
             <Icon name="mdi:close" class="text-2xl" />
             {{ t.fermer || 'Fermer' }}
           </button>
        </div>
        <!-- Content -->
        <div class="p-8 md:p-12 text-white">
          <h2 class="text-3xl md:text-4xl font-serif font-bold mb-12">{{ t.choisissezvotredevise }}</h2>
          <h3 class="text-sm uppercase tracking-widest font-bold text-white/50 mb-6">{{ t.touteslesdevises }}</h3>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-6 text-sm">
            <button v-for="curr in currencies" :key="curr.cCode"
                @click="selectCurrency(curr.cCode)"
                class="text-left py-2 hover:text-[#D4AF37] transition-colors"
                :class="selectedCurrency === curr.cCode ? 'text-[#D4AF37] font-bold' : 'text-white'">
              <span class="capitalize">{{ curr.cNom }}</span> <br> {{ curr.cCode }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import ReservationModal from '../../template1/components/ReservationModal.vue'

const scrolled = ref(false)
const menuOpen = ref(false)
const reservationOpen = ref(false)
const currPanelOpen = ref(false)
const langPanelOpen = ref(false)
const info = ref({ name: '', logo: null })

const STATIC_KEYS = ['booknow', 'accueil', 'noschambres', 'nosservices', 'facilities', 'gallery', 'contact', 'fermer', 'nousparlonsfrancaiset40langues', 'choisissezvotrelanguepreferee', 'toutesleslangues', 'choisissezvotredevise', 'touteslesdevises']
const t = ref(Object.fromEntries(STATIC_KEYS.map(k => [k, k])))

const { locale, localePath, switchLocalePath } = useLocale()
const route = useRoute()
const router = useRouter()
const selectedCurrency = useCurrency()

const dynamicPages = ref([])
const faqLabel = ref('FAQ')
const hasFaq = ref(false)
const languages = ref([])
const currencies = ref([])

const switchLocale = (newLocale) => {
  langPanelOpen.value = false
  if (newLocale !== locale.value) {
    router.push(switchLocalePath(newLocale))
  }
}

const selectCurrency = (code) => {
  selectedCurrency.value = code
  currPanelOpen.value = false
}

watch([langPanelOpen, currPanelOpen], ([langOpen, currOpen]) => {
  document.body.style.overflow = (langOpen || currOpen) ? 'hidden' : 'auto'
})

const fetchHeaderData = async () => {
  const { fetchHotelInfo, fetchNavigationPages, fetchFaq, fetchCurrencies, fetchLanguages } = useHotel()
  const { loadCatalogue, transStatic } = useTranslations()
  
  const [hotelInfo, catalogue, navPages, faqData, currList, langList] = await Promise.all([
    fetchHotelInfo(),
    loadCatalogue(locale.value),
    fetchNavigationPages(locale.value),
    fetchFaq(locale.value),
    fetchCurrencies(),
    fetchLanguages()
  ])
  
  info.value = hotelInfo
  dynamicPages.value = navPages
  currencies.value = currList || []
  languages.value = langList || []
  hasFaq.value = faqData && faqData.length > 0 && faqData[0].id !== 1 // Filter out fallback
  if (!selectedCurrency.value) selectedCurrency.value = hotelInfo.currency || 'EUR'
  
  const translated = {}
  for (const key of STATIC_KEYS) translated[key] = transStatic(key, catalogue)
  t.value = translated
  
  faqLabel.value = transStatic('faq2', catalogue, 'FAQ')
}

onMounted(() => {
  fetchHeaderData()
  window.addEventListener('scroll', handleScroll)
})

watch(locale, () => {
  fetchHeaderData()
})

onUnmounted(() => window.removeEventListener('scroll', handleScroll))

const handleScroll = () => {
  scrolled.value = window.scrollY > 50
}

const openReservation = () => {
  reservationOpen.value = true
  menuOpen.value = false
}

const isHomePage = computed(() => {
  const path = route.path.replace(/\/$/, '')
  const home = localePath('/').replace(/\/$/, '')
  return path === home || path === ''
})

const navigation = computed(() => {
  const baseNav = [
    { name: t.value.accueil, section: 'hero', url: '#' },
    { name: t.value.noschambres, section: 'rooms', url: '#' },
    { name: 'Facilities', section: 'amenities', url: '#' },
    { name: 'Comments', section: 'testimonials', url: '#' },
    { name: 'Property surroundings', section: 'surroundings', url: '#' },
    { name: 'Our services', section: 'services', url: '#' },
    { name: 'Gallery', section: 'gallery', url: '#' },
    { name: 'Contact', section: 'contact', url: '#' },
  ]

  if (hasFaq.value) {
    baseNav.push({ name: faqLabel.value, section: 'faq', url: '/faq' })
  }

  const extraNav = dynamicPages.value.map(p => ({
     name: p.name,
     section: p.slug,
     url: p.url,
     isDynamic: true,
     isExternal: p.isExternal
  }))

  return [...baseNav, ...extraNav]
})

const scrollToSection = (item) => {
  menuOpen.value = false
  
  if (item.isDynamic || (item.url && item.url !== '#')) {
    if (item.isExternal) {
      window.open(item.url, '_blank')
    } else {
      router.push(localePath(item.url))
    }
    return
  }

  const sectionId = item.section
  if (!isHomePage.value) {
    router.push(localePath('/') + (sectionId === 'hero' ? '' : `#${sectionId}`))
    return
  }
  
  const el = document.getElementById(sectionId)
  if (el) {
    const offset = 100
    const bodyRect = document.body.getBoundingClientRect().top
    const elementRect = el.getBoundingClientRect().top
    const elementPosition = elementRect - bodyRect
    const offsetPosition = elementPosition - offset

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  } else if (sectionId === 'hero') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.5s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.font-serif {
  font-family: 'Playfair Display', serif;
}
.slide-panel-enter-active, .slide-panel-leave-active { transition: opacity 0.3s ease; }
.slide-panel-enter-active > :last-child, .slide-panel-leave-active > :last-child { transition: transform 0.3s ease; }
.slide-panel-enter-from, .slide-panel-leave-to { opacity: 0; }
.slide-panel-enter-from > :last-child, .slide-panel-leave-to > :last-child { transform: translateX(100%); }
</style>
