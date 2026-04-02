<template>
  <section id="rooms" class="bg-[#F5F5F5] py-24 px-6">
    <div class="max-w-7xl mx-auto">

      <!-- Header + arrows -->
      <div class="flex flex-col md:flex-row md:items-end md:justify-between mb-14">
        <div>
          <p class="text-[10px] uppercase tracking-[0.3em] text-[#C9A96E] mb-4">Accommodation</p>
          <h2 class="font-['Cormorant_Garamond'] text-4xl sm:text-5xl text-[#111] font-light">Rooms &amp; Suites</h2>
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

      <!-- Skeleton while loading -->
      <div v-if="!rooms.length" class="flex gap-6">
        <div v-for="i in visibleCount" :key="i"
          class="flex-shrink-0 bg-[#F5F5F5] animate-pulse"
          :style="{ width: `calc(${100 / visibleCount}% - ${(visibleCount - 1) * 24 / visibleCount}px)` }">
          <div class="aspect-[4/3] bg-[#111]/5"></div>
          <div class="p-5 space-y-2">
            <div class="h-3 bg-[#111]/5 w-1/3"></div>
            <div class="h-5 bg-[#111]/5 w-2/3"></div>
          </div>
        </div>
      </div>

      <!-- Carousel -->
      <div v-else class="overflow-hidden cursor-grab active:cursor-grabbing select-none"
           @mousedown="dragStart" @mousemove="dragMove" @mouseup="dragEnd" @mouseleave="dragEnd"
           @touchstart.passive="dragStart" @touchmove.passive="dragMove" @touchend="dragEnd">
        <div
          class="flex ease-in-out"
          :class="isDragging ? 'transition-none' : 'transition-transform duration-500'"
          :style="{ transform: `translateX(calc(-${currentIndex * slideWidth}% + ${dragOffset}px))` }">
          <div
            v-for="room in rooms" :key="room.id"
            class="flex-shrink-0 px-3"
            :style="{ width: `${100 / visibleCount}%` }">
            <NuxtLink
              :to="localePath(`/rooms/${room.slug}`)"
              class="group relative overflow-hidden block bg-[#F5F5F5] cursor-pointer">

              <!-- Image -->
              <div class="aspect-[4/3] overflow-hidden">
                <img :src="room.thumbnail || room.image" :alt="room.name"
                  class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy" />
              </div>

              <!-- Hover overlay -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex flex-col justify-end p-6">
                <!-- <p class="text-[9px] uppercase tracking-[0.2em] text-[#C9A96E] mb-1">{{ room.category }}</p> -->
                <!-- <h3 class="font-['Cormorant_Garamond'] text-white text-2xl font-light">{{ room.name }}</h3> -->
                <!-- <p class="text-white/70 text-xs mt-2">{{ room.size }} m² · {{ room.guests }} guests</p> -->
                <span class="mt-4 text-[10px] uppercase tracking-[0.2em] text-[#C9A96E] border-b border-[#C9A96E]/50 pb-0.5 inline-block w-fit">Discover →</span>
              </div>

              <!-- Always-visible name bar -->
              <div class="p-5 bg-[#F5F5F5]">
                <p class="text-[9px] uppercase tracking-[0.2em] text-[#C9A96E] mb-1">{{ room.category }}</p>
                <h3 class="font-['Cormorant_Garamond'] text-[#111] text-xl font-light">{{ room.name }}</h3>
                <p class="text-[#111]/40 text-xs mt-1">{{ room.size }} m² · {{ room.guests }} guests</p>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Dot indicators -->
      <div v-if="rooms.length > visibleCount" class="flex justify-center gap-2 mt-10">
        <button
          v-for="(_, i) in dotCount" :key="i"
          @click="currentIndex = i"
          class="h-1 rounded-full transition-all duration-300"
          :class="currentIndex === i ? 'bg-[#C9A96E] w-6' : 'bg-[#111]/15 w-1.5'" />
      </div>

      <!-- CTA -->
      <div class="text-center mt-14">
        <NuxtLink :to="localePath('/rooms')"
          class="inline-block px-10 py-4 border border-[#C9A96E] text-[#C9A96E] text-[11px] uppercase tracking-[0.2em] hover:bg-[#C9A96E] hover:text-white transition-all">
          View All Rooms
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const { locale, localePath } = useLocale()

const rooms        = ref([])
const currentIndex = ref(0)
const visibleCount = ref(3)

// Width of each slide step as % of container
const slideWidth = computed(() => 100 / visibleCount.value)
const maxIndex   = computed(() => Math.max(0, rooms.value.length - visibleCount.value))
const dotCount   = computed(() => Math.max(0, rooms.value.length - visibleCount.value) + 1)

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
  // Clamp index when resizing
  if (currentIndex.value > maxIndex.value) currentIndex.value = maxIndex.value
}

onMounted(async () => {
  updateVisibleCount()
  window.addEventListener('resize', updateVisibleCount)
  const { fetchRooms } = useHotel()
  rooms.value = ((await fetchRooms(locale.value)) || []).filter(r =>
    r.img?.length > 0 &&
    r.isBookingBasic !== true
  )
})
onUnmounted(() => window.removeEventListener('resize', updateVisibleCount))
</script>
