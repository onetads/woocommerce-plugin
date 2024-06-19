import { THEME_MAP } from 'consts/themeMap';
import { TTheme } from 'types/themeMap';

const getThemeInfo = () => {
  return THEME_MAP.find((skin) => {
    const existingSkin = document.querySelector(skin.selector);

    if (existingSkin) {
      return true;
    }
  }) as TTheme | undefined;
};

export default getThemeInfo;
