// Global shared currency state — accessible from any component
export const useCurrency = () => useState('selectedCurrency', () => 'EUR')
