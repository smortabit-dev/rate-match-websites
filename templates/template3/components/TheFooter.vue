<template>
  <footer class="bg-[#f1e5de] border-t border-[#e8d6ca]">

    <!-- Top: brand block -->
    <div class="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 pt-16 pb-10">
      <div class="mb-6">
        <!-- Logo -->
        <div class="flex items-center gap-3 mb-1">
          <img v-if="info.logo" :src="info.logo" :alt="info.name" class="h-12 w-auto" />
          <span v-else class="font-['Cormorant_Garamond'] text-[#1a1410] text-3xl font-light tracking-wide">{{ info.name }}</span>
        </div>
        <p class="font-['Cormorant_Garamond'] italic text-[#1a1410]/50 text-sm">{{ subtitle }}</p>
      </div>

      <!-- Stars -->
      <div class="flex items-center gap-1 mb-4">
        <svg v-for="s in starCount" :key="s" class="w-4 h-4 text-[#f5c518]" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      </div>

      <!-- Description with alternating word colors -->
      <p class="text-sm leading-loose max-w-lg mb-5">
        <template v-for="(word, i) in descWords" :key="i">
          <span :class="i % 5 === 2 ? 'text-[#b7825c]' : i % 5 === 4 ? 'text-[#7a2c28]' : 'text-[#1a1410]/70'">{{ word }}</span>
          <span v-if="i < descWords.length - 1"> </span>
        </template>
      </p>

      <!-- Social icons -->
      <div class="flex items-center gap-3">
        <a v-for="s in info.socials" :key="s.key" :href="s.url" target="_blank" rel="noopener noreferrer"
          class="text-[#1a1410]/60 hover:text-[#b7825c] transition-colors">
          <Icon :name="s.icon" class="text-2xl" />
        </a>
        <!-- Fallback icons if no socials -->
        <template v-if="!info.socials?.length">
          <a href="#" class="text-[#1a1410]/50 hover:text-[#b7825c] transition-colors"><Icon name="mdi:facebook" class="text-2xl" /></a>
          <a href="#" class="text-[#1a1410]/50 hover:text-[#b7825c] transition-colors"><Icon name="mdi:instagram" class="text-2xl" /></a>
        </template>
      </div>
    </div>

    <!-- Divider -->
    <div class="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16">
      <div class="border-t border-[#1a1410]/10"></div>
    </div>

    <!-- Nav columns -->
    <div class="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 py-12 grid grid-cols-2 md:grid-cols-4 gap-10">

      <!-- L'HÔTEL -->
      <div>
        <h4 class="text-[10px] uppercase tracking-[0.25em] text-[#b7825c] font-semibold mb-6">{{ t.lhotel || "L'Hôtel" }}</h4>
        <ul class="space-y-3">
          <li v-for="(link, i) in hotelLinks" :key="link.path">
            <NuxtLink :to="localePath(link.path)"
              :class="i % 2 === 0 ? 'text-[#1a1410]/70' : 'text-[#b7825c]'"
              class="font-['Cormorant_Garamond'] italic text-base hover:text-[#7a2c28] transition-colors">
              {{ link.label }}
            </NuxtLink>
          </li>
        </ul>
      </div>

      <!-- CHAMBRES ET SUITES -->
      <div>
        <h4 class="text-[10px] uppercase tracking-[0.25em] text-[#b7825c] font-semibold mb-6">{{ t.chambressuites || 'Chambres et Suites' }}</h4>
        <ul class="space-y-3">
          <li>
            <NuxtLink :to="localePath('/rooms')"
              class="font-['Cormorant_Garamond'] italic text-base text-[#1a1410]/70 hover:text-[#b7825c] transition-colors">
              {{ t.vueEnsemble || 'Vue d\'ensemble' }}
            </NuxtLink>
          </li>
          <li v-for="(room, i) in rooms" :key="room.id">
            <NuxtLink :to="localePath(`/rooms/${room.slug}`)"
              :class="i % 2 === 0 ? 'text-[#b7825c]' : 'text-[#1a1410]/70'"
              class="font-['Cormorant_Garamond'] italic text-base hover:text-[#7a2c28] transition-colors">
              {{ room.name }}
            </NuxtLink>
          </li>
        </ul>
      </div>

      <!-- EXPÉRIENCES -->
      <div>
        <h4 class="text-[10px] uppercase tracking-[0.25em] text-[#b7825c] font-semibold mb-6">{{ t.experiences || 'Expériences' }}</h4>
        <ul class="space-y-3">
          <li v-for="(link, i) in experienceLinks" :key="link.path">
            <NuxtLink :to="localePath(link.path)"
              :class="i % 2 === 0 ? 'text-[#1a1410]/70' : 'text-[#b7825c]'"
              class="font-['Cormorant_Garamond'] italic text-base hover:text-[#7a2c28] transition-colors">
              {{ link.label }}
            </NuxtLink>
          </li>
        </ul>
      </div>

      <!-- INFOS PRATIQUES -->
      <div>
        <h4 class="text-[10px] uppercase tracking-[0.25em] text-[#b7825c] font-semibold mb-6">{{ t.infosPratiques || 'Infos Pratiques' }}</h4>
        <ul class="space-y-3">
          <li v-for="(link, i) in infoLinks" :key="link.path || link.label">
            <NuxtLink v-if="link.path" :to="localePath(link.path)"
              :class="i % 2 === 0 ? 'text-[#1a1410]/70' : 'text-[#b7825c]'"
              class="font-['Cormorant_Garamond'] italic text-base hover:text-[#7a2c28] transition-colors">
              {{ link.label }}
            </NuxtLink>
            <span v-else
              :class="i % 2 === 0 ? 'text-[#1a1410]/70' : 'text-[#b7825c]'"
              class="font-['Cormorant_Garamond'] italic text-base">
              {{ link.label }}
            </span>
          </li>
        </ul>
      </div>

    </div>

    <!-- Bottom bar -->
    <div class="border-t border-[#1a1410]/8">
      <div class="max-w-7xl mx-auto px-8 py-5 text-center">
        <p class="font-['Cormorant_Garamond'] italic text-[#1a1410]/40 text-sm">
          {{ info.name }} &copy; {{ new Date().getFullYear() }}
        </p>
      </div>
    </div>

  </footer>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const { locale, localePath } = useLocale()
const info     = ref({ name: '', logo: null, address: '', city: '', country: '', phone: '', emails: '', socials: [] })
const subtitle = ref('Boutique Hôtel & Spa')
const starCount = ref(5)
const description = ref('')
const rooms    = ref([])
const t        = ref({})

const descWords = computed(() => description.value.split(' ').filter(Boolean))

const hotelLinks = computed(() => [
  { path: '/',          label: t.value.accueil      || 'Accueil'         },
  { path: '/gallery',   label: t.value.galerie       || 'Galerie photos'  },
  { path: '/reviews',   label: t.value.avis          || 'Avis clients'    },
  { path: '/contact',   label: t.value.contact       || 'Contact'         },
])

const experienceLinks = computed(() => [
  { path: '/services',     label: t.value.services     || 'Services & Spa'      },
  { path: '/facilities',   label: t.value.facilities   || 'Équipements'         },
  { path: '/surroundings', label: t.value.surroundings || 'Aux alentours'       },
])

const infoLinks = computed(() => [
  { path: '/contact', label: t.value.contactAcces || 'Contact et accès' },
  { path: '/availibility', label: t.value.reserver || 'Réservation'     },
])

onMounted(async () => {
  const { fetchHotelInfo, fetchHotelData, fetchRooms } = useHotel()
  const { loadCatalogue, transStatic } = useTranslations()
  const [hotelInfo, hotelData, apiRooms, catalogue] = await Promise.all([
    fetchHotelInfo(),
    fetchHotelData(),
    fetchRooms(locale.value),
    loadCatalogue(locale.value),
  ])
  info.value    = hotelInfo
  starCount.value = parseInt(hotelInfo.stars || hotelInfo.starRating || 5) || 5
  const etab    = hotelData?.etablissment || hotelData?.etablissement || {}
  subtitle.value    = etab.etabSlogan || etab.slogan || 'Boutique Hôtel & Spa'
  description.value = etab.descriptionFr || etab.descriptionEn || etab.description || ''
  rooms.value   = (apiRooms || []).filter(r =>
    r.img?.length > 0 &&
    r.isBookingBasic !== true
  ).slice(0, 8)
  t.value = {
    lhotel:         transStatic('lhotel',         catalogue) || "L'Hôtel",
    chambressuites: transStatic('chambressuites', catalogue) || 'Chambres et Suites',
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
    reserver:       transStatic('reserver',       catalogue) || 'Réservation',
    vueEnsemble:    transStatic('vueEnsemble',    catalogue) || "Vue d'ensemble",
  }
})
</script>
