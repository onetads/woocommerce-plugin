const LOADING_SPINNER_CONTAINER_CLASS = 'onet-ads-loading-spinner-container';
const LOADING_SPINNER_CLASS = 'onet-ads-loading-spinner';

const LOADING_SPINNER_CONTAINER_STYLES = `
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
    position: absolute;
    width: 100%;
    margin: 0 !important;
    padding: 0 !important;
    height: 100%;
`;

const LOADING_SPINNER_STYLES = `
    width: 36px;
    height: 36px;
    border-style: solid;
    border-width: 3px;
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
`;

const LOADER_ANIMATION = `
    @keyframes rotation {
        0% {
            transform: rotate(0deg);
        }

        100% {
            transform: rotate(360deg);
        }
    }
`;

export {
  LOADING_SPINNER_CONTAINER_STYLES,
  LOADING_SPINNER_CONTAINER_CLASS,
  LOADING_SPINNER_CLASS,
  LOADER_ANIMATION,
  LOADING_SPINNER_STYLES,
};
