<template>
  <div>
    <RoomDetailT1 v-if="currentTemplate === 'template1'" />
    <RoomDetailT2 v-else-if="currentTemplate === 'template2'" />
    <RoomDetailT3 v-else-if="currentTemplate === 'template3'" />
    <RoomDetailT1 v-else />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import RoomDetailT1 from '../../../templates/template1/pages/rooms/[slug].vue'
import RoomDetailT2 from '../../../templates/template2/pages/rooms/[slug].vue'
import RoomDetailT3 from '../../../templates/template3/pages/rooms/[slug].vue'

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
