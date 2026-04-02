<template>
  <div class="min-h-screen bg-gray-100 py-12">
    <div class="container mx-auto px-4">
      <div class="max-w-6xl mx-auto">
        <!-- Header -->
        <div class="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 class="text-4xl font-bold mb-4">API Test Page</h1>
          <p class="text-gray-600 mb-4">
            This page helps you test and view the API responses from your backend.
          </p>
          <div class="bg-blue-50 border-l-4 border-blue-500 p-4">
            <p class="text-sm">
              <strong>API Endpoint:</strong> https://www.adamparkmarrakech.com/api/site-info?idEtab=11232
            </p>
          </div>
        </div>

        <!-- Test Controls -->
        <div class="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 class="text-2xl font-bold mb-4">Test API Endpoints</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              @click="testSiteInfo" 
              :disabled="loading.siteInfo"
              class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
              <span v-if="loading.siteInfo">Loading...</span>
              <span v-else>Test Site Info</span>
            </button>

            <button 
              @click="testRooms" 
              :disabled="loading.rooms"
              class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">
              <span v-if="loading.rooms">Loading...</span>
              <span v-else>Test Rooms</span>
            </button>

            <button 
              @click="testOffers" 
              :disabled="loading.offers"
              class="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed">
              <span v-if="loading.offers">Loading...</span>
              <span v-else>Test Offers</span>
            </button>

            <button 
              @click="testAmenities" 
              :disabled="loading.amenities"
              class="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed">
              <span v-if="loading.amenities">Loading...</span>
              <span v-else">Test Amenities</span>
            </button>
          </div>

          <button 
            @click="clearAll" 
            class="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            Clear All Results
          </button>
        </div>

        <!-- Site Info Results -->
        <div v-if="results.siteInfo" class="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-2xl font-bold">Site Info Response</h2>
            <button @click="copyToClipboard('siteInfo')" class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
              Copy JSON
            </button>
          </div>
          
          <!-- Success/Error Badge -->
          <div class="mb-4">
            <span v-if="errors.siteInfo" class="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
              ❌ Error
            </span>
            <span v-else class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              ✅ Success
            </span>
          </div>

          <!-- Raw JSON -->
          <div class="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
            <pre class="text-sm">{{ formatJSON(results.siteInfo) }}</pre>
          </div>

          <!-- Mapped Data Preview -->
          <div v-if="!errors.siteInfo && mappedData.siteInfo" class="mt-4">
            <h3 class="text-lg font-bold mb-2">Mapped Data (How it will appear in the app):</h3>
            <div class="bg-blue-50 p-4 rounded-lg">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><strong>Name:</strong> {{ mappedData.siteInfo.name || 'N/A' }}</div>
                <div><strong>Phone:</strong> {{ mappedData.siteInfo.phone || 'N/A' }}</div>
                <div><strong>Email:</strong> {{ mappedData.siteInfo.email || 'N/A' }}</div>
                <div><strong>Address:</strong> {{ mappedData.siteInfo.address || 'N/A' }}</div>
              </div>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="errors.siteInfo" class="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
            <p class="font-bold">Error Message:</p>
            <pre class="text-sm mt-2">{{ errors.siteInfo }}</pre>
          </div>
        </div>

        <!-- Rooms Results -->
        <div v-if="results.rooms" class="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-2xl font-bold">Rooms Response</h2>
            <button @click="copyToClipboard('rooms')" class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
              Copy JSON
            </button>
          </div>
          
          <div class="mb-4">
            <span v-if="errors.rooms" class="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
              ❌ Error
            </span>
            <span v-else class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              ✅ Success ({{ Array.isArray(results.rooms) ? results.rooms.length : 0 }} rooms)
            </span>
          </div>

          <div class="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
            <pre class="text-sm">{{ formatJSON(results.rooms) }}</pre>
          </div>

          <div v-if="errors.rooms" class="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
            <p class="font-bold">Error Message:</p>
            <pre class="text-sm mt-2">{{ errors.rooms }}</pre>
          </div>
        </div>

        <!-- Offers Results -->
        <div v-if="results.offers" class="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-2xl font-bold">Offers Response</h2>
            <button @click="copyToClipboard('offers')" class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
              Copy JSON
            </button>
          </div>
          
          <div class="mb-4">
            <span v-if="errors.offers" class="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
              ❌ Error
            </span>
            <span v-else class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              ✅ Success
            </span>
          </div>

          <div class="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
            <pre class="text-sm">{{ formatJSON(results.offers) }}</pre>
          </div>

          <div v-if="errors.offers" class="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
            <p class="font-bold">Error Message:</p>
            <pre class="text-sm mt-2">{{ errors.offers }}</pre>
          </div>
        </div>

        <!-- Amenities Results -->
        <div v-if="results.amenities" class="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-2xl font-bold">Amenities Response</h2>
            <button @click="copyToClipboard('amenities')" class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
              Copy JSON
            </button>
          </div>
          
          <div class="mb-4">
            <span v-if="errors.amenities" class="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
              ❌ Error
            </span>
            <span v-else class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              ✅ Success
            </span>
          </div>

          <div class="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
            <pre class="text-sm">{{ formatJSON(results.amenities) }}</pre>
          </div>

          <div v-if="errors.amenities" class="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
            <p class="font-bold">Error Message:</p>
            <pre class="text-sm mt-2">{{ errors.amenities }}</pre>
          </div>
        </div>

        <!-- Instructions -->
        <div class="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg">
          <h3 class="font-bold text-lg mb-2">📋 Next Steps:</h3>
          <ol class="list-decimal list-inside space-y-2 text-sm">
            <li>Click the buttons above to test each API endpoint</li>
            <li>Review the JSON responses to understand the data structure</li>
            <li>Copy the JSON and send it to me so I can update the data mapper</li>
            <li>Check if there are any errors (CORS, authentication, etc.)</li>
            <li>Once the mapper is updated, the dynamic pages will work automatically!</li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { processAPIData } from '~/utils/apiMapper'

// Use the hotel API composable
const { fetchAmenities, fetchOffers, fetchRooms, fetchSiteInfo } = useHotel()

// State
const loading = ref({
  siteInfo: false,
  rooms: false,
  offers: false,
  amenities: false
})

const results = ref({
  siteInfo: null,
  rooms: null,
  offers: null,
  amenities: null
})

const errors = ref({
  siteInfo: null,
  rooms: null,
  offers: null,
  amenities: null
})

const mappedData = ref({
  siteInfo: null,
  rooms: null,
  offers: null
})

// Methods
const testSiteInfo = async () => {
  loading.value.siteInfo = true
  errors.value.siteInfo = null
  results.value.siteInfo = null
  mappedData.value.siteInfo = null

  try {
    // Fetch raw data first
    const rawData = await $fetch('https://www.adamparkmarrakech.com/api/site-info', {
      params: { idEtab: 11232 }
    })
    
    results.value.siteInfo = rawData
    
    // Try to map it
    try {
      mappedData.value.siteInfo = processAPIData.siteInfo(rawData)
    } catch (mapError) {
      console.error('Mapping error:', mapError)
    }
  } catch (error) {
    errors.value.siteInfo = error.message || error.toString()
    results.value.siteInfo = { error: error.message }
  } finally {
    loading.value.siteInfo = false
  }
}

const testRooms = async () => {
  loading.value.rooms = true
  errors.value.rooms = null
  results.value.rooms = null

  try {
    const data = await fetchRooms()
    results.value.rooms = data
  } catch (error) {
    errors.value.rooms = error.message || error.toString()
    results.value.rooms = { error: error.message }
  } finally {
    loading.value.rooms = false
  }
}

const testOffers = async () => {
  loading.value.offers = true
  errors.value.offers = null
  results.value.offers = null

  try {
    const data = await fetchOffers()
    results.value.offers = data
  } catch (error) {
    errors.value.offers = error.message || error.toString()
    results.value.offers = { error: error.message }
  } finally {
    loading.value.offers = false
  }
}

const testAmenities = async () => {
  loading.value.amenities = true
  errors.value.amenities = null
  results.value.amenities = null

  try {
    const data = await fetchAmenities()
    results.value.amenities = data
  } catch (error) {
    errors.value.amenities = error.message || error.toString()
    results.value.amenities = { error: error.message }
  } finally {
    loading.value.amenities = false
  }
}

const formatJSON = (data) => {
  return JSON.stringify(data, null, 2)
}

const copyToClipboard = (type) => {
  const data = results.value[type]
  const text = JSON.stringify(data, null, 2)
  
  navigator.clipboard.writeText(text).then(() => {
    alert('JSON copied to clipboard!')
  }).catch(err => {
    console.error('Failed to copy:', err)
  })
}

const clearAll = () => {
  results.value = {
    siteInfo: null,
    rooms: null,
    offers: null,
    amenities: null
  }
  errors.value = {
    siteInfo: null,
    rooms: null,
    offers: null,
    amenities: null
  }
  mappedData.value = {
    siteInfo: null,
    rooms: null,
    offers: null
  }
}

// SEO
useHead({
  title: 'API Test Page - Chemists Club Hotel'
})
</script>
