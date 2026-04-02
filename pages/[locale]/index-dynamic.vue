<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-gold mx-auto mb-4"></div>
        <p class="text-gray-600">Loading hotel information...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button @click="loadData" class="btn-secondary">Retry</button>
      </div>
    </div>

    <!-- Content -->
    <div v-else>
      <!-- Hero Section with Dynamic Data -->
      <HeroCarousel :images="heroImages" />

      <!-- Introduction Section -->
      <section class="py-20 bg-white">
        <div class="container mx-auto px-4">
          <div class="max-w-4xl mx-auto text-center">
            <h1 class="section-title mb-6">
              {{ siteInfo?.name || 'A Boutique Escape Steps from Bryant Park' }}
            </h1>
            <p class="text-lg text-gray-700 leading-relaxed mb-8">
              {{ siteInfo?.description || 'Set in a meticulously restored Beaux-Arts building...' }}
            </p>
            <NuxtLink to="/rooms-and-suites" class="btn-secondary inline-block">
              Learn More
            </NuxtLink>
          </div>
        </div>
      </section>

      <!-- Dynamic Rooms Section -->
      <section class="py-20 bg-gray-50">
        <div class="container mx-auto px-4">
          <div class="text-center mb-12">
            <h2 class="text-4xl font-serif mb-4">Our Rooms & Suites</h2>
            <p class="text-xl text-gray-600">Experience luxury and comfort</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Dynamically render rooms from API -->
            <div v-for="room in featuredRooms" :key="room.id" class="group cursor-pointer">
              <div class="relative h-96 overflow-hidden mb-6">
                <img 
                  :src="room.image || room.images?.[0] || '/images/placeholder-room.jpg'"
                  :alt="room.name"
                  class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div v-if="room.price" class="absolute bottom-4 right-4 bg-white bg-opacity-90 px-4 py-2 rounded">
                  <p class="text-sm text-gray-600">From</p>
                  <p class="text-2xl font-bold text-gold">${{ room.price }}</p>
                  <p class="text-xs text-gray-500">per night</p>
                </div>
              </div>
              <h3 class="text-2xl font-serif mb-3">{{ room.name }}</h3>
              <p class="text-gray-600 mb-4">{{ room.shortDescription || room.description }}</p>
              <NuxtLink :to="`/rooms/${room.id || room.slug}`" class="text-gold hover:text-gold-dark font-semibold inline-flex items-center">
                Learn more
                <Icon name="mdi:arrow-right" class="ml-2" />
              </NuxtLink>
            </div>
          </div>

          <div class="text-center mt-12">
            <NuxtLink to="/rooms-and-suites" class="btn-secondary">
              View All Rooms
            </NuxtLink>
          </div>
        </div>
      </section>

      <!-- Dynamic Offers Section -->
      <section v-if="offers && offers.length > 0" class="py-20 bg-white">
        <div class="container mx-auto px-4">
          <div class="text-center mb-12">
            <h2 class="text-4xl font-serif mb-4">Special Offers</h2>
            <p class="text-xl text-gray-600">Exclusive packages for your stay</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div v-for="offer in offers" :key="offer.id" class="bg-gray-50 p-8 rounded-lg">
              <h3 class="text-2xl font-serif mb-3">{{ offer.title }}</h3>
              <p class="text-gray-600 mb-4">{{ offer.description }}</p>
              <div v-if="offer.discount" class="text-gold text-lg font-bold mb-4">
                Save {{ offer.discount }}%
              </div>
              <NuxtLink :to="`/offers/${offer.id || offer.slug}`" class="btn-secondary inline-block">
                Learn More
              </NuxtLink>
            </div>
          </div>
        </div>
      </section>

      <!-- Contact Section with Dynamic Data -->
      <section class="py-20 bg-gray-900 text-white">
        <div class="container mx-auto px-4">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 class="text-4xl font-serif mb-6">Visit Us</h2>
              <div class="space-y-4">
                <div v-if="siteInfo?.address" class="flex items-start">
                  <Icon name="mdi:map-marker" class="text-gold text-2xl mr-4 flex-shrink-0 mt-1" />
                  <div>
                    <p class="font-semibold mb-1">Address</p>
                    <p class="text-gray-300">{{ siteInfo.address }}</p>
                    <p v-if="siteInfo.city" class="text-gray-300">{{ siteInfo.city }}, {{ siteInfo.state }} {{ siteInfo.zip }}</p>
                  </div>
                </div>
                
                <div v-if="siteInfo?.phone" class="flex items-start">
                  <Icon name="mdi:phone" class="text-gold text-2xl mr-4 flex-shrink-0 mt-1" />
                  <div>
                    <p class="font-semibold mb-1">Phone</p>
                    <a :href="`tel:${siteInfo.phone}`" class="text-gray-300 hover:text-gold transition-colors">
                      {{ siteInfo.phone }}
                    </a>
                  </div>
                </div>
                
                <div v-if="siteInfo?.email" class="flex items-start">
                  <Icon name="mdi:email" class="text-gold text-2xl mr-4 flex-shrink-0 mt-1" />
                  <div>
                    <p class="font-semibold mb-1">Email</p>
                    <a :href="`mailto:${siteInfo.email}`" class="text-gray-300 hover:text-gold transition-colors">
                      {{ siteInfo.email }}
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <img 
                :src="siteInfo?.mainImage || 'https://www.thechemistsclubhotel.com/data/webp/lobby-1603352480-dc53dc99782008730eee1c4ba342be98.webp'"
                alt="Hotel"
                class="w-full h-auto rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- Location Section -->
      <LocationMap 
        v-if="siteInfo?.location"
        :address="siteInfo.address"
        :phone="siteInfo.phone"
        :email="siteInfo.email"
        :latitude="siteInfo.location.latitude"
        :longitude="siteInfo.location.longitude"
      />

      <!-- FAQ Section -->
      <FAQSection :faqs="dynamicFaqs" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const { fetchOffers, fetchRooms, fetchSiteInfo } = useHotel()

// State
const loading = ref(true)
const error = ref(null)
const siteInfo = ref(null)
const rooms = ref([])
const offers = ref([])

// Computed
const heroImages = computed(() => {
  if (siteInfo.value?.gallery && siteInfo.value.gallery.length > 0) {
    return siteInfo.value.gallery.map(img => ({
      url: img.url || img,
      alt: img.alt || 'Hotel Image'
    }))
  }
  // Fallback images
  return [
    {
      url: 'https://www.thechemistsclubhotel.com/data/webp/juniorsuite-1603192112-5d1a2e6e3938c139f8dd88337b371bc8.webp',
      alt: 'Junior Suite'
    },
    {
      url: 'https://www.thechemistsclubhotel.com/data/webp/deluxewithterrace-1603133159-0278b1451229443af705dbcac095f18b.webp',
      alt: 'Deluxe Room with Terrace'
    }
  ]
})

const featuredRooms = computed(() => {
  // Return first 3 rooms or all if less than 3
  return rooms.value.slice(0, 3)
})

const dynamicFaqs = computed(() => {
  if (siteInfo.value?.faqs && siteInfo.value.faqs.length > 0) {
    return siteInfo.value.faqs
  }
  // Fallback FAQs
  return [
    {
      question: 'What time is check-in and check-out?',
      answer: `Check-in begins at ${siteInfo.value?.checkInTime || '3:00 PM'} and check-out is at ${siteInfo.value?.checkOutTime || '11:00 AM'}.`
    }
  ]
})

// Methods
const loadData = async () => {
  loading.value = true
  error.value = null

  try {
    // Fetch all data in parallel
    const [siteData, roomsData, offersData] = await Promise.all([
      fetchSiteInfo(),
      fetchRooms(),
      fetchOffers()
    ])

    siteInfo.value = siteData
    rooms.value = roomsData || []
    offers.value = offersData || []

  } catch (err) {
    error.value = 'Failed to load hotel information. Please try again.'
    console.error('Error loading data:', err)
  } finally {
    loading.value = false
  }
}

// Load data on mount
onMounted(() => {
  loadData()
})

// SEO
useHead({
  title: computed(() => siteInfo.value?.seoTitle || 'The Chemists\' Club Hotel - Midtown Manhattan Boutique Hotel'),
  meta: [
    {
      name: 'description',
      content: computed(() => siteInfo.value?.seoDescription || 'Experience refined luxury at The Chemists\' Club Hotel')
    }
  ]
})
</script>
