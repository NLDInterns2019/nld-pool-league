import axios from "axios";

//let baseURL = "http://nldpoolleaguebackend.azurewebsites.net";
let baseURL = "http://localhost:8080";

export default axios.create({
  baseURL: baseURL
});
