<template>
  <section id="rooms" class="py-24 bg-[#f9f7f4] overflow-hidden">
    <!-- Header -->
    <div class="text-center mb-20 px-6">
      <p class="text-[#26BEEF] font-semibold text-xs tracking-[0.2em] uppercase mb-4">For you</p>
      <h2 class="text-5xl md:text-6xl font-serif font-bold text-[#002B5B]">Our rooms</h2>
    </div>

    <div class="relative px-0 md:px-0">
      <!-- Dark Blue Overlay/Block on the left -->
      <div class="absolute left-0 top-0 bottom-0 w-[80%] md:w-[350px] bg-[#1a2b4b] z-10 hidden md:flex flex-col justify-center items-center px-10">
        <div class="flex flex-col items-center gap-10">
          <div class="flex flex-col gap-6">
            <button @click="next" class="w-16 h-16 rounded-full border border-white flex items-center justify-center text-white hover:bg-white hover:text-[#1a2b4b] transition-all duration-300">
              <Icon name="mdi:arrow-right" class="text-2xl" />
            </button>
            <button @click="prev" class="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center text-white/30 hover:border-white hover:text-white transition-all duration-300">
              <Icon name="mdi:arrow-left" class="text-2xl" />
            </button>
          </div>
          
          <div class="text-white text-center">
            <div class="flex items-end gap-2 leading-none">
              <span class="text-5xl font-bold tracking-tighter">{{ String(currentIndex + 1).padStart(2, '0') }}</span>
              <span class="text-xl font-bold opacity-40 mb-1">{{ String(rooms.length).padStart(2, '0') }}</span>
            </div>
            <div class="w-8 h-[3px] bg-[#D4AF37] mx-auto mt-4"></div>
          </div>
        </div>
      </div>

      <!-- Mobile Controls -->
      <div class="md:hidden flex justify-center gap-4 mb-8 px-6">
        <button @click="prev" class="w-12 h-12 rounded-full border border-[#1a2b4b] flex items-center justify-center text-[#1a2b4b]">
          <Icon name="mdi:arrow-left" class="text-xl" />
        </button>
        <button @click="next" class="w-12 h-12 rounded-full bg-[#1a2b4b] flex items-center justify-center text-white">
          <Icon name="mdi:arrow-right" class="text-xl" />
        </button>
      </div>

      <!-- Carousel Container -->
      <div class="md:pl-[350px]">
        <div class="overflow-visible">
          <div class="flex transition-transform duration-700 ease-in-out" :style="{ transform: `translateX(-${currentIndex * (100 / visibleCount)}%)` }">
            <div v-for="(room, idx) in rooms" :key="room.id" class="flex-shrink-0 px-3 md:px-5" :style="{ width: `${100 / visibleCount}%` }">
              <div @click="openRoom(idx)" class="block bg-white shadow-lg overflow-hidden group border-b-[6px] border-[#1a2b4b] h-full flex flex-col relative cursor-pointer">
                <!-- Image -->
                <div class="aspect-[1.5/1] overflow-hidden">
                  <img :src="room.image" :alt="room.name" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                
                <!-- Content -->
                <div class="p-8 md:p-10 flex flex-col flex-1">
                  <h3 class="text-2xl font-serif font-bold text-[#1a2b4b] mb-4 group-hover:text-[#26BEEF] transition-colors leading-tight">{{ room.name }}</h3>
                  <div class="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-6" v-html="room.description"></div>
                </div>

                <!-- Hover Button -->
                <div class="absolute bottom-0 left-0 right-0 h-12 bg-[#26BEEF] flex items-center justify-center text-white font-bold text-xs uppercase tracking-widest gap-2 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out">
                  Read more <Icon name="mdi:eye" class="text-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Room Detail Popup -->
    <Teleport to="body">
      <div v-if="selectedRoom" class="fixed inset-0 z-[200] bg-[#002B5B] overflow-hidden animate-fade-in font-outfit">
        <!-- Main Background Image -->
        <img :src="selectedRoom.images?.[imgIdx] || selectedRoom.image" :alt="selectedRoom.name" class="absolute inset-0 w-full h-full object-cover transition-all duration-1000" />
        <div class="absolute inset-0 bg-black/20"></div>

        <!-- Top Left: Room Title & Brief -->
        <div class="absolute top-10 left-0 flex shadow-2xl animate-slide-right transition-transform duration-500"
             :class="!showInfoPanel ? '-translate-x-[calc(100%-3rem)]' : ''">
          <div class="w-full sm:w-4xl lg:w-4xl bg-white/50 backdrop-blur-md p-8 sm:p-10 lg:p-12 pr-16 max-h-[70vh] overflow-y-auto custom-scrollbar">
            <h1 class="text-3xl lg:text-4xl font-serif font-bold text-[#002B5B] mb-6 leading-tight">{{ selectedRoom.name }}</h1>
            <div class="text-[13px] text-[#002B5B]/80 leading-relaxed mb-8 prose prose-sm prose-blue" v-html="selectedRoom.description"></div>
            <div v-if="selectedRoom.bedType" class="flex items-center gap-3 text-sm font-bold text-[#002B5B]">
               <Icon name="mdi:bed-outline" class="text-xl" />
               {{ selectedRoom.bedType }}
            </div>
          </div>
          <div @click="showInfoPanel = !showInfoPanel" 
               class="w-12 bg-[#D4AF37] flex items-center justify-center cursor-pointer hover:bg-[#c4a132] transition-colors group">
            <Icon name="mdi:arrow-left" 
                  class="text-white text-2xl transition-transform" 
                  :class="!showInfoPanel ? 'rotate-180' : 'group-hover:-translate-x-1'" />
          </div>
        </div>

        <!-- Top Right: Stats & Close -->
        <div class="absolute top-0 right-0 flex items-stretch animate-slide-left z-20">
          <div class="bg-black/60 backdrop-blur-md px-10 py-5 flex items-center gap-12 text-white border-b border-l border-white/10">
            <div v-if="selectedRoom.size" class="flex items-center gap-4">
              <Icon name="mdi:aspect-ratio" class="text-3xl text-[#D4AF37] opacity-80" />
              <div class="text-center">
                <span class="block text-[10px] uppercase tracking-widest opacity-60 mb-0.5">Room size</span>
                <span class="font-bold text-lg">{{ selectedRoom.size }} m²</span>
              </div>
            </div>
            <div class="flex items-center gap-4 border-l border-white/20 pl-12">
              <Icon name="mdi:account-group-outline" class="text-3xl text-[#D4AF37] opacity-80" />
              <div class="text-center">
                <span class="block text-[10px] uppercase tracking-widest opacity-60 mb-0.5">Max persons</span>
                <span class="font-bold text-lg">{{ selectedRoom.guests || 2 }}</span>
              </div>
            </div>
          </div>
          <button @click="closeRoom" class="w-16 bg-[#D4AF37] flex items-center justify-center text-[#002B5B] hover:bg-white transition-all">
            <Icon name="mdi:close" class="text-3xl" />
          </button>
        </div>

        <!-- Center Left: Navigation -->
        <div class="absolute left-10 top-1/2 -translate-y-1/2 flex flex-col gap-6 z-10">
          <button @click="nextRoom" class="w-14 h-14 rounded-full border border-white/40 flex items-center justify-center text-white hover:bg-white hover:text-[#002B5B] transition-all hover:scale-110 shadow-lg backdrop-blur-sm">
            <Icon name="mdi:arrow-right" class="text-2xl" />
          </button>
          <button @click="prevRoom" class="w-14 h-14 rounded-full border border-white/40 flex items-center justify-center text-white hover:bg-white hover:text-[#002B5B] transition-all hover:scale-110 shadow-lg backdrop-blur-sm opacity-40 hover:opacity-100">
            <Icon name="mdi:arrow-left" class="text-2xl" />
          </button>
        </div>

        <!-- Bottom Left: Amenities -->
        <div v-if="selectedRoom.features?.length" 
             class="absolute bottom-10 left-0 flex shadow-2xl animate-slide-right transition-transform duration-500"
             :class="!showAmenitiesPanel ? '-translate-x-[calc(100%-3rem)]' : ''">
          <div class="w-full sm:w-4xl lg:w-4xl bg-white/50 backdrop-blur-md p-8 sm:p-10 lg:p-12 pr-16 max-h-[40vh] overflow-y-auto custom-scrollbar">
            <h3 class="text-2xl font-serif font-bold text-[#002B5B] mb-10 uppercase tracking-wider">Room amenities</h3>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-4 max-h-[30vh] overflow-y-auto pr-8 custom-scrollbar">
              <div v-for="a in selectedRoom.features" :key="a" class="text-[13px] font-medium text-[#002B5B]/70">
                {{ a }}
              </div>
            </div>
          </div>
          <div @click="showAmenitiesPanel = !showAmenitiesPanel" 
               class="w-12 bg-[#D4AF37] flex items-center justify-center cursor-pointer hover:bg-[#c4a132] transition-colors group">
            <Icon name="mdi:arrow-left" 
                  class="text-white text-2xl transition-transform" 
                  :class="!showAmenitiesPanel ? 'rotate-180' : 'group-hover:-translate-x-1'" />
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const rooms = ref([])
const currentIndex = ref(0)
const visibleCount = ref(3)

// Popup State
const selectedIdx = ref(null)
const imgIdx = ref(0)
const showInfoPanel = ref(true)
const showAmenitiesPanel = ref(true)
const selectedRoom = computed(() => selectedIdx.value !== null ? rooms.value[selectedIdx.value] : null)

const { locale, localePath } = useLocale()

const updateVisibleCount = () => {
  const w = window.innerWidth
  if (w < 768) visibleCount.value = 1
  else if (w < 1280) visibleCount.value = 2
  else visibleCount.value = 2.5
}

const prev = () => { currentIndex.value = currentIndex.value > 0 ? currentIndex.value - 1 : rooms.value.length - 1 }
const next = () => { currentIndex.value = currentIndex.value < rooms.value.length - 1 ? currentIndex.value + 1 : 0 }

// Popup Nav
const openRoom = (idx) => {
  selectedIdx.value = idx
  imgIdx.value = 0
  document.body.style.overflow = 'hidden'
}
const closeRoom = () => {
  selectedIdx.value = null
  document.body.style.overflow = 'auto'
}
const nextRoom = () => { 
  const imgs = selectedRoom.value?.images || []
  if (imgs.length > 0) {
    imgIdx.value = (imgIdx.value + 1) % imgs.length
  }
}
const prevRoom = () => { 
  const imgs = selectedRoom.value?.images || []
  if (imgs.length > 0) {
    imgIdx.value = (imgIdx.value - 1 + imgs.length) % imgs.length
  }
}

onMounted(async () => {
  updateVisibleCount()
  window.addEventListener('resize', updateVisibleCount)
  
  const { fetchRooms } = useHotel()
  const apiRooms = await fetchRooms(locale.value)
  rooms.value = (apiRooms || []).filter(r => r.img?.length > 0 && r.isBookingBasic !== true)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateVisibleCount)
  document.body.style.overflow = 'auto'
})
</script>

<style scoped>
.font-serif {
  font-family: 'Playfair Display', serif;
}
.animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
.animate-slide-up { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
</style>
