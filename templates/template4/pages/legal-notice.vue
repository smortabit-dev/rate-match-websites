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
        <h1 class="section-title text-[#002B5B]">{{ t.conditionsgenerales }}</h1>
      </div>

      <!-- 1. Check-in / Check-out -->
      <div v-if="checkTimes.in || checkTimes.out" class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
        <div v-if="checkTimes.in" class="bg-white p-8 border border-slate-200 rounded-xl shadow-sm flex flex-col items-center text-center">
          <div class="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <Icon name="mdi:login" class="text-2xl text-blue-600" />
          </div>
          <span class="text-[11px] uppercase tracking-widest text-blue-400 font-bold mb-2">{{ t.arrivee }}</span>
          <p class="text-sm text-slate-500 italic mb-1">{{ t.apartirde }}</p>
          <p class="text-2xl font-serif text-[#002B5B] font-bold">{{ checkTimes.in }}h</p>
        </div>
        <div v-if="checkTimes.out" class="bg-white p-8 border border-slate-200 rounded-xl shadow-sm flex flex-col items-center text-center">
          <div class="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <Icon name="mdi:logout" class="text-2xl text-blue-600" />
          </div>
          <span class="text-[11px] uppercase tracking-widest text-blue-400 font-bold mb-2">{{ t.depart }}</span>
          <p class="text-sm text-slate-500 italic mb-1">{{ t.jusqua }}</p>
          <p class="text-2xl font-serif text-[#002B5B] font-bold">{{ checkTimes.out }}h</p>
        </div>
      </div>

      <!-- 2. Good To Know Blocks -->
      <div class="space-y-8 mb-12">
        <div v-for="block in goodToKnowBlocks" :key="block.id" class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div class="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-4">
            <Icon :name="block.icon" class="text-2xl text-blue-600" />
            <h3 class="font-serif text-xl text-[#002B5B] font-bold">{{ block.title }}</h3>
          </div>
          <div class="px-8 py-8 prose prose-slate max-w-none text-sm text-slate-600 leading-relaxed">
            <div v-for="(item, idx) in block.items" :key="idx" v-html="item"></div>
          </div>
        </div>
      </div>

      <!-- 3. Payment Methods -->
      <div v-if="cards.length" class="bg-white border border-slate-200 rounded-xl shadow-sm mb-12">
        <div class="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-4">
          <Icon name="mdi:credit-card-outline" class="text-2xl text-blue-600" />
          <h3 class="font-serif text-xl text-[#002B5B] font-bold">{{ t.typedecartesdepaiement }}</h3>
        </div>
        <div class="px-8 py-8 flex flex-wrap gap-6 items-center">
          <div v-for="card in cards" :key="card" class="h-8 grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100">
            <Icon :name="getCardIcon(card)" class="text-4xl" />
          </div>
        </div>
      </div>

      <!-- 4. Fine Print -->
      <div v-if="finePrint" class="bg-blue-50 border border-blue-100 rounded-xl p-8 sm:p-12">
        <div class="flex items-center gap-4 mb-6">
          <Icon name="mdi:information-outline" class="text-2xl text-blue-600" />
          <h3 class="font-serif text-xl text-[#002B5B] font-bold">{{ t.fineprint }}</h3>
        </div>
        <div class="text-sm text-slate-600 leading-relaxed whitespace-pre-line" v-html="finePrint"></div>
      </div>

      <p class="text-xs text-slate-400 pt-12 text-center">Last updated: {{ new Date().getFullYear() }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const { locale, localePath } = useLocale()
const { loadCatalogue, transStatic, transGoodToKnowType, transToKnow } = useTranslations()
const { fetchHotelData } = useHotel()

const STATIC_KEYS = [
  'retour', 'conditionsgenerales',
  'arrivee', 'apartirde', 'depart', 'jusqua',
  'typedecartesdepaiement', 'fineprint'
]

const FALLBACKS = {
  retour: 'Retour',
  conditionsgenerales: 'Conditions Générales',
  arrivee: 'Arrivée',
  apartirde: 'À partir de',
  depart: 'Départ',
  jusqua: 'Jusqu\'à',
  typedecartesdepaiement: 'Types de cartes de paiement',
  fineprint: 'À savoir'
}

const t = ref({ ...FALLBACKS })
const checkTimes = ref({ in: null, out: null })
const goodToKnowBlocks = ref([])
const cards = ref([])
const finePrint = ref('')

const getCardIcon = (code) => {
  const map = {
    'visa': 'simple-icons:visa',
    'mastercard': 'simple-icons:mastercard',
    'amex': 'simple-icons:americanexpress',
    'jcb': 'simple-icons:jcb',
    'maestro': 'simple-icons:maestro',
    'diners': 'simple-icons:dinersclub',
    'discover': 'simple-icons:discover'
  }
  return map[code.toLowerCase()] || 'mdi:credit-card-outline'
}

onMounted(async () => {
  const [catalogue, hotelData] = await Promise.all([
    loadCatalogue(locale.value),
    fetchHotelData()
  ])

  // 1. Static translations
  const translated = {}
  for (const key of STATIC_KEYS) {
    translated[key] = transStatic(key, catalogue, FALLBACKS[key])
  }
  t.value = translated

  if (hotelData) {
    const etab = hotelData.etablissment || hotelData.etablissement
    const siteCache = hotelData.InfoSiteCache || hotelData.infoSiteCache || hotelData

    // 2. Check-in/out
    checkTimes.value = {
      in: etab?.pCheckIn || null,
      out: etab?.pCheckOut || null
    }

    // 3. Good to know
    if (siteCache?.goodtoknow) {
      const gList = Array.isArray(siteCache.goodtoknow) ? siteCache.goodtoknow : Object.values(siteCache.goodtoknow)
      
      goodToKnowBlocks.value = gList
        .filter(g => g.gtntCode)
        .map(g => {
          const desc = transGoodToKnowType(g.gtntId, 'description', catalogue, '')
          return {
            id: g.gtntId,
            title: transGoodToKnowType(g.gtntId, 'titer', catalogue, 'Information'),
            icon: 'mdi:information-outline',
            items: desc ? [desc] : []
          }
        })
    }

    // 4. Cards
    if (etab?.txCard) {
      cards.value = Array.isArray(etab.txCard) ? etab.txCard : Object.values(etab.txCard)
    }

    // 5. Fine print
    if (siteCache?.fineprinte) {
      finePrint.value = transToKnow(siteCache.fineprinte, 'description', catalogue, '')
    }
  }
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
