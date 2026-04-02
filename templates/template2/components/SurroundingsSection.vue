<template>
  <section id="surroundings" class="bg-white py-24 px-6">
    <div class="max-w-7xl mx-auto">
      <div class="mb-16">
        <p class="text-[10px] uppercase tracking-[0.3em] text-[#C9A96E] mb-4">Location</p>
        <h2 class="font-['Cormorant_Garamond'] text-4xl sm:text-5xl text-[#111] font-light">Surroundings</h2>
        <div class="w-10 h-px bg-[#C9A96E] mt-6"></div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-0">
        <!-- Map -->
        <div class="aspect-[4/3] relative bg-[#F5F5F5]">
          <div ref="mapEl" class="absolute inset-0"></div>
          <div v-if="!mapLoaded" class="absolute inset-0 flex items-center justify-center">
            <div class="w-8 h-8 border-2 border-[#C9A96E] border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>

        <!-- POI list -->
        <div class="bg-[#F5F5F5] p-10">
          <p class="text-[10px] uppercase tracking-[0.25em] text-[#C9A96E] mb-6">Nearby Highlights</p>
          <ul class="space-y-5">
            <li v-for="poi in pois" :key="poi.name" class="flex items-start gap-4 border-b border-[#111]/5 pb-5 last:border-0 last:pb-0">
              <Icon :name="poi.icon" class="text-[#C9A96E] text-xl flex-shrink-0 mt-0.5" />
              <div>
                <p class="text-[#111] text-sm font-medium">{{ poi.name }}</p>
                <p class="text-[#111]/40 text-xs mt-0.5">{{ poi.distance }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const mapEl   = ref(null)
const mapLoaded = ref(false)
const pois = ref([])
let leafletMap = null

onMounted(async () => {
  const { fetchHotelInfo } = useHotel()
  const info = await fetchHotelInfo()
  const lat = parseFloat(info.latitude)  || 48.8566
  const lng = parseFloat(info.longitude) || 2.3522

  pois.value = [
    { name: 'City Centre',        distance: '0.5 km', icon: 'mdi:city' },
    { name: 'Airport',            distance: '25 km',  icon: 'mdi:airplane' },
    { name: 'Train Station',      distance: '1.2 km', icon: 'mdi:train' },
    { name: 'Beach',              distance: '3 km',   icon: 'mdi:beach' },
    { name: 'Shopping District',  distance: '0.8 km', icon: 'mdi:shopping' },
  ]

  if (typeof window !== 'undefined' && mapEl.value) {
    const L = await import('leaflet')
    await import('leaflet/dist/leaflet.css')
    leafletMap = L.map(mapEl.value, { zoomControl: false }).setView([lat, lng], 14)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© CartoDB',
      maxZoom: 19,
    }).addTo(leafletMap)
    L.circleMarker([lat, lng], { radius: 10, color: '#C9A96E', fillColor: '#C9A96E', fillOpacity: 0.9, weight: 2 })
      .addTo(leafletMap)
    L.control.zoom({ position: 'bottomright' }).addTo(leafletMap)
    mapLoaded.value = true
  }
})
onUnmounted(() => { if (leafletMap) { leafletMap.remove(); leafletMap = null } })
</script>
