import axios from "axios";

const Baseurl = axios.create({
  baseURL: "https://boisnewsmedia.onrender.com/api/",
  headers: {
    "Content-Type": "Application/json",
  },
});

export const PostUrl = axios.create({
  baseURL: "https://boisnewsmedia.onrender.com/api/admin",
  method: "POST",
  headers: {
    "Content-Type": "Application/json",
  },
});

export const GetUrl = axios.create({
  baseURL: "https://boisnewsmedia.onrender.com/api/admin",
  method: "GET",
  headers: {
    "Content-Type": "Application/json",
  },
});
export default Baseurl;
