<template>
  <header class="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
    :class="scrolled ? 'bg-[#231810]/50 backdrop-blur-sm' : 'bg-transparent'">
    <div class="relative max-w-[1400px] mx-auto px-6 sm:px-10 h-[68px] flex items-center justify-between">

      <!-- Left: Burger + short nav -->
      <div class="flex items-center gap-4">
        <button @click="menuOpen = !menuOpen"
          class="text-white/80 hover:text-white transition-colors flex-shrink-0 p-1">
          <Icon :name="menuOpen ? 'mdi:close' : 'mdi:menu'" class="text-xl" />
        </button>
        <nav class="hidden lg:flex items-center">
          <template v-for="(item, i) in shortNav" :key="item.key">
            <NuxtLink :to="localePath(item.path)"
              class="text-[10px] uppercase tracking-[0.2em] text-white/70 hover:text-white transition-colors whitespace-nowrap px-3">
              {{ item.label }}
            </NuxtLink>
            <span class="text-white/20 text-xs">|</span>
          </template>
          <!-- Language -->
          <T3LanguageSwitcher class="px-3" />
          <span class="text-white/20 text-xs">|</span>
          <!-- Currency -->
          <span class="text-[10px] uppercase tracking-[0.2em] text-white/70 px-3">{{ currency }}</span>
        </nav>
      </div>

      <!-- Center: Logo (absolute centered) -->
      <NuxtLink :to="localePath('/')"
        class="absolute left-1/2 -translate-x-1/2 top-[13px] -translate-y-1 flex items-center justify-center transition-all duration-500"
        :style="{ height: scrolled ? '50px' : '150px' }">
        <img v-if="info.logo" :src="info.logo" :alt="info.name"
          class="h-full w-auto object-contain transition-all duration-500" />
        <span v-else class="font-['Cormorant_Garamond'] text-white font-light tracking-[0.35em] uppercase whitespace-nowrap transition-all duration-500"
          :class="scrolled ? 'text-xl' : 'text-3xl'">
          {{ info.name || 'Hotel' }}
        </span>
      </NuxtLink>

      <!-- Right: Phone + RÉSERVEZ -->
      <div class="flex items-center justify-end gap-4 sm:gap-5">
        <a v-if="info.phone" :href="`tel:${info.phone}`"
          class="hidden md:flex items-center gap-2 text-white/70 hover:text-white transition-colors">
          <Icon name="mdi:phone" class="text-sm text-white/50" />
          <span class="text-[11px] tracking-[0.04em]">{{ info.phone }}</span>
        </a>
        <NuxtLink :to="localePath('/availibility')"
          class="hidden sm:inline-block px-5 py-2 border border-white/60 text-white text-[10px] uppercase tracking-[0.25em] hover:bg-white hover:text-[#0e1e27] transition-all">
          {{ t.reserver || 'Réservez' }}
        </NuxtLink>
        <T3LanguageSwitcher class="sm:hidden" />
      </div>
    </div>

    <!-- Mega-menu dropdown -->
    <transition name="t3-menu">
      <div v-if="menuOpen" class="absolute top-full left-0 right-0 bg-white shadow-xl z-40 border-t border-[#e8e0d8]"
           @click.self="menuOpen = false">
        <div class="max-w-[1400px] mx-auto px-6 sm:px-10 py-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">

          <!-- L'HÔTEL -->
          <div>
            <h4 class="text-[10px] uppercase tracking-[0.2em] text-[#1a1410] font-semibold border-b border-[#b7825c] pb-2 mb-5">
              {{ t.lhotel || "L'Hôtel" }}
            </h4>
            <ul class="space-y-3">
              <li v-for="link in hotelLinks" :key="link.path">
                <NuxtLink :to="localePath(link.path)" @click="menuOpen = false"
                  class="text-sm text-[#1a1410]/70 hover:text-[#b7825c] transition-colors font-['Cormorant_Garamond'] italic text-base">
                  {{ link.label }}
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- CHAMBRES ET SUITES -->
          <div>
            <h4 class="text-[10px] uppercase tracking-[0.2em] text-[#1a1410] font-semibold border-b border-[#b7825c] pb-2 mb-5">
              {{ t.chambressuites || 'Chambres et Suites' }}
            </h4>
            <ul class="space-y-3">
              <li>
                <NuxtLink :to="localePath('/rooms')" @click="menuOpen = false"
                  class="font-['Cormorant_Garamond'] italic text-base text-[#1a1410]/70 hover:text-[#b7825c] transition-colors">
                  {{ t.vueEnsemble || "Vue d'ensemble" }}
                </NuxtLink>
              </li>
              <li v-for="room in rooms" :key="room.id">
                <NuxtLink :to="localePath(`/rooms/${room.slug}`)" @click="menuOpen = false"
                  class="font-['Cormorant_Garamond'] italic text-base text-[#1a1410]/70 hover:text-[#b7825c] transition-colors">
                  {{ room.name }}
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- EXPÉRIENCES -->
          <div>
            <h4 class="text-[10px] uppercase tracking-[0.2em] text-[#1a1410] font-semibold border-b border-[#b7825c] pb-2 mb-5">
              {{ t.experiences || 'Expériences' }}
            </h4>
            <ul class="space-y-3">
              <li v-for="link in expLinks" :key="link.path">
                <NuxtLink :to="localePath(link.path)" @click="menuOpen = false"
                  class="font-['Cormorant_Garamond'] italic text-base text-[#1a1410]/70 hover:text-[#b7825c] transition-colors">
                  {{ link.label }}
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- INFOS PRATIQUES -->
          <div>
            <h4 class="text-[10px] uppercase tracking-[0.2em] text-[#1a1410] font-semibold border-b border-[#b7825c] pb-2 mb-5">
              {{ t.infosPratiques || 'Infos Pratiques' }}
            </h4>
            <ul class="space-y-3">
              <li v-for="link in infoLinks" :key="link.path">
                <NuxtLink :to="localePath(link.path)" @click="menuOpen = false"
                  class="font-['Cormorant_Garamond'] italic text-base text-[#1a1410]/70 hover:text-[#b7825c] transition-colors">
                  {{ link.label }}
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Book CTA column -->
          <div class="hidden lg:flex flex-col justify-between border-l border-[#1a1410]/8 pl-8">
            <div>
              <p class="font-['Cormorant_Garamond'] text-2xl italic text-[#1a1410] font-light mb-4">{{ info.name }}</p>
              <a v-if="info.phone" :href="`tel:${info.phone}`"
                class="flex items-center gap-2 text-[#1a1410]/50 text-sm hover:text-[#b7825c] transition-colors mb-6">
                <Icon name="mdi:phone" class="text-[#b7825c]" />
                {{ info.phone }}
              </a>
            </div>
            <NuxtLink :to="localePath('/availibility')" @click="menuOpen = false"
              class="inline-block text-center px-6 py-3 border border-[#1a1410] text-[#1a1410] text-[10px] uppercase tracking-[0.25em] hover:bg-[#0e1e27] hover:text-white hover:border-[#0e1e27] transition-all">
              {{ t.reserver || 'Réservez' }}
            </NuxtLink>
          </div>

        </div>
      </div>
    </transition>

    <!-- Click-outside overlay -->
    <div v-if="menuOpen" class="fixed inset-0 z-30" @click="menuOpen = false"></div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const { locale, localePath } = useLocale()
const menuOpen = ref(false)
const scrolled = ref(false)
const info     = ref({ name: '', logo: null, phone: '' })
const rooms    = ref([])
const t        = ref({})
const currency = ref('EUR')

const shortNav = computed(() => [
  { key: 'hotel',  path: '/',      label: t.value.lhotel        || "L'Hôtel"     },
  { key: 'rooms',  path: '/rooms', label: t.value.chambressuites || 'Hébergement' },
])

const hotelLinks = computed(() => [
  { path: '/',        label: t.value.accueil  || 'Accueil'        },
  { path: '/gallery', label: t.value.galerie  || 'Galerie photos' },
  { path: '/reviews', label: t.value.avis     || 'Avis clients'   },
  { path: '/contact', label: t.value.contact  || 'Contact'        },
])

const expLinks = computed(() => [
  { path: '/services',     label: t.value.services     || 'Services & Spa'  },
  { path: '/facilities',   label: t.value.facilities   || 'Équipements'     },
  { path: '/surroundings', label: t.value.surroundings || 'Aux alentours'   },
])

const infoLinks = computed(() => [
  { path: '/contact',      label: t.value.contactAcces || 'Contact et accès' },
  { path: '/availibility', label: t.value.reserver     || 'Réservation'      },
])

onMounted(async () => {
  const { fetchHotelInfo, fetchRooms } = useHotel()
  const { loadCatalogue, transStatic } = useTranslations()
  const [hotelInfo, apiRooms, catalogue] = await Promise.all([
    fetchHotelInfo(),
    fetchRooms(locale.value),
    loadCatalogue(locale.value),
  ])
  info.value  = hotelInfo
  rooms.value = (apiRooms || []).filter(r =>
    r.img?.length > 0 &&
    r.isBookingBasic !== true
  ).slice(0, 8)
  currency.value = hotelInfo.currency || 'EUR'
  window.addEventListener('scroll', handleScroll)
  handleScroll()
  t.value = {
    lhotel:         transStatic('lhotel',         catalogue) || "L'Hôtel",
    chambressuites: transStatic('chambressuites', catalogue) || 'Hébergement',
    experiences:    transStatic('experiences',    catalogue) || 'Expériences',
    infosPratiques: transStatic('infosPratiques', catalogue) || 'Infos Pratiques',
    accueil:        transStatic('accueil',        catalogue) || 'Accueil',
    galerie:        transStatic('gallery',        catalogue) || 'Galerie photos',
    avis:           transStatic('reviews',        catalogue) || 'Avis clients',
    contact:        transStatic('contact',        catalogue) || 'Contact',
    services:       transStatic('services',       catalogue) || 'Services & Spa',
    facilities:     transStatic('facilities',     catalogue) || 'Équipements',
    surroundings:   transStatic('surroundings',   catalogue) || 'Aux alentours',
    contactAcces:   transStatic('contactAcces',   catalogue) || 'Contact et accès',
    reserver:       transStatic('reserver',       catalogue) || 'Réservez',
    vueEnsemble:    transStatic('vueEnsemble',    catalogue) || "Vue d'ensemble",
  }
})
const handleScroll = () => { scrolled.value = window.scrollY > 60 }
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<style scoped>
.t3-menu-enter-active, .t3-menu-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.t3-menu-enter-from, .t3-menu-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
