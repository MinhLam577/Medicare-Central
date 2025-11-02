export const LocalStorageEventTarget = new EventTarget()

export const getAccessToken = () => {
  const token = localStorage.getItem('accesstoken')
  return token ? `Bearer ${token}` : ''
}
export const saveAccessToken = (token) => {
  localStorage.setItem('accesstoken', token)
}
export const tokenBear = (token) => {
  return 'Bearer ' + token
}

export const getProfile = () => {
  const result = localStorage.getItem('profile')
  return result ? JSON.parse(result) : null
}

export const saveProfile = (profile) => {
  localStorage.setItem('profile', JSON.stringify(profile))
}

export const clearProfile = () => {
  localStorage.removeItem('profile')
}
export const clearAll = () => {
  localStorage.removeItem('accesstoken')
  localStorage.removeItem('profile')
  const clearLSEvent = new Event('clearLS')
  LocalStorageEventTarget.dispatchEvent(clearLSEvent)
}

export const BASE_URL = 'https://api.minhdeptrai.site/api/v1'
// SEO
const removeSpecialCharacter = (stri) => {
  return stri
    .normalize('NFD') // Chuẩn hóa ký tự Unicode
    .replace(/[\u0300-\u036f]/g, '') // Loại bỏ dấu tiếng Việt
    .replace(/[^a-zA-Z0-9\s]/g, '') // Loại bỏ ký tự đặc biệt, giữ lại chữ cái, số và khoảng trắng
    .trim() // Xóa khoảng trắng thừa ở đầu/cuối
}

export const generateNameId = (str, id) => {
  return (
    removeSpecialCharacter(str)
      .replace(/\s+/g, '-') // Chuyển khoảng trắng thành dấu gạch ngang
      .toLowerCase() + `-id,${id}`
  ) // Định dạng slug: thêm -id-
}

export const getIdfromNameId = (nameId) => {
  const match = nameId.match(/-id,(\d+)$/) // Tìm ID với định dạng -id,
  return match ? match[1] : null // Trả về ID nếu tìm thấy, nếu không thì null
}

export const formatCurrency = (data) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(data ?? 0)
}
export const sum = (a, b) => {
  return a + b
}
