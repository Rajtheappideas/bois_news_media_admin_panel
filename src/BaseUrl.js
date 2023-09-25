import axios from "axios";

const language = JSON.parse(window.localStorage.getItem("lang"));

// export default axios.defaults.baseURL = "http://15.235.192.7:3000";
export default axios.defaults.baseURL = "https://boisnewsmedia.onrender.com";

export const PostUrl = axios.create({
  baseURL: "https://boisnewsmedia.onrender.com/api/admin",
  method: "POST",
  headers: {
    "Content-Type": "Application/json",
    "Accept-Language": language,
  },
});

export const GetUrl = axios.create({
  baseURL: "https://boisnewsmedia.onrender.com/api/admin",
  method: "GET",
  headers: {
    "Content-Type": "Application/json",
    "Accept-Language": language,
  },
});
