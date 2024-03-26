import { TSponsoredProductConfig } from 'types/config';

declare global {
  interface Window {
    sponsoredProductConfig: TSponsoredProductConfig;
  }
}

export {};
