import {
  COULDNT_FIND_NUMBER_OF_ITEMS_IN_ROW,
  PRODUCTS_CONTAINER_NOT_FOUND,
} from 'consts/messages';
import {
  DSA_ICON_CLASS,
  ONET_PRODUCT_CLASS,
  TAG_LABEL_HOOK_CLASS,
} from 'consts/products';
import { THTMLData } from 'types/HTMLData';
import { TPages } from 'types/pages';
import { TFormattedProduct } from 'types/product';
import { TTheme } from 'types/themeMap';
import getMessage from 'utils/getMessage';
import getProductsCountToInject from 'utils/getProductCountToInject';

class ProductManager {
  private page: TPages;
  private productsContainer: Element;
  private productElements: Element[];
  private productSelector: string;
  private themeInfo: TTheme | undefined;

  constructor(
    page: TPages,
    HTMLData: THTMLData,
    themeInfo: TTheme | undefined,
  ) {
    const { productSelector, productsContainerSelector } = HTMLData;

    this.themeInfo = themeInfo;
    this.page = page;
    this.productSelector = productSelector;

    const productsContainer = document.querySelector(productsContainerSelector);

    if (!productsContainer) {
      throw new Error(getMessage(PRODUCTS_CONTAINER_NOT_FOUND));
    }

    this.productsContainer = productsContainer;
    this.productElements = Array.from(
      this.productsContainer.querySelectorAll(this.productSelector),
    );
  }

  private deleteExistingProduct = (id: string) => {
    const element = this.productsContainer.querySelector(
      `.post-${id}`,
    ) as HTMLElement;

    this.themeInfo?.[this.page]?.onExistingProductRemove?.(element);

    element?.remove();
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
      this.productsContainer.querySelectorAll(this.productSelector),
    );
    const containerClasses = Array.from(this.productsContainer.classList);

    const itemsInRow = containerClasses
      .find((className) => className.includes('columns-'))
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
    const additionalProductClasses =
      this.themeInfo?.[this.page]?.additionalProductClasses;
    const themeShouldRegenerateRows =
      this.themeInfo?.[this.page]?.shouldRegenerateRows;

    const shouldRegenerateRows =
      themeShouldRegenerateRows !== undefined
        ? themeShouldRegenerateRows
        : true;

    this.resetRowStyles();
    this.deleteExistingSponsoredProducts();

    const productsCountToInject = getProductsCountToInject(this.page);

    for (const [index, product] of products.entries()) {
      if (index >= productsCountToInject) break;

      this.deleteExistingProduct(product.id);

      product.productElement.classList.remove('first');
      product.productElement.classList.add(ONET_PRODUCT_CLASS);

      if (additionalProductClasses) {
        for (const className of additionalProductClasses) {
          product.productElement.classList.add(className);
        }
      }

      this.themeInfo?.[this.page]?.onBeforeProductInject?.(
        product.productElement as HTMLElement,
        product,
      );
      this.productsContainer.prepend(product.productElement);
      product.renderAd();

      const dsaIconElement = product.productElement.querySelector(
        `.${DSA_ICON_CLASS}`,
      );
      const tagElementHook = product.productElement.querySelector(
        `.${TAG_LABEL_HOOK_CLASS}`,
      ) as HTMLDivElement;
      tagElementHook.style.display = 'none';

      const tagWrapper = tagElementHook.parentElement as HTMLDivElement;

      tagWrapper.style.display = 'inline-flex';
      tagWrapper.style.alignItems = 'center';
      tagWrapper.style.gap = '4px';
      tagWrapper.style.cursor = 'pointer';
      tagWrapper.style.zIndex = '999';
      tagWrapper.style.wordBreak = 'keep-all';

      if (dsaIconElement) {
        dsaIconElement.addEventListener('click', (e) => {
          e.preventDefault();
          window.open(product.dsaUrl, '_blank')?.focus();
        });
      }
    }

    if (shouldRegenerateRows) {
      this.regenerateRowStyles();
    }

    this.themeInfo?.[this.page]?.onProductsInjected?.();
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
