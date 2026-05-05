<template>
  <section id="rooms" class="py-24 bg-white">
    <div class="container mx-auto px-6">
      <div class="mb-16" :class="dir === 'rtl' ? 'text-right' : 'text-left'">
        <p class="section-subtitle">{{ t.discover }}</p>
        <h2 class="section-title">{{ t.chambressuites }}</h2>
      </div>
      <div v-if="loading" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-700"></div>
      </div>
      <div v-else class="relative">
        <!-- Rooms Grid / Slider -->
        <div class="overflow-hidden cursor-grab active:cursor-grabbing select-none"
             @mousedown="dragStart" @mousemove="dragMove" @mouseup="dragEnd" @mouseleave="dragEnd"
             @touchstart.passive="dragStart" @touchmove.passive="dragMove" @touchend="dragEnd">
          <div class="flex ease-in-out"
               :class="isDragging ? 'transition-none' : 'transition-transform duration-600'"
               :style="{ transform: `translateX(calc(${dir === 'rtl' ? '' : '-'}${currentIndex * (100 / visibleCount)}% + ${dragOffset}px))` }">
            <div v-for="room in rooms" :key="room.id"
                 class="flex-shrink-0 px-4"
                 :style="{ width: `${100 / visibleCount}%` }">
              <div class="group cursor-pointer h-full flex flex-col">
                <!-- Category label with line + price -->
                <!-- <div class="flex items-center justify-between mb-4">
                  <div v-if="room.category" class="flex items-center gap-3">
                    <div class="w-10 h-px bg-gray-800"></div>
                    <span class="text-xs uppercase tracking-[0.2em] font-semibold text-gray-700">{{ room.category }}</span>
                  </div>
                  <span v-if="room.price" class="text-lg font-serif text-amber-700">
                    {{ room.price }} <span class="text-xs text-gray-400 font-sans">/ {{ t.nuit }}</span>
                  </span>
                </div> -->
                <!-- Room Image with inner carousel -->
                <div class="relative aspect-[3/3] overflow-hidden mb-6">
                  <div class="relative w-full h-full">
                    <img v-for="(img, imgIdx) in (room.images || [room.image]).slice(0, 5)" :key="imgIdx"
                         :src="img" :alt="`${room.name} - ${imgIdx + 1}`"
                         class="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                         :class="(roomSlides[room.id] || 0) === imgIdx ? 'opacity-100' : 'opacity-0'" />
                  </div>
                  <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all"></div>
                  <!-- Counter & inner nav -->
                  <div class="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <span class="text-white text-xs bg-black/40 px-2 py-0.5">
                      {{ (roomSlides[room.id] || 0) + 1 }} / {{ (room.images || [room.image]).slice(0, 5).length }}
                    </span>
                    <div v-if="(room.images || []).length > 1" class="flex gap-2">
                      <button @click.stop="prevRoomSlide(room)" class="text-white hover:text-amber-400 transition-colors">
                        <Icon name="mdi:arrow-left" class="text-lg" />
                      </button>
                      <button @click.stop="nextRoomSlide(room)" class="text-white hover:text-amber-400 transition-colors">
                        <Icon name="mdi:arrow-right" class="text-lg" />
                      </button>
                    </div>
                  </div>
                </div>
                <!-- Room Info -->
                <h3 class="text-lg sm:text-2xl font-serif mb-2">{{ room.name }}</h3>
                <p class="text-gray-500 text-sm sm:text-md leading-relaxed mb-4 line-clamp-3 sm:line-clamp-4 flex-1" v-html="room.description"></p>
                <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mt-auto">
                  <NuxtLink :to="localePath(`/rooms/${room.id}`)" class="px-4 sm:px-5 py-2 border border-amber-700 text-[10px] sm:text-xs uppercase tracking-[0.15em] font-semibold text-amber-700 hover:bg-amber-700 hover:text-white transition-all">
                    {{ t.voirlesdetails }}
                    <Icon name="mdi:arrow-right" class="text-sm" />
                  </NuxtLink>
                  <!-- <NuxtLink :to="localePath('/availibility')"
                            class="px-4 sm:px-5 py-2 border border-amber-700 text-[10px] sm:text-xs uppercase tracking-[0.15em] font-semibold text-amber-700 hover:bg-amber-700 hover:text-white transition-all">
                    {{ t.verifierladisponibilite }}
                  </NuxtLink> -->
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Navigation -->
        <button @click="prev" :disabled="currentIndex === 0" class="absolute left-0 sm:-left-4 top-1/3 w-8 h-8 sm:w-10 sm:h-10 bg-white shadow-lg flex items-center justify-center hover:bg-amber-700 hover:text-white transition-all disabled:opacity-30 z-10">
          <Icon name="mdi:chevron-left" class="text-lg sm:text-xl" />
        </button>
        <button @click="next" :disabled="currentIndex >= maxIndex" class="absolute right-0 sm:-right-4 top-1/3 w-8 h-8 sm:w-10 sm:h-10 bg-white shadow-lg flex items-center justify-center hover:bg-amber-700 hover:text-white transition-all disabled:opacity-30 z-10">
          <Icon name="mdi:chevron-right" class="text-lg sm:text-xl" />
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'

const rooms = ref([])
const loading = ref(true)
const currentIndex = ref(0)
const visibleCount = ref(3)
const roomSlides = reactive({})

// Drag state
const isDragging = ref(false)
const dragStartX = ref(0)
const dragOffset = ref(0)
const DRAG_THRESHOLD = 50

const getClientX = (e) => (e.changedTouches || e.touches)?.[0]?.clientX ?? e.clientX

const dragStart = (e) => {
  isDragging.value = true
  dragStartX.value = getClientX(e)
  dragOffset.value = 0
}
const dragMove = (e) => {
  if (!isDragging.value) return
  dragOffset.value = getClientX(e) - dragStartX.value
}
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

const STATIC_KEYS = ['discover', 'chambressuites', 'voirlesdetails', 'nuit', 'verifierladisponibilite']
const t = ref(Object.fromEntries(STATIC_KEYS.map(k => [k, k])))

const { locale, localePath, dir } = useLocale()

const maxIndex = computed(() => Math.max(0, rooms.value.length - visibleCount.value))
const prev = () => { if (currentIndex.value > 0) currentIndex.value-- }
const next = () => { if (currentIndex.value < maxIndex.value) currentIndex.value++ }

const prevRoomSlide = (room) => {
  const imgs = (room.images || []).slice(0, 5)
  const cur = roomSlides[room.id] || 0
  roomSlides[room.id] = cur > 0 ? cur - 1 : imgs.length - 1
}
const nextRoomSlide = (room) => {
  const imgs = (room.images || []).slice(0, 5)
  const cur = roomSlides[room.id] || 0
  roomSlides[room.id] = cur < imgs.length - 1 ? cur + 1 : 0
}

onMounted(async () => {
  updateVisibleCount()
  window.addEventListener('resize', updateVisibleCount)
  const { fetchRooms } = useHotel()
  const { loadCatalogue, transStatic } = useTranslations()
  const [apiRooms, catalogue] = await Promise.all([
    fetchRooms(locale.value),
    loadCatalogue(locale.value),
  ])
  rooms.value = (apiRooms || []).filter(r =>
    r.img?.length > 0 &&
    r.isBookingBasic !== true
  )
  const translated = {}
  for (const key of STATIC_KEYS) translated[key] = transStatic(key, catalogue)
  t.value = translated
  loading.value = false
})
onUnmounted(() => window.removeEventListener('resize', updateVisibleCount))
</script>
