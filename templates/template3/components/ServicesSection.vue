<template>
  <section class="bg-[#f5ede3] py-24 px-6">
    <div class="max-w-7xl mx-auto">

      <!-- Header + arrows -->
      <div class="flex flex-col md:flex-row md:items-end md:justify-between mb-14">
        <div>
          <p class="text-[10px] uppercase tracking-[0.35em] text-[#b7825c] mb-4">Experiences</p>
          <h2 class="font-['Cormorant_Garamond'] text-4xl sm:text-5xl text-[#1a1410] font-light">Services &amp; Wellness</h2>
          <div class="flex items-center gap-3 mt-6">
            <div class="w-10 h-px bg-[#b7825c]"></div>
            <div class="w-2 h-2 border border-[#b7825c] rotate-45 flex-shrink-0"></div>
          </div>
        </div>
        <div class="flex gap-3 mt-8 md:mt-0">
          <button @click="prev" :disabled="currentIndex === 0"
            class="w-11 h-11 border border-[#1a1410]/20 flex items-center justify-center text-[#1a1410]/50 hover:border-[#b7825c] hover:text-[#b7825c] transition-all disabled:opacity-25">
            <Icon name="mdi:arrow-left" class="text-lg" />
          </button>
          <button @click="next" :disabled="currentIndex >= maxIndex"
            class="w-11 h-11 border border-[#1a1410]/20 flex items-center justify-center text-[#1a1410]/50 hover:border-[#b7825c] hover:text-[#b7825c] transition-all disabled:opacity-25">
            <Icon name="mdi:arrow-right" class="text-lg" />
          </button>
        </div>
      </div>

      <!-- Skeleton -->
      <div v-if="loading" class="flex gap-6">
        <div v-for="i in visibleCount" :key="i"
          class="flex-shrink-0 bg-white animate-pulse"
          :style="{ width: `calc(${100 / visibleCount}% - 16px)` }">
          <div class="aspect-[4/3] bg-[#e8d5c0]"></div>
          <div class="p-5 space-y-3"><div class="h-4 bg-[#1a1410]/5 w-2/3"></div><div class="h-3 bg-[#1a1410]/5 w-full"></div></div>
        </div>
      </div>

      <!-- Carousel -->
      <div v-else class="overflow-hidden cursor-grab active:cursor-grabbing select-none"
           @mousedown="dragStart" @mousemove="dragMove" @mouseup="dragEnd" @mouseleave="dragEnd"
           @touchstart.passive="dragStart" @touchmove.passive="dragMove" @touchend="dragEnd">
        <div class="flex ease-in-out"
             :class="isDragging ? 'transition-none' : 'transition-transform duration-500'"
             :style="{ transform: `translateX(calc(-${currentIndex * (100 / visibleCount)}% + ${dragOffset}px))` }">
          <div v-for="svc in services" :key="svc.id"
               class="flex-shrink-0 px-3"
               :style="{ width: `${100 / visibleCount}%` }">
            <div class="group cursor-pointer bg-white" @click="openModal(svc)">
              <div class="relative aspect-[4/3] overflow-hidden bg-[#e8d5c0]">
                <img v-if="svc.images?.[0] || svc.image"
                  :src="svc.images?.[0] || svc.image" :alt="svc.name"
                  class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <Icon name="mdi:star-outline" class="text-5xl text-[#b7825c]/30" />
                </div>
                <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-400"></div>
              </div>
              <div class="p-6">
                <div class="w-8 h-px bg-[#b7825c] mb-4"></div>
                <h3 class="text-[11px] uppercase tracking-[0.2em] font-medium text-[#1a1410] mb-3">{{ svc.name }}</h3>
                <p class="text-[#1a1410]/50 text-sm leading-relaxed line-clamp-2 mb-4" v-html="svc.description || ''"></p>
                <span class="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-[#b7825c] hover:text-[#7a2c28] transition-colors">
                  Discover <Icon name="mdi:arrow-right" class="text-sm" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Dots -->
      <div v-if="services.length > visibleCount" class="flex justify-center gap-2 mt-10">
        <button v-for="(_, i) in dotCount" :key="i" @click="currentIndex = i"
          class="h-1 rounded-full transition-all duration-300"
          :class="currentIndex === i ? 'bg-[#b7825c] w-6' : 'bg-[#1a1410]/15 w-1.5'" />
      </div>

      <!-- CTA -->
      <div class="text-center mt-14">
        <NuxtLink :to="localePath('/services')"
          class="inline-block px-10 py-4 border border-[#b7825c] text-[#b7825c] text-[11px] uppercase tracking-[0.2em] hover:bg-[#b7825c] hover:text-white transition-all">
          All Services
        </NuxtLink>
      </div>
    </div>

    <!-- Modal -->
    <transition name="t3-modal">
      <div v-if="modalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8" @click.self="closeModal">
        <div class="absolute inset-0 bg-[#1a1410]/80 backdrop-blur-sm" @click="closeModal"></div>
        <div v-if="modalSvc" class="relative z-10 w-full max-w-4xl bg-white shadow-2xl flex flex-col md:flex-row max-h-[90vh] overflow-hidden">
          <button @click="closeModal" class="absolute top-5 right-5 z-20 w-9 h-9 flex items-center justify-center border border-[#1a1410]/15 text-[#1a1410]/40 hover:border-[#b7825c] hover:text-[#b7825c] transition-colors">
            <Icon name="mdi:close" class="text-lg" />
          </button>
          <!-- Image -->
          <div class="relative md:w-1/2 flex-shrink-0 bg-[#f5ede3] min-h-[220px]">
            <template v-if="modalImages.length">
              <img v-for="(img, idx) in modalImages" :key="idx" :src="img" :alt="modalSvc.name"
                class="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                :class="modalSlide === idx ? 'opacity-100' : 'opacity-0'" />
              <template v-if="modalImages.length > 1">
                <button @click="modalSlide = modalSlide > 0 ? modalSlide - 1 : modalImages.length - 1"
                  class="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white flex items-center justify-center z-10">
                  <Icon name="mdi:chevron-left" class="text-[#1a1410]" />
                </button>
                <button @click="modalSlide = modalSlide < modalImages.length - 1 ? modalSlide + 1 : 0"
                  class="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white flex items-center justify-center z-10">
                  <Icon name="mdi:chevron-right" class="text-[#1a1410]" />
                </button>
              </template>
            </template>
            <div v-else class="absolute inset-0 flex items-center justify-center">
              <Icon name="mdi:star-outline" class="text-7xl text-[#b7825c]/30" />
            </div>
          </div>
          <!-- Content -->
          <div class="md:w-1/2 flex flex-col justify-center overflow-y-auto px-10 py-12">
            <p v-if="modalSvc._groupName" class="text-[10px] uppercase tracking-[0.3em] text-[#b7825c] mb-4">{{ modalSvc._groupName }}</p>
            <h3 class="font-['Cormorant_Garamond'] text-4xl text-[#1a1410] font-light leading-tight mb-4">{{ modalSvc.name }}</h3>
            <div class="w-8 h-px bg-[#b7825c] mb-6"></div>
            <div class="text-[#1a1410]/55 text-sm leading-relaxed mb-10" v-html="modalSvc.description || ''"></div>
            <div class="flex items-center gap-6 pt-6 border-t border-[#1a1410]/8">
              <NuxtLink :to="localePath('/availibility')"
                class="px-8 py-3.5 bg-[#b7825c] text-white text-[10px] uppercase tracking-[0.25em] hover:bg-[#9a6a48] transition-all">
                Book Now
              </NuxtLink>
              <button @click="closeModal" class="text-[#1a1410]/40 text-[10px] uppercase tracking-[0.2em] hover:text-[#1a1410] transition-colors">Close</button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const { locale, localePath } = useLocale()
const services     = ref([])
const loading      = ref(true)
const currentIndex = ref(0)
const visibleCount = ref(3)
const modalOpen    = ref(false)
const modalSvc     = ref(null)
const modalSlide   = ref(0)

const maxIndex  = computed(() => Math.max(0, services.value.length - visibleCount.value))
const dotCount  = computed(() => maxIndex.value + 1)
const prev = () => { if (currentIndex.value > 0) currentIndex.value-- }
const next = () => { if (currentIndex.value < maxIndex.value) currentIndex.value++ }

const modalImages = computed(() =>
  (modalSvc.value?.images || (modalSvc.value?.image ? [modalSvc.value.image] : [])).slice(0, 6)
)

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

const openModal  = (svc) => { modalSvc.value = svc; modalSlide.value = 0; modalOpen.value = true; document.body.style.overflow = 'hidden' }
const closeModal = () => { modalOpen.value = false; document.body.style.overflow = '' }

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
  const { fetchServices } = useHotel()
  const groups = await fetchServices(locale.value)
  services.value = (groups || []).flatMap(g => g.services.map(s => ({ ...s, _groupName: g.name })))
  loading.value = false
})
onUnmounted(() => window.removeEventListener('resize', updateVisibleCount))
</script>

<style scoped>
.t3-modal-enter-active { transition: opacity 0.3s ease; }
.t3-modal-leave-active { transition: opacity 0.25s ease; }
.t3-modal-enter-from, .t3-modal-leave-to { opacity: 0; }
.t3-modal-enter-active .relative.z-10 { transition: transform 0.3s ease, opacity 0.3s ease; }
.t3-modal-leave-active .relative.z-10 { transition: transform 0.2s ease, opacity 0.25s ease; }
.t3-modal-enter-from .relative.z-10 { transform: scale(0.96); opacity: 0; }
.t3-modal-leave-to   .relative.z-10 { transform: scale(0.96); opacity: 0; }
</style>
