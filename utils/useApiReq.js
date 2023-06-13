import { useFetch, useRuntimeConfig } from '#app';

export default async (apiUrl, opts) => {
  const config = await useRuntimeConfig();
  return useFetch(apiUrl, {
    baseURL: `http://data.ex.co.kr/openapi`,
    method: opts?.method,
    params: opts?.params,
    body: opts?.body,
    initialCache: false,
    onRequest({ request, options }) {
      options.headers = options.headers || {};
      // console.log(`[useApiReq] : API 요청`);
      // console.log(`[useApiReq] : ${request}`);
    },
    onRequestError({ request, options, error }) {
      // console.log(`[useApiReq] : 요청중 오류 발생`);
      // console.log(error);
    },
    onResponse({ request, response, options }) {
      // console.log(`[useApiReq] : 응답 완료`);
      // console.log(`[useApiReq] : ${response.status}`);
      return response._data;
    },
    onResponseError({ request, response, options }) {
      console.log(`[useApiReq] : 응답중 오류 발생`);
      console.log(`[useApiReq] : ${response.status}`);
    },
  });
};
