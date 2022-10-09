import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

export function getFromServer(path: string, params: any = {}) {
  return axiosInstance.get(path, {params})
}

export function postOnServer(path: string, body: any) {
  return axiosInstance.post(path, body,)
}

export function putOnServer(path: string, body: any) {
  return axiosInstance.put(path, body,)
}

export function deleteOnServer(path: string, params: any = {}) {
  return axiosInstance.delete(path, {params})
}
