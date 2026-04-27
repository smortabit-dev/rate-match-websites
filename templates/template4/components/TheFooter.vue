<template>
  <footer class="bg-[#002B5B] text-white pb-10"><!--pt-20-->
    <div class="container mx-auto px-6">
      <!-- Main Footer Content -->
      <!-- <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16"> -->
        <!-- Brand & Description -->
        <!-- <div class="space-y-6">
          <img v-if="info.logo" :src="info.logo" :alt="info.name" class="h-16 w-auto brightness-0 invert" />
          <h2 v-else class="text-3xl font-serif font-bold italic">{{ info.name }}</h2>
          <p class="text-blue-100/70 leading-relaxed text-sm">
            Experience luxury like never before. Our commitment to excellence ensures your stay is nothing short of extraordinary.
          </p>
          <div class="flex space-x-4">
            <a v-for="social in socialLinks" :key="social.icon" :href="social.link" target="_blank"
               class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-[#002B5B] transition-all">
              <Icon :name="social.icon" />
            </a>
          </div>
        </div> -->

        <!-- Quick Links -->
        <!-- <div>
          <h3 class="text-xl font-bold mb-8 relative inline-block">
            Quick Links
            <span class="absolute -bottom-2 left-0 w-12 h-0.5 bg-blue-400"></span>
          </h3>
          <ul class="space-y-4">
            <li v-for="item in quickLinks" :key="item.name">
              <a href="#" @click.prevent="scrollToSection(item.section)" class="text-blue-100/70 hover:text-white transition-colors flex items-center gap-2">
                <Icon name="mdi:chevron-right" class="text-blue-400" />
                {{ item.name }}
              </a>
            </li>
          </ul>
        </div> -->

        <!-- Contact Info -->
        <!-- <div>
          <h3 class="text-xl font-bold mb-8 relative inline-block">
            Contact Us
            <span class="absolute -bottom-2 left-0 w-12 h-0.5 bg-blue-400"></span>
          </h3>
          <ul class="space-y-6">
            <li v-if="info.address" class="flex items-start gap-4">
              <Icon name="mdi:map-marker" class="text-2xl text-blue-400 flex-shrink-0" />
              <span class="text-blue-100/70 text-sm leading-relaxed">{{ info.address }}</span>
            </li>
            <li v-if="info.phone" class="flex items-center gap-4">
              <Icon name="mdi:phone" class="text-2xl text-blue-400 flex-shrink-0" />
              <a :href="`tel:${info.phone}`" class="text-blue-100/70 hover:text-white transition-colors">{{ info.phone }}</a>
            </li>
            <li v-if="info.email" class="flex items-center gap-4">
              <Icon name="mdi:email" class="text-2xl text-blue-400 flex-shrink-0" />
              <a :href="`mailto:${info.email}`" class="text-blue-100/70 hover:text-white transition-colors">{{ info.email }}</a>
            </li>
          </ul>
        </div> -->

        <!-- Newsletter -->
        <!-- <div>
          <h3 class="text-xl font-bold mb-8 relative inline-block">
            A Message
            <span class="absolute -bottom-2 left-0 w-12 h-0.5 bg-blue-400"></span>
          </h3>
          <p class="text-blue-100/70 text-sm mb-6">Stay updated with our latest offers and news.</p>
          <div class="flex flex-col gap-3">
            <input type="email" placeholder="Your Email" class="bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-400 transition-colors" />
            <button class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-all">Subscribe</button>
          </div>
        </div> -->
      <!-- </div> -->

      <!-- Bottom Bar -->
      <div class="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-blue-100/50">
        <p>&copy; {{ new Date().getFullYear() }} {{ info.name }}. All rights reserved.</p>
        <div class="flex space-x-6 text-xs uppercase tracking-widest">
          <NuxtLink :to="localePath('/privacy-policy')" class="hover:text-white">Privacy Policy</NuxtLink>
          <NuxtLink :to="localePath('/legal-notice')" class="hover:text-white">Legal Notice</NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const info = ref({ name: '', logo: null, address: '', phone: '', email: '' })
const { locale, localePath } = useLocale()

const quickLinks = [
  { name: 'Our Rooms', section: 'rooms' },
  { name: 'Our Services', section: 'services' },
  { name: 'Facilities', section: 'amenities' },
  { name: 'Gallery', section: 'gallery' },
]

const socialLinks = [
  { icon: 'mdi:facebook', link: '#' },
  { icon: 'mdi:instagram', link: '#' },
  { icon: 'mdi:twitter', link: '#' },
  { icon: 'mdi:linkedin', link: '#' },
]

onMounted(async () => {
  const { fetchHotelInfo } = useHotel()
  info.value = await fetchHotelInfo()
})

const scrollToSection = (sectionId) => {
  const el = document.getElementById(sectionId)
  if (el) {
    const offset = 80
    const bodyRect = document.body.getBoundingClientRect().top
    const elementRect = el.getBoundingClientRect().top
    const elementPosition = elementRect - bodyRect
    const offsetPosition = elementPosition - offset

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}
</script>
