import axios from "axios";

let baseURL;
baseURL = "http://nldpoolleaguebackend.azurewebsites.net";

export default axios.create({
  baseURL: baseURL
});
