<template>
  <div>
    <CookiePolicyT1 v-if="currentTemplate === 'template1'" />
    <CookiePolicyT1 v-else />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import CookiePolicyT1 from '../../templates/template1/pages/cookie-policy.vue'

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
