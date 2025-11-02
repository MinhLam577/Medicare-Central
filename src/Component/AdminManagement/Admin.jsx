import { useState, useEffect, useRef } from 'react'
import { AdminAPI, AdminPermissionsAPI } from '../../Api/admin'
import { Add, SearchNormal, Refresh, ArrowDown2, ArrowSwapHorizontal, AddCircle } from 'iconsax-react'
import { Link } from 'react-router-dom'
import { Dropdown, Popconfirm, message, Modal, Tooltip, Spin, DatePicker, ConfigProvider, Select } from 'antd'
import { DashOutlined, DeleteOutlined, CloudUploadOutlined, CloseCircleOutlined } from '@ant-design/icons'
import 'react-toastify/dist/ReactToastify.css'
import AdminTable from '../AdminTable'
import BreadCrumbs from '../AdminBreadCrumbs'
import { useAuth } from '../../context/app.context'
import { useAdminMainLayoutFunction } from '../../Layouts/Admin/MainLayout/MainLayout'
const { RangePicker } = DatePicker
const filterTheme = {
  token: {
    colorTextQuaternary: '#1D242E',
    colorTextPlaceholder: '#9da4b0',
    fontFamily: 'Poppins, sans-serif',
    controlOutline: 'none',
    colorBorder: '#e8ebed',
    borderRadius: '4px',
    colorPrimary: '#008f99'
  },
  components: {
    Select: {
      activeBorderColor: '#1D242E',
      hoverBorderColor: '#1D242E',
      optionActiveBg: 'rgb(0, 143, 153, 0.3)',
      optionSelectedBg: 'rgb(0, 143, 153, 0.3)',
      optionSelectedColor: '#1D242E'
    },
    TreeSelect: {
      nodeHoverBg: 'rgb(0, 143, 153, 0.3)',
      nodeSelectedBg: 'rgb(0, 143, 153, 0.3)'
    },
    DatePicker: {
      activeBorderColor: '#1D242E',
      hoverBorderColor: '#1D242E'
    }
  }
}

const Admin = () => {
  const { setIsLogin } = useAdminMainLayoutFunction()
  const { isProfile } = useAuth()
  const { role = null || undefined } = isProfile ? isProfile : {}
  const token = localStorage.getItem('accesstoken')
  const [messageApi, contextHolder] = message.useMessage()
  const openMessage = (type, content, duration) => {
    messageApi.open({
      type: type,
      content: content,
      duration: duration
    })
  }

  const [status, setStatus] = useState(null)
  const [messageResult, setMessageResult] = useState('')
  //#region filter data
  const [searchValue, setSearchValue] = useState('')
  const [selectedFrom, setSelectedFrom] = useState(null)
  const [selectedTo, setSelectedTo] = useState(null)
  const [roles, setRoles] = useState(['Admin', 'Super Admin'])
  const [selectedRoles, setSelectedRoles] = useState()
  const [adminStatus, setAdminStatus] = useState(['Active', 'Deleted'])
  const [selectedAdminStatus, setSelectedAdminStatus] = useState()
  //#endregion

  //#region Table data and custom pagination
  // Date format options
  const optionsDateformat = {
    weekday: 'long',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }
  // Date format
  const DateFormat = (date) => {
    const formattedDate = new Date(date).toLocaleDateString('en-US', optionsDateformat)
    return `${formattedDate}`
  }

  //Table columns
  const columns = [
    {
      title: '#',
      dataIndex: 'admin_id',
      key: 'admin_id',
      width: '10%',
      sorter: (a, b) => a.admin_id - b.admin_id,
      ellipsis: true
    },
    {
      title: 'Full name',
      dataIndex: 'username',
      key: 'username',
      width: '20%',
      sorter: (a, b) => a.username.localeCompare(b.username),
      ellipsis: true,
      render: (text, record) => (
        <div className='flex items-center gap-x-2 justify-start'>
          <img
            src={record.avatarUrl ? record.avatarUrl : '/assets/images/default-avatar.png'}
            alt={text}
            className='w-[48px] h-[48px] object-cover rounded-full'
            onError={(e) => {
              e.target.onerror = null
              e.target.src = '/assets/images/default-avatar.png'
            }}
          />
          <span>{text}</span>
        </div>
      )
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: '20%',
      sorter: (a, b) => a.email.localeCompare(b.email),
      ellipsis: true
    },
    {
      title: 'Create at',
      dataIndex: 'admin_created_at',
      key: 'admin_created_at',
      width: '25%',
      sorter: (a, b) => new Date(a.admin_created_at) - new Date(b.admin_created_at),
      ellipsis: true,
      render: (text) => <span className='text-[14px]'>{DateFormat(text)}</span>
    },
    {
      title: 'Role',
      dataIndex: 'role_id',
      key: 'role_id',
      width: '15%',
      render: (text, record) => {
        let color
        let backgroundColor
        let role = record.role_id
        let statusText
        switch (role) {
          case 1:
            color = 'green'
            backgroundColor = 'rgba(0, 255, 0, 0.1)'
            statusText = 'Admin'
            break
          case 2:
            color = 'red'
            backgroundColor = 'rgba(255, 0, 0, 0.1)'
            statusText = 'Super Admin'
            break
          case 3:
            color = 'rgb(249, 115, 22)'
            backgroundColor = 'rgba(255, 165, 0, 0.1)'
            statusText = 'Manager'
            break
        }
        return (
          <span
            style={{ color, backgroundColor }}
            className='inline-block py-1 px-4 rounded-xl whitespace-nowrap text-xs'
          >
            {statusText}
          </span>
        )
      }
    },
    {
      title: 'Status',
      dataIndex: 'admin_is_delete',
      key: 'admin_is_delete',
      width: '10%',
      render: (text) => (
        <span style={{ color: Number(text) === 0 ? 'green' : 'red' }}>{Number(text) === 0 ? 'Active' : 'Deleted'}</span>
      )
    },
    ...(role && role.toLowerCase() === 'manager'
      ? [
          {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            width: '10%',
            render: (text, record) => (
              <Dropdown
                trigger={['click']}
                placement='bottomRight'
                menu={{
                  items: [
                    {
                      key: '3',
                      label:
                        record.admin_is_delete === 1 ? (
                          <Popconfirm
                            align={{ offset: [20, 20] }}
                            placement='bottomRight'
                            title={`Restore record ${record.admin_id}`}
                            description='Are you sure to store this record?'
                            onConfirm={() => handleRestoreAdmin(record)}
                            okText='Restore'
                            cancelText='Cancel'
                          >
                            <button
                              type='button'
                              className='flex items-center gap-x-2 justify-start w-full'
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Refresh className='text-[green]' size={15} /> <span>Restore</span>
                            </button>
                          </Popconfirm>
                        ) : (
                          <Popconfirm
                            align={{ offset: [20, 20] }}
                            placement='bottomRight'
                            title={`Delete record ${record.admin_id}`}
                            description='Are you sure to delete this record?'
                            onConfirm={() => handleDeleteAdmin(record)}
                            okText='Delete'
                            cancelText='Cancel'
                          >
                            <button
                              type='button'
                              className='flex items-center gap-x-2 justify-start w-full'
                              onClick={(e) => e.stopPropagation()}
                            >
                              <DeleteOutlined className='text-[14px] text-[red]' />
                              <span>Delete</span>
                            </button>
                          </Popconfirm>
                        )
                    },
                    {
                      key: '4',
                      label: (
                        <Popconfirm
                          align={{ offset: [20, 20] }}
                          placement='bottomRight'
                          title={`Change role record ${record.admin_id}`}
                          description='Are you sure to change role of this record?'
                          onConfirm={() => {
                            handleChangeRole(record)
                          }}
                          okText='Ok'
                          cancelText='Cancel'
                        >
                          <button
                            type='button'
                            className='flex items-center gap-x-2 justify-center'
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ArrowSwapHorizontal className='text-[green]' size={15} /> <span>Change Role</span>
                          </button>
                        </Popconfirm>
                      )
                    },
                    {
                      key: '5',
                      label: (
                        <button
                          type='button'
                          className='flex items-center gap-x-2 justify-start w-full'
                          onClick={() => {
                            setOpenModalAddPermission(true)
                            setSelectedAdmin(record.admin_id)
                            getAdminByID(record.admin_id)
                          }}
                        >
                          <AddCircle size='15' color='blue' /> <span>Add permission</span>
                        </button>
                      )
                    },
                    {
                      key: '6',

                      label: (
                        <button
                          type='button'
                          className='flex items-center gap-x-2 justify-start w-full'
                          onClick={() => {
                            setOpenModalRemovePermission(true)
                            setSelectedAdmin(record.admin_id)
                            getAdminByID(record.admin_id)
                          }}
                        >
                          <CloseCircleOutlined size={17} className='text-red-600' /> <span>Remove permission</span>
                        </button>
                      )
                    }
                  ]
                }}
                className='flex justify-center bg-[#fafafa] items-center px-2 rounded-md w-[50px] h-[40px] border-[1px] border-solid border-[#e8ebed]'
              >
                <button type='button' className='flex items-center'>
                  <DashOutlined className='text-[15px]' />
                </button>
              </Dropdown>
            )
          }
        ]
      : [])
  ]

  //Table data
  const [data, setData] = useState()
  const [filterData, setFilterData] = useState([])
  const [loading, setLoading] = useState()
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 8
    }
  })

  const handleTableChange = (pagination, filters, sorter) => {
    setLoading(true)
    const params = {
      pagination,
      filters,
      sortOrder: sorter ? sorter.order : undefined,
      sortField: sorter ? sorter.field : undefined
    }
    setTableParams(params)
    setLoading(false)
  }

  const searchAdmins = () => {
    try {
      const formatDate = (date) => {
        let format = date

        // Check if the date is in DD/MM/YYYY format
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
          const [day, month, year] = date.split('/')
          format = `${year}-${month}-${day}`
        }

        // Check if the date is in ISO 8601 format
        else if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(date)) {
          const parsedDate = new Date(date)
          const day = String(parsedDate.getDate()).padStart(2, '0')
          const month = String(parsedDate.getMonth() + 1).padStart(2, '0') // Months are zero-based
          const year = parsedDate.getFullYear()
          format = `${year}-${month}-${day}`
        }

        // Check if the date is in the format "Wed Sep 25 2024 00:00:00 GMT+0700 (Indochina Time)"
        else if (Date.parse(date)) {
          const parsedDate = new Date(date)
          const day = String(parsedDate.getDate()).padStart(2, '0')
          const month = String(parsedDate.getMonth() + 1).padStart(2, '0') // Months are zero-based
          const year = parsedDate.getFullYear()
          format = `${year}-${month}-${day}`
        }

        return format ? new Date(format) : null
      }
      const result = data.filter((item) => {
        const matchesAdminFullName =
          item.username.toLowerCase().includes(searchValue.toLowerCase()) || item.admin_id.toString() === searchValue
        const matchesAdminEmail = item.email.toLowerCase().includes(searchValue.toLowerCase())
        const matchesRole = selectedRoles !== undefined ? item.role_id === selectedRoles : true
        const matchesStatus = selectedAdminStatus !== undefined ? item.admin_is_delete === selectedAdminStatus : true
        const matchesDateRange =
          selectedFrom && selectedTo
            ? formatDate(item.admin_created_at) &&
              formatDate(selectedFrom) &&
              formatDate(selectedTo) &&
              formatDate(item.admin_created_at) >= formatDate(selectedFrom) &&
              formatDate(item.admin_created_at) <= formatDate(selectedTo)
            : true
        return (matchesAdminFullName || matchesAdminEmail) && matchesDateRange && matchesRole && matchesStatus
      })
      const tableData = result
      setFilterData(tableData)
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          total: result.length
        }
      })
    } catch (e) {
      setStatus(400)
      setMessageResult(e.message)
    }
  }

  const fetchAdmins = async () => {
    setLoading(true)
    try {
      const result = await AdminAPI.getAllAdmin(token)

      if (!result) return

      const data = result.data
      const tableData = data
        .map((item) => ({
          ...item,
          key: item.admin_id
        }))
        .sort((a, b) => new Date(b.admin_updated_at) - new Date(a.admin_updated_at))
      setFilterData(tableData)
      setData(tableData)
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          total: data.length
        }
      })
      setLoading(false)
    } catch (e) {
      if (e.message.includes('401')) {
        setIsLogin(false)
        return
      }
      setStatus(400)
      setMessageResult(e.message)
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    try {
      if (role === null || undefined) throw new Error('401 Unauthorized')
      if (role.toLowerCase() === 'superadmin') {
        setRoles(['Admin'])
      } else {
        setRoles(['Admin', 'Super Admin'])
      }
    } catch (e) {
      if (e.message.includes('401')) {
        setIsLogin(false)
        return
      }
      setStatus(400)
      setMessageResult(e.message)
    }
  }, [role])

  useEffect(() => {
    fetchAllPermissions()
    fetchAdmins()
  }, [])

  useEffect(() => {
    if (data) {
      searchAdmins()
    }
  }, [
    data,
    searchValue,
    tableParams.pagination?.current,
    tableParams?.sortOrder,
    tableParams?.sortField,
    JSON.stringify(tableParams.filters),
    selectedFrom,
    selectedTo,
    selectedRoles,
    tableParams.pagination?.pageSize,
    selectedAdminStatus
  ])
  //#endregion

  //#region Modal add or update
  //Modal setting
  const [openModal, setOpenModal] = useState(false)
  const [typeModal, setTypeModal] = useState('add')

  //#region Form data
  const [adminFullName, setAdminFullName] = useState('')
  const [errorAdminFullName, setErrorAdminFullName] = useState('')
  const [email, setEmail] = useState('')
  const [errorEmail, setErrorEmail] = useState('')
  const [Avatar, setAvatar] = useState(null)
  const fileInputRef = useRef(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [errorFileUpload, setErrorFileUpload] = useState('')

  //handle drag and drop image file
  const [dragging, setDragging] = useState(false)
  const handleDragOver = (e) => {
    e.preventDefault()
    setDragging(true)
  }

  const handleDragLeave = () => {
    setDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      setSelectedFile(droppedFile)
      setAvatar(URL.createObjectURL(droppedFile))
      fileInputRef.current.value = null
    }
  }

  //handle upload Avatar
  const handleUploadAvatar = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      setAvatar(URL.createObjectURL(file))
      setSelectedFile(file)
      fileInputRef.current.value = null
    }
  }

  //handle clear Avatar
  const handleClearAvatar = (e) => {
    e.stopPropagation()
    setAvatar(null)
    setSelectedFile(null)
  }

  const handleErrorFullName = (username) => {
    if (username === '') {
      setErrorAdminFullName('Full name is required')
      return false
    }
    return true
  }

  const handleErrorEmail = (email) => {
    if (email === '') {
      setErrorEmail('Email is required')
      return false
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@(gmail\.com|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/

    if (!/^[a-zA-Z0-9._%+-]+@/.test(email)) {
      setErrorEmail('Invalid email format: missing "@" symbol or incorrect local part')
      return false
    }

    if (!/@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      setErrorEmail('Invalid email format: domain part is incorrect')
      return false
    }

    if (!emailPattern.test(email)) {
      setErrorEmail('Invalid email format')
      return false
    }
    return true
  }

  // handle delete admin record
  const handleDeleteAdmin = async (record) => {
    try {
      let response = await AdminAPI.deleteAdmin(record.admin_id, token)
      if (!response) return
      setStatus(200)
      setMessageResult('Success delete')
    } catch (error) {
      if (error.message.includes('401')) {
        setIsLogin(false)
        return
      }
      setStatus(400)
      setMessageResult(error.message)
    }
  }

  //handle change role admin
  const handleChangeRole = async (record) => {
    try {
      let result = await AdminAPI.changeRole(record.admin_id, token)
      if (!result) return
      const { messages, status } = result
      setStatus(status)
      setMessageResult(messages.join('. '))
    } catch (error) {
      if (error.message.includes('401')) {
        setIsLogin(false)
        return
      }
      setStatus(400)
      setMessageResult(error.message)
    }
  }

  const handleRestoreAdmin = async (record) => {
    try {
      const result = await AdminAPI.deleteAdmin(record.admin_id, token)
      if (!result) return
      const { messages, status } = result
      setStatus(status)
      setMessageResult(messages.join('. '))
    } catch (e) {
      if (e.message.includes('401')) {
        setIsLogin(false)
        return
      }
      setStatus(400)
      setMessageResult(e.message)
    }
  }

  // handle submit and or update admin
  const [submitLoading, setSubmitLoading] = useState(false) // loading submit state
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitLoading(true)
    const formData = new FormData()
    const username = adminFullName
    const adminEmail = email
    const isValidEmail = handleErrorEmail(adminEmail)
    const isValidFullName = handleErrorFullName(username)
    if (!isValidEmail || !isValidFullName) {
      setSubmitLoading(false)
      return
    }
    formData.append('username', adminFullName)
    formData.append('email', adminEmail)
    if (selectedFile) formData.append('avatarUrl', selectedFile)
    let response = null
    try {
      if (typeModal === 'add') {
        response = await AdminAPI.addAdmin(formData, token)
      }
      if (!response) return
      setStatus(200)
      setMessageResult(`Success ${typeModal} admin`)
    } catch (e) {
      if (e.message.includes('401')) {
        setIsLogin(false)
        return
      }
      setStatus(400)
      setMessageResult(`${e.message}`)
    } finally {
      setSubmitLoading(false)
    }
  }

  //handle cancel modal
  const handleCancelModal = () => {
    setAdminFullName('')
    setEmail('')
    setErrorAdminFullName('')
    setErrorEmail('')
    setAvatar(null)
    setSelectedFile(null)
    setOpenModal(false)
  }
  //#endregion

  //#endregion

  //#region add permissions to admin
  //#region permissions data
  const [permissionData, setPermissionData] = useState([])
  const [permissionSelected, setPermissionSelected] = useState([])
  const [selectedAdmin, setSelectedAdmin] = useState(null)
  const [permissionInAdmin, setPermissionInAdmin] = useState([])
  const [permissionNotInAdmin, setPermissionNotInAdmin] = useState([])
  const [errorPermission, setErrorPermission] = useState('')
  //#endregion

  const fetchAllPermissions = async () => {
    try {
      const res = await AdminPermissionsAPI.getAllPermissions(token)
      if (!res) throw new Error('Fetch all permissions failed')
      const data = res.data
      const permissionName = data.map((p) => {
        let result
        try {
          const name = p.permission_name.split('_').join(' ')
          result = name.charAt(0).toUpperCase() + name.slice(1)
        } catch (err) {
          result = p.permission_name
        }
        return result
      })

      const permissionData = data.map((p, index) => ({
        ...p,
        permission_name: permissionName[index]
      }))
      setPermissionData(permissionData)
    } catch (err) {
      setStatus(400)
      setMessageResult(err.message)
    }
  }

  const getAdminByID = async (admin_id) => {
    try {
      const res = await AdminAPI.getAdminByID(admin_id, token)
      if (!res) throw new Error('Get admin by ID failed')
      const data = res.data
      const permissionOfAdmin = data.permission_private.map((p) => {
        let result
        try {
          const name = p.permission_name.split('_').join(' ')
          result = name.charAt(0).toUpperCase() + name.slice(1)
        } catch (err) {
          result = p.permission_name
        }
        return {
          ...p,
          permission_name: result
        }
      })
      const permissionOfAdminID = permissionOfAdmin.map((p) => p.permission_id)
      const permissionNotInAdmin = permissionData.filter((p) => !permissionOfAdminID.includes(p.permission_id))
      const permissionInAdminSelectData = permissionOfAdmin.map((p) => ({
        label: p.permission_name,
        value: p.permission_id
      }))
      const permissionNotInAdminSelectData = permissionNotInAdmin.map((p) => ({
        label: p.permission_name,
        value: p.permission_id
      }))
      setPermissionNotInAdmin(permissionNotInAdminSelectData)
      setPermissionInAdmin(permissionInAdminSelectData)
    } catch (err) {
      if (err.message.includes('401')) {
        setIsLogin(false)
        return
      }
      setStatus(400)
      setMessageResult(err.message)
    }
  }

  //#region add permission modal
  const [openModalAddPermission, setOpenModalAddPermission] = useState(false)

  const handleCancelAddPermission = () => {
    setOpenModalAddPermission(false)
    setSelectedAdmin(null)
    setPermissionSelected([])
    setErrorPermission('')
  }

  const handleAddPermission = async (e) => {
    try {
      e.preventDefault()
      if (!permissionSelected || permissionSelected.length === 0) {
        setErrorPermission('Permission is required')
        return
      }

      if (!selectedAdmin) {
        setErrorPermission('Admin ID is required')
        return
      }

      const data = { permission_ids: permissionSelected }
      const res = await AdminAPI.assignPermissions(selectedAdmin, token, data)
      if (!res) throw new Error('Add permission to admin failed')
      setStatus(200)
      setMessageResult(
        res?.message ? res.message : res?.messages ? res.messages.join('. ') : 'Add permission to admin successfully'
      )
      handleCancelAddPermission()
      fetchAdmins()
    } catch (err) {
      if (err.message.includes('401')) {
        setIsLogin(false)
        return
      }
      setStatus(400)
      setMessageResult(err.message)
    }
  }
  //#endregion

  //#region remove permissions modal
  const [openModalRemovePermission, setOpenModalRemovePermission] = useState(false)

  const handleRemovePermission = async (e) => {
    try {
      e.preventDefault()
      if (!permissionSelected || permissionSelected.length === 0) {
        setErrorPermission('Permission is required')
        return
      }

      if (!selectedAdmin) {
        setErrorPermission('Admin ID is required')
        return
      }

      const data = { permission_ids: permissionSelected }
      const res = await AdminAPI.removePermissions(selectedAdmin, token, data)
      if (!res) throw new Error('Remove permission from admin failed')
      setStatus(200)
      setMessageResult(
        res?.message
          ? res.message
          : res?.messages
            ? res.messages.join('. ')
            : 'Remove permission from admin successfully'
      )
      handleCancelRemovePermission()
      fetchAdmins()
    } catch (err) {
      if (err.message.includes('401')) {
        setIsLogin(false)
        return
      }
      setStatus(400)
      setMessageResult(err.message)
    }
  }

  const handleCancelRemovePermission = () => {
    setOpenModalRemovePermission(false)
    setSelectedAdmin(null)
    setPermissionSelected([])
    setErrorPermission('')
  }

  //#endregion

  //#region status and message result of fetch api call
  useEffect(() => {
    if ([200, 201, 202, 204].includes(status)) {
      openMessage('success', messageResult, 3)
      fetchAdmins()
      handleCancelModal()
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
    <section className='w-full max-w-[100%] h-full'>
      {contextHolder}
      <header className='flex justify-between animate-slideDown'>
        <div className='flex flex-col gap-1'>
          <BreadCrumbs
            items={[
              { title: `Managers` },
              {
                title: (
                  <Link to='/admin/manage-admins' tabIndex='-1'>
                    List of admin ({data?.length})
                  </Link>
                )
              }
            ]}
          />
          <p>List of admin available</p>
        </div>
        <button
          className='h-[46px] px-4 py-3 bg-[rgb(0,143,153)] rounded-lg text-[#FFFFFF] flex gap-2 font-semibold items-center text-sm hover:bg-opacity-80'
          onClick={() => {
            setOpenModal(true)
            setTypeModal('add')
          }}
        >
          Add new
          <Add size='20' />
        </button>
      </header>
      <Modal
        destroyOnClose
        title={
          <span>
            {typeModal} new Admin (fields with <span className='text-[red]'>*</span> are required)
          </span>
        }
        centered
        open={openModal}
        width={800}
        footer={null}
        onCancel={handleCancelModal}
      >
        <div className='modal__content mt-7 relative'>
          <Spin spinning={submitLoading} tip='Loading...' size='large' fullscreen />
          <form action='' method='POST' onSubmit={handleSubmit} autoComplete='off'>
            <div className='AddCategoryForm__row'>
              <div className='AddCategoryForm__group AddCategoryForm__WidthFull relative'>
                <label htmlFor='avatarUrl' className='AddCategoryForm__label mb-1'>
                  Avatar (only *.jpeg, *.jpg, *.png, *.gif and *.svg)
                </label>
                <input
                  type='file'
                  accept='image/jpg, image/jpeg, image/png, image/gif, image/svg'
                  name='avatarUrl'
                  id='avatarUrl'
                  className='hidden'
                  placeholder='Choose file'
                  onChange={handleUploadAvatar}
                  ref={fileInputRef}
                  onClick={() => setErrorFileUpload('')}
                />
                <Tooltip
                  title={errorFileUpload}
                  open={errorFileUpload !== ''}
                  placement='top'
                  overlayStyle={{ maxWidth: 'max-content' }}
                  align={{
                    offset: [0, 100]
                  }}
                >
                  <div className='' onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
                    <button
                      type='button'
                      onClick={() => document.getElementById('avatarUrl').click()}
                      className='AddCategoryForm__uploadBtn'
                      style={{
                        border: Avatar !== null ? 'None' : '3px dashed #e8ebed'
                      }}
                    >
                      {Avatar ? (
                        <>
                          <img src={Avatar} alt='Avatar' className='w-full h-[300px] object-cover' />
                          <CloseCircleOutlined
                            className='absolute top-0 right-0 text-red-500 text-[20px] cursor-pointer'
                            onClick={handleClearAvatar}
                          />
                        </>
                      ) : (
                        <>
                          <CloudUploadOutlined className='text-[green] text-[40px]' />{' '}
                          <span>Drag or upload your image here</span>
                        </>
                      )}
                    </button>
                  </div>
                </Tooltip>
              </div>
            </div>
            <div className='AddCategoryForm__row'>
              <div className='AddCategoryForm__group AddCategoryForm__WidthFull'>
                <label htmlFor='username' className='AddCategoryForm__label'>
                  <span className='text-[red]'>* </span>Full Name
                </label>
                <Tooltip
                  title={errorAdminFullName}
                  open={errorAdminFullName !== ''}
                  placement='bottomLeft'
                  overlayStyle={{ maxWidth: 'max-content' }}
                  align={{
                    offset: [60, -8]
                  }}
                >
                  <input
                    type='text'
                    name='username'
                    id='username'
                    className='AddCategoryForm__input'
                    placeholder='Lam Nhat Minh'
                    value={adminFullName}
                    onChange={(e) => setAdminFullName(e.target.value)}
                    onFocus={() => setErrorAdminFullName('')}
                  />
                </Tooltip>
              </div>
            </div>
            <div className='AddCategoryForm__row'>
              <div className='AddCategoryForm__group AddCategoryForm__WidthFull'>
                <label htmlFor='email' className='AddCategoryForm__label'>
                  <span className='text-[red]'>* </span>Email
                </label>
                <Tooltip
                  title={errorEmail}
                  open={errorEmail !== ''}
                  placement='bottomLeft'
                  overlayStyle={{ maxWidth: 'max-content' }}
                  align={{
                    offset: [60, -8]
                  }}
                >
                  <input
                    type='text'
                    name='email'
                    id='email'
                    className='AddCategoryForm__input'
                    placeholder='minh32405@gmail.com'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setErrorEmail('')}
                  />
                </Tooltip>
              </div>
            </div>
            <div className='AddCategoryForm__row'>
              <div className='AddCategoryForm__groupButton'>
                <button type='submit' className='AddCategoryForm__submitBtn'>
                  Save
                </button>
                <button type='button' className='AddCategoryForm__cancelBtn' onClick={handleCancelModal}>
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </Modal>
      <Modal
        title='Add permission'
        centered
        open={openModalAddPermission}
        width={400}
        footer={false}
        destroyOnClose
        onCancel={handleCancelAddPermission}
      >
        <div className='mt-7 relative'>
          <form action='' method='POST' onSubmit={handleAddPermission} autoComplete='off'>
            <div className='AddCategoryForm__row'>
              <div className='AddCategoryForm__group AddCategoryForm__WidthFull'>
                <label htmlFor='permission_id' className='AddCategoryForm__label'>
                  <span className='text-[red]'>* </span>Permission(Choose 1 upto 5 permissions)
                </label>
                <Tooltip
                  title={errorPermission}
                  open={errorPermission !== ''}
                  placement='bottomLeft'
                  align={{
                    offset: [60, -8]
                  }}
                >
                  <ConfigProvider theme={filterTheme}>
                    <Select
                      maxCount={5}
                      mode='multiple'
                      id='permission_id'
                      suffixIcon={<ArrowDown2 size='15' color='#1D242E' />}
                      allowClear
                      showSearch
                      onClick={() => {
                        setErrorPermission('')
                      }}
                      placeholder='Select a permission'
                      placement='bottomLeft'
                      options={permissionNotInAdmin}
                      filterOption={(input, option) => option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      className='w-[100%] mt-2 min-h-10'
                      onChange={(value) => {
                        if (value !== '' && value !== null && value !== undefined) {
                          setPermissionSelected(value)
                          setPermissionNotInAdmin(permissionNotInAdmin.filter((p) => !value.includes(p.value)))
                        }
                      }}
                    />
                  </ConfigProvider>
                </Tooltip>
              </div>
            </div>
            <div className='AddCategoryForm__row'>
              <div className='AddCategoryForm__groupButton'>
                <button type='submit' className='AddCategoryForm__submitBtn'>
                  Save
                </button>
                <button type='button' className='AddCategoryForm__cancelBtn' onClick={handleCancelAddPermission}>
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </Modal>

      <Modal
        title='Remove permission'
        centered
        open={openModalRemovePermission}
        width={400}
        footer={false}
        destroyOnClose
        onCancel={handleCancelRemovePermission}
      >
        <div className='mt-7 relative'>
          <form action='' method='POST' onSubmit={handleRemovePermission} autoComplete='off'>
            <div className='AddCategoryForm__row'>
              <div className='AddCategoryForm__group AddCategoryForm__WidthFull'>
                <label htmlFor='permission_id' className='AddCategoryForm__label'>
                  <span className='text-[red]'>* </span>Permission(Choose 1 upto 5 permissions)
                </label>
                <Tooltip
                  title={errorPermission}
                  open={errorPermission !== ''}
                  placement='bottomLeft'
                  align={{
                    offset: [60, -8]
                  }}
                >
                  <ConfigProvider theme={filterTheme}>
                    <Select
                      maxCount={5}
                      mode='multiple'
                      id='permission_id'
                      suffixIcon={<ArrowDown2 size='15' color='#1D242E' />}
                      allowClear
                      showSearch
                      onClick={() => {
                        setErrorPermission('')
                      }}
                      placeholder='Select a permission'
                      placement='bottomLeft'
                      options={permissionInAdmin}
                      filterOption={(input, option) => option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      className='w-[100%] mt-2 min-h-10'
                      onChange={(value) => {
                        if (value !== '' && value !== null && value !== undefined) {
                          setPermissionSelected(value)
                          setPermissionInAdmin(permissionInAdmin.filter((p) => !value.includes(p.value)))
                        }
                      }}
                    />
                  </ConfigProvider>
                </Tooltip>
              </div>
            </div>
            <div className='AddCategoryForm__row'>
              <div className='AddCategoryForm__groupButton'>
                <button type='submit' className='AddCategoryForm__submitBtn'>
                  Save
                </button>
                <button type='button' className='AddCategoryForm__cancelBtn' onClick={handleCancelRemovePermission}>
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </Modal>
      <div className='my-5 p-5 bg-[#ffffff] border-[1px] border-solid border-[#e8ebed] rounded-xl animate-slideUp'>
        <div className='flex justify-between items-center'>
          <div className='flex items-center w-[250px] justify-between text-[14px] rounded-[4px] relative'>
            <input
              type='text'
              placeholder='Search for admins'
              className='focus:border-[#1D242E] border-[1px] border-solid border-[#e8ebed] bg-[#fafafa] outline-none bg-transparent w-[100%] py-[15px] px-[15px] rounded-[4px]'
              value={searchValue}
              autoFocus
              onChange={(e) => {
                setSearchValue(e.target.value)
              }}
            />
            <button onClick={() => {}}>
              <SearchNormal size='20' className='absolute top-[50%] right-0 transform -translate-y-1/2 mr-3' />
            </button>
          </div>
          <div className='flex gap-x-[12px] items-center'>
            <ConfigProvider theme={filterTheme}>
              <Select
                suffixIcon={<ArrowDown2 size='15' color='#1D242E' />}
                allowClear
                placeholder='Select role'
                placement='bottomLeft'
                options={roles.map((item) => {
                  switch (item) {
                    case 'Admin':
                      return { label: 'Admin', value: 1 }
                    case 'Super Admin':
                      return { label: 'Super Admin', value: 2 }
                  }
                })}
                value={selectedRoles}
                className='w-[250px] h-[50px]'
                onChange={(value) => {
                  setSelectedRoles(value)
                }}
              />
            </ConfigProvider>
          </div>
          <div className='flex gap-x-[12px] items-center'>
            <ConfigProvider theme={filterTheme}>
              <Select
                suffixIcon={<ArrowDown2 size='15' color='#1D242E' />}
                allowClear
                placeholder='Select status'
                placement='bottomLeft'
                options={adminStatus.map((item) => {
                  switch (item) {
                    case 'Active':
                      return { label: 'Active', value: 0 }
                    case 'Deleted':
                      return { label: 'Deleted', value: 1 }
                  }
                })}
                value={selectedAdminStatus}
                className='w-[250px] h-[50px]'
                onChange={(value) => {
                  setSelectedAdminStatus(value)
                }}
              />
            </ConfigProvider>
          </div>
          <div className='flex gap-x-[12px] items-center '>
            <ConfigProvider theme={filterTheme}>
              <RangePicker
                className='w-[250px] h-[50px]'
                format={'DD/MM/YYYY'}
                onChange={(date, dateString) => {
                  setSelectedFrom(dateString[0])
                  setSelectedTo(dateString[1])
                }}
              />
            </ConfigProvider>
          </div>
        </div>
        <div className='pt-4'>
          <AdminTable
            columns={columns}
            rowKey='admin_id'
            data={filterData}
            tableParams={tableParams}
            tableStyles={{ width: '1200px', minHeight: '350px', maxHeight: '450px', backgroundColor: '#ffffff' }}
            scroll={{ y: '300px' }}
            loading={loading}
            handleTableChange={handleTableChange}
            pageSizeOptionsParent={['8', '10', '20', '50']}
            paginationTable={{
              position: ['none'],
              ...tableParams.pagination
            }}
          />
        </div>
      </div>
    </section>
  )
}

export default Admin
