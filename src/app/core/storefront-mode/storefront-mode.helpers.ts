import { STOREFRONT_MODE_CONFIG } from './storefront-mode.config';
import {
  StorefrontCapabilityKey,
  StorefrontCtaKey,
  StorefrontCtaState,
  StorefrontModeConfig,
  StorefrontModeContext,
  StorefrontModeId,
  StorefrontModeInput,
  StorefrontModeViewModel,
  STOREFRONT_MODE_IDS
} from './storefront-mode.types';

const STOREFRONT_MODE_ALIASES: Record<string, StorefrontModeId> = {
  retail: 'retail-store',
  'retail-store': 'retail-store',
  supplier: 'supplier-preview',
  preview: 'supplier-preview',
  'supplier-preview': 'supplier-preview',
  supplier_preview: 'supplier-preview'
};

export function isStorefrontModeId(value: unknown): value is StorefrontModeId {
  return typeof value === 'string' && STOREFRONT_MODE_IDS.includes(value as StorefrontModeId);
}

export function resolveStorefrontModeId(mode: StorefrontModeInput): StorefrontModeId {
  if (!mode) {
    return 'retail-store';
  }

  return STOREFRONT_MODE_ALIASES[mode] ?? 'retail-store';
}

export function getStorefrontModeConfig(mode: StorefrontModeInput): StorefrontModeConfig {
  return STOREFRONT_MODE_CONFIG[resolveStorefrontModeId(mode)];
}

export function getStorefrontCapabilities(mode: StorefrontModeInput) {
  return getStorefrontModeConfig(mode).capabilities;
}

export function hasStorefrontCapability(
  mode: StorefrontModeInput,
  capability: StorefrontCapabilityKey
): boolean {
  return getStorefrontCapabilities(mode)[capability];
}

export function getStorefrontCtaState(
  mode: StorefrontModeInput,
  cta: StorefrontCtaKey
): StorefrontCtaState {
  return getStorefrontModeConfig(mode).ctas[cta];
}

export function isCartEnabled(mode: StorefrontModeInput): boolean {
  return hasStorefrontCapability(mode, 'cart');
}

export function isCheckoutEnabled(mode: StorefrontModeInput): boolean {
  return hasStorefrontCapability(mode, 'checkout');
}

export function isReadOnlyStorefront(mode: StorefrontModeInput): boolean {
  return getStorefrontModeConfig(mode).readOnly;
}

export function buildStorefrontModeViewModel(
  mode: StorefrontModeInput,
  context: StorefrontModeContext = {}
): StorefrontModeViewModel {
  const config = getStorefrontModeConfig(mode);

  return {
    id: config.id,
    label: config.label,
    description: config.description,
    readOnly: config.readOnly,
    capabilities: config.capabilities,
    ctas: config.ctas,
    context,
    isRetailStore: config.id === 'retail-store',
    isSupplierPreview: config.id === 'supplier-preview'
  };
}
