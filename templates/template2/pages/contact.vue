<template>
  <div class="bg-white min-h-screen">
    <PageHero title="Contact" :image="heroImg" />

    <div class="max-w-7xl mx-auto px-6 py-14">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-20">

        <!-- Contact info -->
        <div class="space-y-12">
          <div v-if="info.address">
            <p class="text-[9px] uppercase tracking-[0.3em] text-[#C9A96E] mb-4">Address</p>
            <p class="text-[#111]/70 text-sm leading-relaxed">{{ info.address }}</p>
            <p v-if="info.city" class="text-[#111]/70 text-sm mt-1">{{ [info.city, info.country].filter(Boolean).join(', ') }}</p>
          </div>

          <div v-if="info.phone">
            <p class="text-[9px] uppercase tracking-[0.3em] text-[#C9A96E] mb-4">Phone</p>
            <a :href="`tel:${info.phone}`" class="text-[#111]/70 text-sm hover:text-[#C9A96E] transition-colors">{{ info.phone }}</a>
          </div>

          <div v-if="info.emails">
            <p class="text-[9px] uppercase tracking-[0.3em] text-[#C9A96E] mb-4">Email</p>
            <a :href="`mailto:${info.emails}`" class="text-[#111]/70 text-sm hover:text-[#C9A96E] transition-colors">{{ info.emails }}</a>
          </div>

          <!-- Social links -->
          <div v-if="info.socials?.length">
            <p class="text-[9px] uppercase tracking-[0.3em] text-[#C9A96E] mb-4">Follow Us</p>
            <div class="flex gap-3">
              <a v-for="s in info.socials" :key="s.key" :href="s.url" target="_blank" rel="noopener noreferrer"
                class="w-10 h-10 border border-[#111]/20 flex items-center justify-center text-[#111]/50 hover:border-[#C9A96E] hover:text-[#C9A96E] transition-colors">
                <Icon :name="s.icon" class="text-base" />
              </a>
            </div>
          </div>

          <!-- Map embed -->
          <div v-if="info.lat && info.lng" id="t2-contact-map" class="w-full h-64 border border-[#111]/10 mt-8"></div>
        </div>

        <!-- Contact form -->
        <div>
          <form @submit.prevent="handleSubmit" class="space-y-8">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <label class="block text-[9px] uppercase tracking-[0.25em] text-[#111]/40 mb-3">
                  First Name *
                </label>
                <input v-model="form.firstName" type="text" required
                  class="w-full bg-transparent border-b border-[#111]/20 py-3 text-[#111] text-sm focus:outline-none focus:border-[#C9A96E] transition-colors placeholder:text-[#111]/20"
                  placeholder="" />
              </div>
              <div>
                <label class="block text-[9px] uppercase tracking-[0.25em] text-[#111]/40 mb-3">
                  Last Name
                </label>
                <input v-model="form.lastName" type="text"
                  class="w-full bg-transparent border-b border-[#111]/20 py-3 text-[#111] text-sm focus:outline-none focus:border-[#C9A96E] transition-colors placeholder:text-[#111]/20" />
              </div>
            </div>

            <div>
              <label class="block text-[9px] uppercase tracking-[0.25em] text-[#111]/40 mb-3">
                Email *
              </label>
              <input v-model="form.email" type="email" required
                class="w-full bg-transparent border-b border-[#111]/20 py-3 text-[#111] text-sm focus:outline-none focus:border-[#C9A96E] transition-colors placeholder:text-[#111]/20" />
            </div>

            <div>
              <label class="block text-[9px] uppercase tracking-[0.25em] text-[#111]/40 mb-3">
                Phone
              </label>
              <input v-model="form.phone" type="tel"
                class="w-full bg-transparent border-b border-[#111]/20 py-3 text-[#111] text-sm focus:outline-none focus:border-[#C9A96E] transition-colors placeholder:text-[#111]/20" />
            </div>

            <div>
              <label class="block text-[9px] uppercase tracking-[0.25em] text-[#111]/40 mb-3">
                Subject
              </label>
              <select v-model="form.subject"
                class="w-full bg-white border-b border-[#111]/20 py-3 text-[#111] text-sm focus:outline-none focus:border-[#C9A96E] transition-colors appearance-none">
                <option value="">Select a subject</option>
                <option value="reservation">Reservation enquiry</option>
                <option value="info">General information</option>
                <option value="event">Events &amp; Meetings</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label class="block text-[9px] uppercase tracking-[0.25em] text-[#111]/40 mb-3">
                Message *
              </label>
              <textarea v-model="form.message" rows="5" required
                class="w-full bg-transparent border-b border-[#111]/20 py-3 text-[#111] text-sm focus:outline-none focus:border-[#C9A96E] transition-colors resize-none placeholder:text-[#111]/20"></textarea>
            </div>

            <button type="submit"
              class="px-12 py-4 border border-[#C9A96E] text-[#C9A96E] text-[10px] uppercase tracking-[0.3em] hover:bg-[#C9A96E] hover:text-black transition-all">
              Send Message
            </button>

            <transition name="t2-fade">
              <p v-if="sent" class="text-[#C9A96E] text-sm">
                Thank you! We will be in touch shortly.
              </p>
            </transition>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'

const heroImg = ref('')
const info    = ref({})
const sent    = ref(false)
const form    = ref({
  firstName: '', lastName: '', email: '',
  phone: '', subject: '', message: '',
})

const handleSubmit = () => {
  sent.value = true
  form.value = { firstName: '', lastName: '', email: '', phone: '', subject: '', message: '' }
  setTimeout(() => { sent.value = false }, 5000)
}

onMounted(async () => {
  const { fetchGallery, fetchHotelInfo } = useHotel()
  

  const [hotelInfo, gallery] = await Promise.all([fetchHotelInfo(), fetchGallery()])
  info.value    = hotelInfo
  heroImg.value = gallery[3]?.url || gallery[0]?.url || ''

  const lat = parseFloat(hotelInfo.latitude)
  const lng = parseFloat(hotelInfo.longitude)

  if (process.client && lat && lng) {
    await nextTick()
    try {
      const L = (await import('leaflet')).default
      await import('leaflet/dist/leaflet.css')

      const map = L.map('t2-contact-map', { zoomControl: false, scrollWheelZoom: false })
        .setView([lat, lng], 15)

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map)

      const icon = L.divIcon({
        html: `<div style="width:14px;height:14px;background:#C9A96E;border:2px solid #fff;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,.3)"></div>`,
        className: '',
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      })
      L.marker([lat, lng], { icon }).addTo(map)
    } catch (e) {
      console.warn('[Contact] Leaflet error:', e)
    }
  }
})
</script>

<style scoped>
.t2-fade-enter-active, .t2-fade-leave-active { transition: opacity 0.3s ease; }
.t2-fade-enter-from, .t2-fade-leave-to { opacity: 0; }
</style>
