import {
  CATEGORY_PAGE,
  CATEGORY_PAGE_SELECTOR,
  MAIN_PAGE,
  MAIN_PAGE_SELECTOR,
  PRODUCT_PAGE,
  PRODUCT_PAGE_SELECTOR,
} from 'consts/pages';

const getCurrentPageInfo = () => {
  const isMainPage = document.querySelector(MAIN_PAGE_SELECTOR);
  if (isMainPage) return MAIN_PAGE;

  const isProductPage = document.querySelector(PRODUCT_PAGE_SELECTOR);
  if (isProductPage) return PRODUCT_PAGE;

  const isCategoryPage = document.querySelector(CATEGORY_PAGE_SELECTOR);
  if (isCategoryPage) return CATEGORY_PAGE;
};

export default getCurrentPageInfo;
