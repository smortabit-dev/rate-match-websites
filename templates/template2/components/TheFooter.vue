<template>
  <footer class="bg-[#0A0A0A] border-t border-white/10">
    <div class="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

      <!-- Brand -->
      <div>
        <img v-if="info.logo" :src="info.logo" :alt="info.name" class="h-14 w-auto mb-6" />
        <div v-else class="mb-6">
          <span class="block font-['Cormorant_Garamond'] text-white text-xl font-light tracking-[0.3em] uppercase">{{ info.name }}</span>
        </div>
        <p class="text-white/40 text-sm leading-relaxed">{{ info.address }}</p>
        <p v-if="info.city" class="text-white/40 text-sm">{{ [info.city, info.country].filter(Boolean).join(', ') }}</p>
        <!-- Social -->
        <div class="flex gap-3 mt-6">
          <a v-for="s in info.socials" :key="s.key" :href="s.url" target="_blank" rel="noopener noreferrer"
            class="w-9 h-9 flex items-center justify-center border border-white/10 text-white/50 hover:border-[#C9A96E] hover:text-[#C9A96E] transition-colors">
            <Icon :name="s.icon" class="text-sm" />
          </a>
        </div>
      </div>

      <!-- Explore -->
      <div>
        <h4 class="text-[10px] uppercase tracking-[0.25em] text-[#C9A96E] font-medium mb-6">Explore</h4>
        <ul class="space-y-3">
          <li v-for="link in exploreLinks" :key="link.path">
            <NuxtLink :to="localePath(link.path)"
              class="text-white/50 text-sm hover:text-white transition-colors">{{ link.label }}</NuxtLink>
          </li>
        </ul>
      </div>

      <!-- Contact -->
      <div>
        <h4 class="text-[10px] uppercase tracking-[0.25em] text-[#C9A96E] font-medium mb-6">Contact</h4>
        <ul class="space-y-3 text-sm text-white/50">
          <li v-if="info.phone">
            <a :href="`tel:${info.phone}`" class="hover:text-white transition-colors">{{ info.phone }}</a>
          </li>
          <li v-if="info.emails">
            <a :href="`mailto:${info.emails}`" class="hover:text-white transition-colors">{{ info.emails }}</a>
          </li>
        </ul>
      </div>

      <!-- Legal -->
      <div>
        <h4 class="text-[10px] uppercase tracking-[0.25em] text-[#C9A96E] font-medium mb-6">Legal</h4>
        <ul class="space-y-3">
          <li><NuxtLink :to="localePath('/privacy-policy')" class="text-white/50 text-sm hover:text-white transition-colors">Privacy Policy</NuxtLink></li>
          <li><NuxtLink :to="localePath('/legal-notice')" class="text-white/50 text-sm hover:text-white transition-colors">Legal Notice</NuxtLink></li>
        </ul>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="border-t border-white/5">
      <div class="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] text-white/30">
        <p>&copy; {{ new Date().getFullYear() }} {{ info.name }}. All rights reserved.</p>
        <p>Powered by Rate-Match</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const { locale, localePath } = useLocale()
const info = ref({ name: '', logo: null, address: '', city: '', country: '', phone: '', emails: '', socials: [] })

const exploreLinks = computed(() => [
  { path: '/rooms',       label: 'Rooms & Suites' },
  // { path: '/dining',      label: 'Dining' },
  { path: '/services',    label: 'Services' },
  { path: '/facilities',  label: 'Facilities' },
  { path: '/gallery',     label: 'Gallery' },
  { path: '/reviews',     label: 'reviews'},
  { path: '/surroundings',label: 'Surroundings' },
  { path: '/contact',     label: 'Contact' },
])

onMounted(async () => {
  const { fetchHotelInfo } = useHotel()
  info.value = await fetchHotelInfo()
})
</script>
