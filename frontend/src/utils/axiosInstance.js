import axios from 'axios'
import { BASE_URL } from './apiPaths'

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    }
})

//REQUEST INTERCEPTER:{here we are taking the token from the local storage and passing the token for the autherization and returning config}
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('token')
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`
        }
        return config;
    },
    (error) =>{
        return Promise.reject(error)
    }
)

//RESPONSE INTERSEPTER
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if(error.response){
            
           if (error.response.status === 401){
              window.location.href = '/'
            }
           else if(error.response.status === 500){
              console.error("Server Error")
            }
        }
        else if (error.code === 'ECONNABORTED'){
            console.error("Request timeout")
        }
        return Promise.reject(error)
    
    }
)


export default axiosInstance;