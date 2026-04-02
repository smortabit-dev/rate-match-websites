/**
 * Template Configuration
 * 
 * This file manages multiple hotel website templates.
 * Switch between templates by changing the ACTIVE_TEMPLATE constant.
 */

// Available templates
export const TEMPLATES = {
  TEMPLATE_1: 'template1', // onePageCarousel style - Refined, editorial, single-page
}

// Set the active template here
export const ACTIVE_TEMPLATE = TEMPLATES.TEMPLATE_1

// Template configurations
export const TEMPLATE_CONFIG = {
  [TEMPLATES.TEMPLATE_1]: {
    name: 'One Page Carousel Template',
    description: 'Refined, editorial single-page layout with elegant carousels',
    colors: {
      primary: '#B45309',    // Amber-700
      secondary: '#111827',  // Gray-900
      accent: '#D97706',     // Amber-600
    },
    fonts: {
      heading: 'Playfair Display',
      body: 'DM Sans',
    },
    style: 'editorial',
    layout: 'single-page',
  },
}

// Get current template config
export const getCurrentTemplate = () => {
  return TEMPLATE_CONFIG[ACTIVE_TEMPLATE]
}

// Helper to load template-specific components
export const getTemplateComponent = (componentName) => {
  return `templates/${ACTIVE_TEMPLATE}/components/${componentName}`
}

// Helper to load template-specific pages
export const getTemplatePage = (pageName) => {
  return `templates/${ACTIVE_TEMPLATE}/pages/${pageName}`
}

// Helper to load template-specific layout
export const getTemplateLayout = (layoutName) => {
  return `templates/${ACTIVE_TEMPLATE}/layouts/${layoutName}`
}
