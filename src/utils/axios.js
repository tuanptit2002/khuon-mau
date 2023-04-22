import axios from 'axios';
import firebase from 'firebase/compat/app';
import NProgress from 'nprogress';
import { mediaBaseURL } from '../config';
// ----------------------------------------------------------------------

export const axiosMedia = axios.create({
  baseURL: mediaBaseURL,
  timeout: 0,
});

const addBearerToken = async (config) => {
  const accessToken = await firebase.auth().currentUser.getIdToken();
  if (accessToken)
    config.headers = {
      ...config.headers,
      'Authorization': `Bearer ${accessToken}`
    };
  NProgress.start();
  return config;
};

const handleResponse = async response => {
  NProgress.done();
  return (response);
};

// Request interceptor for API calls
axiosMedia.interceptors.request.use(addBearerToken);
axiosMedia.interceptors.response.use(handleResponse,
  async (error) => {
    NProgress.done();

    const originalRequest = error.config;
    if (error.response && (error.response.status === 401) && !originalRequest._retry) {
      originalRequest._retry = true;
      await firebase.auth().currentUser.getIdToken(true);
      return axiosMedia(originalRequest);
    }
    if (error.response && (error.response.status === 401)) {
      await firebase.auth().signOut();
    }

    throw (error);
  });

export const handleRequest = async (config) => {
  try {
    const resp = await axiosMedia(config);
    return resp.data;
  } catch (error) {
    console.log(error);
    if (error.response)
      return (error.response.data);

    return ({ code: "408", message: error.message });
  }
};