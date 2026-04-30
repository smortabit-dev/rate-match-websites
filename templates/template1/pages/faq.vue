<template>
  <div class="min-h-screen bg-gray-50 pt-14 sm:pt-14">
    <!-- Return Bar -->
    <div class="bg-[#5c544d] w-full">
      <div class="container mx-auto px-4 sm:px-6 py-4">
        <NuxtLink :to="localePath('/') + '#footer'" class="inline-flex items-center text-white text-[11px] font-bold uppercase tracking-[0.15em] hover:text-[#d4af37] transition-colors">
          <Icon name="mdi:arrow-left" class="mr-3 text-lg" />
          {{ t.retour }}
        </NuxtLink>
      </div>
    </div>
    <!-- Content -->
    <div class="container mx-auto px-4 sm:px-6 py-10 sm:py-16 max-w-3xl">
      <h2 class="text-3xl sm:text-4xl font-serif text-gray-900 mb-10 text-center">{{ t.faq2 }}</h2>

      <div class="space-y-4">
        <div v-for="(item, idx) in faqs" :key="idx"
             class="bg-white border border-gray-200 overflow-hidden">
          <button @click="toggle(idx)"
                  class="w-full flex items-center justify-between px-6 py-5 text-left transition-colors hover:bg-gray-50">
            <span class="text-sm font-semibold text-gray-800 pr-4">{{ item.question }}</span>
            <Icon :name="openIndex === idx ? 'mdi:chevron-up' : 'mdi:chevron-down'"
                  class="text-lg text-amber-700 flex-shrink-0" />
          </button>
          <div v-if="openIndex === idx" class="px-6 pb-5 text-sm text-gray-600 leading-normal border-t border-gray-100 pt-4 faq-content" v-html="item.answer">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const { locale, localePath } = useLocale()
const { loadCatalogue, transStatic } = useTranslations()
const { fetchFaq } = useHotel()

const STATIC_KEYS = ['retour', 'faq2']
const t = ref(Object.fromEntries(STATIC_KEYS.map(k => [k, k])))

const openIndex = ref(null)
const toggle = (idx) => { openIndex.value = openIndex.value === idx ? null : idx }

const faqs = ref([])
const loading = ref(true)

const formatText = (text) => {
  if (!text) return ''
  // If text already contains HTML markup, don't blindly convert \n to <br> 
  // as this causes massive gaps between block elements.
  if (/<[a-z][\s\S]*>/i.test(text)) {
    return text
  }
  return text.trim().replace(/(\r\n|\n|\r){2,}/g, '<br><br>').replace(/(\r\n|\n|\r)/g, '<br>')
}

onMounted(async () => {
  const [catalogue, items] = await Promise.all([
    loadCatalogue(locale.value),
    fetchFaq(locale.value)
  ])

  // Translate static UI
  const translated = {}
  for (const key of STATIC_KEYS) translated[key] = transStatic(key, catalogue)
  t.value = translated

  // Set FAQs
  faqs.value = items.map(item => ({
    ...item,
    answer: formatText(item.answer)
  }))

  loading.value = false
})
</script>
