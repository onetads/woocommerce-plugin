import { BASIC_TAG } from 'consts/common';
import {
  LOADER_ANIMATION,
  LOADING_SPINNER_CLASS,
  LOADING_SPINNER_CONTAINER_CLASS,
  LOADING_SPINNER_CONTAINER_STYLES,
  LOADING_SPINNER_STYLES,
} from 'consts/loadingSpinner';
import { COULDNT_GET_SPINNER_COLOR } from 'consts/messages';
import { THTMLData } from 'types/HTMLData';
import { TGetLoadingStylesArgs } from 'types/loadingSpinner';
import { TTheme } from 'types/themeMap';
import getCurrentPageInfo from 'utils/getCurrentPageInfo';
import getMessage from 'utils/getMessage';

const getSpinnerColor = (rgba: string) => {
  const matchedRgba = rgba.match(/\d+/g);

  if (!matchedRgba) {
    throw new Error(getMessage(COULDNT_GET_SPINNER_COLOR));
  }

  if (
    Number(matchedRgba[0]) * 0.299 +
      Number(matchedRgba[1]) * 0.587 +
      Number(matchedRgba[2]) * 0.114 >
    186
  ) {
    return 'black';
  } else {
    return 'white';
  }
};

const getLoadingSpinnerStyles = ({
  spinnerColor,
  bgColor,
}: TGetLoadingStylesArgs) => `
    .${LOADING_SPINNER_CONTAINER_CLASS} {
        ${LOADING_SPINNER_CONTAINER_STYLES}
        background-color: ${bgColor === 'rgba(0, 0, 0, 0)' ? 'white' : bgColor};
    }

    .${LOADING_SPINNER_CLASS} {
      border-color: ${bgColor === 'rgba(0, 0, 0, 0)' ? 'black' : spinnerColor};
      ${LOADING_SPINNER_STYLES}
    }

    ${LOADER_ANIMATION}
`;

const showLoadingSpinner = (
  productsContainerSelector: THTMLData['productsContainerSelector'],
  themeInfo: TTheme | undefined,
) => {
  let containerSelector = productsContainerSelector;

  const page = getCurrentPageInfo();
  if (!page) return;

  const spinnerContainerSelector = themeInfo?.[page]?.spinnerContainerSelector;

  if (spinnerContainerSelector) {
    containerSelector = spinnerContainerSelector;
  }

  const productsContainer = document.querySelector(
    containerSelector,
  ) as HTMLElement;

  if (!productsContainer) return;

  productsContainer.style.position = 'relative';
  productsContainer.style.overflow = 'hidden';

  let containerProductsBgColor = window
    .getComputedStyle(productsContainer, null)
    .getPropertyValue('background-color');

  if (containerProductsBgColor === 'rgba(0, 0, 0, 0)') {
    containerProductsBgColor = window
      .getComputedStyle(document.body, null)
      .getPropertyValue('background-color');
  }

  const spinnerStyles = document.createElement('style');
  spinnerStyles.innerHTML = getLoadingSpinnerStyles({
    bgColor: containerProductsBgColor,
    spinnerColor: getSpinnerColor(containerProductsBgColor),
  });

  const loadingSpinnerContainer = document.createElement(BASIC_TAG);
  const loadingSpinner = document.createElement(BASIC_TAG);
  loadingSpinnerContainer.classList.add(LOADING_SPINNER_CONTAINER_CLASS);

  loadingSpinner.classList.add(LOADING_SPINNER_CLASS);
  loadingSpinnerContainer.appendChild(loadingSpinner);

  document.body.appendChild(spinnerStyles);
  productsContainer.prepend(loadingSpinnerContainer);
};

const hideLoadingSpinner = (
  HTMLData: THTMLData,
  themeInfo: TTheme | undefined,
) => {
  const { productsContainerSelector, productSelector } = HTMLData;
  let containerSelector = productsContainerSelector;

  const page = getCurrentPageInfo();
  if (!page) return;

  const spinnerContainerSelector = themeInfo?.[page]?.spinnerContainerSelector;

  if (spinnerContainerSelector) {
    containerSelector = spinnerContainerSelector;
  }

  const loadingSpinnerContainer = document.querySelector(
    `.${LOADING_SPINNER_CONTAINER_CLASS}`,
  );

  loadingSpinnerContainer?.remove();

  const productsContainer = document.querySelector(
    containerSelector,
  ) as HTMLElement;

  productsContainer.style.position = 'static';
  productsContainer.style.overflow = 'visible';

  const productElements = Array.from(
    productsContainer.querySelectorAll(productSelector),
  ) as HTMLElement[];

  for (const productElement of productElements) {
    productElement.style.visibility = 'visible';
  }
};

export { showLoadingSpinner, hideLoadingSpinner };
