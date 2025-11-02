import axios from 'axios'
import { getAccessToken, saveAccessToken, saveProfile, clearAll } from '.'

class Http {
  instance
  accessToken
  constructor() {
    this.accessToken = getAccessToken()
    this.instance = axios.create({
      baseURL: 'http://localhost:9000/api/v1',

      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.headers) {
          // header có thể undified -> kick chuột vô nó
          //authorization : viết đúng định dạng để server chấp nhận
          config.headers.Authorization = this.accessToken

          return config
        }
        if (config.data instanceof FormData) {
          config.headers['Content-Type'] = 'multipart/form-data' // Nếu là form-data thì đổi header
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )
    this.instance.interceptors.response.use(
      // chuyển function (response) thành arrow function để truy cập dc private
      (response) => {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        const { url } = response.config
        if (url == 'user/login') {
          const tokenBear = 'Bearer ' + response.data.data?.access_token
          this.accessToken = tokenBear
          saveAccessToken(response.data.data?.access_token)
          if (response.data.data) {
            saveProfile(response.data.data)
          }
        }
        return response
      },
      function (error) {
        if (error.response.status === 401) {
          clearAll()
        }
        return Promise.reject(error)
      }
    )
  }
}
const http = new Http().instance
export default http
