import axios from "axios";
import { environment } from "../env"

const axiosInstance = axios.create({
  baseURL: environment.BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
