/**
 * API Data Mapper
 * 
 * This utility helps map the API response to the format expected by the components.
 * Adjust the mapping functions based on your actual API structure.
 */

/**
 * Map site info from API to app format
 * 
 * Expected API format example:
 * {
 *   "hotel_name": "The Chemists' Club Hotel",
 *   "hotel_description": "...",
 *   "contact": { "phone": "...", "email": "...", "address": "..." },
 *   ...
 * }
 */
export const mapSiteInfo = (apiData) => {
  if (!apiData) return null

  return {
    // Basic info
    name: apiData.hotel_name || apiData.name || apiData.hotelName,
    description: apiData.hotel_description || apiData.description,
    
    // Contact
    phone: apiData.contact?.phone || apiData.phone || apiData.telephone,
    email: apiData.contact?.email || apiData.email,
    address: apiData.contact?.address || apiData.address || apiData.street,
    city: apiData.contact?.city || apiData.city,
    state: apiData.contact?.state || apiData.state,
    zip: apiData.contact?.zip || apiData.zipCode || apiData.postal_code,
    country: apiData.contact?.country || apiData.country,
    
    // Images
    mainImage: apiData.main_image || apiData.mainImage || apiData.featured_image,
    logo: apiData.logo || apiData.logo_url,
    gallery: mapGallery(apiData.gallery || apiData.images || []),
    roomsHeroImage: apiData.rooms_hero || apiData.roomsHeroImage,
    
    // Location
    location: {
      latitude: apiData.location?.latitude || apiData.lat || apiData.latitude,
      longitude: apiData.location?.longitude || apiData.lng || apiData.longitude
    },
    
    // Times
    checkInTime: apiData.check_in_time || apiData.checkInTime || '3:00 PM',
    checkOutTime: apiData.check_out_time || apiData.checkOutTime || '11:00 AM',
    
    // SEO
    seoTitle: apiData.seo_title || apiData.seoTitle || apiData.meta_title,
    seoDescription: apiData.seo_description || apiData.seoDescription || apiData.meta_description,
    
    // Social
    facebook: apiData.social?.facebook || apiData.facebook_url,
    instagram: apiData.social?.instagram || apiData.instagram_url,
    twitter: apiData.social?.twitter || apiData.twitter_url,
    
    // FAQs
    faqs: mapFaqs(apiData.faqs || apiData.faq || []),
    
    // Amenities
    standardAmenities: mapAmenities(apiData.standard_amenities || apiData.amenities || [])
  }
}

/**
 * Map rooms from API to app format
 */
export const mapRooms = (apiData) => {
  if (!apiData || !Array.isArray(apiData)) return []

  return apiData.map(room => ({
    id: room.id || room.room_id || room.roomId,
    name: room.name || room.room_name || room.title,
    slug: room.slug || room.name?.toLowerCase().replace(/\s+/g, '-'),
    description: room.description || room.long_description,
    shortDescription: room.short_description || room.summary || room.description?.substring(0, 150),
    
    // Pricing
    price: room.price || room.base_price || room.rate || room.starting_price,
    basePrice: room.base_price || room.price,
    currency: room.currency || 'USD',
    
    // Images
    image: room.image || room.main_image || room.featured_image,
    images: mapGallery(room.images || room.gallery || []),
    
    // Details
    maxGuests: room.max_guests || room.capacity || room.maxOccupancy,
    bedType: room.bed_type || room.bedType || room.bed,
    size: room.size || room.square_feet || room.area,
    
    // Features and amenities
    features: room.features || room.highlights || [],
    amenities: room.amenities || room.room_amenities || [],
    
    // Availability
    available: room.available !== false,
    
    // Category
    category: room.category || room.room_type || room.type
  }))
}

/**
 * Map offers from API to app format
 */
export const mapOffers = (apiData) => {
  if (!apiData || !Array.isArray(apiData)) return []

  return apiData.map(offer => ({
    id: offer.id || offer.offer_id,
    slug: offer.slug || offer.title?.toLowerCase().replace(/\s+/g, '-'),
    title: offer.title || offer.name || offer.offer_name,
    description: offer.description || offer.details,
    
    // Discount
    discount: offer.discount || offer.discount_percent || offer.percentage,
    discountType: offer.discount_type || 'percentage',
    
    // Validity
    validFrom: offer.valid_from || offer.start_date,
    validTo: offer.valid_to || offer.end_date,
    
    // Images
    image: offer.image || offer.featured_image,
    
    // Terms
    terms: offer.terms || offer.conditions || offer.terms_and_conditions
  }))
}

/**
 * Map amenities
 */
const mapAmenities = (amenities) => {
  if (!Array.isArray(amenities)) return []

  return amenities.map(amenity => {
    if (typeof amenity === 'string') {
      return {
        name: amenity,
        description: '',
        icon: getAmenityIcon(amenity)
      }
    }
    
    return {
      name: amenity.name || amenity.title,
      description: amenity.description || amenity.desc || '',
      icon: amenity.icon || getAmenityIcon(amenity.name)
    }
  })
}

/**
 * Map gallery images
 */
const mapGallery = (images) => {
  if (!Array.isArray(images)) return []

  return images.map(img => {
    if (typeof img === 'string') {
      return { url: img, alt: 'Hotel Image' }
    }
    
    return {
      url: img.url || img.src || img.image,
      alt: img.alt || img.title || img.caption || 'Hotel Image',
      caption: img.caption || img.description
    }
  })
}

/**
 * Map FAQs
 */
const mapFaqs = (faqs) => {
  if (!Array.isArray(faqs)) return []

  return faqs.map(faq => ({
    question: faq.question || faq.q || faq.title,
    answer: faq.answer || faq.a || faq.content || faq.response
  }))
}

/**
 * Get appropriate icon for amenity
 */
const getAmenityIcon = (amenityName) => {
  const name = amenityName?.toLowerCase() || ''
  
  if (name.includes('wifi') || name.includes('internet')) return 'mdi:wifi'
  if (name.includes('parking')) return 'mdi:parking'
  if (name.includes('pool') || name.includes('swimming')) return 'mdi:pool'
  if (name.includes('gym') || name.includes('fitness')) return 'mdi:dumbbell'
  if (name.includes('spa')) return 'mdi:spa'
  if (name.includes('restaurant') || name.includes('dining')) return 'mdi:silverware-fork-knife'
  if (name.includes('bar')) return 'mdi:glass-cocktail'
  if (name.includes('coffee')) return 'mdi:coffee'
  if (name.includes('tv') || name.includes('television')) return 'mdi:television'
  if (name.includes('air') || name.includes('climate')) return 'mdi:air-conditioner'
  if (name.includes('pet')) return 'mdi:paw'
  if (name.includes('concierge')) return 'mdi:account-tie'
  if (name.includes('room service')) return 'mdi:room-service'
  if (name.includes('laundry')) return 'mdi:washing-machine'
  
  return 'mdi:check-circle'
}

/**
 * Main export: Process API data
 */
export const processAPIData = {
  siteInfo: mapSiteInfo,
  rooms: mapRooms,
  offers: mapOffers
}
