<template>
  <section class="bg-white py-16 sm:py-24">
    <div class="container mx-auto px-4 sm:px-6">

      <!-- Section header -->
      <div class="mb-10 sm:mb-16">
        <p class="section-subtitle">{{ t.contacteznous }}</p>
        <h2 class="section-title">{{ t.noussommesavotreecoute }}</h2>
      </div>

      <!-- Two-col: form (left) | map (right) -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

        <!-- ── Contact Form ── -->
        <div class="relative overflow-hidden">

          <form @submit.prevent="submitForm" class="relative z-10 space-y-8" novalidate>

            <!-- Row 1: Name + Email -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div class="contact-field">
                <label class="contact-label">{{ t.name }} <span class="text-amber-700">*</span></label>
                <input v-model="form.name" type="text" required
                       class="contact-input" autocomplete="name" />
              </div>
              <div class="contact-field">
                <label class="contact-label">{{ t.email }} <span class="text-amber-700">*</span></label>
                <input v-model="form.email" type="email" required
                       class="contact-input" autocomplete="email" />
              </div>
            </div>

            <!-- Row 2: Tel + Sujet -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div class="contact-field">
                <label class="contact-label">{{ t.tel }} <span class="text-amber-700">*</span></label>
                <input v-model="form.tel" type="tel" required
                       class="contact-input" autocomplete="tel" />
              </div>
              <div class="contact-field">
                <label class="contact-label">{{ t.sujet }} <span class="text-amber-700">*</span></label>
                <input v-model="form.sujet" type="text" required
                       class="contact-input" />
              </div>
            </div>

            <!-- Message -->
            <div class="contact-field">
              <label class="contact-label">{{ t.message }} <span class="text-amber-700">*</span></label>
              <textarea v-model="form.message" rows="3" required
                        class="contact-input resize-none"></textarea>
            </div>

            <!-- Captcha Section -->
            <div class="space-y-4">
               <label class="contact-label">{{ t.recopiezlecontenudecetteimage }} <span class="text-amber-700">*</span></label>
               <div class="flex flex-col sm:flex-row items-center gap-4">
                  <div class="bg-gray-100 p-2 border border-gray-200 rounded flex items-center justify-center min-w-[150px] h-[50px]">
                     <!-- Captcha Image Placeholder -->
                     <img :src="captchaUrl" alt="captcha" class="max-h-full" v-if="captchaUrl" />
                     <span v-else class="text-[10px] text-gray-400 uppercase tracking-widest">Loading captcha...</span>
                  </div>
                  <input v-model="form.captcha" type="text" required
                         class="contact-input flex-1" />
                  <button type="button" @click="refreshCaptcha" class="text-gray-400 hover:text-amber-700 transition-colors" title="Refresh Captcha">
                    <Icon name="mdi:refresh" class="text-xl" />
                  </button>
               </div>
            </div>

            <!-- Legal checkbox + SEND button -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
              <label class="flex items-start gap-2 cursor-pointer text-sm text-gray-600">
                <input v-model="form.acceptLegal" type="checkbox" required
                       class="mt-0.5 w-4 h-4 accent-amber-700 cursor-pointer" />
                <span>
                  {{ t.jailuetjacceptelesconditionsdereservation }}
                </span>
              </label>
              <button type="submit" :disabled="sending"
                      class="flex-shrink-0 self-end px-8 py-2.5 border border-gray-800 text-[11px] uppercase tracking-[0.2em] font-semibold text-gray-800 hover:bg-gray-800 hover:text-white transition-all duration-300 disabled:opacity-40">
                {{ sending ? t.sending : t.send }}
              </button>
            </div>

            <!-- Feedback -->
            <transition name="slide-fade">
              <div v-if="submitStatus" class="mt-4">
                <p v-if="submitStatus === 'success'" class="text-green-600 text-sm font-medium">✓ {{ t.messagesent }}</p>
                <p v-else-if="submitStatus === 'error'" class="text-red-600 text-sm font-medium">{{ t.messageerror }}</p>
                <p v-else-if="submitStatus === 'captcha-error'" class="text-red-600 text-sm font-medium">{{ t.captchaerror }}</p>
                <p v-else-if="submitStatus === 'required-error'" class="text-red-600 text-sm font-medium">{{ t.requirederror }}</p>
                <p v-else-if="submitStatus === 'email-error'" class="text-red-600 text-sm font-medium">{{ t.emailinvalid }}</p>
                <p v-else-if="submitStatus === 'tel-error'" class="text-red-600 text-sm font-medium">{{ t.telinvalid }}</p>
                <p v-else-if="submitStatus === 'legal-error'" class="text-red-600 text-sm font-medium">{{ t.legalerror }}</p>
              </div>
            </transition>

          </form>
        </div>

        <!-- ── Map ── -->
        <div class="sticky top-8">
          <div class="mb-8">
            <h2 class="section-title">{{ t.notreemplacement }}</h2>
          </div>
          <div class="h-[380px] sm:h-[460px] lg:h-[500px]">
            <div v-if="loadingMap" class="w-full h-full flex items-center justify-center bg-gray-50">
              <div class="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-700"></div>
            </div>
            <div ref="mapContainer" class="w-full h-full"></div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// ── Form state ────────────────────────────────────────────────────────────────
const form = ref({ 
  name: '', 
  email: '', 
  tel: '', 
  sujet: '', 
  message: '', 
  captcha: '',
  acceptLegal: false 
})
const sending      = ref(false)
const submitStatus = ref(null) // null | 'success' | 'error'
const captchaCode = ref('')
const captchaUrl  = ref('')

const refreshCaptcha = () => {
  // Generate random 5-digit number
  const code = Math.floor(10000 + Math.random() * 90000).toString()
  captchaCode.value = code
  // Using placehold.jp to generate an image with the numbers
  captchaUrl.value = `https://placehold.jp/24/f3f4f6/b45309/150x50.png?text=${code}&font=Georgia`
}

const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const validateTel = (tel) => {
  // Basic tel validation: digits, spaces, hyphens, plus sign, at least 7 chars
  return /^[\d\s\-\+]{7,}$/.test(tel)
}

const submitForm = async () => {
  submitStatus.value = null

  // 1. Check required fields
  if (!form.value.name || !form.value.email || !form.value.tel || !form.value.sujet || !form.value.message || !form.value.captcha) {
    submitStatus.value = 'required-error'
    return
  }

  // 2. Check Email
  if (!validateEmail(form.value.email)) {
    submitStatus.value = 'email-error'
    return
  }

  // 3. Check Tel
  if (!validateTel(form.value.tel)) {
    submitStatus.value = 'tel-error'
    return
  }

  // 4. Check Captcha
  if (form.value.captcha !== captchaCode.value) {
    submitStatus.value = 'captcha-error'
    return
  }

  // 5. Check Legal
  if (!form.value.acceptLegal) {
    submitStatus.value = 'legal-error'
    return
  }

  sending.value = true
  try {
    // TODO: replace with real API endpoint
    await new Promise(r => setTimeout(r, 1200))
    submitStatus.value = 'success'
    form.value = { 
      name: '', 
      email: '', 
      tel: '', 
      sujet: '', 
      message: '', 
      captcha: '',
      acceptLegal: false 
    }
    refreshCaptcha()
  } catch {
    submitStatus.value = 'error'
  } finally {
    sending.value = false
  }
}


// ── Translations ──────────────────────────────────────────────────────────────
const STATIC_KEYS = [
  'notreemplacement', 'noussommesavotreecoute', 'contacteznous',
  'name', 'email', 'tel', 'sujet', 'message', 'recopiezlecontenudecetteimage',
  'jailuetjacceptelesconditionsdereservation', 'legalconditions', 'send', 'sending',
  'requirederror', 'emailinvalid', 'telinvalid', 'legalerror',
  'requiredfields', 'recaptchanote', 'messagesent', 'messageerror',
]

const FALLBACKS = {
  notreemplacement:      'notre emplacement',
  noussommesavotreecoute:'nous sommes avotre ecoute',
  name:           'Nom',
  email:          'E-mail',
  tel:            'Téléphone',
  sujet:          'Sujet',
  message:        'Message',
  recopiezlecontenudecetteimage: 'Recopiez le contenu de cette image',
  acceptlegal:    'I accept and understand the legal',
  legalconditions:'conditions',
  send:           'Envoyer',
  sending:        'Envoi en cours…',
  requiredfields: 'Champs obligatoires',
  recaptchanote:  'Ce site est protégé par reCAPTCHA et Google. La politique de confidentialité et les conditions d\'utilisation s\'appliquent.',
  messagesent:    'Votre message a été envoyé avec succès. Nous vous contacterons sous peu.',
  messageerror:   'Une erreur est survenue. Veuillez réessayer.',
  captchaerror:   'Le code captcha est incorrect. Veuillez réessayer.',
  requirederror:  'Veuillez remplir tous les champs obligatoires.',
  emailinvalid:   'L\'adresse e-mail n\'est pas valide.',
  telinvalid:     'Le numéro de téléphone n\'est pas valide.',
  legalerror:     'Vous devez accepter les conditions pour continuer.',
}

const t = ref({ ...FALLBACKS })
const { locale } = useLocale()

// ── Map ───────────────────────────────────────────────────────────────────────
const mapContainer = ref(null)
const loadingMap   = ref(true)
let leafletMap     = null

const initMap = (L, lat, lng, hotelName) => {
  if (!mapContainer.value) return
  leafletMap = L.map(mapContainer.value, {
    center: [lat, lng], zoom: 15,
    scrollWheelZoom: false, zoomControl: true,
  })
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd', maxZoom: 19,
  }).addTo(leafletMap)
  // Hotel marker
  L.circleMarker([lat, lng], { radius: 10, fillColor: '#1f2937', color: '#ffffff', weight: 3, fillOpacity: 1 })
    .addTo(leafletMap).bindPopup(`<strong>${hotelName}</strong>`, { autoClose: false, closeOnClick: false, closeButton: false }).openPopup()
  L.circleMarker([lat, lng], { radius: 6, fillColor: '#b45309', color: '#b45309', weight: 0, fillOpacity: 1 })
    .addTo(leafletMap)
  loadingMap.value = false
}

onMounted(async () => {
  const { fetchHotelInfo } = useHotel()
  const { loadCatalogue, transStatic } = useTranslations()

  const [hotelInfo, catalogue] = await Promise.all([
    fetchHotelInfo(),
    loadCatalogue(locale.value),
  ])

  // Populate translations
  const translated = {}
  for (const key of STATIC_KEYS) {
    translated[key] = transStatic(key, catalogue, FALLBACKS[key])
  }
  // Add extra error translations
  const extraKeys = ['requirederror', 'emailinvalid', 'telinvalid', 'legalerror', 'captchaerror']
  for (const k of extraKeys) {
    translated[k] = transStatic(k, catalogue, FALLBACKS[k])
  }
  
  t.value = translated

  // Init Captcha
  refreshCaptcha()

  // Init Leaflet map
  if (process.client && hotelInfo?.latitude && hotelInfo?.longitude) {
    const lat = parseFloat(hotelInfo.latitude)
    const lng = parseFloat(hotelInfo.longitude)
    if (!document.querySelector('link[href*="leaflet.css"]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }
    const L = await import('leaflet')
    initMap(L.default || L, lat, lng, hotelInfo.name || '')
  } else {
    loadingMap.value = false
  }
})

onUnmounted(() => {
  if (leafletMap) { leafletMap.remove(); leafletMap = null }
})
</script>

<style scoped>
/* Field layout */
.contact-field { display: flex; flex-direction: column; gap: 6px; }

/* Label */
.contact-label {
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-weight: 600;
  color: #374151;
}

/* Input / Textarea — underline only style */
.contact-input {
  background: transparent;
  border: none;
  border-bottom: 1px solid #d1d5db;
  padding: 8px 0;
  width: 100%;
  font-size: 0.875rem;
  color: #111827;
  outline: none;
  transition: border-color 0.2s;
}
.contact-input:focus { border-bottom-color: #b45309; }

/* Transition */
.slide-fade-enter-active { transition: all 0.3s ease; }
.slide-fade-leave-active { transition: all 0.2s ease; }
.slide-fade-enter-from, .slide-fade-leave-to { opacity: 0; transform: translateY(-6px); }

/* Keep Leaflet layers in-context */
:deep(.leaflet-pane),
:deep(.leaflet-top),
:deep(.leaflet-bottom) { z-index: 1 !important; }
:deep(.leaflet-control) { z-index: 2 !important; }
</style>
