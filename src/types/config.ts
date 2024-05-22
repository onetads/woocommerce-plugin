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

  selectors?: {
    views?: {
      mainPage?: string;
      productPage?: string;
      categoryPage?: string;
    };
    product?: {
      productsContainerSelector?: string;
      productsSelector?: string;
      linkSelectors?: string[];
      tagSelector?: string;
    };
  };

  tagClasses?: string;
  itemsToDelete?: string[];
};

export type { TSponsoredProductConfig };
