import { TSwiper } from 'types/swiper';
import { TTheme } from 'types/themeMap';
import { changeBadgeStyles } from 'utils/themeMapUtils';

const THEME_MAP: TTheme[] = [
  {
    selector: 'body:is(.theme-flatsome)',
    skin: 'flatsome',
    PRODUCT_PAGE: {
      productsContainerSelector: '.related-products-wrapper .flickity-slider',
      spinnerContainerSelector: '.related-products-wrapper',
      shouldRegenerateRows: false,
      onProductsInjected: () => {
        window.Flatsome.behaviors.slider.detach();
        window.Flatsome.behaviors.slider.attach();

        window.Flatsome.behaviors['quick-view'].attach();

        changeBadgeStyles();
      },
    },

    MAIN_PAGE: {
      onProductsInjected: () => {
        window.Flatsome.behaviors['quick-view'].attach();

        changeBadgeStyles();
      },
    },

    CATEGORY_PAGE: {
      onProductsInjected: () => {
        window.Flatsome.behaviors['quick-view'].attach();

        changeBadgeStyles();
      },
    },
  },
  {
    selector: 'body:is(.theme-woodmart)',
    skin: 'woodmart',
    MAIN_PAGE: {
      onProductsInjected: () => {
        if (window?.woodmartThemeModule?.productHover) {
          window.woodmartThemeModule.productHover();
        }
      },
    },
    PRODUCT_PAGE: {
      productsContainerSelector: '.related-products .wd-carousel-wrap',
      spinnerContainerSelector: '.related-products',
      shouldRegenerateRows: false,
      additionalProductClasses: ['wd-carousel-item'],
      onBeforeProductInject: (element, productData) => {
        const additionalHTML = `
          <div class="wd-buttons wd-pos-r-t">
            <div class="wrap-wishlist-button"></div>

            <div class="wd-add-btn wd-action-btn wd-style-icon wd-add-cart-icon">
              <a href="?add-to-cart=${productData.id}" data-quantity="1" class="button product_type_simple add_to_cart_button ajax_add_to_cart add-to-cart-loop wd-tltp wd-tooltip-inited" data-product_id="${productData.id}" data-product_sku="" rel="nofollow">
                <span class="wd-tooltip-label">Add to cart</span>
                <span>Add to cart</span>
              </a>
            </div>

            <div class="wrap-quickview-button">
              <div class="quick-view wd-action-btn wd-style-icon wd-quick-view-icon">
                <a href="" class="open-quick-view quick-view-button" rel="nofollow" data-id="${productData.id}">Quick view</a>
              </div>
            </div>
          </div>
        `;

        const elementToPaste =
          element.querySelector<HTMLElement>('.fade-in-block');

        elementToPaste?.insertAdjacentHTML('beforeend', additionalHTML);
        element.classList.add('wd-fade-off');
        element.querySelector('.wd-bottom-actions')?.remove();
      },
      onProductsInjected: () => {
        const slider = document.querySelector(
          '.related-products .wd-carousel',
        ) as TSwiper;

        slider.swiper.update();
      },
      onExistingProductRemove: (element) => {
        if (element) {
          element.parentElement?.remove();
        }
      },
    },
    CATEGORY_PAGE: {
      onProductsInjected: () => {
        if (window?.woodmartThemeModule?.productHover) {
          window.woodmartThemeModule.productHover();
        }
      },
    },
  },
];

export { THEME_MAP };
