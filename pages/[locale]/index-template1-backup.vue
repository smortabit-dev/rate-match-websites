<template>
  <div>
    <!-- Hero Section with Image Carousel -->
    <HeroCarousel />

    <!-- Introduction Section -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="section-title mb-6">
            A Boutique Escape Steps from Bryant Park
          </h1>
          <p class="text-lg text-gray-700 leading-relaxed mb-8">
            Set in a meticulously restored Beaux-Arts building, The Chemists' Club Hotel offers a refined stay 
            in the heart of Midtown Manhattan. Just steps from Bryant Park and the iconic New York Public Library, 
            this historic boutique hotel blends classic architecture with contemporary comfort. Inspired by Lavoisier's 
            insight, "Nothing is lost, everything transforms," we've reimagined a storied landmark into an elegant 
            retreat for modern travelers.
          </p>
          <NuxtLink to="/rooms-and-suites" class="btn-secondary inline-block">
            Learn More
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Featured Services -->
    <section class="py-20 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Rooms & Suites -->
          <div class="group cursor-pointer">
            <div class="relative h-96 overflow-hidden mb-6">
              <img 
                src="https://www.thechemistsclubhotel.com/data/webp/juniorsuite-1603192112-5d1a2e6e3938c139f8dd88337b371bc8.webp"
                alt="Room & Suites"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <h3 class="text-2xl font-serif mb-3">Room & Suites</h3>
            <p class="text-gray-600 mb-4">
              Timeless rooms in NY, with marble baths and custom furnishings.
            </p>
            <NuxtLink to="/rooms-and-suites" class="text-gold hover:text-gold-dark font-semibold inline-flex items-center">
              Learn more
              <Icon name="mdi:arrow-right" class="ml-2" />
            </NuxtLink>
          </div>

          <!-- Exclusive Offers -->
          <div class="group cursor-pointer">
            <div class="relative h-96 overflow-hidden mb-6">
              <img 
                src="https://www.thechemistsclubhotel.com/data/webp/lobby-1603347269-a17b6c3b5cfae64f8e06af1fe6e61f07.webp"
                alt="Exclusive Offers"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <h3 class="text-2xl font-serif mb-3">Exclusive Offers</h3>
            <p class="text-gray-600 mb-4">
              Enhance your Manhattan sojourn with our bespoke NY packages.
            </p>
            <NuxtLink to="/offers" class="text-gold hover:text-gold-dark font-semibold inline-flex items-center">
              Learn more
              <Icon name="mdi:arrow-right" class="ml-2" />
            </NuxtLink>
          </div>

          <!-- Dining Onsite -->
          <div class="group cursor-pointer">
            <div class="relative h-96 overflow-hidden mb-6">
              <img 
                src="https://www.thechemistsclubhotel.com/data/webp/penthouse-1603091199-2095ffc63e66da9fa2804be768f3ccb3.webp"
                alt="Dining Onsite"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <h3 class="text-2xl font-serif mb-3">Dining Onsite</h3>
            <p class="text-gray-600 mb-4">
              Indulge in a NY culinary journey at our own Benjamin Steakhouse.
            </p>
            <NuxtLink to="/dine" class="text-gold hover:text-gold-dark font-semibold inline-flex items-center">
              Learn more
              <Icon name="mdi:arrow-right" class="ml-2" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- NYC Secrets Section -->
    <section class="py-20 bg-gray-900 text-white">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <img 
              src="https://www.thechemistsclubhotel.com/data/webp/destination-1603262-crop398-e6d4ae684bf8d4c2a09b81e8747bc887.webp"
              alt="Midtown Manhattan"
              class="w-full h-auto rounded-lg shadow-2xl"
            />
          </div>
          <div>
            <h2 class="text-sm uppercase tracking-widest text-gold mb-4">New York City Secrets</h2>
            <h3 class="text-4xl font-serif mb-6">Explore Midtown Manhattan</h3>
            <p class="text-gray-300 text-lg leading-relaxed mb-8">
              Nestled in the vibrant heart of New York City, our location on East 41st Street places you 
              steps away from iconic landmarks, world-class shopping, and cultural treasures. Let our 
              knowledgeable concierge unveil the city's hidden gems.
            </p>
            <NuxtLink to="/experience-nyc" class="btn-primary inline-block">
              Learn More
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Location Section -->
    <LocationMap />

    <!-- History Section -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="text-sm uppercase tracking-widest text-gold mb-4">History</h2>
            <h3 class="text-4xl font-serif mb-6">
              Once a gathering place for pioneers of science and discovery
            </h3>
            <p class="text-gray-700 text-lg leading-relaxed mb-8">
              The Chemists' Club Hotel reimagines this heritage for the modern traveler, blending the 
              spirit of exploration and innovation with the modern comfort of an urban retreat.
            </p>
            <NuxtLink to="/about-us" class="btn-secondary inline-block">
              Know Our History
            </NuxtLink>
          </div>
          <div>
            <img 
              src="https://www.thechemistsclubhotel.com/data/webp/lobby-1603352480-dc53dc99782008730eee1c4ba342be98.webp"
              alt="Historic Building"
              class="w-full h-auto rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- City Stories (Blog) -->
    <section class="py-20 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-serif mb-4">City Stories</h2>
          <p class="text-xl text-gray-600">Discover the elegance and charm of New York City</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <article class="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <div class="h-64 overflow-hidden">
              <img 
                src="https://www.thechemistsclubhotel.com/data/webp/lobby-1603334983-57b975351fcf95d06bdca58169289730.webp"
                alt="New York Public Library"
                class="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
              />
            </div>
            <div class="p-6">
              <span class="text-xs uppercase tracking-wider text-gold">Culture · Leisure · Restaurants</span>
              <h3 class="text-xl font-serif mt-2 mb-3">
                A Day of History and Serenity: Exploring the New York Public Library and Bryant Park
              </h3>
              <NuxtLink to="/city-secrets/nypl-bryant-park" class="text-gray-900 font-semibold inline-flex items-center hover:text-gold transition-colors">
                Read more
                <Icon name="mdi:arrow-right" class="ml-2" />
              </NuxtLink>
            </div>
          </article>

          <article class="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <div class="h-64 overflow-hidden">
              <img 
                src="https://www.thechemistsclubhotel.com/data/webp/hallmainstaircase-1603324639-7fd7dcf9bb9509c28326ae2b309879a1.webp"
                alt="Art Exhibitions"
                class="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
              />
            </div>
            <div class="p-6">
              <span class="text-xs uppercase tracking-wider text-gold">Culture · Restaurants</span>
              <h3 class="text-xl font-serif mt-2 mb-3">
                Immerse Yourself in Manhattan's Must-See Art Exhibitions
              </h3>
              <NuxtLink to="/city-secrets/art-exhibitions" class="text-gray-900 font-semibold inline-flex items-center hover:text-gold transition-colors">
                Read more
                <Icon name="mdi:arrow-right" class="ml-2" />
              </NuxtLink>
            </div>
          </article>
        </div>

        <div class="text-center">
          <NuxtLink to="/experience-nyc" class="btn-secondary inline-block">
            Discover More
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- FAQs Section -->
    <FAQSection />
  </div>
</template>

<script setup>
// Homepage component
useHead({
  title: 'The Chemists\' Club Hotel - Midtown Manhattan Boutique Hotel',
  meta: [
    {
      name: 'description',
      content: 'Experience refined luxury at The Chemists\' Club Hotel, a historic boutique hotel in Midtown Manhattan. Steps from Bryant Park and the NY Public Library.'
    }
  ]
})
</script>
