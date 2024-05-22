import { NOT_SUPPORTED_THEME } from 'consts/messages';
import { BLOCK_THEME_CLASS } from 'consts/pages';
import { initAdManager } from 'managers/AdManager/AdManager.util';
import { initProductManager } from 'managers/ProductManager/ProductManager.utils';
import getCurrentPageInfo from 'utils/getCurrentPageInfo';
import getMessage from 'utils/getMessage';
import getPageConfig from 'utils/getPageConfig';
import { hideLoadingSpinner, showLoadingSpinner } from 'utils/loadingSpinner';
import waitForDlApi from 'utils/waitForDlApi';

const isTestingEnvironment = process.env.IS_TEST_ENV === 'true';

const isBlockTheme = document.body.classList.contains(BLOCK_THEME_CLASS);

window.sponsoredProductConfig = window.sponsoredProductConfig || {
  isLoaderVisible: true,
  tagLabel: 'PROMOWANE',

  mainPage: {
    isEnabled: true,
    productsCount: 1,
  },
  pageDetails: {
    isEnabled: true,
    productsCount: 1,
  },
  productsList: {
    isEnabled: true,
    productsCount: 1,
  },
};

if (isBlockTheme) {
  console.error(getMessage(NOT_SUPPORTED_THEME));
} else {
  const runApp = async () => {
    try {
      const page = getCurrentPageInfo();

      if (!page) return;
      if (getPageConfig(page)?.isEnabled === false) return;

      if (window.sponsoredProductConfig.isLoaderVisible) {
        showLoadingSpinner();
      }

      if (!isTestingEnvironment) {
        await waitForDlApi();
      }

      const AdManager = initAdManager(page);
      const products =
        await AdManager.getPromotedProducts(isTestingEnvironment);

      const ProductManager = initProductManager(page);

      ProductManager.injectProducts(products);
      hideLoadingSpinner();
    } catch (e) {
      if (e instanceof Error) {
        console.error(e.message);
        hideLoadingSpinner();
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
