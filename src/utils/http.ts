import axios from 'axios';

const apiUrl = (import.meta.env.VITE_API_URL as string) || 'http://localhost:3000';

export const instance = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(
  (config) => {
    // if (TokenUtil.accessToken) {
    //     config.headers["Authorization"] = 'Bearer ' + TokenUtil.accessToken; // for Node.js Express back-end
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;

    if (originalConfig.url !== '/auth/login' && err.response) {
      // Access Token was expired
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;

        try {
          // if (TokenUtil.refreshToken) {
          //     await authenticationRepository.api.refreshToken()
          // }
          return instance(originalConfig);
        } catch (_error) {
          return Promise.reject(_error);
        }
      }
    }

    return Promise.reject(err);
  },
);

export const http = {
  fetcher: async (url: string) => {
    try {
      const uri = `${apiUrl}${url}`;
      const resp = await instance.get(uri);

      return resp.data;
    } catch (error) {
      console.log({ errorAxios: error });
    }
  },
  get: async (url: string, opts = {}) => {
    const resp = await instance.get(apiUrl + url, opts);

    return resp.data;
  },
  post: async (url: string, data: any, opts: any) => {
    const resp = await instance.post(apiUrl + url, data, opts);

    return resp.data;
  },
  put: async (url: string, data: any, opts: any) => {
    const resp = await instance.put(apiUrl + url, data, opts);

    return resp.data;
  },
  patch: async (url: string, data: any, opts: any) => {
    const resp = await instance.patch(apiUrl + url, data, opts);

    return resp.data;
  },
  del: async (url: string, opts: any) => {
    const resp = await instance.delete(apiUrl + url, opts);

    return resp.data;
  },
};
