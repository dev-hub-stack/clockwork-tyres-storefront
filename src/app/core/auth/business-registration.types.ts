export type BusinessAccountMode = 'retailer' | 'supplier' | 'both';

export type BusinessPlanPreference = 'basic' | 'premium';

export type CountryOption = {
  id: number;
  countryName: string;
  countryCode?: string | null;
};

export type BusinessRegistrationPayload = {
  businessName: string;
  email: string;
  password: string;
  country: string;
  accountMode: BusinessAccountMode;
  planPreference: BusinessPlanPreference;
  acceptsTerms: boolean;
  acceptsPrivacy: boolean;
  supportingDocument: File;
};

export type BusinessRegistrationSuccess = {
  status: boolean;
  message: string;
  data: unknown;
};

export type CountriesApiResponse = {
  status: boolean;
  message: string;
  data?: {
    countries?: CountryOption[];
  };
};
