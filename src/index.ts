import { DEFAULT_CONFIG } from 'consts/config';
import { NOT_SUPPORTED_THEME } from 'consts/messages';
import { BLOCK_THEME_CLASS } from 'consts/pages';
import { HTML_DATA_KEY } from 'consts/products';
import { initAdManager } from 'managers/AdManager/AdManager.util';
import { initProductManager } from 'managers/ProductManager/ProductManager.utils';
import { THTMLData } from 'types/HTMLData';
import getCurrentPageInfo from 'utils/getCurrentPageInfo';
import getHTMLData from 'utils/getHTMLData';
import getMessage from 'utils/getMessage';
import getPageConfig from 'utils/getPageConfig';
import { hideLoadingSpinner, showLoadingSpinner } from 'utils/loadingSpinner';
import waitForDlApi from 'utils/waitForDlApi';

const isTestingEnvironment = process.env.IS_TEST_ENV === 'true';

const isBlockTheme = document.body.classList.contains(BLOCK_THEME_CLASS);

window.sponsoredProductConfig = window.sponsoredProductConfig || DEFAULT_CONFIG;

if (isBlockTheme) {
  console.error(getMessage(NOT_SUPPORTED_THEME));
} else {
  let HTMLData: THTMLData;

  const runApp = async () => {
    try {
      const page = getCurrentPageInfo();

      if (!page) return;
      if (getPageConfig(page)?.isEnabled === false) return;

      HTMLData = await getHTMLData();

      if (window.sponsoredProductConfig.isLoaderVisible) {
        showLoadingSpinner(HTMLData);
      }

      if (!isTestingEnvironment) {
        await waitForDlApi();
      }

      const AdManager = initAdManager(page, HTMLData);
      const products =
        await AdManager.getPromotedProducts(isTestingEnvironment);

      const ProductManager = initProductManager(page, HTMLData);

      ProductManager.injectProducts(products);
      hideLoadingSpinner(HTMLData);
    } catch (e) {
      if (e instanceof Error) {
        console.error(e.message);
        hideLoadingSpinner(HTMLData);
        localStorage.removeItem(HTML_DATA_KEY);
      }
    }
  };

  let isAppInitialized = false;

  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      isAppInitialized = true;
      runApp();
    } else {
      if (!isAppInitialized) {
        isAppInitialized = true;
        runApp();
      }
    }
  });

  if (!isAppInitialized) {
    isAppInitialized = true;
    runApp();
  }
}
