<template>
  <div class="w-full px-6 pb-8">
    <div class="max-w-4xl mx-auto border border-white/25 bg-black/40 backdrop-blur-md flex flex-col sm:flex-row items-stretch">

      <!-- DATES -->
      <div class="relative flex-1 border-b sm:border-b-0 sm:border-r border-white/20">
        <button
          @click="togglePanel('dates')"
          class="w-full flex items-center justify-between px-8 py-5 hover:bg-white/5 transition-colors text-left group"
        >
          <div>
            <p class="text-[9px] uppercase tracking-[0.3em] text-white/50 mb-1.5">{{ t.dates || 'Dates' }}</p>
            <p class="text-sm text-white font-light">
              {{ formattedDates }}
            </p>
          </div>
          <Icon name="mdi:chevron-down" class="text-white/40 text-lg ml-4 transition-transform"
            :class="openPanel === 'dates' ? 'rotate-180' : ''" />
        </button>

        <!-- Dates dropdown -->
        <transition name="t2-drop">
          <div v-if="openPanel === 'dates'"
            class="absolute bottom-full left-0 w-[340px] bg-[#111] border border-white/10 p-6 z-20 shadow-2xl">
            <div class="space-y-5">
              <div>
                <label class="block text-[9px] uppercase tracking-[0.25em] text-white/40 mb-2">{{ t.checkin || 'Check-in' }}</label>
                <input v-model="startDate" type="date"
                  class="w-full bg-transparent border-b border-white/20 py-2 text-white text-sm focus:outline-none focus:border-[#C9A96E] transition-colors" />
              </div>
              <div>
                <label class="block text-[9px] uppercase tracking-[0.25em] text-white/40 mb-2">{{ t.checkout || 'Check-out' }}</label>
                <input v-model="endDate" type="date"
                  class="w-full bg-transparent border-b border-white/20 py-2 text-white text-sm focus:outline-none focus:border-[#C9A96E] transition-colors" />
              </div>
              <button @click="openPanel = null"
                class="w-full py-2.5 border border-white/20 text-white/60 text-[10px] uppercase tracking-[0.2em] hover:border-white/50 hover:text-white transition-colors">
                {{ t.apply || 'Apply' }}
              </button>
            </div>
          </div>
        </transition>
      </div>

      <!-- GUESTS -->
      <div class="relative flex-1 border-b sm:border-b-0 sm:border-r border-white/20">
        <button
          @click="togglePanel('guests')"
          class="w-full flex items-center justify-between px-8 py-5 hover:bg-white/5 transition-colors text-left"
        >
          <div>
            <p class="text-[9px] uppercase tracking-[0.3em] text-white/50 mb-1.5">{{ t.guests || 'Guests' }}</p>
            <p class="text-sm text-white font-light">{{ guestSummary }}</p>
          </div>
          <Icon name="mdi:chevron-down" class="text-white/40 text-lg ml-4 transition-transform"
            :class="openPanel === 'guests' ? 'rotate-180' : ''" />
        </button>

        <!-- Guests dropdown -->
        <transition name="t2-drop">
          <div v-if="openPanel === 'guests'"
            class="absolute bottom-full left-0 w-[280px] bg-[#111] border border-white/10 p-6 z-20 shadow-2xl">
            <div class="space-y-5">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-white text-sm">{{ t.rooms || 'Rooms' }}</p>
                </div>
                <div class="flex items-center gap-4">
                  <button @click="rooms = Math.max(1, rooms - 1)"
                    class="w-7 h-7 border border-white/20 text-white/60 hover:text-white hover:border-white/50 transition-colors flex items-center justify-center text-lg leading-none">−</button>
                  <span class="text-white text-sm w-4 text-center">{{ rooms }}</span>
                  <button @click="rooms++"
                    class="w-7 h-7 border border-white/20 text-white/60 hover:text-white hover:border-white/50 transition-colors flex items-center justify-center text-lg leading-none">+</button>
                </div>
              </div>
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-white text-sm">{{ t.adults || 'Adults' }}</p>
                </div>
                <div class="flex items-center gap-4">
                  <button @click="adults = Math.max(1, adults - 1)"
                    class="w-7 h-7 border border-white/20 text-white/60 hover:text-white hover:border-white/50 transition-colors flex items-center justify-center text-lg leading-none">−</button>
                  <span class="text-white text-sm w-4 text-center">{{ adults }}</span>
                  <button @click="adults++"
                    class="w-7 h-7 border border-white/20 text-white/60 hover:text-white hover:border-white/50 transition-colors flex items-center justify-center text-lg leading-none">+</button>
                </div>
              </div>
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-white text-sm">{{ t.children || 'Children' }}</p>
                  <p class="text-white/30 text-[10px]">0–12</p>
                </div>
                <div class="flex items-center gap-4">
                  <button @click="children = Math.max(0, children - 1)"
                    class="w-7 h-7 border border-white/20 text-white/60 hover:text-white hover:border-white/50 transition-colors flex items-center justify-center text-lg leading-none">−</button>
                  <span class="text-white text-sm w-4 text-center">{{ children }}</span>
                  <button @click="children++"
                    class="w-7 h-7 border border-white/20 text-white/60 hover:text-white hover:border-white/50 transition-colors flex items-center justify-center text-lg leading-none">+</button>
                </div>
              </div>
              <button @click="openPanel = null"
                class="w-full py-2.5 border border-white/20 text-white/60 text-[10px] uppercase tracking-[0.2em] hover:border-white/50 hover:text-white transition-colors">
                {{ t.apply || 'Apply' }}
              </button>
            </div>
          </div>
        </transition>
      </div>

      <!-- PROMOTIONAL CODE -->
      <div class="flex-1 sm:border-r border-white/20">
        <div class="px-8 py-5">
          <p class="text-[9px] uppercase tracking-[0.3em] text-white/50 mb-1.5">{{ t.promoCode || 'Promotional Code' }}</p>
          <input v-model="promoCode" type="text"
            :placeholder="t.enterCode || 'Enter code'"
            class="w-full bg-transparent text-white text-sm font-light placeholder:text-white/30 focus:outline-none" />
        </div>
      </div>

      <!-- Search button -->
      <div class="flex items-stretch">
        <button @click="goToAvailibility"
          class="w-full sm:w-auto px-10 py-5 bg-white text-black text-[11px] uppercase tracking-[0.2em] font-medium hover:bg-[#f0f0f0] transition-colors whitespace-nowrap">
          {{ t.search || 'Search' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const { localePath, locale } = useLocale()

const { loadCatalogue, transStatic } = useTranslations()
const t = ref({})

const getDate = (offset) => {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  return d.toISOString().split('T')[0]
}

const startDate = ref(getDate(1))
const endDate   = ref(getDate(2))
const adults    = ref(2)
const children  = ref(0)
const rooms     = ref(1)
const promoCode = ref('')
const openPanel = ref(null)

const togglePanel = (name) => {
  openPanel.value = openPanel.value === name ? null : name
}

const formattedDates = computed(() => {
  const fmt = (d) => {
    if (!d) return '–'
    try { return new Date(d).toLocaleDateString(locale.value, { day: 'numeric', month: 'short' }) }
    catch { return d }
  }
  return `${fmt(startDate.value)} – ${fmt(endDate.value)}`
})

const guestSummary = computed(() => {
  const r = rooms.value
  const a = adults.value
  const c = children.value
  const roomLabel = r > 1 ? `${r} Rooms` : `${r} Room`
  const adultLabel = a > 1 ? `${a} Adults` : `${a} Adult`
  return c > 0 ? `${roomLabel}. ${adultLabel}. ${c} ${c > 1 ? 'Children' : 'Child'}` : `${roomLabel}. ${adultLabel}`
})

const goToAvailibility = () => {
  openPanel.value = null
  const params = new URLSearchParams({
    start_date: startDate.value,
    end_date:   endDate.value,
    adults:     String(adults.value),
    enfants:    String(children.value),
  })
  if (promoCode.value) params.set('promo', promoCode.value)
  navigateTo(`${localePath('/availibility')}?${params.toString()}`)
}

onMounted(async () => {
  const { loadCatalogue: lc, transStatic: ts } = useTranslations()
  const catalogue = await lc(locale.value)
  const KEYS = ['verifierladisponibilite', 'adultes', 'enfants', 'noschambres']
  const tr = {}
  for (const k of KEYS) tr[k] = ts(k, catalogue)
  t.value = {
    dates:    'Dates',
    checkin:  'Check-in',
    checkout: 'Check-out',
    guests:   'Guests',
    rooms:    tr.noschambres || 'Rooms',
    adults:   tr.adultes     || 'Adults',
    children: tr.enfants     || 'Children',
    promoCode: 'Promotional Code',
    enterCode: 'Enter code',
    search:   tr.verifierladisponibilite || 'Search',
    apply:    'Apply',
  }
})
</script>

<style scoped>
.t2-drop-enter-active, .t2-drop-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.t2-drop-enter-from, .t2-drop-leave-to { opacity: 0; transform: translateY(4px); }
</style>
