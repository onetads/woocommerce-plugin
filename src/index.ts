import { initProductManager } from 'managers/ProductManager.utils';
import getCurrentPageInfo from 'utils/getCurrentPageInfo';

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

    const ProductManager = initProductManager(page);
    ProductManager.injectProduct();
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
