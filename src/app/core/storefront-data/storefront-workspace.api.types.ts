import {
  StorefrontAddress,
  StorefrontOrder,
  StorefrontProfile
} from './storefront-data.models';

export interface StorefrontWorkspaceApiResponse {
  status: boolean;
  message?: string;
  data?: {
    profile: StorefrontProfile | null;
    addresses: StorefrontAddress[];
    orders: StorefrontOrder[];
  } | null;
}
