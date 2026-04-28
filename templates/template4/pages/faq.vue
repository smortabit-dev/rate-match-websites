<template>
  <div class="min-h-screen bg-[#f9f7f4] pt-24 sm:pt-36 font-sans text-[#1a2b4b]">
    <!-- Content -->
    <div class="container mx-auto px-4 sm:px-6 py-10 sm:py-16 max-w-4xl">
      <h2 class="text-4xl sm:text-6xl font-serif font-bold text-[#002B5B] mb-12 text-center">{{ t.faqtitre }}</h2>

      <div class="space-y-4">
        <div v-for="(item, idx) in faqs" :key="idx"
             class="bg-white shadow-lg overflow-hidden border-l-4 transition-all duration-300"
             :class="openIndex === idx ? 'border-[#D4AF37]' : 'border-transparent hover:border-[#26BEEF]/50'">
          <button @click="toggle(idx)"
                  class="w-full flex items-center justify-between px-8 py-6 text-left transition-colors hover:bg-gray-50">
            <span class="text-lg font-bold text-[#1a2b4b] pr-4">{{ item.question }}</span>
            <div class="w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors"
                 :class="openIndex === idx ? 'border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/10' : 'border-[#26BEEF] text-[#26BEEF]'">
              <Icon :name="openIndex === idx ? 'mdi:minus' : 'mdi:plus'" class="text-xl" />
            </div>
          </button>
          <div v-if="openIndex === idx" class="px-8 pb-8 text-base text-[#1a2b4b]/70 leading-normal border-t border-gray-100 pt-6 faq-content" v-html="item.answer">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const { locale } = useLocale()
const { loadCatalogue, transStatic } = useTranslations()
const { fetchFaq } = useHotel()

const STATIC_KEYS = ['retour', 'faqtitre']
const t = ref(Object.fromEntries(STATIC_KEYS.map(k => [k, k])))

const openIndex = ref(0)
const toggle = (idx) => { openIndex.value = openIndex.value === idx ? null : idx }

const faqs = ref([])
const loading = ref(true)

const formatText = (text) => {
  if (!text) return ''
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

<style scoped>
.font-serif {
  font-family: 'Playfair Display', serif;
}
</style>
