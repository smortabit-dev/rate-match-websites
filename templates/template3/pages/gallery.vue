<template>
  <div class="bg-[#f5ede3] min-h-screen">
    <TheHeader />
    <PageHero title="Gallery" subtitle="Visual Journey" :image="photos[0]?.url" />

    <div class="max-w-7xl mx-auto px-6 py-16 bg-[#f4ece6]">

      <div v-if="loading" class="flex justify-center py-20">
        <div class="w-10 h-10 border-2 border-[#b7825c] border-t-transparent rounded-full animate-spin"></div>
      </div>

      <!-- Grid -->
      <div v-else class="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        <div v-for="(photo, i) in photos" :key="i"
          class="break-inside-avoid cursor-pointer group relative overflow-hidden"
          @click="openLightbox(i)">
          <img :src="photo.url" :alt="photo.alt || `Photo ${i + 1}`"
            class="w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
          <div class="absolute inset-0 bg-[#1a1410]/0 group-hover:bg-[#1a1410]/30 transition-colors flex items-center justify-center">
            <Icon name="mdi:magnify-plus-outline" class="text-white text-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>
    </div>

    <!-- Lightbox -->
    <transition name="t3-lb">
      <div v-if="lbOpen" class="fixed inset-0 z-50 bg-[#1a1410]/95 flex flex-col">
        <div class="flex items-center justify-between px-6 py-4 flex-shrink-0">
          <span class="text-white/40 text-sm">{{ lbIndex + 1 }} / {{ photos.length }}</span>
          <button @click="lbClose" class="text-white/60 hover:text-white transition-colors">
            <Icon name="mdi:close" class="text-2xl" />
          </button>
        </div>
        <div class="flex-1 flex items-center justify-center relative px-16 min-h-0">
          <button @click="lbPrev" class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 border border-white/20 flex items-center justify-center text-white hover:border-[#b7825c] hover:text-[#b7825c] transition-colors z-10">
            <Icon name="mdi:arrow-left" class="text-lg" />
          </button>
          <transition name="t3-lb-img" mode="out-in">
            <img :key="lbIndex" :src="photos[lbIndex]?.url" :alt="photos[lbIndex]?.alt || ''"
              class="max-h-full max-w-full object-contain" />
          </transition>
          <button @click="lbNext" class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 border border-white/20 flex items-center justify-center text-white hover:border-[#b7825c] hover:text-[#b7825c] transition-colors z-10">
            <Icon name="mdi:arrow-right" class="text-lg" />
          </button>
        </div>
        <div class="flex-shrink-0 flex gap-2 overflow-x-auto px-6 py-4 justify-center">
          <button v-for="(ph, i) in photos" :key="i" @click="lbIndex = i"
            class="flex-shrink-0 w-14 h-10 overflow-hidden transition-opacity"
            :class="lbIndex === i ? 'ring-2 ring-[#b7825c] opacity-100' : 'opacity-40 hover:opacity-70'">
            <img :src="ph.url" :alt="ph.alt || ''" class="w-full h-full object-cover" loading="lazy" />
          </button>
        </div>
      </div>
    </transition>

    <TheFooter />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import TheHeader from '../components/TheHeader.vue'
import TheFooter from '../components/TheFooter.vue'
import PageHero  from '../components/PageHero.vue'

const photos  = ref([])
const loading = ref(true)
const lbOpen  = ref(false)
const lbIndex = ref(0)

const openLightbox = (i) => { lbIndex.value = i; lbOpen.value = true; document.body.style.overflow = 'hidden' }
const lbClose      = () => { lbOpen.value = false; document.body.style.overflow = '' }
const lbPrev       = () => { lbIndex.value = lbIndex.value > 0 ? lbIndex.value - 1 : photos.value.length - 1 }
const lbNext       = () => { lbIndex.value = lbIndex.value < photos.value.length - 1 ? lbIndex.value + 1 : 0 }

const onKey = (e) => {
  if (!lbOpen.value) return
  if (e.key === 'ArrowLeft')  lbPrev()
  if (e.key === 'ArrowRight') lbNext()
  if (e.key === 'Escape')     lbClose()
}

onMounted(async () => {
  window.addEventListener('keydown', onKey)
  const { fetchGallery } = useHotel()
  photos.value = await fetchGallery() || []
  loading.value = false
})
onUnmounted(() => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' })
</script>

<style scoped>
.t3-lb-enter-active, .t3-lb-leave-active { transition: opacity 0.3s ease; }
.t3-lb-enter-from, .t3-lb-leave-to { opacity: 0; }
.t3-lb-img-enter-active, .t3-lb-img-leave-active { transition: opacity 0.25s ease; }
.t3-lb-img-enter-from, .t3-lb-img-leave-to { opacity: 0; }
</style>
