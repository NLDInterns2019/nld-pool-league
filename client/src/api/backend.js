import axios from 'axios';

let baseURL;
if(process.env.NODE_ENV === 'production') {
    baseURL= 'http://nldpoolleaguebackend.azurewebsites.net'
}else{
    baseURL= 'http://localhost:8080'
}

export default axios.create({
    baseURL: baseURL
})
