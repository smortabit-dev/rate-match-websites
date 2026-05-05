<template>
  <div class="inline-block">
    <button @click="open = true"
      class="flex items-center gap-1 transition-colors">
      {{ locale.toUpperCase() }}
      <Icon name="mdi:chevron-down" class="text-sm" />
    </button>

    <Teleport to="body">
      <transition name="t2-lang-modal">
        <div v-if="open"
          class="fixed inset-0 z-[70] flex items-center justify-center p-4"
          @click.self="open = false">
          <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="open = false"></div>

          <div class="relative z-10 w-full max-w-sm bg-[#111] shadow-2xl">
            <!-- Header -->
            <div class="flex items-center justify-between px-8 py-6 border-b border-white/10">
              <h3 class="font-['Cormorant_Garamond'] text-white text-2xl font-light">Language</h3>
              <button @click="open = false" class="text-white/40 hover:text-white transition-colors">
                <Icon name="mdi:close" class="text-xl" />
              </button>
            </div>

            <!-- List -->
            <div class="overflow-y-auto max-h-[60vh]">
              <button v-for="lang in languages" :key="lang.code"
                @click="switchLocale(lang.code)"
                class="w-full flex items-center justify-between px-8 py-4 border-b border-white/5 transition-colors"
                :class="lang.code === locale
                  ? 'text-[#C9A96E] bg-white/5'
                  : 'text-white/60 hover:text-white hover:bg-white/5'">
                <span class="text-sm">{{ lang.title }}</span>
                <span class="text-xs uppercase tracking-wider text-white/30">{{ lang.code }}</span>
              </button>
              <div v-if="!languages.length" class="px-8 py-10 text-center text-white/30 text-sm">
                Loading...
              </div>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const { locale, switchLocalePath } = useLocale()
const router = useRouter()

const open     = ref(false)
const languages = ref([])

const switchLocale = (newLocale) => {
  open.value = false
  if (newLocale !== locale.value) {
    const path = switchLocalePath(newLocale)
    window.location.href = path
  }
}

watch(open, (val) => {
  document.body.style.overflow = val ? 'hidden' : ''
})

onMounted(async () => {
  const { fetchLanguages } = useHotel()
  languages.value = await fetchLanguages()
})
</script>

<style scoped>
.t2-lang-modal-enter-active { transition: opacity 0.3s ease; }
.t2-lang-modal-leave-active { transition: opacity 0.25s ease; }
.t2-lang-modal-enter-from, .t2-lang-modal-leave-to { opacity: 0; }
.t2-lang-modal-enter-active .relative.z-10 { transition: transform 0.3s ease, opacity 0.3s ease; }
.t2-lang-modal-leave-active .relative.z-10 { transition: transform 0.2s ease, opacity 0.25s ease; }
.t2-lang-modal-enter-from .relative.z-10 { transform: scale(0.96); opacity: 0; }
.t2-lang-modal-leave-to   .relative.z-10 { transform: scale(0.96); opacity: 0; }
</style>
