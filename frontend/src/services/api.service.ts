import axios from "axios"

const Api = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URI}/api/${import.meta.env.VITE_API_VER}`
})



export default Api