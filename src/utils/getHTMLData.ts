import { PRODUCT_PAGE } from 'consts/pages';
import {
  HTML_DATA_CATEGORY_KEY,
  HTML_DATA_MAIN_KEY,
  HTML_DATA_PRODUCT_KEY,
} from 'consts/products';
import { THTMLData, THTMLDataResponse } from 'types/HTMLData';
import { TPages } from 'types/pages';
import { TTheme } from 'types/themeMap';
import getHTMLDataStorageKey from 'utils/getHTMLDataStorageKey';

const getHTMLData = async (
  page: TPages,
  themeInfo: TTheme | undefined,
): Promise<THTMLData> => {
  const storageKey = getHTMLDataStorageKey(page);

  const savedData = localStorage.getItem(storageKey);

  if (savedData) {
    return JSON.parse(savedData) as THTMLData;
  }

  const response = await fetch(
    `${window.location.origin}/?rest_route=/ras/get-html-templates`,
  );

  const parsedData = (await response.json()) as THTMLDataResponse;

  const data = {
    originalPromoTagHTML: parsedData.original_promo_tag,
    productSelector: `${parsedData.product_tag}[class*="post-"]`,
    productsContainerSelector: `${parsedData.list_container_tag}[class^="products"]`,
    substitutePromoTagHTML: parsedData.substitute_promo_tag,
  } as THTMLData;

  if (page === 'PRODUCT_PAGE') {
    const modifiedData: THTMLData = {
      ...data,
      ...(themeInfo?.[PRODUCT_PAGE]?.productsContainerSelector && {
        productsContainerSelector:
          themeInfo[PRODUCT_PAGE].productsContainerSelector,
      }),
    };

    localStorage.setItem(HTML_DATA_PRODUCT_KEY, JSON.stringify(modifiedData));
  }

  if (page === 'MAIN_PAGE') {
    localStorage.setItem(HTML_DATA_MAIN_KEY, JSON.stringify(data));
  }

  if (page === 'CATEGORY_PAGE') {
    localStorage.setItem(HTML_DATA_CATEGORY_KEY, JSON.stringify(data));
  }

  return JSON.parse(localStorage.getItem(storageKey) as string);
};

export default getHTMLData;
