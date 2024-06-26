import { MAX_TIMEOUT_MS, SLOT_NAME, TPL_CODE } from 'consts/dlApi';
import {
  EMPTY_PRODUCTS_LIST,
  ERROR_PROMOTED_PRODUCTS_MSG,
  REQUEST_TIMED_OUT,
} from 'consts/messages';
import {
  DSA_ICON_CLASS,
  SPONSORED_PRODUCT_TAG,
  TAG_LABEL_HOOK_CLASS,
  TAG_REPLACEMENT_KEY,
} from 'consts/products';
import { DSA_ICON } from 'consts/tags';
import { VIEWS_MAP } from 'consts/views';
import { getProductsIds } from 'managers/AdManager/AdManager.util';
import { THTMLData, TProductDataResponse } from 'types/HTMLData';
import { TPages } from 'types/pages';
import { TAdProduct, TFormattedProduct } from 'types/product';
import getMessage from 'utils/getMessage';
import getProductsCountToInject from 'utils/getProductCountToInject';

class AdManager {
  private page: TPages;
  private productsIds: number[];
  private productSelector: string;
  private productsContainerSelector: string;
  private tagTemplate: string;
  private tagReplacement: string;

  constructor(page: TPages, HTMLData: THTMLData) {
    const {
      productSelector,
      productsContainerSelector,
      originalPromoTagHTML,
      substitutePromoTagHTML,
    } = HTMLData;

    this.page = page;
    this.productSelector = productSelector;
    this.productsContainerSelector = productsContainerSelector;
    this.tagTemplate = originalPromoTagHTML;
    this.tagReplacement = substitutePromoTagHTML;

    if (this.page) {
      this.productsIds = getProductsIds(
        this.productsContainerSelector,
        this.productSelector,
      );
    }
  }

  public getPromotedProducts = async (isTestingEnvironment: boolean) => {
    if (isTestingEnvironment) {
      const products = document
        .querySelector(this.productsContainerSelector)!
        .querySelectorAll(this.productSelector);

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
          renderAd: () => {},
        },
      ] as TFormattedProduct[];
    }

    if (!dlApi.fetchNativeAd)
      throw new Error(getMessage(ERROR_PROMOTED_PRODUCTS_MSG));

    const productsCount = getProductsCountToInject(this.page);
    const timeoutPromise = new Promise<void>((_, reject) => {
      setTimeout(() => {
        reject(new Error(getMessage(REQUEST_TIMED_OUT)));
      }, MAX_TIMEOUT_MS);
    });

    const fetchAds = new Promise<TFormattedProduct[]>((resolve, reject) => {
      const formattedProducts: TFormattedProduct[] = [];
      const fetchPromises: Promise<void>[] = [];

      dlApi.cmd = dlApi.cmd || [];
      dlApi.cmd.push((dlApiObj) => {
        for (let index = 1; index <= productsCount; index++) {
          const div = SPONSORED_PRODUCT_TAG + index;

          const fetchPromise = dlApiObj.fetchNativeAd!({
            slot: SLOT_NAME,
            opts: {
              offer_ids: this.productsIds.join(','),
              pos: index,
            },
            asyncRender: true,
            div: div,
            tplCode: TPL_CODE,
          }).then(async (ads) => {
            if (!ads) {
              console.warn('Ad not found');
              return;
            }

            let isAdAvailable = false;
            let adIndex = 0;

            do {
              const trackingAdLink = ads.meta.adclick;
              const dsaUrl = ads.meta.dsaurl;
              const { offers = [] } = ads.fields.feed;

              if (offers.length > 0) {
                const {
                  offer_id: productId,
                  offer_image: productImageUrl,
                  offer_url: productUrl,
                } = offers[adIndex];

                const adData = await this.prepareProductData({
                  dsaUrl: dsaUrl,
                  imageUrl: productImageUrl,
                  offerUrl: trackingAdLink + productUrl,
                  offerId: productId,
                  div: div,
                });

                if (adData) {
                  isAdAvailable = true;

                  formattedProducts.push({
                    ...adData,
                    renderAd: ads.render,
                  });
                }

                adIndex++;
              }
            } while (!isAdAvailable);
          });

          fetchPromises.push(fetchPromise);
        }

        Promise.all(fetchPromises)
          .then(() => resolve(formattedProducts))
          .catch(() => {
            reject(getMessage(ERROR_PROMOTED_PRODUCTS_MSG));
          });
      });
    });

    return (await Promise.race([fetchAds, timeoutPromise])
      .then((res) => res)
      .catch((err) => {
        throw new Error(err);
      })) as TFormattedProduct[];
  };

  public getProductElement = async (
    id: string,
    offerUrl: string,
    dsaUrl: string | undefined,
  ): Promise<Element | null> => {
    const view = VIEWS_MAP[this.page];

    const response = await fetch(
      `${window.location.origin}/?rest_route=/ras/get-product-html&product_id=${id}&view=${view}`,
    );

    if (!response.ok) {
      return null;
    }

    const { link_url: productDetailsLink, product_html: productHTML } =
      (await response.json()) as TProductDataResponse;

    const productHTMLwithTrackingLinks = productHTML.replaceAll(
      productDetailsLink,
      offerUrl,
    );

    let tagContent = window.sponsoredProductConfig.tagLabel;

    if (dsaUrl) {
      tagContent = `${tagContent} <p class="${TAG_LABEL_HOOK_CLASS}"></p> <span class="${DSA_ICON_CLASS}" style="display: grid; place-items: center; color: inherit;">${DSA_ICON}</span>`;
    }

    const newTagLabel = this.tagReplacement.replace(
      TAG_REPLACEMENT_KEY,
      tagContent,
    );

    const productHTMLwithSponsoredTag = productHTMLwithTrackingLinks.replace(
      this.tagTemplate,
      newTagLabel.trim(),
    );

    const productHTMLWrapper = document.createElement('div');
    productHTMLWrapper.innerHTML = productHTMLwithSponsoredTag;

    return productHTMLWrapper.firstElementChild as Element;
  };

  private prepareProductData = async (
    product: Omit<TAdProduct, 'renderAd'>,
  ) => {
    const productElement = await this.getProductElement(
      product.offerId,
      product.offerUrl,
      product.dsaUrl,
    );

    if (!productElement) return;

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
