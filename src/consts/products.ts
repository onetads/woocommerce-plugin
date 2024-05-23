const {
  linkSelectors,
  productsContainerSelector,
  productsSelector,
  tagSelector,
} = window.sponsoredProductConfig?.selectors?.product || {};

const PRODUCTS_CONTAINER_SELECTOR =
  productsContainerSelector || 'ul[class^="products"]';
const PRODUCTS_SELECTOR = productsSelector || 'li[class*="post-"]';
const ONET_PRODUCT_CLASS = 'onet-product';
const SPONSORED_PRODUCT_TAG = 'onet-product-';
const LINK_SELECTORS = linkSelectors || ['.woocommerce-loop-product__link'];
const TAG_SELECTOR = tagSelector || '.woocommerce-loop-product__link';

export {
  PRODUCTS_CONTAINER_SELECTOR,
  PRODUCTS_SELECTOR,
  ONET_PRODUCT_CLASS,
  SPONSORED_PRODUCT_TAG,
  LINK_SELECTORS,
  TAG_SELECTOR,
};
