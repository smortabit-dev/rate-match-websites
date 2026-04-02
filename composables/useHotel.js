/**
 * useHotel.js
 * ──────────
 * Unified composable for all hotel-related data and API interactions.
 * Consolidates useHotelAPI, useHotelData, and useHotelInfo.
 */

import { processAPIData } from '~/utils/apiMapper'
import { ETAB_ID as HOTEL_ETAB_ID, API_URL as SETTINGS_API_URL } from '~/config/hotel'

// Module-level locks to prevent multiple concurrent fetches for the same demographic
let infoFetchPromise = null
let dataFetchPromise = null

export const useHotel = () => {
    const ETAB_ID = HOTEL_ETAB_ID

    // Shared States (SSR Safe)
    const infoState = useState('hotel-info', () => null)
    const dataState = useState('hotel-raw-data', () => null)

    // ──────────────────────────────────────────────────────────────────────────
    // 1. Hotel Identity & Info (formerly useHotelInfo)
    // ──────────────────────────────────────────────────────────────────────────

    const socialIconMap = {
        facebook: 'mdi:facebook',
        instagram: 'mdi:instagram',
        twitter: 'mdi:twitter',
        x: 'mdi:twitter',
        linkedin: 'mdi:linkedin',
        youtube: 'mdi:youtube',
        tiktok: 'mdi:music-note',
        tripadvisor: 'mdi:tripadvisor',
        pinterest: 'mdi:pinterest',
    }

    const getSocialIcon = (key = '') => {
        return socialIconMap[key.toLowerCase()] || 'mdi:web'
    }

    const fetchHotelInfo = async () => {
        if (infoState.value) return infoState.value
        if (infoFetchPromise) return infoFetchPromise

        infoFetchPromise = (async () => {
            try {
                const response = await $fetch(SETTINGS_API_URL)

                // Robust unwrapping for proxy or direct response
                const raw = response?.data || response
                const data = raw?.data || raw
                const e = data?.etablissment || data?.etablissement

                if (!e) {
                    console.warn('No etablissement found in API, data received:', Object.keys(data || {}))
                    return getInfoFallback()
                }

                let phone = ''
                if (e.phones) {
                    const phonesArr = Array.isArray(e.phones) ? e.phones : Object.values(e.phones)
                    const raw = phonesArr[0]?.tel || phonesArr[0] || ''
                    phone = Array.isArray(raw) ? raw[0] || '' : raw
                }

                const address = [e.etabAdresse, e.etabCodepost].filter(Boolean).join(', ')

                let socials = []
                if (e.reseausocial) {
                    const raw = Array.isArray(e.reseausocial)
                        ? e.reseausocial
                        : Object.entries(e.reseausocial).map(([k, v]) => ({ reseau: k, lien: v }))
                    socials = raw
                        .filter(s => s.ehrsUrl || s.url || s.href)
                        .map(s => ({
                            key: (s.rsTitre || s.name || 'web').toLowerCase(),
                            url: s.ehrsUrl || s.url || s.href || '#',
                            icon: getSocialIcon(s.rsTitre || s.name || ''),
                            label: s.rsTitre || s.name || 'Social'
                        }))
                }

                const baseImageUrl = `https://rate.picscache.com/images/${ETAB_ID}/upload/150X150/`
                infoState.value = {
                    name: e.etablissementNom || 'Hotel',
                    logo: `${baseImageUrl}${e.imageUri || ''}` || null,
                    country: e.etabPays || '',
                    city: e.etabVille || '',
                    address,
                    latitude: e.etabLat || null,
                    longitude: e.etabLong || null,
                    phones: e.phones || [],
                    phone,
                    emails: Array.isArray(e.etabMail) ? e.etabMail[0] || '' : (e.etabMail || ''),
                    socials,
                    currency: e.etabCurrency || 'EUR',
                }
                return infoState.value
            } catch (err) {
                console.error('fetchHotelInfo error:', err)
                return getInfoFallback()
            } finally {
                infoFetchPromise = null
            }
        })()

        return infoFetchPromise
    }

    const getInfoFallback = () => ({
        name: 'Hotel', logo: null, country: '', city: '', address: '',
        latitude: null, longitude: null, phones: [], phone: '', email: '',
        socials: [], currency: 'EUR',
    })

    // ──────────────────────────────────────────────────────────────────────────
    // 2. Data Retrieval & Mapping (formerly useHotelData)
    // ──────────────────────────────────────────────────────────────────────────

    const fetchHotelData = async () => {
        if (dataState.value) return dataState.value
        if (dataFetchPromise) return dataFetchPromise

        dataFetchPromise = (async () => {
            try {
                const response = await $fetch(SETTINGS_API_URL)
                // Direct API returns the object, proxy wraps it in .data
                const raw = response?.data || response
                dataState.value = raw?.data || raw
                return dataState.value
            } catch (error) {
                console.error('Error fetching hotel data:', error)
                return null
            } finally {
                dataFetchPromise = null
            }
        })()

        return dataFetchPromise
    }

    const fetchRooms = async (locale = 'en') => {
        try {
            const [data, catalogue] = await Promise.all([
                fetchHotelData(),
                useTranslations().loadCatalogue(locale)
            ])

            if (!data || !data.chamber) return getFallbackRooms()

            const chamberArray = Array.isArray(data.chamber) ? data.chamber : Object.values(data.chamber)
            const { getChamberTranslations, transChamberCarac, transGroupeCarac } = useTranslations()

            return chamberArray.map((chamberItem, index) => {
                const chamber = chamberItem.chamber || chamberItem
                const id = chamber.id || index + 1
                const t = getChamberTranslations(id, catalogue)

                const chamberName = t.name || chamber.chamberName || chamber.name || chamber.chamberNom || `Room ${id}`
                const description = t.description || chamber.chamberDescriptionEn || chamber.chamberDescription?.en || chamber.chamberDescription || `Description ${id}`
                const longDescription = t.longDescription || chamber.chamberLongDescriptionEn || chamber.chamberLongDescription?.en || chamber.chamberLongDescription || `Long Description ${id}`

                let images = []
                if (chamber.img && Array.isArray(chamber.img)) {
                    const baseImageUrl = `https://rate.picscache.com/images/${ETAB_ID}/upload/1024X680/`
                    images = chamber.img.map(filename => `${baseImageUrl}${filename}`).filter(Boolean)
                }
                if (images.length === 0) images = getDefaultImages()
                while (images.length < 8) images.push(...images.slice(0, 8 - images.length))
                images = images.slice(0, 8)

                return {
                    id,
                    slug: generateSlug(chamberName),
                    name: chamberName,
                    category: determineCategoryFromName(chamberName),
                    size: chamber.surface || 30,
                    guests: chamber.chamberMaxPers || 2,
                    bedType: t.bedType || chamber.chamberBedType || 'Double Bed',
                    view: t.view || chamber.chamberView || 'City View',
                    price: chamber.lessprix || 200,
                    description,
                    longDescription,
                    images,
                    thumbnail: images[0],
                    image: images[0],
                    img: chamber.img || [],
                    isBookingBasic: chamber.isBookingBasic ?? chamberItem.isBookingBasic ?? false,
                    features: extractFeaturesFromGroupcarac(chamber.groupcarac, catalogue, transChamberCarac) || getDefaultFeatures(),
                    amenitiesCategories: buildCategoriesFromGroupcarac(chamber.groupcarac, catalogue, transChamberCarac, transGroupeCarac)
                }
            })
        } catch (error) {
            console.error('Error fetching rooms:', error)
            return getFallbackRooms()
        }
    }

    const fetchComments = async (source = 'all', lang = 'en') => {
        try {
            const data = await fetchHotelData()
            if (!data || !data.comments) return getFallbackComments()
            const comments = []
            if (source === 'all' || source === 'tripadvisor') {
                if (data.comments.TripAdvisor) comments.push(...extractCommentsFromSource(data.comments.TripAdvisor, 'TripAdvisor', lang))
            }
            if (source === 'all' || source === 'booking') {
                if (data.comments.booking) comments.push(...extractCommentsFromSource(data.comments.booking, 'Booking.com', lang))
            }
            return comments.length > 0 ? comments : getFallbackComments()
        } catch (error) {
            console.error('Error fetching comments:', error)
            return getFallbackComments()
        }
    }

    const fetchGallery = async () => {
        try {
            const data = await fetchHotelData()
            const e = data?.etablissment || data?.etablissement
            if (!e?.galreieimg) return getFallbackGallery()
            const baseImageUrl = `https://rate.picscache.com/images/${ETAB_ID}/upload/1024X680/`
            const galerieImg = e.galreieimg
            return galerieImg.map((img, index) => ({
                id: index + 1,
                url: `${baseImageUrl}${img}`,
                alt: `Hotel Gallery Image ${index + 1}`,
                category: 'general'
            }))
        } catch (error) {
            console.error('Error fetching gallery:', error)
            return getFallbackGallery()
        }
    }

    const fetchSurroundings = async (locale = 'en') => {
        try {
            const [data, catalogue] = await Promise.all([fetchHotelData(), useTranslations().loadCatalogue(locale)])
            const landmarkId = data?.landmark
            if (!landmarkId) return getFallbackSurroundings()
            return useTranslations().getLandmarkTranslations(landmarkId, catalogue)
        } catch (error) {
            return getFallbackSurroundings()
        }
    }

    const fetchServices = async (locale = 'en') => {
        try {
            const [data, catalogue] = await Promise.all([fetchHotelData(), useTranslations().loadCatalogue(locale)])
            const rawGroups = data?.groupeservice ?? {}
            const rawServices = data?.Service ?? data?.service ?? {}
            const { transGroupService, transService } = useTranslations()
            const baseImageUrl = `https://rate.picscache.com/images/${ETAB_ID}/upload/500X257/`

            const groupsArr = Object.values(rawGroups)
            if (!groupsArr.length) return getFallbackServices()

            return groupsArr.map(group => {
                const groupId = group.id
                const groupName = transGroupService(groupId, catalogue, `Group ${groupId}`)
                let groupImages = []
                if (Array.isArray(group.galerie)) groupImages = group.galerie
                else if (typeof group.galerie === 'string') { try { groupImages = JSON.parse(group.galerie.replace(/'/g, '"')) } catch { } }
                const groupImage = groupImages[0]?.url ? `${baseImageUrl}${groupImages[0].url}` : null

                let ids = []
                if (group.services && typeof group.services === 'object') ids = Object.values(group.services).map(String)
                else if (typeof group.services === 'string') { try { ids = Object.values(JSON.parse(group.services.replace(/'/g, '"'))).map(String) } catch { } }

                const services = ids.filter(sid => rawServices[sid]).map(sid => {
                    const svc = rawServices[sid]
                    const sId = svc.serviceId
                    // Correct nested gallery mapping: serviceGalerie.ser array
                    const serImg = svc.serviceGalerie?.ser?.[0]?.imageUri
                    return {
                        id: sId,
                        groupId,
                        name: transService(sId, 'titer', catalogue, `Service ${sId}`),
                        description: transService(sId, 'description', catalogue, ''),
                        image: serImg ? `${baseImageUrl}${serImg}` : groupImage,
                        price: svc.serviceMontant > 0 ? Number(svc.serviceMontant) : null,
                        persons: svc.serviceNbrPersonne || 0,
                        prixUnit: svc.prixUnit,
                        idtype: svc.idtype,
                        priceType: svc.typePrix
                    }
                })

                return { id: groupId, name: groupName, image: groupImage, services }
            })
        } catch (error) {
            return getFallbackServices()
        }
    }

    const fetchLanguages = async () => {
        try {
            const data = await fetchHotelData()
            if (!data?.lang) return []
            const e = data?.etablissment || data?.etablissement
            const etabLangs = e?.etabLang || []
            return Object.values(data.lang)
                .filter(l => etabLangs.includes(l.code))
                .map(l => ({ code: l.code, title: l.titre }))
        } catch (error) {
            console.error('Error fetching languages:', error)
            return []
        }
    }

    const fetchCurrencies = async () => {
        try {
            const data = await fetchHotelData()
            return (data?.currency || []).filter(c => c.cIsActif)
        } catch (error) {
            console.error('Error fetching currencies:', error)
            return []
        }
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 3. API Actions (formerly useHotelAPI)
    // ──────────────────────────────────────────────────────────────────────────

    const fetchSiteInfo = async () => {
        try {
            const data = await $fetch(`${API_BASE_URL}/site-info`, { params: { idEtab: ETAB_ID } })
            return processAPIData.siteInfo(data)
        } catch (error) {
            return null
        }
    }

    const fetchAmenities = async () => {
        try {
            return await $fetch(`${API_BASE_URL}/amenities`, { params: { idEtab: ETAB_ID } })
        } catch (error) {
            return null
        }
    }

    const fetchOffers = async () => {
        try {
            const data = await $fetch(`${API_BASE_URL}/offers`, { params: { idEtab: ETAB_ID } })
            return processAPIData.offers(data)
        } catch (error) {
            return null
        }
    }

    const checkAvailability = async (checkIn, checkOut, rooms) => {
        try {
            return await $fetch(`${API_BASE_URL}/availability`, {
                method: 'POST',
                body: { idEtab: ETAB_ID, checkIn, checkOut, rooms }
            })
        } catch (error) {
            return null
        }
    }

    const createBooking = async (bookingData) => {
        try {
            return await $fetch(`${API_BASE_URL}/bookings`, {
                method: 'POST',
                body: { idEtab: ETAB_ID, ...bookingData }
            })
        } catch (error) {
            throw error
        }
    }

    // ──────────────────────────────────────────────────────────────────────────
    // Helpers & Fallbacks
    // ──────────────────────────────────────────────────────────────────────────

    const generateSlug = (name) => name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    const determineCategoryFromName = (name) => {
        if (!name) return 'STANDARD'
        const n = name.toLowerCase()
        if (n.includes('suite') || n.includes('executive')) return 'SUITE'
        if (n.includes('deluxe') || n.includes('luxe')) return 'DELUXE'
        if (n.includes('premium') || n.includes('superior')) return 'PREMIUM'
        return 'STANDARD'
    }

    const extractFeaturesFromGroupcarac = (groupcarac, catalogue, trans) => {
        if (!groupcarac) return null
        const groups = Array.isArray(groupcarac) ? groupcarac : Object.values(groupcarac)
        const features = []
        groups.forEach(g => {
            // API key is 'detail' (singular)
            const details = Array.isArray(g.detail) ? g.detail : Object.values(g.detail || {})
            details.forEach(id => { const n = trans(id, catalogue, ''); if (n) features.push(n) })
        })
        return features.length > 0 ? features : null
    }

    const buildCategoriesFromGroupcarac = (groupcarac, catalogue, transC, transG) => {
        if (!groupcarac) return []
        const groups = Array.isArray(groupcarac) ? groupcarac : Object.values(groupcarac)
        const ICONS = { 1: 'mdi:television-play', 2: 'mdi:home-heart', 3: 'mdi:coffee', 4: 'mdi:shower-head', 5: 'mdi:window-open', 6: 'mdi:room-service' }
        return groups.map(g => {
            const id = g.id || g.gcId
            // API key is 'detail' (singular)
            const items = (Array.isArray(g.detail) ? g.detail : Object.values(g.detail || {})).map(id => transC(id, catalogue, '')).filter(Boolean)
            if (items.length === 0) return null
            return { name: transG(id, catalogue, g.titer || ''), icon: ICONS[id] || 'mdi:check-circle-outline', items }
        }).filter(Boolean)
    }

    const extractCommentsFromSource = (data, source, preferredLang) => {
        const comments = []
        const langs = [preferredLang, 'en', 'fr', 'es', 'ar']
        for (const l of langs) {
            if (data[l]?.length > 0) {
                data[l].forEach(c => comments.push({
                    text: c.commentTextPost || c.commentText || 'Great experience!',
                    name: c.commentName || 'Anonymous',
                    location: c.commentCountry || 'Traveler',
                    avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
                    rating: c.commentNote || 5,
                    source,
                    date: c.commentDate?.date || null
                }))
                break
            }
        }
        return comments
    }

    const getDefaultImages = () => [
        'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200',
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200'
    ]

    const getDefaultFeatures = () => ['Free WiFi', 'Air conditioning', 'Smart TV', 'Mini bar', 'Safe']

    const getFallbackRooms = () => ([{ id: 1, slug: 'classic-room', name: 'Classic Room', category: 'STANDARD', price: 180, images: getDefaultImages(), features: getDefaultFeatures() }])

    const getFallbackComments = () => ([{ text: "Amazing hotel!", name: "Sarah", source: "TripAdvisor", rating: 5 }])

    const getFallbackGallery = () => ([{ id: 1, url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200' }])

    const getFallbackServices = () => ([{ id: 1, name: 'Restaurants', services: [{ id: 1, name: 'International' }] }])

    const getFallbackSurroundings = () => ([
        {
            name: "What's nearby",
            places: [
                { name: 'City Center', distance: '2 km', detail: null },
                { name: 'Main Square', distance: '3 km', detail: null },
            ]
        }
    ])

    return {
        fetchHotelInfo, getSocialIcon,
        fetchHotelData, fetchRooms, fetchComments, fetchGallery, fetchSurroundings, fetchServices,
        fetchLanguages, fetchCurrencies,
        fetchSiteInfo, fetchAmenities, fetchOffers, checkAvailability, createBooking,
        ETAB_ID
    }
}
