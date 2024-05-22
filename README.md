# Ras

This project contains javascript for WooCommerce widget.

# Reqs

Node: v20.8.1 (https://nodejs.org/dist/v20.8.1/docs/api/)
Yarn: v1.22.21

# Scripts

yarn build - builds minified js (code is bundled to dist/bundle.js file) <br/>
yarn eslint - checks for eslint errors <br/>
yarn test - build minified js (code is bundled to dist/bundle.js file). This code is intended for testing in shops

## How to use test mode

1. Go to WooCommerce shop 
2. paste test bundle in the console

## Config

| Key | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `tagLabel` | `string` | Text for sponsored tag in product card |
| `isLoaderVisible` | `boolean` | Define whether the loader should be displayed |
| `mainPage` | `object` | Configuration object for **main page** |
| `pageDetails` | `object` | Configuration object for **product details page**|
| `productsList` | `object` | Configuration object for **product list page** |
| `tagClasses` | `string (Optional)` | Classes for tag label |
| `itemsToDelete` | `string[] (Optional)` | Selectors for elements to delete |
| `selectors` | `object (Optional)` | Configuration object for **selectors** |

#### Configuration object for product listing, products details and main page

| Key | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `isEnabled` | `boolean` | Specifies whether the product should be visible |
| `productsCount` | `object` | Specifies the number of products injected into the list |

#### Configuration object for selectors

| Key | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `views` | `object (Optional)` | Configuration object for **views selectors** |
| `product` | `object (Optional)` | Configuration object for **product selectors** |

#### Configuration object for views
Selectors for views are exclusively needed for the script to determine the current page it is on.

| Key | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `mainPage` | `string (Optional)` | Specifies selector for main page  |
| `productPage` | `string (Optional)` | Specifies selector for product page  |
| `categoryPage` | `string (Optional)` | Specifies selector for category page  |

#### Configuration object for selectors

| Key | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `productsContainerSelector` | `string (Optional)` | Specifies selector for products container  |
| `productsSelector` | `string (Optional)` | Specifies selector for product  |
| `linkSelectors` | `string[] (Optional)` | Specifies selectors for links to change  |
| `tagSelector` | `string (Optional)` | Specifies selector for tag where should appear  |

#### Example Config

The configuration object should be assigned to the `sponsoredProductConfig` key in the `window` object before the script initialization.

```js
window.sponsoredProductConfig = {
  isLoaderVisible: true,
  tagLabel: 'SPONSORED',

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

  tagClasses: 'product-labels product-label featured',
  itemsToDelete: ['div .labels-rounded', '.other-class'],

  selectors: {
    product: {
      productsContainerSelector: 'div[class^="products"]',
      linkSelectors: ['.wd-quick-shop a', '.wd-entities-title a'],
      productsSelector: 'div[class*="post-"]',
      tagSelector: '.wd-quick-shop a',
    },
    views: {
      categoryPage: '.example-category-page-class',
      mainPage: '.example-home-page-class',
      productPage: '.example-product-page-class',
    },
  },
};

```
