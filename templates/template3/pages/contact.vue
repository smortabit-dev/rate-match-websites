<template>
  <div class="bg-[#f4ece6] min-h-screen">
    <TheHeader />
    <PageHero title="Contact" subtitle="Get in Touch" :image="heroImg" />
    <ContactSection />
    <!-- Map placeholder -->
    <div v-if="lat && lng" class="h-[400px] w-full bg-[#f4ece6]">
      <iframe
        :src="`https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`"
        class="w-full h-full border-0"
        allowfullscreen
        loading="lazy">
      </iframe>
    </div>
    <TheFooter />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import TheHeader      from '../components/TheHeader.vue'
import TheFooter      from '../components/TheFooter.vue'
import PageHero       from '../components/PageHero.vue'
import ContactSection from '../components/ContactSection.vue'

const heroImg = ref('')
const lat     = ref(null)
const lng     = ref(null)

onMounted(async () => {
  const { fetchHotelInfo, fetchGallery } = useHotel()
  const [info, gallery] = await Promise.all([fetchHotelInfo(), fetchGallery()])
  heroImg.value = gallery[6]?.url || gallery[0]?.url || ''
  lat.value = info.latitude
  lng.value = info.longitude
})
</script>
