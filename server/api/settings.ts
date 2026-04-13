import { defineEventHandler, getQuery } from 'h3'
import { $fetch } from 'ofetch'

export default defineEventHandler(async (event) => {
    try {
        const query = getQuery(event)
        const idEtab = query.idEtab || '14373'

        const externalUrl = `https://www.riadchalla.com/api/site-info?idEtab=${idEtab}`

        console.log(`[proxy/settings] Fetching: ${externalUrl}`)

        const response = await $fetch(externalUrl, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/json, text/plain, */*',
                'Accept-Language': 'en-US,en;q=0.9',
            }
        })

        console.log(`[proxy/settings] Success for ${idEtab}`)
        // Return the actual data. Direct API usually returns the object directly.
        return response
    } catch (error: any) {
        console.error('[proxy/settings] Error:', error?.message || String(error))
        return {
            success: false,
            message: 'Failed to load settings',
            error: error?.message || String(error)
        }
    }
})
