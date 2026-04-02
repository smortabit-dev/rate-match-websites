<template>
  <section class="py-16 sm:py-24 bg-gray-100 relative overflow-hidden">

    <div class="container mx-auto px-4 sm:px-6 relative z-10">
      <!-- Header row: title left, filters + arrows right -->
      <div class="flex flex-col md:flex-row md:items-end md:justify-between mb-10 sm:mb-16">
        <div>
          <p class="section-subtitle">{{ titleText }}</p>
          <h2 class="section-title">{{ subtitleText }}</h2>
        </div>
        <div class="flex items-center gap-4 mt-6 md:mt-0">
          <div class="flex gap-3">
            <button v-for="f in filters" :key="f.value" @click="switchFilter(f.value)"
                    class="px-4 py-1.5 text-xs uppercase tracking-[0.15em] font-semibold transition-all duration-300 border"
                    :class="activeFilter === f.value
                      ? 'bg-amber-700 text-white border-amber-700'
                      : 'bg-transparent text-gray-600 border-gray-300 hover:border-amber-700 hover:text-amber-700'">
              {{ f.label }}
            </button>
          </div>
          <!-- Navigation arrows -->
          <div class="flex gap-2">
            <button @click="prev" :disabled="currentIndex === 0"
                    class="w-9 h-9 sm:w-10 sm:h-10 border border-gray-300 flex items-center justify-center text-gray-500 hover:border-amber-700 hover:text-amber-700 transition-all disabled:opacity-30">
              <Icon name="mdi:arrow-left" class="text-lg" />
            </button>
            <button @click="next" :disabled="currentIndex >= maxIndex"
                    class="w-9 h-9 sm:w-10 sm:h-10 border border-gray-300 flex items-center justify-center text-gray-500 hover:border-amber-700 hover:text-amber-700 transition-all disabled:opacity-30">
              <Icon name="mdi:arrow-right" class="text-lg" />
            </button>
          </div>
        </div>
      </div>

      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-700"></div>
      </div>

      <!-- Cards carousel -->
      <div v-else class="overflow-hidden cursor-grab active:cursor-grabbing select-none"
           @mousedown="dragStart" @mousemove="dragMove" @mouseup="dragEnd" @mouseleave="dragEnd"
           @touchstart.passive="dragStart" @touchmove.passive="dragMove" @touchend="dragEnd">
        <div class="flex ease-in-out"
             :class="isDragging ? 'transition-none' : 'transition-transform duration-500'"
             :style="{ transform: `translateX(calc(-${currentIndex * (100 / visibleCount)}% + ${dragOffset}px))` }">
          <div v-for="(item, idx) in testimonials" :key="idx"
               class="flex-shrink-0 px-2 sm:px-4"
               :style="{ width: `${100 / visibleCount}%` }">
            <div class="bg-white p-5 sm:p-8 h-full flex flex-col relative overflow-hidden">
              <!-- Source watermark background image -->
              <img v-if="item.source === 'TripAdvisor'"
                   src="https://static.tacdn.com/img2/brand_refresh/Tripadvisor_lockup_horizontal_secondary_registered.svg"
                   alt="" class="absolute bottom-4 right-4 w-32 sm:w-40 opacity-[0.2] pointer-events-none select-none" />
              <img v-else-if="item.source === 'Booking.com'"
                   src="https://upload.wikimedia.org/wikipedia/commons/b/be/Booking.com_logo.svg"
                   alt="" class="absolute bottom-4 right-4 w-28 sm:w-36 opacity-[0.2] pointer-events-none select-none" />
              <!-- Stars -->
              <div class="flex gap-1 mb-4 relative z-10">
                <Icon v-for="i in 5" :key="i" name="mdi:star"
                      :class="i <= Math.round(item.rating || 5) ? 'text-amber-500' : 'text-gray-300'"
                      class="text-base" />
              </div>
              <!-- Quote mark -->
              <div class="text-amber-700 text-4xl font-serif leading-none mb-2 relative z-10">"</div>
              <!-- Quote text (max 4 lines) -->
              <p class="text-sm sm:text-base leading-relaxed text-gray-700 font-serif italic mb-4 line-clamp-4 flex-1 relative z-10">
                {{ item.text }}
              </p>
              <!-- See more -->
              <button @click="openSlidePanel(idx)"
                      class="inline-flex items-center gap-1 text-xs uppercase tracking-[0.15em] font-semibold text-amber-700 hover:text-amber-800 transition-colors mb-6 self-start relative z-10">
                {{ t.voirplus }}
                <Icon name="mdi:arrow-right" class="text-sm" />
              </button>
              <!-- Separator -->
              <div class="w-10 h-px bg-amber-700 mb-4 relative z-10"></div>
              <!-- Author + source badge -->
              <div class="flex items-end justify-between relative z-10">
                <div>
                  <h4 class="text-gray-900 font-semibold text-xs uppercase tracking-wider">{{ item.name }}</h4>
                  <p class="text-gray-500 text-xs mt-1">{{ item.location }}</p>
                </div>
                <span v-if="item.source" class="text-[10px] uppercase tracking-wider font-semibold"
                      :class="item.source === 'TripAdvisor' ? 'text-emerald-600' : 'text-blue-600'">
                  <!-- {{ item.source }} -->
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Slide panel from right -->
    <transition name="slide-panel">
      <div v-if="panelOpen" class="fixed inset-0 z-50 flex justify-end">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/60" @click="closeSlidePanel"></div>
        <!-- Panel -->
        <div class="relative w-full max-w-lg bg-white h-full overflow-y-auto shadow-2xl p-6 sm:p-8 md:p-12">
          <button @click="closeSlidePanel"
                  class="absolute top-6 right-6 text-gray-400 hover:text-gray-800 transition-colors">
            <Icon name="mdi:close" class="text-2xl" />
          </button>
          <div v-if="panelComment" class="pt-8">
            <!-- Stars -->
            <div class="flex gap-1 mb-6">
              <Icon v-for="i in 5" :key="i" name="mdi:star"
                    :class="i <= Math.round(panelComment.rating || 5) ? 'text-amber-500' : 'text-gray-300'"
                    class="text-lg" />
            </div>
            <!-- Quote -->
            <div class="text-amber-700 text-5xl font-serif leading-none mb-4">"</div>
            <p class="text-lg leading-relaxed text-gray-700 font-serif italic mb-8" v-html="panelComment.text"></p>
            <!-- Separator -->
            <div class="w-12 h-px bg-amber-700 mb-6"></div>
            <!-- Author -->
            <h4 class="text-gray-900 font-semibold text-sm uppercase tracking-wider">{{ panelComment.name }}</h4>
            <p class="text-gray-500 text-xs mt-1 mb-2">{{ panelComment.location }}</p>
            <p v-if="panelComment.date" class="text-gray-400 text-xs">{{ panelComment.date }}</p>
            <p v-if="panelComment.source" class="text-xs text-amber-700 uppercase tracking-wider mt-4">{{ panelComment.source }}</p>
          </div>
        </div>
      </div>
    </transition>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const testimonials = ref([])
const sideImages = ref([])
const loading = ref(true)
const currentIndex = ref(0)
const visibleCount = ref(3)
const titleText = ref('customerscomments')
const subtitleText = ref('dernierscommentaires')
const activeFilter = ref('all')
const panelOpen = ref(false)
const panelComment = ref(null)
const STATIC_KEYS = ['voirplus']
const t = ref(Object.fromEntries(STATIC_KEYS.map(k => [k, k])))

const maxIndex = computed(() => Math.max(0, testimonials.value.length - visibleCount.value))

const prev = () => { if (currentIndex.value > 0) currentIndex.value-- }
const next = () => { if (currentIndex.value < maxIndex.value) currentIndex.value++ }

// Drag
const isDragging = ref(false)
const dragStartX = ref(0)
const dragOffset = ref(0)
const DRAG_THRESHOLD = 50
const getClientX = (e) => (e.changedTouches || e.touches)?.[0]?.clientX ?? e.clientX
const dragStart = (e) => { isDragging.value = true; dragStartX.value = getClientX(e); dragOffset.value = 0 }
const dragMove = (e) => { if (!isDragging.value) return; dragOffset.value = getClientX(e) - dragStartX.value }
const dragEnd = () => {
  if (!isDragging.value) return
  isDragging.value = false
  if (dragOffset.value < -DRAG_THRESHOLD) next()
  else if (dragOffset.value > DRAG_THRESHOLD) prev()
  dragOffset.value = 0
}

const updateVisibleCount = () => {
  const w = window.innerWidth
  if (w < 640) visibleCount.value = 1
  else if (w < 1024) visibleCount.value = 2
  else visibleCount.value = 3
}

const openSlidePanel = (idx) => {
  panelComment.value = testimonials.value[idx]
  panelOpen.value = true
  document.body.style.overflow = 'hidden'
}
const closeSlidePanel = () => {
  panelOpen.value = false
  document.body.style.overflow = 'auto'
}

const filters = [
  { label: 'All', value: 'all' },
  { label: 'TripAdvisor', value: 'tripadvisor' },
  { label: 'Booking', value: 'booking' },
]

const { locale } = useLocale()

let _fetchComments = null

const switchFilter = async (source) => {
  if (source === activeFilter.value) return
  activeFilter.value = source
  loading.value = true
  currentIndex.value = 0
  testimonials.value = await _fetchComments(source, locale.value)
  loading.value = false
}

onMounted(async () => {
  updateVisibleCount()
  window.addEventListener('resize', updateVisibleCount)

  const { fetchComments, fetchGallery } = useHotel()
  _fetchComments = fetchComments
  const { loadCatalogue, transStatic } = useTranslations()
  const [comments, catalogue, gallery] = await Promise.all([
    fetchComments('all', locale.value),
    loadCatalogue(locale.value),
    fetchGallery(),
  ])
  testimonials.value = comments
  titleText.value = transStatic('customerscomments', catalogue)
  subtitleText.value = transStatic('dernierscommentaires', catalogue)
  const translated = {}
  for (const key of STATIC_KEYS) translated[key] = transStatic(key, catalogue)
  t.value = translated
  if (gallery.length >= 2) {
    sideImages.value = [gallery[0].url, gallery[1].url]
  }
  loading.value = false
})

onUnmounted(() => window.removeEventListener('resize', updateVisibleCount))
</script>

<style scoped>
.slide-panel-enter-active, .slide-panel-leave-active { transition: opacity 0.3s ease; }
.slide-panel-enter-active > :last-child, .slide-panel-leave-active > :last-child { transition: transform 0.3s ease; }
.slide-panel-enter-from, .slide-panel-leave-to { opacity: 0; }
.slide-panel-enter-from > :last-child, .slide-panel-leave-to > :last-child { transform: translateX(100%); }
</style>
