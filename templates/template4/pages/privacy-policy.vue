<template>
  <div class="template4-root min-h-screen bg-slate-50 pt-20">
    <!-- Return Bar -->
    <div class="bg-[#002B5B] w-full sticky top-0 z-20">
      <div class="container mx-auto px-6 py-4">
        <NuxtLink :to="localePath('/') + '#footer'" class="inline-flex items-center text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:text-blue-400 transition-colors">
          <Icon name="mdi:arrow-left" class="mr-3 text-lg" />
          {{ t.retour }}
        </NuxtLink>
      </div>
    </div>

    <!-- Content -->
    <div class="container mx-auto px-6 py-12 sm:py-20 max-w-4xl">
      <div class="text-center mb-16">
        <h1 class="section-title text-[#002B5B]">{{ t.politiquedeconfidentialite }}</h1>
      </div>
      
      <div v-if="t.confidentialite" 
           class="prose prose-slate max-w-none text-sm text-slate-600 leading-relaxed bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-sm"
           v-html="t.confidentialite"></div>
           
      <p class="text-xs text-slate-400 pt-12 text-center font-medium">Last updated: {{ new Date().getFullYear() }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const { locale, localePath } = useLocale()
const { loadCatalogue, transStatic } = useTranslations()
const { fetchHotelData } = useHotel()

const STATIC_KEYS = ['politiquedeconfidentialite', 'confidentialite', 'retour']
const t = ref(Object.fromEntries(STATIC_KEYS.map(k => [k, k])))

onMounted(async () => {
  const [catalogue, hotelData] = await Promise.all([
    loadCatalogue(locale.value),
    fetchHotelData()
  ])

  const etab = hotelData?.etablissment || hotelData?.etablissement || {}
  
  // Mapping parameters like the Twig code
  const params = {
    val1: etab.etablissementNom || '',
    val2: etab.etabAdresse || '',
    val3: etab.etabCodepost || '',
    val4: etab.etabVille || '',
    val5: etab.etabPays || '',
    val6: (Array.isArray(etab.etabMail) ? etab.etabMail[0] : etab.etabMail) || ''
  }

  const translated = {}
  for (const key of STATIC_KEYS) {
    if (key === 'confidentialite') {
      translated[key] = transStatic(key, catalogue, key, params)
    } else {
      translated[key] = transStatic(key, catalogue)
    }
  }
  t.value = translated
})
</script>

<style scoped>
.template4-root {
  font-family: 'Outfit', sans-serif;
}
.font-serif {
  font-family: 'Playfair Display', serif;
}
.section-title {
  @apply font-serif text-3xl sm:text-4xl font-bold mb-6;
}
</style>
