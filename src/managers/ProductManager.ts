import { PRODUCTS_CONTAINER_NOT_FOUND } from 'consts/messages';
import { PRODUCTS_CONTAINER_SELECTOR } from 'consts/products';
import { TAG_STYLES, TAG_STYLES_CLASS } from 'consts/tags';
import { VIEWS_MAP } from 'consts/views';
import { TPages } from 'types/pages';
import getMessage from 'utils/getMessage';

class ProductManager {
  constructor(page: TPages) {
    this.page = page;

    const productsContainer = document.querySelector(
      PRODUCTS_CONTAINER_SELECTOR,
    );

    if (!productsContainer) {
      throw new Error(getMessage(PRODUCTS_CONTAINER_NOT_FOUND));
    }

    this.productsContainer = productsContainer;
  }

  private page: TPages;
  private productsContainer: Element;

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

  private addTagToProduct = (productElement: Element) => {
    const labelElement = document.createElement('p');
    labelElement.classList.add(TAG_STYLES_CLASS);
    labelElement.classList.add('woocommerce-loop-product__title');
    labelElement.textContent = window.sponsoredProductConfig.tagLabel;

    productElement.prepend(labelElement);

    return productElement;
  };

  private deleteExistingProduct = (id: string) => {
    this.productsContainer.querySelector(`.post-${id}`)?.remove();
  };

  private injectTagStyles = () => {
    const stylesElement = document.createElement('style');
    stylesElement.innerHTML = TAG_STYLES;
    this.productsContainer.appendChild(stylesElement);
  };

  public injectProduct = async () => {
    this.injectTagStyles();
    this.deleteExistingProduct();

    const markedProduct = this.addTagToProduct(product);
    this.productsContainer.appendChild(markedProduct);
  };
}

export default ProductManager;
