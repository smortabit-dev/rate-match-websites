<template>
  <section class="py-16 sm:py-24 bg-stone-100">
    <div class="container mx-auto px-4 sm:px-6">


      <!-- Header: subtitle+title (left) | group filters (right) -->
      <div class="flex flex-col md:flex-row md:items-end md:justify-between mb-10 sm:mb-16">

        <!-- Left -->
        <div>
          <p class="section-subtitle">{{ t.decouvreznosequipements }}</p>
          <h2 class="section-title">{{ subtitleText ? subtitleText.charAt(0).toUpperCase() + subtitleText.slice(1).toLowerCase() : '' }}</h2>
        </div>

        <!-- Right: filter tabs + arrows -->
        <div class="flex items-center gap-4 mt-6 md:mt-0" v-if="!loading && allGroups.length">
          <!-- Group filters (sliding window) -->
          <div class="flex gap-2 flex-wrap">
            <button @click="setGroup(null)"
                    class="px-4 py-1.5 text-xs uppercase tracking-[0.15em] font-semibold transition-all duration-300 border"
                    :class="activeGroup === null
                      ? 'bg-amber-700 text-white border-amber-700'
                      : 'bg-transparent text-gray-600 border-gray-300 hover:border-amber-700 hover:text-amber-700'">
              {{ t.tous }}
            </button>
            <button v-for="g in visibleGroups" :key="g.ftId"
                    @click="setGroup(g.ftId)"
                    class="px-4 py-1.5 text-xs uppercase tracking-[0.15em] font-semibold transition-all duration-300 border"
                    :class="activeGroup === g.ftId
                      ? 'bg-amber-700 text-white border-amber-700'
                      : 'bg-transparent text-gray-600 border-gray-300 hover:border-amber-700 hover:text-amber-700'">
              {{ g.name }}
            </button>
          </div>
          <!-- Navigation arrows -->
          <div class="flex gap-2 flex-shrink-0">
            <button @click="scrollFilters(-1)" :disabled="filterOffset === 0"
                    class="w-9 h-9 sm:w-10 sm:h-10 border border-gray-300 flex items-center justify-center text-gray-500 hover:border-amber-700 hover:text-amber-700 transition-all disabled:opacity-30">
              <Icon name="mdi:arrow-left" class="text-lg" />
            </button>
            <button @click="scrollFilters(1)" :disabled="filterOffset >= allGroups.length - FILTER_VISIBLE"
                    class="w-9 h-9 sm:w-10 sm:h-10 border border-gray-300 flex items-center justify-center text-gray-500 hover:border-amber-700 hover:text-amber-700 transition-all disabled:opacity-30">
              <Icon name="mdi:arrow-right" class="text-lg" />
            </button>
          </div>
        </div>
      </div>


      <!-- Loading -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-700"></div>
      </div>

      <!-- Facilities grid -->
      <div v-else>
        <div class="cursor-grab active:cursor-grabbing select-none"
             @mousedown="dragStart" @mousemove="dragMove" @mouseup="dragEnd" @mouseleave="dragEnd"
             @touchstart.passive="dragStart" @touchmove.passive="dragMove" @touchend="dragEnd">
          <transition name="fade" mode="out-in">
            <div :key="`${currentPage}-${activeGroup}`"
                 class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-0">
              <div v-for="facility in currentFacilities" :key="facility.fcId"
                   class="flex items-center justify-between py-4 border-t border-gray-300">
                <span class="text-md text-gray-800">{{ facility.name }}</span>
                <Icon :name="facility.icon" class="text-3xl text-gray-500 flex-shrink-0 ml-4" />
              </div>
            </div>
          </transition>
          <!-- Dots -->
          <div v-if="totalPages > 1" class="flex justify-center gap-2 mt-10">
            <button v-for="page in totalPages" :key="page" @click="currentPage = page - 1"
                    class="w-2 h-2 rounded-full transition-all"
                    :class="currentPage === page - 1 ? 'bg-amber-700 w-6' : 'bg-gray-400'" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const loading        = ref(true)
const allFacilitiesData = ref([])   // flat list (all groups)
const allGroups      = ref([])       // [{ ftId, name, facilities[] }]
const activeGroup    = ref(null)     // null = TOUS
const subtitleText   = ref('')
const currentPage    = ref(0)
const isMobile       = ref(false)
const filterOffset   = ref(0)
const FILTER_VISIBLE = 4   // groups shown at once (+ TOUS = 5 total)
const filterScrollRef = ref(null)

const visibleGroups = computed(() =>
  allGroups.value.slice(filterOffset.value, filterOffset.value + FILTER_VISIBLE)
)

const t = ref({ decouvreznosequipements: 'Découvrez nos équipements', tous: 'Tous' })

const { locale } = useLocale()

const updateIsMobile = () => { isMobile.value = window.innerWidth < 640; currentPage.value = 0 }

// ── Filtered list ─────────────────────────────────────────────────────────────
const filteredFacilities = computed(() => {
  if (activeGroup.value === null) return allFacilitiesData.value
  const group = allGroups.value.find(g => g.ftId === activeGroup.value)
  return group ? group.facilities : []
})

const perPage = computed(() => isMobile.value ? 10 : 24)
const totalPages = computed(() => Math.ceil(filteredFacilities.value.length / perPage.value))
const currentFacilities = computed(() => {
  const start = currentPage.value * perPage.value
  return filteredFacilities.value.slice(start, start + perPage.value)
})

const setGroup = (ftId) => { activeGroup.value = ftId; currentPage.value = 0 }
const prevPage = () => { if (currentPage.value > 0) currentPage.value-- }
const nextPage = () => { if (currentPage.value < totalPages.value - 1) currentPage.value++ }

// ── Filter scroll arrows ──────────────────────────────────────────────────────
const scrollFilters = (dir) => {
  const max = Math.max(0, allGroups.value.length - FILTER_VISIBLE)
  filterOffset.value = Math.min(max, Math.max(0, filterOffset.value + dir))
}

// ── Drag (swipe facilities) ───────────────────────────────────────────────────
const dragStartX = ref(0)
let _dragging = false
const DRAG_THRESHOLD = 50
const getClientX = (e) => (e.changedTouches || e.touches)?.[0]?.clientX ?? e.clientX
const dragStart = (e) => { _dragging = true; dragStartX.value = getClientX(e) }
const dragMove  = () => { if (!_dragging) return }
const dragEnd   = (e) => {
  if (!_dragging) return
  _dragging = false
  const diff = getClientX(e) - dragStartX.value
  if (diff < -DRAG_THRESHOLD) nextPage()
  else if (diff > DRAG_THRESHOLD) prevPage()
}

// ── Icon mapping ──────────────────────────────────────────────────────────────
const ICON_KEYWORDS = [
  ['wifi', 'mdi:wifi'], ['internet', 'mdi:wifi'], ['pool', 'mdi:pool'],
  ['gym', 'mdi:dumbbell'], ['fitness', 'mdi:dumbbell'], ['spa', 'mdi:spa'],
  ['restaurant', 'mdi:silverware-fork-knife'], ['bar', 'mdi:glass-cocktail'],
  ['breakfast', 'mdi:coffee'], ['coffee', 'mdi:coffee'], ['parking', 'mdi:car-brake-parking'],
  ['elevator', 'mdi:elevator'], ['air', 'mdi:air-conditioner'], ['safe', 'mdi:safe'],
  ['tv', 'mdi:television'], ['minibar', 'mdi:fridge'], ['laundry', 'mdi:washing-machine'],
  ['concierge', 'mdi:bell-concierge'], ['garden', 'mdi:flower'], ['terrace', 'mdi:balcony'],
  ['room service', 'mdi:room-service'], ['sauna', 'mdi:sauna'], ['shuttle', 'mdi:airport'],
  ['phone', 'mdi:phone'], ['desk', 'mdi:desk'], ['iron', 'mdi:iron'],
  ['cleaning', 'mdi:broom'], ['business', 'mdi:briefcase'],
  ['nespresso', 'mdi:coffee-maker'],
]

const iconForName = (name = '') => {
  const lower = name.toLowerCase()
  for (const [kw, icon] of ICON_KEYWORDS) {
    if (lower.includes(kw)) return icon
  }
  return 'mdi:check-circle-outline'
}

onUnmounted(() => window.removeEventListener('resize', updateIsMobile))

onMounted(async () => {
  updateIsMobile()
  window.addEventListener('resize', updateIsMobile)

  const { fetchHotelData } = useHotel()
  const { loadCatalogue, transFacilities, transFacilitiesType, transStatic } = useTranslations()

  try {
    const [data, catalogue] = await Promise.all([
      fetchHotelData(),
      loadCatalogue(locale.value),
    ])

    subtitleText.value = transStatic('facilities&services', catalogue, 'Équipements & Services')
    t.value.decouvreznosequipements = transStatic('decouvreznosequipements', catalogue, 'Découvrez nos équipements')
    t.value.tous = transStatic('tous', catalogue, 'Tous')

    const rawFac = data?.facilities ?? []
    const facArr = Array.isArray(rawFac) ? rawFac : Object.values(rawFac)

    const allFlat  = []
    const groups   = []

    for (const cat of facArr) {
      const ftId  = cat.ftId
      const catName = transFacilitiesType(ftId, catalogue, cat.ftCode || `Group ${ftId}`)
      const nested = cat.facilities ?? cat.Facilities ?? []
      const items  = Array.isArray(nested) ? nested : Object.values(nested)

      const groupFacs = []
      for (const f of items) {
        if (!f) continue
        const fcId = f.fcId ?? f.id
        const name = transFacilities(fcId, catalogue, f.fcName ?? f.name ?? '')
        const fac  = { fcId, name, icon: iconForName(name) }
        groupFacs.push(fac)
        allFlat.push(fac)
      }

      if (groupFacs.length > 0) {
        groups.push({ ftId, name: catName, facilities: groupFacs })
      }
    }

    allFacilitiesData.value = allFlat
    allGroups.value = groups
  } catch (err) {
    console.error('[AmenitiesSection]', err)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.4s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* hide scrollbar on filter tabs */
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
