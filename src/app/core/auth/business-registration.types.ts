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

export type BusinessRegistrationSuccessData = {
  owner: {
    id: number;
    name: string;
    email: string;
  };
  account: {
    id: number;
    name: string;
    slug: string;
    account_type: BusinessAccountMode;
    account_type_label: string;
    retail_enabled: boolean;
    wholesale_enabled: boolean;
  };
  subscription: {
    id: number;
    plan_code: BusinessPlanPreference;
    plan_label: string;
    reports_enabled: boolean;
    status: string;
  };
  onboarding: {
    id: number;
    country: string | null;
    document_uploaded: boolean;
    registration_source: string | null;
    status: string;
  };
};

export type BusinessRegistrationSuccess = {
  status: boolean;
  message: string;
  data: BusinessRegistrationSuccessData;
};

export type CountriesApiResponse = {
  status: boolean;
  message: string;
  data?: {
    countries?: CountryOption[];
  };
};
