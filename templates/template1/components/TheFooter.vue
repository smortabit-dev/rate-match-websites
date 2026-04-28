<template>
  <footer class="bg-gray-900 text-white">
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
            <li><NuxtLink :to="localePath('/faq')" class="hover:text-white transition-colors">FAQ</NuxtLink></li>
            <li><NuxtLink :to="localePath('/privacy-policy')" class="hover:text-white transition-colors">{{ t.privacy }}</NuxtLink></li>
            <li><NuxtLink :to="localePath('/legal-notice')" class="hover:text-white transition-colors">{{ t.legalinformation }}</NuxtLink></li>
          </ul>
        </div>

        <!-- Social -->
        <div>
          <h4 class="text-xs uppercase tracking-[0.2em] font-semibold mb-6 text-amber-700">Follow Us</h4>
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

    <!-- Bottom bar -->
    <div class="border-t border-gray-800">
      <div class="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div class="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-4">
          <p>&copy; {{ new Date().getFullYear() }} {{ info.name || 'Hotel' }}. All rights reserved.</p>
          <div class="flex flex-wrap justify-center gap-6">
            <NuxtLink :to="localePath('/sitemap')" class="hover:text-white transition-colors">{{ t.sitemap }}</NuxtLink>
          </div>
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
const info = ref({ name: '', logo: null, address: '', city: '', country: '', phone: '', emails: '', socials: [] })

const STATIC_KEYS = ['contact', 'hotel', 'privacy', 'legalinformation', 'sitemap', 'newsletter', 'nom', 'entrervotrenom', 'email', 'entrervotreadressee-mail', 'envoyer']
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
