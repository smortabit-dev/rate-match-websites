<template>
  <div class="bg-white min-h-screen">

    <!-- Full-screen hero (same pattern as gallery & rooms pages) -->
    <section class="relative h-screen min-h-[500px] flex flex-col overflow-hidden bg-[#111]">
      <transition name="t2-hero-img">
        <img v-if="room"
          :src="activeImage || room.image"
          :alt="room.name"
          class="absolute inset-0 w-full h-full object-cover"
        />
      </transition>
      <div class="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/55"></div>

      <!-- Centered title + breadcrumb -->
      <div class="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6">
        <p v-if="room?.category" class="text-[10px] uppercase tracking-[0.3em] text-[#C9A96E] mb-4">
          {{ room.category }}
        </p>
        <h1 class="font-['Cormorant_Garamond'] text-6xl sm:text-7xl text-white font-light mb-4">
          {{ room?.name || '' }}
        </h1>
        <nav class="flex items-center gap-2 text-white/60 text-xs tracking-[0.15em]">
          <NuxtLink :to="localePath('/')" class="hover:text-white transition-colors">Home</NuxtLink>
          <span class="text-white/30">/</span>
          <NuxtLink :to="localePath('/rooms')" class="hover:text-white transition-colors">Rooms</NuxtLink>
          <span class="text-white/30">/</span>
          <span class="text-white/80">{{ room?.name || '' }}</span>
        </nav>
      </div>

      <!-- Reservation bar pinned at bottom -->
      <div class="absolute bottom-0 left-0 right-0 z-10">
        <ReservationBar />
      </div>
    </section>

    <!-- Content -->
    <div v-if="room" class="max-w-7xl mx-auto px-6 py-16">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-16">

        <!-- Main content -->
        <div class="lg:col-span-2">
          <p class="text-[10px] uppercase tracking-[0.3em] text-[#C9A96E] mb-3">{{ room.category }}</p>
          <h2 class="font-['Cormorant_Garamond'] text-4xl sm:text-5xl text-[#111] font-light mb-4">{{ room.name }}</h2>
          <div class="w-10 h-px bg-[#C9A96E] mb-8"></div>
          <p class="text-[#111]/60 leading-relaxed mb-12">{{ room.longDescription || room.description }}</p>

          <!-- Room specs -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
            <div class="border border-[#111]/10 p-5 text-center">
              <Icon name="mdi:ruler" class="text-[#C9A96E] text-xl mb-2 block mx-auto" />
              <p class="text-[#111] text-sm">{{ room.size }} m²</p>
              <p class="text-[#111]/30 text-[10px] uppercase tracking-[0.15em] mt-0.5">Size</p>
            </div>
            <div class="border border-[#111]/10 p-5 text-center">
              <Icon name="mdi:account-group" class="text-[#C9A96E] text-xl mb-2 block mx-auto" />
              <p class="text-[#111] text-sm">{{ room.guests }}</p>
              <p class="text-[#111]/30 text-[10px] uppercase tracking-[0.15em] mt-0.5">Guests</p>
            </div>
            <div class="border border-[#111]/10 p-5 text-center">
              <Icon name="mdi:bed" class="text-[#C9A96E] text-xl mb-2 block mx-auto" />
              <p class="text-[#111] text-sm">{{ room.bedType || '—' }}</p>
              <p class="text-[#111]/30 text-[10px] uppercase tracking-[0.15em] mt-0.5">Bed</p>
            </div>
            <div class="border border-[#111]/10 p-5 text-center">
              <Icon name="mdi:window-open" class="text-[#C9A96E] text-xl mb-2 block mx-auto" />
              <p class="text-[#111] text-sm">{{ room.view || 'City' }}</p>
              <p class="text-[#111]/30 text-[10px] uppercase tracking-[0.15em] mt-0.5">View</p>
            </div>
          </div>

          <!-- Amenities -->
          <div v-if="room.features?.length" class="mb-12">
            <h3 class="text-[10px] uppercase tracking-[0.25em] text-[#C9A96E] mb-6">Amenities</h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div v-for="feat in room.features" :key="feat"
                class="flex items-center gap-2 text-[#111]/60 text-sm">
                <Icon name="mdi:check" class="text-[#C9A96E] text-sm flex-shrink-0" />
                {{ feat }}
              </div>
            </div>
          </div>

          <!-- Image gallery thumbnails -->
          <div v-if="room.images?.length > 1">
            <h3 class="text-[10px] uppercase tracking-[0.25em] text-[#C9A96E] mb-6">Photos</h3>
            <div class="grid grid-cols-3 sm:grid-cols-4 gap-2">
              <button v-for="(img, i) in room.images.slice(0, 8)" :key="i"
                @click="activeImage = img"
                class="aspect-[4/3] overflow-hidden border-2 transition-colors"
                :class="activeImage === img ? 'border-[#C9A96E]' : 'border-transparent'">
                <img :src="img" :alt="`${room.name} ${i + 1}`"
                  class="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
              </button>
            </div>
          </div>
        </div>

        <!-- Sticky booking panel -->
        <div class="lg:col-span-1">
          <div class="sticky top-28 bg-[#F5F5F5] p-8">
            <p class="text-[9px] uppercase tracking-[0.25em] text-[#C9A96E] mb-2">From</p>
            <p v-if="room.price" class="font-['Cormorant_Garamond'] text-[#111] text-4xl font-light mb-1">
              {{ room.price }}
            </p>
            <p class="text-[#111]/30 text-xs mb-8">per night, taxes included</p>
            <div class="w-full h-px bg-[#C9A96E]/30 mb-8"></div>
            <NuxtLink :to="localePath('/availibility')"
              class="block text-center py-4 bg-[#C9A96E] text-[#0A0A0A] text-[11px] uppercase tracking-[0.2em] font-semibold hover:bg-[#E8D5A3] transition-all mb-4">
              Book This Room
            </NuxtLink>
            <NuxtLink :to="localePath('/contact')"
              class="block text-center py-4 border border-[#111]/20 text-[#111]/60 text-[11px] uppercase tracking-[0.2em] hover:border-[#111] hover:text-[#111] transition-all">
              Ask a Question
            </NuxtLink>
          </div>
        </div>

      </div>
    </div>

    <!-- Loading skeleton -->
    <div v-else class="flex items-center justify-center py-32">
      <div class="w-10 h-10 border-2 border-[#C9A96E] border-t-transparent rounded-full animate-spin"></div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const route = useRoute()
const { locale, localePath } = useLocale()
const room        = ref(null)
const activeImage = ref('')

onMounted(async () => {
  const { fetchRooms } = useHotel()
  const rooms = await fetchRooms(locale.value)
  room.value = rooms.find(r => r.slug === route.params.slug) || null
  if (room.value?.images?.length) activeImage.value = room.value.images[0]
  else if (room.value?.image)     activeImage.value = room.value.image
})
</script>

<style scoped>
.t2-hero-img-enter-active { transition: opacity 0.6s ease; }
.t2-hero-img-enter-from   { opacity: 0; }
</style>
