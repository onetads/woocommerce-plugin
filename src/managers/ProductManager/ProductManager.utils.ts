import ProductManager from 'managers/ProductManager/ProductManager';
import { THTMLData } from 'types/HTMLData';
import { TPages } from 'types/pages';

const initProductManager = (page: TPages, HTMLData: THTMLData) =>
  new ProductManager(page, HTMLData);

export { initProductManager };
