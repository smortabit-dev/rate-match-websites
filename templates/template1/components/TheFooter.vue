<template>
  <footer id="footer" class="bg-gray-900 text-white">
    <!-- Newsletter -->
    <!-- <div class="bg-white border-b border-gray-200">
      <div class="container mx-auto px-4 sm:px-6 py-10 sm:py-12 lg:py-16">
        <div class="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8 lg:gap-16 items-start">
          <div>
            <h3 class="text-2xl sm:text-3xl font-serif text-gray-900 mb-3">{{ t.newsletter }}</h3>
            <p class="text-gray-500 text-sm leading-relaxed">Subscribe to our newsletter and never miss an exclusive insight!</p>
          </div>
          <form @submit.prevent="handleNewsletter" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-4 items-end">
              <div>
                <label class="block text-xs uppercase tracking-[0.15em] font-semibold text-gray-800 mb-2">{{ t.nom }}</label>
                <input v-model="name" type="text" :placeholder="t.entrervotrenom"
                       class="w-full border-0 border-b-2 border-gray-300 focus:border-gray-900 focus:ring-0 bg-transparent py-2 text-sm text-gray-700 placeholder-gray-400 outline-none" />
              </div>
              <div>
                <label class="block text-xs uppercase tracking-[0.15em] font-semibold text-gray-800 mb-2">{{ t.email }}</label>
                <input v-model="email" type="email" :placeholder="t.entrervotreadressee_mail" required
                       class="w-full border-0 border-b-2 border-gray-300 focus:border-gray-900 focus:ring-0 bg-transparent py-2 text-sm text-gray-700 placeholder-gray-400 outline-none" />
              </div>
              <button type="submit"
                      class="w-full sm:w-auto px-8 py-2.5 border-2 border-gray-900 text-gray-900 text-xs uppercase tracking-[0.15em] font-semibold hover:bg-gray-900 hover:text-white transition-all whitespace-nowrap">
                {{ t.envoyer }}
              </button>
            </div>
            <label class="flex items-center gap-2 cursor-pointer">
              <input v-model="acceptPolicy" type="checkbox" class="w-4 h-4 border-gray-300 text-gray-900 focus:ring-gray-900" />
              <span class="text-xs text-gray-500">I have read and accept the legal notice and privacy policy.</span>
            </label>
          </form>
        </div>
      </div>
    </div> -->

    <!-- Main Footer -->
    <div class="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
        <!-- Identity -->
        <div>
          <div class="mb-6">
            <img v-if="info.logo" :src="info.logo" :alt="info.name" class="h-12 w-auto" />
            <div v-else class="font-serif">
              <span class="text-xs tracking-[0.3em] text-gray-400 block">THE</span>
              <span class="text-xl font-bold block">{{ info.name || 'HOTEL' }}</span>
            </div>
          </div>
          <div class="space-y-2 text-sm text-gray-400">
            <p v-if="info.address">{{ info.address }}</p>
            <p v-if="info.city">{{ [info.city, info.country].filter(Boolean).join(' · ') }}</p>
          </div>
        </div>

        <!-- Contact -->
        <div>
          <h4 class="text-xs uppercase tracking-[0.2em] font-semibold mb-6 text-amber-700">{{ t.contact }}</h4>
          <div class="space-y-3 text-sm text-gray-400">
            <a v-if="info.phone" :href="`tel:${info.phone}`" class="block hover:text-white transition-colors">
              {{ info.phone }}
            </a>
            <a v-if="info.emails" :href="`mailto:${info.emails}`" class="block hover:text-white transition-colors">
              {{ info.emails }}
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="text-xs uppercase tracking-[0.2em] font-semibold mb-6 text-amber-700">{{ t.hotel }}</h4>
          <ul class="space-y-3 text-sm text-gray-400">
            <li><NuxtLink :to="localePath('/faq')" class="hover:text-white transition-colors">{{ t.faq2 }}</NuxtLink></li>
            <li><NuxtLink :to="localePath('/privacy-policy')" class="hover:text-white transition-colors">{{ t.politiquedeconfidentialite }}</NuxtLink></li>
            <li><NuxtLink :to="localePath('/legal-notice')" class="hover:text-white transition-colors">{{ t.conditionsgenerales }}</NuxtLink></li>
          </ul>
        </div>

        <!-- Social -->
        <div>
          <h4 class="text-xs uppercase tracking-[0.2em] font-semibold mb-6 text-amber-700">{{ t.suiveznous }}</h4>
          <div class="flex gap-3">
            <a v-for="s in info.socials" :key="s.key"
               :href="s.url" target="_blank" rel="noopener noreferrer" :title="s.label"
               class="w-10 h-10 flex items-center justify-center border border-gray-700 hover:border-amber-700 hover:text-amber-700 transition-colors">
              <Icon :name="s.icon" class="text-lg" />
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Tech Providers Panel -->
    <transition name="fade-slide">
      <div v-if="showTechProviders" class="container mx-auto px-4 mb-6">
        <div class="bg-[#f0f7ff] rounded-[2rem] p-6 sm:p-6 lg:p-6 relative overflow-hidden border border-blue-100">
          <div class="flex flex-col lg:flex-row items-center gap-16 lg:gap-32">
            <div class="text-3xl font-serif font-bold text-[#0a2540] whitespace-nowrap">Rate Match.</div>
            
            <div class="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-10">
              <!-- Column 1 -->
              <div class="space-y-2">
                <a href="https://rate-match.com" target="_blank" class="flex items-center justify-between group border-b border-blue-200/50 pb-2 hover:border-blue-400 transition-colors">
                  <span class="text-[13px] font-bold text-[#0a2540]/70 group-hover:text-[#0a2540] transition-colors tracking-wide">Booking Website &copy;</span>
                  <Icon name="mdi:arrow-top-right" class="text-xl text-blue-300 group-hover:text-blue-500 transition-all group-hover:translate-x-1 group-hover:-translate-y-1" />
                </a>
                <a href="https://rate-match.com" target="_blank" class="flex items-center justify-between group border-b border-blue-200/50 pb-2 hover:border-blue-400 transition-colors">
                  <span class="text-[13px] font-bold text-[#0a2540]/70 group-hover:text-[#0a2540] transition-colors tracking-wide">Hotel Price Checker &copy;</span>
                  <Icon name="mdi:arrow-top-right" class="text-xl text-blue-300 group-hover:text-blue-500 transition-all group-hover:translate-x-1 group-hover:-translate-y-1" />
                </a>
              </div>
              <!-- Column 2 -->
              <div class="space-y-2">
                <a href="https://rate-match.com" target="_blank" class="flex items-center justify-between group border-b border-blue-200/50 pb-2 hover:border-blue-400 transition-colors">
                  <span class="text-[13px] font-bold text-[#0a2540]/70 group-hover:text-[#0a2540] transition-colors tracking-wide">RateMatch Booking Engine &copy;</span>
                  <Icon name="mdi:arrow-top-right" class="text-xl text-blue-300 group-hover:text-blue-500 transition-all group-hover:translate-x-1 group-hover:-translate-y-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Bottom bar -->
    <div class="bg-stone-50 border-t border-stone-200">
      <div class="container mx-auto px-2 py-4">
        <div class="flex flex-col md:flex-row justify-end items-center text-[10px] sm:text-[11px] text-stone-500 gap-6 sm:gap-6">
          
          <!-- Copyright & Powered by -->
          <div class="flex items-center gap-3">
            <span class="opacity-80">&copy; {{ new Date().getFullYear() }} - Powered by</span>
            <a href="https://rate-match.com" target="_blank" class="hover:opacity-80 transition-opacity">
              <img src="https://rate.picscache.com/sitesAllInOne/Assets_IQScan/img/logo_footer.svg" alt="Rate Match" class="h-4 w-auto" />
            </a>
          </div>

          <!-- Technology Providers -->
          <button @click="showTechProviders = !showTechProviders"
                  class="bg-[#0a2540] text-white px-3 py-2 rounded-full flex items-center gap-4 hover:bg-[#0d2e50] transition-all shadow-sm group">
            <span class="font-bold tracking-widest uppercase text-[9px] sm:text-[10px]">Technology providers</span>
            <div class="w-5 h-5 bg-white rounded-full flex items-center justify-center text-[#0a2540] shadow-inner">
              <Icon :name="showTechProviders ? 'mdi:close' : 'mdi:chevron-up'" class="text-sm transition-transform group-hover:-translate-y-0.5" />
            </div>
          </button>

          <!-- Sitemap -->
          <NuxtLink :to="localePath('/sitemap')" class="flex items-center gap-2 text-stone-800 hover:text-amber-700 transition-colors font-bold uppercase tracking-widest border-b border-stone-300 pb-0.5">
            {{ t.plandesite }}
            <Icon name="mdi:arrow-top-right" class="text-sm opacity-40" />
          </NuxtLink>

        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const { locale, localePath } = useLocale()
const { loadCatalogue, transStatic } = useTranslations()

const email = ref('')
const name = ref('')
const acceptPolicy = ref(false)
const showTechProviders = ref(false)
const info = ref({ name: '', logo: null, address: '', city: '', country: '', phone: '', emails: '', socials: [] })

const STATIC_KEYS = ['contact', 'hotel', 'politiquedeconfidentialite', 'suiveznous', 'faq2', 'conditionsgenerales', 'plandesite', 'newsletter', 'nom', 'entrervotrenom', 'email', 'entrervotreadressee-mail', 'envoyer']
const t = ref(Object.fromEntries(STATIC_KEYS.map(k => [k, k])))

onMounted(async () => {
  const { fetchHotelInfo } = useHotel()
  const [hotelInfo, catalogue] = await Promise.all([
    fetchHotelInfo(),
    loadCatalogue(locale.value),
  ])
  info.value = hotelInfo
  const translated = {}
  for (const key of STATIC_KEYS) translated[key] = transStatic(key, catalogue)
  t.value = translated
})

const handleNewsletter = () => {
  alert('Thank you for subscribing to our newsletter!')
  email.value = ''
  name.value = ''
}
</script>
<style scoped>
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
