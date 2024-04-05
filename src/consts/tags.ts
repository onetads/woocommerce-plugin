const TAG_STYLES_CLASS = 'onet-ads-sponsored-label';

const TAG_STYLES = `
    .${TAG_STYLES_CLASS} {
        color: black !important;
        position: absolute;
        padding: 4px !important;
        margin: 0 !important;
        line-height: 1 !important;
        height: fit-content !important;
        min-height: fit-content !important;
        width: fit-content !important;
        min-width: fit-content !important;
        letter-spacing: 0.5px !important;
        font-size: 9px !important;
        font-weight: 400 !important;
        background-color: rgba(255,255,255,0.5) !important;
        z-index: 2 !important;
        pointer-events: none !important;
    }
`;

export { TAG_STYLES_CLASS, TAG_STYLES };
