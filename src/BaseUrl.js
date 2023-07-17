import axios from "axios";

export default axios.defaults.baseURL =
  "https://boisnewsmedia.onrender.com/api";

export const PostUrl = axios.create({
  baseURL: "https://boisnewsmedia.onrender.com/api/admin",
  method: "POST",
  headers: {
    "Content-Type": "Application/json",
    "Accept-Language": "en",
  },
});

export const GetUrl = axios.create({
  baseURL: "https://boisnewsmedia.onrender.com/api/admin",
  method: "GET",
  headers: {
    "Content-Type": "Application/json",
    "Accept-Language": "en",
  },
});
