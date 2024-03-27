import {
  COULDNT_FIND_NUMBER_OF_ITEMS_IN_ROW,
  PRODUCTS_CONTAINER_NOT_FOUND,
} from 'consts/messages';
import {
  PRODUCTS_CONTAINER_SELECTOR,
  PRODUCTS_SELECTOR,
  PRODUCT_TITLE,
} from 'consts/products';
import { TAG_STYLES, TAG_STYLES_CLASS } from 'consts/tags';
import { TPages } from 'types/pages';
import { TFormattedProduct } from 'types/product';
import getMessage from 'utils/getMessage';

class ProductManager {
  private page: TPages;
  private productsContainer: Element;
  private productElements: Element[];

  constructor(page: TPages) {
    this.page = page;

    const productsContainer = document.querySelector(
      PRODUCTS_CONTAINER_SELECTOR,
    );

    if (!productsContainer) {
      throw new Error(getMessage(PRODUCTS_CONTAINER_NOT_FOUND));
    }

    this.productsContainer = productsContainer;
    this.productElements = Array.from(
      this.productsContainer.querySelectorAll(PRODUCTS_SELECTOR),
    );
  }

  private addTagToProduct = (productElement: Element) => {
    const labelElement = document.createElement('p');
    labelElement.classList.add(TAG_STYLES_CLASS);
    labelElement.classList.add(PRODUCT_TITLE);
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

  private resetRowStyles = () => {
    const productElements = this.productElements;

    for (const productElement of productElements) {
      productElement.classList.remove('first');
    }
  };

  private regenerateRowStyles = () => {
    const productElements = Array.from(
      this.productsContainer.querySelectorAll(PRODUCTS_SELECTOR),
    );
    const containerClasses = Array.from(this.productsContainer.classList);

    const itemsInRow = containerClasses
      .find((className) => className.startsWith('columns-'))
      ?.match(/columns-(\d+)/)?.[1];

    if (!itemsInRow) {
      throw new Error(getMessage(COULDNT_FIND_NUMBER_OF_ITEMS_IN_ROW));
    }

    for (const [index, productElement] of productElements.entries()) {
      if (index % (Number(itemsInRow) + 1) === 0) {
        productElement.classList.add('first');
      }

      if (index % Number(itemsInRow) === 0) {
        productElement.classList.add('last');
      }
    }
  };

  public injectProducts = async (products: TFormattedProduct[]) => {
    this.injectTagStyles();
    this.resetRowStyles();

    for (const product of products) {
      this.deleteExistingProduct(product.id);

      const markedProduct = this.addTagToProduct(product.productElement);
      markedProduct.classList.remove('first');
      this.productsContainer.prepend(markedProduct);
    }

    this.regenerateRowStyles();
  };
}

export default ProductManager;
