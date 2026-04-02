<template>
  <div>
    <!-- Hero Section -->
    <section class="relative h-[60vh] flex items-center justify-center">
      <img 
        :src="heroImage"
        alt="Rooms & Suites"
        class="absolute inset-0 w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      <div class="relative z-10 text-center text-white container mx-auto px-4">
        <h1 class="text-5xl md:text-6xl font-serif mb-4">Rooms & Suites</h1>
        <p class="text-xl md:text-2xl text-gray-200">
          Timeless elegance meets modern comfort
        </p>
      </div>
    </section>

    <!-- Loading State -->
    <div v-if="loading" class="py-20">
      <div class="container mx-auto px-4 text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-gold mx-auto mb-4"></div>
        <p class="text-gray-600">Loading rooms...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="py-20">
      <div class="container mx-auto px-4 text-center">
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button @click="loadRooms" class="btn-secondary">Retry</button>
      </div>
    </div>

    <!-- Rooms List -->
    <section v-else class="py-20 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="space-y-20">
          <!-- Dynamically render each room -->
          <div 
            v-for="(room, index) in rooms" 
            :key="room.id"
            class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <div :class="index % 2 === 0 ? 'order-2 lg:order-1' : 'order-1'">
              <h2 class="text-4xl font-serif mb-4">{{ room.name }}</h2>
              
              <!-- Room Description -->
              <p class="text-gray-600 mb-6">{{ room.description }}</p>

              <!-- Room Features -->
              <div v-if="room.features && room.features.length > 0" class="mb-8">
                <h3 class="font-semibold mb-3">Room Features:</h3>
                <ul class="space-y-2">
                  <li v-for="feature in room.features" :key="feature" class="flex items-start">
                    <Icon name="mdi:check" class="text-gold mr-2 mt-1 flex-shrink-0" />
                    <span>{{ feature }}</span>
                  </li>
                </ul>
              </div>

              <!-- Room Amenities -->
              <div v-if="room.amenities && room.amenities.length > 0" class="mb-8">
                <h3 class="font-semibold mb-3">Amenities:</h3>
                <div class="grid grid-cols-2 gap-2">
                  <div v-for="amenity in room.amenities" :key="amenity" class="flex items-center text-sm text-gray-700">
                    <Icon name="mdi:check-circle" class="text-gold mr-2 text-xs" />
                    <span>{{ amenity }}</span>
                  </div>
                </div>
              </div>

              <!-- Room Details -->
              <div class="flex flex-wrap gap-6 mb-8 text-sm text-gray-600">
                <div v-if="room.maxGuests" class="flex items-center">
                  <Icon name="mdi:account-multiple" class="text-gold mr-2" />
                  <span>Up to {{ room.maxGuests }} guests</span>
                </div>
                <div v-if="room.size" class="flex items-center">
                  <Icon name="mdi:ruler-square" class="text-gold mr-2" />
                  <span>{{ room.size }} sq ft</span>
                </div>
                <div v-if="room.bedType" class="flex items-center">
                  <Icon name="mdi:bed" class="text-gold mr-2" />
                  <span>{{ room.bedType }}</span>
                </div>
              </div>

              <!-- Price and Booking -->
              <div class="flex items-center justify-between bg-white p-6 rounded-lg shadow-md">
                <div>
                  <p class="text-sm text-gray-600">Starting from</p>
                  <p class="text-3xl font-bold text-gold">
                    ${{ room.price || room.basePrice }}
                    <span class="text-sm text-gray-500 font-normal">/ night</span>
                  </p>
                </div>
                <button @click="bookRoom(room)" class="btn-secondary">
                  Book Now
                </button>
              </div>
            </div>

            <!-- Room Images -->
            <div :class="index % 2 === 0 ? 'order-1 lg:order-2' : 'order-2'">
              <!-- Single Image -->
              <div v-if="!room.images || room.images.length <= 1">
                <img 
                  :src="room.image || room.images?.[0] || '/images/placeholder-room.jpg'"
                  :alt="room.name"
                  class="w-full h-auto rounded-lg shadow-xl"
                />
              </div>

              <!-- Image Gallery -->
              <div v-else class="grid grid-cols-2 gap-4">
                <img 
                  v-for="(image, imgIndex) in room.images.slice(0, 4)" 
                  :key="imgIndex"
                  :src="image.url || image"
                  :alt="`${room.name} - Image ${imgIndex + 1}`"
                  class="w-full h-48 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer"
                  @click="openGallery(room.images, imgIndex)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- All Rooms Include Section -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <h2 class="text-4xl font-serif text-center mb-12">All Rooms Include</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <div v-for="amenity in standardAmenities" :key="amenity.name" class="text-center">
            <Icon :name="amenity.icon" class="text-gold text-5xl mx-auto mb-4" />
            <h3 class="font-semibold mb-2">{{ amenity.name }}</h3>
            <p class="text-sm text-gray-600">{{ amenity.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gray-900 text-white">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-4xl font-serif mb-6">Ready to Experience Manhattan?</h2>
        <p class="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Book your stay and discover the perfect blend of historic charm and modern luxury 
          in the heart of Midtown.
        </p>
        <button @click="openBooking" class="btn-primary">Book Your Stay</button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const { fetchRooms, fetchSiteInfo } = useHotel()

// State
const loading = ref(true)
const error = ref(null)
const rooms = ref([])
const siteInfo = ref(null)

// Computed
const heroImage = computed(() => {
  return siteInfo.value?.roomsHeroImage || 
         'https://www.thechemistsclubhotel.com/data/webp/juniorsuite-1603192112-5d1a2e6e3938c139f8dd88337b371bc8.webp'
})

const standardAmenities = computed(() => {
  if (siteInfo.value?.standardAmenities) {
    return siteInfo.value.standardAmenities
  }
  // Fallback amenities
  return [
    { name: 'Complimentary Wi-Fi', description: 'High-speed internet throughout', icon: 'mdi:wifi' },
    { name: 'Climate Control', description: 'Individual temperature control', icon: 'mdi:air-conditioner' },
    { name: 'In-Room Coffee', description: 'Premium coffee and tea service', icon: 'mdi:coffee' },
    { name: 'Smart TV', description: 'Streaming capabilities', icon: 'mdi:television' }
  ]
})

// Methods
const loadRooms = async () => {
  loading.value = true
  error.value = null

  try {
    const [roomsData, siteData] = await Promise.all([
      fetchRooms(),
      fetchSiteInfo()
    ])

    if (roomsData && roomsData.length > 0) {
      rooms.value = roomsData
    } else {
      // Fallback to static data if API fails
      rooms.value = getStaticRooms()
    }

    siteInfo.value = siteData

  } catch (err) {
    error.value = 'Failed to load rooms. Please try again.'
    console.error('Error loading rooms:', err)
    // Use static data as fallback
    rooms.value = getStaticRooms()
  } finally {
    loading.value = false
  }
}

const bookRoom = (room) => {
  // Open booking modal with room pre-selected
  window.dispatchEvent(new CustomEvent('open-reservation', { 
    detail: { roomId: room.id, roomName: room.name } 
  }))
}

const openBooking = () => {
  window.dispatchEvent(new Event('open-reservation'))
}

const openGallery = (images, startIndex) => {
  // Implement image gallery modal
  console.log('Open gallery:', images, startIndex)
}

// Fallback static rooms data
const getStaticRooms = () => {
  return [
    {
      id: 1,
      name: 'Classic Guest Room',
      description: 'Our Classic Guest Rooms offer a refined retreat in the heart of Manhattan. Featuring high ceilings, plush bedding, and marble bathrooms, these rooms provide all the essentials for a comfortable stay.',
      price: 299,
      image: 'https://www.thechemistsclubhotel.com/data/webp/classicguestroom-1603207234-3c819815f50d3739d32d4ac4a05ec146.webp',
      features: [
        'King or Queen bed options',
        'Marble bathroom with luxury amenities',
        'Work desk and complimentary Wi-Fi',
        'High ceilings and natural light'
      ],
      maxGuests: 2,
      bedType: 'King or Queen',
      size: 350
    },
    {
      id: 2,
      name: 'Deluxe Room with Terrace',
      description: 'Experience Manhattan from your private terrace. These spacious rooms feature outdoor spaces perfect for morning coffee or evening relaxation, along with all the luxury amenities you expect.',
      price: 449,
      image: 'https://www.thechemistsclubhotel.com/data/webp/deluxewithterrace-1603133159-0278b1451229443af705dbcac095f18b.webp',
      features: [
        'Private terrace with city views',
        'King bed with premium linens',
        'Spacious marble bathroom',
        'Outdoor furniture for relaxation'
      ],
      maxGuests: 2,
      bedType: 'King',
      size: 450
    }
  ]
}

// Load rooms on mount
onMounted(() => {
  loadRooms()
})

// SEO
useHead({
  title: 'Rooms & Suites - The Chemists\' Club Hotel',
  meta: [
    {
      name: 'description',
      content: 'Discover our beautifully appointed rooms and suites in Midtown Manhattan. From classic guest rooms to our signature Penthouse, experience luxury and comfort.'
    }
  ]
})
</script>
