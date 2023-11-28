import axios from "axios";

const language = JSON.parse(window.localStorage.getItem("lang"));

export default axios.defaults.baseURL = "http://boisnewsbackend-env-prod.eba-5tri2bm5.eu-west-3.elasticbeanstalk.com";

export const PostUrl = axios.create({
  baseURL: "http://boisnewsbackend-env-prod.eba-5tri2bm5.eu-west-3.elasticbeanstalk.com/api/admin",
  method: "POST",
  headers: {
    "Content-Type": "Application/json",
    "Accept-Language": language,
  },
});

export const GetUrl = axios.create({
  baseURL: "http://boisnewsbackend-env-prod.eba-5tri2bm5.eu-west-3.elasticbeanstalk.com/api/admin",
  method: "GET",
  headers: {
    "Content-Type": "Application/json",
    "Accept-Language": language,
  },
});
