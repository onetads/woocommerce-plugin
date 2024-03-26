import ProductManager from 'managers/ProductManager';
import { TPages } from 'types/pages';

const initProductManager = (page: TPages) => new ProductManager(page);

export { initProductManager };
