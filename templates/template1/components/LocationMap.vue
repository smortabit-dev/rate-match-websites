<template>
  <section class="bg-gray-100 flex flex-col" style="isolation: isolate; z-index: 0; position: relative;">
    <!-- Titles + Category Tabs -->
    <div class="text-center pt-8 sm:pt-10 pb-4 px-4 sm:px-8">
      <p class="section-subtitle">{{ t.environs }}</p>
      <h2 class="section-title">{{ t.propertysurroundings }}</h2>
    </div>
    <div class="flex justify-center lg:justify-end px-4 sm:px-8 pb-4 overflow-x-auto">
      <div class="flex gap-4 sm:gap-8">
        <button v-for="(cat, idx) in categories" :key="idx" @click="selectedIndex = idx"
                class="text-xs sm:text-sm tracking-wide transition-all pb-1 whitespace-nowrap"
                :class="selectedIndex === idx
                  ? 'text-gray-900 font-semibold border-b-2 border-amber-700'
                  : 'text-gray-400 hover:text-gray-700'">
          {{ cat.name }}
        </button>
      </div>
    </div>

    <!-- Map + Surroundings -->
    <div class="flex-1 grid grid-cols-1 lg:grid-cols-2">
      <!-- Map — stretches to match the surroundings column height -->
      <div class="relative h-[300px] sm:h-auto sm:min-h-[650px] order-2 lg:order-1">
        <div ref="mapContainer" class="absolute inset-0 w-full h-full"></div>
      </div>

      <!-- Surroundings -->
      <div class="flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12 order-1 lg:order-2">
        <h2 class="text-2xl sm:text-4xl font-serif text-gray-800 italic mb-6 sm:mb-10">{{ currentCategory?.name }}</h2>
        <div>
          <div v-for="(place, idx) in currentCategory?.places || []" :key="idx"
              class="flex items-center justify-between py-3 border-b border-gray-300 last:border-0">
            <div class="flex items-center gap-3">
              <span class="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    :style="{ backgroundColor: categoryColors[selectedIndex % categoryColors.length] }"></span>
              <span class="text-gray-700 text-sm">{{ place.name }}</span>
            </div>
            <span class="text-amber-700 font-semibold text-sm whitespace-nowrap ml-4">{{ place.distance }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'

const mapContainer = ref(null)
const info = ref({ latitude: null, longitude: null })
const categories = ref([])
const selectedIndex = ref(0)
let map = null
let markersLayerGroup = null

const categoryColors = [
  '#b45309', // amber-700
  '#0369a1', // sky-700
  '#15803d', // green-700
  '#7c3aed', // violet-600
  '#dc2626', // red-600
  '#0891b2', // cyan-600
  '#c2410c', // orange-700
  '#4338ca', // indigo-700
]

const STATIC_KEYS = ['environs', 'propertysurroundings']
const t = ref(Object.fromEntries(STATIC_KEYS.map(k => [k, k])))

const { locale } = useLocale()

const currentCategory = computed(() => categories.value[selectedIndex.value])

// Parse distance string like "1.2 km" or "500 m" to meters
function parseDistanceToMeters(distStr) {
  if (!distStr) return 500
  const str = distStr.toString().toLowerCase().replace(',', '.')
  const match = str.match(/([\d.]+)\s*(km|m|mi|miles?)/)
  if (!match) return 500
  const val = parseFloat(match[1])
  const unit = match[2]
  if (unit === 'km') return val * 1000
  if (unit.startsWith('mi')) return val * 1609
  return val // meters
}

// Offset a lat/lng by distance(m) and bearing(radians)
function offsetLatLng(lat, lng, distMeters, bearingRad) {
  const R = 6371000
  const dLat = (distMeters * Math.cos(bearingRad)) / R
  const dLng = (distMeters * Math.sin(bearingRad)) / (R * Math.cos(lat * Math.PI / 180))
  return [lat + dLat * (180 / Math.PI), lng + dLng * (180 / Math.PI)]
}

function initMap(L) {
  if (!mapContainer.value || !info.value.latitude || !info.value.longitude) return

  const lat = parseFloat(info.value.latitude)
  const lng = parseFloat(info.value.longitude)

  if (map) {
    map.remove()
    map = null
  }

  map = L.map(mapContainer.value, {
    center: [lat, lng],
    zoom: 14,
    scrollWheelZoom: false,
    zoomControl: true,
  })

  // Light/grayscale tile layer (CartoDB Positron)
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19,
  }).addTo(map)

  // Hotel marker (prominent dark circle)
  const hotelMarker = L.circleMarker([lat, lng], {
    radius: 10,
    fillColor: '#1f2937',
    color: '#ffffff',
    weight: 3,
    fillOpacity: 1,
  }).addTo(map).bindPopup(`<strong>${info.value.name}</strong>`, {
    autoClose: false,
    closeOnClick: false,
    closeButton: false,
  })
  hotelMarker.openPopup()

  // Inner decorative circle
  L.circleMarker([lat, lng], {
    radius: 6,
    fillColor: '#b45309',
    color: '#b45309',
    weight: 0,
    fillOpacity: 1,
  }).addTo(map)

  markersLayerGroup = L.layerGroup().addTo(map)
  renderCategoryMarkers(L)
}

function renderCategoryMarkers(L) {
  if (!markersLayerGroup || !L) return
  markersLayerGroup.clearLayers()

  const lat = parseFloat(info.value.latitude)
  const lng = parseFloat(info.value.longitude)

  categories.value.forEach((cat, catIdx) => {
    const color = categoryColors[catIdx % categoryColors.length]
    const places = cat.places || []
    const angleStep = (2 * Math.PI) / Math.max(places.length, 1)
    // Offset start angle per category to avoid overlap
    const angleOffset = (catIdx * 0.7)

    places.forEach((place, placeIdx) => {
      const dist = parseDistanceToMeters(place.distance)
      const bearing = angleOffset + placeIdx * angleStep
      const [pLat, pLng] = offsetLatLng(lat, lng, dist, bearing)

      L.circleMarker([pLat, pLng], {
        radius: 7,
        fillColor: color,
        color: '#ffffff',
        weight: 2,
        fillOpacity: 0.9,
      }).addTo(markersLayerGroup)
        .bindPopup(`<strong>${place.name}</strong><br><span style="color:#b45309">${place.distance}</span>`)
    })
  })
}

// Watch for category tab changes to highlight markers
watch(selectedIndex, () => {
  if (!map || !markersLayerGroup) return
  // Re-render with emphasis on selected category
  import('leaflet').then(L => {
    markersLayerGroup.clearLayers()
    const lat = parseFloat(info.value.latitude)
    const lng = parseFloat(info.value.longitude)

    categories.value.forEach((cat, catIdx) => {
      const color = categoryColors[catIdx % categoryColors.length]
      const isActive = catIdx === selectedIndex.value
      const places = cat.places || []
      const angleStep = (2 * Math.PI) / Math.max(places.length, 1)
      const angleOffset = (catIdx * 0.7)

      places.forEach((place, placeIdx) => {
        const dist = parseDistanceToMeters(place.distance)
        const bearing = angleOffset + placeIdx * angleStep
        const [pLat, pLng] = offsetLatLng(lat, lng, dist, bearing)

        L.circleMarker([pLat, pLng], {
          radius: isActive ? 9 : 5,
          fillColor: color,
          color: isActive ? '#ffffff' : color,
          weight: isActive ? 2 : 1,
          fillOpacity: isActive ? 1 : 0.4,
        }).addTo(markersLayerGroup)
          .bindPopup(`<strong>${place.name}</strong><br><span style="color:#b45309">${place.distance}</span>`)
      })
    })
  })
})

onMounted(async () => {
  const { fetchHotelInfo, fetchSurroundings } = useHotel()
  
  const { loadCatalogue, transStatic } = useTranslations()

  const [hotelInfo, surroundings, catalogue] = await Promise.all([
    fetchHotelInfo(),
    fetchSurroundings(locale.value),
    loadCatalogue(locale.value),
  ])
  info.value = hotelInfo
  categories.value = surroundings
  const translated = {}
  for (const key of STATIC_KEYS) translated[key] = transStatic(key, catalogue)
  t.value = translated

  // Import Leaflet CSS & init map (client-side only)
  if (process.client) {
    const L = await import('leaflet')
    // Import Leaflet CSS
    if (!document.querySelector('link[href*="leaflet.css"]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }
    await nextTick()
    initMap(L.default || L)
  }
})
</script>

<style>
/* Keep all Leaflet layers inside the map's stacking context */
.leaflet-pane,
.leaflet-top,
.leaflet-bottom {
  z-index: 1 !important;
}
.leaflet-control {
  z-index: 2 !important;
}
</style>
