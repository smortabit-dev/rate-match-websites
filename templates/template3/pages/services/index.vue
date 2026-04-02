<template>
  <div class="bg-[#f5ede3] min-h-screen">
    <TheHeader />
    <PageHero title="Services" subtitle="Experiences" :image="heroImg" />

    <div class="max-w-7xl mx-auto px-6 py-16">
      <div v-if="loading" class="flex justify-center py-20">
        <div class="w-10 h-10 border-2 border-[#b7825c] border-t-transparent rounded-full animate-spin"></div>
      </div>

      <div v-else>
        <div v-for="group in groups" :key="group.id" class="mb-20">
          <!-- Group header -->
          <div class="mb-10">
            <p class="text-[10px] uppercase tracking-[0.35em] text-[#b7825c] mb-3">Collection</p>
            <h2 class="font-['Cormorant_Garamond'] text-3xl sm:text-4xl text-[#1a1410] font-light">{{ group.name }}</h2>
            <div class="flex items-center gap-3 mt-4">
              <div class="w-10 h-px bg-[#b7825c]"></div>
              <div class="w-2 h-2 border border-[#b7825c] rotate-45 flex-shrink-0"></div>
            </div>
          </div>

          <!-- Services grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="svc in group.services" :key="svc.id"
              class="group cursor-pointer bg-white"
              @click="openModal(svc, group.name)">
              <div class="relative aspect-[4/3] overflow-hidden bg-[#e8d5c0]">
                <img v-if="svc.images?.[0] || svc.image"
                  :src="svc.images?.[0] || svc.image" :alt="svc.name"
                  class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <Icon name="mdi:star-outline" class="text-5xl text-[#b7825c]/30" />
                </div>
                <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
              </div>
              <div class="p-6">
                <div class="w-8 h-px bg-[#b7825c] mb-4"></div>
                <h3 class="text-[11px] uppercase tracking-[0.2em] font-medium text-[#1a1410] mb-3">{{ svc.name }}</h3>
                <p class="text-[#1a1410]/50 text-sm leading-relaxed line-clamp-3 mb-4" v-html="svc.description || ''"></p>
                <span class="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-[#b7825c] hover:text-[#7a2c28] transition-colors">
                  Discover <Icon name="mdi:arrow-right" class="text-sm" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <transition name="t3-modal">
      <div v-if="modalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8" @click.self="closeModal">
        <div class="absolute inset-0 bg-[#1a1410]/80 backdrop-blur-sm" @click="closeModal"></div>
        <div v-if="modalSvc" class="relative z-10 w-full max-w-4xl bg-white shadow-2xl flex flex-col md:flex-row max-h-[90vh] overflow-hidden">
          <button @click="closeModal" class="absolute top-5 right-5 z-20 w-9 h-9 flex items-center justify-center border border-[#1a1410]/15 text-[#1a1410]/40 hover:border-[#b7825c] hover:text-[#b7825c] transition-colors">
            <Icon name="mdi:close" class="text-lg" />
          </button>
          <div class="relative md:w-1/2 flex-shrink-0 bg-[#f5ede3] min-h-[220px]">
            <template v-if="modalImages.length">
              <img v-for="(img, idx) in modalImages" :key="idx" :src="img" :alt="modalSvc.name"
                class="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                :class="modalSlide === idx ? 'opacity-100' : 'opacity-0'" />
              <template v-if="modalImages.length > 1">
                <button @click="modalSlide = modalSlide > 0 ? modalSlide - 1 : modalImages.length - 1"
                  class="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white flex items-center justify-center z-10">
                  <Icon name="mdi:chevron-left" class="text-[#1a1410]" />
                </button>
                <button @click="modalSlide = modalSlide < modalImages.length - 1 ? modalSlide + 1 : 0"
                  class="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white flex items-center justify-center z-10">
                  <Icon name="mdi:chevron-right" class="text-[#1a1410]" />
                </button>
              </template>
            </template>
            <div v-else class="absolute inset-0 flex items-center justify-center">
              <Icon name="mdi:star-outline" class="text-7xl text-[#b7825c]/30" />
            </div>
          </div>
          <div class="md:w-1/2 flex flex-col justify-center overflow-y-auto px-10 py-12">
            <p v-if="modalSvc._groupName" class="text-[10px] uppercase tracking-[0.3em] text-[#b7825c] mb-4">{{ modalSvc._groupName }}</p>
            <h3 class="font-['Cormorant_Garamond'] text-4xl text-[#1a1410] font-light leading-tight mb-4">{{ modalSvc.name }}</h3>
            <div class="w-8 h-px bg-[#b7825c] mb-6"></div>
            <div class="text-[#1a1410]/55 text-sm leading-relaxed mb-10" v-html="modalSvc.description || ''"></div>
            <div class="flex items-center gap-6 pt-6 border-t border-[#1a1410]/8">
              <NuxtLink :to="localePath('/availibility')"
                class="px-8 py-3.5 bg-[#b7825c] text-white text-[10px] uppercase tracking-[0.25em] hover:bg-[#9a6a48] transition-all">
                Book Now
              </NuxtLink>
              <button @click="closeModal" class="text-[#1a1410]/40 text-[10px] uppercase tracking-[0.2em] hover:text-[#1a1410] transition-colors">Close</button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <TheFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import TheHeader from '../../components/TheHeader.vue'
import TheFooter from '../../components/TheFooter.vue'
import PageHero  from '../../components/PageHero.vue'

const { locale, localePath } = useLocale()
const groups   = ref([])
const loading  = ref(true)
const heroImg  = ref('')
const modalOpen  = ref(false)
const modalSvc   = ref(null)
const modalSlide = ref(0)

const modalImages = computed(() =>
  (modalSvc.value?.images || (modalSvc.value?.image ? [modalSvc.value.image] : [])).slice(0, 6)
)

const openModal  = (svc, groupName) => { modalSvc.value = { ...svc, _groupName: groupName }; modalSlide.value = 0; modalOpen.value = true; document.body.style.overflow = 'hidden' }
const closeModal = () => { modalOpen.value = false; document.body.style.overflow = '' }

onMounted(async () => {
  const { fetchServices, fetchGallery } = useHotel()
  const [data, gallery] = await Promise.all([fetchServices(locale.value), fetchGallery()])
  groups.value  = data || []
  heroImg.value = gallery[3]?.url || gallery[0]?.url || ''
  loading.value = false
})
</script>

<style scoped>
.t3-modal-enter-active { transition: opacity 0.3s ease; }
.t3-modal-leave-active { transition: opacity 0.25s ease; }
.t3-modal-enter-from, .t3-modal-leave-to { opacity: 0; }
.t3-modal-enter-active .relative.z-10 { transition: transform 0.3s ease, opacity 0.3s ease; }
.t3-modal-leave-active .relative.z-10 { transition: transform 0.2s ease, opacity 0.25s ease; }
.t3-modal-enter-from .relative.z-10 { transform: scale(0.96); opacity: 0; }
.t3-modal-leave-to   .relative.z-10 { transform: scale(0.96); opacity: 0; }
</style>
