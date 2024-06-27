import { CATEGORY_PAGE, MAIN_PAGE, PRODUCT_PAGE } from 'consts/pages';
import { TPages } from 'types/pages';

const VIEWS_MAP: Record<TPages, string> = {
  [MAIN_PAGE]: 'home',
  [PRODUCT_PAGE]: 'single-product',
  [CATEGORY_PAGE]: 'category',
};

export { VIEWS_MAP };
