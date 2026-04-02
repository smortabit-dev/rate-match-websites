/**
 * Hotel Configuration — single source of truth
 * Change ETAB_ID and API_BASE here to switch hotels.
 */

export const ETAB_ID   = '14373'
export const API_BASE  = 'https://www.riadchalla.com'
export const API_URL   = `${API_BASE}/api/site-info?idEtab=${ETAB_ID}`

export const IMAGE_CDN      = 'https://rate.picscache.com/'
export const IMAGE_BASE     = `${IMAGE_CDN}images/${ETAB_ID}/upload/`
export const IMAGE_BASE_150 = `${IMAGE_CDN}images/${ETAB_ID}/upload/150X150/`
