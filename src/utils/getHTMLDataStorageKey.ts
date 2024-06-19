import {
  HTML_DATA_MAIN_KEY,
  HTML_DATA_CATEGORY_KEY,
  HTML_DATA_PRODUCT_KEY,
} from 'consts/products';
import { TPages } from 'types/pages';

const getHTMLDataStorageKey = (page: TPages) => {
  return {
    MAIN_PAGE: HTML_DATA_MAIN_KEY,
    CATEGORY_PAGE: HTML_DATA_CATEGORY_KEY,
    PRODUCT_PAGE: HTML_DATA_PRODUCT_KEY,
  }[page];
};

export default getHTMLDataStorageKey;
