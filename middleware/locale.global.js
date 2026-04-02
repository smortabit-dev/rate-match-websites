const DEFAULT_LOCALE = 'en'
const isLangCode = (s) => typeof s === 'string' && /^[a-z]{2}$/.test(s)

export default defineNuxtRouteMiddleware((to) => {
  // Get the first path segment
  const pathSegments = to.path.split('/').filter(Boolean)
  const firstSegment = pathSegments[0]

  // If visiting root '/', redirect to '/en/'
  if (to.path === '/' || to.path === '') {
    return navigateTo(`/${DEFAULT_LOCALE}/`, { redirectCode: 302 })
  }

  // If the first segment is not a valid 2-letter locale code, redirect to /en/ + path
  if (!isLangCode(firstSegment)) {
    return navigateTo(`/${DEFAULT_LOCALE}${to.path}`, { redirectCode: 302 })
  }
})
