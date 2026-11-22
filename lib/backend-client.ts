import axios from "axios";

export const backend = axios.create({
  baseURL: process.env.BACKEND_URL,
  timeout: 10000,
  validateStatus: () => true,
});

export const isOk = (status: number) => status >= 200 && status < 300;
