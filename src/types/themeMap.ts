import { CATEGORY_PAGE, MAIN_PAGE, PRODUCT_PAGE } from 'consts/pages';
import { TFormattedProduct } from 'types/product';

type TOptions = {
  productsContainerSelector?: string;
  spinnerContainerSelector?: string;
  shouldRegenerateRows?: boolean;
  additionalProductClasses?: string[];
  onBeforeProductInject?: (
    element: HTMLElement,
    product: TFormattedProduct,
  ) => void;
  onProductsInjected?: () => void;
  onExistingProductRemove?: (element: HTMLElement | null) => void;
};

type TTheme = {
  selector: string;
  skin: string;
  [MAIN_PAGE]?: TOptions;
  [PRODUCT_PAGE]?: TOptions;
  [CATEGORY_PAGE]?: TOptions;
};

export type { TTheme };
