import { TFetchNativeAdOptions, TFetchNativeAdResponse } from 'types/dlApi';

declare global {
  namespace dlApi {
    let cmd: {
      push: (fn: (dlApiObj: typeof dlApi) => void) => void;
    };

    const fetchNativeAd:
      | undefined
      | ((options: TFetchNativeAdOptions) => Promise<TFetchNativeAdResponse>);

    const addKeyValue: (
      key: string,
      value: string | Record<string, string>,
    ) => void;
  }
}

export {};
