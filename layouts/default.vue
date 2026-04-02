<template>
  <div>
    <!-- Template 1 Components -->
    <template v-if="currentTemplate === 'template1'">
      <TheHeaderT1 />
      <slot />
      <TheFooterT1 />
    </template>

    <!-- Template 2 Components -->
    <template v-else-if="currentTemplate === 'template2'">
      <TheHeaderT2 />
      <slot />
      <TheFooterT2 />
    </template>

    <!-- Template 3: header/footer are included in each page -->
    <template v-else-if="currentTemplate === 'template3'">
      <slot />
    </template>

    <!-- Default fallback -->
    <template v-else>
      <TheHeaderT1 />
      <slot />
      <TheFooterT1 />
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

// Import all template components
import TheHeaderT1 from '../templates/template1/components/TheHeader.vue'
import TheFooterT1 from '../templates/template1/components/TheFooter.vue'
import TheHeaderT2 from '../templates/template2/components/TheHeader.vue'
import TheFooterT2 from '../templates/template2/components/TheFooter.vue'

const currentTemplate = ref('template1')

// Load template preference
onMounted(() => {
  if (process.client) {
    const saved = localStorage.getItem('selectedTemplate')
    if (saved && ['template1', 'template2', 'template3'].includes(saved)) {
      currentTemplate.value = saved
    }
    
    // Watch for storage changes (for template switcher)
    window.addEventListener('storage', (e) => {
      if (e.key === 'selectedTemplate' && e.newValue) {
        currentTemplate.value = e.newValue
      }
    })
  }
})

// Watch for template changes and reload CSS
watch(currentTemplate, (newTemplate) => {
  if (process.client) {
    // Remove old template CSS
    const oldCSS = document.querySelector('link[data-template-css]')
    if (oldCSS) {
      oldCSS.remove()
    }
    
    // Add new template CSS
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = `/templates/${newTemplate}/assets/css/main.css`
    link.setAttribute('data-template-css', 'true')
    document.head.appendChild(link)
  }
})
</script>
