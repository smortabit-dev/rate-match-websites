<template>
  <section class="bg-[#fbf8f6] py-28 px-6">
    <div class="max-w-3xl mx-auto text-center">

      <!-- Heading -->
      <h2 class="font-['Cormorant_Garamond'] text-3xl sm:text-4xl lg:text-5xl text-[#1a1410] font-light italic leading-snug mb-10">
        {{ title }}
      </h2>

      <!-- Body text -->
      <div class="text-[#1a1410]/70 text-sm sm:text-base leading-loose mb-12 max-w-2xl mx-auto" v-html="description"></div>

      <!-- CTA link -->
      <NuxtLink :to="localePath('/facilities')"
        class="inline-block text-[11px] uppercase tracking-[0.3em] text-[#1a1410] border-b border-[#1a1410]/40 pb-0.5 hover:text-[#b7825c] hover:border-[#b7825c] transition-colors">
        {{ ctaLabel }}
      </NuxtLink>

    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const { locale, localePath } = useLocale()
const title       = ref('')
const description = ref('')
const ctaLabel    = ref('Découvrez l\'hôtel')

onMounted(async () => {
  const { fetchHotelData, fetchHotelInfo } = useHotel()
  const { loadCatalogue, transStatic, trans, ETAB_ID } = useTranslations()
  const [info, hotelData, catalogue] = await Promise.all([
    fetchHotelInfo(),
    fetchHotelData(),
    loadCatalogue(locale.value),
  ])
  const etab = hotelData?.etablissment || hotelData?.etablissement || {}
  title.value    = etab.etabSlogan || etab.slogan || info.name || ''
  ctaLabel.value = transStatic('decouvrezHotel', catalogue) || 'Découvrez l\'hôtel'

  // pageDesc: same as template 1
  const rawDesc = trans('61402-description', {}, `${ETAB_ID}_Page`, catalogue, '')
  const tmp = document.createElement('div')
  tmp.innerHTML = rawDesc
  description.value = tmp.innerHTML
})
</script>
