<template>
  <div class="bg-white min-h-screen">

    <!-- Full-screen hero -->
    <PageHero title="Rooms &amp; Suites" :image="heroImg" />

    <!-- Rooms — alternating zigzag list -->
    <div class="max-w-7xl mx-auto px-6 py-10">

      <div v-if="rooms.length">
        <div v-for="(room, i) in rooms" :key="room.id"
          class="flex flex-col md:flex-row items-stretch mb-20 last:mb-0"
          :class="i % 2 !== 0 ? 'md:flex-row-reverse' : ''">

          <!-- Image with carousel -->
          <div class="relative md:w-[58%] overflow-hidden bg-[#F0F0F0] group">
            <!-- Photo -->
            <div class="aspect-[4/3] md:aspect-auto md:h-full min-h-[340px] overflow-hidden">
              <img
                :src="getCurrentImage(room)"
                :alt="room.name"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
            </div>

            <!-- Carousel arrows (only if multiple images) -->
            <template v-if="getImages(room).length > 1">
              <button
                @click.prevent="prevImage(room)"
                class="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white flex items-center justify-center transition-colors z-10">
                <Icon name="mdi:chevron-left" class="text-[#111] text-xl" />
              </button>
              <button
                @click.prevent="nextImage(room)"
                class="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white flex items-center justify-center transition-colors z-10">
                <Icon name="mdi:chevron-right" class="text-[#111] text-xl" />
              </button>

              <!-- Dot indicators -->
              <div class="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10">
                <button
                  v-for="(_, idx) in getImages(room)" :key="idx"
                  @click.prevent="setImage(room, idx)"
                  class="w-1.5 h-1.5 rounded-full transition-colors"
                  :class="getActiveIndex(room) === idx ? 'bg-white' : 'bg-white/40'" />
              </div>
            </template>
          </div>

          <!-- Text content -->
          <div class="md:w-[42%] flex flex-col justify-center px-10 py-14"
            :class="i % 2 !== 0 ? 'md:pl-6 md:pr-14' : 'md:pl-14 md:pr-6'">

            <p v-if="room.category" class="text-[10px] uppercase tracking-[0.3em] text-[#C9A96E] mb-4">
              {{ room.category }}
            </p>

            <h2 class="font-['Cormorant_Garamond'] text-4xl sm:text-5xl text-[#111] font-light mb-6 leading-tight">
              {{ room.name }}
            </h2>

            <!-- Specs -->
            <div class="flex items-center gap-8 mb-6 text-[#111]/50 text-sm">
              <span v-if="room.size" class="flex items-center gap-2">
                <Icon name="mdi:crop-square" class="text-base flex-shrink-0" />
                {{ room.size }} m²
              </span>
              <span v-if="room.guests" class="flex items-center gap-2">
                <Icon name="mdi:account-multiple-outline" class="text-base flex-shrink-0" />
                {{ room.guests }}
              </span>
              <span v-if="room.bedType" class="flex items-center gap-2">
                <Icon name="mdi:bed-outline" class="text-base flex-shrink-0" />
                {{ room.bedType }}
              </span>
            </div>

            <div class="w-8 h-px bg-[#C9A96E] mb-6"></div>

            <p class="text-[#111]/55 text-sm leading-relaxed mb-10">
              {{ room.description || room.shortDescription || '' }}
            </p>

            <!-- Actions -->
            <div class="flex items-center gap-8">
              <NuxtLink :to="localePath('/availibility')"
                class="px-8 py-3.5 bg-[#111] text-white text-[10px] uppercase tracking-[0.25em] hover:bg-[#333] transition-all">
                Search
              </NuxtLink>
              <NuxtLink :to="localePath(`/rooms/${room.slug}`)"
                class="text-[#111] text-[10px] uppercase tracking-[0.2em] border-b border-[#111]/30 pb-0.5 hover:text-[#C9A96E] hover:border-[#C9A96E] transition-colors">
                More information
              </NuxtLink>
            </div>
          </div>

        </div>
      </div>

      <!-- Loading -->
      <div v-else class="flex justify-center py-28">
        <div class="w-10 h-10 border-2 border-[#C9A96E] border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

const { locale, localePath } = useLocale()
const rooms   = ref([])
const heroImg = ref('')

// Per-room image index tracker
const imageIndexes = reactive({})

// Return all available images for a room
const getImages = (room) => {
  if (room.images?.length) return room.images
  const fallback = room.thumbnail || room.image
  return fallback ? [fallback] : []
}

const getActiveIndex = (room) => imageIndexes[room.id] ?? 0
const getCurrentImage = (room) => getImages(room)[getActiveIndex(room)] || ''

const setImage = (room, idx) => { imageIndexes[room.id] = idx }
const nextImage = (room) => {
  const imgs = getImages(room)
  imageIndexes[room.id] = ((getActiveIndex(room) + 1) % imgs.length)
}
const prevImage = (room) => {
  const imgs = getImages(room)
  imageIndexes[room.id] = ((getActiveIndex(room) - 1 + imgs.length) % imgs.length)
}

onMounted(async () => {
  const { fetchGallery, fetchRooms } = useHotel()
  const [roomsData, gallery] = await Promise.all([
    fetchRooms(locale.value),
    fetchGallery(),
  ])
  rooms.value = (roomsData || []).filter(r =>
    r.img?.length > 0 &&
    r.isBookingBasic !== true
  )
  heroImg.value = gallery[0]?.url || ''
})
</script>
