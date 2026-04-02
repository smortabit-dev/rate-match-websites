export default defineNuxtPlugin((nuxtApp) => {
  // Get active template from localStorage or use default
  const getActiveTemplate = () => {
    if (process.client) {
      return localStorage.getItem('selectedTemplate') || 'template1'
    }
    return 'template1'
  }

  const activeTemplate = getActiveTemplate()

  // Provide template info globally
  nuxtApp.provide('template', {
    active: activeTemplate,
    isTemplate1: activeTemplate === 'template1',
    isTemplate2: activeTemplate === 'template2',
  })

  // Load template-specific CSS
  if (process.client) {
    const loadTemplateCSS = () => {
      // Remove existing template CSS
      const existingLink = document.querySelector('link[data-template-css]')
      if (existingLink) {
        existingLink.remove()
      }

      // Add new template CSS
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.setAttribute('data-template-css', 'true')
      
      // For now, we'll use the main.css
      // In production, you'd have separate CSS files
      link.href = `/templates/${activeTemplate}/assets/css/main.css`
      
      document.head.appendChild(link)
    }

    // Load CSS on mount
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', loadTemplateCSS)
    } else {
      loadTemplateCSS()
    }
  }
})
