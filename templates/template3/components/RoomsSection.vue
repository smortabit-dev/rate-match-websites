<template>
  <section class="bg-[#f5ede3] py-20">

    <!-- Section header -->
    <div class="text-center mb-12 px-6">
      <p class="font-['Cormorant_Garamond'] italic text-[#b7825c] text-base tracking-wide mb-3">
        <span v-for="(ch, i) in sectionLabel" :key="i"
          :class="isLetter(ch) && i % 3 === 1 ? 'text-[#7a2c28]' : ''">{{ ch }}</span>
      </p>
      <h2 class="font-['Cormorant_Garamond'] text-3xl sm:text-4xl lg:text-5xl text-[#1a1410] font-light">
        {{ sectionTitle }}
      </h2>
    </div>

    <!-- Cards: edge-to-edge -->
    <div class="overflow-hidden select-none cursor-grab active:cursor-grabbing"
         @mousedown="dragStart" @mousemove="dragMove" @mouseup="dragEnd" @mouseleave="dragEnd"
         @touchstart.passive="dragStart" @touchmove.passive="dragMove" @touchend="dragEnd">

      <!-- Skeleton -->
      <div v-if="!rooms.length" class="flex">
        <div v-for="i in 3" :key="i" class="flex-shrink-0" style="width:33.333%">
          <div class="aspect-[3/2] bg-[#e8d5c0] animate-pulse"></div>
          <div class="bg-white p-6 space-y-3">
            <div class="h-5 bg-[#1a1410]/8 w-2/3"></div>
            <div class="h-3 bg-[#1a1410]/5 w-1/2"></div>
          </div>
        </div>
      </div>

      <!-- Carousel track -->
      <div v-else class="flex gap-4 px-4"
           :class="isDragging ? 'transition-none' : 'transition-transform duration-500'"
           :style="{ transform: `translateX(calc(-${currentIndex * (100 / visibleCount)}% + ${dragOffset}px))` }">
        <div v-for="(room, idx) in rooms" :key="room.id"
             class="flex-shrink-0 transition-opacity duration-500"
             :class="isFeatured(idx) ? 'opacity-100' : 'opacity-60'"
             :style="{ width: `calc(${100 / visibleCount}% - ${visibleCount === 1 ? 0 : visibleCount === 2 ? 8 : 11}px)` }"
             style="min-width:0">

          <!-- Image -->
          <div class="relative overflow-hidden" :style="{ aspectRatio: '4/3' }">
            <img v-for="(img, si) in (room.images || [room.image]).slice(0, 5)" :key="si"
                 :src="img" :alt="`${room.name}`"
                 class="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                 :class="(roomSlides[room.id] || 0) === si ? 'opacity-100' : 'opacity-0'" />
          </div>

          <!-- Info -->
          <div class="bg-[#f7f1ed] px-8 py-7">
            <h3 class="font-['Cormorant_Garamond'] text-xl sm:text-2xl text-[#1a1410] font-light leading-tight mb-1">
              {{ room.name }}
            </h3>
            <p v-if="room.category" class="text-[#1a1410]/50 text-sm mb-4">{{ room.category }}</p>
            <p class="text-[#1a1410]/55 text-sm leading-relaxed line-clamp-3 mb-6" v-html="room.description"></p>
            <NuxtLink :to="localePath(`/rooms/${room.slug}`)"
              class="text-[10px] uppercase tracking-[0.3em] text-[#1a1410] hover:text-[#b7825c] transition-colors">
              {{ t.decouvrir || 'Découvrir' }}
            </NuxtLink>
          </div>

        </div>
      </div>
    </div>

    <!-- Nav arrows -->
    <div class="flex justify-center gap-4 mt-10 px-6">
      <button @click="prev" :disabled="currentIndex === 0"
        class="w-12 h-12 border border-[#1a1410]/30 flex items-center justify-center text-[#1a1410]/60 hover:border-[#b7825c] hover:text-[#b7825c] transition-all disabled:opacity-25">
        <Icon name="mdi:arrow-left" class="text-lg" />
      </button>
      <button @click="next" :disabled="currentIndex >= maxIndex"
        class="w-12 h-12 border border-[#1a1410]/30 flex items-center justify-center text-[#1a1410]/60 hover:border-[#b7825c] hover:text-[#b7825c] transition-all disabled:opacity-25">
        <Icon name="mdi:arrow-right" class="text-lg" />
      </button>
    </div>

    <!-- Bottom CTA -->
    <div class="text-center mt-10 px-6">
      <NuxtLink :to="localePath('/rooms')"
        class="inline-flex items-center gap-2 font-['Cormorant_Garamond'] italic text-[#b7825c] text-lg hover:text-[#7a2c28] transition-colors">
        {{ t.voirhebg || 'Voir nos hébergements' }}
        <Icon name="mdi:arrow-right" class="text-base not-italic" />
      </NuxtLink>
    </div>

  </section>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'

const { locale, localePath } = useLocale()
const rooms        = ref([])
const currentIndex = ref(0)
const visibleCount = ref(3)
const roomSlides   = reactive({})
const t            = ref({})
const sectionLabel = ref('Chambres et Suites')
const sectionTitle = ref('Refuges de luxe et de sérénité')

const maxIndex = computed(() => Math.max(0, rooms.value.length - visibleCount.value))
const prev = () => { if (currentIndex.value > 0) currentIndex.value-- }
const next = () => { if (currentIndex.value < maxIndex.value) currentIndex.value++ }

// Featured = middle visible card
const isFeatured = (idx) => {
  if (visibleCount.value === 1) return true
  const mid = currentIndex.value + Math.floor(visibleCount.value / 2)
  return idx === mid
}

// Alternating-letter color helper
const isLetter = (ch) => /[a-zA-ZÀ-ÿ]/.test(ch)

const isDragging  = ref(false)
const dragStartX  = ref(0)
const dragOffset  = ref(0)
const DRAG_THRESHOLD = 50
const getClientX  = (e) => (e.changedTouches || e.touches)?.[0]?.clientX ?? e.clientX
const dragStart   = (e) => { isDragging.value = true; dragStartX.value = getClientX(e); dragOffset.value = 0 }
const dragMove    = (e) => { if (!isDragging.value) return; dragOffset.value = getClientX(e) - dragStartX.value }
const dragEnd     = (e) => {
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
  const { fetchRooms } = useHotel()
  const { loadCatalogue, transStatic } = useTranslations()
  const [apiRooms, catalogue] = await Promise.all([fetchRooms(locale.value), loadCatalogue(locale.value)])
  rooms.value = (apiRooms || []).filter(r =>
    r.img?.length > 0 &&
    r.isBookingBasic !== true
  )
  const label = transStatic('chambressuites', catalogue)
  const title = transStatic('refugesLuxe', catalogue)
  if (label) sectionLabel.value = label
  if (title) sectionTitle.value = title
  t.value = {
    decouvrir: transStatic('decouvrir', catalogue) || 'Découvrir',
    voirhebg:  transStatic('voirhebg',  catalogue) || 'Voir nos hébergements',
  }
})
onUnmounted(() => window.removeEventListener('resize', updateVisibleCount))
</script>
