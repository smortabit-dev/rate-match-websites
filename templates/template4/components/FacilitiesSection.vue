<template>
  <section id="amenities" class="py-24 bg-[#f9f7f4] overflow-hidden">
    <div class="container mx-auto px-6">
      <div class="text-center mb-20">
        <h2 class="text-5xl md:text-6xl font-serif font-bold text-[#002B5B]">Facilities</h2>
      </div>

      <div class="relative max-w-6xl mx-auto bg-white shadow-2xl flex flex-col md:flex-row overflow-hidden min-h-[600px]">
        <!-- Left: Category List (Navy) -->
        <div class="md:w-[40%] bg-[#003471] text-white flex flex-col items-stretch relative">
          <div class="flex-1 overflow-y-auto py-12 px-8 md:py-16 md:px-16 max-h-[300px] md:max-h-[650px] custom-scrollbar">
            <ul class="space-y-2 md:space-y-4">
              <!-- Filter option for ALL if needed, but here we just list categories -->
              <li v-for="(cat, idx) in categories" :key="idx" 
                  @click="activeCategoryIndex = idx"
                  class="group cursor-pointer flex items-center transition-all duration-300">
                <div 
                  class="px-4 py-2 md:px-5 md:py-3 text-base md:text-lg font-bold transition-all duration-300 w-full text-left"
                  :class="activeCategoryIndex === idx ? 'bg-white/10 text-white shadow-sm ring-1 ring-white/20' : 'text-white/50 hover:text-white'"
                >
                  {{ cat.name }}
                </div>
              </li>
            </ul>
          </div>
        </div>

        <!-- Right: Category Details (White) -->
        <div class="md:w-[60%] flex flex-col bg-white max-h-[500px] md:max-h-[650px]">
          <!-- Scrollable Items Area -->
          <div class="flex-1 overflow-y-auto p-10 md:p-20 custom-scrollbar">
            <div v-if="activeCategory" class="w-full animate-fade-in" :key="activeCategoryIndex">
              <h3 class="text-3xl font-serif font-bold text-[#002B5B] mb-12">{{ activeCategory.name }}</h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-left mx-auto max-w-2xl">
                <div v-for="(item, iIdx) in activeCategory.items" :key="iIdx" class="flex items-center gap-3 text-gray-600">
                  <div class="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></div>
                  <span class="text-sm md:text-base font-medium">{{ item }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Fixed Bottom Dots Navigation -->
          <div v-if="categories.length > 1" class="p-6 md:p-8 bg-white border-t border-gray-50 flex justify-center flex-wrap gap-2">
            <button 
              v-for="(cat, idx) in categories" 
              :key="idx" 
              @click="activeCategoryIndex = idx"
              class="transition-all duration-300 rounded-full"
              :class="activeCategoryIndex === idx ? 'w-8 h-2 bg-[#D4AF37]' : 'w-2 h-2 bg-blue-900/10 hover:bg-blue-900/20'"
              :title="cat.name"
            ></button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const categories = ref([])
const activeCategoryIndex = ref(0)
const { locale } = useLocale()

const activeCategory = computed(() => categories.value[activeCategoryIndex.value])

onMounted(async () => {
  const { fetchHotelData } = useHotel()
  const { loadCatalogue, transFacilities, transFacilitiesType } = useTranslations()

  const [data, catalogue] = await Promise.all([
    fetchHotelData(),
    loadCatalogue(locale.value),
  ])

  const rawFac = data?.facilities ?? []
  const facArr = Array.isArray(rawFac) ? rawFac : Object.values(rawFac)
  
  const categoryMap = new Map()

  // 1. First, we strictly process facilities data like template1's section
  // but we group them by their translated category names.
  for (const group of facArr) {
    const ftId = group.ftId || group.id || group.fcType || ''
    let catName = transFacilitiesType(ftId, catalogue, group.fcCatNom || group.nom || group.name || 'General')
    
    // Cleanup/Filter
    catName = catName.trim()
    if (!catName || catName.includes('null')) continue

    const nested = group.facilities ?? group.Facilities ?? []
    const items = Array.isArray(nested) ? nested : Object.values(nested)
    
    if (items.length === 0) continue

    const translatedItems = items.map(f => {
      const fcId = f.fcId ?? f.id
      return transFacilities(fcId, catalogue, f.fcName ?? f.name ?? '')
    }).filter(n => n && !n.includes('null'))

    if (translatedItems.length === 0) continue

    if (categoryMap.has(catName)) {
      const existing = categoryMap.get(catName)
      // Merge unique items
      const combined = [...new Set([...existing.items, ...translatedItems])]
      categoryMap.set(catName, { name: catName, items: combined })
    } else {
      categoryMap.set(catName, { name: catName, items: translatedItems })
    }
  }

  // 2. Final filter of categories (ensure we have items and meaningful names)
  const final = Array.from(categoryMap.values()).filter(c => c.items.length > 0)
  
  categories.value = final.length ? final : [
    { name: 'Hotel Facilities', items: ['Free WiFi', 'Pool', 'Parking'] }
  ]
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
