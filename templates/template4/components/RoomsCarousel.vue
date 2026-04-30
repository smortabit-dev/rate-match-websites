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
      <div v-if="selectedRoom" class="fixed inset-0 z-[200] flex animate-fade-in">
        <!-- Close Button -->
        <button @click="closeRoom" class="absolute top-0 right-0 z-[220] bg-[#D4AF37] text-[#002B5B] px-8 py-5 font-bold uppercase tracking-widest flex items-center gap-3 hover:bg-[#c4a132] transition-colors shadow-lg">
          <Icon name="mdi:close" class="text-2xl" />
          Close
        </button>

        <!-- Left Navbar Block (Sidebar) -->
        <div class="hidden md:flex w-[350px] h-full bg-[#1a2b4b] flex-col justify-center items-center px-10 relative z-50">
          <div class="flex flex-col items-center gap-10">
            <div class="flex flex-col gap-6">
              <button @click="nextRoom" class="w-16 h-16 rounded-full border border-white flex items-center justify-center text-white hover:bg-white hover:text-[#1a2b4b] transition-all duration-300">
                <Icon name="mdi:arrow-right" class="text-2xl" />
              </button>
              <button @click="prevRoom" class="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center text-white/30 hover:border-white hover:text-white transition-all duration-300">
                <Icon name="mdi:arrow-left" class="text-2xl" />
              </button>
            </div>
            
            <div class="text-white text-center">
              <div class="flex items-end gap-2 leading-none">
                <span class="text-5xl font-bold tracking-tighter">{{ String(selectedIdx + 1).padStart(2, '0') }}</span>
                <span class="text-xl font-bold opacity-40 mb-1">{{ String(rooms.length).padStart(2, '0') }}</span>
              </div>
              <div class="w-8 h-[3px] bg-[#D4AF37] mx-auto mt-4"></div>
            </div>
          </div>
        </div>

        <!-- Right Content Area -->
        <div class="flex-1 bg-[#f9f7f4] relative overflow-y-auto pt-24 pb-16 px-8 md:px-20">
           <div class="max-w-4xl mx-auto animate-slide-up">
              <!-- Image Gallery for Room -->
              <div class="mb-12 relative group">
                <div class="aspect-video overflow-hidden shadow-2xl">
                   <img :src="selectedRoom.img[imgIdx] || selectedRoom.image" class="w-full h-full object-cover transition-all duration-700" />
                </div>
                <!-- Mini Gallery Nav -->
                <div v-if="selectedRoom.img?.length > 1" class="absolute bottom-6 right-6 flex gap-3">
                   <button v-for="(img, i) in selectedRoom.img.slice(0, 5)" :key="i"
                           @click="imgIdx = i"
                           class="w-3 h-3 rounded-full border-2 border-white transition-all"
                           :class="imgIdx === i ? 'bg-white scale-125' : 'bg-transparent'"></button>
                </div>
              </div>

              <!-- Details -->
              <div class="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                <h3 class="text-4xl md:text-5xl font-serif font-bold text-[#1a2b4b] leading-tight">{{ selectedRoom.name }}</h3>
                <div class="flex flex-col items-end">
                   <span class="text-sm font-bold uppercase tracking-widest text-[#D4AF37] mb-1">Price from</span>
                   <span class="text-3xl font-bold text-[#1a2b4b]">{{ selectedRoom.price }} {{ selectedRoom.currency }}</span>
                </div>
              </div>

              <!-- Body -->
              <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
                 <div class="lg:col-span-2">
                    <h4 class="text-xs font-bold uppercase tracking-[0.3em] text-[#1a2b4b] mb-6 opacity-60">Description</h4>
                    <div class="text-[#1a2b4b]/80 leading-relaxed text-lg space-y-6" v-html="selectedRoom.description"></div>
                 </div>
                 
                 <div class="space-y-10">
                    <div>
                       <h4 class="text-xs font-bold uppercase tracking-[0.3em] text-[#1a2b4b] mb-6 opacity-60">Capacity</h4>
                       <div class="flex items-center gap-4 text-[#1a2b4b]">
                          <Icon name="mdi:account-group" class="text-2xl text-[#26BEEF]" />
                          <span class="font-bold">{{ selectedRoom.capacityLabel || 'Up to 2 people' }}</span>
                       </div>
                    </div>

                    <div v-if="selectedRoom.facilities?.length">
                       <h4 class="text-xs font-bold uppercase tracking-[0.3em] text-[#1a2b4b] mb-6 opacity-60">Facilities</h4>
                       <ul class="grid grid-cols-1 gap-3">
                          <li v-for="(f, fi) in selectedRoom.facilities.slice(0, 8)" :key="fi" class="flex items-center gap-3 text-sm text-[#1a2b4b]/70">
                             <div class="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></div>
                             {{ f.name }}
                          </li>
                       </ul>
                    </div>

                    <button class="w-full py-5 bg-[#1a2b4b] text-white font-bold uppercase tracking-widest hover:bg-[#D4AF37] transition-all shadow-xl">
                       Book now
                    </button>
                 </div>
              </div>
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
  selectedIdx.value = selectedIdx.value < rooms.value.length - 1 ? selectedIdx.value + 1 : 0
  imgIdx.value = 0
}
const prevRoom = () => { 
  selectedIdx.value = selectedIdx.value > 0 ? selectedIdx.value - 1 : rooms.value.length - 1
  imgIdx.value = 0
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
