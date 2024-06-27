// Flatsome

import { ONET_PRODUCT_CLASS } from 'consts/products';

const changeBadgeStyles = () => {
  const badges = document.querySelectorAll<HTMLDivElement>(
    `.${ONET_PRODUCT_CLASS} .badge`,
  );

  if (badges && badges.length > 0) {
    badges.forEach((badge) => {
      badge.style.pointerEvents = 'auto';
    });
  }
};

export { changeBadgeStyles };
