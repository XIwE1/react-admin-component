// lib/axios-instance.ts
import Axios, { InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { message } from "antd";

export interface ApiResponse<T = any> {
  code: number;
  data: T;
  msg: string;
}

// 创建实例
const axiosInstance = Axios.create({
  // baseURL: "/admin",
  // timeout: 10000, // 设置超时时间
});

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    let token: string | null = null;
    token = localStorage.getItem("token");
    config.headers["Content-Type"] = "application/json";
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.data.code !== 1000) {
      response.data?.msg && message.error(response.data.msg);
    }
    return response.data;
  },
  (error: any) => {
    // 统一错误处理
    const message =
      error.response?.data?.message || error.message || "请求失败";
    // 可以在此处弹出错误提示，或者根据状态码跳转登录页等
    console.error("请求错误:", message);
    return Promise.reject(error);
  }
);

export default axiosInstance;
