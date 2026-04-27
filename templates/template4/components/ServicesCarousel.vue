<template>
  <section id="services" class="py-24 bg-[#f9f7f4] overflow-hidden">
    <!-- Section Title -->
    <div class="text-center mb-12 px-6">
      <h2 class="text-5xl md:text-6xl font-serif font-bold text-[#002B5B]">Our services</h2>
    </div>

    <!-- Top Categories Carousel -->
    <div class="container mx-auto px-6 mb-16 relative">
      <div class="flex items-center gap-4">
        <!-- Prev Cat -->
        <button @click="scrollCategories(-1)" class="w-12 h-12 rounded-full border border-gray-200 flex flex-shrink-0 items-center justify-center text-gray-400 hover:border-[#002B5B] hover:text-[#002B5B] transition-all">
          <Icon name="mdi:chevron-left" class="text-2xl" />
        </button>

        <div class="flex-1 overflow-hidden" ref="categoriesScroll">
          <div class="flex gap-4 transition-transform duration-500 ease-out">
            <!-- All Services -->
            <div @click="selectedCategoryId = null"
                 class="flex-shrink-0 w-44 lg:w-[calc(20%-0.8rem)] h-20 relative cursor-pointer group overflow-hidden shadow-sm"
                 :class="selectedCategoryId === null ? 'ring-2 ring-[#D4AF37]' : ''">
              <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400" class="absolute inset-0 w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" />
              <div v-if="selectedCategoryId === null" class="absolute left-0 top-0 bottom-0 w-6 bg-[#D4AF37] flex items-center justify-center">
                 <Icon name="mdi:arrow-down" class="text-white text-xs" />
              </div>
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-xs font-bold text-white uppercase tracking-widest text-center px-4">All services</span>
              </div>
            </div>

            <!-- Dynamic Categories -->
            <div v-for="cat in categories" :key="cat.id" 
                 @click="selectedCategoryId = cat.id"
                 class="flex-shrink-0 w-44 lg:w-[calc(20%-0.8rem)] h-20 relative cursor-pointer group overflow-hidden shadow-sm"
                 :class="selectedCategoryId === cat.id ? 'ring-2 ring-[#D4AF37]' : ''">
              <img :src="cat.image || 'https://images.unsplash.com/photo-1544161515-4ae6ce6ea858?w=400'" class="absolute inset-0 w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" />
              <div v-if="selectedCategoryId === cat.id" class="absolute left-0 top-0 bottom-0 w-6 bg-[#D4AF37] flex items-center justify-center">
                 <Icon name="mdi:arrow-down" class="text-white text-xs" />
              </div>
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-xs font-bold text-white uppercase tracking-widest text-center px-4">{{ cat.name }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Next Cat -->
        <button @click="scrollCategories(1)" class="w-12 h-12 rounded-full border border-gray-200 flex flex-shrink-0 items-center justify-center text-gray-400 hover:border-[#002B5B] hover:text-[#002B5B] transition-all">
          <Icon name="mdi:chevron-right" class="text-2xl" />
        </button>
      </div>
    </div>

    <!-- Lower Main Carousel -->
    <div class="relative">
      <!-- Dark Blue Block on the left -->
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
              <span class="text-xl font-bold opacity-40 mb-1">{{ String(filteredServices.length).padStart(2, '0') }}</span>
            </div>
            <div class="w-12 h-[3px] bg-[#D4AF37] mx-auto mt-4"></div>
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
        <div class="overflow-visible px-4 md:px-0">
          <div class="flex transition-transform duration-700 ease-in-out" :style="{ transform: `translateX(-${currentIndex * (100 / visibleCount)}%)` }">
            <div v-for="(service, idx) in filteredServices" :key="idx" class="flex-shrink-0 px-3 md:px-5" :style="{ width: `${100 / visibleCount}%` }">
              <div @click="openPopup(idx)" class="bg-white shadow-xl flex flex-col h-full group cursor-pointer relative overflow-hidden border-b-8 border-[#D4AF37]">
                
                <!-- Background Image (Dimmed) -->
                <div class="absolute inset-0 z-0">
                  <img :src="service.image" :alt="service.name" class="w-full h-full object-cover opacity-10 blur-[1px] transition-transform duration-[2s] group-hover:scale-110" />
                </div>

                <!-- Card Content -->
                <div class="relative z-10 p-10 md:p-12 flex flex-col h-full min-h-[450px]">
                  <h3 class="text-2xl font-serif font-bold text-[#002B5B] uppercase tracking-widest mb-10 text-center leading-tight">
                    {{ service.name }}
                  </h3>
                  
                  <div class="flex-1 flex items-center justify-center">
                    <p class="text-[#002B5B] text-center text-[15px] leading-relaxed font-medium line-clamp-6 opacity-80" v-html="service.description"></p>
                  </div>

                  <div class="mt-auto pt-10 flex items-end justify-between">
                    <div>
                      <p class="text-[10px] text-[#002B5B] font-bold uppercase tracking-widest opacity-60 mb-1">Starting from</p>
                      <p class="text-sm font-bold text-[#002B5B]">{{ service.price > 0 ? service.price + ' ' + (currency || 'MAD') : 'On request' }}</p>
                    </div>
                    <button class="text-[#D4AF37] font-bold text-xs uppercase tracking-[0.2em] border-b border-transparent hover:border-[#D4AF37] transition-all">
                      Read more
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Service Detail Popup -->
    <Teleport to="body">
      <div v-if="selectedService" class="fixed inset-0 z-[200] flex animate-fade-in">
        <!-- Close Button -->
        <button @click="closePopup" class="absolute top-0 right-0 z-[220] bg-[#D4AF37] text-[#002B5B] px-8 py-5 font-bold uppercase tracking-widest flex items-center gap-3 hover:bg-[#c4a132] transition-colors shadow-lg">
          <Icon name="mdi:close" class="text-2xl" />
          Close
        </button>

        <!-- Left Navbar Block (Sidebar) -->
        <div class="hidden md:flex w-[350px] h-full bg-[#1a2b4b] flex-col justify-center items-center px-10 relative z-50">
          <div class="flex flex-col items-center gap-10">
            <div class="flex flex-col gap-6">
              <button @click="nextPopup" class="w-16 h-16 rounded-full border border-white flex items-center justify-center text-white hover:bg-white hover:text-[#1a2b4b] transition-all duration-300">
                <Icon name="mdi:arrow-right" class="text-2xl" />
              </button>
              <button @click="prevPopup" class="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center text-white/30 hover:border-white hover:text-white transition-all duration-300">
                <Icon name="mdi:arrow-left" class="text-2xl" />
              </button>
            </div>
            
            <div class="text-white text-center">
              <div class="flex items-end gap-2 leading-none">
                <span class="text-5xl font-bold tracking-tighter">{{ String(selectedIdx + 1).padStart(2, '0') }}</span>
                <span class="text-xl font-bold opacity-40 mb-1">{{ String(filteredServices.length).padStart(2, '0') }}</span>
              </div>
              <div class="w-12 h-[3px] bg-[#D4AF37] mx-auto mt-4"></div>
            </div>
          </div>
        </div>

        <!-- Right Content Area -->
        <div class="flex-1 bg-[#f9f7f4] relative overflow-y-auto pt-24 pb-16 px-8 md:px-20 flex flex-col items-center">
           <div class="w-full max-w-4xl animate-slide-up">
              <!-- Service Image -->
              <div class="aspect-video w-full overflow-hidden shadow-2xl mb-12">
                 <img :src="selectedService.image" :alt="selectedService.name" class="w-full h-full object-cover" />
              </div>

              <!-- Content -->
              <div class="text-center">
                 <h3 class="text-4xl md:text-5xl font-serif font-bold text-[#002B5B] uppercase tracking-widest mb-10 leading-tight">
                    {{ selectedService.name }}
                 </h3>
                 
                 <div class="prose prose-blue max-w-none text-lg text-[#002B5B]/80 leading-relaxed space-y-6" v-html="selectedService.description"></div>

                 <!-- Footer Info -->
                 <div class="mt-16 pt-10 border-t border-gray-200 flex flex-col items-center gap-4">
                    <p class="text-sm font-bold uppercase tracking-[0.3em] text-[#002B5B] opacity-60">Starting from</p>
                    <p class="text-2xl font-bold text-[#D4AF37]">{{ selectedService.price > 0 ? selectedService.price + ' ' + (currency || 'MAD') : 'On request' }}</p>
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

const { locale } = useLocale()
const currency = useCurrency()
const categories = ref([])
const allServices = ref([])
const selectedCategoryId = ref(null)
const currentIndex = ref(0)
const visibleCount = ref(3)
const categoriesScroll = ref(null)

// Popup State
const selectedIdx = ref(null)
const selectedService = computed(() => selectedIdx.value !== null ? filteredServices.value[selectedIdx.value] : null)

const updateVisibleCount = () => {
  const w = window.innerWidth
  if (w < 768) visibleCount.value = 1.1
  else if (w < 1280) visibleCount.value = 2.1
  else visibleCount.value = 3.1
}

const filteredServices = computed(() => {
  if (!selectedCategoryId.value) return allServices.value
  return allServices.value.filter(s => s._categoryId === selectedCategoryId.value)
})

const prev = () => { currentIndex.value = currentIndex.value > 0 ? currentIndex.value - 1 : filteredServices.value.length - 1 }
const next = () => { currentIndex.value = currentIndex.value < filteredServices.value.length - 1 ? currentIndex.value + 1 : 0 }

const scrollCategories = (dir) => {
  if (categoriesScroll.value) {
    categoriesScroll.value.scrollBy({ left: dir * 220, behavior: 'smooth' })
  }
}

// Popup Navigation
const openPopup = (idx) => {
  selectedIdx.value = idx
  document.body.style.overflow = 'hidden'
}
const closePopup = () => {
  selectedIdx.value = null
  document.body.style.overflow = 'auto'
}
const nextPopup = () => { selectedIdx.value = selectedIdx.value < filteredServices.value.length - 1 ? selectedIdx.value + 1 : 0 }
const prevPopup = () => { selectedIdx.value = selectedIdx.value > 0 ? selectedIdx.value - 1 : filteredServices.value.length - 1 }

watch(selectedCategoryId, () => {
  currentIndex.value = 0
})

onMounted(async () => {
  updateVisibleCount()
  window.addEventListener('resize', updateVisibleCount)
  
  const { fetchServices } = useHotel()
  const groups = await fetchServices(locale.value)
  if (groups && groups.length > 0) {
    categories.value = groups.map(g => ({
      id: g.id,
      name: g.name,
      image: g.services?.[0]?.image || 'https://images.unsplash.com/photo-1544161515-4ae6ce6ea858?w=400'
    }))

    allServices.value = groups.flatMap(g => 
      g.services.map(s => ({
        ...s,
        _categoryId: g.id,
        image: (s.images && s.images[0]) || s.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200'
      }))
    )
  }
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
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

.animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
.animate-slide-up { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
</style>
