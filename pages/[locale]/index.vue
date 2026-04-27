<template>
  <div>
    <IndexT1 v-if="currentTemplate === 'template1'" />
    <IndexT2 v-else-if="currentTemplate === 'template2'" />
    <IndexT3 v-else-if="currentTemplate === 'template3'" />
    <IndexT4 v-else-if="currentTemplate === 'template4'" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import IndexT1 from '../../templates/template1/pages/index.vue'
import IndexT2 from '../../templates/template2/pages/index.vue'
import IndexT3 from '../../templates/template3/pages/index.vue'
import IndexT4 from '../../templates/template4/pages/index.vue'

const currentTemplate = ref('template1')

onMounted(() => {
  if (process.client) {
    const saved = localStorage.getItem('selectedTemplate')
    if (saved && ['template1', 'template2', 'template3', 'template4'].includes(saved)) {
      currentTemplate.value = saved
    }
  }
})
</script>
