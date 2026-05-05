<template>
  <section id="surroundings" class="py-24 bg-[#f9f7f4] overflow-hidden">
    <div class="container mx-auto px-6">
      <div class="text-center mb-20 text-center">
        <h2 class="text-5xl md:text-6xl font-serif font-bold text-[#002B5B]">Property surroundings</h2>
      </div>

      <div class="relative max-w-6xl mx-auto bg-white shadow-2xl flex flex-col md:flex-row overflow-hidden min-h-[600px]">
        
        <!-- Left: Category Content (White) -->
        <div class="md:w-[60%] flex flex-col bg-white max-h-[500px] md:max-h-[650px] order-2 md:order-1">
          <!-- Scrollable Items Area -->
          <div class="flex-1 overflow-y-auto p-10 md:p-20 custom-scrollbar">
            <div v-if="activeCategory" class="w-full animate-fade-in" :key="selectedIndex">
              <h3 class="text-3xl font-serif font-bold text-[#002B5B] mb-12">{{ activeCategory.name }}</h3>
              
              <div class="space-y-4 text-left mx-auto max-w-xl">
                <div v-for="(place, pIdx) in activeCategory.places" :key="pIdx" 
                     class="flex items-center justify-between py-3 border-b border-gray-100 last:border-0 leading-tight">
                  <span class="text-base text-gray-700">{{ place.name }}</span>
                  <span class="text-sm font-bold text-gray-500 whitespace-nowrap">{{ place.distance }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Fixed Bottom Dots Navigation -->
          <div v-if="categories.length > 1" class="p-6 md:p-8 bg-white border-t border-gray-50 flex justify-center flex-wrap gap-2">
            <button 
              v-for="(cat, idx) in categories" 
              :key="idx" 
              @click="selectedIndex = idx"
              class="transition-all duration-300 rounded-full"
              :class="selectedIndex === idx ? 'w-8 h-2 bg-[#D4AF37]' : 'w-2 h-2 bg-blue-900/10 hover:bg-blue-900/20'"
              :title="cat.name"
            ></button>
          </div>
        </div>

        <!-- Right: Category List (Navy) -->
        <div class="md:w-[40%] bg-[#003471] text-white flex flex-col items-stretch relative order-1 md:order-2">
          <div class="flex-1 overflow-y-auto py-12 px-8 md:py-16 md:px-16 max-h-[300px] md:max-h-[650px] custom-scrollbar">
            <ul class="space-y-2 md:space-y-4">
              <li v-for="(cat, idx) in categories" :key="idx" 
                  @click="selectedIndex = idx"
                  class="group cursor-pointer flex items-center transition-all duration-300">
                <div 
                  class="px-4 py-2 md:px-5 md:py-3 text-base md:text-lg font-bold transition-all duration-300 w-full text-left"
                  :class="selectedIndex === idx ? 'bg-white/10 text-white shadow-sm ring-1 ring-white/20' : 'text-white/50 hover:text-white'"
                >
                  {{ cat.name }}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const { locale } = useLocale()
const categories = ref([])
const selectedIndex = ref(0)
const activeCategory = computed(() => categories.value[selectedIndex.value])

onMounted(async () => {
  const { fetchSurroundings } = useHotel()
  const res = await fetchSurroundings(locale.value)
  if (res && res.length) {
    categories.value = res
  } else {
    // Fallback data
    categories.value = [
      { 
        name: "What's nearby", 
        places: [
          { name: "Djemaa El Fna", distance: "300 m" },
          { name: "Dar Si Said Museum", distance: "400 m" },
          { name: "Parc Lalla Hasna", distance: "450 m" },
          { name: "El Badi Palace", distance: "550 m" },
          { name: "Saadian Tombs", distance: "600 m" },
        ]
      },
      { name: "Restaurants & cafes", places: [{ name: "Local Cafe", distance: "100 m" }] }
    ]
  }
})
</script>

<style scoped>
.font-serif {
  font-family: 'Playfair Display', serif;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.6s cubic-bezier(0.2, 1, 0.3, 1) forwards;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(0, 52, 113, 0.05);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #D4AF37;
  border-radius: 10px;
}
</style>
