<template>
  <section class="bg-[#fbf8f6] py-20 px-8 sm:px-12 lg:px-16">
    <div class="max-w-7xl mx-auto">

      <!-- Header row: left text + right arrows -->
      <div class="flex items-start justify-between mb-14">

        <!-- Left: label + heading + description -->
        <div class="max-w-2xl">
          <p class="font-['Cormorant_Garamond'] italic text-[#b7825c] text-base mb-3">{{ sectionLabel }}</p>

          <h2 class="font-['Cormorant_Garamond'] text-3xl sm:text-4xl lg:text-5xl text-[#1a1410] font-light italic leading-snug mb-5">
            <template v-for="(word, i) in headingWords" :key="i">
              <span :class="i % 4 === 2 ? 'text-[#7a2c28]' : i % 4 === 3 ? 'text-[#b7825c]' : 'text-[#1a1410]'">{{ word }}</span>
              <span v-if="i < headingWords.length - 1"> </span>
            </template>
          </h2>

          <p class="text-sm sm:text-base leading-loose max-w-xl">
            <template v-for="(word, i) in descWords" :key="i">
              <span :class="i % 5 === 2 ? 'text-[#b7825c]' : i % 5 === 4 ? 'text-[#7a2c28]' : 'text-[#1a1410]/70'">{{ word }}</span>
              <span v-if="i < descWords.length - 1"> </span>
            </template>
          </p>
        </div>

        <!-- Right: nav arrows -->
        <div class="flex gap-3 flex-shrink-0 mt-2">
          <button @click="prev" :disabled="currentIndex === 0"
            class="w-12 h-12 border border-[#1a1410]/25 flex items-center justify-center text-[#1a1410]/50 hover:border-[#b7825c] hover:text-[#b7825c] transition-all disabled:opacity-25">
            <Icon name="mdi:arrow-left" class="text-lg" />
          </button>
          <button @click="next" :disabled="currentIndex >= maxIndex"
            class="w-12 h-12 border border-[#1a1410]/25 flex items-center justify-center text-[#1a1410]/50 hover:border-[#b7825c] hover:text-[#b7825c] transition-all disabled:opacity-25">
            <Icon name="mdi:arrow-right" class="text-lg" />
          </button>
        </div>
      </div>

      <!-- Skeleton -->
      <div v-if="!reviews.length" class="flex gap-5">
        <div v-for="i in visibleCount" :key="i"
          class="flex-shrink-0 border border-[#1a1410]/10 bg-white p-8 animate-pulse"
          :style="{ width: `calc(${100 / visibleCount}% - 16px)` }">
          <div class="space-y-2 mb-8">
            <div class="h-3 bg-[#1a1410]/5 w-full"></div>
            <div class="h-3 bg-[#1a1410]/5 w-5/6"></div>
            <div class="h-3 bg-[#1a1410]/5 w-4/6"></div>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-[#1a1410]/8"></div>
            <div class="space-y-1.5">
              <div class="h-2.5 bg-[#1a1410]/8 w-24"></div>
              <div class="h-2 bg-[#1a1410]/5 w-16"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Carousel -->
      <div v-else class="overflow-hidden cursor-grab active:cursor-grabbing select-none"
           @mousedown="dragStart" @mousemove="dragMove" @mouseup="dragEnd" @mouseleave="dragEnd"
           @touchstart.passive="dragStart" @touchmove.passive="dragMove" @touchend="dragEnd">
        <div class="flex gap-5"
             :class="isDragging ? 'transition-none' : 'transition-transform duration-500'"
             :style="{ transform: `translateX(calc(-${currentIndex * (100 / visibleCount + gapFrac)}% + ${dragOffset}px))` }">
          <div v-for="(r, idx) in reviews" :key="idx"
               class="flex-shrink-0 border border-[#1a1410]/12 bg-white p-8 flex flex-col"
               :style="{ width: `calc(${100 / visibleCount}% - ${gapPx}px)` }">

            <!-- Quote body -->
            <div class="flex-1 mb-5">
              <p class="text-[#1a1410]/60 text-sm leading-relaxed">
                "{{ truncated(r.text, 220) }}"
              </p>
              <button v-if="r.text && r.text.length > 220" @click.stop
                class="text-[#1a1410]/40 text-xs mt-2 hover:text-[#b7825c] transition-colors">
                Lire plus...
              </button>
            </div>

            <!-- Author row -->
            <div class="flex items-center gap-3 pt-5 border-t border-[#1a1410]/8">
              <!-- Avatar -->
              <div class="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-[#e8d5c0]">
                <img v-if="r.avatar" :src="r.avatar" :alt="r.name" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex items-center justify-center text-[#b7825c] font-['Cormorant_Garamond'] text-lg font-light">
                  {{ (r.name || '?')[0] }}
                </div>
              </div>
              <div>
                <p class="text-[11px] uppercase tracking-[0.15em] text-[#1a1410] font-semibold leading-tight">{{ r.name }}</p>
                <p v-if="r.date" class="font-['Cormorant_Garamond'] italic text-[#b7825c] text-sm mt-0.5">{{ r.date }}</p>
              </div>
            </div>

          </div>
        </div>
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

const sectionLabel = ref('Témoignages')
const sectionHeading = ref('Ils ont vécu l\'expérience')
const sectionDesc    = ref('Découvrez ce que nos hôtes disent de leur séjour, des moments uniques et des souvenirs inoubliables qui font de chaque visite une expérience d\'exception.')

const headingWords = computed(() => sectionHeading.value.split(' '))
const descWords    = computed(() => sectionDesc.value.split(' '))

const gapPx   = 20
const gapFrac = computed(() => (gapPx / (window?.innerWidth || 1400)) * 100 * visibleCount.value / visibleCount.value)

const maxIndex = computed(() => Math.max(0, reviews.value.length - visibleCount.value))
const prev = () => { if (currentIndex.value > 0) currentIndex.value-- }
const next = () => { if (currentIndex.value < maxIndex.value) currentIndex.value++ }

const truncated = (text, max) => text?.length > max ? text.slice(0, max).trimEnd() + '…' : text

const isDragging = ref(false); const dragStartX = ref(0); const dragOffset = ref(0)
const DRAG_THRESHOLD = 50
const getClientX = (e) => (e.changedTouches || e.touches)?.[0]?.clientX ?? e.clientX
const dragStart  = (e) => { isDragging.value = true; dragStartX.value = getClientX(e); dragOffset.value = 0 }
const dragMove   = (e) => { if (!isDragging.value) return; dragOffset.value = getClientX(e) - dragStartX.value }
const dragEnd    = (e) => {
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

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  try {
    return new Date(dateStr).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
  } catch { return dateStr }
}

onMounted(async () => {
  updateVisibleCount()
  window.addEventListener('resize', updateVisibleCount)
  const { fetchComments } = useHotel()
  const [ta, bk] = await Promise.all([
    fetchComments('tripadvisor', locale.value),
    fetchComments('booking', locale.value),
  ])
  reviews.value = [...(ta || []), ...(bk || [])].map(r => ({
    ...r,
    date: formatDate(r.date || r.reviewDate || r.createdAt),
  }))
})
onUnmounted(() => window.removeEventListener('resize', updateVisibleCount))
</script>
