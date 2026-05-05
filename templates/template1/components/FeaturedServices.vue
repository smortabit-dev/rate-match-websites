<template>
  <section id="services" class="py-16 sm:py-24 bg-white">
    <div class="container mx-auto px-4 sm:px-6">
      <div v-if="loading" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-700"></div>
      </div>
      <div v-else>
        <!-- Header: title left, filters + arrows right -->
        <div class="flex flex-col md:flex-row md:items-end md:justify-between mb-10 sm:mb-16">
          <div>
            <p class="section-subtitle">{{ t.servicesdelhotel }}</p>
            <h2 class="section-title">{{ t.decouvrezlesservices }}</h2>
          </div>
          <div class="flex items-center gap-4 mt-6 md:mt-0">
            <!-- Group filters -->
            <div class="flex gap-2 flex-wrap">
              <button @click="switchFilter('all')"
                      class="px-4 py-1.5 text-xs uppercase tracking-[0.15em] font-semibold transition-all duration-300 border"
                      :class="activeFilter === 'all'
                        ? 'bg-amber-700 text-white border-amber-700'
                        : 'bg-transparent text-gray-600 border-gray-300 hover:border-amber-700 hover:text-amber-700'">
                {{ t.all }}
              </button>
              <button v-for="group in groups" :key="group.id"
                      @click="switchFilter(group.id)"
                      class="px-4 py-1.5 text-xs uppercase tracking-[0.15em] font-semibold transition-all duration-300 border"
                      :class="activeFilter === group.id
                        ? 'bg-amber-700 text-white border-amber-700'
                        : 'bg-transparent text-gray-600 border-gray-300 hover:border-amber-700 hover:text-amber-700'">
                {{ group.name }}
              </button>
            </div>
            <!-- Navigation arrows -->
            <div class="flex gap-2 flex-shrink-0">
              <button @click="prev" :disabled="currentIndex === 0"
                      class="w-9 h-9 sm:w-10 sm:h-10 border border-gray-300 flex items-center justify-center text-gray-500 hover:border-amber-700 hover:text-amber-700 transition-all disabled:opacity-30">
                <Icon name="mdi:arrow-left" class="text-lg" />
              </button>
              <button @click="next" :disabled="currentIndex >= maxIndex"
                      class="w-9 h-9 sm:w-10 sm:h-10 border border-gray-300 flex items-center justify-center text-gray-500 hover:border-amber-700 hover:text-amber-700 transition-all disabled:opacity-30">
                <Icon name="mdi:arrow-right" class="text-lg" />
              </button>
            </div>
          </div>
        </div>

        <!-- Services carousel -->
        <div class="overflow-hidden cursor-grab active:cursor-grabbing select-none"
             @mousedown="dragStart" @mousemove="dragMove" @mouseup="dragEnd" @mouseleave="dragEnd"
             @touchstart.passive="dragStart" @touchmove.passive="dragMove" @touchend="dragEnd">
          <div class="flex ease-in-out"
               :class="isDragging ? 'transition-none' : 'transition-transform duration-500'"
               :style="{ transform: `translateX(calc(-${currentIndex * (100 / visibleCount)}% + ${dragOffset}px))` }">
            <div v-for="service in displayServices" :key="service.id"
                 class="flex-shrink-0 px-2 sm:px-4"
                 :style="{ width: `${100 / visibleCount}%` }">
              <div class="group cursor-pointer h-full flex flex-col">
                <!-- Image with inner carousel -->
                <div class="relative aspect-[6/4] overflow-hidden">
                  <div class="relative w-full h-full">
                    <img v-for="(img, imgIdx) in (service.images || [service.image]).slice(0, 6)" :key="imgIdx"
                         :src="img" :alt="`${service.name} - ${imgIdx + 1}`"
                         class="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                         :class="(serviceSlides[service.id] || 0) === imgIdx ? 'opacity-100' : 'opacity-0'" />
                  </div>
                  <div v-if="!service.images && !service.image" class="absolute inset-0 bg-gray-200 flex items-center justify-center">
                    <Icon name="mdi:room-service" class="text-5xl text-gray-300" />
                  </div>
                  <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all"></div>
                  <!-- Counter & inner nav -->
                  <div class="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <span class="text-white text-xs bg-black/40 px-2 py-0.5">
                      {{ (serviceSlides[service.id] || 0) + 1 }} / {{ (service.images || [service.image]).slice(0, 6).length }}
                    </span>
                    <div v-if="(service.images || []).length > 1" class="flex gap-2">
                      <button @click.stop="prevServiceSlide(service)" class="text-white hover:text-amber-400 transition-colors">
                        <Icon name="mdi:arrow-left" class="text-lg" />
                      </button>
                      <button @click.stop="nextServiceSlide(service)" class="text-white hover:text-amber-400 transition-colors">
                        <Icon name="mdi:arrow-right" class="text-lg" />
                      </button>
                    </div>
                  </div>
                  <!-- Group badge -->
                  <div v-if="activeFilter === 'all' && service._groupName"
                       class="absolute top-4 left-4">
                    <span class="text-[10px] uppercase tracking-[0.15em] font-semibold text-white bg-black/40 px-3 py-1">
                      {{ service._groupName }}
                    </span>
                  </div>
                </div>
                <!-- Separator -->
                <div class="w-8 h-px bg-gray-800 mt-6 mb-4"></div>
                <!-- Service name -->
                <h3 class="text-xs uppercase tracking-[0.15em] font-semibold text-gray-800 mb-3">{{ service.name }}</h3>
                <!-- Description -->
                <p class="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-3" v-html="service.description"></p>
                <!-- Pricing -->
                <div v-if="service.idtype == 1" class="mb-4">
                  <span class="text-xs font-semibold text-amber-700 uppercase tracking-wide">
                    {{ service.prixUnit === 'nepasspecifier' ? t.ensupplement : (t[service.prixUnit] || service.prixUnit) }}
                  </span>
                  <span v-if="['apartirde','parunite','parsejour','nepasspecifier'].includes(service.prixUnit) && service.price > 0"
                        class="text-xs text-gray-700 ml-1">
                    — {{ convertPrice(service.price) }} {{ currency }}
                  </span>
                  <span v-if="['apartirde','parunite','parsejour','nepasspecifier'].includes(service.prixUnit) && service.persons > 0"
                        class="block text-xs text-gray-500 mt-0.5">
                    {{ service.persons === 1 ? t['pour$x1personne'].replace('%val1%', service.persons) : t['pour$x1personnes'].replace('%val1%', service.persons) }}
                  </span>
                </div>
                <div v-else-if="service.priceType && service.priceType !== 'aucundetail'" class="mb-4">
                  <span class="text-xs font-semibold text-amber-700 uppercase tracking-wide">
                    {{ t[cleanPriceType(service.priceType)] || cleanPriceType(service.priceType) }}
                  </span>
                </div>
                <!-- PDF Download -->
                <div v-if="service.pdfs && service.pdfs.length > 0" class="mb-4">
                  <b class="text-xs font-semibold text-gray-800 uppercase tracking-wide flex items-center gap-2">
                    {{ t.telecharger || 'Download' }} 
                    <a v-for="(pdf, pIdx) in service.pdfs" :key="'pdf-'+pIdx" :href="pdf.imageUrl" target="_blank" @click.stop class="text-amber-700 hover:text-amber-800 transition-colors">
                      <Icon name="mdi:cloud-download-outline" class="text-xl" />
                    </a>
                  </b>
                </div>
                <!-- Learn more -->
                <button @click.stop="openPanel(service)"
                        class="mt-auto inline-flex items-center gap-1 text-xs uppercase tracking-[0.15em] font-semibold text-amber-700 hover:text-amber-800 transition-colors">
                  {{ t.ensavoirplus }}
                  <Icon name="mdi:arrow-right" class="text-sm" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Slide panel from right -->
    <transition name="slide-panel">
      <div v-if="panelOpen" class="fixed inset-0 z-50 flex justify-end">
        <div class="absolute inset-0 bg-black/60" @click="closePanel"></div>
        <div class="relative w-full max-w-lg bg-white h-full overflow-y-auto shadow-2xl">
          <button @click="closePanel"
                  class="absolute top-6 right-6 z-10 text-gray-400 hover:text-gray-800 transition-colors">
            <Icon name="mdi:close" class="text-2xl" />
          </button>
          <div v-if="panelService">
            <!-- Service image carousel -->
            <div class="relative aspect-[4/3] overflow-hidden">
              <img v-for="(img, imgIdx) in (panelService.images || [panelService.image]).slice(0, 6)" :key="imgIdx"
                   :src="img" :alt="`${panelService.name} - ${imgIdx + 1}`"
                   class="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                   :class="panelSlide === imgIdx ? 'opacity-100' : 'opacity-0'" />
              <div class="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <span class="text-white text-xs bg-black/40 px-2 py-0.5">
                  {{ panelSlide + 1 }} / {{ (panelService.images || [panelService.image]).slice(0, 6).length }}
                </span>
                <div v-if="(panelService.images || []).length > 1" class="flex gap-2">
                  <button @click="panelSlide = panelSlide > 0 ? panelSlide - 1 : (panelService.images || []).slice(0, 6).length - 1"
                          class="text-white hover:text-amber-400 transition-colors">
                    <Icon name="mdi:arrow-left" class="text-lg" />
                  </button>
                  <button @click="panelSlide = panelSlide < (panelService.images || []).slice(0, 6).length - 1 ? panelSlide + 1 : 0"
                          class="text-white hover:text-amber-400 transition-colors">
                    <Icon name="mdi:arrow-right" class="text-lg" />
                  </button>
                </div>
              </div>
            </div>
            <!-- Content -->
            <div class="p-6 sm:p-8 md:p-12">
              <div class="w-8 h-px bg-gray-800 mb-4"></div>
              <h3 class="text-xs uppercase tracking-[0.15em] font-semibold text-gray-800 mb-4">{{ panelService.name }}</h3>

              <!-- Pricing -->
              <div v-if="panelService.idtype == 1" class="mb-5 pb-5 border-b border-gray-100">
                <!-- <p class="text-[10px] uppercase tracking-[0.15em] text-gray-400 mb-1">Prix</p> -->
                <div class="flex items-baseline gap-2 flex-wrap">
                  <span class="text-xs font-semibold text-amber-700 uppercase tracking-wide">
                    {{ panelService.prixUnit === 'nepasspecifier' ? t.ensupplement : (t[panelService.prixUnit] || panelService.prixUnit) }}
                  </span>
                  <span v-if="['apartirde','parunite','parsejour','nepasspecifier'].includes(panelService.prixUnit) && panelService.price > 0"
                        class="text-sm font-serif text-gray-800">
                    {{ convertPrice(panelService.price) }} {{ currency }}
                  </span>
                </div>
                <span v-if="['apartirde','parunite','parsejour','nepasspecifier'].includes(panelService.prixUnit) && panelService.persons > 0"
                      class="text-xs text-gray-500 mt-1 block">
                  {{ panelService.persons === 1 ? t['pour$x1personne'].replace('%val1%', panelService.persons) : t['pour$x1personnes'].replace('%val1%', panelService.persons) }}
                </span>
              </div>
              <div v-else-if="panelService.priceType && panelService.priceType !== 'aucundetail'" class="mb-5 pb-5 border-b border-gray-100">
                <p class="text-[10px] uppercase tracking-[0.15em] text-gray-400 mb-1">Prix</p>
                <span class="text-sm font-semibold text-amber-700 uppercase tracking-wide">
                  {{ t[cleanPriceType(panelService.priceType)] || cleanPriceType(panelService.priceType) }}
                </span>
              </div>

              <!-- PDF Download in Panel -->
              <div v-if="panelService.pdfs && panelService.pdfs.length > 0" class="mb-5 pb-5 border-b border-gray-100">
                <b class="text-xs font-semibold text-gray-800 uppercase tracking-wide flex items-center gap-2">
                  {{ t.telecharger || 'Download' }} 
                  <a v-for="(pdf, pIdx) in panelService.pdfs" :key="'panel-pdf-'+pIdx" :href="pdf.imageUrl" target="_blank" class="text-amber-700 hover:text-amber-800 transition-colors">
                    <Icon name="mdi:cloud-download-outline" class="text-xl" />
                  </a>
                </b>
              </div>

              <div class="text-gray-600 text-sm leading-relaxed" v-html="panelService.description"></div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </section>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'

const loading = ref(true)
const groups = ref([])
const activeFilter = ref('all')
const currentIndex = ref(0)
const visibleCount = ref(3)
const serviceSlides = reactive({})
const panelOpen = ref(false)
const panelService = ref(null)
const panelSlide = ref(0)

const openPanel = (service) => {
  panelService.value = service
  panelSlide.value = 0
  panelOpen.value = true
  document.body.style.overflow = 'hidden'
}
const closePanel = () => {
  panelOpen.value = false
  document.body.style.overflow = 'auto'
}

const updateVisibleCount = () => {
  const w = window.innerWidth
  if (w < 640) visibleCount.value = 1
  else if (w < 1024) visibleCount.value = 2
  else visibleCount.value = 3
}

const STATIC_KEYS = ['servicesdelhotel', 'decouvrezlesservices', 'ensavoirplus', 'all',
  'ensupplement', 'apartirde', 'parunite', 'parsejour', 'nepasspecifier',
  'pour$x1personne', 'pour$x1personnes', 'telecharger']

const cleanPriceType = (val = '') =>
  val.replace(/services|service|tarif/gi, '').trim() || val
const t = ref(Object.fromEntries(STATIC_KEYS.map(k => [k, k])))

const { locale } = useLocale()
const currency    = useCurrency()
const etabCurrency = ref('EUR')
const { rate: conversionRate } = useCurrencyRate(etabCurrency, currency)

const convertPrice = (price) => {
  if (!price || price <= 0) return null
  const converted = price * conversionRate.value
  return converted.toFixed(2)
}

const displayServices = computed(() => {
  if (activeFilter.value === 'all') {
    return groups.value.flatMap(g =>
      g.services.map(s => ({ ...s, _groupName: g.name }))
    )
  }
  const group = groups.value.find(g => g.id === activeFilter.value)
  return group ? group.services : []
})

const switchFilter = (filterId) => {
  if (filterId === activeFilter.value) return
  activeFilter.value = filterId
  currentIndex.value = 0
}

const maxIndex = computed(() => Math.max(0, displayServices.value.length - visibleCount.value))
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
const dragEnd = () => {
  if (!isDragging.value) return
  isDragging.value = false
  if (dragOffset.value < -DRAG_THRESHOLD) next()
  else if (dragOffset.value > DRAG_THRESHOLD) prev()
  dragOffset.value = 0
}

const prevServiceSlide = (service) => {
  const imgs = (service.images || []).slice(0, 6)
  const cur = serviceSlides[service.id] || 0
  serviceSlides[service.id] = cur > 0 ? cur - 1 : imgs.length - 1
}
const nextServiceSlide = (service) => {
  const imgs = (service.images || []).slice(0, 6)
  const cur = serviceSlides[service.id] || 0
  serviceSlides[service.id] = cur < imgs.length - 1 ? cur + 1 : 0
}

onMounted(async () => {
  updateVisibleCount()
  window.addEventListener('resize', updateVisibleCount)
  const { fetchServices, fetchHotelInfo } = useHotel()
  const { loadCatalogue, transStatic } = useTranslations()
  const [serviceGroups, hotelInfo, catalogue] = await Promise.all([
    fetchServices(locale.value),
    fetchHotelInfo(),
    loadCatalogue(locale.value),
  ])
  etabCurrency.value = hotelInfo.currency || 'EUR'
  groups.value = serviceGroups
  const translated = {}
  for (const key of STATIC_KEYS) {
    const finalKey = key === 'all' ? 'all' : key
    translated[key] = transStatic(finalKey, catalogue)
  }
  t.value = translated
  loading.value = false
})
onUnmounted(() => window.removeEventListener('resize', updateVisibleCount))
</script>

<style scoped>
.slide-panel-enter-active, .slide-panel-leave-active { transition: opacity 0.3s ease; }
.slide-panel-enter-active > :last-child, .slide-panel-leave-active > :last-child { transition: transform 0.3s ease; }
.slide-panel-enter-from, .slide-panel-leave-to { opacity: 0; }
.slide-panel-enter-from > :last-child, .slide-panel-leave-to > :last-child { transform: translateX(100%); }
</style>
