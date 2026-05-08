import axios from "axios";
import { useEffect } from "react";
import auth from "../firebase/firebase.config";
import { useNavigate } from "react-router";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const useAxios = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const requestInterceptor = axiosInstance.interceptors.request.use(
      async (config) => {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const idToken = await currentUser.getIdToken(true); // force refresh
          config.headers.Authorization = `Bearer ${idToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          auth.signOut();
          navigate("/auth");
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [navigate]);

  return axiosInstance;
};

export default useAxios;