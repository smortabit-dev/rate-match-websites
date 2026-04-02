<template>
  <section class="relative h-screen min-h-[600px] flex flex-col overflow-hidden bg-[#0A0A0A]">

    <!-- Video background -->
    <video v-if="videoSrc"
      :src="videoSrc"
      :poster="posterSrc"
      autoplay muted loop playsinline
      class="absolute inset-0 w-full h-full object-cover"
    ></video>

    <!-- Fallback image -->
    <img v-else-if="posterSrc"
      :src="posterSrc"
      :alt="hotelName"
      class="absolute inset-0 w-full h-full object-cover"
    />

    <!-- Very subtle gradient — only bottom fade for the booking bar -->
    <div class="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/55"></div>

    <!-- Reservation bar pinned at bottom -->
    <div class="absolute bottom-0 left-0 right-0 z-10">
      <ReservationBar />
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const videoSrc  = ref('')
const posterSrc = ref('')
const hotelName = ref('Hotel')

onMounted(async () => {
  const { fetchGallery, fetchHotelData, fetchHotelInfo } = useHotel()
  
  const [hotelData, info, gallery] = await Promise.all([
    fetchHotelData(), fetchHotelInfo(), fetchGallery()
  ])
  const etab = hotelData?.etablissment || {}
  videoSrc.value  = etab.video || 'https://vz-f039b225-dfa.b-cdn.net/e45edabd-c11b-4f47-94fb-f5c15083aa7f/play_1080p.mp4'
  posterSrc.value = gallery[0]?.url || ''
  hotelName.value = info.name || etab.etablissementNom || 'Hotel'
})
</script>
