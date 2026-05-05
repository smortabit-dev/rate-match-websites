<template>
  <div class="template4-root pt-20">
    <div v-if="room" class="container mx-auto px-6 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <!-- Room Photos -->
        <div class="space-y-6">
          <div class="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
            <img :src="room.image" :alt="room.name" class="w-full h-full object-cover" />
          </div>
          <div class="grid grid-cols-3 gap-4">
            <div v-for="(img, idx) in (room.images || []).slice(1, 4)" :key="idx" class="aspect-square rounded-2xl overflow-hidden shadow-md">
              <img :src="img" class="w-full h-full object-cover hover:scale-110 transition-transform cursor-pointer" />
            </div>
          </div>
        </div>

        <!-- Room Info -->
        <div class="flex flex-col justify-center">
          <p class="text-blue-600 font-bold uppercase tracking-[0.2em] mb-4">{{ room.category }}</p>
          <h1 class="text-5xl font-serif font-bold text-[#002B5B] mb-8">{{ room.name }}</h1>
          
          <div class="prose prose-blue max-w-none text-gray-600 mb-12" v-html="room.description"></div>

          <div class="bg-[#f8faff] rounded-3xl p-8 border border-blue-100 mb-12">
            <h3 class="text-xl font-bold text-[#002B5B] mb-6">Room Amenities</h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-6">
              <div v-for="(amenity, idx) in room.amenities" :key="idx" class="flex items-center gap-3 text-sm text-gray-700">
                <Icon name="mdi:check-circle" class="text-blue-500" />
                {{ amenity }}
              </div>
            </div>
          </div>

          <button @click="openReservation" class="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold uppercase tracking-widest transition-all shadow-lg hover:shadow-blue-200">
            Check Availability
          </button>
        </div>
      </div>
    </div>
    <div v-else class="min-h-screen flex items-center justify-center">
       <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const { locale } = useLocale()
const { fetchRoom } = useHotel()
const route = useRoute()

const room = ref(null)

onMounted(async () => {
  const data = await fetchRoom(route.params.slug, locale.value)
  if (data) room.value = data
})

const openReservation = () => {
  if (typeof window !== 'undefined' && window.openReservation) {
    window.openReservation()
  }
}
</script>

<style scoped>
.template4-root {
  font-family: 'Outfit', sans-serif;
}
.font-serif {
  font-family: 'Playfair Display', serif;
}
</style>
