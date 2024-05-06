import axios from "axios";

function getShopOrigin() {
  const match = window.location.href.match(
    /(https?:\/\/[\w\-]+\.myshopify\.com)/,
  );
  if (match) {
    return match[1];
  }
  return "namgia-developmen.myshopify.com";
}

const instance = axios.create({
  baseURL: `${import.meta.env.VITE_API_HOST}/api/v1`,
  timeout: 15000, // 15s
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use((config) => {
  config.headers["shop"] =
    "namgia-developmen.myshopify.com" || window.location.hostname;
  return config;
});

instance.interceptors.response.use(
  (response) => {
    return response?.data;
  },
  (error) => {
    // Do BE đã xử lý lỗi nên chỉ cần trả lỗi BE push về
    return error.response?.data;
  },
);

export default instance;
