import { EMPTY_LIST_WARN } from 'consts/messages';
import { PRODUCTS_CONTAINER_SELECTOR } from 'consts/products';
import AdManager from 'managers/AdManager/AdManager';
import { TPages } from 'types/pages';
import getMessage from 'utils/getMessage';

const initAdManager = (page: TPages) => new AdManager(page);

const getProductsIds = () => {
  const productElements = Array.from(
    document.querySelectorAll(
      `${PRODUCTS_CONTAINER_SELECTOR} li[class^="post-"], ${PRODUCTS_CONTAINER_SELECTOR} li[class*=" post-"]`,
    ),
  );

  const productsIds = [];

  for (const productElement of productElements) {
    if (!(productElement instanceof HTMLElement)) continue;

    const classes = Array.from(productElement.classList);

    for (const className of classes) {
      if (!className.startsWith('post-')) continue;

      const match = (className?.match(/post-(\d+)/) || [])[1];
      if (!match) continue;

      productsIds.push(Number(match));
    }
  }

  if (!productsIds.length) {
    console.warn(getMessage(EMPTY_LIST_WARN));
  }

  return productsIds;
};

export { initAdManager, getProductsIds };
