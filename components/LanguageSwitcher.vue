<template>
  <div class="inline-block">
    <!-- Current language button -->
    <button @click="panelOpen = true"
            class="flex items-center gap-1 text-xs uppercase tracking-[0.15em] font-semibold transition-colors">
      {{ locale.toUpperCase() }}
      <Icon name="mdi:chevron-down" class="text-sm" />
    </button>

    <!-- Slide panel from right -->
    <Teleport to="body">
      <transition name="lang-panel">
        <div v-if="panelOpen" class="fixed inset-0 z-[70] flex justify-end">
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-black/60" @click="panelOpen = false"></div>
          <!-- Panel -->
          <div class="relative w-full max-w-xs bg-white h-full overflow-y-auto shadow-2xl">
            <button @click="panelOpen = false"
                    class="absolute top-6 right-6 text-gray-400 hover:text-gray-800 transition-colors">
              <Icon name="mdi:close" class="text-2xl" />
            </button>
            <div class="pt-16 px-8 pb-8">
              <div class="w-8 h-px bg-gray-800 mb-4"></div>
              <h3 class="text-xs uppercase tracking-[0.15em] font-semibold text-gray-800 mb-8">Language</h3>
              <div class="space-y-1">
                <button v-for="lang in languages" :key="lang.code"
                        @click="switchLocale(lang.code)"
                        class="w-full flex items-center justify-between py-3 border-b border-gray-100 transition-colors"
                        :class="lang.code === locale
                          ? 'text-amber-700 font-semibold'
                          : 'text-gray-600 hover:text-gray-900'">
                  <span class="text-sm">{{ lang.title }}</span>
                  <span class="text-xs uppercase tracking-wider">{{ lang.code }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const { locale, switchLocalePath } = useLocale()
const router = useRouter()

const panelOpen = ref(false)
const languages = ref([])

const switchLocale = (newLocale) => {
  panelOpen.value = false
  document.body.style.overflow = 'auto'
  if (newLocale !== locale.value) {
    router.push(switchLocalePath(newLocale))
  }
}

watch(panelOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : 'auto'
})

onMounted(async () => {
  const { fetchLanguages } = useHotel()
  languages.value = await fetchLanguages()
})
</script>

<style scoped>
.lang-panel-enter-active, .lang-panel-leave-active { transition: opacity 0.3s ease; }
.lang-panel-enter-active > :last-child, .lang-panel-leave-active > :last-child { transition: transform 0.3s ease; }
.lang-panel-enter-from, .lang-panel-leave-to { opacity: 0; }
.lang-panel-enter-from > :last-child, .lang-panel-leave-to > :last-child { transform: translateX(100%); }
</style>
