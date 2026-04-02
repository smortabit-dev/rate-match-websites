<template>
  <div>
    <!-- Loading overlay while Angular app boots -->
    <div v-if="loading" class="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div class="flex flex-col items-center gap-4">
        <div class="w-12 h-12 border-4 border-amber-700 border-t-transparent rounded-full animate-spin"></div>
        <p class="text-gray-500 text-sm tracking-wide">Loading...</p>
      </div>
    </div>

    <!-- Angular checkprice app entry point -->
    <app-root></app-root>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const route = useRoute()
const { locale } = useLocale()
const selectedCurrency = useCurrency()
const { ETAB_ID } = useHotel()

const HOSTE_IMAGE_IMG = 'https://rate.picscache.com/'
const HOSTE_IMAGE     = `https://rate.picscache.com/images/${ETAB_ID}/upload/`

const loading = ref(true)

// Injected elements — kept for cleanup on unmount
const _injected = []

console.log('Availibility page mounted with query:', route.query)

// ── Query params ────────────────────────────────────────────────────────────
const startDate = computed(() => route.query.start_date || getDefaultDate(0))
const endDate   = computed(() => route.query.end_date   || getDefaultDate(1))
const adults    = computed(() => parseInt(route.query.adults)  || 2)
const children  = computed(() => parseInt(route.query.enfants) || 0)

function getDefaultDate(offsetDays) {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  return d.toISOString().split('T')[0]
}

// ── DOM injection helpers ────────────────────────────────────────────────────
function injectLink(href) {
  if (document.querySelector(`link[href="${href}"]`)) return
  const el = document.createElement('link')
  el.rel = 'stylesheet'
  el.href = href
  document.head.appendChild(el)
  _injected.push(el)
}

function injectStyle(css) {
  if (!css) return
  const el = document.createElement('style')
  el.textContent = css
  document.head.appendChild(el)
  _injected.push(el)
}

function loadScript(src) {
  return new Promise((resolve) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return }
    const el = document.createElement('script')
    el.src = src
    el.crossOrigin = 'anonymous'
    el.async = false // Ensure execution order
    el.onload  = resolve
    el.onerror = (e) => {
      console.error('Script load error:', src, e)
      resolve()
    }
    document.body.appendChild(el)
    _injected.push(el)
  })
}

function execScript(html) {
  if (!html) return
  const container = document.createElement('div')
  container.innerHTML = html
  const scripts = container.querySelectorAll('script')
  
  scripts.forEach(oldScript => {
    const newScript = document.createElement('script')
    Array.from(oldScript.attributes).forEach(attr => {
      newScript.setAttribute(attr.name, attr.value)
    })
    newScript.textContent = oldScript.textContent
    document.body.appendChild(newScript)
    _injected.push(newScript)
  })

  // Also handle any non-script nodes if they exist (though rare in chJs)
  Array.from(container.childNodes).forEach(node => {
    if (node.tagName !== 'SCRIPT') {
      document.body.appendChild(node)
      _injected.push(node)
    }
  })
}

function injectBase(href) {
  let el = document.querySelector('base')
  if (el) {
    el.setAttribute('href', href)
  } else {
    el = document.createElement('base')
    el.href = href
    document.head.appendChild(el)
    _injected.push(el)
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────
onMounted(async () => {
  const { fetchHotelData } = useHotel()
  const hotelData = await fetchHotelData()
  if (!hotelData) {
    console.error('Hotel data failed to load')
    return
  }
  const etab = hotelData?.etablissment || {}

  // Environment: 'prod' | 'preprod' | 'dev'
  const envPref = etab.etabChekPriceJs || 'prod'
  const isDevEnv = envPref === 'dev'
  const pathJs = `checkpricev4/${envPref}`
  const versionJs = hotelData?.vesion_js || Date.now()
  
  const hosts = window.location.origin
  const lang = locale.value

  // agesEnfants query param → array of integers
  const agesRaw = route.query.agesEnfants
  const agesArray = agesRaw ? String(agesRaw).split(',').map(Number).filter(n => !isNaN(n)) : []

  // Fetch Cpercente (exchange rate taux) from rate-match API
  const etabCurrency = hotelData?.etablissment?.etabCurrency || hotelData?.etabCurrency || 'EUR'
  const currency     = selectedCurrency.value || 'EUR'
  let cpercente      = hotelData?.Cpercente || 1
  try {
    const tauxRes  = await fetch(`https://aws.checkprice.rate-match.com/internal/taux?etabCurrency=${etabCurrency}&currency=${currency}`)
    const tauxData = await tauxRes.json()
    console.log('Fetched taux data:', tauxData)
    if (tauxData?.status === 1) cpercente = tauxData.response
  } catch (e) {
    console.warn('[Cpercente] taux fetch failed, using fallback', e)
  }
  console.log(`Using Cpercente: ${cpercente} for etabCurrency: ${etabCurrency} and currency: ${currency}`)

  // Inject window.appConfig before Angular scripts load
  window.appConfig = {
    start:                 startDate.value,
    end:                   endDate.value,
    Ccurrency:             currency,
    country:               route.query.country  || '',
    device:                route.query.device   || '',
    adults:                adults.value,
    enfants:               children.value,
    agesEnfants:           agesArray,
    Cpercente:             cpercente,
    defaultSelectCurrency: currency,
    promo:                 true,
    defaultlangue:         locale.value,
    idEtab:                parseInt(ETAB_ID),
    hosteimage:            HOSTE_IMAGE,
    hosteimageimg:         HOSTE_IMAGE_IMG,
    host:                  hosts + '/',
    apihost:               hosts,
    oldVersion:            false,
    isMobile:              /Mobi|Android/i.test(navigator.userAgent),
    bookdirect:            true,
    hubUrl:                hotelData?.HubService?.hubUrl || 'https://aws.mercure.rate-match.com/.well-known/mercure',
    userTokenHub:          hotelData?.idSession || '944a8a0kl8tr4qfn23eesa462p',
    tokenHub:              hotelData?.HubService?.tokenJwt || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtZXJjdXJlIjp7InN1YnNjcmliZSI6WyJodHRwOlwvXC9tb25zaXRlLmNvbVwvdXNlclwvOTQ0YThhMGtsOHRyNHFmbjIzZWVzYTQ2MnAiXX19.rvAxuHT_yr-5r-vOMpdJluWgJZIyIqWHILRUZ6H5B7o',
    hi:                    route.query.hi ? true : false,
    urlQuery:              JSON.parse(JSON.stringify({ ...route.query })),
    utm_source:            route.query.utm_source || null,
  }

  // Set base href for Angular routing
  injectBase(`${hosts}/${lang}/availibility`)

  // Custom hotel CSS
  injectStyle(etab.chCss || '')
  injectStyle('body { overflow-x:hidden !important; }')

  // Google Fonts (needed by Angular Material)
  injectLink('https://fonts.googleapis.com/css?family=Roboto:300,400,500')
  injectLink('https://fonts.googleapis.com/icon?family=Material+Icons')

  // Checkprice CSS
  if (envPref === 'prod') {
    injectLink(`${HOSTE_IMAGE_IMG}checkpricev4/prod/styles.css?v=${versionJs}`)
  } else if (envPref === 'preprod') {
    injectLink(`${HOSTE_IMAGE_IMG}checkpricev4/preprod/styles.css?v=${versionJs}`)
  }

  // Load Angular scripts in order
  console.log('Starting script loading for env:', envPref)
  await loadScript(`${HOSTE_IMAGE_IMG}${pathJs}/runtime.js?v=${versionJs}`)
  await loadScript(`${HOSTE_IMAGE_IMG}${pathJs}/polyfills.js?v=${versionJs}`)

  if (isDevEnv) {
    const hostDev = hotelData?.hosteimageimgdev || HOSTE_IMAGE_IMG
    await loadScript(`${hostDev}checkpricev4/dev/styles.js`)
    await loadScript(`${hostDev}${pathJs}/vendor.js`)
    await loadScript(`${hostDev}${pathJs}/main.js`)
  } else {
    // Prod/Preprod scripts
    // Twig has this order: runtime, polyfills, THEN styles.js, THEN vendor, THEN main
    await loadScript(`${HOSTE_IMAGE_IMG}checkpricev4/dev/styles.js?v=${versionJs}`)
    await loadScript(`${HOSTE_IMAGE_IMG}${pathJs}/vendor.js?v=${versionJs}`)
    await loadScript(`${HOSTE_IMAGE_IMG}${pathJs}/main.js?v=${versionJs}`)
  }

  // Hide loading overlay — Angular app is ready
  loading.value = false

  // Custom hotel JS (injected last)
  if (etab.chJs) {
    execScript(etab.chJs)
  }
})

onUnmounted(() => {
  // Remove all injected elements to avoid leaks on navigation
  _injected.forEach(el => el.remove())
  _injected.length = 0
  delete window.appConfig
})
</script>

