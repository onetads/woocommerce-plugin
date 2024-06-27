import { DLAPI_CHECK_DELAY } from 'consts/common';
import { MAX_TIMEOUT_MS } from 'consts/dlApi';
import { FETCHING_DLAPI_TOOK_TOO_LONG } from 'consts/messages';
import getMessage from 'utils/getMessage';

const waitForDlApi = async () => {
  const timeoutPromise = new Promise<void>((_, reject) => {
    setTimeout(() => {
      reject(getMessage(FETCHING_DLAPI_TOOK_TOO_LONG));
    }, MAX_TIMEOUT_MS);
  });

  const dlApiPromise = new Promise<void>((resolve) => {
    const intervalId = setInterval(() => {
      if (
        window.dlApi.fetchNativeAd &&
        window.dlApi.keyvalues &&
        window.dlApi.keyvalues.website_id
      ) {
        clearInterval(intervalId);
        resolve();
      }
    }, DLAPI_CHECK_DELAY);
  });

  return await Promise.race([dlApiPromise, timeoutPromise])
    .then(() => {})
    .catch((error) => {
      throw new Error(error);
    });
};

export default waitForDlApi;
