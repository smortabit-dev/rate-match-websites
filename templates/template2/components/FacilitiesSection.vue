<template>
  <section id="facilities" class="bg-[#F5F5F5] py-24 px-6">
    <div class="max-w-7xl mx-auto">
      <div class="mb-16">
        <p class="text-[10px] uppercase tracking-[0.3em] text-[#C9A96E] mb-4">Comfort &amp; Amenities</p>
        <h2 class="font-['Cormorant_Garamond'] text-4xl sm:text-5xl text-[#111] font-light">Facilities</h2>
        <div class="w-10 h-px bg-[#C9A96E] mt-6"></div>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
        <div v-for="item in facilities" :key="item.name"
          class="flex flex-col items-center text-center group">
          <div class="w-14 h-14 border border-[#111]/10 flex items-center justify-center mb-4 group-hover:border-[#C9A96E] transition-colors">
            <Icon :name="item.icon" class="text-2xl text-[#C9A96E]" />
          </div>
          <h3 class="text-[#111] text-sm font-medium tracking-wide">{{ item.name }}</h3>
        </div>
      </div>

      <div class="text-center mt-14">
        <NuxtLink :to="localePath('/facilities')"
          class="inline-block px-10 py-4 border border-[#111] text-[#111] text-[11px] uppercase tracking-[0.2em] hover:bg-[#111] hover:text-white transition-all">
          View All Facilities
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const { locale, localePath } = useLocale()
const facilities = ref([])

const ICON_MAP = {
  'wifi':'mdi:wifi','pool':'mdi:pool','spa':'mdi:spa','gym':'mdi:dumbbell',
  'fitness':'mdi:dumbbell','restaurant':'mdi:silverware','bar':'mdi:glass-cocktail',
  'parking':'mdi:parking','air':'mdi:air-conditioner','tv':'mdi:television',
  'safe':'mdi:safe','minibar':'mdi:fridge','balcony':'mdi:balcony',
  'bath':'mdi:bathtub','shower':'mdi:shower','coffee':'mdi:coffee',
  'room service':'mdi:room-service','laundry':'mdi:washing-machine',
  'transfer':'mdi:car','concierge':'mdi:account-tie','elevator':'mdi:elevator',
  'terrace':'mdi:balcony','garden':'mdi:tree',
}
const getIcon = (name = '') => {
  const k = Object.keys(ICON_MAP).find(key => name.toLowerCase().includes(key))
  return k ? ICON_MAP[k] : 'mdi:check-circle-outline'
}

onMounted(async () => {
  const { fetchHotelData } = useHotel()
  const { loadCatalogue, transStatic } = useTranslations()
  const [hotelData, catalogue] = await Promise.all([
    fetchHotelData(), loadCatalogue(locale.value),
  ])
  const etab = hotelData?.etablissment || {}
  const equip = etab.chamberEquipments || etab.equipments || etab.facilities || {}
  const arr = Array.isArray(equip) ? equip : Object.values(equip)
  facilities.value = arr.slice(0, 12).map(e => {
    const name = e.equipmentNom || e.nom || e.name || e || ''
    return { name: transStatic(name.toLowerCase().replace(/\s+/g, ''), catalogue) || name, icon: getIcon(name) }
  })
  if (!facilities.value.length) {
    facilities.value = [
      { name: 'Free Wi-Fi', icon: 'mdi:wifi' }, { name: 'Swimming Pool', icon: 'mdi:pool' },
      { name: 'Spa', icon: 'mdi:spa' }, { name: 'Fitness Centre', icon: 'mdi:dumbbell' },
      { name: 'Restaurant', icon: 'mdi:silverware' }, { name: 'Bar', icon: 'mdi:glass-cocktail' },
      { name: 'Parking', icon: 'mdi:parking' }, { name: 'Room Service', icon: 'mdi:room-service' },
      { name: 'Air Conditioning', icon: 'mdi:air-conditioner' }, { name: 'Concierge', icon: 'mdi:account-tie' },
      { name: 'Laundry', icon: 'mdi:washing-machine' }, { name: 'Airport Transfer', icon: 'mdi:car' },
    ]
  }
})
</script>
