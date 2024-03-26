type TPageConfig = {
  isEnabled: boolean;
  productsCount: number;
};

type TSponsoredProductConfig = {
  tagLabel: string;
  isLoaderVisible: boolean;

  productsList: TPageConfig;
  pageDetails: TPageConfig;
  mainPage: TPageConfig;
};

export type { TSponsoredProductConfig };
