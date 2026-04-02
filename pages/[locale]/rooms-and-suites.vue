<template>
  <div>
    <!-- Hero Section -->
    <section class="relative h-[60vh] flex items-center justify-center">
      <img 
        src="https://www.thechemistsclubhotel.com/data/webp/juniorsuite-1603192112-5d1a2e6e3938c139f8dd88337b371bc8.webp"
        alt="Rooms & Suites"
        class="absolute inset-0 w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      <div class="relative z-10 text-center text-white container mx-auto px-4">
        <h1 class="text-5xl md:text-6xl font-serif mb-4">Rooms & Suites</h1>
        <p class="text-xl md:text-2xl text-gray-200">
          Timeless elegance meets modern comfort
        </p>
      </div>
    </section>

    <!-- Introduction -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl mx-auto text-center">
          <p class="text-lg text-gray-700 leading-relaxed">
            Each of our beautifully appointed rooms and suites combines historic charm with contemporary amenities. 
            From marble bathrooms to custom furnishings, every detail has been carefully considered to ensure 
            your comfort during your Manhattan stay.
          </p>
        </div>
      </div>
    </section>

    <!-- Room Types -->
    <section class="py-20 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="space-y-20">
          <!-- Classic Guest Room -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div class="order-2 lg:order-1">
              <h2 class="text-4xl font-serif mb-4">Classic Guest Room</h2>
              <p class="text-gray-600 mb-6">
                Our Classic Guest Rooms offer a refined retreat in the heart of Manhattan. 
                Featuring high ceilings, plush bedding, and marble bathrooms, these rooms provide 
                all the essentials for a comfortable stay.
              </p>
              <ul class="space-y-2 mb-8">
                <li class="flex items-start">
                  <Icon name="mdi:check" class="text-gold mr-2 mt-1 flex-shrink-0" />
                  <span>King or Queen bed options</span>
                </li>
                <li class="flex items-start">
                  <Icon name="mdi:check" class="text-gold mr-2 mt-1 flex-shrink-0" />
                  <span>Marble bathroom with luxury amenities</span>
                </li>
                <li class="flex items-start">
                  <Icon name="mdi:check" class="text-gold mr-2 mt-1 flex-shrink-0" />
                  <span>Work desk and complimentary Wi-Fi</span>
                </li>
                <li class="flex items-start">
                  <Icon name="mdi:check" class="text-gold mr-2 mt-1 flex-shrink-0" />
                  <span>High ceilings and natural light</span>
                </li>
              </ul>
              <button class="btn-secondary">Book Now</button>
            </div>
            <div class="order-1 lg:order-2">
              <img 
                src="https://www.thechemistsclubhotel.com/data/webp/classicguestroom-1603207234-3c819815f50d3739d32d4ac4a05ec146.webp"
                alt="Classic Guest Room"
                class="w-full h-auto rounded-lg shadow-xl"
              />
            </div>
          </div>

          <!-- Deluxe Room with Terrace -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://www.thechemistsclubhotel.com/data/webp/deluxewithterrace-1603133159-0278b1451229443af705dbcac095f18b.webp"
                alt="Deluxe Room with Terrace"
                class="w-full h-auto rounded-lg shadow-xl"
              />
            </div>
            <div>
              <h2 class="text-4xl font-serif mb-4">Deluxe Room with Terrace</h2>
              <p class="text-gray-600 mb-6">
                Experience Manhattan from your private terrace. These spacious rooms feature outdoor 
                spaces perfect for morning coffee or evening relaxation, along with all the luxury 
                amenities you expect.
              </p>
              <ul class="space-y-2 mb-8">
                <li class="flex items-start">
                  <Icon name="mdi:check" class="text-gold mr-2 mt-1 flex-shrink-0" />
                  <span>Private terrace with city views</span>
                </li>
                <li class="flex items-start">
                  <Icon name="mdi:check" class="text-gold mr-2 mt-1 flex-shrink-0" />
                  <span>King bed with premium linens</span>
                </li>
                <li class="flex items-start">
                  <Icon name="mdi:check" class="text-gold mr-2 mt-1 flex-shrink-0" />
                  <span>Spacious marble bathroom</span>
                </li>
                <li class="flex items-start">
                  <Icon name="mdi:check" class="text-gold mr-2 mt-1 flex-shrink-0" />
                  <span>Outdoor furniture for relaxation</span>
                </li>
              </ul>
              <button class="btn-secondary">Book Now</button>
            </div>
          </div>

          <!-- Junior Suite -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div class="order-2 lg:order-1">
              <h2 class="text-4xl font-serif mb-4">Junior Suite</h2>
              <p class="text-gray-600 mb-6">
                Our Junior Suites provide extra space and comfort, perfect for longer stays or those 
                seeking a more luxurious experience. Separate living areas and upgraded amenities 
                make these suites ideal for business or leisure.
              </p>
              <ul class="space-y-2 mb-8">
                <li class="flex items-start">
                  <Icon name="mdi:check" class="text-gold mr-2 mt-1 flex-shrink-0" />
                  <span>Separate living and sleeping areas</span>
                </li>
                <li class="flex items-start">
                  <Icon name="mdi:check" class="text-gold mr-2 mt-1 flex-shrink-0" />
                  <span>King bed and sofa seating</span>
                </li>
                <li class="flex items-start">
                  <Icon name="mdi:check" class="text-gold mr-2 mt-1 flex-shrink-0" />
                  <span>Premium marble bathroom</span>
                </li>
                <li class="flex items-start">
                  <Icon name="mdi:check" class="text-gold mr-2 mt-1 flex-shrink-0" />
                  <span>Enhanced city views</span>
                </li>
              </ul>
              <button class="btn-secondary">Book Now</button>
            </div>
            <div class="order-1 lg:order-2">
              <img 
                src="https://www.thechemistsclubhotel.com/data/webp/juniorsuite-1603195458-16bba3f4958ba6b6958be5c06b95db09.webp"
                alt="Junior Suite"
                class="w-full h-auto rounded-lg shadow-xl"
              />
            </div>
          </div>

          <!-- Alchemy Suite -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://www.thechemistsclubhotel.com/data/webp/alchemysuite-1603166649-7ccbbcaa1f1b6d12cf728fa347e5ac67.webp"
                alt="Alchemy Suite"
                class="w-full h-auto rounded-lg shadow-xl"
              />
            </div>
            <div>
              <h2 class="text-4xl font-serif mb-4">Alchemy Suite</h2>
              <p class="text-gray-600 mb-6">
                Our signature Alchemy Suite represents the pinnacle of luxury at The Chemists' Club Hotel. 
                With sophisticated design elements and premium amenities throughout, this suite offers 
                an unforgettable Manhattan experience.
              </p>
              <ul class="space-y-2 mb-8">
                <li class="flex items-start">
                  <Icon name="mdi:check" class="text-gold mr-2 mt-1 flex-shrink-0" />
                  <span>Exceptionally high ceilings</span>
                </li>
                <li class="flex items-start">
                  <Icon name="mdi:check" class="text-gold mr-2 mt-1 flex-shrink-0" />
                  <span>Artistic design and ambient lighting</span>
                </li>
                <li class="flex items-start">
                  <Icon name="mdi:check" class="text-gold mr-2 mt-1 flex-shrink-0" />
                  <span>Luxurious bathroom with premium fixtures</span>
                </li>
                <li class="flex items-start">
                  <Icon name="mdi:check" class="text-gold mr-2 mt-1 flex-shrink-0" />
                  <span>Exclusive amenities and services</span>
                </li>
              </ul>
              <button class="btn-secondary">Book Now</button>
            </div>
          </div>

          <!-- Penthouse -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div class="order-2 lg:order-1">
              <h2 class="text-4xl font-serif mb-4">The Penthouse</h2>
              <p class="text-gray-600 mb-6">
                The crown jewel of The Chemists' Club Hotel, our Penthouse suite offers unparalleled 
                luxury with sweeping city views from your private terrace. This extraordinary space 
                combines historic elegance with modern sophistication.
              </p>
              <ul class="space-y-2 mb-8">
                <li class="flex items-start">
                  <Icon name="mdi:check" class="text-gold mr-2 mt-1 flex-shrink-0" />
                  <span>Expansive private terrace with panoramic views</span>
                </li>
                <li class="flex items-start">
                  <Icon name="mdi:check" class="text-gold mr-2 mt-1 flex-shrink-0" />
                  <span>Multiple living spaces</span>
                </li>
                <li class="flex items-start">
                  <Icon name="mdi:check" class="text-gold mr-2 mt-1 flex-shrink-0" />
                  <span>Premium furnishings throughout</span>
                </li>
                <li class="flex items-start">
                  <Icon name="mdi:check" class="text-gold mr-2 mt-1 flex-shrink-0" />
                  <span>Concierge services</span>
                </li>
              </ul>
              <button class="btn-secondary">Book Now</button>
            </div>
            <div class="order-1 lg:order-2">
              <img 
                src="https://www.thechemistsclubhotel.com/data/webp/penthouse-1603105412-cff025a05827f2290f1376148dd8dbb8.webp"
                alt="Penthouse"
                class="w-full h-auto rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Amenities Highlight -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <h2 class="text-4xl font-serif text-center mb-12">All Rooms Include</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <div class="text-center">
            <Icon name="mdi:wifi" class="text-gold text-5xl mx-auto mb-4" />
            <h3 class="font-semibold mb-2">Complimentary Wi-Fi</h3>
            <p class="text-sm text-gray-600">High-speed internet throughout</p>
          </div>
          <div class="text-center">
            <Icon name="mdi:air-conditioner" class="text-gold text-5xl mx-auto mb-4" />
            <h3 class="font-semibold mb-2">Climate Control</h3>
            <p class="text-sm text-gray-600">Individual temperature control</p>
          </div>
          <div class="text-center">
            <Icon name="mdi:coffee" class="text-gold text-5xl mx-auto mb-4" />
            <h3 class="font-semibold mb-2">In-Room Coffee</h3>
            <p class="text-sm text-gray-600">Premium coffee and tea service</p>
          </div>
          <div class="text-center">
            <Icon name="mdi:television" class="text-gold text-5xl mx-auto mb-4" />
            <h3 class="font-semibold mb-2">Smart TV</h3>
            <p class="text-sm text-gray-600">Streaming capabilities</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gray-900 text-white">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-4xl font-serif mb-6">Ready to Experience Manhattan?</h2>
        <p class="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Book your stay at The Chemists' Club Hotel and discover the perfect blend of historic 
          charm and modern luxury in the heart of Midtown.
        </p>
        <button class="btn-primary">Book Your Stay</button>
      </div>
    </section>
  </div>
</template>

<script setup>
useHead({
  title: 'Rooms & Suites - The Chemists\' Club Hotel',
  meta: [
    {
      name: 'description',
      content: 'Discover our beautifully appointed rooms and suites in Midtown Manhattan. From classic guest rooms to our signature Penthouse, experience luxury and comfort.'
    }
  ]
})
</script>
