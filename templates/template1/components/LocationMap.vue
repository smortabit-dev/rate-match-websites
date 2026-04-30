<template>
  <section class="py-16 sm:py-24 bg-gray-100" style="isolation: isolate; z-index: 0; position: relative;">
    <div class="container mx-auto px-4 sm:px-6">

      <!-- Header: subtitle+title (left) | category filter tabs (right) -->
      <div class="flex flex-col md:flex-row md:items-end md:justify-between mb-10 sm:mb-16">

        <!-- Left -->
        <div>
          <p class="section-subtitle">{{ t.explorezlesalentours }}</p>
          <h2 class="section-title">{{ t.propertysurroundings }}</h2>
        </div>

        <!-- Right: category filter tabs + arrows -->
        <div class="flex items-center gap-4 mt-6 md:mt-0" v-if="categories.length">
          <!-- Sliding window of category buttons -->
          <div class="flex gap-2">
            <button v-for="(cat, idx) in visibleCategories" :key="idx"
                    @click="setCategory(filterOffset + idx)"
                    class="px-4 py-1.5 text-xs uppercase tracking-[0.15em] font-semibold transition-all duration-300 border"
                    :class="selectedIndex === filterOffset + idx
                      ? 'bg-amber-700 text-white border-amber-700'
                      : 'bg-transparent text-gray-600 border-gray-300 hover:border-amber-700 hover:text-amber-700'">
              {{ cat.name }}
            </button>
          </div>
          <!-- Navigation arrows -->
          <div class="flex gap-2 flex-shrink-0">
            <button @click="scrollFilters(-1)" :disabled="filterOffset === 0"
                    class="w-9 h-9 sm:w-10 sm:h-10 border border-gray-300 flex items-center justify-center text-gray-500 hover:border-amber-700 hover:text-amber-700 transition-all disabled:opacity-30">
              <Icon name="mdi:arrow-left" class="text-lg" />
            </button>
            <button @click="scrollFilters(1)" :disabled="filterOffset >= categories.length - FILTER_VISIBLE"
                    class="w-9 h-9 sm:w-10 sm:h-10 border border-gray-300 flex items-center justify-center text-gray-500 hover:border-amber-700 hover:text-amber-700 transition-all disabled:opacity-30">
              <Icon name="mdi:arrow-right" class="text-lg" />
            </button>
          </div>
        </div>
      </div>

      <!-- Surroundings list -->
      <div>
        <h3 class="text-xl sm:text-2xl font-serif text-gray-800 italic mb-6">{{ currentCategory?.name }}</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12">
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
import { ref, computed, onMounted } from 'vue'

const categories    = ref([])
const selectedIndex = ref(0)
const filterOffset  = ref(0)
const FILTER_VISIBLE = 4   // max visible category buttons at once

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

const STATIC_KEYS = ['explorezlesalentours', 'propertysurroundings']
const t = ref(Object.fromEntries(STATIC_KEYS.map(k => [k, k])))

const { locale } = useLocale()

const currentCategory  = computed(() => categories.value[selectedIndex.value])
const visibleCategories = computed(() =>
  categories.value.slice(filterOffset.value, filterOffset.value + FILTER_VISIBLE)
)

const setCategory = (idx) => { selectedIndex.value = idx }

const scrollFilters = (dir) => {
  const max = Math.max(0, categories.value.length - FILTER_VISIBLE)
  filterOffset.value = Math.min(max, Math.max(0, filterOffset.value + dir))
}

onMounted(async () => {
  const { fetchSurroundings } = useHotel()
  const { loadCatalogue, transStatic } = useTranslations()

  const [surroundings, catalogue] = await Promise.all([
    fetchSurroundings(locale.value),
    loadCatalogue(locale.value),
  ])

  categories.value = surroundings

  const translated = {}
  for (const key of STATIC_KEYS) translated[key] = transStatic(key, catalogue, key)
  t.value = translated
})
</script>
