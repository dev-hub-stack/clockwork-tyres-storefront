import { BusinessAccountMode } from './business-registration.types';

export type BusinessLoginPayload = {
  email: string;
  password: string;
};

export type BusinessForgotPasswordPayload = {
  email: string;
};

export type BusinessAccountSummary = {
  id: number;
  name: string;
  slug: string;
  account_type: BusinessAccountMode;
  retail_enabled: boolean;
  wholesale_enabled: boolean;
  status: string;
};

export type BusinessAccountContext = {
  selection_source: string | null;
  current_account: BusinessAccountSummary | null;
  available_accounts: BusinessAccountSummary[];
};

export type BusinessLoginSuccessData = {
  access_token: string;
  token_type: 'Bearer' | string;
  owner: {
    id: number;
    name: string;
    email: string;
  };
  account_context: BusinessAccountContext;
};

export type BusinessLoginSuccess = {
  status: boolean;
  message: string;
  data: BusinessLoginSuccessData;
};

export type BusinessForgotPasswordSuccess = {
  status: boolean;
  message: string;
  data: null;
};
