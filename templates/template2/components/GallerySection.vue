<template>
  <section id="gallery" class="bg-white py-24 px-6">
    <div class="max-w-7xl mx-auto">
      <div class="mb-14">
        <p class="text-[10px] uppercase tracking-[0.3em] text-[#C9A96E] mb-4">Visual Journey</p>
        <h2 class="font-['Cormorant_Garamond'] text-4xl sm:text-5xl text-[#111] font-light">Gallery</h2>
        <div class="w-10 h-px bg-[#C9A96E] mt-6"></div>
      </div>

      <!-- Mosaic grid — 6 photos, Principal Madrid layout -->
      <div class="t2-mosaic" v-if="photos.length >= 6">

        <!-- img 0: tall portrait left (spans 2 rows) -->
        <div class="t2-mosaic__item t2-mosaic__item--0 group cursor-pointer overflow-hidden"
          @click="openLightbox(0)">
          <img :src="photos[0].url" :alt="photos[0].alt || 'Gallery'"
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
          <div class="t2-overlay">
            <span class="t2-plus">+</span>
          </div>
        </div>

        <!-- img 1: landscape top-center -->
        <div class="t2-mosaic__item t2-mosaic__item--1 group cursor-pointer overflow-hidden"
          @click="openLightbox(1)">
          <img :src="photos[1].url" :alt="photos[1].alt || 'Gallery'"
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
          <div class="t2-overlay">
            <span class="t2-plus">+</span>
          </div>
        </div>

        <!-- img 2: tall portrait right (spans 2 rows) -->
        <div class="t2-mosaic__item t2-mosaic__item--2 group cursor-pointer overflow-hidden"
          @click="openLightbox(2)">
          <img :src="photos[2].url" :alt="photos[2].alt || 'Gallery'"
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
          <div class="t2-overlay">
            <span class="t2-plus">+</span>
          </div>
        </div>

        <!-- img 3: landscape bottom-center -->
        <div class="t2-mosaic__item t2-mosaic__item--3 group cursor-pointer overflow-hidden"
          @click="openLightbox(3)">
          <img :src="photos[3].url" :alt="photos[3].alt || 'Gallery'"
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
          <div class="t2-overlay">
            <span class="t2-plus">+</span>
          </div>
        </div>

        <!-- img 4: wide landscape bottom-left (spans 2 cols) -->
        <div class="t2-mosaic__item t2-mosaic__item--4 group cursor-pointer overflow-hidden"
          @click="openLightbox(4)">
          <img :src="photos[4].url" :alt="photos[4].alt || 'Gallery'"
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
          <div class="t2-overlay">
            <span class="t2-plus">+</span>
          </div>
        </div>

        <!-- img 5: small square bottom-right top -->
        <div class="t2-mosaic__item t2-mosaic__item--5 group cursor-pointer overflow-hidden"
          @click="openLightbox(5)">
          <img :src="photos[5].url" :alt="photos[5].alt || 'Gallery'"
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
          <div class="t2-overlay">
            <span class="t2-plus">+</span>
          </div>
        </div>

        <!-- img 6: small square bottom-right bottom (+ remaining count) -->
        <div v-if="photos[6]"
          class="t2-mosaic__item t2-mosaic__item--6 group cursor-pointer overflow-hidden"
          @click="openLightbox(6)">
          <img :src="photos[6].url" :alt="photos[6].alt || 'Gallery'"
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
          <div class="t2-overlay">
            <span v-if="photos.length > 7" class="t2-plus text-2xl font-light">
              +{{ photos.length - 7 }}
            </span>
            <span v-else class="t2-plus">+</span>
          </div>
        </div>
      </div>

      <!-- Fallback simple grid if fewer than 6 photos -->
      <div v-else class="grid grid-cols-2 md:grid-cols-3 gap-1">
        <div v-for="(img, i) in photos.slice(0, 6)" :key="img.id || i"
          class="relative group cursor-pointer overflow-hidden aspect-square"
          @click="openLightbox(i)">
          <img :src="img.url" :alt="img.alt || 'Gallery'"
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
          <div class="t2-overlay"><span class="t2-plus">+</span></div>
        </div>
      </div>

      <!-- CTA -->
      <div class="text-center mt-12">
        <NuxtLink :to="localePath('/gallery')"
          class="inline-block px-10 py-4 border border-[#111]/30 text-[#111] text-[11px] uppercase tracking-[0.2em] hover:border-[#C9A96E] hover:text-[#C9A96E] transition-all" >
          View Full Gallery
        </NuxtLink>
      </div>
    </div>

    <!-- Lightbox -->
    <transition name="lb">
      <div v-if="lbOpen"
        class="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
        @click.self="lbClose" @keydown.esc="lbClose">

        <!-- Close -->
        <button @click="lbClose"
          class="absolute top-5 right-5 w-10 h-10 flex items-center justify-center border border-white/20 text-white/60 hover:border-[#C9A96E] hover:text-[#C9A96E] transition-colors z-10">
          <Icon name="mdi:close" class="text-xl" />
        </button>

        <!-- Counter -->
        <span class="absolute top-5 left-1/2 -translate-x-1/2 text-white/40 text-xs uppercase tracking-[0.2em]">
          {{ lbIndex + 1 }} / {{ photos.length }}
        </span>

        <!-- Prev -->
        <button @click="lbPrev"
          class="absolute left-4 sm:left-8 w-11 h-11 flex items-center justify-center border border-white/20 text-white/60 hover:border-[#C9A96E] hover:text-[#C9A96E] transition-colors z-10">
          <Icon name="mdi:arrow-left" class="text-lg" />
        </button>

        <!-- Image -->
        <transition name="lb-img" mode="out-in">
          <img :key="lbIndex" :src="photos[lbIndex]?.url" :alt="photos[lbIndex]?.alt || 'Gallery'"
            class="max-h-[85vh] max-w-[90vw] object-contain select-none" />
        </transition>

        <!-- Next -->
        <button @click="lbNext"
          class="absolute right-4 sm:right-8 w-11 h-11 flex items-center justify-center border border-white/20 text-white/60 hover:border-[#C9A96E] hover:text-[#C9A96E] transition-colors z-10">
          <Icon name="mdi:arrow-right" class="text-lg" />
        </button>

        <!-- Thumbnails strip -->
        <div class="absolute bottom-5 left-0 right-0 flex justify-center gap-1.5 px-4 overflow-x-auto">
          <button v-for="(p, i) in photos" :key="i" @click="lbIndex = i"
            class="flex-shrink-0 w-12 h-8 overflow-hidden transition-opacity"
            :class="lbIndex === i ? 'opacity-100 ring-1 ring-[#C9A96E]' : 'opacity-40 hover:opacity-70'">
            <img :src="p.url" class="w-full h-full object-cover" />
          </button>
        </div>
      </div>
    </transition>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const { localePath } = useLocale()
const photos = ref([])

// Lightbox
const lbOpen  = ref(false)
const lbIndex = ref(0)

const openLightbox = (i) => {
  lbIndex.value = i
  lbOpen.value = true
  document.body.style.overflow = 'hidden'
}
const lbClose = () => {
  lbOpen.value = false
  document.body.style.overflow = ''
}
const lbPrev = () => { lbIndex.value = lbIndex.value > 0 ? lbIndex.value - 1 : photos.value.length - 1 }
const lbNext = () => { lbIndex.value = lbIndex.value < photos.value.length - 1 ? lbIndex.value + 1 : 0 }

const onKey = (e) => {
  if (!lbOpen.value) return
  if (e.key === 'ArrowLeft') lbPrev()
  else if (e.key === 'ArrowRight') lbNext()
  else if (e.key === 'Escape') lbClose()
}

onMounted(async () => {
  window.addEventListener('keydown', onKey)
  const { fetchGallery } = useHotel()
  photos.value = await fetchGallery()
})
onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>

<style scoped>
/* ── Mosaic grid ── */
.t2-mosaic {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 280px 280px 320px;
  gap: 4px;
}

/* Portrait left — rows 1-2 */
.t2-mosaic__item--0 { grid-column: 1; grid-row: 1 / span 2; }
/* Landscape top-center */
.t2-mosaic__item--1 { grid-column: 2; grid-row: 1; }
/* Portrait right — rows 1-2 */
.t2-mosaic__item--2 { grid-column: 3; grid-row: 1 / span 2; }
/* Landscape bottom-center */
.t2-mosaic__item--3 { grid-column: 2; grid-row: 2; }
/* Wide landscape — col-span 2 */
.t2-mosaic__item--4 { grid-column: 1 / span 2; grid-row: 3; }
/* Small square top-right */
.t2-mosaic__item--5 { grid-column: 3; grid-row: 3; }
/* Small square bottom-right (stacked with 5 via inner split) */
.t2-mosaic__item--6 {
  grid-column: 3;
  grid-row: 3;
  /* Sits inside the same cell as item-5 — split via a sub-grid trick below */
}

/* Split items 5 & 6 vertically within row 3 col 3 */
.t2-mosaic__item--5,
.t2-mosaic__item--6 {
  display: block;
}

/* Re-lay items 5+6 into a nested 2-row sub-grid in col 3 row 3 */
.t2-mosaic {
  grid-template-rows: 280px 280px 160px 160px;
}
.t2-mosaic__item--4 { grid-row: 3 / span 2; }
.t2-mosaic__item--5 { grid-row: 3; }
.t2-mosaic__item--6 { grid-row: 4; }

/* ── Hover overlay ── */
.t2-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.4s ease;
}

.group:hover .t2-overlay {
  background: rgba(0, 0, 0, 0.80);
}

.t2-plus {
  color: white;
  font-family: 'Cormorant Garamond', serif;
  font-size: 3rem;
  font-weight: 300;
  line-height: 1;
  opacity: 0;
  transform: scale(0.7);
  transition: opacity 0.35s ease, transform 0.35s ease;
}

.group:hover .t2-plus {
  opacity: 1;
  transform: scale(1);
}

/* Lightbox transitions */
.lb-enter-active, .lb-leave-active { transition: opacity 0.25s ease; }
.lb-enter-from, .lb-leave-to { opacity: 0; }
.lb-img-enter-active, .lb-img-leave-active { transition: opacity 0.2s ease; }
.lb-img-enter-from, .lb-img-leave-to { opacity: 0; }

/* Ensure images fill their cells */
.t2-mosaic__item {
  position: relative;
}
.t2-mosaic__item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
</style>
