<template>
  <div class="bg-white min-h-screen">
    <PageHero title="Reviews" :image="heroImg" />

    <div class="max-w-7xl mx-auto px-6 py-14">

      <!-- Header + filters + arrows -->
      <div class="flex flex-col md:flex-row md:items-end md:justify-between mb-14">
        <div>
          <p class="text-[10px] uppercase tracking-[0.3em] text-[#C9A96E] mb-4">Guest Experiences</p>
          <h2 class="font-['Cormorant_Garamond'] text-4xl sm:text-5xl text-[#111] font-light">Reviews</h2>
          <div class="w-10 h-px bg-[#C9A96E] mt-6"></div>
        </div>
        <div class="flex items-center gap-4 mt-8 md:mt-0">
          <!-- Filter tabs -->
          <div class="flex gap-2 flex-wrap">
            <button v-for="f in filters" :key="f.value" @click="switchFilter(f.value)"
              class="px-5 py-2 text-[10px] uppercase tracking-[0.2em] transition-all"
              :class="activeFilter === f.value
                ? 'bg-[#111] text-white'
                : 'border border-[#111]/20 text-[#111]/50 hover:text-[#111]'">
              {{ f.label }}
            </button>
          </div>
          <!-- Nav arrows -->
          <div class="flex gap-2 flex-shrink-0">
            <button @click="prev" :disabled="currentIndex === 0"
              class="w-10 h-10 border border-[#111]/20 flex items-center justify-center text-[#111]/50 hover:border-[#C9A96E] hover:text-[#C9A96E] transition-all disabled:opacity-30">
              <Icon name="mdi:arrow-left" class="text-lg" />
            </button>
            <button @click="next" :disabled="currentIndex >= maxIndex"
              class="w-10 h-10 border border-[#111]/20 flex items-center justify-center text-[#111]/50 hover:border-[#C9A96E] hover:text-[#C9A96E] transition-all disabled:opacity-30">
              <Icon name="mdi:arrow-right" class="text-lg" />
            </button>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-20">
        <div class="w-10 h-10 border-2 border-[#C9A96E] border-t-transparent rounded-full animate-spin"></div>
      </div>

      <!-- Carousel -->
      <div v-else class="overflow-hidden cursor-grab active:cursor-grabbing select-none"
           @mousedown="dragStart" @mousemove="dragMove" @mouseup="dragEnd" @mouseleave="dragEnd"
           @touchstart.passive="dragStart" @touchmove.passive="dragMove" @touchend="dragEnd">
        <div class="flex ease-in-out"
          :class="isDragging ? 'transition-none' : 'transition-transform duration-500'"
          :style="{ transform: `translateX(calc(-${currentIndex * (100 / visibleCount)}% + ${dragOffset}px))` }">
          <div v-for="(r, idx) in reviews" :key="idx"
            class="flex-shrink-0 px-3"
            :style="{ width: `${100 / visibleCount}%` }">
            <div class="border border-[#111]/8 p-8 h-full flex flex-col relative overflow-hidden hover:border-[#C9A96E]/40 transition-colors">

              <!-- Source watermark -->
              <img v-if="r.source === 'TripAdvisor'"
                src="https://static.tacdn.com/img2/brand_refresh/Tripadvisor_lockup_horizontal_secondary_registered.svg"
                alt="" class="absolute bottom-4 right-4 w-32 opacity-[0.07] pointer-events-none select-none" />
              <img v-else-if="r.source === 'Booking.com'"
                src="https://upload.wikimedia.org/wikipedia/commons/b/be/Booking.com_logo.svg"
                alt="" class="absolute bottom-4 right-4 w-28 opacity-[0.07] pointer-events-none select-none" />

              <!-- Stars -->
              <div class="flex gap-1 mb-5 relative z-10">
                <svg v-for="s in 5" :key="s" class="w-3 h-3"
                  :class="s <= Math.round(r.rating || 5) ? 'text-[#C9A96E]' : 'text-[#111]/15'"
                  fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              </div>

              <!-- Quote mark -->
              <div class="text-[#C9A96E] text-5xl font-serif leading-none mb-2 relative z-10">"</div>

              <!-- Review text -->
              <p class="text-[#111]/60 text-sm leading-relaxed italic mb-4 line-clamp-4 flex-1 relative z-10" v-html="r.text">
              </p>

              <!-- Read more -->
              <button @click="openPanel(idx)"
                class="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-[#C9A96E] hover:text-[#111] transition-colors mb-6 self-start relative z-10">
                Read more
                <Icon name="mdi:arrow-right" class="text-sm" />
              </button>

              <!-- Divider -->
              <div class="w-8 h-px bg-[#C9A96E] mb-4 relative z-10"></div>

              <!-- Author -->
              <div class="relative z-10">
                <p class="text-[#111] text-xs uppercase tracking-[0.15em] font-medium">{{ r.name }}</p>
                <p v-if="r.location" class="text-[#111]/40 text-[10px] mt-1">{{ r.location }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="!loading && !reviews.length" class="text-center py-20">
        <p class="text-[#111]/30 text-sm">No reviews found.</p>
      </div>

      <!-- Overall rating -->
      <div v-if="!loading && avgRating > 0" class="mt-16 border border-[#111]/10 p-10 text-center">
        <p class="text-[10px] uppercase tracking-[0.3em] text-[#C9A96E] mb-4">Overall Rating</p>
        <div class="font-['Cormorant_Garamond'] text-8xl text-[#111] font-light leading-none mb-4">
          {{ avgRating.toFixed(1) }}
        </div>
        <div class="flex gap-2 justify-center mb-3">
          <svg v-for="s in 5" :key="s" class="w-5 h-5"
            :class="s <= Math.round(avgRating) ? 'text-[#C9A96E]' : 'text-[#111]/15'"
            fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        </div>
        <p class="text-[#111]/40 text-sm">Based on {{ reviews.length }} reviews</p>
      </div>
    </div>

    <!-- Centered modal -->
    <transition name="t2-modal">
      <div v-if="panelOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
        @click.self="closePanel">

        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="closePanel"></div>

        <!-- Modal box -->
        <div v-if="panelReview"
          class="relative z-10 w-full max-w-xl bg-white shadow-2xl px-10 py-12 max-h-[90vh] overflow-y-auto">

          <!-- Close -->
          <button @click="closePanel"
            class="absolute top-5 right-5 w-9 h-9 flex items-center justify-center border border-[#111]/15 text-[#111]/40 hover:border-[#C9A96E] hover:text-[#C9A96E] transition-colors">
            <Icon name="mdi:close" class="text-lg" />
          </button>

          <!-- Source label -->
          <p v-if="panelReview.source"
            class="text-[10px] uppercase tracking-[0.3em] text-[#C9A96E] mb-5">
            {{ panelReview.source }}
          </p>

          <!-- Stars -->
          <div class="flex gap-1 mb-4">
            <svg v-for="s in 5" :key="s" class="w-4 h-4"
              :class="s <= Math.round(panelReview.rating || 5) ? 'text-[#C9A96E]' : 'text-[#111]/15'"
              fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          </div>

          <!-- Quote mark + text -->
          <div class="text-[#C9A96E] text-6xl font-serif leading-none mb-2">"</div>
          <p class="text-[#111]/70 text-base leading-relaxed italic mb-8">{{ panelReview.text }}</p>

          <!-- Divider + author -->
          <div class="w-10 h-px bg-[#C9A96E] mb-6"></div>
          <p class="text-[#111] text-xs uppercase tracking-[0.2em] font-medium">{{ panelReview.name }}</p>
          <p v-if="panelReview.location" class="text-[#111]/40 text-xs mt-1">{{ panelReview.location }}</p>
          <p v-if="panelReview.date" class="text-[#111]/30 text-xs mt-2">{{ panelReview.date }}</p>

          <!-- Close button -->
          <button @click="closePanel"
            class="mt-8 text-[#111]/40 text-[10px] uppercase tracking-[0.2em] hover:text-[#111] transition-colors">
            Close
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const { locale } = useLocale()

const reviews      = ref([])
const loading      = ref(true)
const heroImg      = ref('')
const activeFilter = ref('all')
const currentIndex = ref(0)
const visibleCount = ref(3)
const panelOpen    = ref(false)
const panelReview  = ref(null)

let _fetchComments = null

const filters = [
  { label: 'All',         value: 'all' },
  { label: 'TripAdvisor', value: 'tripadvisor' },
  { label: 'Booking',     value: 'booking' },
]

const maxIndex = computed(() => Math.max(0, reviews.value.length - visibleCount.value))
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
const dragEnd = (e) => {
  if (!isDragging.value) return
  isDragging.value = false
  const diff = getClientX(e) - dragStartX.value
  if (diff < -DRAG_THRESHOLD) next()
  else if (diff > DRAG_THRESHOLD) prev()
  dragOffset.value = 0
}

const avgRating = computed(() => {
  const list = reviews.value.filter(r => r.rating)
  if (!list.length) return 0
  return list.reduce((acc, r) => acc + (r.rating || 5), 0) / list.length
})

const updateVisibleCount = () => {
  const w = window.innerWidth
  if (w < 640) visibleCount.value = 1
  else if (w < 1024) visibleCount.value = 2
  else visibleCount.value = 3
}

const switchFilter = async (source) => {
  if (source === activeFilter.value) return
  activeFilter.value = source
  loading.value = true
  currentIndex.value = 0
  reviews.value = await _fetchComments(source, locale.value)
  loading.value = false
}

const openPanel = (idx) => {
  panelReview.value = reviews.value[idx]
  panelOpen.value = true
  document.body.style.overflow = 'hidden'
}
const closePanel = () => {
  panelOpen.value = false
  document.body.style.overflow = ''
}

onMounted(async () => {
  updateVisibleCount()
  window.addEventListener('resize', updateVisibleCount)
  const { fetchComments, fetchGallery } = useHotel()
  _fetchComments = fetchComments
  const [data, gallery] = await Promise.all([
    fetchComments('all', locale.value),
    fetchGallery(),
  ])
  reviews.value = data || []
  heroImg.value = gallery[2]?.url || gallery[0]?.url || ''
  loading.value = false
})
onUnmounted(() => window.removeEventListener('resize', updateVisibleCount))
</script>

<style scoped>
.t2-modal-enter-active { transition: opacity 0.3s ease; }
.t2-modal-leave-active { transition: opacity 0.25s ease; }
.t2-modal-enter-from, .t2-modal-leave-to { opacity: 0; }
.t2-modal-enter-active .relative.z-10 { transition: transform 0.3s ease, opacity 0.3s ease; }
.t2-modal-leave-active .relative.z-10 { transition: transform 0.2s ease, opacity 0.25s ease; }
.t2-modal-enter-from .relative.z-10 { transform: scale(0.96); opacity: 0; }
.t2-modal-leave-to   .relative.z-10 { transform: scale(0.96); opacity: 0; }
</style>
