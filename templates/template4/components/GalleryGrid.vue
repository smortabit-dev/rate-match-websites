<template>
  <section id="gallery" class="py-24 bg-[#f9f7f4] overflow-hidden">
    <div class="text-center mb-16 px-6">
      <h2 class="text-5xl md:text-6xl font-serif font-bold text-[#002B5B]">Gallery</h2>
    </div>

    <div class="relative">
      <!-- Dark Blue Block on the left (Main View) -->
      <div class="absolute left-0 top-0 bottom-0 w-[80%] md:w-[350px] bg-[#1a2b4b] z-10 hidden md:flex flex-col justify-center items-center px-10">
        <div class="flex flex-col items-center gap-10">
          <div class="flex flex-col gap-6">
            <button @click="next" class="w-16 h-16 rounded-full border border-white flex items-center justify-center text-white hover:bg-white hover:text-[#1a2b4b] transition-all duration-300">
              <Icon name="mdi:arrow-right" class="text-2xl" />
            </button>
            <button @click="prev" class="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center text-white/30 hover:border-white hover:text-white transition-all duration-300">
              <Icon name="mdi:arrow-left" class="text-2xl" />
            </button>
          </div>
          
          <div class="text-white text-center">
            <div class="flex items-end gap-2 leading-none">
              <span class="text-5xl font-bold tracking-tighter">{{ String((currentIndex % photos.length) + 1).padStart(2, '0') }}</span>
              <span class="text-xl font-bold opacity-40 mb-1">{{ String(photos.length).padStart(2, '0') }}</span>
            </div>
            <div class="w-12 h-[3px] bg-[#D4AF37] mx-auto mt-4"></div>
          </div>
        </div>
      </div>

      <!-- Mobile Controls (Main View) -->
      <div class="md:hidden flex justify-center gap-4 mb-8">
        <button @click="prev" class="w-12 h-12 rounded-full bg-[#1a2b4b] flex items-center justify-center text-white">
          <Icon name="mdi:arrow-left" class="text-xl" />
        </button>
        <button @click="next" class="w-12 h-12 rounded-full bg-[#1a2b4b] flex items-center justify-center text-white">
          <Icon name="mdi:arrow-right" class="text-xl" />
        </button>
      </div>

      <!-- Carousel Container -->
      <div class="md:pl-[350px]">
        <div class="overflow-visible">
          <div class="flex transition-transform duration-700 ease-in-out" :style="{ transform: `translateX(-${currentIndex * (100 / visibleCount)}%)` }">
            <div v-for="(photo, idx) in photos" :key="idx" class="flex-shrink-0 px-3 md:px-5" :style="{ width: `${100 / visibleCount}%` }">
              <div class="aspect-[1.5/1] overflow-hidden shadow-lg group relative cursor-pointer" @click="openLightbox(idx)">
                <img :src="photo.url" :alt="photo.alt" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Icon name="mdi:magnify-plus" class="text-4xl text-white transform scale-50 group-hover:scale-100 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Lightbox Modal (Simplified) -->
    <Teleport to="body">
      <div v-if="lightboxIdx !== null" class="fixed inset-0 z-[200] flex items-center justify-center animate-fade-in">
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black/85 backdrop-blur-sm" @click="closeLightbox"></div>

        <!-- Close Button (Top Right) -->
        <button @click="closeLightbox" class="absolute top-0 right-0 z-[210] bg-[#D4AF37] text-[#002B5B] px-8 py-5 font-bold uppercase tracking-widest flex items-center gap-3 hover:bg-[#c4a132] transition-colors shadow-lg">
          <Icon name="mdi:close" class="text-2xl" />
          Close
        </button>

        <!-- Navigation Arrows (Centered overlay style) -->
        <button @click="prevLightbox" class="absolute left-6 md:left-12 z-[220] w-14 h-14 md:w-16 md:h-16 rounded-full bg-white text-black flex items-center justify-center hover:bg-[#D4AF37] hover:text-white transition-all shadow-xl">
           <Icon name="mdi:arrow-left" class="text-2xl md:text-3xl" />
        </button>
        <button @click="nextLightbox" class="absolute right-6 md:right-12 z-[220] w-14 h-14 md:w-16 md:h-16 rounded-full bg-white text-black flex items-center justify-center hover:bg-[#D4AF37] hover:text-white transition-all shadow-xl">
           <Icon name="mdi:arrow-right" class="text-2xl md:text-3xl" />
        </button>

        <!-- Main Image Area -->
        <div class="relative max-w-full max-h-[85vh] px-4 md:px-0 animate-zoom-in pointer-events-none">
           <img :src="photos[lightboxIdx].url" :alt="photos[lightboxIdx].alt" class="max-w-full max-h-[85vh] object-contain border-[10px] border-white shadow-2xl" />
           <!-- Counter overlay in popup -->
           <div class="absolute bottom-[-50px] left-1/2 -translate-x-1/2 text-white font-bold opacity-60 tracking-[0.3em] text-sm">
             {{ String(lightboxIdx + 1).padStart(2, '0') }} / {{ String(photos.length).padStart(2, '0') }}
           </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const photos = ref([])
const currentIndex = ref(0)
const visibleCount = ref(3)
const lightboxIdx = ref(null)

const updateVisibleCount = () => {
  const w = window.innerWidth
  if (w < 768) visibleCount.value = 1.2
  else if (w < 1280) visibleCount.value = 2.2
  else visibleCount.value = 3.2
}

const prev = () => { currentIndex.value = currentIndex.value > 0 ? currentIndex.value - 1 : photos.value.length - 1 }
const next = () => { currentIndex.value = currentIndex.value < photos.value.length - 1 ? currentIndex.value + 1 : 0 }

const prevLightbox = () => { lightboxIdx.value = lightboxIdx.value > 0 ? lightboxIdx.value - 1 : photos.value.length - 1 }
const nextLightbox = () => { lightboxIdx.value = lightboxIdx.value < photos.value.length - 1 ? lightboxIdx.value + 1 : 0 }

const openLightbox = (idx) => {
  lightboxIdx.value = idx
  document.body.style.overflow = 'hidden'
}
const closeLightbox = () => {
  lightboxIdx.value = null
  document.body.style.overflow = 'auto'
}

onMounted(async () => {
  updateVisibleCount()
  window.addEventListener('resize', updateVisibleCount)
  
  const { fetchGallery } = useHotel()
  const res = await fetchGallery()
  if (res && res.length) {
    photos.value = res
  } else {
    // Fallback data
    photos.value = Array(6).fill({ url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200', alt: 'Hotel Gallery' })
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', updateVisibleCount)
  document.body.style.overflow = 'auto'
})
</script>

<style scoped>
.font-serif {
  font-family: 'Playfair Display', serif;
}
.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}
.animate-zoom-in {
  animation: zoomIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes zoomIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
</style>
