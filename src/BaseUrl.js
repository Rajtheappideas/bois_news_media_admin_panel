import axios from "axios";

const language = JSON.parse(window.localStorage.getItem("lang"));

<<<<<<< HEAD
// export default axios.defaults.baseURL = "http://15.235.192.7:3000";
export default axios.defaults.baseURL = "https://boisnewsmedia.onrender.com";

export const PostUrl = axios.create({
  baseURL: "https://boisnewsmedia.onrender.com/api/admin",
=======
export default axios.defaults.baseURL = "https://api.boisnewsmedia.com";
// export default axios.defaults.baseURL = "http://localhost:3000";

// export const PublicS3Url = "https://boisnewsmedia-assets.s3.eu-west-3.amazonaws.com";
export const PublicS3Url = "https://boisnewsmedia.onrender.com";


export const PostUrl = axios.create({
  baseURL: "https://boisnewsmedia.onrender.com/api/admin",
  // baseURL: "https://api.boisnewsmedia.com/api/admin",
>>>>>>> raj_appideas
  method: "POST",
  headers: {
    "Content-Type": "Application/json",
    "Accept-Language": language,
  },
});

export const GetUrl = axios.create({
  baseURL: "https://boisnewsmedia.onrender.com/api/admin",
<<<<<<< HEAD
=======
  // baseURL: "https://api.boisnewsmedia.com/api/admin",
>>>>>>> raj_appideas
  method: "GET",
  headers: {
    "Content-Type": "Application/json",
    "Accept-Language": language,
  },
});
