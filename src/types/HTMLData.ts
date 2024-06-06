type TProductDataResponse = {
  product_html: string;
  link_url: string;
};

type THTMLDataResponse = {
  list_container_tag: string;
  product_tag: string;
  original_promo_tag: string;
  substitute_promo_tag: string;
};

type THTMLData = {
  productsContainerSelector: string;
  productSelector: string;
  originalPromoTagHTML: string;
  substitutePromoTagHTML: string;
};

export type { TProductDataResponse, THTMLDataResponse, THTMLData };
