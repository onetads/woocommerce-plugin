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

#### Configuration object for views
Selectors for views are exclusively needed for the script to determine the current page it is on.

| Key | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `mainPage` | `string (Optional)` | Specifies selector for main page  |
| `productPage` | `string (Optional)` | Specifies selector for product page  |
| `categoryPage` | `string (Optional)` | Specifies selector for category page  |

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

  selectors: {
    views: {
      categoryPage: '.example-category-page-class',
      mainPage: '.example-home-page-class',
      productPage: '.example-product-page-class',
    },
  },
};

```

## Theme Map

Theme map is located in `src/consts/themeMap.ts`

| Key | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `selector` | `string` | A selector used to verify if the current website's theme matches a specified criteria. This selector checks for the presence of a specific theme-related element or class in the document to determine the active theme. |
| `skin` | `boolean` | Skin name |
| `MAIN_PAGE` | `object` | Page options object |
| `PRODUCT_PAGE` | `object` | Page options object |
| `CATEGORY_PAGE` | `object` | Page options object |

#### Page options object

| Key | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `productsContainerSelector` | `string (Optional)` | Specify selector for products container |
| `spinnerContainerSelector` | `string (Optional)` | Specify selector for spinner container |
| `shouldRegenerateRows` | `boolean (Optional)` | Determines whether rows should be regenerated. By default, the plugin regenerates rows. Regenerating rows is necessary and responsible for the correct positioning of products in listings. Sometimes there may be a need to disable regenerating rows because the HTML of the listing may not have information about rows in the classes, which leads to the script stopping working. |
| `additionalProductClasses` | `string[] (Optional)` | An array of additional classes to be added to the product element |
| `onBeforeProductInject` | `function(productElement, productData) (Optional)` | Function which is triggered before sponsored product is injected into the DOM |
| `onProductsInjected` | `string (Optional)` | Function which is triggered after **all** sponsored products are injected into the DOM  |
| `onExistingProductRemove` | `function(elementToDelete) (Optional)` | Function which is triggered before deleting existing product in DOM with the same ID as sponsored product |

