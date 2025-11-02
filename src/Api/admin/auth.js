import { BASE_URL } from '../../until'
import { fetchWithAuth } from './handleErrorAPI'
const rootAdminURL = BASE_URL

const AdminAuthAPI = {
  loginAccountAdmin: async (formData) => {
    var object = {}
    formData.forEach((value, key) => (object[key] = value))
    var json = JSON.stringify(object)
    return await fetchWithAuth(
      `${rootAdminURL}/auth/admin/login`,
      'POST',
      undefined,
      'login admin account',
      json,
      'application/json'
    )
  },
  forgotPassword: async (email) =>
    await fetchWithAuth(`${rootAdminURL}/forgot-password`, 'POST', undefined, 'forgot password admin account', email),
  resetPassword: async (data) =>
    await fetchWithAuth(`${rootAdminURL}/reset-password`, 'POST', undefined, 'reset password admin account', data)
}

export default AdminAuthAPI
