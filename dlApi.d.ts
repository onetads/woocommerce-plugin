import { TFetchNativeAdOptions, TFetchNativeAdResponse } from 'types/dlApi';

declare global {
  namespace dlApi {
    const keyvalues:
      | {
          website_id: number;
        }
      | undefined;

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
