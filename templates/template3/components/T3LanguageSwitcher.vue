<template>
  <div class="relative" ref="el">
    <button @click="open = !open" class="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.15em] text-white/80 hover:text-[#b7825c] transition-colors">
      {{ locale.toUpperCase() }}
      <Icon name="mdi:chevron-down" class="text-xs" :class="open ? 'rotate-180' : ''" style="transition: transform 0.2s" />
    </button>
    <transition name="t3-dd">
      <div v-if="open && langs.length > 1"
        class="absolute right-0 top-full mt-2 bg-[#1a1410] border border-white/10 shadow-xl min-w-[120px] z-50">
        <button v-for="lang in langs" :key="lang.code"
          @click="switchLang(lang.code)"
          class="block w-full px-4 py-2.5 text-left text-[11px] uppercase tracking-[0.1em] transition-colors"
          :class="locale === lang.code ? 'text-[#b7825c]' : 'text-white/60 hover:text-white hover:bg-white/5'">
          {{ lang.title || lang.code.toUpperCase() }}
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const { locale, switchLocalePath } = useLocale()
const router = useRouter()
const open   = ref(false)
const langs  = ref([])
const el     = ref(null)

const switchLang = (code) => {
  open.value = false
  if (code !== locale.value) {
    const path = switchLocalePath(code)
    window.location.href = path
  }
}

const onOutside = (e) => { if (el.value && !el.value.contains(e.target)) open.value = false }

onMounted(async () => {
  const { fetchLanguages } = useHotel()
  langs.value = await fetchLanguages()
  document.addEventListener('click', onOutside)
})
onUnmounted(() => document.removeEventListener('click', onOutside))
</script>

<style scoped>
.t3-dd-enter-active, .t3-dd-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.t3-dd-enter-from, .t3-dd-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
