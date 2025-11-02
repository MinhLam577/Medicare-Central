import React, { useContext, useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../../../context/app.context'
import { useMutation } from '@tanstack/react-query'
import authAPI from '../../../../Api/user/auth'
import { toast } from 'react-toastify'
import { Helmet } from 'react-helmet-async'

//
export default function Profile() {
  const [previewImage, setPreviewImage] = useState(null) // Lưu URL của ảnh preview

  const { isProfile, setProfile } = useContext(AuthContext)
  const [formData, setFormData] = useState({
    user_fullname: '',
    user_phone: '', // or null, depending on your form requirements
    email: '',
    // user_avatar: '', // if avatar is an image URL or file, keep it as an empty string or null
    user_birthday: '', // ensure the format matches the expected date format
    user_gender: null // assuming gender is null initially
  })
  const [user_avatar, setImage] = useState('')
  // Gán dữ liệu khi component mount
  useEffect(() => {
    if (isProfile) {
      setFormData({
        user_fullname: isProfile.user_fullname || '',
        user_phone: isProfile?.user_phone, // Ensure phone is either a string or null
        email: isProfile.email || '', // email should be an empty string if not available
        user_birthday: isProfile.user_birthday || '2024-12-25', // Default to empty string if no birthday
        // user_avatar: isProfile.user_avatar, // Default to empty string if no avatar
        user_gender: isProfile?.user_gender // Default to null if no gender
      })
      setImage(isProfile.user_avatar)
    }
  }, [])

  // const [date, setDate] = useState('2002-02-12')
  const ImageRef = useRef()
  const handleOpenInput = () => {
    ImageRef.current.click()
  }
  const handleFileChange = (e) => {
    const File = e.target.files[0]

    const maxFileSize = 1 * 1024 * 1024 // 1MB
    const validFormats = ['image/jpeg', 'image/png']

    if (File) {
      // Kiểm tra định dạng ảnh
      if (!validFormats.includes(File.type)) {
        toast.error('Định dạng file không hợp lệ. Vui lòng chọn file .JPEG hoặc .PNG.')
        return
      }

      // Kiểm tra dung lượng file
      if (File.size > maxFileSize) {
        toast.error('Dung lượng file quá lớn. Vui lòng chọn ảnh có dung lượng tối đa 1MB.')
        return
      }
    }
    if (File) {
      const previewUrl = URL.createObjectURL(File) // Tạo URL tạm thời cho ảnh
      setPreviewImage(previewUrl)
      setFormData((prevState) => ({
        ...prevState,
        user_avatar: File
      }))
    }
  }
  // Hàm xử lý onChange
  const handleChange = (event) => {
    event.preventDefault()
    const { name, value } = event.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }
  const muTateUpdateProfile = useMutation({
    mutationFn: authAPI.updateProfile
  })
  // gửi data
  const handleSubmit = (event) => {
    event.preventDefault()
    // Validate form fields
    if (!formData.user_fullname || !formData.user_phone || !formData.user_birthday || !formData.user_gender) {
      toast.error('Vui lòng điền đầy đủ thông tin!')
      return
    }

    // Validate phone number
    if (formData.user_phone.length < 10) {
      toast.error('Số điện thoại phải có ít nhất 10 số!')
      return
    }
    if (!formData.user_phone.startsWith('0')) {
      toast.error('Số điện thoại phải bắt đầu bằng số 0!')
      return
    }

    // Validate birthday (should be less than current date)
    const currentDate = new Date()
    const birthDate = new Date(formData.user_birthday)

    // Check if birthday is a valid date and if it is less than current date
    if (isNaN(birthDate.getTime())) {
      toast.error('Ngày sinh không hợp lệ!')
      return
    }

    if (birthDate >= currentDate) {
      toast.error('Ngày sinh phải nhỏ hơn ngày hiện tại!')
      return
    }
    // Validate email (optional)
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (formData.email && !emailPattern.test(formData.email)) {
      toast.error('Email không hợp lệ!')
      return
    }

    const formDataToSend = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value)
    })
    muTateUpdateProfile.mutate(formDataToSend, {
      onSuccess: (data) => {
        setProfile(data?.data?.data)
        toast.success('Cập nhật Tài khoản thành công ')
      }
    })
  }

  return (
    <div className=' px-3 py-3 '>
      <Helmet>
        <title>Xem Profile | Nhà Thuốc PBL6</title>
        <meta
          name='description'
          content='Quản lý thông tin cá nhân tại Nhà Thuốc PBL6. Xem và cập nhật hồ sơ cá nhân, bao gồm tên, số điện thoại, địa chỉ và các thông tin liên quan một cách nhanh chóng và bảo mật.'
        />
      </Helmet>

      <div className='border-b border-b-gray-300'>
        <p className='capitalize text-xl text-[#2A2A2A] font-bold'>Hồ sơ của tôi </p>

        <div className='mt-1 pb-3 text-sm'>
          <p>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
        </div>
      </div>

      <div className='mt-8 flex flex-col-reverse md:flex-row md:items-start text-sm'>
        <form className='mt-6 flex-grow pr-10 md:mt-1' onSubmit={handleSubmit}>
          <div className=' flex flex-wrap sm:flex-row items-center'>
            <div className='sm:w-[20%] sm:pl-4 truncate capitalize text-right'>Tên</div>
            <div className='sm:w-[80%] sm:pl-5 '>
              <input
                type='text'
                className='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                value={formData.user_fullname}
                onChange={handleChange}
                name='user_fullname'
              />
            </div>
          </div>
          <div className=' mt-8 flex flex-wrap sm:flex-row items-center'>
            <div className='sm:w-[20%] sm:pl-4 truncate capitalize text-right'>Email</div>
            <div className='sm:w-[80%] sm:pl-5 '>
              <div className='text-gray-700 w-full px-3 py-2'>{formData.email}</div>
            </div>
          </div>
          <div className='mt-8 flex flex-wrap sm:flex-row items-center'>
            <div className='sm:w-[20%] sm:pl-4  capitalize text-right'>Điện thoại</div>
            <div className='sm:w-[80%] sm:pl-5 '>
              <input
                type='number'
                className='w-full rounded-sm border border-gray-300 px-3 py-2 '
                value={formData.user_phone}
                onChange={handleChange}
                name='user_phone'
              />
            </div>
          </div>

          <div className='mt-8 flex flex-wrap sm:flex-row items-center'>
            <div className='sm:w-[20%] sm:pl-4 truncate capitalize text-right'>Ngày Sinh</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <input
                type='date'
                name='user_birthday'
                value={formData.user_birthday}
                onChange={handleChange}
                className='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
              />
            </div>
          </div>

          <div className='mt-8 flex flex-wrap sm:flex-row items-center'>
            <div className='sm:w-[20%] sm:pl-4 truncate capitalize text-right'>Giới tính</div>
            <div className='sm:w-[80%] sm:pl-5 '>
              <select
                className='px-3 py-2 w-full border border-gray-300 rounded-sm outline-none'
                name='user_gender'
                value={formData.user_gender}
                onChange={handleChange}
              >
                <option value='' disabled>
                  Chọn giới tính
                </option>
                <option value={0}>Nam</option>
                <option value={1}>Nữ</option>
              </select>
            </div>
          </div>

          <div className='mt-8 flex flex-wrap sm:flex-row items-center justify-between'>
            <div className='sm:w-[20%] sm:pl-4 truncate capitalize text-right'>Mật khẩu</div>
            <div className='sm:w-[80%] sm:pl-5 flex justify-end items-center text-blue  '>
              <Link to='/account/profile/update-password' className='py-2'>
                Cập nhật
              </Link>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='1.5'
                stroke='currentColor'
                className='size-5'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
              </svg>
            </div>
          </div>
          <div className='mt-8 flex flex-wrap sm:flex-row items-center justify-between'>
            <div className='w-[40%] flex justify-center'>
              <button
                type='onSubmit'
                className='p-4 rounded-lg border bg-blue  mt-6  text-center text-white font-semibold'
              >
                Lưu thay đổi
              </button>
            </div>
            <div className='w-[60%] flex justify-center'></div>
          </div>
        </form>

        <div className='justify-center md:w-72 md:border-l md:border-l-gray-200'>
          <div className='flex flex-col items-center '>
            <div className='my-5 h-24 w-24'>
              {previewImage && <img src={previewImage} alt='' className='w-full h-full rounded-full object-cover' />}
              {!previewImage && <img src={user_avatar} alt='' className='w-full h-full rounded-full object-cover' />}
            </div>

            <input type='file' accept='.jpg,.jpeg,.png' className='hidden' ref={ImageRef} onChange={handleFileChange} />
            <button
              className=' px-4 py-2 rounded-sm shadow-sm  border border-gray-400 bg-white text-sm text-gray-600 text-center hover:bg-gray-100'
              onClick={handleOpenInput}
            >
              Chọn Ảnh{' '}
            </button>
            <div className='mt-2 text-gray-400 '>Dụng lượng file tối đa 1 MB</div>
            <div className='mt-1 text-gray-400 '>Định dạng:.JPEG, .PNG</div>
          </div>
        </div>
        <div className=''></div>
      </div>
    </div>
  )
}
