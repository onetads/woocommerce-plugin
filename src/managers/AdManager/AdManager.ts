import { MAX_TIMEOUT_MS, SLOT_NAME, TPL_CODE } from 'consts/dlApi';
import {
  EMPTY_PRODUCTS_LIST,
  ERROR_PROMOTED_PRODUCTS_MSG,
  LINK_SELECTOR_DOES_NOT_MATCH,
  REQUEST_TIMED_OUT,
} from 'consts/messages';
import {
  PRODUCTS_CONTAINER_SELECTOR,
  PRODUCTS_SELECTOR,
  SPONSORED_PRODUCT_TAG,
} from 'consts/products';
import { VIEWS_MAP } from 'consts/views';
import { getProductsIds } from 'managers/AdManager/AdManager.util';
import { TPages } from 'types/pages';
import { TAdProduct, TFormattedProduct } from 'types/product';
import getMessage from 'utils/getMessage';
import getProductsCountToInject from 'utils/getProductCountToInject';

class AdManager {
  private page: TPages;
  private productsIds: number[];

  constructor(page: TPages) {
    this.page = page;

    if (this.page) {
      this.productsIds = getProductsIds();
    }
  }

  public getPromotedProducts = async (isTestingEnvironment: boolean) => {
    if (isTestingEnvironment) {
      const products = document
        .querySelector(PRODUCTS_CONTAINER_SELECTOR)!
        .querySelectorAll(PRODUCTS_SELECTOR);

      if (products.length === 0) {
        throw new Error(getMessage(EMPTY_PRODUCTS_LIST));
      }

      const productElement = products[products.length - 1];

      const classes = Array.from(productElement.classList);
      let productId = '';

      for (const className of classes) {
        if (!className.startsWith('post-')) continue;

        const match = (className?.match(/post-(\d+)/) || [])[1];
        if (!match) continue;

        productId = match;
      }

      return [
        {
          id: productId,
          dsaUrl: window.location.origin,
          productElement: productElement,
        },
      ];
    }

    if (!dlApi.fetchNativeAd)
      throw new Error(getMessage(ERROR_PROMOTED_PRODUCTS_MSG));

    const productsCount = getProductsCountToInject(this.page);
    const timeoutPromise = new Promise<void>((_, reject) => {
      setTimeout(() => {
        reject(getMessage(REQUEST_TIMED_OUT));
      }, MAX_TIMEOUT_MS);
    });

    const fetchNativeAd = new Promise<TFormattedProduct[]>(
      (resolve, reject) => {
        dlApi.cmd = dlApi.cmd || [];

        dlApi.cmd.push(async (dlApiObj) => {
          const formattedProducts: TFormattedProduct[] = [];

          try {
            for (let index = 1; index <= productsCount; index++) {
              const div = SPONSORED_PRODUCT_TAG + index;

              const ads = await dlApiObj.fetchNativeAd!({
                slot: SLOT_NAME,
                opts: {
                  offer_ids: this.productsIds.join(','),
                  pos: index,
                },
                asyncRender: true,
                div: div,
                tplCode: TPL_CODE,
              });

              const trackingAdLink = ads.meta.adclick;
              const dsaUrl = ads.meta.dsaurl;
              const { offers = [] } = ads.fields.feed;

              const {
                offer_id: productId,
                offer_image: productImageUrl,
                offer_url: productUrl,
              } = offers[0];

              const preparedProduct = await this.prepareProductData({
                dsaUrl,
                imageUrl: productImageUrl,
                offerUrl: trackingAdLink + productUrl,
                offerId: productId,
                div,
              });

              if (!preparedProduct) {
                console.warn(`Product not found, ID: ${productId}`);
                continue;
              }

              ads.render();
              formattedProducts.push(preparedProduct);
            }

            resolve(formattedProducts);
          } catch {
            reject(getMessage(ERROR_PROMOTED_PRODUCTS_MSG));
          }
        });
      },
    );

    return (await Promise.race([fetchNativeAd, timeoutPromise])
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw new Error(error);
      })) as TFormattedProduct[];
  };

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

  private prepareProductData = async (product: TAdProduct) => {
    const productElement = await this.getProductHTML(product.offerId);

    if (!productElement) return;

    const productElementLink = productElement.querySelector(
      '.woocommerce-loop-product__link',
    );

    if (!productElementLink) {
      throw new Error(getMessage(LINK_SELECTOR_DOES_NOT_MATCH));
    }

    productElementLink.setAttribute('href', product.offerUrl);

    productElement.id = product.div;

    return {
      id: product.offerId,
      dsaUrl: product.dsaUrl,
      productElement: productElement,
      div: product.div,
    };
  };
}

export default AdManager;
