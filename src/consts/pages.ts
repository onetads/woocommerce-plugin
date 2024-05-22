const { categoryPage, mainPage, productPage } =
  window.sponsoredProductConfig?.selectors?.views || {};

const MAIN_PAGE = 'MAIN_PAGE';
const PRODUCT_PAGE = 'PRODUCT_PAGE';
const CATEGORY_PAGE = 'CATEGORY_PAGE';

const MAIN_PAGE_SELECTOR = mainPage || '.home';
const PRODUCT_PAGE_SELECTOR = productPage || '.single-product';
const CATEGORY_PAGE_SELECTOR = categoryPage || '.archive';

const BLOCK_THEME_CLASS = 'woocommerce-uses-block-theme';

export {
  MAIN_PAGE,
  PRODUCT_PAGE,
  CATEGORY_PAGE,
  MAIN_PAGE_SELECTOR,
  PRODUCT_PAGE_SELECTOR,
  CATEGORY_PAGE_SELECTOR,
  BLOCK_THEME_CLASS,
};
