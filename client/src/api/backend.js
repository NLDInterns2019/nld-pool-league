import axios from 'axios';

export default axios.create({
    baseURL: 'http://nldpoolleaguebackend.azurewebsites.net'
    // baseURL: 'http://localhost:8080'
})
