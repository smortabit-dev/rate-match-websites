<template>
  <section class="py-16 sm:py-24 bg-stone-100">
    <div class="container mx-auto px-4 sm:px-6">
      <h2 class="section-title text-amber-800 mb-12">{{ subtitleText ? subtitleText.charAt(0).toUpperCase() + subtitleText.slice(1).toLowerCase() : '' }}</h2>

      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-700"></div>
      </div>

      <div v-else>
        <!-- Carousel pages -->
        <div class="cursor-grab active:cursor-grabbing select-none"
             @mousedown="dragStart" @mousemove="dragMove" @mouseup="dragEnd" @mouseleave="dragEnd"
             @touchstart.passive="dragStart" @touchmove.passive="dragMove" @touchend="dragEnd">
        <transition name="fade" mode="out-in">
          <div :key="currentPage" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-0">
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

const loading = ref(true)
const topFacilities = ref([])
const titleText = ref('Facilities')
const subtitleText = ref('facilities&services')
const currentPage = ref(0)
const isMobile = ref(false)

const updateIsMobile = () => { isMobile.value = window.innerWidth < 640; currentPage.value = 0 }

const { locale } = useLocale()

const perPage = computed(() => isMobile.value ? 10 : 24)
const totalPages = computed(() => Math.ceil(topFacilities.value.length / perPage.value))
const currentFacilities = computed(() => {
  const start = currentPage.value * perPage.value
  return topFacilities.value.slice(start, start + perPage.value)
})

const prevPage = () => { if (currentPage.value > 0) currentPage.value-- }
const nextPage = () => { if (currentPage.value < totalPages.value - 1) currentPage.value++ }

// Drag
const dragStartX = ref(0)
let _dragging = false
const DRAG_THRESHOLD = 50
const getClientX = (e) => (e.changedTouches || e.touches)?.[0]?.clientX ?? e.clientX
const dragStart = (e) => { _dragging = true; dragStartX.value = getClientX(e) }
const dragMove = () => { if (!_dragging) return }
const dragEnd = (e) => {
  if (!_dragging) return
  _dragging = false
  const diff = getClientX(e) - dragStartX.value
  if (diff < -DRAG_THRESHOLD) nextPage()
  else if (diff > DRAG_THRESHOLD) prevPage()
}

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
  const { loadCatalogue, transFacilities, transStatic } = useTranslations()

  try {
    const [data, catalogue] = await Promise.all([
      fetchHotelData(),
      loadCatalogue(locale.value),
    ])

    titleText.value = transStatic('Facilities', catalogue)
    subtitleText.value = transStatic('facilities&services', catalogue)

    const rawFac = data?.facilities ?? []
    const facArr = Array.isArray(rawFac) ? rawFac : Object.values(rawFac)

    const allFacilities = []
    for (const cat of facArr) {
      const nested = cat.facilities ?? cat.Facilities ?? []
      const items = Array.isArray(nested) ? nested : Object.values(nested)
      for (const f of items) {
        if (!f) continue
        const fcId = f.fcId ?? f.id
        const name = transFacilities(fcId, catalogue, f.fcName ?? f.name ?? '')
        allFacilities.push({ fcId, name, icon: iconForName(name) })
      }
    }
    topFacilities.value = allFacilities
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
</style>
