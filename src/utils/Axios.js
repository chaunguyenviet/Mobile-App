import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
const axiosInstance = axios.create({
    baseURL: 'http://192.168.43.53:3000/'
})

axiosInstance.interceptors.request.use(
    async config =>{    
        const token = await AsyncStorage.getItem('@storage_Key')
        config.headers ={
            'Authorization' : `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
        return config
    },
    err => Promise.reject(err)
)

axiosInstance.interceptors.response.use(
    res => res.data,
    err => Promise.reject(err)
)
export default axiosInstance
