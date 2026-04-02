<template>
  <section class="bg-[#f4ece6] py-24 px-6">
    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-20">

        <!-- Info column -->
        <div>
          <p class="text-[10px] uppercase tracking-[0.35em] text-[#b7825c] mb-5">Get in Touch</p>
          <h2 class="font-['Cormorant_Garamond'] text-4xl sm:text-5xl text-black font-light mb-8">{{ t.contact || 'Contact Us' }}</h2>
          <div class="w-12 h-px bg-[#b7825c] mb-10"></div>

          <div class="space-y-6 text-black/60 text-sm mb-10">
            <div v-if="info.address" class="flex items-start gap-3">
              <Icon name="mdi:map-marker-outline" class="text-[#b7825c] text-lg flex-shrink-0 mt-0.5" />
              <span>{{ info.address }}<br v-if="info.city" />{{ [info.city, info.country].filter(Boolean).join(', ') }}</span>
            </div>
            <div v-if="info.phone" class="flex items-center gap-3">
              <Icon name="mdi:phone-outline" class="text-[#b7825c] text-lg flex-shrink-0" />
              <a :href="`tel:${info.phone}`" class="hover:text-[#b7825c] transition-colors">{{ info.phone }}</a>
            </div>
            <div v-if="info.emails" class="flex items-center gap-3">
              <Icon name="mdi:email-outline" class="text-[#b7825c] text-lg flex-shrink-0" />
              <a :href="`mailto:${info.emails}`" class="hover:text-[#b7825c] transition-colors">{{ info.emails }}</a>
            </div>
          </div>

          <div class="flex gap-3">
            <a v-for="s in info.socials" :key="s.key" :href="s.url" target="_blank" rel="noopener noreferrer"
              class="w-10 h-10 flex items-center justify-center border border-white/10 text-white/40 hover:border-[#b7825c] hover:text-[#b7825c] transition-colors">
              <Icon :name="s.icon" class="text-sm" />
            </a>
          </div>
        </div>

        <!-- Form column -->
        <div>
          <form @submit.prevent="submitForm" class="space-y-6">
            <div class="grid grid-cols-2 gap-6">
              <div>
                <label class="block text-[10px] uppercase tracking-[0.2em] text-[#b7825c]/90 mb-2">Name</label>
                <input v-model="form.name" type="text" required
                  class="w-full bg-transparent border-b border-[#b7825c]/20 text-[#b7825c] text-sm py-3 placeholder:text-[#b7825c]/20 focus:outline-none focus:border-[#b7825c] transition-colors" />
              </div>
              <div>
                <label class="block text-[10px] uppercase tracking-[0.2em] text-[#b7825c]/90 mb-2">Email</label>
                <input v-model="form.email" type="email" required
                  class="w-full bg-transparent border-b border-[#b7825c]/20 text-[#b7825c] text-sm py-3 placeholder:text-[#b7825c]/20 focus:outline-none focus:border-[#b7825c] transition-colors" />
              </div>
            </div>
            <div>
              <label class="block text-[10px] uppercase tracking-[0.2em] text-[#b7825c]/90 mb-2">Subject</label>
              <input v-model="form.subject" type="text"
                class="w-full bg-transparent border-b border-[#b7825c]/20 text-[#b7825c] text-sm py-3 placeholder:text-[#b7825c]/20 focus:outline-none focus:border-[#b7825c] transition-colors" />
            </div>
            <div>
              <label class="block text-[10px] uppercase tracking-[0.2em] text-[#b7825c]/90 mb-2">Message</label>
              <textarea v-model="form.message" rows="4" required
                class="w-full bg-transparent border-b border-[#b7825c]/20 text-[#b7825c] text-sm py-3 placeholder:text-[#b7825c]/20 focus:outline-none focus:border-[#b7825c] transition-colors resize-none"></textarea>
            </div>
            <div class="flex items-center gap-6">
              <button type="submit"
                class="px-10 py-4 bg-[#b7825c] text-[#ffffff] text-[11px] uppercase tracking-[0.25em] hover:bg-[#9a6a48] transition-all">
                {{ sent ? 'Sent!' : 'Send Message' }}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const { locale } = useLocale()
const info = ref({ address: '', city: '', country: '', phone: '', emails: '', socials: [] })
const t    = ref({})
const sent = ref(false)
const form = ref({ name: '', email: '', subject: '', message: '' })

const submitForm = () => {
  sent.value = true
  setTimeout(() => {
    sent.value = false
    form.value = { name: '', email: '', subject: '', message: '' }
  }, 3000)
}

onMounted(async () => {
  const { fetchHotelInfo } = useHotel()
  const { loadCatalogue, transStatic } = useTranslations()
  const [hotelInfo, catalogue] = await Promise.all([fetchHotelInfo(), loadCatalogue(locale.value)])
  info.value = hotelInfo
  t.value = { contact: transStatic('contact', catalogue) }
})
</script>
