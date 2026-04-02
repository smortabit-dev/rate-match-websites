import { defineEventHandler, getQuery } from 'h3'
import { $fetch } from 'ofetch'

export default defineEventHandler(async (event) => {
    try {
        const query = getQuery(event)
        const locale = query.locales || 'en'
        const id = query.id || '11232'

        // ✅ Call the external API
        const externalUrl = `https://traduction.uncubus.tech/translations/?locales=${locale}&id=${id}`

        const response = await $fetch(externalUrl, {
            method: 'GET',
        })

        return response
    } catch (error) {
        console.error('Error fetching translations:', error)
        return {
            success: false,
            message: 'Failed to load translations',
        }
    }
})
