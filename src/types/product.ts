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
  renderAd: () => void;
};

export type { TAdProduct, TFormattedProduct };
