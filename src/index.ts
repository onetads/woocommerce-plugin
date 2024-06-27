import { DEFAULT_CONFIG } from 'consts/config';
import { NOT_SUPPORTED_THEME } from 'consts/messages';
import { BLOCK_THEME_CLASS } from 'consts/pages';
import { initAdManager } from 'managers/AdManager/AdManager.util';
import { initProductManager } from 'managers/ProductManager/ProductManager.utils';
import { THTMLData } from 'types/HTMLData';
import { TPages } from 'types/pages';
import { TTheme } from 'types/themeMap';
import getCurrentPageInfo from 'utils/getCurrentPageInfo';
import getHTMLData from 'utils/getHTMLData';
import getHTMLDataStorageKey from 'utils/getHTMLDataStorageKey';
import getMessage from 'utils/getMessage';
import getPageConfig from 'utils/getPageConfig';
import getThemeInfo from 'utils/getThemeInfo';
import { hideLoadingSpinner, showLoadingSpinner } from 'utils/loadingSpinner';
import themeListener from 'utils/themeListener';
import waitForDlApi from 'utils/waitForDlApi';

const isTestingEnvironment = process.env.IS_TEST_ENV === 'true';

const isBlockTheme = document.body.classList.contains(BLOCK_THEME_CLASS);

window.sponsoredProductConfig = window.sponsoredProductConfig || DEFAULT_CONFIG;

if (isBlockTheme) {
  console.error(getMessage(NOT_SUPPORTED_THEME));
} else {
  let HTMLData: THTMLData;
  let themeInfo: TTheme | undefined;
  let page: TPages | undefined;

  const runApp = async () => {
    try {
      page = getCurrentPageInfo();

      if (!page) return;
      if (getPageConfig(page)?.isEnabled === false) return;

      themeListener();
      themeInfo = getThemeInfo();
      HTMLData = await getHTMLData(page, themeInfo);

      if (window.sponsoredProductConfig.isLoaderVisible) {
        showLoadingSpinner(HTMLData.productsContainerSelector, themeInfo);
      }

      if (!isTestingEnvironment) {
        await waitForDlApi();
      }

      const AdManager = initAdManager(page, HTMLData);
      const products =
        await AdManager.getPromotedProducts(isTestingEnvironment);

      const ProductManager = initProductManager(page, HTMLData, themeInfo);

      ProductManager.injectProducts(products);
      hideLoadingSpinner(HTMLData, themeInfo);
    } catch (e) {
      if (e instanceof Error) {
        console.error(e.message);
        hideLoadingSpinner(HTMLData, themeInfo);

        if (page) {
          localStorage.removeItem(getHTMLDataStorageKey(page));
        }
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
