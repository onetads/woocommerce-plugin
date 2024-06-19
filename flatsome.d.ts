declare global {
  interface Window {
    Flatsome: {
      behaviors: {
        slider: {
          detach: () => void;
          attach: () => void;
        };
        'quick-view': {
          attach: () => void;
        };
      };
    };
  }
}

export {};
