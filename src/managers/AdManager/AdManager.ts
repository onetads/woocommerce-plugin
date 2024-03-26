import { VIEWS_MAP } from 'consts/views';
import { getProductsIds } from 'managers/AdManager/AdManager.util';
import { TPages } from 'types/pages';

class AdManager {
  private page: TPages;
  private productsIds: number[];

  constructor(page: TPages) {
    this.page = page;

    if (this.page) {
      this.productsIds = getProductsIds();
    }
  }

  public getProductHTML = async (id: string) => {
    const view = VIEWS_MAP[this.page];

    const response = await fetch(
      `${window.location.origin}/?rest_route=/ras/get-product-html&product_id=${id}&view=${view}`,
    );

    if (!response.ok) {
      return null;
    }

    const productHTMLString = await response.text();

    const productHTMLWrapper = document.createElement('div');
    productHTMLWrapper.innerHTML = productHTMLString;

    return productHTMLWrapper.firstElementChild;
  };
}
export default AdManager;
