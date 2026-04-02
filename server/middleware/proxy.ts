import { defineEventHandler, proxyRequest, getRequestHeader } from 'h3'

const TARGET = 'https://www.darelmarsa.com'
const LOCALES = ['en', 'fr', 'es', 'ar']

export default defineEventHandler(async (event) => {
  const path = event.path

  const shouldProxy =
    path.startsWith('/api/') ||
    path.startsWith('/site/') ||
    LOCALES.some(l => path.startsWith(`/${l}/api/`) || path.startsWith(`/${l}/site/`))

  if (!shouldProxy) return

  // Forward the real client IP so Symfony can detect Ccountry correctly
  const clientIp =
    getRequestHeader(event, 'x-forwarded-for') ||
    getRequestHeader(event, 'x-real-ip') ||
    event.node.req.socket?.remoteAddress ||
    ''
  event.node.req.headers['x-forwarded-for'] = clientIp
  event.node.req.headers['x-real-ip'] = clientIp

  return proxyRequest(event, `${TARGET}${path}`)
})