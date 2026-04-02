<template>
  <div class="bg-white min-h-screen">
    <PageHero title="Facilities" :image="heroImg" />

    <div class="max-w-7xl mx-auto px-6 py-14">

      <!-- Section header -->
      <div class="mb-12">
        <p class="text-[10px] uppercase tracking-[0.3em] text-[#C9A96E] mb-4">Amenities</p>
        <h2 class="font-['Cormorant_Garamond'] text-4xl sm:text-5xl text-[#111] font-light">Our Facilities</h2>
        <div class="w-10 h-px bg-[#C9A96E] mt-6"></div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">

        <!-- Left: category sidebar -->
        <div class="lg:col-span-3">
          <nav class="sticky top-28 space-y-1">
            <button
              v-for="cat in categories"
              :key="cat.id"
              @click="selected = cat.id"
              class="w-full text-left px-5 py-3 text-[10px] uppercase tracking-[0.2em] transition-all border-l-2"
              :class="selected === cat.id
                ? 'border-[#C9A96E] text-[#C9A96E] bg-[#F5F5F5]'
                : 'border-transparent text-[#111]/40 hover:text-[#111] hover:border-[#111]/20'">
              {{ cat.name }}
            </button>
          </nav>
        </div>

        <!-- Right: facilities grid -->
        <div class="lg:col-span-9">
          <div class="mb-8">
            <h3 class="font-['Cormorant_Garamond'] text-3xl text-[#111] font-light">
              {{ currentCategory.name }}
            </h3>
            <div class="w-8 h-px bg-[#C9A96E] mt-4"></div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              v-for="item in filteredFacilities"
              :key="item.name"
              class="flex items-start gap-4 p-5 border border-[#111]/8 hover:border-[#C9A96E]/40 transition-colors group">
              <div class="w-10 h-10 border border-[#C9A96E]/30 flex items-center justify-center flex-shrink-0 group-hover:border-[#C9A96E] transition-colors">
                <Icon :name="item.icon" class="text-[#C9A96E] text-base" />
              </div>
              <div>
                <p class="text-[#111] text-sm font-medium">{{ item.name }}</p>
                <p v-if="item.note" class="text-[#111]/40 text-xs mt-1">{{ item.note }}</p>
              </div>
            </div>
          </div>

          <!-- Dot indicators -->
          <div class="flex gap-2 mt-10">
            <button
              v-for="cat in categories"
              :key="cat.id"
              @click="selected = cat.id"
              class="h-1 rounded-full transition-all duration-300"
              :class="selected === cat.id ? 'bg-[#C9A96E] w-6' : 'bg-[#111]/15 w-1.5'" />
          </div>
        </div>
      </div>

      <!-- CTA -->
      <div class="mt-20 text-center border-t border-[#111]/10 pt-16">
        <p class="text-[10px] uppercase tracking-[0.3em] text-[#C9A96E] mb-4">Ready to Experience It?</p>
        <h3 class="font-['Cormorant_Garamond'] text-4xl text-[#111] font-light mb-8">
          Reserve Your Stay
        </h3>
        <NuxtLink :to="localePath('/availibility')"
          class="inline-block px-12 py-4 border border-[#C9A96E] text-[#C9A96E] text-[10px] uppercase tracking-[0.3em] hover:bg-[#C9A96E] hover:text-black transition-all">
          Book Now
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const { localePath } = useLocale()

const heroImg  = ref('')
const selected = ref('general')

const categories = [
  { id: 'general',    name: 'General' },
  { id: 'food',       name: 'Food & Drink' },
  { id: 'wellness',   name: 'Wellness' },
  { id: 'bedroom',    name: 'Bedroom' },
  { id: 'outdoors',   name: 'Outdoors' },
  { id: 'amenities',  name: 'Room Amenities' },
  { id: 'pets',       name: 'Pets' },
  { id: 'activities', name: 'Activities' },
  { id: 'media',      name: 'Media & Technology' },
  { id: 'internet',   name: 'Internet' },
]

const facilities = [
  // General
  { category: 'general',    name: 'Room service',               icon: 'mdi:room-service' },
  { category: 'general',    name: 'Heating',                    icon: 'mdi:radiator' },
  { category: 'general',    name: 'Lift',                       icon: 'mdi:elevator' },
  { category: 'general',    name: 'Family rooms',               icon: 'mdi:human-male-female-child' },
  { category: 'general',    name: 'Barber / beauty shop',       icon: 'mdi:content-cut' },
  { category: 'general',    name: 'Airport shuttle',            icon: 'mdi:airplane', note: 'Additional charge' },
  { category: 'general',    name: 'Non-smoking rooms',          icon: 'mdi:smoking-off' },
  { category: 'general',    name: 'Wake up service / Alarm',    icon: 'mdi:alarm' },
  { category: 'general',    name: 'Tile / marble floor',        icon: 'mdi:texture-box' },
  // Food & Drink
  { category: 'food',       name: 'Restaurant',                 icon: 'mdi:silverware-fork-knife' },
  { category: 'food',       name: 'Room service',               icon: 'mdi:room-service' },
  { category: 'food',       name: 'Bar',                        icon: 'mdi:glass-cocktail' },
  { category: 'food',       name: 'Breakfast in the room',      icon: 'mdi:coffee' },
  { category: 'food',       name: 'Mini bar',                   icon: 'mdi:fridge' },
  { category: 'food',       name: 'Tea / Coffee maker',         icon: 'mdi:coffee-maker' },
  // Wellness
  { category: 'wellness',   name: 'Fitness center',             icon: 'mdi:dumbbell' },
  { category: 'wellness',   name: 'Spa and wellness center',    icon: 'mdi:spa' },
  { category: 'wellness',   name: 'Massage',                    icon: 'mdi:hand-heart', note: 'Additional charge' },
  { category: 'wellness',   name: 'Hot tub / Jacuzzi',          icon: 'mdi:hot-tub' },
  { category: 'wellness',   name: 'Sauna',                      icon: 'mdi:thermometer' },
  // Bedroom
  { category: 'bedroom',    name: 'Linen',                      icon: 'mdi:bed' },
  { category: 'bedroom',    name: 'Wardrobe or closet',         icon: 'mdi:wardrobe' },
  { category: 'bedroom',    name: 'Extra long beds',            icon: 'mdi:bed-king' },
  { category: 'bedroom',    name: 'Hypoallergenic',             icon: 'mdi:allergy' },
  // Outdoors
  { category: 'outdoors',   name: 'Terrace',                    icon: 'mdi:balcony' },
  { category: 'outdoors',   name: 'Garden',                     icon: 'mdi:flower' },
  { category: 'outdoors',   name: 'Outdoor furniture',          icon: 'mdi:table-furniture' },
  // Room Amenities
  { category: 'amenities',  name: 'Private bathroom',           icon: 'mdi:shower' },
  { category: 'amenities',  name: 'Free toiletries',            icon: 'mdi:bottle-tonic' },
  { category: 'amenities',  name: 'Hairdryer',                  icon: 'mdi:hair-dryer' },
  { category: 'amenities',  name: 'Bathrobe',                   icon: 'mdi:hanger' },
  { category: 'amenities',  name: 'Air conditioning',           icon: 'mdi:air-conditioner' },
  { category: 'amenities',  name: 'Iron',                       icon: 'mdi:iron' },
  { category: 'amenities',  name: 'Desk',                       icon: 'mdi:desk' },
  { category: 'amenities',  name: 'Safe',                       icon: 'mdi:safe' },
  // Pets
  { category: 'pets',       name: 'Pets allowed',               icon: 'mdi:paw', note: 'Additional charge' },
  // Activities
  { category: 'activities', name: 'Evening entertainment',      icon: 'mdi:ticket' },
  { category: 'activities', name: 'Library',                    icon: 'mdi:book-open-page-variant' },
  // Media & Technology
  { category: 'media',      name: 'Flat-screen TV',             icon: 'mdi:television' },
  { category: 'media',      name: 'Telephone',                  icon: 'mdi:phone' },
  { category: 'media',      name: 'Satellite channels',         icon: 'mdi:satellite-variant' },
  // Internet
  { category: 'internet',   name: 'WiFi available in all areas', icon: 'mdi:wifi' },
  { category: 'internet',   name: 'Free WiFi',                  icon: 'mdi:wifi-check' },
]

const currentCategory   = computed(() => categories.find(c => c.id === selected.value) || categories[0])
const filteredFacilities = computed(() => facilities.filter(f => f.category === selected.value))

onMounted(async () => {
  const { fetchGallery } = useHotel()
  const gallery = await fetchGallery()
  heroImg.value = gallery[4]?.url || gallery[0]?.url || ''
})
</script>
