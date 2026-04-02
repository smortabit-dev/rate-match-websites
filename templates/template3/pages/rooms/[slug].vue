<template>
  <div class="bg-[#f4ece6]">
    <TheHeader />

    <!-- Loading -->
    <div v-if="!room" class="flex items-center justify-center min-h-screen">
      <div class="w-10 h-10 border-2 border-[#b7825c] border-t-transparent rounded-full animate-spin"></div>
    </div>

    <template v-else>

      <!-- ① HERO: full-screen image + name overlay -->
      <section class="relative h-[60vh] overflow-hidden bg-[#1a1410]">
        <transition name="t3-fade">
          <img :key="activeIdx" :src="images[activeIdx]" :alt="room.name"
            class="absolute inset-0 w-full h-full object-cover" />
        </transition>
        <!-- Gradient layers -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30 pointer-events-none"></div>

        <!-- Bottom-left: breadcrumb + name -->
        <div class="absolute bottom-0 left-0 px-10 sm:px-16 pb-12 z-10">
          <nav class="flex items-center gap-2 text-white/40 text-[10px] tracking-[0.15em] uppercase mb-5">
            <NuxtLink :to="localePath('/')" class="hover:text-[#b7825c] transition-colors">{{ t.accueil || 'Accueil' }}</NuxtLink>
            <span>/</span>
            <NuxtLink :to="localePath('/rooms')" class="hover:text-[#b7825c] transition-colors">{{ t.chambres || 'Chambres' }}</NuxtLink>
            <span>/</span>
            <span class="text-white/70">{{ room.name }}</span>
          </nav>
          <p v-if="room.category" class="font-['Cormorant_Garamond'] italic text-[#b7825c] text-lg mb-2">{{ room.category }}</p>
          <h1 class="font-['Cormorant_Garamond'] text-5xl sm:text-6xl lg:text-7xl text-white font-light leading-none">
            {{ room.name }}
          </h1>
        </div>

        <!-- Image counter bottom-right -->
        <div class="absolute bottom-12 right-10 sm:right-16 z-10 flex items-center gap-4">
          <button @click="prevImg" class="text-white/60 hover:text-white transition-colors">
            <Icon name="mdi:arrow-left" class="text-lg" />
          </button>
          <span class="text-white/40 text-xs tracking-[0.15em]">{{ activeIdx + 1 }} / {{ images.length }}</span>
          <button @click="nextImg" class="text-white/60 hover:text-white transition-colors">
            <Icon name="mdi:arrow-right" class="text-lg" />
          </button>
        </div>

        <!-- Scroll indicator -->
        <!-- <div class="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1">
          <div class="w-px h-8 bg-gradient-to-b from-transparent to-white/30"></div>
          <Icon name="mdi:arrow-down" class="text-white/30 text-sm animate-bounce" />
        </div> -->
      </section>

      <!-- ② SPECS BAR -->
      <div class="bg-[#f1e5de]">
        <div class="max-w-6xl mx-auto px-8 py-6 grid grid-cols-2 sm:grid-cols-4 divide-x divide-white/8">
          <div v-for="spec in specs" :key="spec.label" class="flex items-center gap-3 px-6 first:pl-0 last:pr-0">
            <Icon :name="spec.icon" class="text-[#b7825c] text-xl flex-shrink-0" />
            <div>
              <p class="text-black text-sm font-light">{{ spec.value }}</p>
              <p class="text-black/50 text-[10px] uppercase tracking-[0.15em]">{{ spec.label }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ③ MAIN CONTENT -->
      <div class="max-w-6xl mx-auto px-8 sm:px-12 py-20 grid grid-cols-1 lg:grid-cols-3 gap-16">

        <!-- Left: description + amenities -->
        <div class="lg:col-span-2">

          <!-- Description -->
          <p class="font-['Cormorant_Garamond'] italic text-[#b7825c] text-base tracking-wide mb-3">{{ t.description || 'Description' }}</p>
          <h2 class="font-['Cormorant_Garamond'] text-3xl sm:text-4xl text-[#1a1410] font-light mb-6">{{ room.name }}</h2>
          <p class="text-[#1a1410]/60 leading-loose text-sm sm:text-base mb-14">
            {{ room.longDescription || room.description }}
          </p>

          <!-- Bed + guests -->
          <div class="flex items-center gap-6 mb-14 pb-14 border-b border-[#1a1410]/8">
            <div class="flex items-center gap-2 text-[#1a1410]/60 text-sm">
              <Icon name="mdi:bed-king-outline" class="text-[#b7825c] text-xl" />
              <span>{{ room.bedType || room.beds || '—' }}</span>
            </div>
            <div v-if="room.guests" class="flex items-center gap-1.5">
              <Icon v-for="g in guestCount" :key="g" name="mdi:account-outline" class="text-[#1a1410]/35 text-xl" />
            </div>
          </div>

          <!-- Amenities grid -->
          <div v-if="room.features?.length">
            <p class="font-['Cormorant_Garamond'] italic text-[#b7825c] text-base tracking-wide mb-6">{{ t.amenities || 'Équipements' }}</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-0 border-t border-l border-[#1a1410]/8">
              <div v-for="feat in room.features" :key="feat"
                class="flex items-center gap-4 px-5 py-4 border-b border-r border-[#1a1410]/8 hover:bg-[#1a1410]/2 transition-colors">
                <div class="w-9 h-9 flex items-center justify-center bg-[#f5ede3] flex-shrink-0">
                  <Icon :name="amenityIcon(feat)" class="text-[#b7825c] text-base" />
                </div>
                <span class="text-[#1a1410]/65 text-sm">{{ feat }}</span>
              </div>
            </div>
          </div>

          <!-- Policy -->
          <p v-if="room.policy || room.childPolicy"
            class="font-['Cormorant_Garamond'] italic text-[#1a1410]/35 text-sm leading-relaxed mt-10">
            *{{ room.policy || room.childPolicy }}
          </p>
        </div>

        <!-- Right: sticky booking card -->
        <div class="lg:col-span-1">
          <div class="sticky top-28">
            <!-- Price block -->
            <div class="bg-[#f1e5de] p-8 mb-0">
              <p class="text-[9px] uppercase tracking-[0.3em] text-[#b7825c] mb-1">{{ t.from || 'À partir de' }}</p>
              <p v-if="room.price" class="font-['Cormorant_Garamond'] text-black text-5xl font-light leading-none mb-1">
                {{ room.price }}
              </p>
              <p v-if="room.price" class="text-black/50 text-xs tracking-[0.1em] mt-2">{{ t.perNight || '/ nuit, taxes incluses' }}</p>
            </div>

            <!-- CTA -->
            <NuxtLink :to="localePath('/availibility')"
              class="block text-center py-5 bg-[#b7825c] text-white text-[11px] uppercase tracking-[0.3em] hover:bg-[#9a6a48] transition-all">
              {{ t.reserver || 'Réservez' }}
            </NuxtLink>

            <!-- Contact -->
            <NuxtLink :to="localePath('/contact')"
              class="block text-center py-4 border border-[#1a1410]/15 text-[#1a1410]/50 text-[10px] uppercase tracking-[0.2em] hover:border-[#b7825c] hover:text-[#b7825c] transition-all mt-3">
              {{ t.question || 'Une question ?' }}
            </NuxtLink>

            <!-- Hotel phone -->
            <div v-if="hotelPhone" class="flex items-center justify-center gap-2 mt-6 text-[#1a1410]/40 text-sm">
              <Icon name="mdi:phone" class="text-[#b7825c] text-base" />
              <a :href="`tel:${hotelPhone}`" class="hover:text-[#b7825c] transition-colors">{{ hotelPhone }}</a>
            </div>
          </div>
        </div>

      </div>

      <!-- ④ PHOTO STRIP -->
      <!-- <div v-if="images.length > 1" class="pb-20">
        <div class="flex gap-3 overflow-x-auto px-8 sm:px-12 scrollbar-hide snap-x snap-mandatory">
          <button v-for="(img, i) in images" :key="i"
            @click="activeIdx = i; scrollToTop()"
            class="flex-shrink-0 snap-start overflow-hidden transition-all duration-300"
            :class="activeIdx === i ? 'ring-2 ring-[#b7825c] ring-offset-2 ring-offset-[#fbf8f6]' : 'opacity-60 hover:opacity-100'">
            <img :src="img" :alt="`${room.name} ${i + 1}`"
              class="w-40 sm:w-56 h-28 sm:h-36 object-cover" loading="lazy" />
          </button>
        </div>
      </div> -->

      <!-- ⑤ DARK CTA BAR -->
      <!-- <div class="bg-[#1a1410] py-16 px-8 text-center">
        <p class="font-['Cormorant_Garamond'] italic text-[#b7825c] text-base mb-3">{{ room.name }}</p>
        <h3 class="font-['Cormorant_Garamond'] text-3xl sm:text-4xl text-white font-light mb-8">
          {{ t.ctaTitle || 'Réservez votre séjour d\'exception' }}
        </h3>
        <NuxtLink :to="localePath('/availibility')"
          class="inline-block px-10 py-4 border border-[#b7825c] text-[#b7825c] text-[11px] uppercase tracking-[0.3em] hover:bg-[#b7825c] hover:text-white transition-all">
          {{ t.reserver || 'Réservez' }}
        </NuxtLink>
      </div> -->

    </template>

    <TheFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import TheHeader from '../../components/TheHeader.vue'
import TheFooter from '../../components/TheFooter.vue'

const route = useRoute()
const { locale, localePath } = useLocale()
const room       = ref(null)
const activeIdx  = ref(0)
const hotelPhone = ref('')
const t          = ref({})

const images = computed(() => {
  if (!room.value) return []
  const imgs = [...(room.value.images || [])]
  if (!imgs.length && room.value.image) imgs.push(room.value.image)
  return imgs
})

const prevImg = () => { activeIdx.value = activeIdx.value > 0 ? activeIdx.value - 1 : images.value.length - 1 }
const nextImg = () => { activeIdx.value = activeIdx.value < images.value.length - 1 ? activeIdx.value + 1 : 0 }

const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

const guestCount = computed(() => {
  const n = parseInt(room.value?.guests || room.value?.maxGuests || 2)
  return isNaN(n) ? 2 : Math.min(n, 5)
})

const specs = computed(() => {
  if (!room.value) return []
  const s = []
  if (room.value.size)    s.push({ icon: 'mdi:resize',         value: `${room.value.size} m²`, label: t.value.surface   || 'Surface'  })
  if (room.value.guests)  s.push({ icon: 'mdi:account-group',  value: room.value.guests,       label: t.value.guests    || 'Capacité' })
  if (room.value.bedType) s.push({ icon: 'mdi:bed-king-outline',value: room.value.bedType,      label: t.value.litLabel  || 'Lit'      })
  if (room.value.view)    s.push({ icon: 'mdi:image-filter-hdr',value: room.value.view,         label: t.value.viewLabel || 'Vue'      })
  return s
})

const amenityIcon = (feat) => {
  const f = feat.toLowerCase()
  if (f.includes('superficie') || f.includes('m²'))              return 'mdi:resize'
  if (f.includes('terrasse') || f.includes('balcon'))            return 'mdi:balcony'
  if (f.includes('bain') || f.includes('douche'))                return 'mdi:shower'
  if (f.includes('clim'))                                        return 'mdi:air-conditioner'
  if (f.includes('thé') || f.includes('café'))                  return 'mdi:coffee'
  if (f.includes('cheveux') || f.includes('sèche'))             return 'mdi:hair-dryer'
  if (f.includes('télé') || f.includes('tv'))                   return 'mdi:television'
  if (f.includes('wifi') || f.includes('wi-fi'))                return 'mdi:wifi'
  if (f.includes('insonoris'))                                   return 'mdi:volume-off'
  if (f.includes('minibar') || f.includes('mini-bar'))          return 'mdi:fridge-outline'
  if (f.includes('coffre') || f.includes('safe'))               return 'mdi:safe'
  if (f.includes('fum') || f.includes('smok'))                  return 'mdi:smoking-off'
  if (f.includes('piscine') || f.includes('pool'))              return 'mdi:pool'
  if (f.includes('vue') || f.includes('view'))                  return 'mdi:image-filter-hdr'
  if (f.includes('jardin') || f.includes('garden'))             return 'mdi:flower'
  if (f.includes('parking'))                                    return 'mdi:parking'
  if (f.includes('chauffage'))                                  return 'mdi:radiator'
  return 'mdi:check-circle-outline'
}

onMounted(async () => {
  const { fetchRooms, fetchHotelInfo } = useHotel()
  const { loadCatalogue, transStatic } = useTranslations()
  const [rooms, hotelInfo, catalogue] = await Promise.all([
    fetchRooms(locale.value),
    fetchHotelInfo(),
    loadCatalogue(locale.value),
  ])
  room.value   = rooms.find(r => r.slug === route.params.slug) || null
  hotelPhone.value = hotelInfo.phone || ''
  t.value = {
    accueil:     transStatic('accueil',     catalogue) || 'Accueil',
    chambres:    transStatic('noschambres', catalogue) || 'Chambres',
    description: transStatic('description', catalogue) || 'Description',
    amenities:   transStatic('equipements', catalogue) || 'Équipements',
    from:        transStatic('aPartirDe',   catalogue) || 'À partir de',
    perNight:    transStatic('perNight',    catalogue) || '/ nuit, taxes incluses',
    reserver:    transStatic('reserver',    catalogue) || 'Réservez',
    question:    transStatic('question',    catalogue) || 'Une question ?',
    ctaTitle:    transStatic('ctaTitle',    catalogue) || "Réservez votre séjour d'exception",
    surface:     transStatic('surface',     catalogue) || 'Surface',
    guests:      transStatic('guests',      catalogue) || 'Capacité',
    litLabel:    transStatic('lit',         catalogue) || 'Lit',
    viewLabel:   transStatic('vue',         catalogue) || 'Vue',
  }
})
</script>

<style scoped>
.t3-fade-enter-active, .t3-fade-leave-active { transition: opacity 0.7s ease; }
.t3-fade-enter-from, .t3-fade-leave-to       { opacity: 0; }
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
