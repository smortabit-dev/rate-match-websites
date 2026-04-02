<template>
  <div class="min-h-screen bg-gray-50 pt-24 sm:pt-36">
    <!-- Content -->
    <div class="container mx-auto px-4 sm:px-6 py-10 sm:py-16 max-w-3xl">
      <h2 class="text-3xl sm:text-4xl font-serif text-gray-900 mb-10 text-center">{{ t.legalnotice }}</h2>

      <div class="prose prose-gray max-w-none text-sm text-gray-600 leading-relaxed space-y-8">
        <section>
          <h3 class="text-lg font-semibold text-gray-800 mb-3">1. Website Publisher</h3>
          <p>This website is published by <strong>{{ info.name }}</strong>.</p>
          <p v-if="info.address">Address: {{ info.address }}<span v-if="info.city">, {{ info.city }}</span></p>
          <p v-if="info.phone">Phone: {{ info.phone }}</p>
          <p v-if="info.emails">Email: {{ info.emails }}</p>
        </section>

        <section>
          <h3 class="text-lg font-semibold text-gray-800 mb-3">2. Intellectual Property</h3>
          <p>All content on this website, including text, images, graphics, logos, and icons, is the property of {{ info.name }} or its content providers and is protected by intellectual property laws. Any reproduction, distribution, or use without prior written authorization is strictly prohibited.</p>
        </section>

        <section>
          <h3 class="text-lg font-semibold text-gray-800 mb-3">3. Limitation of Liability</h3>
          <p>{{ info.name }} makes every effort to ensure the accuracy of the information published on this website. However, we cannot guarantee the completeness or accuracy of all information. {{ info.name }} shall not be held liable for any direct or indirect damages resulting from the use of this website.</p>
        </section>

        <section>
          <h3 class="text-lg font-semibold text-gray-800 mb-3">4. External Links</h3>
          <p>This website may contain links to external websites. {{ info.name }} has no control over the content of these sites and assumes no responsibility for them.</p>
        </section>

        <section>
          <h3 class="text-lg font-semibold text-gray-800 mb-3">5. Applicable Law</h3>
          <p>This legal notice is governed by applicable local laws. Any disputes arising from the use of this website shall be subject to the exclusive jurisdiction of the competent courts.</p>
        </section>

        <p class="text-xs text-gray-400 pt-4">Last updated: {{ new Date().getFullYear() }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const { locale, localePath } = useLocale()
const { loadCatalogue, transStatic } = useTranslations()

const STATIC_KEYS = ['retour', 'legalnotice']
const t = ref(Object.fromEntries(STATIC_KEYS.map(k => [k, k])))
const info = ref({ name: '', address: '', city: '', phone: '', emails: '' })

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
</script>
