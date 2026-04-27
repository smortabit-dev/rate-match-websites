<template>
  <section id="contact" class="bg-[#f9f7f4]">
    <!-- Info Section -->
    <div class="py-24 container mx-auto px-6 max-w-7xl">
      <div class="flex flex-col lg:flex-row gap-8 items-stretch">
        
        <!-- Left: Contact Details Card -->
        <div class="lg:w-[65%] bg-white shadow-2xl p-12 md:p-24 flex flex-col justify-center min-h-[550px] relative transition-transform hover:scale-[1.01] duration-500">
          <h2 class="text-6xl md:text-7xl font-serif font-bold text-[#002B5B] mb-16 text-center lg:text-left">Contact</h2>
          
          <div class="space-y-10 text-[#002B5B] max-w-lg lg:ml-10">
            <div>
              <h3 class="text-lg font-bold mb-2">{{ info.name || 'Riad Challa Restaurant & Spa' }}</h3>
              <p class="text-sm leading-relaxed opacity-80">
                {{ info.address || 'Derb Sekkaya N 14, Riad Al Mokha, Medina, Medina, 40000 Marrakech, Morocco' }}
              </p>
            </div>

            <div class="space-y-3">
              <p class="text-sm">
                <span class="font-bold">Phone Number :</span> 
                <a :href="`tel:${info.phone}`" class="hover:text-[#D4AF37] transition-colors">{{ info.phone || '+212 524 442 777' }}</a>
              </p>
              <p class="text-sm">
                <span class="font-bold">Whatsapp :</span> 
                <a :href="`https://wa.me/${info.phone?.replace(/\s+/g,'')}`" class="hover:text-[#D4AF37] transition-colors">{{ info.phone || '+212 674 720 717' }}</a>
              </p>
              <p class="text-sm">
                <a :href="`mailto:${info.email}`" class="text-[#D4AF37] font-bold hover:underline">{{ info.email || 'riadchalla@gmail.com' }}</a>
              </p>
              <p class="text-sm opacity-70">
                <span class="font-bold">Longitude =</span> {{ info.longitude || '-7.98844239' }} 
                <span class="font-bold">Latitude =</span> {{ info.latitude || '31.62307184' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Right: Map Thumbnail & Social -->
        <div class="lg:w-[35%] flex flex-col gap-8">
          
          <!-- Map Thumbnail Block -->
          <div class="flex-1 flex flex-col group items-center">
            <p class="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 mb-4">To view the map in full screen</p>
            <div class="relative w-full aspect-[4/3] overflow-hidden shadow-xl cursor-pointer" @click="showMap = true">
              <img src="/globe_map_thumbnail_1777290224243.png" alt="Map Thumbnail" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div class="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div class="border-2 border-white px-6 py-2">
                  <span class="text-white font-bold uppercase tracking-widest">Click</span>
                </div>
              </div>
              <div class="absolute left-0 top-0 bottom-0 w-10 bg-[#D4AF37] flex items-center justify-center shadow-lg">
                <Icon name="mdi:arrow-right" class="text-white text-xl" />
              </div>
            </div>
          </div>

          <!-- Social Block -->
          <div class="flex-1 bg-[#003471] p-5 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-xl group">
             <div class="absolute inset-0 opacity-20 pointer-events-none transition-transform duration-700 group-hover:scale-110">
                <img :src="galleryImage" class="w-full h-full object-cover grayscale" />
             </div>
             <div class="relative z-10 w-full flex flex-col items-center">
                <img :src="info.logo || '/logo.png'" alt="Hotel Logo" class="h-30 mb-8" />
                <div class="flex flex-col items-center gap-6">
                  <h4 class="text-white font-bold text-xs tracking-[0.3em] uppercase">Follow Us</h4>
                  <div class="flex gap-10">
                    <a href="#" class="text-white hover:text-[#D4AF37] transition-all transform hover:scale-125">
                      <Icon name="mdi:facebook" class="text-xl" />
                    </a>
                    <a href="#" class="text-white hover:text-[#D4AF37] transition-all transform hover:scale-125">
                      <Icon name="mdi:instagram" class="text-xl" />
                    </a>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Form Section -->
    <div class="bg-[#002B5B] py-24 text-white">
      <div class="container mx-auto px-6 max-w-5xl">
        <div class="text-center mb-20">
          <p class="text-xs font-bold tracking-[0.4em] uppercase opacity-70 mb-4">COMPOSE</p>
          <h3 class="text-7xl font-serif font-bold">A message</h3>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-0">
          <!-- Field Generator -->
          <div v-for="field in formFields" :key="field.id" 
               class="grid grid-cols-1 md:grid-cols-3 items-center py-6 border-b border-white/20 gap-4">
            <label class="text-base font-medium">{{ field.label }}</label>
            
            <div class="flex items-center gap-4">
              <template v-if="field.id === 'captcha'">
                <div class="bg-white text-black px-4 py-2 font-bold text-2xl tracking-widest">{{ captchaCode }}</div>
              </template>
              <input v-if="field.type !== 'textarea'" 
                     :type="field.type" 
                     placeholder="Tap here" 
                     class="bg-transparent border-none focus:ring-0 placeholder:text-white/30 text-white w-full"
                     v-model="formData[field.id]" />
              <textarea v-else 
                        placeholder="Tap here" 
                        class="bg-transparent border-none focus:ring-0 placeholder:text-white/30 text-white w-full h-24 resize-none"
                        v-model="formData[field.id]"></textarea>
            </div>

            <div class="md:text-right hidden md:block">
              <span class="text-[10px] opacity-60 italic">{{ field.status }}</span>
            </div>
          </div>

          <!-- Terms -->
          <div class="py-8 flex items-start gap-4">
            <input type="checkbox" v-model="formData.acceptTerms" class="mt-1 bg-transparent border-white/40 focus:ring-0 rounded" />
            <p class="text-[13px] opacity-80 leading-relaxed">
              I have read and accept the <a href="#" class="underline">General conditions of the establishment</a> and <a href="#" class="underline">Privacy Policy</a>
            </p>
          </div>

          <!-- Submit Button -->
          <div class="mt-16 flex justify-center">
            <button type="submit" 
                    class="px-16 py-6 border border-[#D4AF37] text-white font-bold uppercase tracking-[0.2em] hover:bg-[#D4AF37] hover:border-transparent transition-all duration-300">
              Send us a message
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Map Modal -->
    <Teleport to="body">
      <div v-if="showMap" class="fixed inset-0 z-[200] flex animate-fade-in">
        <div class="absolute inset-0 bg-black/50" @click="showMap = false"></div>
        <button @click="showMap = false" class="absolute top-0 right-0 z-[220] bg-[#D4AF37] text-[#002B5B] px-8 py-5 font-bold uppercase tracking-widest flex items-center gap-3 hover:bg-[#c4a132] transition-colors shadow-lg">
          <Icon name="mdi:close" class="text-2xl" />
          Close
        </button>
        <div class="relative w-full h-full bg-white z-[210]">
          <div id="map-full" class="w-full h-full"></div>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, watch, nextTick } from 'vue'

const { locale } = useLocale()
const info = ref({ name: '', email: '', phone: '', address: '', website: '', logo: '', latitude: '', longitude: '', image: '' })
const galleryImage = ref('')
const showMap = ref(false)
const captchaCode = ref('78422')
let map = null

const formData = reactive({
  lastName: '', email: '', phone: '', subject: '', message: '', captcha: '', acceptTerms: false
})

const formFields = [
  { id: 'lastName', label: 'Last name*', type: 'text', status: '*Required & obligatory information' },
  { id: 'email', label: 'E-mail address*', type: 'email', status: '*Required & obligatory information' },
  { id: 'phone', label: 'Phone*', type: 'tel', status: '*Required & obligatory information' },
  { id: 'subject', label: 'Message subject', type: 'text', status: 'Optional information' },
  { id: 'message', label: 'Message*', type: 'textarea', status: 'Required & obligatory information' },
  { id: 'captcha', label: 'copy the contents of this picture*', type: 'text', status: '' }
]

const handleSubmit = () => {
  // Submit logic...
  alert('Thank you for your message!')
}

onMounted(async () => {
  const { fetchHotelInfo, fetchHotelData, fetchGallery } = useHotel()
  const [hotelInfo, hotelData, gallery] = await Promise.all([
    fetchHotelInfo(), 
    fetchHotelData(),
    fetchGallery()
  ])
  
  info.value = { ...hotelInfo, image: hotelData?.chamber?.[0]?.image || '' }
  if (gallery && gallery.length > 0) galleryImage.value = gallery[0].url
  else galleryImage.value = info.value.image
})

const initFullMap = async () => {
  if (process.client) {
    const L = await import('leaflet')
    if (!document.querySelector('link[href*="leaflet.css"]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }

    await nextTick()
    const lat = parseFloat(info.value.latitude) || 31.62307184
    const lng = parseFloat(info.value.longitude) || -7.98844239

    map = L.map('map-full', { center: [lat, lng], zoom: 15, zoomControl: false })
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { attribution: '&copy; OpenStreetMap &copy; CARTO' }).addTo(map)
    L.control.zoom({ position: 'bottomright' }).addTo(map)

    const hotelIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `<div class="w-10 h-10 bg-red-600 rounded-full border-4 border-white shadow-xl flex items-center justify-center"><div class="w-2 h-2 bg-white rounded-full"></div></div>`,
      iconSize: [40, 40], iconAnchor: [20, 40], popupAnchor: [0, -40]
    })

    const popupContent = `<div class="p-4 min-w-[300px] font-sans"><h3 class="text-lg font-bold text-[#002B5B] mb-3">${info.value.name}</h3><div class="flex gap-4 mb-4"><img src="${info.value.logo}" class="w-16 h-16 object-contain border border-gray-100 p-1" /><img src="${galleryImage.value}" class="flex-1 w-full h-16 object-cover rounded shadow-sm" /></div><p class="text-xs text-gray-500 leading-relaxed">${info.value.address}</p></div>`

    L.marker([lat, lng], { icon: hotelIcon }).addTo(map).bindPopup(popupContent, { closeButton: false, className: 'custom-leaflet-popup' }).openPopup()
  }
}

watch(showMap, (val) => {
  if (val) { document.body.style.overflow = 'hidden'; setTimeout(initFullMap, 100); }
  else { document.body.style.overflow = 'auto'; if (map) { map.remove(); map = null; } }
})

onUnmounted(() => { document.body.style.overflow = 'auto'; })
</script>

<style>
.font-serif { font-family: 'Playfair Display', serif; }
.animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

/* Leaflet Customization */
.custom-leaflet-popup .leaflet-popup-content-wrapper { border-radius: 1rem; padding: 0; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.15); }
.custom-leaflet-popup .leaflet-popup-content { margin: 0; }
.custom-leaflet-popup .leaflet-popup-tip { background: white; }
</style>
