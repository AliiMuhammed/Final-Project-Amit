import axios from "axios";
import { getUserToken } from "./Storage";

const apiUrl =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV !== "production" ? "http://localhost:4000" : "");
let origin;
try {
  const url = new URL(apiUrl);
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash ||
    (process.env.NODE_ENV === "production" && url.protocol !== "https:")
  )
    throw new Error();
  origin = url.origin;
} catch {
  throw new Error(
    "Set REACT_APP_API_URL to the backend origin (HTTPS in production).",
  );
}
const client = axios.create({
  baseURL: `${origin}/`,
  withCredentials: false,
  timeout: 15000,
});
client.interceptors.request.use((config) => {
  if (new URL(config.url, config.baseURL).origin !== origin)
    throw new Error("API requests must use the configured backend origin.");
  const token = getUserToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  else delete config.headers.Authorization;
  return config;
});
const http = {
  GET: async (url, config = {}) => (await client.get(url, config)).data,
  POST: async (url, data = {}, config = {}) =>
    (await client.post(url, data, config)).data,
  PUT: async (url, data = {}, config = {}) =>
    (await client.put(url, data, config)).data,
  PATCH: async (url, data = {}, config = {}) =>
    (await client.patch(url, data, config)).data,
  DELETE: async (url, config = {}) => (await client.delete(url, config)).data,
};
export default http;
