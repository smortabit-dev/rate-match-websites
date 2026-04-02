import { defineEventHandler } from 'h3'
import { $fetch } from 'ofetch'

export default defineEventHandler(async (event) => {
    try {
        // ✅ Get the host from the incoming client request
        const req = event.node.req
        let host =
            req.headers['x-forwarded-host'] || // from proxies/load balancers
            req.headers.host ||                // fallback (localhost, domain, etc.)
            ''

        // The user explicitly set this in the prompt logic, 
        // though usually we'd want to use the detected host.
        // Keeping it as requested.
        host = 'riadchalla.com'

        // ✅ Call the external API
        const externalUrl = `https://www.riadchalla.com/api/site-info?idEtab=14373`

        const response = await $fetch(externalUrl, {
            method: 'GET',
        })

        return {
            success: true,
            host: host,
            data: response,
        }
    } catch (error) {
        console.error('Error fetching site infos:', error)
        return {
            success: false,
            message: 'Failed to load settings',
        }
    }
})
