<template>
  <section id="contact" class="bg-[#F5F5F5] py-24 px-6">
    <div class="max-w-7xl mx-auto">
      <div class="mb-16">
        <p class="text-[10px] uppercase tracking-[0.3em] text-[#C9A96E] mb-4">Get in Touch</p>
        <h2 class="font-['Cormorant_Garamond'] text-4xl sm:text-5xl text-[#111] font-light">Contact</h2>
        <div class="w-10 h-px bg-[#C9A96E] mt-6"></div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <!-- Info -->
        <div class="space-y-10">
          <div v-if="info.address">
            <h4 class="text-[9px] uppercase tracking-[0.25em] text-[#C9A96E] mb-3">Address</h4>
            <p class="text-[#111] text-sm leading-relaxed">{{ info.address }}</p>
            <p v-if="info.city" class="text-[#111] text-sm">{{ [info.city, info.country].filter(Boolean).join(', ') }}</p>
          </div>
          <div v-if="info.phone">
            <h4 class="text-[9px] uppercase tracking-[0.25em] text-[#C9A96E] mb-3">Phone</h4>
            <a :href="`tel:${info.phone}`" class="text-[#111] text-sm hover:text-[#C9A96E] transition-colors">{{ info.phone }}</a>
          </div>
          <div v-if="info.emails">
            <h4 class="text-[9px] uppercase tracking-[0.25em] text-[#C9A96E] mb-3">Email</h4>
            <a :href="`mailto:${info.emails}`" class="text-[#111] text-sm hover:text-[#C9A96E] transition-colors">{{ info.emails }}</a>
          </div>
          <!-- Social -->
          <div v-if="info.socials?.length">
            <h4 class="text-[9px] uppercase tracking-[0.25em] text-[#C9A96E] mb-4">Follow Us</h4>
            <div class="flex gap-3">
              <a v-for="s in info.socials" :key="s.key" :href="s.url" target="_blank" rel="noopener noreferrer"
                class="w-10 h-10 border border-[#111]/20 flex items-center justify-center text-[#111]/60 hover:border-[#C9A96E] hover:text-[#C9A96E] transition-colors">
                <Icon :name="s.icon" class="text-sm" />
              </a>
            </div>
          </div>
        </div>

        <!-- Form -->
        <form @submit.prevent="sendMessage" class="space-y-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label class="block text-[9px] uppercase tracking-[0.2em] text-[#111]/60 mb-2">First Name</label>
              <input v-model="form.firstName" type="text" required
                class="w-full border-b border-[#111]/20 bg-transparent py-2.5 text-sm text-[#111] focus:outline-none focus:border-[#C9A96E]" />
            </div>
            <div>
              <label class="block text-[9px] uppercase tracking-[0.2em] text-[#111]/60 mb-2">Last Name</label>
              <input v-model="form.lastName" type="text"
                class="w-full border-b border-[#111]/20 bg-transparent py-2.5 text-sm text-[#111] focus:outline-none focus:border-[#C9A96E]" />
            </div>
          </div>
          <div>
            <label class="block text-[9px] uppercase tracking-[0.2em] text-[#111]/60 mb-2">Email</label>
            <input v-model="form.email" type="email" required
              class="w-full border-b border-[#111]/20 bg-transparent py-2.5 text-sm text-[#111] focus:outline-none focus:border-[#C9A96E]" />
          </div>
          <div>
            <label class="block text-[9px] uppercase tracking-[0.2em] text-[#111]/60 mb-2">Message</label>
            <textarea v-model="form.message" rows="4" required
              class="w-full border-b border-[#111]/20 bg-transparent py-2.5 text-sm text-[#111] focus:outline-none focus:border-[#C9A96E] resize-none"></textarea>
          </div>
          <button type="submit"
            class="px-10 py-4 border border-[#111] text-[#111] text-[11px] uppercase tracking-[0.2em] hover:bg-[#111] hover:text-white transition-all">
            Send Message
          </button>
          <p v-if="sent" class="text-[#C9A96E] text-sm">Thank you! We will be in touch shortly.</p>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const info = ref({ address: '', city: '', country: '', phone: '', emails: '', socials: [] })
const sent = ref(false)
const form = ref({ firstName: '', lastName: '', email: '', message: '' })

onMounted(async () => {
  const { fetchHotelInfo } = useHotel()
  info.value = await fetchHotelInfo()
})

const sendMessage = () => {
  sent.value = true
  form.value = { firstName: '', lastName: '', email: '', message: '' }
}
</script>
