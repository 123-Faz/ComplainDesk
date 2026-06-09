// import axios from "axios"
import Api from "./api.service";

// const Api = axios.create({
//   baseURL: `${import.meta.env.VITE_SERVER_URI}/api/v1`
// })



export const loginUser = async (payload: { username: string, password: string }) => {
  const { username, password } = payload;

  try {
    const { data } = await Api.post('auth/login', { username, password })
    return data
  } catch (error: any) {

    if (error.code === "ERR_NETWORK") {
      throw error?.message
    }
    throw error?.response?.data?.error
  }
}


export const registerUser = async (payload: { username: string, email: string, password: string, password_confirmation: string }) => {
  const { username, email, password, password_confirmation } = payload;
  try {
    const { data } = await Api.post('auth/register', { username, email, password, password_confirmation })
    return data
  }
  catch (error: any) {
    if (error.code === "ERR_NETWORK") {

      throw error?.message
    }
    throw error?.response?.data?.error
  }
}
export const getCurrentUser = async (token: string) => {

  try {
    const { data } = await Api.get('user/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
    return data
  } catch (error: any) {

    if (error.code === "ERR_NETWORK") {
      throw error?.message
    }
    throw error?.response?.data?.error
  }
}