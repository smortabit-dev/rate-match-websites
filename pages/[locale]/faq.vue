<template>
  <div>
    <FaqT1 v-if="currentTemplate === 'template1'" />
    <FaqT1 v-else />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import FaqT1 from '../../templates/template1/pages/faq.vue'

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
