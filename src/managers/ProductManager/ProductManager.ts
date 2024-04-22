import {
  COULDNT_FIND_NUMBER_OF_ITEMS_IN_ROW,
  PRODUCTS_CONTAINER_NOT_FOUND,
} from 'consts/messages';
import {
  ONET_PRODUCT_CLASS,
  PRODUCTS_CONTAINER_SELECTOR,
  PRODUCTS_SELECTOR,
} from 'consts/products';
import { DSA_ICON, TAG_CLASS, TAG_CONTAINER_SELECTOR } from 'consts/tags';
import { TPages } from 'types/pages';
import { TFormattedProduct } from 'types/product';
import getMessage from 'utils/getMessage';
import getProductsCountToInject from 'utils/getProductCountToInject';

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

  private addTagToProduct = (
    productElement: Element,
    dsaUrl: string | undefined,
  ) => {
    const labelElement = document.createElement('span');
    labelElement.classList.add(TAG_CLASS);
    labelElement.style.display = 'inline-flex';
    labelElement.style.alignItems = 'center';
    labelElement.style.gap = '4px';
    labelElement.textContent = window.sponsoredProductConfig.tagLabel;

    if (dsaUrl) {
      const dsaIcon = document.createElement('a');
      dsaIcon.innerHTML = DSA_ICON;
      dsaIcon.target = '_blank';
      dsaIcon.href = dsaUrl;
      dsaIcon.style.color = 'inherit';
      dsaIcon.style.lineHeight = '1em';
      labelElement.appendChild(dsaIcon);
    }

    productElement.querySelectorAll(`.${TAG_CLASS}`).forEach((tag) => {
      tag.remove();
    });

    (
      productElement.querySelector(TAG_CONTAINER_SELECTOR) as HTMLElement
    ).prepend(labelElement);

    return productElement as HTMLElement;
  };

  private deleteExistingProduct = (id: string) => {
    this.productsContainer.querySelector(`.post-${id}`)?.remove();
  };

  private resetRowStyles = () => {
    const productElements = this.productElements;

    for (const productElement of productElements) {
      productElement.classList.remove('first');
      productElement.classList.remove('last');
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
      if (index % Number(itemsInRow) === 0) {
        productElement.classList.add('first');
      }

      if (index === 0) continue;

      if ((index + 1) % Number(itemsInRow) === 0) {
        productElement.classList.add('last');
      }
    }
  };

  public injectProducts = async (products: TFormattedProduct[]) => {
    this.resetRowStyles();
    this.deleteExistingSponsoredProducts();

    const productsCountToInject = getProductsCountToInject(this.page);

    for (const [index, product] of products.entries()) {
      if (index >= productsCountToInject) break;

      this.deleteExistingProduct(product.id);

      const markedProduct = this.addTagToProduct(
        product.productElement,
        product.dsaUrl,
      );
      markedProduct.classList.remove('first');
      markedProduct.classList.add(ONET_PRODUCT_CLASS);
      this.productsContainer.prepend(markedProduct);
    }

    this.regenerateRowStyles();
  };

  public deleteExistingSponsoredProducts = () => {
    this.productsContainer
      .querySelectorAll(`.${ONET_PRODUCT_CLASS}`)
      .forEach((product) => {
        product.remove();
      });
  };
}

export default ProductManager;
