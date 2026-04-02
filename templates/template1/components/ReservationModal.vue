<template>
  <transition name="slide-panel">
    <div class="fixed inset-0 z-[60] flex justify-end bg-black/60" @click.self="$emit('close')">
      <div class="bg-white w-full max-w-lg h-full overflow-y-auto p-5 sm:p-8 relative shadow-2xl">
        <button @click="$emit('close')" class="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors">
          <Icon name="mdi:close" class="text-2xl" />
        </button>

        <h3 class="text-2xl font-serif mb-8">{{ t.passerunereservation }}</h3>

        <div ref="calPanelRef" class="relative space-y-5">
          <!-- Check-in -->
          <div>
            <label class="block text-xs uppercase tracking-wider text-gray-500 mb-2">{{ t.checkin }}</label>
            <div @click="openCalendar('checkin')"
                 class="cursor-pointer flex items-center justify-between border-b-2 pb-2 transition-colors"
                 :class="calFocus === 'checkin' ? 'border-teal-500' : 'border-gray-200 hover:border-gray-400'">
              <span class="text-sm" :class="startDate ? 'text-gray-800 font-medium' : 'text-gray-400'">
                {{ startDate ? calDisplayDate(startDate) : 'Add date' }}
              </span>
              <Icon name="mdi:calendar-outline" class="text-gray-400 text-sm" />
            </div>
          </div>

          <!-- Calendar dropdown -->
          <transition name="cal-slide">
            <div v-if="calendarOpen"
                 @click.stop
                 class="absolute left-0 right-0 z-50 bg-white border border-gray-200 shadow-2xl p-4">
              <!-- Month navigation -->
              <div class="flex items-center mb-4">
                <button @click.stop="prevMonth" class="p-1.5 text-gray-400 hover:text-teal-500 transition-colors flex-shrink-0">
                  <Icon name="mdi:chevron-left" class="text-xl" />
                </button>
                <div class="flex flex-1 justify-around">
                  <div class="text-center">
                    <span class="text-sm font-bold text-gray-800">{{ calMonthName(cal1Month) }}</span>
                    <span class="text-sm font-bold text-teal-500 ml-1">{{ cal1Year }}</span>
                  </div>
                  <div class="text-center">
                    <span class="text-sm font-bold text-gray-800">{{ calMonthName(cal2Month) }}</span>
                    <span class="text-sm font-bold text-teal-500 ml-1">{{ cal2Year }}</span>
                  </div>
                </div>
                <button @click.stop="nextMonth" class="p-1.5 text-teal-500 hover:text-teal-600 transition-colors flex-shrink-0">
                  <Icon name="mdi:chevron-right" class="text-xl" />
                </button>
              </div>

              <!-- Two calendars side by side -->
              <div class="grid grid-cols-2 gap-4">
                <!-- Month 1 -->
                <div>
                  <div class="grid grid-cols-7 mb-1">
                    <div v-for="d in CAL_DAYS" :key="d" class="text-center text-[10px] text-gray-400 py-1">{{ d }}</div>
                  </div>
                  <div class="grid grid-cols-7">
                    <template v-for="(day, i) in getDaysInMonth(cal1Year, cal1Month)" :key="'m1-'+i">
                      <div :class="dayBgClass(day)">
                        <button v-if="day"
                                @click.stop="!calIsPast(day) && calSelectDate(day)"
                                @mouseenter="!calIsPast(day) && (hoverDate = day)"
                                @mouseleave="hoverDate = null"
                                :disabled="calIsPast(day)"
                                :class="dayBtnClass(day)"
                                class="w-full aspect-square text-xs flex items-center justify-center transition-colors">
                          {{ day.getDate() }}
                        </button>
                        <div v-else class="w-full aspect-square"></div>
                      </div>
                    </template>
                  </div>
                </div>
                <!-- Month 2 -->
                <div>
                  <div class="grid grid-cols-7 mb-1">
                    <div v-for="d in CAL_DAYS" :key="d" class="text-center text-[10px] text-gray-400 py-1">{{ d }}</div>
                  </div>
                  <div class="grid grid-cols-7">
                    <template v-for="(day, i) in getDaysInMonth(cal2Year, cal2Month)" :key="'m2-'+i">
                      <div :class="dayBgClass(day)">
                        <button v-if="day"
                                @click.stop="!calIsPast(day) && calSelectDate(day)"
                                @mouseenter="!calIsPast(day) && (hoverDate = day)"
                                @mouseleave="hoverDate = null"
                                :disabled="calIsPast(day)"
                                :class="dayBtnClass(day)"
                                class="w-full aspect-square text-xs flex items-center justify-center transition-colors">
                          {{ day.getDate() }}
                        </button>
                        <div v-else class="w-full aspect-square"></div>
                      </div>
                    </template>
                  </div>
                </div>
              </div>

              <!-- Night count + Done -->
              <div class="flex items-center justify-between mt-4 border-t border-gray-100 pt-4">
                <span v-if="nightCount > 0" class="text-sm font-semibold text-gray-700">
                  {{ nightCount }} Night(s)
                </span>
                <span v-else class="text-xs text-gray-400">Select dates</span>
                <button @click.stop="calendarOpen = false; calFocus = null"
                        class="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white text-xs font-semibold px-4 py-2.5 transition-colors">
                  Done <Icon name="mdi:arrow-right" class="text-sm" />
                </button>
              </div>
            </div>
          </transition>

          <!-- Check-out -->
          <div>
            <label class="block text-xs uppercase tracking-wider text-gray-500 mb-2">{{ t.checkout }}</label>
            <div @click="openCalendar('checkout')"
                 class="cursor-pointer flex items-center justify-between border-b-2 pb-2 transition-colors"
                 :class="calFocus === 'checkout' ? 'border-teal-500' : 'border-gray-200 hover:border-gray-400'">
              <span class="text-sm" :class="endDate ? 'text-gray-800 font-medium' : 'text-gray-400'">
                {{ endDate ? calDisplayDate(endDate) : 'Add date' }}
              </span>
              <Icon name="mdi:calendar-outline" class="text-gray-400 text-sm" />
            </div>
          </div>

          <!-- Adults / Children -->
          <div class="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label class="block text-xs uppercase tracking-wider text-gray-500 mb-2">{{ t.adultes }}</label>
              <div class="flex items-center justify-between border-b-2 border-gray-200 pb-2">
                <span class="text-sm font-semibold text-gray-800">{{ adults }}</span>
                <div class="flex flex-col gap-0.5">
                  <button @click="adults = Math.min(adults + 1, 10)" class="text-gray-400 hover:text-teal-500 text-[10px] leading-none">▲</button>
                  <button @click="adults = Math.max(adults - 1, 1)"  class="text-gray-400 hover:text-teal-500 text-[10px] leading-none">▼</button>
                </div>
              </div>
            </div>
            <div>
              <label class="block text-xs uppercase tracking-wider text-gray-500 mb-2">{{ t.enfants }}</label>
              <div class="flex items-center justify-between border-b-2 border-gray-200 pb-2">
                <span class="text-sm font-semibold text-gray-800">{{ childrenCount }}</span>
                <div class="flex flex-col gap-0.5">
                  <button @click="childrenCount = Math.min(childrenCount + 1, 10)" class="text-gray-400 hover:text-teal-500 text-[10px] leading-none">▲</button>
                  <button @click="childrenCount = Math.max(childrenCount - 1, 0)"  class="text-gray-400 hover:text-teal-500 text-[10px] leading-none">▼</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Submit -->
          <button @click="goToCheckprice"
                  class="w-full py-4 bg-amber-700 text-white text-xs uppercase tracking-[0.15em] font-semibold hover:bg-amber-800 transition-colors mt-4">
            {{ t.verifierladisponibilite }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const emit = defineEmits(['close'])

const router = useRouter()
const { locale, localePath } = useLocale()
const { loadCatalogue, transStatic } = useTranslations()
const { ETAB_ID } = useHotel()

// ── Calendar ──────────────────────────────────────────────────────────────────
const CAL_DAYS   = ['Mo','Tu','We','Th','Fr','Sa','Su']
const CAL_MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

const _today   = new Date()
const cal1Base = ref(new Date(_today.getFullYear(), _today.getMonth(), 1))

const cal1Year  = computed(() => cal1Base.value.getFullYear())
const cal1Month = computed(() => cal1Base.value.getMonth())
const cal2Year  = computed(() => { const d = new Date(cal1Base.value); d.setMonth(d.getMonth() + 1); return d.getFullYear() })
const cal2Month = computed(() => { const d = new Date(cal1Base.value); d.setMonth(d.getMonth() + 1); return d.getMonth() })

const calMonthName = (m) => CAL_MONTHS[m]

const prevMonth = () => {
  const d = new Date(cal1Base.value); d.setMonth(d.getMonth() - 1)
  if (d >= new Date(_today.getFullYear(), _today.getMonth(), 1)) cal1Base.value = d
}
const nextMonth = () => { const d = new Date(cal1Base.value); d.setMonth(d.getMonth() + 1); cal1Base.value = d }

const getDaysInMonth = (year, month) => {
  const days = [], firstDay = new Date(year, month, 1).getDay()
  const offset = firstDay === 0 ? 6 : firstDay - 1
  for (let i = 0; i < offset; i++) days.push(null)
  for (let d = 1; d <= new Date(year, month + 1, 0).getDate(); d++) days.push(new Date(year, month, d))
  return days
}

const hoverDate    = ref(null)
const calendarOpen = ref(false)
const calFocus     = ref(null)
const calPanelRef  = ref(null)

const calParseDate  = (str) => str ? new Date(str + 'T00:00:00') : null
const calFormatDate = (d)   => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
const calSameDay    = (a, b) => a && b && a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate()
const calDisplayDate = (str) => { if (!str) return ''; const d = calParseDate(str); return `${CAL_MONTHS[d.getMonth()].slice(0,3)} ${d.getDate()}, ${d.getFullYear()}` }

const calIsPast  = (day) => day < new Date(_today.getFullYear(), _today.getMonth(), _today.getDate())
const calIsStart = (day) => calSameDay(day, calParseDate(startDate.value))
const calIsEnd   = (day) => calSameDay(day, calParseDate(endDate.value))
const calInRange = (day) => {
  if (!day) return false
  const ci = calParseDate(startDate.value), co = calParseDate(endDate.value) || hoverDate.value
  if (!ci || !co) return false
  const [s, e] = ci < co ? [ci, co] : [co, ci]
  return day > s && day < e
}

const dayBgClass = (day) => {
  if (!day) return ''
  if (calIsStart(day)) return 'bg-gradient-to-r from-transparent to-teal-100'
  if (calIsEnd(day))   return 'bg-gradient-to-l from-transparent to-teal-100'
  if (calInRange(day)) return 'bg-teal-100'
  return ''
}
const dayBtnClass = (day) => {
  if (!day) return ''
  if (calIsStart(day) || calIsEnd(day)) return 'bg-teal-500 text-white rounded-full font-semibold'
  if (calIsPast(day)) return 'text-gray-300 cursor-not-allowed'
  return (day.getDay() === 0 || day.getDay() === 6)
    ? 'text-orange-500 hover:bg-teal-50 rounded-full cursor-pointer'
    : 'text-gray-700 hover:bg-teal-50 rounded-full cursor-pointer'
}

const openCalendar = (field) => {
  if (calFocus.value === field && calendarOpen.value) { calendarOpen.value = false; calFocus.value = null; return }
  calFocus.value = field; calendarOpen.value = true
  if (field === 'checkin') { startDate.value = ''; endDate.value = '' }
}

const calSelectDate = (day) => {
  if (calFocus.value === 'checkin') {
    startDate.value = calFormatDate(day); endDate.value = ''; calFocus.value = 'checkout'
  } else {
    const ci = calParseDate(startDate.value)
    if (!ci || day <= ci) { startDate.value = calFormatDate(day); endDate.value = ''; calFocus.value = 'checkout' }
    else { endDate.value = calFormatDate(day); calFocus.value = null }
  }
}

const nightCount = computed(() => {
  const ci = calParseDate(startDate.value), co = calParseDate(endDate.value)
  return ci && co ? Math.round((co - ci) / 864e5) : 0
})

const handleClickOutside = (e) => {
  if (calendarOpen.value && calPanelRef.value && !calPanelRef.value.contains(e.target)) {
    calendarOpen.value = false; calFocus.value = null
  }
}
// ─────────────────────────────────────────────────────────────────────────────

// Form state
const todayStr = _today.toISOString().split('T')[0]
const startDate     = ref(todayStr)
const endDate       = ref((() => { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().split('T')[0] })())
const adults        = ref(2)
const childrenCount = ref(0)

// Translations
const STATIC_KEYS = ['passerunereservation', 'checkin', 'checkout', 'adultes', 'enfants', 'verifierladisponibilite']
const t = ref(Object.fromEntries(STATIC_KEYS.map(k => [k, k])))

function goToCheckprice() {
  emit('close')
  document.body.style.overflow = 'auto'
  router.push({
    path: localePath('/availibility'),
    query: {
      idetab: ETAB_ID,
      adults:     adults.value,
      enfants:    childrenCount.value,
      start_date: startDate.value,
      end_date:   endDate.value,
    }
  })
}

onMounted(async () => {
  document.addEventListener('mousedown', handleClickOutside)
  const catalogue = await loadCatalogue(locale.value)
  const translated = {}
  for (const key of STATIC_KEYS) translated[key] = transStatic(key, catalogue)
  t.value = translated
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>

<style scoped>
.slide-panel-enter-active, .slide-panel-leave-active { transition: opacity 0.3s ease; }
.slide-panel-enter-active > :last-child, .slide-panel-leave-active > :last-child { transition: transform 0.3s ease; }
.slide-panel-enter-from, .slide-panel-leave-to { opacity: 0; }
.slide-panel-enter-from > :last-child, .slide-panel-leave-to > :last-child { transform: translateX(100%); }

.cal-slide-enter-active, .cal-slide-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.cal-slide-enter-from, .cal-slide-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
