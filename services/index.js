import instance from "./instance";

const httpGet = (url, config = {}) => {
  return instance.get(url, config);
};

const httpPost = (url, data, config = {}) => {
  return instance.post(url, data, config);
};

const httpPatch = (url, data, config = {}) => {
  return instance.patch(url, data, config);
};

const httpDelete = (url, config = {}) => {
  return instance.delete(url, config);
};

export { httpGet, httpPost, httpPatch, httpDelete };
