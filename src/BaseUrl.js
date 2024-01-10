import axios from "axios";

const language = JSON.parse(window.localStorage.getItem("lang"));

export default axios.defaults.baseURL = "https://api.boisnewsmedia.com";
// export default axios.defaults.baseURL = "http://localhost:3000";

export const PublicS3Url = "https://boisnewsmedia-assets.s3.eu-west-3.amazonaws.com/";


export const PostUrl = axios.create({
  //baseURL: "http://localhost:3000/api/admin",
  baseURL: "https://api.boisnewsmedia.com/api/admin",
  method: "POST",
  headers: {
    "Content-Type": "Application/json",
    "Accept-Language": language,
  },
});

export const GetUrl = axios.create({
  //baseURL: "http://localhost:3000/api/admin",
  baseURL: "https://api.boisnewsmedia.com/api/admin",
  method: "GET",
  headers: {
    "Content-Type": "Application/json",
    "Accept-Language": language,
  },
});
