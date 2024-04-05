import { MAX_TIMEOUT_MS, SLOT_NAME, TPL_CODE } from 'consts/dlApi';
import {
  ERROR_PROMOTED_PRODUCTS_MSG,
  LINK_SELECTOR_DOES_NOT_MATCH,
  REQUEST_TIMED_OUT,
} from 'consts/messages';
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

  public getPromotedProducts = async () => {
    if (!dlApi.fetchNativeAd)
      throw new Error(getMessage(ERROR_PROMOTED_PRODUCTS_MSG));

    let products: TAdProduct[] | null | Error = null;

    const timeoutPromise = new Promise<void>((_, reject) => {
      setTimeout(() => {
        reject(getMessage(REQUEST_TIMED_OUT));
      }, MAX_TIMEOUT_MS);
    });

    const fetchNativeAd = new Promise<TAdProduct[]>((resolve, reject) => {
      dlApi.cmd = dlApi.cmd || [];
      dlApi.cmd.push(async (dlApiObj) => {
        try {
          const ads = await dlApiObj.fetchNativeAd!({
            slot: SLOT_NAME,
            opts: {
              offer_ids: this.productsIds.join(','),
            },
            tplCode: TPL_CODE,
          });

          const trackingAdLink = ads.meta.adclick;
          const dsaUrl = ads.meta.dsaurl;
          const { offers = [] } = ads.fields.feed;

          products = offers.map(({ offer_id, offer_image, offer_url }) => ({
            offerId: offer_id,
            imageUrl: offer_image,
            offerUrl: trackingAdLink + offer_url,
            dsaUrl: dsaUrl,
          }));

          resolve(products);
        } catch (_) {
          reject(getMessage(ERROR_PROMOTED_PRODUCTS_MSG));
        }
      });
    });

    return (await Promise.race([fetchNativeAd, timeoutPromise])
      .then((result) => {
        return this.prepareProductsData(result as TAdProduct[]);
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

  private prepareProductsData = async (products: TAdProduct[]) => {
    const formattedProducts: TFormattedProduct[] = [];

    const productsCountToFetch = getProductsCountToInject(this.page);

    for (const [index, product] of products.entries()) {
      if (index >= productsCountToFetch) break;

      const productElement = await this.getProductHTML(product.offerId);

      if (!productElement) continue;

      const productElementLink = productElement.querySelector(
        '.woocommerce-loop-product__link',
      );

      if (!productElementLink) {
        throw new Error(getMessage(LINK_SELECTOR_DOES_NOT_MATCH));
      }

      productElementLink.setAttribute('href', product.offerUrl);

      formattedProducts.push({
        id: product.offerId,
        dsaUrl: product.dsaUrl,
        productElement: productElement,
      });
    }

    return formattedProducts;
  };
}

export default AdManager;
