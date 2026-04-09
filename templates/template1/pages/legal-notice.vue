<template>
  <div class="min-h-screen bg-gray-50 pt-24 sm:pt-36">
    <!-- Content -->
    <div class="container mx-auto px-4 sm:px-6 py-10 sm:py-16 max-w-3xl">
      <h2 class="text-3xl sm:text-4xl font-serif text-gray-900 mb-10 text-center">{{ t.legalnotice }}</h2>

      <div class="prose prose-gray max-w-none text-sm text-gray-600 leading-relaxed" v-html="t.legal">
      </div>
      
      <p class="text-xs text-gray-400 pt-8 border-t border-gray-100 mt-8">Last updated: {{ new Date().getFullYear() }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const { locale } = useLocale()
const { loadCatalogue, transStatic } = useTranslations()

const STATIC_KEYS = ['retour', 'legalnotice', 'legal']
const t = ref(Object.fromEntries(STATIC_KEYS.map(k => [k, k])))

onMounted(async () => {
  const catalogue = await loadCatalogue(locale.value)
  
  const translated = {}
  for (const key of STATIC_KEYS) translated[key] = transStatic(key, catalogue)
  t.value = translated
})
</script>
