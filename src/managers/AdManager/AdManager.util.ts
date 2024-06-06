import { EMPTY_LIST_WARN } from 'consts/messages';
import {} from 'consts/products';
import AdManager from 'managers/AdManager/AdManager';
import { THTMLData } from 'types/HTMLData';
import { TPages } from 'types/pages';
import getMessage from 'utils/getMessage';

const initAdManager = (page: TPages, HTMLData: THTMLData) =>
  new AdManager(page, HTMLData);

const getProductsIds = (
  productsContainerSelector: string,
  productSelector: string,
) => {
  const productElements = Array.from(
    document.querySelectorAll(
      `${productsContainerSelector} ${productSelector}`,
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
