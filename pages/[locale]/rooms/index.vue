<template>
  <div>
    <RoomsIndexT1 v-if="currentTemplate === 'template1'" />
    <RoomsIndexT2 v-else-if="currentTemplate === 'template2'" />
    <RoomsIndexT3 v-else-if="currentTemplate === 'template3'" />
    <RoomsIndexT1 v-else />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import RoomsIndexT1 from '../../../templates/template1/pages/rooms/index.vue'
import RoomsIndexT2 from '../../../templates/template2/pages/rooms/index.vue'
import RoomsIndexT3 from '../../../templates/template3/pages/rooms/index.vue'

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
