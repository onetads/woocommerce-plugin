import { THEME_KEY } from 'consts/common';
import { COULDNT_READ_THEME } from 'consts/messages';
import getMessage from 'utils/getMessage';
import {
  HTML_DATA_CATEGORY_KEY,
  HTML_DATA_MAIN_KEY,
  HTML_DATA_PRODUCT_KEY,
} from 'consts/products';

const findTheme = () => {
  const regex = /theme-[\w-]+/;
  const bodyClasses = document.body.className;
  const match = bodyClasses.match(regex);

  if (match) {
    return match[0];
  } else {
    throw new Error(getMessage(COULDNT_READ_THEME));
  }
};

const themeListener = () => {
  const currentTheme = findTheme();
  const previousTheme = localStorage.getItem(THEME_KEY);

  if (previousTheme !== currentTheme) {
    localStorage.removeItem(HTML_DATA_MAIN_KEY);
    localStorage.removeItem(HTML_DATA_CATEGORY_KEY);
    localStorage.removeItem(HTML_DATA_PRODUCT_KEY);

    localStorage.setItem(THEME_KEY, currentTheme);
  }
};

export default themeListener;
