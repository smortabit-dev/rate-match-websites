<template>
  <div class="bg-white min-h-screen">

    <!-- Full-screen hero -->
    <section class="relative h-screen min-h-[500px] flex flex-col overflow-hidden bg-[#111]">

      <!-- Hero image (first gallery photo) -->
      <img v-if="heroImg"
        :src="heroImg"
        alt="Gallery"
        class="absolute inset-0 w-full h-full object-cover"
      />

      <!-- Subtle overlay -->
      <div class="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/55"></div>

      <!-- Centered title + breadcrumb -->
      <div class="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6">
        <h1 class="font-['Cormorant_Garamond'] text-6xl sm:text-7xl text-white font-light mb-4">
          Gallery
        </h1>
        <!-- Breadcrumb -->
        <nav class="flex items-center gap-2 text-white/60 text-xs tracking-[0.15em]">
          <NuxtLink :to="localePath('/')" class="hover:text-white transition-colors">Home</NuxtLink>
          <span class="text-white/30">/</span>
          <span class="text-white/80">Gallery</span>
        </nav>
      </div>

      <!-- Reservation bar pinned at bottom -->
      <div class="absolute bottom-0 left-0 right-0 z-10">
        <ReservationBar />
      </div>
    </section>

    <!-- Gallery mosaic -->
    <div class="max-w-7xl mx-auto px-6 py-14">

      <!-- Repeating 7-photo mosaic blocks -->
      <template v-if="photos.length">
        <div v-for="(chunk, ci) in chunks" :key="ci" class="gl-mosaic" :class="{ 'mt-1': ci > 0 }">

          <!-- 0: portrait left (rows 1–2) -->
          <div v-if="chunk[0]"
            class="gl-item gl-item--0 group relative cursor-pointer overflow-hidden"
            @click="openLightbox(ci * 7 + 0)">
            <img :src="chunk[0].url" :alt="chunk[0].alt || 'Gallery'"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
            <div class="gl-overlay"><span class="gl-plus">+</span></div>
          </div>

          <!-- 1: landscape top-center -->
          <div v-if="chunk[1]"
            class="gl-item gl-item--1 group relative cursor-pointer overflow-hidden"
            @click="openLightbox(ci * 7 + 1)">
            <img :src="chunk[1].url" :alt="chunk[1].alt || 'Gallery'"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
            <div class="gl-overlay"><span class="gl-plus">+</span></div>
          </div>

          <!-- 2: landscape bottom-center -->
          <div v-if="chunk[2]"
            class="gl-item gl-item--2 group relative cursor-pointer overflow-hidden"
            @click="openLightbox(ci * 7 + 2)">
            <img :src="chunk[2].url" :alt="chunk[2].alt || 'Gallery'"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
            <div class="gl-overlay"><span class="gl-plus">+</span></div>
          </div>

          <!-- 3: large portrait right (rows 1–2) -->
          <div v-if="chunk[3]"
            class="gl-item gl-item--3 group relative cursor-pointer overflow-hidden"
            @click="openLightbox(ci * 7 + 3)">
            <img :src="chunk[3].url" :alt="chunk[3].alt || 'Gallery'"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
            <div class="gl-overlay"><span class="gl-plus">+</span></div>
          </div>

          <!-- 4: wide landscape bottom-left (cols 1–2, rows 3–4) -->
          <div v-if="chunk[4]"
            class="gl-item gl-item--4 group relative cursor-pointer overflow-hidden"
            @click="openLightbox(ci * 7 + 4)">
            <img :src="chunk[4].url" :alt="chunk[4].alt || 'Gallery'"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
            <div class="gl-overlay"><span class="gl-plus">+</span></div>
          </div>

          <!-- 5: small square top-right -->
          <div v-if="chunk[5]"
            class="gl-item gl-item--5 group relative cursor-pointer overflow-hidden"
            @click="openLightbox(ci * 7 + 5)">
            <img :src="chunk[5].url" :alt="chunk[5].alt || 'Gallery'"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
            <div class="gl-overlay"><span class="gl-plus">+</span></div>
          </div>

          <!-- 6: small square bottom-right -->
          <div v-if="chunk[6]"
            class="gl-item gl-item--6 group relative cursor-pointer overflow-hidden"
            @click="openLightbox(ci * 7 + 6)">
            <img :src="chunk[6].url" :alt="chunk[6].alt || 'Gallery'"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
            <div class="gl-overlay"><span class="gl-plus">+</span></div>
          </div>

        </div>
      </template>

      <!-- Loading -->
      <div v-else class="flex justify-center py-20">
        <div class="w-10 h-10 border-2 border-[#C9A96E] border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>

    <!-- Lightbox -->
    <transition name="t2-fade">
      <div v-if="lightboxIndex !== null"
        class="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
        @click.self="lightboxIndex = null">

        <!-- Close -->
        <button @click="lightboxIndex = null"
          class="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-10">
          <Icon name="mdi:close" class="text-3xl" />
        </button>

        <!-- Prev -->
        <button v-if="lightboxIndex > 0"
          @click.stop="lightboxIndex--"
          class="absolute left-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors z-10">
          <Icon name="mdi:chevron-left" class="text-5xl" />
        </button>

        <!-- Image -->
        <img :src="photos[lightboxIndex]?.url" alt="Gallery"
          class="max-h-[90vh] max-w-[90vw] object-contain" />

        <!-- Next -->
        <button v-if="lightboxIndex < photos.length - 1"
          @click.stop="lightboxIndex++"
          class="absolute right-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors z-10">
          <Icon name="mdi:chevron-right" class="text-5xl" />
        </button>

        <!-- Counter -->
        <div class="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-xs tracking-[0.2em] uppercase">
          {{ lightboxIndex + 1 }} / {{ photos.length }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const { localePath } = useLocale()

const photos        = ref([])
const lightboxIndex = ref(null)

const heroImg = computed(() => photos.value[0]?.url || '')

// Split photos into 7-photo mosaic blocks + leftover remainder
const chunks = computed(() => {
  const result = []
  for (let i = 0; i < photos.value.length; i += 7) {
    result.push(photos.value.slice(i, i + 7))
  }
  return result
})

const remainder = computed(() => {
  const full = Math.floor(photos.value.length / 7)
  return photos.value.slice(full * 7)
})

const openLightbox = (i) => { lightboxIndex.value = i }

onMounted(async () => {
  const { fetchGallery } = useHotel()
  photos.value = await fetchGallery()
})
</script>

<style scoped>
/* ── Lightbox transition ── */
.t2-fade-enter-active, .t2-fade-leave-active { transition: opacity 0.3s ease; }
.t2-fade-enter-from, .t2-fade-leave-to { opacity: 0; }

/* ── Mosaic grid (Principal Madrid layout) ── */
.gl-mosaic {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 260px 260px 170px 170px;
  gap: 4px;
}

/* Portrait left — rows 1+2 */
.gl-item--0 { grid-column: 1; grid-row: 1 / span 2; }
/* Landscape top-center */
.gl-item--1 { grid-column: 2; grid-row: 1; }
/* Landscape bottom-center */
.gl-item--2 { grid-column: 2; grid-row: 2; }
/* Portrait right — rows 1+2 */
.gl-item--3 { grid-column: 3; grid-row: 1 / span 2; }
/* Wide landscape — cols 1+2, rows 3+4 */
.gl-item--4 { grid-column: 1 / span 2; grid-row: 3 / span 2; }
/* Small square top-right */
.gl-item--5 { grid-column: 3; grid-row: 3; }
/* Small square bottom-right */
.gl-item--6 { grid-column: 3; grid-row: 4; }

/* ── Hover overlay ── */
.gl-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.4s ease;
}

.group:hover .gl-overlay {
  background: rgba(0, 0, 0, 0.80);
}

.gl-plus {
  color: white;
  font-family: 'Cormorant Garamond', serif;
  font-size: 3rem;
  font-weight: 300;
  line-height: 1;
  opacity: 0;
  transform: scale(0.7);
  transition: opacity 0.35s ease, transform 0.35s ease;
}

.group:hover .gl-plus {
  opacity: 1;
  transform: scale(1);
}
</style>
