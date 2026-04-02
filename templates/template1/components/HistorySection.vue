<template>
  <section class="relative py-24 bg-gray-100 overflow-hidden">
    <!-- Blueprint pattern background -->
    <div class="absolute inset-0 opacity-5"
         style="background-image: url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23000&quot; fill-opacity=&quot;0.4&quot;%3E%3Cpath d=&quot;M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>

    <div class="container mx-auto px-6 relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <!-- Image -->
        <div class="relative">
          <div class="aspect-[4/3] overflow-hidden">
            <img v-if="galleryImages.length"
                 :src="galleryImages[0]?.url"
                 :alt="info.name"
                 class="w-full h-full object-cover" />
          </div>
          <!-- Decorative border -->
          <div class="absolute -bottom-4 -right-4 w-full h-full border-2 border-amber-700 -z-10"></div>
        </div>

        <!-- Content -->
        <div>
          <p class="section-subtitle">{{ t.history }}</p>
          <h2 class="section-title mb-6">{{ t.historysubtitle }}</h2>
          <p class="text-gray-600 leading-relaxed mb-8">
            {{ info.description }}
          </p>
          <a href="#" class="text-xs uppercase tracking-[0.2em] font-semibold text-amber-700 hover:text-amber-900 transition-colors inline-flex items-center gap-2">
            {{ t.knowourhistory }}
            <Icon name="mdi:arrow-right" class="text-base" />
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const info = ref({ name: '', description: '' })
const galleryImages = ref([])

const STATIC_KEYS = ['history', 'historysubtitle', 'knowourhistory']
const t = ref(Object.fromEntries(STATIC_KEYS.map(k => [k, k])))

const { locale } = useLocale()

onMounted(async () => {
  const { fetchGallery, fetchHotelInfo } = useHotel()
  
  const { loadCatalogue, transStatic } = useTranslations()

  const [hotelInfo, images, catalogue] = await Promise.all([
    fetchHotelInfo(),
    fetchGallery(),
    loadCatalogue(locale.value),
  ])
  info.value = hotelInfo
  galleryImages.value = images.slice(0, 3)
  const translated = {}
  for (const key of STATIC_KEYS) translated[key] = transStatic(key, catalogue)
  t.value = translated
})
</script>
