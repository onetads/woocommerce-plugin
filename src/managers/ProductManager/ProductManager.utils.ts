import ProductManager from 'managers/ProductManager/ProductManager';
import { THTMLData } from 'types/HTMLData';
import { TPages } from 'types/pages';
import { TTheme } from 'types/themeMap';

const initProductManager = (
  page: TPages,
  HTMLData: THTMLData,
  themeInfo: TTheme | undefined,
) => new ProductManager(page, HTMLData, themeInfo);

export { initProductManager };
