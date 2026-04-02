<template>
  <div>
    <CheckpriceT1 v-if="currentTemplate === 'template1'" />
    <CheckpriceT1 v-else />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

definePageMeta({ layout: 'blank' })

import CheckpriceT1 from '../../templates/template1/pages/availibility.vue'

const currentTemplate = ref('template1')

onMounted(() => {
  if (process.client) {
    const saved = localStorage.getItem('selectedTemplate')
    if (saved && ['template1'].includes(saved)) {
      currentTemplate.value = saved
    }
  }
})
</script>
