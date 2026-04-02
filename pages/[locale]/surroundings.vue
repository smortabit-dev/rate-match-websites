<template>
  <div>
    <SurroundingsT2 v-if="currentTemplate === 'template2'" />
    <SurroundingsT3 v-else-if="currentTemplate === 'template3'" />
    <div v-else class="bg-black min-h-screen pt-24 text-white">
      <div class="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 class="text-5xl font-black uppercase mb-4">Surroundings</h1>
        <p class="text-gray-400">Coming soon.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import SurroundingsT2 from '../../templates/template2/pages/surroundings.vue'
import SurroundingsT3 from '../../templates/template3/pages/surroundings.vue'

const currentTemplate = ref('template1')

onMounted(() => {
  if (process.client) {
    const saved = localStorage.getItem('selectedTemplate')
    if (saved && ['template1', 'template2', 'template3'].includes(saved)) {
      currentTemplate.value = saved
    }
  }
})
</script>
