<template>
  <div class="bg-white">
    <TheHeader />
    <HeroSection />
    <AboutSection />
    <RoomsSection />
    <ReviewsSection />
    <ServicesSection />
    <GallerySection />
    <!-- <ContactSection /> -->
    <TheFooter />
  </div>
</template>

<script setup>
import TheHeader      from '../components/TheHeader.vue'
import TheFooter      from '../components/TheFooter.vue'
import HeroSection    from '../components/HeroSection.vue'
import AboutSection   from '../components/AboutSection.vue'
import RoomsSection   from '../components/RoomsSection.vue'
import ServicesSection from '../components/ServicesSection.vue'
import GallerySection from '../components/GallerySection.vue'
import ReviewsSection from '../components/ReviewsSection.vue'
import ContactSection from '../components/ContactSection.vue'
</script>
