type TSwiper = HTMLDivElement & {
  swiper: {
    update: () => void;
    enable: () => void;
    disable: () => void;
  };
};

export type { TSwiper };
