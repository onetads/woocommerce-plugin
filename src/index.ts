import { initAdManager } from 'managers/AdManager/AdManager.util';
import { initProductManager } from 'managers/ProductManager/ProductManager.utils';
import getCurrentPageInfo from 'utils/getCurrentPageInfo';
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

const runApp = async () => {
  try {
    const page = getCurrentPageInfo();

    if (!page) return;

    await waitForDlApi();

    const AdManager = initAdManager(page);
    const products = await AdManager.getPromotedProducts();

    const ProductManager = initProductManager(page);
    ProductManager.injectProducts(products);
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message);
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
