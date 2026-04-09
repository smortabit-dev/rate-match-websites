/**
 * useTranslations.js
 * ──────────────────
 * Loads the translation catalogue from:
 *   https://www.riadchalla.com/site/translations?locales={locale}&id=12791
 *
 * Mirrors the Twig filter syntax used in the backend:
 *
 *   Twig:  {{ (item.id ~ '-titer')  | trans({}, idetab ~ '_Chamber') }}
 *   JS:    transChamber(item.id, 'titer', catalogue)
 *
 *   Twig:  {{ (item.id ~ '-descri') | trans({}, idetab ~ '_Chamber') }}
 *   JS:    transChamber(item.id, 'descri', catalogue)
 *
 * Known domain suffixes
 * ─────────────────────
 *  _Chamber        → rooms
 *  _Etablissement  → hotel identity
 *  _Service        → facilities / services
 *  _Equipement     → amenities / equipment
 *  _Surroundings   → nearby places
 *
 * Known key patterns (chamber)
 * ────────────────────────────
 *  {id}-titer    → room name / title
 *  {id}-descri   → short description
 *  {id}-desclong → long description
 *  {id}-vue      → view type
 *  {id}-literie  → bed type
 */

const ETAB_ID = '14373'
const TRANS_BASE = 'https://www.riadchalla.com/site/translations'

const fetchPromises = {}

export const useTranslations = () => {
  const cacheState = useState('translations-cache', () => ({}))

  // ─────────────────────────────────────────────────────────────────────
  // 1. Fetch & cache
  // ─────────────────────────────────────────────────────────────────────

  /**
   * Load the full catalogue for a given locale.
   * Returns: { "12791_Chamber": { "101-titer": "Deluxe Suite", … }, … }
   */
  const loadCatalogue = async (locale = 'en') => {
    // console.log(`${TRANS_BASE}?locales=${locale}&id=${ETAB_ID}`)
    if (cacheState.value[locale]) return cacheState.value[locale]
    if (fetchPromises[locale]) return fetchPromises[locale]

    fetchPromises[locale] = (async () => {
      try {
        const url = `${TRANS_BASE}?locales=${locale}&id=${ETAB_ID}`
        const raw = await $fetch(url)
        const catalogue = _normalise(raw, locale)
        // console.log(`Catalogue for locale "${locale}":`, catalogue)
        cacheState.value[locale] = catalogue

        // const totalKeys = Object.values(catalogue).reduce((n, d) => n + Object.keys(d).length, 0)
        // console.log(`[trans] "${locale}" → ${Object.keys(catalogue).length} domains, ${totalKeys} keys`)
        return catalogue

      } finally {
        delete fetchPromises[locale]
      }
    })()

    return fetchPromises[locale]
  }

  // ─────────────────────────────────────────────────────────────────────
  // 2. Normalise any possible API shape
  // ─────────────────────────────────────────────────────────────────────

  /**
   * Converts whatever the API returns into the canonical shape:
   *   { domainName: { key: value, … }, … }
   *
   * Handles three observed shapes:
   *
   * Shape A — nested object (most likely):
   *   { "12791_Chamber": { "101-titer": "Deluxe Suite" }, … }
   *
   * Shape B — flat array:
   *   [ { domain: "12791_Chamber", key: "101-titer", value: "Deluxe Suite" }, … ]
   *
   * Shape C — locale wrapper:
   *   { "en": { "12791_Chamber": { … } } }
   */
  const _normalise = (raw, locale = 'en') => {
    if (!raw) return {}

    // Unwrap { success: true, data: { … } } wrapper if present
    if (raw.success && raw.data && typeof raw.data === 'object') {
      return _normalise(raw.data, locale)
    }

    // Unwrap { translations: { … } } wrapper
    if (raw.translations && typeof raw.translations === 'object') {
      return _normalise(raw.translations, locale)
    }

    // Shape C: locale wrapper  { en: { … } }
    if (raw[locale] && typeof raw[locale] === 'object') {
      return _normalise(raw[locale], locale)
    }

    // Shape A: { domain: { key: value } }
    if (!Array.isArray(raw)) {
      const firstVal = Object.values(raw)[0]
      if (firstVal && typeof firstVal === 'object' && !Array.isArray(firstVal)) {
        // Ensure domain keys are prefixed with ETAB_ID_
        const result = {}
        for (const [domain, keys] of Object.entries(raw)) {
          const prefixed = domain.startsWith(`${ETAB_ID}_`) ? domain : `${ETAB_ID}_${domain}`
          result[prefixed] = keys
        }
        return result
      }
    }

    // Shape B: [ { domain, key, value } ]
    if (Array.isArray(raw)) {
      return raw.reduce((acc, item) => {
        const domain = item.domain || item.catalogue || `${ETAB_ID}_Unknown`
        if (!acc[domain]) acc[domain] = {}
        const key = item.key || item.transKey || ''
        acc[domain][key] = item.value ?? item.transValue ?? ''
        return acc
      }, {})
    }

    return {}
  }

  // ─────────────────────────────────────────────────────────────────────
  // 3. Core trans() — mirrors Twig's | trans(params, domain)
  // ─────────────────────────────────────────────────────────────────────

  /**
   * @param {string}      key       e.g. "101-titer"
   * @param {object}      params    placeholder replacements (optional)
   * @param {string}      domain    e.g. "12791_Chamber"
   * @param {object}      catalogue loaded catalogue
   * @param {string}      fallback  returned when key not found
   */
  const trans = (key, params = {}, domain = '', catalogue = {}, fallback = '') => {
    // console.log(`Translating key "${key}" in domain "${domain}" with params`, params)
    // Try exact domain first, then prefix with ETAB_ID
    const domainData =
      catalogue[domain] ||
      catalogue[`${ETAB_ID}_${domain}`] ||
      {}

    let value = domainData[key]
    if (!value && value !== 0) return fallback

    value = String(value)

    // Replace %param% or {{ param }} placeholders
    Object.entries(params).forEach(([k, v]) => {
      value = value.replace(new RegExp(`%${k}%`, 'g'), v)
      value = value.replace(new RegExp(`\\{\\{\\s*${k}\\s*\\}\\}`, 'g'), v)
    })

    return value
  }

  // ─────────────────────────────────────────────────────────────────────
  // 4. Domain-specific helpers
  // ─────────────────────────────────────────────────────────────────────

  /**
   * Chamber translation
   * Twig: {{ (item.id ~ '-titer') | trans({}, idetab ~ '_Chamber') }}
   *
   * @param {string|number} id       chamber id
   * @param {string}        field    'titer' | 'descri' | 'desclong' | 'vue' | 'literie'
   * @param {object}        catalogue
   * @param {string}        fallback
   */
  const transChamber = (id, field, catalogue, fallback = '') =>
    trans(`${id}-${field}`, {}, `${ETAB_ID}_Chamber`, catalogue, fallback)

  /**
   * Etablissement (hotel identity) translation
   * Twig: {{ 'etab-nom' | trans({}, idetab ~ '_Etablissement') }}
   *
   * @param {string} field    'etab-nom' | 'etab-desc' | 'etab-slogan'
   */
  const transEtab = (field, catalogue, fallback = '') =>
    trans(field, {}, `${ETAB_ID}_Etablissement`, catalogue, fallback)

  /**
   * Service / Facility translation
   * Twig: {{ (item.id ~ '-titer') | trans({}, idetab ~ '_Service') }}
   */
  /**
   * FacilitiesType (category) translation
   * Twig: {{ (itemg.ftId ~ '-titer') | trans({}, idetab ~ '_FacilitiesType') }}
   */
  const transFacilitiesType = (ftId, catalogue, fallback = '') =>
    trans(`${ftId}-titer`, {}, `${ETAB_ID}_FacilitiesType`, catalogue, fallback)

  /**
   * Facilities (individual item) translation
   * Twig: {{ (item.fcId ~ '-titer') | trans({}, idetab ~ '_Facilities') }}
   */
  const transFacilities = (fcId, catalogue, fallback = '') =>
    trans(`${fcId}-titer`, {}, `${ETAB_ID}_Facilities`, catalogue, fallback)
  /**
   * Service / Facility translation
   * Twig: {{ (item.id ~ '-titer') | trans({}, idetab ~ '_Service') }}
   */
  const transService = (id, field, catalogue, fallback = '') =>
    trans(`${id}-${field}`, {}, `${ETAB_ID}_Service`, catalogue, fallback)

  /**
   * GroupService (service category) translation
   * Twig: {{ (item.id ~ '-titer') | trans({}, idetab ~ '_GroupService') }}
   */
  const transGroupService = (id, catalogue, fallback = '') =>
    trans(`${id}-titer`, {}, `${ETAB_ID}_GroupService`, catalogue, fallback)

  /**
   * Equipement / Amenity translation
   * Twig: {{ (item.id ~ '-titer') | trans({}, idetab ~ '_Equipement') }}
   */
  const transEquipement = (id, catalogue, fallback = '') =>
    trans(`${id}-titer`, {}, `${ETAB_ID}_Equipement`, catalogue, fallback)

  /**
   * ChamberCaracteristique translation
   * Twig: {{ (idcarac ~ '-titer') | trans({}, idetab ~ '_ChamberCaracteristique') }}
   */
  const transChamberCarac = (id, catalogue, fallback = '') =>
    trans(`${id}-titer`, {}, `${ETAB_ID}_ChamberCaracteristique`, catalogue, fallback)

  /**
   * GroupeCaracteristique translation
   * Twig: {{ (groupId ~ '-titer') | trans({}, idetab ~ '_GroupeCaracteristique') }}
   */
  const transGroupeCarac = (id, catalogue, fallback = '') =>
    trans(`${id}-titer`, {}, `${ETAB_ID}_GroupeCaracteristique`, catalogue, fallback)

  /**
   * Surroundings translation
   * Twig: {{ (item.id ~ '-titer') | trans({}, idetab ~ '_Surroundings') }}
   */
  const transSurrounding = (id, field, catalogue, fallback = '') =>
    trans(`${id}-${field}`, {}, `${ETAB_ID}_Surroundings`, catalogue, fallback)

  /**
   * FAQ translation
   * Twig: {{ (item.faqId ~ '-titer') | trans({}, idetab ~ '_Faq') }}
   *
   * @param {string|number} id       faq id
   * @param {string}        field    'titer' | 'description'
   * @param {object}        catalogue
   * @param {string}        fallback
   */
  const transFaq = (id, field, catalogue, fallback = '') =>
    trans(`${id}-${field}`, {}, `${ETAB_ID}_Faq`, catalogue, fallback)

  /**
   * Static UI label translation
   * Twig: {{ 'gallery' | trans({}, idetab) }}
   * Domain in API: "static" → normalised to "12791_static"
   */
  const transStatic = (key, catalogue, fallback = '') =>
    trans(key, {}, `${ETAB_ID}_static`, catalogue, fallback || key)

  // ─────────────────────────────────────────────────────────────────────
  // 5. High-level helpers
  // ─────────────────────────────────────────────────────────────────────

  /**
   * Returns all translated fields for one chamber, ready to spread into
   * the room model in fetchRooms().
   *
   * Twig equivalents:
   *   name            → {{ (id ~ '-titer')    | trans({}, idetab ~ '_Chamber') }}
   *   description     → {{ (id ~ '-descri')   | trans({}, idetab ~ '_Chamber') }}
   *   longDescription → {{ (id ~ '-desclong') | trans({}, idetab ~ '_Chamber') }}
   *   view            → {{ (id ~ '-vue')      | trans({}, idetab ~ '_Chamber') }}
   *   bedType         → {{ (id ~ '-literie')  | trans({}, idetab ~ '_Chamber') }}
   */
  const getChamberTranslations = (id, catalogue) => ({
    name: transChamber(id, 'titer', catalogue, ''),
    description: transChamber(id, 'description', catalogue, ''),
    longDescription: transChamber(id, 'description', catalogue, ''),
    view: transChamber(id, 'vue', catalogue, ''),
    bedType: transChamber(id, 'literie', catalogue, ''),
  })

  /**
   * Returns translated hotel identity fields.
   */
  const getEtabTranslations = (catalogue) => ({
    name: transEtab('etab-nom', catalogue, ''),
    desc: transEtab('etab-desc', catalogue, ''),
    slogan: transEtab('etab-slogan', catalogue, ''),
  })

  /**
   * LandmarkType translation
   * The API stores landmark data as a JSON string in key `{landmarkId}-titer`
   * inside the `LandmarkType` domain.
   *
   * Shape: { "What's nearby": [{t, d, detail}, ...], "Restaurants & cafes": [...], ... }
   *
   * Twig: {% for key,itemg in landmarkTrans %}
   */
  const transLandmarkType = (landmarkId, catalogue, fallback = '') =>
    trans(`${landmarkId}-titer`, {}, `${ETAB_ID}_LandmarkType`, catalogue, fallback)

  /**
   * Returns parsed landmark categories from translation.
   * @param {string|number} landmarkId  e.g. 789
   * @param {object}        catalogue   loaded catalogue
   * @returns {{ name: string, places: {name: string, distance: string, detail: string|null}[] }[]}
   */
  const getLandmarkTranslations = (landmarkId, catalogue) => {
    const raw = transLandmarkType(landmarkId, catalogue)
    if (!raw) return []

    try {
      const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw
      return Object.entries(parsed).map(([categoryName, items]) => ({
        name: categoryName.replace(/\*/g, ''),
        places: (items || []).map(item => ({
          name: item.t || '',
          distance: item.d || '',
          detail: item.detail || null,
        })),
      }))
    } catch (err) {
      console.warn('[trans] Failed to parse landmark JSON:', err.message)
      return []
    }
  }

  return {
    loadCatalogue,
    trans,
    transChamber,
    transEtab,
    transFacilitiesType,
    transFacilities,
    transService,
    transGroupService,
    transEquipement,
    transChamberCarac,
    transGroupeCarac,
    transSurrounding,
    transFaq,
    transStatic,
    getChamberTranslations,
    getEtabTranslations,
    transLandmarkType,
    getLandmarkTranslations,
    ETAB_ID,
  }
}
