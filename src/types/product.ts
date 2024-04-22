type TAdProduct = {
  offerId: string;
  imageUrl: string;
  offerUrl: string;
  dsaUrl: string;
  div: string;
};

type TFormattedProduct = {
  id: string;
  dsaUrl: string;
  productElement: Element;
};

export type { TAdProduct, TFormattedProduct };
