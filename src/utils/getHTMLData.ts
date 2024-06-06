import { HTML_DATA_KEY } from 'consts/products';
import { THTMLData, THTMLDataResponse } from 'types/HTMLData';

const getHTMLData = async () => {
  const savedData = localStorage.getItem(HTML_DATA_KEY);

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

  localStorage.setItem(HTML_DATA_KEY, JSON.stringify(data));

  return data;
};

export default getHTMLData;
