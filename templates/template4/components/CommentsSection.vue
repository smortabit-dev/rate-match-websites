<template>
  <section id="testimonials" class="py-24 bg-[#f9f7f4] overflow-hidden">
    <div class="text-center mb-12 px-6">
      <h2 class="text-5xl md:text-6xl font-serif font-bold text-[#002B5B] mb-2">Comments</h2>
      <p class="text-[#56bfe2] font-semibold text-xs tracking-[0.2em] uppercase">GUESTS</p>
    </div>

    <!-- Filters -->
    <div class="flex justify-center flex-wrap gap-4 md:gap-8 mb-20 text-sm font-semibold tracking-wider px-6">
      <button @click="activeSource = 'Booking.com'" 
              class="relative pb-2 transition-colors uppercase"
              :class="activeSource === 'Booking.com' ? 'text-[#002B5B]' : 'text-gray-400 hover:text-[#002B5B]'">
        Comments By Booking.com
        <div v-show="activeSource === 'Booking.com'" class="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D4AF37]"></div>
      </button>
      <div class="hidden md:block w-1.5 h-1.5 rounded-full bg-blue-900/20 mt-2"></div>
      <button @click="activeSource = 'TripAdvisor'" 
              class="relative pb-2 transition-colors uppercase"
              :class="activeSource === 'TripAdvisor' ? 'text-[#002B5B]' : 'text-gray-400 hover:text-[#002B5B]'">
        Comments By TripAdvisor.com
        <div v-show="activeSource === 'TripAdvisor'" class="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D4AF37]"></div>
      </button>
    </div>

    <div class="relative">
      <!-- Dark Blue Block on the left -->
      <div class="absolute left-0 top-0 bottom-0 w-[80%] md:w-[350px] bg-[#1a2b4b] z-10 hidden md:flex flex-col justify-center items-center px-10">
        <div class="flex flex-col items-center gap-10">
          <div class="flex flex-col gap-6">
            <button @click="next" class="w-16 h-16 rounded-full border border-white flex items-center justify-center text-white hover:bg-white hover:text-[#1a2b4b] transition-all duration-300">
              <Icon name="mdi:arrow-right" class="text-2xl" />
            </button>
            <button @click="prev" class="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center text-white/30 hover:border-white hover:text-white transition-all duration-300">
              <Icon name="mdi:arrow-left" class="text-2xl" />
            </button>
          </div>
          
          <div class="text-white text-center">
            <div class="flex items-end gap-2 leading-none">
              <span class="text-5xl font-bold tracking-tighter">{{ String((currentIndex % filteredComments.length) + 1).padStart(2, '0') }}</span>
              <span class="text-xl font-bold opacity-40 mb-1">{{ String(filteredComments.length).padStart(2, '0') }}</span>
            </div>
            <div class="w-12 h-[3px] bg-[#D4AF37] mx-auto mt-4"></div>
          </div>
        </div>
      </div>

      <!-- Mobile Controls -->
      <div class="md:hidden flex justify-center gap-4 mb-8">
        <button @click="prev" class="w-12 h-12 rounded-full border border-[#1a2b4b] flex items-center justify-center text-[#1a2b4b]">
          <Icon name="mdi:arrow-left" class="text-xl" />
        </button>
        <button @click="next" class="w-12 h-12 rounded-full bg-[#1a2b4b] flex items-center justify-center text-white">
          <Icon name="mdi:arrow-right" class="text-xl" />
        </button>
      </div>

      <!-- Carousel Container -->
      <div class="md:pl-[350px]">
        <div class="overflow-visible">
          <div class="flex transition-transform duration-700 ease-in-out" :style="{ transform: `translateX(-${currentIndex * (100 / visibleCount)}%)` }">
            <div v-for="(comment, idx) in filteredComments" :key="idx" class="flex-shrink-0 px-3 md:px-5" :style="{ width: `${100 / visibleCount}%` }">
              <div class="bg-white shadow-xl p-8 md:p-12 relative flex flex-col h-full min-h-[420px] border-b-[6px] border-[#D4AF37]/30 group hover:border-[#D4AF37] transition-all duration-500">
                
                <!-- Rating Header -->
                <div class="flex justify-end mb-8 min-h-[40px]">
                  <div v-if="comment.source === 'TripAdvisor'" class="flex items-center gap-3">
                    <span class="text-2xl font-bold text-[#00AF87]">5/5</span>
                    <div class="flex gap-0.5">
                      <div v-for="i in 5" :key="i" class="w-4 h-4 rounded-full border-2 border-[#00AF87] flex items-center justify-center">
                        <div class="w-1.5 h-1.5 rounded-full bg-[#00AF87]"></div>
                      </div>
                    </div>
                  </div>
                  <div v-else class="bg-[#3b6db1] text-white p-2 px-3 rounded shadow-lg -mt-4 mr-[-1rem]">
                    <div class="text-xl font-bold leading-none">{{ comment.rating }}</div>
                    <div class="text-[10px] opacity-70 border-t border-white/20 mt-1 pt-1">/10</div>
                  </div>
                </div>

                <div class="mb-8">
                  <h4 class="text-3xl font-serif font-bold text-[#002B5B] mb-2 leading-tight">{{ comment.name }}</h4>
                  <p v-if="comment.source !== 'TripAdvisor'" class="text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest">{{ comment.location }}, {{ comment.date }}</p>
                </div>

                <p class="text-[#003471] leading-relaxed italic flex-1 mb-8 line-clamp-4" v-html="comment.text"></p>

                <div class="flex items-center justify-between pt-8 border-t border-gray-100">
                  <div class="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <Icon :name="comment.source === 'Booking.com' ? 'mdi:shopping' : 'mdi:tripadvisor'" class="text-xl" />
                    {{ comment.source }}
                  </div>
                  <button @click="openComment(comment)" class="text-[#D4AF37] text-xs font-bold uppercase tracking-widest hover:translate-x-1 transition-transform cursor-pointer">
                    Read more
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Popup -->
    <Teleport to="body">
      <div v-if="selectedComment" class="fixed inset-0 z-[100] flex animate-fade-in">
        <!-- Close Button (Gold Box) -->
        <button @click="closeComment" class="absolute top-0 right-0 z-50 bg-[#D4AF37] text-[#002B5B] px-8 py-5 font-bold uppercase tracking-widest flex items-center gap-3 hover:bg-[#c4a132] transition-colors shadow-lg">
          <Icon name="mdi:close" class="text-2xl" />
          Close
        </button>

        <!-- Left Navbar Block (Full Height) -->
        <div class="w-[80px] md:w-[350px] bg-[#1a2b4b] flex flex-col justify-center items-center px-10 relative">
          <div class="flex flex-col items-center gap-10">
            <div class="flex flex-col gap-6">
              <button @click="next" class="w-16 h-16 rounded-full border border-white flex items-center justify-center text-white hover:bg-white hover:text-[#1a2b4b] transition-all duration-300">
                <Icon name="mdi:arrow-right" class="text-2xl" />
              </button>
              <button @click="prev" class="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center text-white/30 hover:border-white hover:text-white transition-all duration-300">
                <Icon name="mdi:arrow-left" class="text-2xl" />
              </button>
            </div>
            
            <div class="text-white text-center">
              <div class="flex items-end gap-2 leading-none">
                <span class="text-5xl font-bold tracking-tighter">{{ String(activePopupIndex + 1).padStart(2, '0') }}</span>
                <span class="text-xl font-bold opacity-40 mb-1">{{ String(filteredComments.length).padStart(2, '0') }}</span>
              </div>
              <div class="w-12 h-[3px] bg-[#D4AF37] mx-auto mt-4"></div>
            </div>
          </div>
        </div>

        <!-- Main Content Area -->
        <div class="flex-1 bg-[#f9f7f4] flex items-center justify-center px-6 md:px-20 relative">
          <div class="max-w-4xl w-full bg-white shadow-2xl p-10 md:p-20 relative animate-slide-up">
            <!-- Rating -->
            <div class="flex justify-end mb-10">
              <div v-if="selectedComment.source === 'TripAdvisor'" class="flex items-center gap-3">
                <span class="text-3xl font-bold text-[#00AF87]">5/5</span>
                <div class="flex gap-1">
                  <div v-for="i in 5" :key="i" class="w-5 h-5 rounded-full border-2 border-[#00AF87] flex items-center justify-center">
                    <div class="w-2 h-2 rounded-full bg-[#00AF87]"></div>
                  </div>
                </div>
              </div>
              <div v-else class="bg-[#3b6db1] text-white p-3 px-5 rounded shadow-lg">
                <div class="text-3xl font-bold leading-none">{{ selectedComment.rating }}</div>
                <div class="text-[12px] opacity-70 border-t border-white/20 mt-1 pt-1 text-center">/10</div>
              </div>
            </div>

            <!-- Author -->
            <h3 class="text-5xl md:text-6xl font-serif font-bold text-[#002B5B] text-center mb-10 leading-tight">
              {{ selectedComment.name }}
            </h3>

            <!-- Text -->
            <div class="max-w-2xl mx-auto">
              <p class="text-[#003471] text-lg md:text-xl leading-relaxed text-center italic mb-16">
                “{{ selectedComment.text }}”
              </p>

              <!-- Footer -->
              <div class="flex flex-col items-center gap-4 text-[#002B5B]">
                 <Icon :name="selectedComment.source === 'Booking.com' ? 'mdi:shopping' : 'mdi:tripadvisor'" class="text-3xl opacity-50" />
                 <span class="text-sm font-bold uppercase tracking-widest opacity-60">
                   {{ selectedComment.source === 'Booking.com' ? 'Booking.com' : 'TripAdvisor.com' }}
                 </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const { locale } = useLocale()
const allComments = ref([])
const activeSource = ref('Booking.com')
const currentIndex = ref(0)
const visibleCount = ref(3)

const selectedComment = ref(null)

const filteredComments = computed(() => {
  return allComments.value.filter(c => c.source === activeSource.value) || []
})

const activePopupIndex = computed(() => {
  if (!selectedComment.value) return 0
  return filteredComments.value.findIndex(c => c === selectedComment.value)
})

const updateVisibleCount = () => {
  const w = window.innerWidth
  if (w < 769) visibleCount.value = 1
  else if (w < 1025) visibleCount.value = 2
  else if (w < 1441) visibleCount.value = 2.5
  else visibleCount.value = 3.1
}

const prev = () => { 
  if (selectedComment.value) {
    const idx = activePopupIndex.value
    const prevIdx = idx > 0 ? idx - 1 : filteredComments.value.length - 1
    selectedComment.value = filteredComments.value[prevIdx]
  } else {
    currentIndex.value = currentIndex.value > 0 ? currentIndex.value - 1 : filteredComments.value.length - 1 
  }
}

const next = () => { 
  if (selectedComment.value) {
    const idx = activePopupIndex.value
    const nextIdx = idx < filteredComments.value.length - 1 ? idx + 1 : 0
    selectedComment.value = filteredComments.value[nextIdx]
  } else {
    currentIndex.value = currentIndex.value < filteredComments.value.length - 1 ? currentIndex.value + 1 : 0 
  }
}

const openComment = (comment) => {
  selectedComment.value = comment
  document.body.style.overflow = 'hidden'
}

const closeComment = () => {
  selectedComment.value = null
  document.body.style.overflow = 'auto'
}

onMounted(async () => {
  updateVisibleCount()
  window.addEventListener('resize', updateVisibleCount)
  
  const { fetchComments } = useHotel()
  const res = await fetchComments('all', locale.value)
  if (res && res.length) {
    allComments.value = res.map(c => ({
      name: c.name || 'Guest',
      text: c.text || 'Beautiful experience.',
      rating: c.rating || 10,
      source: c.source || 'Booking.com',
      location: c.location || 'Traveler',
      date: c.date ? new Date(c.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'June 2025'
    }))
  } else {
    // Fallback data
    allComments.value = [
      { name: 'Mostaphai2017', text: "The restaurant is located on the large terrace with a marrocaine designate on this charming Riad.everything is perfect, a magical place, excellent food, the welcome was very warm and what about the kitchen ... just succulent !!! the chef feasted us with a tagine to...die for. it is here, without any hesitation, that we ate the best tajine of our stay, thank you the chef, you are our top Moroccan chef", rating: 5, source: 'TripAdvisor', location: 'MOROCCO', date: 'MONDAY, JUNE 30, 2025' },
      { name: 'Dyon', text: "I really enjoyed my stay in this Riad, the staff is so friendly and very helpful. You can ...", rating: 10, source: 'Booking.com', location: 'NETHERLANDS', date: 'WEDNESDAY, JULY 2, 2025' },
      { name: 'Garry', text: "Clean and central.", rating: 10, source: 'Booking.com', location: 'GIBRALTAR', date: 'TUESDAY, JULY 1, 2025' }
    ]
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', updateVisibleCount)
  document.body.style.overflow = 'auto'
})

// Reset carousel index when changing source
watch(activeSource, () => {
  currentIndex.value = 0
})
</script>

<style scoped>
.font-serif {
  font-family: 'Playfair Display', serif;
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}

.animate-slide-up {
  animation: slideUp 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
