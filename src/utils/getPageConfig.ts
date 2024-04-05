import { MAIN_PAGE, CATEGORY_PAGE, PRODUCT_PAGE } from 'consts/pages';
import { TPages } from 'types/pages';

const getPageConfig = (page: TPages) => {
  if (page === MAIN_PAGE) {
    return window.sponsoredProductConfig.mainPage;
  }

  if (page === PRODUCT_PAGE) {
    return window.sponsoredProductConfig.pageDetails;
  }

  if (page === CATEGORY_PAGE) {
    return window.sponsoredProductConfig.productsList;
  }
};

export default getPageConfig;
