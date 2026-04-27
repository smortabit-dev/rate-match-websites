<template>
  <div class="template4-root">
    <!-- Header/Footer are handled by layout but we might need specific ones or T4 specific names -->
    <HeroAbout />
    <RoomsCarousel />
    <FacilitiesSection />
    <CommentsSection />
    <SurroundingsSection />
    <ServicesCarousel />
    <GalleryGrid />
    <ContactSection />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import HeroAbout from '../components/HeroAbout.vue'
import RoomsCarousel from '../components/RoomsCarousel.vue'
import FacilitiesSection from '../components/FacilitiesSection.vue'
import CommentsSection from '../components/CommentsSection.vue'
import SurroundingsSection from '../components/SurroundingsSection.vue'
import ServicesCarousel from '../components/ServicesCarousel.vue'
import GalleryGrid from '../components/GalleryGrid.vue'
import ContactSection from '../components/ContactSection.vue'

useHead({
  title: 'Premium Hotel Experience',
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&display=swap');

.template4-root {
  font-family: 'Outfit', sans-serif;
}

.template4-root h1, 
.template4-root h2, 
.template4-root h3, 
.template4-root h4, 
.template4-root .font-serif {
  font-family: 'Playfair Display', serif;
}

/* Custom transitions and scroll margins */
html {
  scroll-behavior: smooth;
  scroll-padding-top: 80px;
}
</style>
