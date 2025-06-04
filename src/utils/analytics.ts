/**
 * Utilitários para rastreamento de análises com o Facebook Pixel
 */

// Declaração de tipo para o objeto fbq global
declare global {
  interface Window {
    fbq: any;
  }
}

/**
 * Rastreia um evento de PageView padrão
 */
export const trackPageView = () => {
  if (window.fbq) {
    window.fbq('track', 'PageView');
  }
};

/**
 * Rastreia um evento personalizado no Facebook Pixel
 * @param eventName - Nome do evento a ser rastreado
 * @param params - Parâmetros adicionais do evento (opcional)
 */
export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  if (window.fbq) {
    if (params) {
      window.fbq('track', eventName, params);
    } else {
      window.fbq('track', eventName);
    }
  }
};

/**
 * Eventos padrão do Facebook Pixel para facilitar o uso
 */
export const PixelEvents = {
  COMPLETE_REGISTRATION: 'CompleteRegistration',
  LEAD: 'Lead',
  VIEW_CONTENT: 'ViewContent',
  ADD_TO_CART: 'AddToCart',
  INITIATE_CHECKOUT: 'InitiateCheckout',
  ADD_PAYMENT_INFO: 'AddPaymentInfo',
  PURCHASE: 'Purchase',
};

export default {
  trackPageView,
  trackEvent,
  PixelEvents
}; 