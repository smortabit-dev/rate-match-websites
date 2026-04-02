<template>
  <section class="relative h-[60vh] min-h-[400px] flex items-end overflow-hidden bg-[#1a1410]">
    <img v-if="image" :src="image" :alt="title"
      class="absolute inset-0 w-full h-full object-cover" />
    <div class="absolute inset-0 bg-gradient-to-t from-[#1a1410] via-[#1a1410]/40 to-[#1a1410]/10"></div>
    <!-- Moroccan-inspired decorative line -->
    <div class="absolute top-1/2 left-0 right-0 flex items-center justify-center pointer-events-none">
      <div class="w-16 h-px bg-[#b7825c]/30"></div>
      <div class="w-2 h-2 border border-[#b7825c]/30 rotate-45 mx-3 flex-shrink-0"></div>
      <div class="w-16 h-px bg-[#b7825c]/30"></div>
    </div>
    <div class="relative z-10 w-full max-w-7xl mx-auto px-8 pb-14">
      <p v-if="subtitle" class="text-[10px] uppercase tracking-[0.35em] text-[#b7825c] mb-3">{{ subtitle }}</p>
      <h1 class="font-['Cormorant_Garamond'] text-5xl sm:text-6xl text-white font-light mb-4">{{ title }}</h1>
      <nav class="flex items-center gap-2 text-white/50 text-xs tracking-[0.1em]">
        <NuxtLink :to="localePath('/')" class="hover:text-[#b7825c] transition-colors">Home</NuxtLink>
        <span>/</span>
        <span class="text-white/80">{{ title }}</span>
      </nav>
    </div>
  </section>
</template>

<script setup>
const { localePath } = useLocale()
defineProps({ title: String, subtitle: String, image: String })
</script>
