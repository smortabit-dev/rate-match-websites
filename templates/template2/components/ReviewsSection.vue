<template>
  <section id="reviews" class="bg-white py-24 px-6">
    <div class="max-w-7xl mx-auto">

      <!-- Header + arrows -->
      <div class="flex flex-col md:flex-row md:items-end md:justify-between mb-14">
        <div>
          <p class="text-[10px] uppercase tracking-[0.3em] text-[#C9A96E] mb-4">Guest Voices</p>
          <h2 class="font-['Cormorant_Garamond'] text-4xl sm:text-5xl text-[#111] font-light">Reviews</h2>
          <div class="w-10 h-px bg-[#C9A96E] mt-6"></div>
        </div>

        <!-- Navigation arrows -->
        <div class="flex gap-3 mt-8 md:mt-0">
          <button @click="prev" :disabled="currentIndex === 0"
            class="w-11 h-11 border border-[#111]/20 flex items-center justify-center text-[#111]/50 hover:border-[#C9A96E] hover:text-[#C9A96E] transition-all disabled:opacity-25">
            <Icon name="mdi:arrow-left" class="text-lg" />
          </button>
          <button @click="next" :disabled="currentIndex >= maxIndex"
            class="w-11 h-11 border border-[#111]/20 flex items-center justify-center text-[#111]/50 hover:border-[#C9A96E] hover:text-[#C9A96E] transition-all disabled:opacity-25">
            <Icon name="mdi:arrow-right" class="text-lg" />
          </button>
        </div>
      </div>

      <!-- Skeleton -->
      <div v-if="!reviews.length" class="flex gap-6">
        <div v-for="i in visibleCount" :key="i"
          class="flex-shrink-0 border border-[#111]/8 p-8 animate-pulse"
          :style="{ width: `calc(${100 / visibleCount}% - ${(visibleCount - 1) * 24 / visibleCount}px)` }">
          <div class="flex gap-1 mb-5">
            <div v-for="s in 5" :key="s" class="w-3 h-3 rounded-full bg-[#111]/5"></div>
          </div>
          <div class="h-4 bg-[#111]/5 w-12 mb-4"></div>
          <div class="space-y-2 mb-6">
            <div class="h-3 bg-[#111]/5 w-full"></div>
            <div class="h-3 bg-[#111]/5 w-5/6"></div>
            <div class="h-3 bg-[#111]/5 w-4/6"></div>
            <div class="h-3 bg-[#111]/5 w-3/6"></div>
          </div>
          <div class="h-px bg-[#C9A96E]/20 w-8 mb-4"></div>
          <div class="h-3 bg-[#111]/5 w-1/3"></div>
        </div>
      </div>

      <!-- Carousel -->
      <div v-else class="overflow-hidden cursor-grab active:cursor-grabbing select-none"
           @mousedown="dragStart" @mousemove="dragMove" @mouseup="dragEnd" @mouseleave="dragEnd"
           @touchstart.passive="dragStart" @touchmove.passive="dragMove" @touchend="dragEnd">
        <div
          class="flex ease-in-out"
          :class="isDragging ? 'transition-none' : 'transition-transform duration-500'"
          :style="{ transform: `translateX(calc(-${currentIndex * (100 / visibleCount)}% + ${dragOffset}px))` }">
          <div
            v-for="(r, idx) in reviews" :key="idx"
            class="flex-shrink-0 px-3"
            :style="{ width: `${100 / visibleCount}%` }">
            <div class="border border-[#111]/8 p-8 h-full flex flex-col hover:border-[#C9A96E]/40 transition-colors relative overflow-hidden">

              <!-- Source watermark -->
              <img v-if="r.source === 'TripAdvisor'"
                src="https://static.tacdn.com/img2/brand_refresh/Tripadvisor_lockup_horizontal_secondary_registered.svg"
                alt="" class="absolute bottom-4 right-4 w-28 opacity-[0.06] pointer-events-none select-none" />
              <img v-else-if="r.source === 'Booking.com'"
                src="https://upload.wikimedia.org/wikipedia/commons/b/be/Booking.com_logo.svg"
                alt="" class="absolute bottom-4 right-4 w-24 opacity-[0.06] pointer-events-none select-none" />

              <!-- Stars -->
              <div class="flex gap-1 mb-5 relative z-10">
                <svg v-for="s in 5" :key="s" class="w-3 h-3"
                  :class="s <= Math.round(r.rating || 5) ? 'text-[#C9A96E]' : 'text-[#111]/15'"
                  fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              </div>

              <!-- Quote + text -->
              <div class="text-[#C9A96E] text-4xl font-serif leading-none mb-1 relative z-10">"</div>
              <p class="text-[#111]/60 text-sm leading-relaxed italic line-clamp-4 flex-1 relative z-10">
                {{ r.text }}
              </p>

              <!-- Divider + author -->
              <div class="w-8 h-px bg-[#C9A96E] mt-6 mb-4 relative z-10"></div>
              <div class="relative z-10">
                <p class="text-[#111] text-xs uppercase tracking-[0.15em] font-medium">{{ r.name }}</p>
                <p v-if="r.location" class="text-[#111]/40 text-[10px] mt-0.5">{{ r.location }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Dot indicators -->
      <div v-if="reviews.length > visibleCount" class="flex gap-2 mt-10">
        <button
          v-for="(_, i) in dotCount" :key="i"
          @click="currentIndex = i"
          class="h-1 rounded-full transition-all duration-300"
          :class="currentIndex === i ? 'bg-[#C9A96E] w-6' : 'bg-[#111]/15 w-1.5'" />
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const { locale } = useLocale()

const reviews      = ref([])
const currentIndex = ref(0)
const visibleCount = ref(3)

const maxIndex = computed(() => Math.max(0, reviews.value.length - visibleCount.value))
const dotCount = computed(() => maxIndex.value + 1)

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

const updateVisibleCount = () => {
  const w = window.innerWidth
  if (w < 640) visibleCount.value = 1
  else if (w < 1024) visibleCount.value = 2
  else visibleCount.value = 3
  if (currentIndex.value > maxIndex.value) currentIndex.value = maxIndex.value
}

onMounted(async () => {
  updateVisibleCount()
  window.addEventListener('resize', updateVisibleCount)
  const { fetchComments } = useHotel()
  const [ta, bk] = await Promise.all([
    fetchComments('tripadvisor', locale.value),
    fetchComments('booking', locale.value),
  ])
  reviews.value = [...(ta || []), ...(bk || [])]
})
onUnmounted(() => window.removeEventListener('resize', updateVisibleCount))
</script>
