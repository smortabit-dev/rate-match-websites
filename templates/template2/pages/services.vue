<template>
  <div class="bg-white min-h-screen">

    <!-- Full-screen hero -->
    <PageHero title="Services &amp; Wellness" :image="heroImg" />

    <!-- Services content -->
    <div class="max-w-7xl mx-auto px-6 py-16">

      <!-- Section header -->
      <div class="flex flex-col md:flex-row md:items-end md:justify-between mb-14">
        <div>
          <p class="text-[10px] uppercase tracking-[0.3em] text-[#C9A96E] mb-4">Experiences</p>
          <h2 class="font-['Cormorant_Garamond'] text-4xl sm:text-5xl text-[#111] font-light">Services &amp; Wellness</h2>
          <div class="w-10 h-px bg-[#C9A96E] mt-6"></div>
        </div>

        <!-- Group filter tabs -->
        <div class="flex flex-wrap gap-2 mt-8 md:mt-0">
          <button @click="setFilter('all')"
            class="px-5 py-2 text-[10px] uppercase tracking-[0.2em] transition-all"
            :class="activeFilter === 'all' ? 'bg-[#111] text-white' : 'border border-[#111]/20 text-[#111]/50 hover:text-[#111]'">
            All
          </button>
          <button v-for="group in groups" :key="group.id"
            @click="setFilter(group.id)"
            class="px-5 py-2 text-[10px] uppercase tracking-[0.2em] transition-all"
            :class="activeFilter === group.id ? 'bg-[#111] text-white' : 'border border-[#111]/20 text-[#111]/50 hover:text-[#111]'">
            {{ group.name }}
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-24">
        <div class="w-10 h-10 border-2 border-[#C9A96E] border-t-transparent rounded-full animate-spin"></div>
      </div>

      <!-- Services grid -->
      <transition-group v-else name="t2-fade" tag="div"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
        <div v-for="service in displayServices" :key="service.id"
          class="group cursor-pointer"
          @click="openPanel(service)">

          <!-- Image -->
          <div class="relative aspect-[4/3] overflow-hidden bg-[#F5F5F5]">
            <img v-if="service.images?.[0] || service.image"
              :src="service.images?.[0] || service.image"
              :alt="service.name"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy" />
            <div v-else class="w-full h-full flex items-center justify-center">
              <Icon :name="serviceIcon(service.name)" class="text-5xl text-[#C9A96E]/40" />
            </div>

            <!-- Group badge (only in "All" view) -->
            <span v-if="activeFilter === 'all' && service._groupName"
              class="absolute top-4 left-4 text-[9px] uppercase tracking-[0.2em] text-white bg-black/50 px-3 py-1">
              {{ service._groupName }}
            </span>

            <!-- Hover overlay -->
            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-400"></div>
          </div>

          <!-- Card text -->
          <div class="w-8 h-px bg-[#C9A96E] mt-6 mb-4"></div>
          <h3 class="text-[11px] uppercase tracking-[0.2em] font-medium text-[#111] mb-3">{{ service.name }}</h3>
          <p class="text-[#111]/50 text-sm leading-relaxed line-clamp-2 mb-4"
            v-html="service.description || service.desc || ''"></p>
          <button class="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-[#C9A96E] hover:text-[#111] transition-colors">
            Discover
            <Icon name="mdi:arrow-right" class="text-sm" />
          </button>
        </div>
      </transition-group>

      <!-- Empty state -->
      <div v-if="!loading && !displayServices.length" class="text-center py-20 text-[#111]/30 text-sm">
        No services found.
      </div>
    </div>

    <!-- ── Centered modal ── -->
    <transition name="t2-modal">
      <div v-if="panelOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
        @click.self="closePanel">

        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="closePanel"></div>

        <!-- Modal box -->
        <div v-if="panelService"
          class="relative z-10 w-full max-w-4xl bg-white shadow-2xl flex flex-col md:flex-row max-h-[90vh] overflow-hidden">

          <!-- Close button -->
          <button @click="closePanel"
            class="absolute top-5 right-5 z-20 w-9 h-9 flex items-center justify-center border border-[#111]/15 text-[#111]/40 hover:border-[#C9A96E] hover:text-[#C9A96E] transition-colors">
            <Icon name="mdi:close" class="text-lg" />
          </button>

          <!-- Left: image carousel -->
          <div class="relative md:w-1/2 flex-shrink-0 bg-[#F5F5F5] min-h-[260px] md:min-h-0">
            <template v-if="panelImages.length">
              <img v-for="(img, idx) in panelImages" :key="idx"
                :src="img" :alt="panelService.name"
                class="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                :class="panelSlide === idx ? 'opacity-100' : 'opacity-0'" />

              <!-- Arrows -->
              <template v-if="panelImages.length > 1">
                <button @click="panelSlide = panelSlide > 0 ? panelSlide - 1 : panelImages.length - 1"
                  class="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white flex items-center justify-center transition-colors z-10">
                  <Icon name="mdi:chevron-left" class="text-[#111]" />
                </button>
                <button @click="panelSlide = panelSlide < panelImages.length - 1 ? panelSlide + 1 : 0"
                  class="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white flex items-center justify-center transition-colors z-10">
                  <Icon name="mdi:chevron-right" class="text-[#111]" />
                </button>

                <!-- Dot indicators -->
                <div class="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10">
                  <button v-for="(_, idx) in panelImages" :key="idx"
                    @click="panelSlide = idx"
                    class="w-1.5 h-1.5 rounded-full transition-colors"
                    :class="panelSlide === idx ? 'bg-white' : 'bg-white/40'" />
                </div>
              </template>
            </template>

            <!-- No image fallback -->
            <div v-else class="absolute inset-0 flex items-center justify-center">
              <Icon :name="serviceIcon(panelService.name)" class="text-7xl text-[#C9A96E]/30" />
            </div>
          </div>

          <!-- Right: content -->
          <div class="md:w-1/2 flex flex-col justify-center overflow-y-auto px-10 py-12">
            <p v-if="panelService._groupName"
              class="text-[10px] uppercase tracking-[0.3em] text-[#C9A96E] mb-4">
              {{ panelService._groupName }}
            </p>

            <h3 class="font-['Cormorant_Garamond'] text-4xl text-[#111] font-light leading-tight mb-4">
              {{ panelService.name }}
            </h3>

            <div class="w-8 h-px bg-[#C9A96E] mb-6"></div>

            <div class="text-[#111]/55 text-sm leading-relaxed mb-10"
              v-html="panelService.description || panelService.desc || ''"></div>

            <div class="flex items-center gap-6 pt-6 border-t border-[#111]/8">
              <NuxtLink :to="localePath('/availibility')"
                class="px-8 py-3.5 bg-[#111] text-white text-[10px] uppercase tracking-[0.25em] hover:bg-[#333] transition-all">
                Book Now
              </NuxtLink>
              <button @click="closePanel"
                class="text-[#111]/40 text-[10px] uppercase tracking-[0.2em] hover:text-[#111] transition-colors">
                Close
              </button>
            </div>
          </div>

        </div>
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const { locale, localePath } = useLocale()

const heroImg     = ref('')
const groups      = ref([])
const activeFilter = ref('all')
const loading     = ref(true)
const panelOpen   = ref(false)
const panelService = ref(null)
const panelSlide  = ref(0)

// ── Filter ──────────────────────────────────────────────
const setFilter = (id) => { activeFilter.value = id }

const displayServices = computed(() => {
  if (activeFilter.value === 'all') {
    return groups.value.flatMap(g =>
      g.services.map(s => ({ ...s, _groupName: g.name }))
    )
  }
  return groups.value.find(g => g.id === activeFilter.value)?.services || []
})

// ── Panel ────────────────────────────────────────────────
const panelImages = computed(() =>
  (panelService.value?.images || (panelService.value?.image ? [panelService.value.image] : [])).slice(0, 6)
)

const openPanel = (service) => {
  panelService.value = service
  panelSlide.value = 0
  panelOpen.value = true
  document.body.style.overflow = 'hidden'
}
const closePanel = () => {
  panelOpen.value = false
  document.body.style.overflow = ''
}

// ── Icon map ─────────────────────────────────────────────
const ICON_MAP = {
  spa: 'mdi:spa', pool: 'mdi:pool', fitness: 'mdi:dumbbell', gym: 'mdi:dumbbell',
  restaurant: 'mdi:silverware', bar: 'mdi:glass-cocktail', concierge: 'mdi:account-tie',
  parking: 'mdi:parking', wifi: 'mdi:wifi', transfer: 'mdi:car',
  'room service': 'mdi:room-service', laundry: 'mdi:washing-machine',
  wellness: 'mdi:heart-pulse', massage: 'mdi:hand-heart',
  yoga: 'mdi:yoga', sauna: 'mdi:thermometer',
}
const serviceIcon = (name = '') => {
  const key = Object.keys(ICON_MAP).find(k => name.toLowerCase().includes(k))
  return key ? ICON_MAP[key] : 'mdi:star-outline'
}

// ── Data ─────────────────────────────────────────────────
onMounted(async () => {
  const { fetchGallery, fetchServices } = useHotel()
  const [serviceGroups, gallery] = await Promise.all([
    fetchServices(locale.value),
    fetchGallery(),
  ])
  groups.value  = serviceGroups || []
  heroImg.value = gallery[1]?.url || gallery[0]?.url || ''
  loading.value = false
})
</script>

<style scoped>
/* Grid fade transition */
.t2-fade-enter-active, .t2-fade-leave-active { transition: opacity 0.3s ease; }
.t2-fade-enter-from, .t2-fade-leave-to { opacity: 0; }

/* Centered modal — backdrop fades, box scales up */
.t2-modal-enter-active { transition: opacity 0.3s ease; }
.t2-modal-leave-active { transition: opacity 0.25s ease; }
.t2-modal-enter-from, .t2-modal-leave-to { opacity: 0; }
.t2-modal-enter-active .relative.z-10 { transition: transform 0.3s ease, opacity 0.3s ease; }
.t2-modal-leave-active .relative.z-10 { transition: transform 0.2s ease, opacity 0.25s ease; }
.t2-modal-enter-from .relative.z-10 { transform: scale(0.96); opacity: 0; }
.t2-modal-leave-to   .relative.z-10 { transform: scale(0.96); opacity: 0; }
</style>
