import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
const IPV4 = process.env.EXPO_PUBLIC_IPV4;
const PORT = process.env.EXPO_PUBLIC_PORT;
let showLoading: () => void;
let hideLoading: () => void;

export const setLoadingHandler = (handlers: {
  showLoading: () => void;
  hideLoading: () => void;
}) => {
  showLoading = handlers.showLoading;
  hideLoading = handlers.hideLoading;
};

const instance = axios.create({
  baseURL: `http://${IPV4}:${PORT}`,
});

// Request Interceptor
instance.interceptors.request.use(
  async (config) => {
    showLoading?.();
    const token = await AsyncStorage.getItem("access_token");
    if (token != null) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    hideLoading?.();
    return Promise.reject(error);
  }
);

// Response Interceptor
instance.interceptors.response.use(
  (response) => {
    hideLoading?.();
    return response.data ?? response;
  },
  (error) => {
    hideLoading?.();
    return error?.response?.data ?? Promise.reject(error);
  }
);

export default instance;
