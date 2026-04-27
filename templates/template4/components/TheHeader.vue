<template>
  <header 
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
    :class="scrolled ? 'bg-[#003c7e] backdrop-blur-md py-2' : 'bg-transparent py-4 md:py-8'"
  >
    <!-- Top Bar (Mobile/Tablets) -->
    <div class="container mx-auto px-6">
      <div class="flex items-center justify-between lg:justify-end gap-6 mb-4 lg:mb-0">
        <div class="lg:hidden">
           <NuxtLink :to="localePath('/')" class="block p-2 border border-white/20">
            <img v-if="info.logo" :src="info.logo" :alt="info.name" class="h-8 w-auto object-contain" />
            <span v-else class="text-white font-serif text-lg">Hotel</span>
          </NuxtLink>
        </div>
        
        <div class="flex items-center gap-6 lg:hidden">
          <div class="flex items-center gap-2 text-white/80 text-xs uppercase tracking-widest font-bold">
            <Icon name="mdi:flag-variant" class="text-lg" />
            <span>{{ locale === 'fr' ? 'Fr.' : 'En.' }}</span>
          </div>
          <div class="flex items-center gap-2 text-white/80 text-xs uppercase tracking-widest font-bold">
            <Icon name="mdi:currency-eur" class="text-lg" />
            <span>EUR</span>
          </div>
          
           <!-- Mobile toggle -->
           <button @click="menuOpen = !menuOpen" class="text-white">
            <Icon :name="menuOpen ? 'mdi:close' : 'mdi:menu'" class="text-3xl" />
          </button>
        </div>
      </div>

      <div class="hidden lg:flex items-center justify-between">
        <!-- Logo Desktop (Boxed) -->
        <NuxtLink :to="localePath('/')" class="relative z-10 block bg-black p-4 border border-white/20 transform hover:scale-105 transition-transform">
          <img v-if="info.logo" :src="info.logo" :alt="info.name" class="h-20 w-auto object-contain" />
          <div v-else class="text-white text-center">
            <p class="text-[8px] uppercase tracking-[0.3em] mb-1">Luxury</p>
            <p class="text-xl font-serif font-bold italic">{{ info.name || 'Hotel' }}</p>
          </div>
        </NuxtLink>

        <!-- Right Side: Nav + Book Now -->
        <div class="flex flex-col items-end gap-6 pr-6">
          <!-- Language & Currency (Desktop Only) -->
          <div class="hidden lg:flex items-center gap-6 mb-1">
            <div class="flex items-center gap-2 text-white/60 text-[10px] uppercase tracking-widest font-bold hover:text-[#D4AF37] transition-colors cursor-pointer">
              <Icon name="mdi:flag-variant" class="text-sm" />
              <span>{{ locale === 'fr' ? 'Fr.' : 'En.' }}</span>
            </div>
            <div class="flex items-center gap-2 text-white/60 text-[10px] uppercase tracking-widest font-bold hover:text-[#D4AF37] transition-colors cursor-pointer">
              <Icon name="mdi:currency-eur" class="text-sm" />
              <span>EUR</span>
            </div>
          </div>

          <!-- Navigation (Right Aligned) -->
          <nav class="flex items-center justify-end space-x-8">
            <a v-for="item in navigation" :key="item.section" 
               href="#" @click.prevent="scrollToSection(item.section)"
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
             href="#" @click.prevent="scrollToSection(item.section)"
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
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import ReservationModal from '../../template1/components/ReservationModal.vue'

const scrolled = ref(false)
const menuOpen = ref(false)
const reservationOpen = ref(false)
const info = ref({ name: '', logo: null })

const STATIC_KEYS = ['booknow', 'accueil', 'noschambres', 'nosservices', 'facilities', 'gallery', 'contact']
const t = ref(Object.fromEntries(STATIC_KEYS.map(k => [k, k])))

const { locale, localePath } = useLocale()
const route = useRoute()
const router = useRouter()

onMounted(async () => {
  const { fetchHotelInfo } = useHotel()
  const { loadCatalogue, transStatic } = useTranslations()
  
  const [hotelInfo, catalogue] = await Promise.all([
    fetchHotelInfo(),
    loadCatalogue(locale.value)
  ])
  
  info.value = hotelInfo
  const translated = {}
  for (const key of STATIC_KEYS) translated[key] = transStatic(key, catalogue)
  t.value = translated

  window.addEventListener('scroll', handleScroll)
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

const navigation = computed(() => [
  { name: t.value.accueil, section: 'hero' },
  { name: t.value.noschambres, section: 'rooms' },
  { name: 'Facilities', section: 'amenities' },
  { name: 'Comments', section: 'testimonials' },
  { name: 'Property surroundings', section: 'surroundings' },
  { name: 'Our services', section: 'services' },
  { name: 'Gallery', section: 'gallery' },
  { name: 'Contact', section: 'contact' },
])

const scrollToSection = (sectionId) => {
  menuOpen.value = false
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
</style>
