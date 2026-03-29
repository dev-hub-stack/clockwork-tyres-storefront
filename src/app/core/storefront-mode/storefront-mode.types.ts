export const STOREFRONT_MODE_IDS = ['retail-store', 'supplier-preview'] as const;

export type StorefrontModeId = (typeof STOREFRONT_MODE_IDS)[number];

export type StorefrontModeInput = StorefrontModeId | 'retail' | 'supplier' | 'preview' | null | undefined;

export const STOREFRONT_CAPABILITY_KEYS = [
  'pricing',
  'stock-visibility',
  'quantity-selection',
  'cart',
  'checkout',
  'order-placement'
] as const;

export type StorefrontCapabilityKey = (typeof STOREFRONT_CAPABILITY_KEYS)[number];

export const STOREFRONT_CTA_KEYS = [
  'add-to-cart',
  'view-cart',
  'start-checkout',
  'submit-checkout',
  'change-quantity'
] as const;

export type StorefrontCtaKey = (typeof STOREFRONT_CTA_KEYS)[number];

export type StorefrontCtaBehavior = 'enabled' | 'disabled' | 'hidden';

export type StorefrontModeReason =
  | 'available'
  | 'supplier-preview-read-only'
  | 'cart-disabled-in-mode'
  | 'checkout-disabled-in-mode'
  | 'quantity-disabled-in-mode';

export type StorefrontModeContext = {
  accountId?: string | number | null;
  accountName?: string | null;
  supplierId?: string | number | null;
  supplierName?: string | null;
};

export type StorefrontCapabilities = Record<StorefrontCapabilityKey, boolean>;

export type StorefrontCtaState = {
  key: StorefrontCtaKey;
  visible: boolean;
  enabled: boolean;
  behavior: StorefrontCtaBehavior;
  reason: StorefrontModeReason;
};

export type StorefrontModeConfig = {
  id: StorefrontModeId;
  label: string;
  description: string;
  readOnly: boolean;
  capabilities: StorefrontCapabilities;
  ctas: Record<StorefrontCtaKey, StorefrontCtaState>;
};

export type StorefrontModeViewModel = {
  id: StorefrontModeId;
  label: string;
  description: string;
  readOnly: boolean;
  capabilities: StorefrontCapabilities;
  ctas: Record<StorefrontCtaKey, StorefrontCtaState>;
  context: StorefrontModeContext;
  isRetailStore: boolean;
  isSupplierPreview: boolean;
};
