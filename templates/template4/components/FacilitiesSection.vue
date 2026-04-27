<template>
  <section id="amenities" class="py-24 bg-[#f9f7f4] overflow-hidden">
    <div class="container mx-auto px-6">
      <div class="text-center mb-20">
        <h2 class="text-5xl md:text-6xl font-serif font-bold text-[#002B5B]">Facilities</h2>
      </div>

      <div class="relative max-w-6xl mx-auto bg-white shadow-2xl flex flex-col md:flex-row overflow-hidden min-h-[600px]">
        <!-- Left: Category List (Navy) -->
        <div class="md:w-[40%] bg-[#003471] text-white flex flex-col items-stretch relative">
          <div class="flex-1 overflow-y-auto scrollbar-hide py-16 px-10 md:px-16 max-h-[600px]">
            <ul class="space-y-4">
              <!-- Filter option for ALL if needed, but here we just list categories -->
              <li v-for="(cat, idx) in categories" :key="idx" 
                  @click="activeCategoryIndex = idx"
                  class="group cursor-pointer flex items-center transition-all duration-300">
                <div 
                  class="px-5 py-3 text-lg font-bold transition-all duration-300 w-full text-left"
                  :class="activeCategoryIndex === idx ? 'bg-white/10 text-white shadow-sm ring-1 ring-white/20' : 'text-white/50 hover:text-white'"
                >
                  {{ cat.name }}
                </div>
              </li>
            </ul>
          </div>

          <!-- Decorative Gold Line indicator -->
          <div class="absolute right-0 top-0 bottom-0 w-[4px] bg-white/5">
            <div 
              class="w-full bg-[#D4AF37] transition-all duration-500 rounded-full"
              :style="{ 
                height: `${100 / Math.max(1, categories.length)}%`, 
                transform: `translateY(${activeCategoryIndex * 100}%)`,
                maxHeight: '100px'
              }"
            ></div>
          </div>
        </div>

        <!-- Right: Category Details (White) -->
        <div class="md:w-[60%] p-10 md:p-20 flex flex-col items-center justify-start text-center overflow-y-auto max-h-[600px]">
          <div v-if="activeCategory" class="w-full animate-fade-in" :key="activeCategoryIndex">
            <h3 class="text-3xl font-serif font-bold text-[#002B5B] mb-12">{{ activeCategory.name }}</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-left mx-auto max-w-2xl">
              <div v-for="(item, iIdx) in activeCategory.items" :key="iIdx" class="flex items-center gap-3 text-gray-600">
                <div class="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></div>
                <span class="text-sm md:text-base font-medium">{{ item }}</span>
              </div>
            </div>

            <!-- Dots -->
            <div class="flex justify-center gap-2 mt-20 pb-10">
              <div class="w-2.5 h-2.5 rounded-full bg-[#D4AF37]"></div>
              <div v-for="i in 12" :key="i" class="w-2 h-2 rounded-full bg-blue-900/10"></div>
            </div>
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

.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
