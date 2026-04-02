<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
    :class="scrolled ? 'bg-black/90 backdrop-blur-sm py-3' : 'bg-transparent py-5'"
  >
    <div class="max-w-[1400px] mx-auto px-8 flex items-center justify-between gap-6">

      <!-- Left: Logo -->
      <NuxtLink :to="localePath('/')" class="flex-shrink-0 flex flex-col items-start">
        <img v-if="info.logo" :src="info.logo" :alt="info.name" class="h-10 w-auto object-contain" />
        <template v-else>
          <span class="font-['Cormorant_Garamond'] text-white text-base font-light tracking-[0.25em] uppercase leading-tight whitespace-nowrap">
            {{ info.name || 'Hotel' }}
          </span>
          <div class="flex gap-[3px] mt-1">
            <svg v-for="s in stars" :key="s" class="w-2.5 h-2.5 text-white/80" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          </div>
        </template>
      </NuxtLink>

      <!-- Center: Nav (desktop) -->
      <nav class="hidden lg:flex items-center gap-7 xl:gap-9">
        <NuxtLink
          v-for="item in navItems" :key="item.key"
          :to="localePath(item.path)"
          class="text-[11px] uppercase tracking-[0.15em] text-white/80 hover:text-white transition-colors whitespace-nowrap relative group"
        >
          {{ item.label }}
          <span class="absolute -bottom-1 left-0 right-0 h-px bg-[#C9A96E] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
        </NuxtLink>
      </nav>

      <!-- Right: Currency + Language -->
      <div class="flex items-center gap-5">
        <!-- Currency trigger -->
        <button @click="currencyOpen = true"
          class="hidden sm:flex items-center gap-1.5 text-[11px] uppercase tracking-[0.15em] text-white/80 hover:text-white transition-colors">
          <span>{{ selectedCurrency }}</span>
          <Icon name="mdi:chevron-down" class="text-xs" />
        </button>

        <div class="w-px h-4 bg-white/20 hidden sm:block"></div>

        <!-- Language -->
        <T2LanguageSwitcher class="text-[11px] uppercase tracking-[0.15em] text-white/80 hover:text-white transition-colors hidden sm:block" />

        <!-- Burger (mobile) -->
        <button @click="menuOpen = !menuOpen" class="text-white p-1 lg:hidden">
          <Icon :name="menuOpen ? 'mdi:close' : 'mdi:menu'" class="text-2xl" />
        </button>
      </div>
    </div>

  <!-- Currency modal — centered -->
  <transition name="t2-curr-modal">
    <div v-if="currencyOpen"
      class="fixed inset-0 z-[70] flex items-center justify-center p-4"
      @click.self="currencyOpen = false">
      <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="currencyOpen = false"></div>

      <div class="relative z-10 w-full max-w-sm bg-[#111] shadow-2xl flex flex-col max-h-[80vh]">
        <!-- Header -->
        <div class="flex items-center justify-between px-8 py-6 border-b border-white/10 flex-shrink-0">
          <h3 class="font-['Cormorant_Garamond'] text-white text-2xl font-light">Currency</h3>
          <button @click="currencyOpen = false" class="text-white/40 hover:text-white transition-colors">
            <Icon name="mdi:close" class="text-xl" />
          </button>
        </div>
        <!-- Search -->
        <div class="px-8 py-5 border-b border-white/10 flex-shrink-0">
          <input v-model="currSearch" type="text" placeholder="Search currency..."
            class="w-full bg-transparent border-b border-white/20 text-white text-sm py-2 placeholder:text-white/30 focus:outline-none focus:border-[#C9A96E] transition-colors" />
        </div>
        <!-- List -->
        <div class="flex-1 overflow-y-auto">
          <button v-for="c in filteredCurr" :key="c.cCode"
            @click="selectCurrency(c.cCode)"
            class="w-full flex items-center justify-between px-8 py-4 border-b border-white/5 transition-colors"
            :class="selectedCurrency === c.cCode
              ? 'text-[#C9A96E] bg-white/5'
              : 'text-white/60 hover:text-white hover:bg-white/5'">
            <span class="text-sm font-medium">{{ c.cCode }}</span>
            <span class="text-xs capitalize text-white/30">{{ c.cNom }}</span>
          </button>
          <div v-if="!filteredCurr.length" class="px-8 py-10 text-center text-white/30 text-sm">
            No currencies found.
          </div>
        </div>
      </div>
    </div>
  </transition>

    <!-- Mobile menu -->
    <transition name="t2-menu">
      <div v-if="menuOpen" class="lg:hidden bg-black border-t border-white/10 py-8 px-8">
        <nav class="flex flex-col gap-6">
          <NuxtLink v-for="item in navItems" :key="item.key"
            :to="localePath(item.path)"
            @click="menuOpen = false"
            class="text-white text-sm uppercase tracking-[0.2em] hover:text-[#C9A96E] transition-colors">
            {{ item.label }}
          </NuxtLink>
        </nav>
        <div class="mt-8 pt-8 border-t border-white/10 flex items-center gap-6">
          <LanguageSwitcher class="text-white/70 text-sm" />
          <button @click="menuOpen = false; currencyOpen = true"
            class="flex items-center gap-1.5 text-white/70 text-sm uppercase tracking-[0.15em] hover:text-white transition-colors">
            {{ selectedCurrency }}
            <Icon name="mdi:chevron-down" class="text-xs" />
          </button>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const { locale, localePath } = useLocale()
const selectedCurrency = useCurrency()

const scrolled      = ref(false)
const menuOpen      = ref(false)
const currencyOpen  = ref(false)
const currSearch    = ref('')
const info          = ref({ name: '', logo: null, category: 5 })
const currencies    = ref([])

const t = ref({ rooms: 'Rooms & Suites', dining: 'Dining', services: 'Activities & Wellness', gallery: 'Gallery', contact: 'Contact', facilities: 'Facilities', surroundings: 'Surroundings', reviews: 'Reviews' })

const stars = computed(() => Array.from({ length: info.value.category || 5 }))

const filteredCurr = computed(() => {
  const q = currSearch.value.toLowerCase()
  return q
    ? currencies.value.filter(c => c.cCode.toLowerCase().includes(q) || (c.cNom || '').toLowerCase().includes(q))
    : currencies.value
})

const selectCurrency = (code) => {
  selectedCurrency.value = code
  currencyOpen.value = false
  currSearch.value = ''
}

const KEYS = ['noschambres', 'dining', 'services', 'gallery', 'contact', 'facilities', 'surroundings', 'reviews']

onMounted(async () => {
  const { fetchCurrencies, fetchHotelInfo } = useHotel()
  
  const { loadCatalogue: lc, transStatic: ts } = useTranslations()
  const [hotelInfo, catalogue, currList] = await Promise.all([
    fetchHotelInfo(), lc(locale.value), fetchCurrencies(),
  ])
  info.value = hotelInfo
  currencies.value = currList || []
  const tr = {}
  for (const k of KEYS) tr[k] = ts(k, catalogue)
  t.value = {
    rooms:        tr.noschambres   || 'Rooms & Suites',
    // dining:       tr.dining        || 'Dining',
    services:     tr.services      || 'Activities & Wellness',
    gallery:      tr.gallery       || 'Gallery',
    contact:      tr.contact       || 'Contact',
    facilities:   tr.facilities    || 'Facilities',
    surroundings: tr.surroundings  || 'Surroundings',
    reviews:      tr.reviews       || 'Reviews',
  }
  window.addEventListener('scroll', handleScroll)
  handleScroll()
})
onUnmounted(() => window.removeEventListener('scroll', handleScroll))

const handleScroll = () => { scrolled.value = window.scrollY > 60 }

const navItems = computed(() => [
  { key: 'rooms',        path: '/rooms',        label: t.value.rooms        },
  // { key: 'dining',       path: '/dining',       label: t.value.dining       },
  { key: 'services',     path: '/services',     label: t.value.services     },
  { key: 'facilities',   path: '/facilities',   label: t.value.facilities   },
  { key: 'surroundings', path: '/surroundings', label: t.value.surroundings },
  { key: 'reviews',      path: '/reviews',      label: t.value.reviews      },
  { key: 'gallery',      path: '/gallery',      label: t.value.gallery      },
  { key: 'contact',      path: '/contact',      label: t.value.contact      },
])
</script>

<style scoped>
.t2-menu-enter-active, .t2-menu-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.t2-menu-enter-from, .t2-menu-leave-to { opacity: 0; transform: translateY(-8px); }

/* Currency panel — slide from right */
.t2-panel-enter-active, .t2-panel-leave-active { transition: opacity 0.35s ease; }
.t2-panel-enter-active > :last-child, .t2-panel-leave-active > :last-child { transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1); }
.t2-panel-enter-from, .t2-panel-leave-to { opacity: 0; }
.t2-panel-enter-from > :last-child, .t2-panel-leave-to > :last-child { transform: translateX(100%); }
</style>
