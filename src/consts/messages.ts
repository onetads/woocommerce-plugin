const PRODUCTS_CONTAINER_NOT_FOUND = 'PRODUCTS_CONTAINER_NOT_FOUND';
const ERROR_PROMOTED_PRODUCTS_MSG = 'ERROR_PROMOTED_PRODUCTS_MSG';
const EMPTY_LIST_WARN = 'EMPTY_LIST_WARN';

const messagesMap = {
  [PRODUCTS_CONTAINER_NOT_FOUND]: 'Products container not found',
  [ERROR_PROMOTED_PRODUCTS_MSG]:
    'An error occured while fetching promoted products',
  [EMPTY_LIST_WARN]: "List is empty or product selector doesn't match",
};

export {
  messagesMap,
  PRODUCTS_CONTAINER_NOT_FOUND,
  ERROR_PROMOTED_PRODUCTS_MSG,
  EMPTY_LIST_WARN,
};
