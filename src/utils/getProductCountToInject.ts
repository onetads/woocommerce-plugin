import { MAIN_PAGE, PRODUCT_PAGE } from 'consts/pages';
import { TPages } from 'types/pages';

const getProductsCountToInject = (page: TPages) => {
  if (page === MAIN_PAGE) {
    return window.sponsoredProductConfig.mainPage.productsCount;
  }

  if (page === PRODUCT_PAGE) {
    return window.sponsoredProductConfig.pageDetails.productsCount;
  }

  return window.sponsoredProductConfig.productsList.productsCount;
};

export default getProductsCountToInject;
