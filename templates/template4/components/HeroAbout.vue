<template>
  <section id="hero" class="relative h-screen flex items-center justify-center overflow-hidden">
    <!-- Hero Background Carousel -->
    <div class="absolute inset-0 z-0">
      <div v-for="(photo, idx) in heroPhotos" :key="idx" 
           class="absolute inset-0 transition-opacity duration-1000 ease-in-out"
           :class="idx === activeHeroIndex ? 'opacity-100 scale-105' : 'opacity-0 scale-100'">
        <img :src="photo.url" class="w-full h-full object-cover brightness-[0.6] transition-transform duration-[10000ms]" :alt="photo.caption">
      </div>
      <!-- Vignette Overlay -->
      <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60"></div>
    </div>

    <!-- Carousel Controls -->
    <div class="absolute left-0 top-1/2 -translate-y-1/2 z-30 flex items-center group cursor-pointer" @click="prevSlide">
      <button class="p-4 md:p-8 text-white hover:text-[#D4AF37] transition-colors">
        <Icon name="mdi:chevron-left" class="text-3xl md:text-5xl" />
      </button>
      <div class="w-16 md:w-32 h-px bg-white/30 hidden md:block group-hover:bg-[#D4AF37] transition-colors"></div>
    </div>
    
    <div class="absolute right-0 top-1/2 -translate-y-1/2 z-30 flex items-center group cursor-pointer" @click="nextSlide">
      <div class="w-16 md:w-32 h-px bg-white/30 hidden md:block group-hover:bg-[#D4AF37] transition-colors"></div>
      <button class="p-4 md:p-8 text-white hover:text-[#D4AF37] transition-colors">
        <Icon name="mdi:chevron-right" class="text-3xl md:text-5xl" />
      </button>
    </div>

    <!-- Content -->
    <div class="container mx-auto px-6 relative z-10 text-center">
      <div class="max-w-4xl mx-auto space-y-4 md:space-y-6">
        <p class="text-[#D4AF37] text-sm md:text-xl font-bold uppercase tracking-[0.2em] md:tracking-[0.4em] animate-fade-in">
          {{ info.name }}
        </p>
        <h1 class="text-5xl md:text-5xl font-serif font-bold text-white mb-8 md:mb-12 animate-fade-in delay-200">
          About
        </h1>
        
        <div class="animate-fade-in delay-300 pt-8">
          <button @click="showModal = true" class="px-16 py-4 md:py-8 border-[1.5px] border-white text-white font-bold uppercase tracking-[0.2em] text-sm hover:bg-white hover:text-black transition-all duration-300">
            Read more
          </button>
        </div>
      </div>
    </div>

    <!-- Carousel Progress / Indicators -->
    <div class="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4">
      <div v-for="(photo, idx) in heroPhotos" :key="'indicator-'+idx" 
           class="h-[2px] transition-all duration-500"
           :class="idx === activeHeroIndex ? 'bg-white w-12 md:w-20' : 'bg-white/30 w-8 md:w-12'">
      </div>
    </div>

    <!-- Hotel Description Modal -->
    <transition name="modal-fade">
      <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="showModal = false"></div>
        
        <!-- Close Button (Top Right Screen) -->
        <button @click="showModal = false" class="absolute top-0 right-0 z-[110] bg-[#D4AF37] text-black px-10 py-6 font-bold flex items-center gap-2 hover:bg-[#B8941F] transition-colors">
          <Icon name="mdi:close" class="text-2xl" />
          <span class="uppercase tracking-widest text-sm">Close</span>
        </button>

        <!-- Modal Content -->
        <div class="relative w-full max-w-5xl bg-white shadow-2xl overflow-hidden animate-modal-in">
          <div class="p-8 md:p-16">
            <h2 class="text-3xl md:text-5xl font-serif font-bold text-[#002B5B] mb-4">{{ info.name }}</h2>
            <h3 class="text-lg md:text-xl font-bold text-gray-800 mb-10">Riad in Marrakech</h3>
            
            <div class="description-container pr-8 scrollbar-custom max-h-[50vh] overflow-y-auto">
              <div class="text-gray-600 leading-relaxed text-lg" v-html="pageDesc"></div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const info = ref({ name: '' })
const heroPhotos = ref([])
const activeHeroIndex = ref(0)
const timer = ref(null)
const showModal = ref(false)
const pageDesc = ref('')

const { locale } = useLocale()

const nextSlide = () => {
  activeHeroIndex.value = (activeHeroIndex.value + 1) % heroPhotos.value.length
  resetTimer()
}

const prevSlide = () => {
  activeHeroIndex.value = (activeHeroIndex.value - 1 + heroPhotos.value.length) % heroPhotos.value.length
  resetTimer()
}

const startTimer = () => {
  timer.value = setInterval(() => {
    activeHeroIndex.value = (activeHeroIndex.value + 1) % heroPhotos.value.length
  }, 6000)
}

const resetTimer = () => {
  if (timer.value) clearInterval(timer.value)
  startTimer()
}

onMounted(async () => {
  const { fetchGallery, fetchHotelInfo, fetchHotelData } = useHotel()
  const { loadCatalogue, trans, ETAB_ID } = useTranslations()

  const [hotelInfo, catalogue, gallery, hotelData] = await Promise.all([
    fetchHotelInfo(),
    loadCatalogue(locale.value),
    fetchGallery(),
    fetchHotelData()
  ])

  info.value = hotelInfo
  const galleryPhotos = gallery.filter(img => img.type === 'HE').length 
    ? gallery.filter(img => img.type === 'HE') 
    : gallery.slice(0, 5)
  
  heroPhotos.value = galleryPhotos.length ? galleryPhotos : [{url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', caption: 'Default'}]

  // Fetch description dynamically from page pId
  const pageId = hotelData?.page?.pId || '58752'
  const rawDesc = trans(`${pageId}-description`, {}, `${ETAB_ID}_Page`, catalogue, '')
  const tmp = document.createElement('div')
  tmp.innerHTML = rawDesc
  pageDesc.value = tmp.innerHTML

  startTimer()
})

onUnmounted(() => {
  if (timer.value) clearInterval(timer.value)
})

// Prevent scroll when modal is open
watch(showModal, (val) => {
  if (val) document.body.style.overflow = 'hidden'
  else document.body.style.overflow = ''
})
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes modal-in {
  from { opacity: 0; transform: scale(0.9) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.animate-fade-in {
  animation: fade-in 1.2s cubic-bezier(0.2, 1, 0.3, 1) forwards;
}
.animate-modal-in {
  animation: modal-in 0.6s cubic-bezier(0.2, 1, 0.3, 1) forwards;
}

.delay-200 { animation-delay: 0.2s; }
.delay-300 { animation-delay: 0.4s; }

.font-serif {
  font-family: 'Playfair Display', serif;
}

/* Custom easing for background images */
.scale-105 {
  transform: scale(1.08);
}

/* Modal Transitions */
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.5s ease;
}
.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}

/* Custom Scrollbar to match design */
.scrollbar-custom::-webkit-scrollbar {
  width: 12px;
}
.scrollbar-custom::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}
.scrollbar-custom::-webkit-scrollbar-thumb {
  background: #D4AF37;
  border-radius: 10px;
  border: 4px solid #f1f1f1;
}
.scrollbar-custom::-webkit-scrollbar-thumb:hover {
  background: #B8941F;
}

/* For Firefox */
.scrollbar-custom {
  scrollbar-width: thin;
  scrollbar-color: #D4AF37 #f1f1f1;
}
</style>
