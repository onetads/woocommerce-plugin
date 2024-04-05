import { MAIN_PAGE, PRODUCT_PAGE } from 'consts/pages';
import ProductManager from 'managers/ProductManager/ProductManager';
import { TPages } from 'types/pages';

const initProductManager = (page: TPages) => new ProductManager(page);

const getProductsCountToInject = (page: TPages) => {
  if (page === MAIN_PAGE) {
    return window.sponsoredProductConfig.mainPage.productsCount;
  }

  if (page === PRODUCT_PAGE) {
    return window.sponsoredProductConfig.pageDetails.productsCount;
  }

  return window.sponsoredProductConfig.productsList.productsCount;
};

export { initProductManager, getProductsCountToInject };
