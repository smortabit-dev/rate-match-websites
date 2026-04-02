<template>
  <div class="min-h-screen bg-gray-50 pt-24 sm:pt-36">
    <!-- Content -->
    <div class="container mx-auto px-4 sm:px-6 py-10 sm:py-16 max-w-3xl">
      <h2 class="text-3xl sm:text-4xl font-serif text-gray-900 mb-10 text-center">{{ t.faq }}</h2>

      <div class="space-y-4">
        <div v-for="(item, idx) in faqs" :key="idx"
             class="bg-white border border-gray-200 overflow-hidden">
          <button @click="toggle(idx)"
                  class="w-full flex items-center justify-between px-6 py-5 text-left transition-colors hover:bg-gray-50">
            <span class="text-sm font-semibold text-gray-800 pr-4">{{ item.question }}</span>
            <Icon :name="openIndex === idx ? 'mdi:chevron-up' : 'mdi:chevron-down'"
                  class="text-lg text-amber-700 flex-shrink-0" />
          </button>
          <div v-if="openIndex === idx" class="px-6 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
            {{ item.answer }}
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

const STATIC_KEYS = ['retour', 'faq']
const t = ref(Object.fromEntries(STATIC_KEYS.map(k => [k, k])))

const openIndex = ref(null)
const toggle = (idx) => { openIndex.value = openIndex.value === idx ? null : idx }

const faqs = ref([
  {
    question: 'What are the check-in and check-out times?',
    answer: 'Check-in is from 3:00 PM and check-out is until 12:00 PM. Early check-in and late check-out may be available upon request, subject to availability.'
  },
  {
    question: 'Is parking available at the hotel?',
    answer: 'Yes, we offer on-site parking for our guests. Please contact the front desk for more details and availability.'
  },
  {
    question: 'Do you offer airport transfer services?',
    answer: 'Yes, we can arrange airport transfers for our guests. Please contact us in advance to schedule your pick-up.'
  },
  {
    question: 'Is breakfast included in the room rate?',
    answer: 'Breakfast inclusion depends on the room type and rate selected during booking. Please check the details of your reservation.'
  },
  {
    question: 'Can I cancel or modify my reservation?',
    answer: 'Cancellation and modification policies vary by rate type. Please refer to the terms of your booking confirmation or contact us directly.'
  },
  {
    question: 'Is Wi-Fi available?',
    answer: 'Yes, complimentary high-speed Wi-Fi is available throughout the hotel for all guests.'
  },
  {
    question: 'Do you accommodate special dietary requirements?',
    answer: 'Yes, our kitchen can accommodate various dietary needs including vegetarian, vegan, gluten-free, and allergy-specific requests. Please inform us in advance.'
  },
  {
    question: 'Are pets allowed?',
    answer: 'Please contact the hotel directly to inquire about our pet policy, as it may vary depending on room type and availability.'
  },
])

onMounted(async () => {
  const catalogue = await loadCatalogue(locale.value)
  const translated = {}
  for (const key of STATIC_KEYS) translated[key] = transStatic(key, catalogue)
  t.value = translated
})
</script>
