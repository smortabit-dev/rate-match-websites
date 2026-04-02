<template>
  <div>
    <LegalNoticeT1 v-if="currentTemplate === 'template1'" />
    <LegalNoticeT1 v-else />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import LegalNoticeT1 from '../../templates/template1/pages/legal-notice.vue'

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
