<template>
  <div class="min-h-screen bg-gray-50 pt-24 sm:pt-36">
    <!-- Content -->
    <div class="container mx-auto px-4 sm:px-6 py-10 sm:py-16 max-w-3xl">
      <h2 class="text-3xl sm:text-4xl font-serif text-gray-900 mb-10 text-center">{{ t.cookiepolicy }}</h2>

      <div class="prose prose-gray max-w-none text-sm text-gray-600 leading-relaxed space-y-8">
        <section>
          <h3 class="text-lg font-semibold text-gray-800 mb-3">1. What Are Cookies?</h3>
          <p>Cookies are small text files stored on your device when you visit a website. They help the website remember your preferences and improve your browsing experience.</p>
        </section>

        <section>
          <h3 class="text-lg font-semibold text-gray-800 mb-3">2. How We Use Cookies</h3>
          <p>We use cookies to:</p>
          <ul class="list-disc list-inside space-y-1 mt-2">
            <li>Ensure the proper functioning of our website</li>
            <li>Remember your language and currency preferences</li>
            <li>Analyze website traffic and usage patterns</li>
            <li>Improve our services and user experience</li>
          </ul>
        </section>

        <section>
          <h3 class="text-lg font-semibold text-gray-800 mb-3">3. Types of Cookies We Use</h3>
          <div class="space-y-4">
            <div>
              <h4 class="font-medium text-gray-700">Essential Cookies</h4>
              <p>Required for the website to function properly. These cannot be disabled.</p>
            </div>
            <div>
              <h4 class="font-medium text-gray-700">Functional Cookies</h4>
              <p>Remember your preferences such as language and currency settings.</p>
            </div>
            <div>
              <h4 class="font-medium text-gray-700">Analytics Cookies</h4>
              <p>Help us understand how visitors interact with our website to improve performance.</p>
            </div>
          </div>
        </section>

        <section>
          <h3 class="text-lg font-semibold text-gray-800 mb-3">4. Managing Cookies</h3>
          <p>You can control and manage cookies through your browser settings. Please note that disabling certain cookies may affect the functionality of our website.</p>
        </section>

        <section>
          <h3 class="text-lg font-semibold text-gray-800 mb-3">5. Third-Party Cookies</h3>
          <p>Some cookies may be set by third-party services that appear on our pages, such as map providers or analytics tools. We do not control these cookies.</p>
        </section>

        <section>
          <h3 class="text-lg font-semibold text-gray-800 mb-3">6. Changes to This Policy</h3>
          <p>We may update this cookie policy from time to time. Any changes will be posted on this page.</p>
        </section>

        <p class="text-xs text-gray-400 pt-4">Last updated: {{ new Date().getFullYear() }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const { locale, localePath } = useLocale()
const { loadCatalogue, transStatic } = useTranslations()

const STATIC_KEYS = ['retour', 'cookiepolicy']
const t = ref(Object.fromEntries(STATIC_KEYS.map(k => [k, k])))

onMounted(async () => {
  const catalogue = await loadCatalogue(locale.value)
  const translated = {}
  for (const key of STATIC_KEYS) translated[key] = transStatic(key, catalogue)
  t.value = translated
})
</script>
