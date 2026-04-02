<template>
  <div class="bg-black text-white">
    <!-- Hero Section -->
    <section class="relative h-[60vh]">
      <div class="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920"
          alt="Rooms & Suites"
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50"></div>
      </div>

      <div class="relative z-10 container mx-auto px-4 h-full flex items-center justify-center">
        <div class="text-center">
          <h1 class="text-6xl md:text-8xl font-black uppercase mb-6">
            <span class="text-vibrant">ROOMS</span> & SUITES
          </h1>
          <p class="text-2xl font-bold uppercase tracking-wider">Your Urban Sanctuary Awaits</p>
        </div>
      </div>
    </section>

    <!-- Filter Bar -->
    <section class="bg-white/5 backdrop-blur-sm border-b border-white/10 sticky top-20 z-10">
      <div class="container mx-auto px-4 py-6">
        <div class="flex flex-wrap items-center gap-6">
          <!-- Filters -->
          <div class="flex-1 flex flex-wrap items-center gap-4">
            <div>
              <label class="text-xs font-black uppercase tracking-wider mb-2 block text-vibrant">Category</label>
              <select v-model="filters.category" class="px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white font-bold focus:outline-none focus:border-vibrant">
                <option value="all">All Rooms</option>
                <option value="urban">Urban</option>
                <option value="premium">Premium</option>
                <option value="deluxe">Deluxe</option>
                <option value="suite">Suites</option>
              </select>
            </div>

            <div>
              <label class="text-xs font-black uppercase tracking-wider mb-2 block text-vibrant">Guests</label>
              <select v-model="filters.guests" class="px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white font-bold focus:outline-none focus:border-vibrant">
                <option value="any">Any</option>
                <option value="1">1 Guest</option>
                <option value="2">2 Guests</option>
                <option value="3">3+ Guests</option>
              </select>
            </div>

            <div>
              <label class="text-xs font-black uppercase tracking-wider mb-2 block text-vibrant">Price Range</label>
              <select v-model="filters.price" class="px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white font-bold focus:outline-none focus:border-vibrant">
                <option value="all">All Prices</option>
                <option value="budget">Under €250</option>
                <option value="mid">€250 - €350</option>
                <option value="luxury">€350+</option>
              </select>
            </div>

            <div>
              <label class="text-xs font-black uppercase tracking-wider mb-2 block text-vibrant">View</label>
              <select v-model="filters.view" class="px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white font-bold focus:outline-none focus:border-vibrant">
                <option value="all">All Views</option>
                <option value="city">City</option>
                <option value="skyline">Skyline</option>
                <option value="panoramic">Panoramic</option>
              </select>
            </div>
          </div>

          <button @click="resetFilters" class="text-vibrant hover:text-red-500 font-black text-sm uppercase tracking-wider">
            Reset All
          </button>
        </div>
      </div>
    </section>

    <!-- Results Count -->
    <section class="py-6 bg-white/5">
      <div class="container mx-auto px-4">
        <p class="text-center font-bold uppercase text-sm">
          Showing <span class="text-vibrant text-xl font-black">{{ filteredRooms.length }}</span> of <span class="font-black">{{ allRooms.length }}</span> rooms
        </p>
      </div>
    </section>

    <!-- Rooms Grid -->
    <section class="py-20">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <div
            v-for="room in filteredRooms"
            :key="room.id"
            class="group"
          >
            <!-- Image -->
            <div class="relative aspect-[4/3] overflow-hidden rounded-2xl mb-6 shadow-2xl">
              <img
                :src="room.image"
                :alt="room.name"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>

              <!-- Category Badge -->
              <div class="absolute top-6 left-6 bg-vibrant px-5 py-2 rounded-full font-black uppercase text-sm">
                {{ room.category }}
              </div>

              <!-- Price Badge -->
              <div class="absolute top-6 right-6 bg-black/80 backdrop-blur-sm px-5 py-3 rounded-full">
                <div class="text-2xl font-black">€{{ room.price }}</div>
                <div class="text-xs">/ night</div>
              </div>
            </div>

            <!-- Content -->
            <div class="space-y-4">
              <h3 class="text-3xl font-black uppercase group-hover:text-vibrant transition-colors">
                {{ room.name }}
              </h3>

              <p class="text-gray-400 line-clamp-2 font-bold">{{ room.description }}</p>

              <!-- Features Grid -->
              <div class="grid grid-cols-2 gap-3 py-4 border-t border-white/10">
                <div class="flex items-center space-x-2">
                  <Icon name="mdi:ruler" class="text-vibrant text-xl" />
                  <span class="font-bold text-sm">{{ room.size }}m²</span>
                </div>
                <div class="flex items-center space-x-2">
                  <Icon name="mdi:account-multiple" class="text-vibrant text-xl" />
                  <span class="font-bold text-sm">{{ room.guests }} Guests</span>
                </div>
                <div class="flex items-center space-x-2">
                  <Icon name="mdi:bed" class="text-vibrant text-xl" />
                  <span class="font-bold text-sm">{{ room.bedType }}</span>
                </div>
                <div class="flex items-center space-x-2">
                  <Icon name="mdi:window-open" class="text-vibrant text-xl" />
                  <span class="font-bold text-sm">{{ room.view }}</span>
                </div>
              </div>

              <!-- Amenities Icons -->
              <div class="flex items-center gap-4 py-4 border-t border-white/10">
                <Icon name="mdi:wifi" class="text-2xl text-gray-500" />
                <Icon name="mdi:air-conditioner" class="text-2xl text-gray-500" />
                <Icon name="mdi:television" class="text-2xl text-gray-500" />
                <Icon name="mdi:room-service" class="text-2xl text-gray-500" />
                <Icon name="mdi:speaker" class="text-2xl text-gray-500" />
              </div>

              <!-- Buttons -->
              <div class="flex gap-3 pt-2">
                <NuxtLink
                  :to="`/rooms/${room.slug}`"
                  class="flex-1 text-center bg-vibrant text-white py-4 px-6 rounded-full font-black uppercase text-sm hover:bg-red-600 transition-all transform hover:scale-105"
                >
                  View Details
                </NuxtLink>
                <button class="flex-1 bg-white text-black py-4 px-6 rounded-full font-black uppercase text-sm hover:bg-gray-200 transition-all">
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- No Results -->
        <div v-if="filteredRooms.length === 0" class="text-center py-20">
          <Icon name="mdi:bed-empty" class="text-6xl text-gray-600 mb-6" />
          <h3 class="text-4xl font-black uppercase mb-4">
            <span class="text-vibrant">NO</span> ROOMS FOUND
          </h3>
          <p class="text-gray-400 mb-8 font-bold">Try adjusting your filters</p>
          <button @click="resetFilters" class="bg-vibrant text-white px-10 py-4 rounded-full font-black uppercase hover:bg-red-600 transition-all">
            Reset Filters
          </button>
        </div>
      </div>
    </section>

    <!-- Special Offers -->
    <section class="py-20 bg-white/5">
      <div class="container mx-auto px-4">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-5xl font-black uppercase mb-4">
              <span class="text-vibrant">SPECIAL</span> OFFERS
            </h2>
            <p class="text-xl font-bold uppercase text-gray-400">Exclusive packages & deals</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Offer 1 -->
            <div class="bg-vibrant rounded-2xl p-10 relative overflow-hidden">
              <div class="absolute top-0 right-0 bg-black text-white px-6 py-3 font-black text-lg">
                -30%
              </div>
              <h3 class="text-4xl font-black uppercase mb-4 mt-8">EARLY BIRD</h3>
              <div class="h-1 w-20 bg-white rounded-full mb-6"></div>
              <p class="text-lg mb-6 leading-relaxed">Book 60 days in advance and save 30%. Includes welcome drink and late check-out.</p>
              <ul class="space-y-3 mb-8">
                <li class="flex items-center font-bold">
                  <Icon name="mdi:check-circle" class="mr-3 text-2xl" />
                  30% discount
                </li>
                <li class="flex items-center font-bold">
                  <Icon name="mdi:check-circle" class="mr-3 text-2xl" />
                  Welcome cocktail
                </li>
                <li class="flex items-center font-bold">
                  <Icon name="mdi:check-circle" class="mr-3 text-2xl" />
                  Late check-out 2PM
                </li>
              </ul>
              <button class="bg-black text-white px-10 py-4 rounded-full font-black uppercase hover:bg-gray-900 transition-all">
                Book Now
              </button>
            </div>

            <!-- Offer 2 -->
            <div class="bg-gradient-to-br from-black to-gray-900 rounded-2xl p-10 border-2 border-vibrant relative overflow-hidden">
              <div class="absolute top-0 right-0 bg-vibrant text-white px-6 py-3 font-black text-lg">
                VIP
              </div>
              <h3 class="text-4xl font-black uppercase mb-4 mt-8">URBAN EXPERIENCE</h3>
              <div class="h-1 w-20 bg-vibrant rounded-full mb-6"></div>
              <p class="text-lg mb-6 leading-relaxed text-gray-300">Stay 3 nights and enjoy exclusive city experiences, rooftop access, and premium amenities.</p>
              <ul class="space-y-3 mb-8">
                <li class="flex items-center font-bold">
                  <Icon name="mdi:check-circle" class="mr-3 text-2xl text-vibrant" />
                  Rooftop bar access
                </li>
                <li class="flex items-center font-bold">
                  <Icon name="mdi:check-circle" class="mr-3 text-2xl text-vibrant" />
                  City tour included
                </li>
                <li class="flex items-center font-bold">
                  <Icon name="mdi:check-circle" class="mr-3 text-2xl text-vibrant" />
                  Room upgrade
                </li>
              </ul>
              <button class="bg-vibrant text-white px-10 py-4 rounded-full font-black uppercase hover:bg-red-600 transition-all">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-20">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-5xl font-black uppercase mb-6">
          <span class="text-vibrant">READY</span> TO BOOK?
        </h2>
        <p class="text-xl font-bold uppercase text-gray-400 mb-8">Experience the ONLY YOU difference</p>
        <button class="bg-vibrant text-white px-12 py-5 rounded-full font-black uppercase text-lg hover:bg-red-600 transition-all transform hover:scale-105">
          BOOK YOUR STAY
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const filters = ref({
  category: 'all',
  guests: 'any',
  price: 'all',
  view: 'all'
})

const allRooms = [
  {
    id: 1,
    slug: 'urban-room',
    name: 'Urban Room',
    category: 'URBAN',
    size: 28,
    guests: 2,
    bedType: 'Double Bed',
    view: 'City View',
    price: 195,
    description: 'Bold and vibrant spaces designed for the modern traveler. Contemporary design meets local culture.',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'
  },
  {
    id: 2,
    slug: 'premium-room',
    name: 'Premium Room',
    category: 'PREMIUM',
    size: 32,
    guests: 2,
    bedType: 'King Bed',
    view: 'Skyline',
    price: 245,
    description: 'Elevated comfort with exclusive amenities. Experience urban luxury at its finest.',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'
  },
  {
    id: 3,
    slug: 'deluxe-room',
    name: 'Deluxe Room',
    category: 'DELUXE',
    size: 38,
    guests: 3,
    bedType: 'King Bed',
    view: 'Panoramic',
    price: 295,
    description: 'Spacious luxury with personality. Perfect for discerning travelers seeking more.',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'
  },
  {
    id: 4,
    slug: 'signature-suite',
    name: 'Signature Suite',
    category: 'SUITE',
    size: 58,
    guests: 4,
    bedType: 'King + Sofa',
    view: '360° View',
    price: 495,
    description: 'The ultimate ONLY YOU experience. Expansive living with bold design and unforgettable views.',
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800'
  },
  {
    id: 5,
    slug: 'junior-suite',
    name: 'Junior Suite',
    category: 'SUITE',
    size: 45,
    guests: 2,
    bedType: 'King Bed',
    view: 'City View',
    price: 375,
    description: 'Sophisticated suite with separate living area. Urban elegance redefined.',
    image: 'https://images.unsplash.com/photo-1615880484746-a134be9a6ecf?w=800'
  },
  {
    id: 6,
    slug: 'penthouse-suite',
    name: 'Penthouse Suite',
    category: 'SUITE',
    size: 85,
    guests: 4,
    bedType: 'King + Queen',
    view: 'Panoramic',
    price: 795,
    description: 'Our crown jewel. Private terrace, expansive views, and unparalleled luxury.',
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800'
  }
]

const filteredRooms = computed(() => {
  return allRooms.filter(room => {
    if (filters.value.category !== 'all' && room.category.toLowerCase() !== filters.value.category) {
      return false
    }
    if (filters.value.guests !== 'any') {
      const guestNum = parseInt(filters.value.guests)
      if (guestNum === 3 && room.guests < 3) return false
      if (guestNum < 3 && room.guests !== guestNum) return false
    }
    if (filters.value.price !== 'all') {
      if (filters.value.price === 'budget' && room.price >= 250) return false
      if (filters.value.price === 'mid' && (room.price < 250 || room.price >= 350)) return false
      if (filters.value.price === 'luxury' && room.price < 350) return false
    }
    if (filters.value.view !== 'all') {
      const viewMatch = room.view.toLowerCase().includes(filters.value.view.toLowerCase())
      if (!viewMatch) return false
    }
    return true
  })
})

const resetFilters = () => {
  filters.value = { category: 'all', guests: 'any', price: 'all', view: 'all' }
}

useHead({
  title: 'Rooms & Suites - Only YOU Hotels',
  meta: [{ name: 'description', content: 'Discover our bold and vibrant rooms and suites.' }]
})
</script>
