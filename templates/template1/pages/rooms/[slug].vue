<template>
  <div v-if="loading" class="min-h-screen flex items-center justify-center">
    <div class="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-700"></div>
  </div>

  <div v-else-if="room">
    <!-- Hero Gallery -->
    <section class="relative h-[50vh] sm:h-[60vh] lg:h-[90vh]">
      <div class="absolute inset-0">
        <transition name="fade" mode="out-in">
          <img :key="currentImageIndex" :src="room.images[currentImageIndex]" :alt="room.name"
            class="w-full h-full object-cover" />
        </transition>
        <div class="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/60"></div>
      </div>
      <!-- Content overlay -->
      <div class="relative h-full flex items-end pb-10 sm:pb-16 lg:pb-20 z-10">
        <div class="container mx-auto px-4 sm:px-6">
          <!-- Back to rooms button -->
          <div class="absolute top-5 sm:top-20 z-20">
            <NuxtLink :to="{ path: localePath('/'), hash: '#rooms' }"
              class="inline-flex items-center gap-2 text-white text-xs uppercase tracking-[0.15em] font-semibold bg-black/30 hover:bg-amber-700 backdrop-blur-sm px-4 py-2.5 transition-all duration-300">
              <Icon name="mdi:arrow-left" class="text-base" />
              {{ t.backtotherooms }}
            </NuxtLink>
          </div>
          <div v-if="room.category" class="flex items-center gap-3 mb-3">
            <div class="w-10 h-px bg-amber-400"></div>
            <span class="text-xs uppercase tracking-[0.2em] font-semibold text-amber-300">{{ room.category }}</span>
          </div>
          <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-white leading-tight mb-4">{{ room.name }}</h1>
          <div class="flex flex-wrap gap-3 sm:gap-6 text-white/80 text-xs sm:text-sm">
            <span class="flex items-center gap-1">
              <Icon name="mdi:ruler" class="text-amber-400" /> {{ room.size }} m²
            </span>
            <span class="flex items-center gap-1">
              <Icon name="mdi:account-multiple" class="text-amber-400" /> {{ room.guests }} {{ t.guests }}
            </span>
            <span class="flex items-center gap-1">
              <Icon name="mdi:bed" class="text-amber-400" /> {{ room.bedType }}
            </span>
            <span class="flex items-center gap-1">
              <Icon name="mdi:window-open" class="text-amber-400" /> {{ room.view }}
            </span>
          </div>
        </div>
      </div>
      <!-- Slide counter + Nav arrows (bottom-right) -->
      <div class="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 z-20 flex items-center gap-3 sm:gap-4">
        <button @click="prevImage"
            class="w-10 h-10 sm:w-12 sm:h-12 border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-gray-900 transition-all">
          <Icon name="mdi:chevron-left" class="text-lg sm:text-xl" />
        </button>
        <span class="text-white text-sm font-medium tracking-wider">
          <span class="text-xl sm:text-2xl font-serif">{{ String(currentImageIndex + 1).padStart(2, '0') }}</span>
          <span class="text-gray-400 mx-1 sm:mx-2">/</span>
          <span class="text-gray-400">{{ String(room.images.length).padStart(2, '0') }}</span>
        </span>
        <button @click="nextImage"
            class="w-10 h-10 sm:w-12 sm:h-12 border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-gray-900 transition-all">
          <Icon name="mdi:chevron-right" class="text-lg sm:text-xl" />
        </button>
      </div>
    </section>

    <!-- Breadcrumb -->
    <div class="bg-stone-50 border-b border-gray-200">
      <div class="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <nav class="flex items-center gap-2 text-xs uppercase tracking-[0.15em]">
          <NuxtLink :to="localePath('/')" class="text-gray-400 hover:text-amber-700 transition-colors">{{ t.accueil }}</NuxtLink>
          <Icon name="mdi:chevron-right" class="text-gray-300 text-sm" />
          <span class="text-gray-700 font-semibold">{{ room.name }}</span>
        </nav>
      </div>
    </div>

    <!-- Main Content -->
    <section class="py-12 sm:py-16 lg:py-24 bg-white">
      <div class="container mx-auto px-4 sm:px-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
          <!-- Left: Details -->
          <div class="lg:col-span-2 space-y-10 sm:space-y-16">
            <!-- Description -->
            <div>
              <p class="section-subtitle">{{ room.category }}</p>
              <h2 class="section-title mb-6">{{ room.name }}</h2>
              <div class="w-12 h-px bg-amber-700 mb-6"></div>
              <div class="text-gray-600 leading-relaxed text-sm sm:text-base space-y-4" v-html="room.description"></div>
            </div>
            <!-- Amenities -->
            <div v-if="room.features && room.features.length">
              <p class="section-subtitle">{{ t.nosservices }}</p>
              <h2 class="section-title mb-6">{{ t.roomamenities }}</h2>
              <div class="w-12 h-px bg-amber-700 mb-8"></div>
              <div class="grid grid-cols-2 lg:grid-cols-4">
                <div v-for="(feat, i) in room.features" :key="feat"
                     class="flex items-center justify-between px-4 py-3 border-b border-r border-gray-100">
                  <span class="text-sm" :class="i % 3 === 1 ? 'text-gray-600' : 'text-gray-600'">{{ feat }}</span>
                  <Icon :name="amenityIcon(feat)" class="text-lg flex-shrink-0 ml-3"
                        :class="i % 3 === 1 ? 'text-gray-400' : 'text-gray-400'" />
                </div>
              </div>
            </div>
            <!-- Policies -->
            <div class="bg-stone-50 p-5 sm:p-8 lg:p-10">
              <p class="section-subtitle">{{ t.informations }}</p>
              <h2 class="section-title mb-6">{{ t.policies }}</h2>
              <div class="w-12 h-px bg-amber-700 mb-8"></div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2">
                <div>
                  <Icon name="mdi:clock-outline" class="text-2xl text-amber-700 mb-2" />
                  <h3 class="text-xs uppercase tracking-[0.15em] font-semibold text-gray-800 mb-2">{{ t.checkin }} / {{ t.checkout }}</h3>
                  <p class="text-sm text-gray-600">{{ t.checkin }}: {{ hotelCheckIn }}</p>
                  <p class="text-sm text-gray-600">{{ t.checkout }}: {{ hotelCheckOut }}</p>
                </div>
                <div>
                  <Icon name="mdi:smoking-off" class="text-2xl text-amber-700 mb-2" />
                  <h3 class="text-xs uppercase tracking-[0.15em] font-semibold text-gray-800 mb-2">{{ t.smoking }}</h3>
                  <p class="text-sm text-gray-600">{{ smokingLabel }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Sticky sidebar -->
          <div class="lg:col-span-1">
            <div class="sticky top-24 space-y-6">
              <!-- Booking Form -->
              <div class="border border-gray-200 p-5 sm:p-6 relative" ref="bookingPanelRef">
                <div class="w-8 h-px bg-amber-700 mb-6"></div>

                <!-- Check-in -->
                <div class="mb-4">
                  <label class="block text-xs uppercase tracking-wider text-gray-500 mb-2">{{ t.checkin }}</label>
                  <div @click="openCalendar('checkin')"
                       class="cursor-pointer flex items-center justify-between border-b-2 pb-2 transition-colors"
                       :class="calFocus === 'checkin' ? 'border-teal-500' : 'border-gray-200 hover:border-gray-400'">
                    <span class="text-sm" :class="bookingForm.checkIn ? 'text-gray-800 font-medium' : 'text-gray-400'">
                      {{ bookingForm.checkIn ? calDisplayDate(bookingForm.checkIn) : 'Add date' }}
                    </span>
                    <Icon name="mdi:calendar-outline" class="text-gray-400 text-sm" />
                  </div>
                </div>

                <!-- Calendar dropdown (absolute overlay) -->
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
                    <div class="grid grid-cols-2 gap-3">
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

                    <!-- Adults / Children / Rooms -->
                    <div class="border-t border-gray-200 mt-4 pt-4 grid grid-cols-3 gap-3">
                      <div v-for="(item, key) in calCounters" :key="key" class="flex flex-col">
                        <span class="text-xs text-gray-500 mb-1.5">{{ item.label }}</span>
                        <div class="flex items-center justify-between border-b border-gray-200 pb-1.5">
                          <span class="text-sm font-semibold text-gray-800">{{ item.value }}</span>
                          <div class="flex flex-col gap-0.5">
                            <button @click.stop="item.value = Math.min(item.value + 1, item.max)"
                                    class="text-gray-400 hover:text-teal-500 text-[10px] leading-none">▲</button>
                            <button @click.stop="item.value = Math.max(item.value - 1, item.min)"
                                    class="text-gray-400 hover:text-teal-500 text-[10px] leading-none">▼</button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Night count + Done -->
                    <div class="flex items-center justify-between mt-4">
                      <span v-if="calNightCount > 0" class="text-sm font-semibold text-gray-700">
                        {{ calNightCount }} Night(s)
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
                <div class="mb-5">
                  <label class="block text-xs uppercase tracking-wider text-gray-500 mb-2">{{ t.checkout }}</label>
                  <div @click="openCalendar('checkout')"
                       class="cursor-pointer flex items-center justify-between border-b-2 pb-2 transition-colors"
                       :class="calFocus === 'checkout' ? 'border-teal-500' : 'border-gray-200 hover:border-gray-400'">
                    <span class="text-sm" :class="bookingForm.checkOut ? 'text-gray-800 font-medium' : 'text-gray-400'">
                      {{ bookingForm.checkOut ? calDisplayDate(bookingForm.checkOut) : 'Add date' }}
                    </span>
                    <Icon name="mdi:calendar-outline" class="text-gray-400 text-sm" />
                  </div>
                </div>

                <!-- Guests -->
                <div class="mb-6">
                  <label class="block text-xs uppercase tracking-wider text-gray-500 mb-2">{{ t.guests }}</label>
                  <select v-model="bookingForm.guests"
                          class="w-full border-b-2 border-gray-200 focus:border-amber-700 focus:outline-none py-2 text-sm bg-transparent">
                    <option v-for="n in (room.guests || 4)" :key="n" :value="n">{{ n }}</option>
                  </select>
                </div>

                <button @click="handleBooking" class="btn-primary w-full text-center">
                  {{ t.verifierladisponibilite }}
                </button>
              </div>
              <!-- Quick Info -->
              <div class="border border-gray-200 p-5 sm:p-6">
                <h3 class="text-xs uppercase tracking-[0.15em] font-semibold text-gray-800 mb-4">Quick Info</h3>
                <div class="w-8 h-px bg-amber-700 mb-4"></div>
                <ul class="space-y-3">
                  <li class="flex items-center gap-3 text-sm text-gray-600">
                    <Icon name="mdi:ruler" class="text-lg text-amber-700" /> {{ room.size }} m²
                  </li>
                  <li class="flex items-center gap-3 text-sm text-gray-600">
                    <Icon name="mdi:account-multiple" class="text-lg text-amber-700" /> {{ room.guests }} {{ t.guests }}
                  </li>
                  <li class="flex items-center gap-3 text-sm text-gray-600">
                    <Icon name="mdi:bed" class="text-lg text-amber-700" /> {{ room.bedType }}
                  </li>
                  <li class="flex items-center gap-3 text-sm text-gray-600">
                    <Icon name="mdi:window-open" class="text-lg text-amber-700" /> {{ room.view }}
                  </li>
                </ul>
              </div>
              <!-- Contact -->
              <div class="border border-gray-200 p-5 sm:p-6">
                <h3 class="text-xs uppercase tracking-[0.15em] font-semibold text-gray-800 mb-4">{{ t.contact }}</h3>
                <div class="w-8 h-px bg-amber-700 mb-4"></div>
                <a v-if="hotelInfo.phone" :href="`tel:${hotelInfo.phone}`"
                   class="flex items-center gap-2 text-sm text-amber-700 hover:text-amber-800 mb-2">
                  <Icon name="mdi:phone" /> {{ hotelInfo.phone }}
                </a>
                <a v-if="hotelInfo.emails" :href="`mailto:${hotelInfo.emails}`"
                   class="flex items-center gap-2 text-sm text-amber-700 hover:text-amber-800">
                  <Icon name="mdi:email" /> {{ hotelInfo.emails }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Room Gallery -->
    <section class="py-12 sm:py-16 lg:py-24 bg-stone-50">
      <div class="container mx-auto px-4 sm:px-6">
        <div class="text-center mb-10 sm:mb-12">
          <p class="section-subtitle">{{ t.gallery }}</p>
          <h2 class="section-title">{{ room.name }}</h2>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
          <div v-for="(image, index) in room.images" :key="index"
               @click="openLightbox(index)"
               class="relative aspect-square overflow-hidden cursor-pointer group">
            <img :src="image" :alt="`${room.name} ${index + 1}`"
                 class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
              <Icon name="mdi:magnify-plus-outline" class="text-white text-2xl sm:text-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Similar Rooms -->
    <section v-if="similarRooms.length" class="py-12 sm:py-16 lg:py-24 bg-white">
      <div class="container mx-auto px-4 sm:px-6">
        <div class="text-center mb-10 sm:mb-12">
          <p class="section-subtitle">{{ t.hebergements }}</p>
          <h2 class="section-title">{{ t.autreschambers }}</h2>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <NuxtLink v-for="sr in similarRooms" :key="sr.id"
              :to="localePath(`/rooms/${sr.id}`)"
              class="group">
            <div class="relative aspect-[3/4] overflow-hidden mb-4">
              <img :src="sr.image" :alt="sr.name"
                   class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div v-if="sr.category" class="absolute top-4 left-4">
                <span class="text-xs uppercase tracking-[0.15em] font-semibold text-white bg-black/40 px-3 py-1">{{ sr.category }}</span>
              </div>
            </div>
            <div class="w-8 h-px bg-gray-800 mb-3"></div>
            <h3 class="text-lg sm:text-xl font-serif mb-1 group-hover:text-amber-700 transition-colors">{{ sr.name }}</h3>
            <p class="text-gray-400 text-sm mb-2">{{ sr.size }}m² · {{ sr.guests }} {{ t.guests }}</p>
            <!-- <span class="text-lg font-serif text-amber-700">{{ sr.price }}€ <span class="text-xs text-gray-400 font-sans">/ {{ t.nuit }}</span></span> -->
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Lightbox -->
    <transition name="fade">
      <div v-if="lightboxOpen" @click="closeLightbox"
           class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
        <button @click="closeLightbox" class="absolute top-4 right-4 text-white text-3xl hover:text-amber-400 transition-colors">
          <Icon name="mdi:close" />
        </button>
        <button @click.stop="lightboxPrev" class="absolute left-2 sm:left-4 text-white text-3xl sm:text-4xl hover:text-amber-400 transition-colors">
          <Icon name="mdi:chevron-left" />
        </button>
        <img :src="room.images[lightboxIndex]" :alt="`${room.name} ${lightboxIndex + 1}`"
             class="max-w-full max-h-[90vh] object-contain" @click.stop />
        <button @click.stop="lightboxNext" class="absolute right-2 sm:right-4 text-white text-3xl sm:text-4xl hover:text-amber-400 transition-colors">
          <Icon name="mdi:chevron-right" />
        </button>
        <div class="absolute bottom-4 text-white text-sm">
          {{ lightboxIndex + 1 }} / {{ room.images.length }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, onUnmounted } from 'vue'

const route = useRoute()
const router = useRouter()
const { locale, localePath } = useLocale()
const { ETAB_ID } = useHotel()

const loading = ref(true)
const room = ref(null)
const similarRooms = ref([])
const hotelInfo = ref({ phone: '', emails: '' })
const hotelData = ref(null)
const currentImageIndex = ref(0)
const lightboxOpen = ref(false)
const lightboxIndex = ref(0)
const bookingForm = ref({ checkIn: '', checkOut: '', guests: '2' })

const etablissement = computed(() => hotelData.value?.etablissment || hotelData.value?.etablissement || {})
const hotelCheckIn = computed(() => etablissement.value?.pCheckIn || '15:00')
const hotelCheckOut = computed(() => etablissement.value?.pCheckOut || '12:00')
const smokingLabel = computed(() => room.value?.isFumeur ? t.value.chambrefumeur : t.value.interdictiondefumer)

// ── Calendar ─────────────────────────────────────────────────────────────────
const CAL_DAYS   = ['Mo','Tu','We','Th','Fr','Sa','Su']
const CAL_MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

const _today   = new Date()
const cal1Base = ref(new Date(_today.getFullYear(), _today.getMonth(), 1))

const cal1Year  = computed(() => cal1Base.value.getFullYear())
const cal1Month = computed(() => cal1Base.value.getMonth())
const cal2Year  = computed(() => {
  const d = new Date(cal1Base.value); d.setMonth(d.getMonth() + 1); return d.getFullYear()
})
const cal2Month = computed(() => {
  const d = new Date(cal1Base.value); d.setMonth(d.getMonth() + 1); return d.getMonth()
})

const calMonthName = (m) => CAL_MONTHS[m]

const prevMonth = () => {
  const d = new Date(cal1Base.value)
  d.setMonth(d.getMonth() - 1)
  const minDate = new Date(_today.getFullYear(), _today.getMonth(), 1)
  if (d >= minDate) cal1Base.value = d
}
const nextMonth = () => {
  const d = new Date(cal1Base.value); d.setMonth(d.getMonth() + 1); cal1Base.value = d
}

const getDaysInMonth = (year, month) => {
  const days = []
  const firstDay = new Date(year, month, 1).getDay()
  const offset   = firstDay === 0 ? 6 : firstDay - 1
  for (let i = 0; i < offset; i++) days.push(null)
  const total = new Date(year, month + 1, 0).getDate()
  for (let d = 1; d <= total; d++) days.push(new Date(year, month, d))
  return days
}

const hoverDate    = ref(null)
const calendarOpen = ref(false)
const calFocus     = ref(null)   // 'checkin' | 'checkout' | null
const bookingPanelRef = ref(null)

const calCounters = reactive({
  adults:   { label: 'Adult(s)',  value: 2, min: 1, max: 10 },
  children: { label: 'Children', value: 0, min: 0, max: 10 },
})

const calParseDate = (str) => str ? new Date(str + 'T00:00:00') : null
const calFormatDate = (d) =>
  `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
const calSameDay = (a, b) =>
  a && b && a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate()

const calDisplayDate = (str) => {
  if (!str) return ''
  const d = calParseDate(str)
  return `${CAL_MONTHS[d.getMonth()].slice(0,3)} ${d.getDate()}, ${d.getFullYear()}`
}

const openCalendar = (field) => {
  if (calFocus.value === field && calendarOpen.value) {
    calendarOpen.value = false; calFocus.value = null; return
  }
  calFocus.value     = field
  calendarOpen.value = true
  if (field === 'checkin') {
    bookingForm.value.checkIn  = ''
    bookingForm.value.checkOut = ''
  }
}

const calSelectDate = (day) => {
  if (calFocus.value === 'checkin') {
    bookingForm.value.checkIn  = calFormatDate(day)
    bookingForm.value.checkOut = ''
    calFocus.value = 'checkout'
  } else {
    const ci = calParseDate(bookingForm.value.checkIn)
    if (!ci || day <= ci) {
      bookingForm.value.checkIn  = calFormatDate(day)
      bookingForm.value.checkOut = ''
      calFocus.value = 'checkout'
    } else {
      bookingForm.value.checkOut = calFormatDate(day)
      calFocus.value = null
    }
  }
}

const handleCalClickOutside = (e) => {
  if (calendarOpen.value && bookingPanelRef.value && !bookingPanelRef.value.contains(e.target)) {
    calendarOpen.value = false
    calFocus.value = null
  }
}

const calNightCount = computed(() => {
  const ci = calParseDate(bookingForm.value.checkIn)
  const co = calParseDate(bookingForm.value.checkOut)
  if (!ci || !co) return 0
  return Math.round((co - ci) / 864e5)
})

const calIsPast = (day) =>
  day < new Date(_today.getFullYear(), _today.getMonth(), _today.getDate())

const calIsStart = (day) => calSameDay(day, calParseDate(bookingForm.value.checkIn))
const calIsEnd   = (day) => calSameDay(day, calParseDate(bookingForm.value.checkOut))
const calInRange = (day) => {
  if (!day) return false
  const ci = calParseDate(bookingForm.value.checkIn)
  const co = calParseDate(bookingForm.value.checkOut) || hoverDate.value
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
  if (calIsPast(day))   return 'text-gray-300 cursor-not-allowed'
  const isWknd = day.getDay() === 0 || day.getDay() === 6
  return isWknd
    ? 'text-orange-500 hover:bg-teal-50 rounded-full cursor-pointer'
    : 'text-gray-700 hover:bg-teal-50 rounded-full cursor-pointer'
}
// ─────────────────────────────────────────────────────────────────────────────

const STATIC_KEYS = [
  'accueil', 'verifierladisponibilite', 'voirlesdetails', 'nuit', 'hebergements', 'gallery', 'contact', 'nosservices', 'checkin', 'checkout', 'nonfumeur', 'chambrefumeur', 'interdictiondefumer', 'petsallowed', 'backtotherooms',
]
const t = ref({
  ...Object.fromEntries(STATIC_KEYS.map(k => [k, k])),
  guests: 'Guests',
  keyfeatures: 'Key Features',
  roomamenities: 'Room Amenities',
  equipements: 'Equipements',
  informations: 'Informations',
  policies: 'Policies',
  cancellation: 'Cancellation',
  smoking: 'Smoking',
  pets: 'Pets',
  from: 'From',
  autreschambers: 'Other Rooms',
})

const amenityIcon = (feat) => {
  const f = feat.toLowerCase()
  if (f.includes('wifi') || f.includes('wi-fi'))                return 'mdi:wifi'
  if (f.includes('clim') || f.includes('air') || f.includes('a/c')) return 'mdi:air-conditioner'
  if (f.includes('bain') || f.includes('douche') || f.includes('shower')) return 'mdi:shower'
  if (f.includes('télé') || f.includes('tv'))                   return 'mdi:television'
  if (f.includes('minibar') || f.includes('mini-bar'))          return 'mdi:fridge-outline'
  if (f.includes('coffre') || f.includes('safe'))               return 'mdi:safe'
  if (f.includes('terrasse') || f.includes('balcon') || f.includes('terrace') || f.includes('patio')) return 'mdi:balcony'
  if (f.includes('piscine') || f.includes('pool'))              return 'mdi:pool'
  if (f.includes('thé') || f.includes('café') || f.includes('kettle') || f.includes('coffee')) return 'mdi:coffee'
  if (f.includes('cheveux') || f.includes('sèche') || f.includes('hairdryer')) return 'mdi:hair-dryer'
  if (f.includes('parking'))                                    return 'mdi:parking'
  if (f.includes('fum') || f.includes('smok'))                  return 'mdi:smoking-off'
  if (f.includes('vue') || f.includes('view'))                  return 'mdi:image-filter-hdr'
  if (f.includes('jardin') || f.includes('garden'))             return 'mdi:flower'
  if (f.includes('chauffage') || f.includes('heating'))         return 'mdi:radiator'
  if (f.includes('linen') || f.includes('linge') || f.includes('towel') || f.includes('serviette')) return 'mdi:paper-roll-outline'
  if (f.includes('toilet') || f.includes('wc'))                 return 'mdi:toilet'
  if (f.includes('wardrobe') || f.includes('closet') || f.includes('armoire')) return 'mdi:wardrobe-outline'
  if (f.includes('alarm') || f.includes('réveil'))              return 'mdi:alarm'
  if (f.includes('socket') || f.includes('prise'))              return 'mdi:power-socket-eu'
  return 'mdi:check-circle-outline'
}

// Image navigation
const nextImage = () => {
  if (room.value) currentImageIndex.value = (currentImageIndex.value + 1) % room.value.images.length
}
const prevImage = () => {
  if (room.value) currentImageIndex.value = (currentImageIndex.value - 1 + room.value.images.length) % room.value.images.length
}

// Lightbox
const openLightbox = (idx) => { lightboxIndex.value = idx; lightboxOpen.value = true; document.body.style.overflow = 'hidden' }
const closeLightbox = () => { lightboxOpen.value = false; document.body.style.overflow = 'auto' }
const lightboxNext = () => { if (room.value) lightboxIndex.value = (lightboxIndex.value + 1) % room.value.images.length }
const lightboxPrev = () => { if (room.value) lightboxIndex.value = (lightboxIndex.value - 1 + room.value.images.length) % room.value.images.length }

const handleKeydown = (e) => {
  if (!lightboxOpen.value) return
  if (e.key === 'Escape') closeLightbox()
  if (e.key === 'ArrowRight') lightboxNext()
  if (e.key === 'ArrowLeft') lightboxPrev()
}

const handleBooking = () => {
  router.push({
    path: localePath('/availibility'),
    query: {
      idetab: ETAB_ID,
      adults:     calCounters.adults.value,
      enfants:    calCounters.children.value,
      start_date: bookingForm.value.checkIn  || '',
      end_date:   bookingForm.value.checkOut || '',
    }
  })
}

onMounted(async () => {
  window.addEventListener('keydown', handleKeydown)
  document.addEventListener('mousedown', handleCalClickOutside)

  const { fetchHotelData, fetchHotelInfo, fetchRooms } = useHotel()
  
  const { loadCatalogue, transStatic } = useTranslations()

  const [allRooms, data, info, catalogue] = await Promise.all([
    fetchRooms(locale.value),
    fetchHotelData(),
    fetchHotelInfo(),
    loadCatalogue(locale.value),
  ])

  hotelData.value = data
  hotelInfo.value = info

  // Translate static keys
  const translated = { ...t.value }
  for (const key of STATIC_KEYS) translated[key] = transStatic(key, catalogue)
  t.value = translated

  // Find room by id
  const slug = route.params.slug
  const found = allRooms.find(r => String(r.id) === String(slug))
  if (found) {
    room.value = found
    similarRooms.value = allRooms.filter(r => r.id !== found.id).slice(0, 3)
  }

  loading.value = false
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('mousedown', handleCalClickOutside)
  document.body.style.overflow = 'auto'
})

useHead({
  title: computed(() => room.value ? `${room.value.name}` : 'Room'),
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.cal-slide-enter-active, .cal-slide-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.cal-slide-enter-from, .cal-slide-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
