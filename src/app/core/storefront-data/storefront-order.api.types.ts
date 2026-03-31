import { StorefrontCheckoutPayload, StorefrontCheckoutResult } from './storefront-data.models';

export interface StorefrontOrderApiRequest extends StorefrontCheckoutPayload {}

export interface StorefrontOrderApiResponse {
  status: boolean;
  message?: string;
  data?: {
    order: StorefrontCheckoutResult;
  } | null;
}
