# Ras

This project contains javascript for WooCommerce widget.

# Reqs

Node: v20.8.1 (https://nodejs.org/dist/v20.8.1/docs/api/)
Yarn: v1.22.21

# Scripts

yarn build - builds minified js (code is bundled to dist/bundle.js file) <br/>
yarn eslint - checks for eslint errors
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

#### Configuration object for product listing, products details and main page

| Key | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `isEnabled` | `boolean` | Specifies whether the product should be visible |
| `productsCount` | `object` | Specifies the number of products injected into the list |


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
};

```
