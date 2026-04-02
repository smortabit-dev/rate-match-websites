<template>
  <div class="bg-white min-h-screen">
    <PageHero title="Surroundings" :image="heroImg" />

    <div class="max-w-7xl mx-auto px-6 py-14">

      <!-- Section header -->
      <div class="mb-12">
        <p class="text-[10px] uppercase tracking-[0.3em] text-[#C9A96E] mb-4">Explore</p>
        <h2 class="font-['Cormorant_Garamond'] text-4xl sm:text-5xl text-[#111] font-light">Surroundings</h2>
        <div class="w-10 h-px bg-[#C9A96E] mt-6"></div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-20">
        <div class="w-10 h-10 border-2 border-[#C9A96E] border-t-transparent rounded-full animate-spin"></div>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-10">

        <!-- Left: category sidebar -->
        <div class="lg:col-span-4">
          <nav class="sticky top-28 space-y-1">
            <button
              v-for="(group, idx) in groups"
              :key="idx"
              @click="selected = idx"
              class="w-full text-left px-5 py-3.5 text-[10px] uppercase tracking-[0.2em] transition-all border-l-2"
              :class="selected === idx
                ? 'border-[#C9A96E] text-[#C9A96E] bg-[#F5F5F5]'
                : 'border-transparent text-[#111]/40 hover:text-[#111] hover:border-[#111]/20'">
              {{ group.name }}
            </button>
          </nav>
        </div>

        <!-- Right: places list -->
        <div class="lg:col-span-8">
          <div class="mb-8">
            <h3 class="font-['Cormorant_Garamond'] text-3xl text-[#111] font-light">
              {{ currentGroup?.name }}
            </h3>
            <div class="w-8 h-px bg-[#C9A96E] mt-4"></div>
          </div>

          <div class="space-y-0">
            <div
              v-for="place in filteredPlaces"
              :key="place.name"
              class="flex items-center justify-between py-4 border-b border-[#111]/8 last:border-0 hover:bg-[#F5F5F5] px-3 transition-colors group">
              <span class="text-[#111] text-sm group-hover:text-[#C9A96E] transition-colors">{{ place.name }}</span>
              <span class="text-[#C9A96E] text-sm font-medium flex-shrink-0 ml-4">{{ place.distance }}</span>
            </div>
          </div>

          <div v-if="!filteredPlaces.length" class="text-center py-10">
            <p class="text-[#111]/30 text-sm">No places found.</p>
          </div>

          <!-- Dot indicators -->
          <div class="flex gap-2 mt-10">
            <button
              v-for="(_, idx) in groups"
              :key="idx"
              @click="selected = idx"
              class="h-1 rounded-full transition-all duration-300"
              :class="selected === idx ? 'bg-[#C9A96E] w-6' : 'bg-[#111]/15 w-1.5'" />
          </div>
        </div>
      </div>

      <!-- Map -->
      <div v-if="hasMap" id="t2-surr-map" class="w-full h-80 border border-[#111]/10 mt-14"></div>

      <!-- Contact strip -->
      <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-px bg-[#111]/5">
        <div v-if="info.address" class="bg-[#F5F5F5] p-8">
          <p class="text-[9px] uppercase tracking-[0.25em] text-[#C9A96E] mb-4">Address</p>
          <p class="text-[#111]/70 text-sm leading-relaxed">{{ info.address }}</p>
          <p v-if="info.city" class="text-[#111]/70 text-sm mt-1">{{ [info.city, info.country].filter(Boolean).join(', ') }}</p>
        </div>
        <div v-if="info.phone" class="bg-[#F5F5F5] p-8">
          <p class="text-[9px] uppercase tracking-[0.25em] text-[#C9A96E] mb-4">Phone</p>
          <a :href="`tel:${info.phone}`" class="text-[#111]/70 text-sm hover:text-[#C9A96E] transition-colors">{{ info.phone }}</a>
        </div>
        <div v-if="info.emails" class="bg-[#F5F5F5] p-8">
          <p class="text-[9px] uppercase tracking-[0.25em] text-[#C9A96E] mb-4">Email</p>
          <a :href="`mailto:${info.emails}`" class="text-[#111]/70 text-sm hover:text-[#C9A96E] transition-colors">{{ info.emails }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted } from 'vue'

const { locale } = useLocale()

const groups  = ref([])
const loading = ref(true)
const info    = ref({})
const heroImg = ref('')
const selected = ref(0)
const hasMap   = ref(false)

const currentGroup   = computed(() => groups.value[selected.value] || null)
const filteredPlaces = computed(() => currentGroup.value?.places || [])

onMounted(async () => {
  const { fetchGallery, fetchHotelInfo, fetchSurroundings } = useHotel()
  

  const [hotelInfo, surroundings, gallery] = await Promise.all([
    fetchHotelInfo(),
    fetchSurroundings(locale.value),
    fetchGallery(),
  ])

  info.value    = hotelInfo
  groups.value  = surroundings || []
  heroImg.value = gallery[5]?.url || gallery[0]?.url || ''
  loading.value = false

  const lat = parseFloat(hotelInfo.latitude)
  const lng = parseFloat(hotelInfo.longitude)

  if (process.client && lat && lng) {
    hasMap.value = true
    await nextTick()
    try {
      const L = (await import('leaflet')).default
      await import('leaflet/dist/leaflet.css')

      const map = L.map('t2-surr-map', { zoomControl: true, scrollWheelZoom: false })
        .setView([lat, lng], 14)

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map)

      // Hotel marker
      const hotelIcon = L.divIcon({
        html: `<div style="width:36px;height:36px;background:#C9A96E;border:2px solid #fff;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.3)">
          <svg viewBox="0 0 24 24" fill="white" width="16" height="16"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
        </div>`,
        className: '',
        iconSize: [36, 36],
        iconAnchor: [18, 36],
      })
      L.marker([lat, lng], { icon: hotelIcon })
        .addTo(map)
        .bindPopup(hotelInfo.name || 'Hotel')
    } catch (e) {
      console.warn('[Surroundings] Leaflet error:', e)
    }
  }
})
</script>
