<template>
  <section class="bg-[#fbf8f6] py-24 px-6">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-14">
        <p class="text-[10px] uppercase tracking-[0.35em] text-[#b7825c] mb-4">Visual Journey</p>
        <h2 class="font-['Cormorant_Garamond'] text-4xl sm:text-5xl text-[#1a1410] font-light">{{ t.gallery || 'Gallery' }}</h2>
        <div class="flex items-center justify-center gap-3 mt-6">
          <div class="w-10 h-px bg-[#b7825c]"></div>
          <div class="w-2 h-2 border border-[#b7825c] rotate-45 flex-shrink-0"></div>
          <div class="w-10 h-px bg-[#b7825c]"></div>
        </div>
      </div>

      <!-- Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div v-for="(photo, i) in photos.slice(0, 9)" :key="i"
          class="relative overflow-hidden cursor-pointer group"
          :class="i === 0 ? 'sm:col-span-2 lg:col-span-1' : ''"
          @click="openLightbox(i)">
          <div class="aspect-[4/3] overflow-hidden bg-[#e8d5c0]">
            <img :src="photo.url" :alt="photo.alt || `Photo ${i + 1}`"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108" loading="lazy" />
          </div>
          <div class="absolute inset-0 bg-[#1a1410]/0 group-hover:bg-[#1a1410]/30 transition-colors duration-400 flex items-center justify-center">
            <Icon name="mdi:magnify-plus-outline" class="text-white text-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>
      </div>

      <div class="text-center mt-12">
        <NuxtLink :to="localePath('/gallery')"
          class="inline-block px-10 py-4 border border-[#b7825c] text-[#b7825c] text-[11px] uppercase tracking-[0.2em] hover:bg-[#b7825c] hover:text-white transition-all">
          {{ t.gallery || 'View Full Gallery' }}
        </NuxtLink>
      </div>
    </div>

    <!-- Lightbox -->
    <transition name="t3-lb">
      <div v-if="lbOpen" class="fixed inset-0 z-50 bg-[#1a1410]/95 flex flex-col" @keydown.prevent>
        <!-- Top bar -->
        <div class="flex items-center justify-between px-6 py-4 flex-shrink-0">
          <span class="text-white/40 text-sm">{{ lbIndex + 1 }} / {{ photos.length }}</span>
          <button @click="lbClose" class="text-white/60 hover:text-white transition-colors">
            <Icon name="mdi:close" class="text-2xl" />
          </button>
        </div>
        <!-- Main image -->
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
        <!-- Thumbnail strip -->
        <div class="flex-shrink-0 flex gap-2 overflow-x-auto px-6 py-4 justify-center">
          <button v-for="(ph, i) in photos" :key="i" @click="lbIndex = i"
            class="flex-shrink-0 w-14 h-10 overflow-hidden transition-opacity"
            :class="lbIndex === i ? 'ring-2 ring-[#b7825c] opacity-100' : 'opacity-40 hover:opacity-70'">
            <img :src="ph.url" :alt="ph.alt || ''" class="w-full h-full object-cover" loading="lazy" />
          </button>
        </div>
      </div>
    </transition>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const { locale, localePath } = useLocale()
const photos = ref([])
const t      = ref({})
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
  const { loadCatalogue, transStatic } = useTranslations()
  const [gallery, catalogue] = await Promise.all([fetchGallery(), loadCatalogue(locale.value)])
  photos.value = gallery || []
  t.value = { gallery: transStatic('gallery', catalogue) }
})
onUnmounted(() => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' })
</script>

<style scoped>
.t3-lb-enter-active, .t3-lb-leave-active { transition: opacity 0.3s ease; }
.t3-lb-enter-from, .t3-lb-leave-to { opacity: 0; }
.t3-lb-img-enter-active, .t3-lb-img-leave-active { transition: opacity 0.25s ease; }
.t3-lb-img-enter-from, .t3-lb-img-leave-to { opacity: 0; }
</style>
