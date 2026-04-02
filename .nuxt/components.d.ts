
import type { DefineComponent, SlotsType } from 'vue'
type IslandComponent<T> = DefineComponent<{}, {refresh: () => Promise<void>}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, SlotsType<{ fallback: { error: unknown } }>> & T

type HydrationStrategies = {
  hydrateOnVisible?: IntersectionObserverInit | true
  hydrateOnIdle?: number | true
  hydrateOnInteraction?: keyof HTMLElementEventMap | Array<keyof HTMLElementEventMap> | true
  hydrateOnMediaQuery?: string
  hydrateAfter?: number
  hydrateWhen?: boolean
  hydrateNever?: true
}
type LazyComponent<T> = DefineComponent<HydrationStrategies, {}, {}, {}, {}, {}, {}, { hydrated: () => void }> & T


export const AmenitiesSection: typeof import("../templates/template1/components/AmenitiesSection.vue")['default']
export const FeaturedServices: typeof import("../templates/template1/components/FeaturedServices.vue")['default']
export const GallerySection: typeof import("../templates/template1/components/GallerySection.vue")['default']
export const HeroCarousel: typeof import("../templates/template1/components/HeroCarousel.vue")['default']
export const HistorySection: typeof import("../templates/template1/components/HistorySection.vue")['default']
export const LocationMap: typeof import("../templates/template1/components/LocationMap.vue")['default']
export const ReservationModal: typeof import("../templates/template1/components/ReservationModal.vue")['default']
export const RoomsCarousel: typeof import("../templates/template1/components/RoomsCarousel.vue")['default']
export const TestimonialsSection: typeof import("../templates/template1/components/TestimonialsSection.vue")['default']
export const TheFooter: typeof import("../templates/template1/components/TheFooter.vue")['default']
export const TheHeader: typeof import("../templates/template1/components/TheHeader.vue")['default']
export const AboutSection: typeof import("../templates/template3/components/AboutSection.vue")['default']
export const ContactSection: typeof import("../templates/template3/components/ContactSection.vue")['default']
export const HeroSection: typeof import("../templates/template3/components/HeroSection.vue")['default']
export const PageHero: typeof import("../templates/template3/components/PageHero.vue")['default']
export const ReviewsSection: typeof import("../templates/template3/components/ReviewsSection.vue")['default']
export const RoomsSection: typeof import("../templates/template3/components/RoomsSection.vue")['default']
export const ServicesSection: typeof import("../templates/template3/components/ServicesSection.vue")['default']
export const T3LanguageSwitcher: typeof import("../templates/template3/components/T3LanguageSwitcher.vue")['default']
export const DiningSection: typeof import("../templates/template2/components/DiningSection.vue")['default']
export const FacilitiesSection: typeof import("../templates/template2/components/FacilitiesSection.vue")['default']
export const HeroVideo: typeof import("../templates/template2/components/HeroVideo.vue")['default']
export const ReservationBar: typeof import("../templates/template2/components/ReservationBar.vue")['default']
export const SurroundingsSection: typeof import("../templates/template2/components/SurroundingsSection.vue")['default']
export const T2LanguageSwitcher: typeof import("../templates/template2/components/T2LanguageSwitcher.vue")['default']
export const LanguageSwitcher: typeof import("../components/LanguageSwitcher.vue")['default']
export const TemplateSwitcher: typeof import("../components/TemplateSwitcher.vue")['default']
export const NuxtWelcome: typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']
export const NuxtLayout: typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
export const NuxtErrorBoundary: typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
export const ClientOnly: typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']
export const DevOnly: typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']
export const ServerPlaceholder: typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']
export const NuxtLink: typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']
export const NuxtLoadingIndicator: typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
export const NuxtTime: typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
export const NuxtRouteAnnouncer: typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
export const NuxtImg: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
export const NuxtPicture: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
export const Icon: typeof import("../node_modules/@nuxt/icon/dist/runtime/components/index")['default']
export const NuxtPage: typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']
export const NoScript: typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']
export const Link: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']
export const Base: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']
export const Title: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']
export const Meta: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']
export const Style: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']
export const Head: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']
export const Html: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']
export const Body: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']
export const NuxtIsland: typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']
export const LazyAmenitiesSection: LazyComponent<typeof import("../templates/template1/components/AmenitiesSection.vue")['default']>
export const LazyFeaturedServices: LazyComponent<typeof import("../templates/template1/components/FeaturedServices.vue")['default']>
export const LazyGallerySection: LazyComponent<typeof import("../templates/template1/components/GallerySection.vue")['default']>
export const LazyHeroCarousel: LazyComponent<typeof import("../templates/template1/components/HeroCarousel.vue")['default']>
export const LazyHistorySection: LazyComponent<typeof import("../templates/template1/components/HistorySection.vue")['default']>
export const LazyLocationMap: LazyComponent<typeof import("../templates/template1/components/LocationMap.vue")['default']>
export const LazyReservationModal: LazyComponent<typeof import("../templates/template1/components/ReservationModal.vue")['default']>
export const LazyRoomsCarousel: LazyComponent<typeof import("../templates/template1/components/RoomsCarousel.vue")['default']>
export const LazyTestimonialsSection: LazyComponent<typeof import("../templates/template1/components/TestimonialsSection.vue")['default']>
export const LazyTheFooter: LazyComponent<typeof import("../templates/template1/components/TheFooter.vue")['default']>
export const LazyTheHeader: LazyComponent<typeof import("../templates/template1/components/TheHeader.vue")['default']>
export const LazyAboutSection: LazyComponent<typeof import("../templates/template3/components/AboutSection.vue")['default']>
export const LazyContactSection: LazyComponent<typeof import("../templates/template3/components/ContactSection.vue")['default']>
export const LazyHeroSection: LazyComponent<typeof import("../templates/template3/components/HeroSection.vue")['default']>
export const LazyPageHero: LazyComponent<typeof import("../templates/template3/components/PageHero.vue")['default']>
export const LazyReviewsSection: LazyComponent<typeof import("../templates/template3/components/ReviewsSection.vue")['default']>
export const LazyRoomsSection: LazyComponent<typeof import("../templates/template3/components/RoomsSection.vue")['default']>
export const LazyServicesSection: LazyComponent<typeof import("../templates/template3/components/ServicesSection.vue")['default']>
export const LazyT3LanguageSwitcher: LazyComponent<typeof import("../templates/template3/components/T3LanguageSwitcher.vue")['default']>
export const LazyDiningSection: LazyComponent<typeof import("../templates/template2/components/DiningSection.vue")['default']>
export const LazyFacilitiesSection: LazyComponent<typeof import("../templates/template2/components/FacilitiesSection.vue")['default']>
export const LazyHeroVideo: LazyComponent<typeof import("../templates/template2/components/HeroVideo.vue")['default']>
export const LazyReservationBar: LazyComponent<typeof import("../templates/template2/components/ReservationBar.vue")['default']>
export const LazySurroundingsSection: LazyComponent<typeof import("../templates/template2/components/SurroundingsSection.vue")['default']>
export const LazyT2LanguageSwitcher: LazyComponent<typeof import("../templates/template2/components/T2LanguageSwitcher.vue")['default']>
export const LazyLanguageSwitcher: LazyComponent<typeof import("../components/LanguageSwitcher.vue")['default']>
export const LazyTemplateSwitcher: LazyComponent<typeof import("../components/TemplateSwitcher.vue")['default']>
export const LazyNuxtWelcome: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
export const LazyNuxtLayout: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
export const LazyNuxtErrorBoundary: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
export const LazyClientOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']>
export const LazyDevOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']>
export const LazyServerPlaceholder: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
export const LazyNuxtLink: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
export const LazyNuxtLoadingIndicator: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
export const LazyNuxtTime: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
export const LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
export const LazyNuxtImg: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
export const LazyNuxtPicture: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
export const LazyIcon: LazyComponent<typeof import("../node_modules/@nuxt/icon/dist/runtime/components/index")['default']>
export const LazyNuxtPage: LazyComponent<typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']>
export const LazyNoScript: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
export const LazyLink: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']>
export const LazyBase: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']>
export const LazyTitle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']>
export const LazyMeta: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']>
export const LazyStyle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']>
export const LazyHead: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']>
export const LazyHtml: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']>
export const LazyBody: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']>
export const LazyNuxtIsland: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']>

export const componentNames: string[]
