import {
  StorefrontCapabilities,
  StorefrontCtaKey,
  StorefrontCtaState,
  StorefrontModeConfig,
  StorefrontModeId
} from './storefront-mode.types';

const createCtaState = (
  key: StorefrontCtaKey,
  visible: boolean,
  enabled: boolean,
  reason: StorefrontCtaState['reason']
): StorefrontCtaState => ({
  key,
  visible,
  enabled,
  behavior: visible ? (enabled ? 'enabled' : 'disabled') : 'hidden',
  reason
});

const retailStoreCapabilities: StorefrontCapabilities = {
  pricing: true,
  'stock-visibility': true,
  'quantity-selection': true,
  cart: true,
  checkout: true,
  'order-placement': true
};

const supplierPreviewCapabilities: StorefrontCapabilities = {
  pricing: true,
  'stock-visibility': true,
  'quantity-selection': false,
  cart: false,
  checkout: false,
  'order-placement': false
};

export const STOREFRONT_MODE_CONFIG: Record<StorefrontModeId, StorefrontModeConfig> = {
  'retail-store': {
    id: 'retail-store',
    label: 'Retail Store',
    description: 'Full retail storefront with cart and checkout enabled.',
    readOnly: false,
    capabilities: retailStoreCapabilities,
    ctas: {
      'add-to-cart': createCtaState('add-to-cart', true, true, 'available'),
      'view-cart': createCtaState('view-cart', true, true, 'available'),
      'start-checkout': createCtaState('start-checkout', true, true, 'available'),
      'submit-checkout': createCtaState('submit-checkout', true, true, 'available'),
      'change-quantity': createCtaState('change-quantity', true, true, 'available')
    }
  },
  'supplier-preview': {
    id: 'supplier-preview',
    label: 'Supplier Preview',
    description: 'Read-only supplier storefront preview with cart and checkout disabled.',
    readOnly: true,
    capabilities: supplierPreviewCapabilities,
    ctas: {
      'add-to-cart': createCtaState(
        'add-to-cart',
        false,
        false,
        'supplier-preview-read-only'
      ),
      'view-cart': createCtaState('view-cart', false, false, 'cart-disabled-in-mode'),
      'start-checkout': createCtaState(
        'start-checkout',
        false,
        false,
        'checkout-disabled-in-mode'
      ),
      'submit-checkout': createCtaState(
        'submit-checkout',
        false,
        false,
        'checkout-disabled-in-mode'
      ),
      'change-quantity': createCtaState(
        'change-quantity',
        false,
        false,
        'quantity-disabled-in-mode'
      )
    }
  }
};
