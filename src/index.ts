import { NOT_SUPPORTED_THEME } from 'consts/messages';
import { BLOCK_THEME_CLASS } from 'consts/pages';
import { initAdManager } from 'managers/AdManager/AdManager.util';
import { initProductManager } from 'managers/ProductManager/ProductManager.utils';
import getCurrentPageInfo from 'utils/getCurrentPageInfo';
import getMessage from 'utils/getMessage';
import { hideLoadingSpinner, showLoadingSpinner } from 'utils/loadingSpinner';
import waitForDlApi from 'utils/waitForDlApi';

window.sponsoredProductConfig = {
  isLoaderVisible: true,
  tagLabel: 'SPONSOROWANE',

  mainPage: {
    isEnabled: true,
    productsCount: 10,
  },
  pageDetails: {
    isEnabled: true,
    productsCount: 10,
  },
  productsList: {
    isEnabled: true,
    productsCount: 10,
  },
};

const isBlockTheme = document.body.classList.contains(BLOCK_THEME_CLASS);

if (isBlockTheme) {
  console.error(getMessage(NOT_SUPPORTED_THEME));
} else {
  if (window.sponsoredProductConfig.isLoaderVisible) {
    showLoadingSpinner();
  }

  const runApp = async () => {
    try {
      const page = getCurrentPageInfo();

      if (!page) return;

      await waitForDlApi();

      const AdManager = initAdManager(page);
      const products = await AdManager.getPromotedProducts();

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

  if (document.readyState !== 'loading') {
    runApp();
  } else {
    window.addEventListener('DOMContentLoaded', async () => {
      runApp();
    });
  }
}
