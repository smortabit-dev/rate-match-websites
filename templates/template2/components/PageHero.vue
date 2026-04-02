<template>
  <section class="relative h-screen min-h-[500px] flex flex-col overflow-hidden bg-[#111]">

    <!-- Hero image -->
    <transition name="t2-hero-img">
      <img v-if="image"
        :src="image"
        :alt="title"
        class="absolute inset-0 w-full h-full object-cover"
      />
    </transition>

    <!-- Overlay -->
    <div class="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/55"></div>

    <!-- Centered title + breadcrumb -->
    <div class="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6">
      <h1 class="font-['Cormorant_Garamond'] text-6xl sm:text-7xl text-white font-light mb-4">
        {{ title }}
      </h1>
      <nav class="flex items-center gap-2 text-white/60 text-xs tracking-[0.15em]">
        <NuxtLink :to="localePath('/')" class="hover:text-white transition-colors">Home</NuxtLink>
        <span class="text-white/30">/</span>
        <span class="text-white/80">{{ title }}</span>
      </nav>
    </div>

    <!-- Reservation bar pinned at bottom -->
    <div class="absolute bottom-0 left-0 right-0 z-10">
      <ReservationBar />
    </div>
  </section>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  image: { type: String, default: '' },
})

const { localePath } = useLocale()
</script>

<style scoped>
.t2-hero-img-enter-active { transition: opacity 0.6s ease; }
.t2-hero-img-enter-from   { opacity: 0; }
</style>
