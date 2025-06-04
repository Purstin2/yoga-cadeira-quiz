/**
 * Utilitários para rastreamento de análises com o UTMify
 */

// Declaração de tipo para o objeto utmify global
declare global {
  interface Window {
    utmify: any;
  }
}

/**
 * Rastreia um evento de PageView padrão
 */
export const trackPageView = () => {
  if (window.utmify) {
    window.utmify.track('pageview');
  }
};

/**
 * Rastreia um evento personalizado no UTMify
 * @param eventName - Nome do evento a ser rastreado
 * @param params - Parâmetros adicionais do evento (opcional)
 */
export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  if (window.utmify) {
    if (params) {
      window.utmify.track(eventName, params);
    } else {
      window.utmify.track(eventName);
    }
  }
};

/**
 * Eventos padrão do UTMify para facilitar o uso
 */
export const PixelEvents = {
  COMPLETE_REGISTRATION: 'complete_registration',
  LEAD: 'lead',
  VIEW_CONTENT: 'view_content',
  ADD_TO_CART: 'add_to_cart',
  INITIATE_CHECKOUT: 'initiate_checkout',
  ADD_PAYMENT_INFO: 'add_payment_info',
  PURCHASE: 'purchase',
};

export default {
  trackPageView,
  trackEvent,
  PixelEvents
}; 