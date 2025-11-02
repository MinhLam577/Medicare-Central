import React, { useContext, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { schemaForgotPassword, schemaLogin } from '../ValidateScheme/Validate'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { AdminAuthAPI, AdminAPI } from '../../Api/admin'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/app.context'
import { LockOutlined, MailOutlined } from '@ant-design/icons'
import { message, Spin } from 'antd'
import './AdminLogin.css'
export default function AdminLogin() {
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const [isEmailFocus, setIsEmailFocus] = useState(false)
  const [isPasswordFocus, setIsPasswordFocus] = useState(false)
  const [formType, setFormType] = useState('login')
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: formType === 'login' ? yupResolver(schemaLogin) : yupResolver(schemaForgotPassword)
  })

  // Mutations
  const mutation = useMutation({
    mutationFn: (formData) => {
      if (formType === 'login') {
        var object = {}
        formData.forEach((value, key) => (object[key] = value))

        return AdminAuthAPI.loginAccountAdmin(formData)
      } else if (formType === 'forgotPassword') {
        return AdminAuthAPI.forgotPassword(formData)
      } else {
        return AdminAPI.resendEmail(formData)
      }
    }
  })

  const handleLoginSubmit = (data) => {
    if (data.status >= 400) {
      throw new Error(data.message)
    }
    const response_data = data.data
    const { access_token, refresh_token, user } = response_data
    const { avatarUrl, username, Roles: role, email } = user
    const adminData = {
      avatarUrl,
      username,
      role,
      email
    }

    login(adminData, access_token)
    localStorage.setItem('profile', JSON.stringify(adminData))
    toast.success('Đăng nhập thành công')
    navigate('/admin')
  }
  const handleForgotPasswordSubmit = (data) => {
    if (data.status >= 400) throw new Error(data.messages)
    setStatus(200)
    setMessageResult('Form change password has been sent to your email!')
  }

  const handleVerifyEmailSubmit = (data) => {
    if (data.status >= 400) throw new Error(data.messages)
    setStatus(200)
    setMessageResult('Verify email has been sent to your email!')
  }

  const onFormSubmit = handleSubmit((data) => {
    // gửi lên api data
    setLoading(true)
    const formData = new FormData()
    if (formType === 'login') {
      formData.append('email', data.email)
      formData.append('password', data.password)
    } else if (formType === 'forgotPassword') {
      formData.append('email', data.email)
    } else {
      formData.append('email', data.email)
    }

    mutation.mutate(formData, {
      onSuccess: (data) => {
        if (formType === 'login') {
          handleLoginSubmit(data)
        } else if (formType === 'forgotPassword') {
          handleForgotPasswordSubmit(data)
        } else {
          handleVerifyEmailSubmit(data)
        }
        setLoading(false)
      },
      onError: (data) => {
        setLoading(false)
        setStatus(400)
        setMessageResult(data.message)
      }
    })
  })
  const [status, setStatus] = useState(null)
  const [messageResult, setMessageResult] = useState(null)
  const [messageApi, contextHolder] = message.useMessage()
  const openMessage = (type, content, duration) => {
    messageApi.open({
      type: type,
      content: content,
      duration: duration
    })
  }

  useEffect(() => {
    const { email, password } = errors
    if (email || password) {
      setStatus(422)
      setMessageResult(email?.message || password?.message)
    }
  }, [errors])

  //#region status and message result of fetch api call
  useEffect(() => {
    if ([200, 201, 202, 204].includes(status)) {
      openMessage('success', messageResult, 3)
      setStatus(null)
      setMessageResult(null)
    } else if (status >= 400) {
      openMessage('error', messageResult, 3)
      setStatus(null)
      setMessageResult(null)
    }
  }, [status, messageResult])
  //#endregion

  return (
    <section
      className='w-[100vw] h-[100vh] flex justify-center items-center moving-background bg-cover bg-no-repeat bg-center'
      style={{
        backgroundImage: 'url(/assets/images/admin_login_2.jpg)'
      }}
    >
      {contextHolder}
      <Spin spinning={loading} tip='Loading...' size='large' fullscreen />
      <div className='bg-[rgb(14,8,33,0.8)] rounded-xl border-[0.188rem] border-solid border-[rgb(179,103,214,0.2)] backdrop-blur-0 w-[28.125rem] animate-slideUp mx-5'>
        <form action='' onSubmit={onFormSubmit} noValidate>
          {formType === 'forgotPassword' ? (
            <div className='text-[#fff] flex flex-col justify-end p-7 gap-6'>
              <h1 className='text-3xl text-center text-[#ffff] font-semibold'>Forgot Password</h1>
              <div
                className='mt-8 flex gap-3 px-5 py-4 border border-[rgb(179,103,214,0.7)] justify-start items-center text-[rgb(255,255,255)] rounded-full'
                onClick={() => document.getElementById('email').focus()}
                onFocus={() => setIsEmailFocus(true)}
                onBlur={() => setIsEmailFocus(false)}
                style={{
                  borderColor: isEmailFocus ? 'rgb(179,103,214,1)' : 'rgb(179,103,214,0.7)',
                  boxShadow: isEmailFocus ? '0 0.25rem 0.5rem rgba(179, 103, 214, 0.5)' : 'none'
                }}
              >
                <input
                  id='email'
                  placeholder='Email'
                  {...register('email')}
                  type='email'
                  name='email'
                  className='adminLogin__Input w-full outline-none text-sm bg-transparent placeholder:text-[#fff]'
                  tabIndex={1}
                />
                <MailOutlined className='text-xl text-[#fefefe]' />
              </div>
              <div className='mt-5 flex items-center justify-center gap-5'>
                <button
                  className='w-full text-center bg-gray-500 py-4 px-2 uppercase rounded-full text-[#fff] hover:bg-opacity-70 outline-none focus:bg-opacity-70'
                  tabIndex={3}
                  type='submit'
                >
                  Submit
                </button>
                <button
                  className='w-full text-center bg-[#fff] py-4 px-2 uppercase rounded-full text-[black] hover:bg-opacity-70 outline-none focus:bg-opacity-70'
                  tabIndex={3}
                  type='button'
                  onClick={() => {
                    setFormType('login')
                  }}
                >
                  Back
                </button>
              </div>
            </div>
          ) : formType === 'verifyEmail' ? (
            <div className='text-[#fff] flex flex-col justify-end p-7 gap-6'>
              <h1 className='text-3xl text-center text-[#ffff] font-semibold'>Verify Email</h1>
              <div
                className='mt-8 flex gap-3 px-5 py-4 border border-[rgb(179,103,214,0.7)] justify-start items-center text-[rgb(255,255,255)] rounded-full'
                onClick={() => document.getElementById('email').focus()}
                onFocus={() => setIsEmailFocus(true)}
                onBlur={() => setIsEmailFocus(false)}
                style={{
                  borderColor: isEmailFocus ? 'rgb(179,103,214,1)' : 'rgb(179,103,214,0.7)',
                  boxShadow: isEmailFocus ? '0 0.25rem 0.5rem rgba(179, 103, 214, 0.5)' : 'none'
                }}
              >
                <input
                  id='email'
                  placeholder='Email'
                  {...register('email')}
                  type='email'
                  name='email'
                  className='adminLogin__Input w-full outline-none text-sm bg-transparent placeholder:text-[#fff]'
                  tabIndex={1}
                />
                <MailOutlined className='text-xl text-[#fefefe]' />
              </div>
              <div className='mt-5 flex items-center justify-center gap-5'>
                <button
                  className='w-full text-center bg-gray-500 py-4 px-2 uppercase rounded-full text-[#fff] hover:bg-opacity-70 outline-none focus:bg-opacity-70'
                  tabIndex={3}
                  type='submit'
                >
                  Submit
                </button>
                <button
                  className='w-full text-center bg-[#fff] py-4 px-2 uppercase rounded-full text-[black] hover:bg-opacity-70 outline-none focus:bg-opacity-70'
                  tabIndex={3}
                  type='button'
                  onClick={() => {
                    setFormType('login')
                  }}
                >
                  Back
                </button>
              </div>
            </div>
          ) : (
            <div className='text-[#fff] flex flex-col justify-end p-7'>
              <h1 className='text-3xl text-center text-[#ffff] font-semibold'>Login</h1>
              <div
                className='mt-8 flex gap-3 px-5 py-4 border border-[rgb(179,103,214,0.7)] justify-start items-center text-[rgb(255,255,255)] rounded-full'
                onClick={() => document.getElementById('email').focus()}
                onFocus={() => setIsEmailFocus(true)}
                onBlur={() => setIsEmailFocus(false)}
                style={{
                  borderColor: isEmailFocus ? 'rgb(179,103,214,1)' : 'rgb(179,103,214,0.7)',
                  boxShadow: isEmailFocus ? '0 0.25rem 0.5rem rgba(179, 103, 214, 0.5)' : 'none'
                }}
              >
                <input
                  id='email'
                  placeholder='Email'
                  {...register('email')}
                  type='email'
                  name='email'
                  className='adminLogin__Input w-full outline-none text-sm bg-transparent placeholder:text-[#fff]'
                  tabIndex={1}
                />
                <MailOutlined className='text-xl text-[#fefefe]' />
              </div>
              <div
                className='mt-8 flex gap-3 px-5 py-4 border border-[rgb(179,103,214,0.7)] justify-start items-center text-[#fff] rounded-full mb-5'
                onClick={() => document.getElementById('password').focus()}
                onFocus={() => setIsPasswordFocus(true)}
                onBlur={() => setIsPasswordFocus(false)}
                style={{
                  borderColor: isPasswordFocus ? 'rgb(179,103,214,1)' : 'rgb(179,103,214,0.7)',
                  boxShadow: isPasswordFocus ? '0 0.25rem 0.5rem rgba(179, 103, 214, 0.5)' : 'none'
                }}
              >
                <input
                  id='password'
                  placeholder='Password'
                  {...register('password')}
                  type='password'
                  name='password'
                  tabIndex={2}
                  className='adminLogin__Input w-full h-full outline-none text-sm placeholder:text-[#fff] bg-transparent'
                />
                <LockOutlined className='text-xl text-[#fefefe]' />
              </div>
              <div className='text-[#fff] outline-none flex justify-between' type='button'>
                <button
                  className='hover:underline hover:decoration-1'
                  type='button'
                  onClick={() => {
                    setFormType('forgotPassword')
                  }}
                >
                  Forgot Password?
                </button>
                <button
                  className='hover:underline hover:decoration-1'
                  type='button'
                  onClick={() => {
                    setFormType('verifyEmail')
                  }}
                >
                  Verify Email?
                </button>
              </div>
              <div className='mt-5'>
                <button
                  className='w-full text-center bg-[#fff] py-4 px-2 uppercase rounded-full text-[black] hover:bg-opacity-70 outline-none focus:bg-opacity-70'
                  tabIndex={3}
                  type='submit'
                >
                  Login
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </section>
  )
}
