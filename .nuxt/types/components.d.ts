
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

interface _GlobalComponents {
  AmenitiesSection: typeof import("../../templates/template1/components/AmenitiesSection.vue")['default']
  ContactSection: typeof import("../../templates/template1/components/ContactSection.vue")['default']
  FeaturedServices: typeof import("../../templates/template1/components/FeaturedServices.vue")['default']
  GallerySection: typeof import("../../templates/template1/components/GallerySection.vue")['default']
  HeroCarousel: typeof import("../../templates/template1/components/HeroCarousel.vue")['default']
  HistorySection: typeof import("../../templates/template1/components/HistorySection.vue")['default']
  LocationMap: typeof import("../../templates/template1/components/LocationMap.vue")['default']
  ReservationModal: typeof import("../../templates/template1/components/ReservationModal.vue")['default']
  RoomsCarousel: typeof import("../../templates/template1/components/RoomsCarousel.vue")['default']
  TestimonialsSection: typeof import("../../templates/template1/components/TestimonialsSection.vue")['default']
  TheFooter: typeof import("../../templates/template1/components/TheFooter.vue")['default']
  TheHeader: typeof import("../../templates/template1/components/TheHeader.vue")['default']
  AboutSection: typeof import("../../templates/template3/components/AboutSection.vue")['default']
  HeroSection: typeof import("../../templates/template3/components/HeroSection.vue")['default']
  PageHero: typeof import("../../templates/template3/components/PageHero.vue")['default']
  ReviewsSection: typeof import("../../templates/template3/components/ReviewsSection.vue")['default']
  RoomsSection: typeof import("../../templates/template3/components/RoomsSection.vue")['default']
  ServicesSection: typeof import("../../templates/template3/components/ServicesSection.vue")['default']
  T3LanguageSwitcher: typeof import("../../templates/template3/components/T3LanguageSwitcher.vue")['default']
  DiningSection: typeof import("../../templates/template2/components/DiningSection.vue")['default']
  FacilitiesSection: typeof import("../../templates/template2/components/FacilitiesSection.vue")['default']
  HeroVideo: typeof import("../../templates/template2/components/HeroVideo.vue")['default']
  ReservationBar: typeof import("../../templates/template2/components/ReservationBar.vue")['default']
  SurroundingsSection: typeof import("../../templates/template2/components/SurroundingsSection.vue")['default']
  T2LanguageSwitcher: typeof import("../../templates/template2/components/T2LanguageSwitcher.vue")['default']
  LanguageSwitcher: typeof import("../../components/LanguageSwitcher.vue")['default']
  TemplateSwitcher: typeof import("../../components/TemplateSwitcher.vue")['default']
  NuxtWelcome: typeof import("../../node_modules/nuxt/dist/app/components/welcome.vue")['default']
  NuxtLayout: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
  NuxtErrorBoundary: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
  ClientOnly: typeof import("../../node_modules/nuxt/dist/app/components/client-only")['default']
  DevOnly: typeof import("../../node_modules/nuxt/dist/app/components/dev-only")['default']
  ServerPlaceholder: typeof import("../../node_modules/nuxt/dist/app/components/server-placeholder")['default']
  NuxtLink: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-link")['default']
  NuxtLoadingIndicator: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
  NuxtTime: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
  NuxtRouteAnnouncer: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
  NuxtImg: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
  NuxtPicture: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
  Icon: typeof import("../../node_modules/@nuxt/icon/dist/runtime/components/index")['default']
  NuxtPage: typeof import("../../node_modules/nuxt/dist/pages/runtime/page")['default']
  NoScript: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['NoScript']
  Link: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Link']
  Base: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Base']
  Title: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Title']
  Meta: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Meta']
  Style: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Style']
  Head: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Head']
  Html: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Html']
  Body: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Body']
  NuxtIsland: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-island")['default']
  LazyAmenitiesSection: LazyComponent<typeof import("../../templates/template1/components/AmenitiesSection.vue")['default']>
  LazyContactSection: LazyComponent<typeof import("../../templates/template1/components/ContactSection.vue")['default']>
  LazyFeaturedServices: LazyComponent<typeof import("../../templates/template1/components/FeaturedServices.vue")['default']>
  LazyGallerySection: LazyComponent<typeof import("../../templates/template1/components/GallerySection.vue")['default']>
  LazyHeroCarousel: LazyComponent<typeof import("../../templates/template1/components/HeroCarousel.vue")['default']>
  LazyHistorySection: LazyComponent<typeof import("../../templates/template1/components/HistorySection.vue")['default']>
  LazyLocationMap: LazyComponent<typeof import("../../templates/template1/components/LocationMap.vue")['default']>
  LazyReservationModal: LazyComponent<typeof import("../../templates/template1/components/ReservationModal.vue")['default']>
  LazyRoomsCarousel: LazyComponent<typeof import("../../templates/template1/components/RoomsCarousel.vue")['default']>
  LazyTestimonialsSection: LazyComponent<typeof import("../../templates/template1/components/TestimonialsSection.vue")['default']>
  LazyTheFooter: LazyComponent<typeof import("../../templates/template1/components/TheFooter.vue")['default']>
  LazyTheHeader: LazyComponent<typeof import("../../templates/template1/components/TheHeader.vue")['default']>
  LazyAboutSection: LazyComponent<typeof import("../../templates/template3/components/AboutSection.vue")['default']>
  LazyHeroSection: LazyComponent<typeof import("../../templates/template3/components/HeroSection.vue")['default']>
  LazyPageHero: LazyComponent<typeof import("../../templates/template3/components/PageHero.vue")['default']>
  LazyReviewsSection: LazyComponent<typeof import("../../templates/template3/components/ReviewsSection.vue")['default']>
  LazyRoomsSection: LazyComponent<typeof import("../../templates/template3/components/RoomsSection.vue")['default']>
  LazyServicesSection: LazyComponent<typeof import("../../templates/template3/components/ServicesSection.vue")['default']>
  LazyT3LanguageSwitcher: LazyComponent<typeof import("../../templates/template3/components/T3LanguageSwitcher.vue")['default']>
  LazyDiningSection: LazyComponent<typeof import("../../templates/template2/components/DiningSection.vue")['default']>
  LazyFacilitiesSection: LazyComponent<typeof import("../../templates/template2/components/FacilitiesSection.vue")['default']>
  LazyHeroVideo: LazyComponent<typeof import("../../templates/template2/components/HeroVideo.vue")['default']>
  LazyReservationBar: LazyComponent<typeof import("../../templates/template2/components/ReservationBar.vue")['default']>
  LazySurroundingsSection: LazyComponent<typeof import("../../templates/template2/components/SurroundingsSection.vue")['default']>
  LazyT2LanguageSwitcher: LazyComponent<typeof import("../../templates/template2/components/T2LanguageSwitcher.vue")['default']>
  LazyLanguageSwitcher: LazyComponent<typeof import("../../components/LanguageSwitcher.vue")['default']>
  LazyTemplateSwitcher: LazyComponent<typeof import("../../components/TemplateSwitcher.vue")['default']>
  LazyNuxtWelcome: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
  LazyNuxtLayout: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
  LazyNuxtErrorBoundary: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
  LazyClientOnly: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/client-only")['default']>
  LazyDevOnly: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/dev-only")['default']>
  LazyServerPlaceholder: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
  LazyNuxtLink: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
  LazyNuxtLoadingIndicator: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
  LazyNuxtTime: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
  LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
  LazyNuxtImg: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
  LazyNuxtPicture: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
  LazyIcon: LazyComponent<typeof import("../../node_modules/@nuxt/icon/dist/runtime/components/index")['default']>
  LazyNuxtPage: LazyComponent<typeof import("../../node_modules/nuxt/dist/pages/runtime/page")['default']>
  LazyNoScript: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
  LazyLink: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Link']>
  LazyBase: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Base']>
  LazyTitle: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Title']>
  LazyMeta: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Meta']>
  LazyStyle: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Style']>
  LazyHead: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Head']>
  LazyHtml: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Html']>
  LazyBody: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Body']>
  LazyNuxtIsland: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-island")['default']>
}

declare module 'vue' {
  export interface GlobalComponents extends _GlobalComponents { }
}

export {}
