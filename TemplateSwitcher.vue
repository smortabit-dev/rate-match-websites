<template>
  <div class="fixed bottom-4 right-4 z-50">
    <div class="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
      <!-- Toggle Button -->
      <button 
        @click="isOpen = !isOpen"
        class="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div class="flex items-center space-x-2">
          <Icon name="mdi:palette" class="text-2xl text-blue-600" />
          <span class="font-semibold text-sm">Template Switcher</span>
        </div>
        <Icon 
          :name="isOpen ? 'mdi:chevron-up' : 'mdi:chevron-down'" 
          class="text-xl text-gray-600"
        />
      </button>

      <!-- Template Options -->
      <transition name="slide-up">
        <div v-if="isOpen" class="border-t border-gray-200">
          <div class="p-4 space-y-3">
            <!-- Template 1 -->
            <button 
              @click="switchTemplate('template1')"
              class="w-full text-left p-4 rounded-lg border-2 transition-all"
              :class="currentTemplate === 'template1' 
                ? 'border-blue-600 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'"
            >
              <div class="flex items-center justify-between mb-2">
                <h3 class="font-bold">Template 1: Chemists Club</h3>
                <Icon 
                  v-if="currentTemplate === 'template1'" 
                  name="mdi:check-circle" 
                  class="text-blue-600 text-xl"
                />
              </div>
              <p class="text-xs text-gray-600 mb-2">Classic, elegant design</p>
              <div class="flex items-center space-x-2">
                <div class="w-4 h-4 rounded-full bg-yellow-600" title="Gold"></div>
                <div class="w-4 h-4 rounded-full bg-gray-800" title="Dark Gray"></div>
                <span class="text-xs text-gray-500">Playfair Display</span>
              </div>
            </button>

            <!-- Template 2 -->
            <button 
              @click="switchTemplate('template2')"
              class="w-full text-left p-4 rounded-lg border-2 transition-all"
              :class="currentTemplate === 'template2' 
                ? 'border-blue-600 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'"
            >
              <div class="flex items-center justify-between mb-2">
                <h3 class="font-bold">Template 2: Unico Hotels</h3>
                <Icon 
                  v-if="currentTemplate === 'template2'" 
                  name="mdi:check-circle" 
                  class="text-blue-600 text-xl"
                />
              </div>
              <p class="text-xs text-gray-600 mb-2">Modern, minimalist design</p>
              <div class="flex items-center space-x-2">
                <div class="w-4 h-4 rounded-full bg-black" title="Black"></div>
                <div class="w-4 h-4 rounded-full bg-white border border-gray-300" title="White"></div>
                <span class="text-xs text-gray-500">Cormorant Garamond</span>
              </div>
            </button>

            <!-- Template 3 -->
            <button
              @click="switchTemplate('template3')"
              class="w-full text-left p-4 rounded-lg border-2 transition-all"
              :class="currentTemplate === 'template3'
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'"
            >
              <div class="flex items-center justify-between mb-2">
                <h3 class="font-bold">Template 3: Sirayane</h3>
                <Icon
                  v-if="currentTemplate === 'template3'"
                  name="mdi:check-circle"
                  class="text-blue-600 text-xl"
                />
              </div>
              <p class="text-xs text-gray-600 mb-2">Warm Moroccan luxury</p>
              <div class="flex items-center space-x-2">
                <div class="w-4 h-4 rounded-full bg-[#b7825c]" title="Copper"></div>
                <div class="w-4 h-4 rounded-full bg-[#7a2c28]" title="Burgundy"></div>
                <div class="w-4 h-4 rounded-full bg-[#f5ede3] border border-gray-300" title="Cream"></div>
                <span class="text-xs text-gray-500">Cormorant Garamond</span>
              </div>
            </button>

            <!-- Info -->
            <div class="pt-3 border-t border-gray-200">
              <p class="text-xs text-gray-500 text-center">
                Switch between different hotel website templates
              </p>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isOpen = ref(false)
const currentTemplate = ref('template1') // Default template

const switchTemplate = (template) => {
  currentTemplate.value = template
  
  // Store preference in localStorage
  if (process.client) {
    localStorage.setItem('selectedTemplate', template)
  }
  
  // Reload page to apply new template
  window.location.reload()
}

// Load saved template preference on mount
onMounted(() => {
  if (process.client) {
    const saved = localStorage.getItem('selectedTemplate')
    if (saved) {
      currentTemplate.value = saved
    }
  }
})
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  max-height: 0;
}

.slide-up-enter-to,
.slide-up-leave-from {
  opacity: 1;
  max-height: 500px;
}
</style>
