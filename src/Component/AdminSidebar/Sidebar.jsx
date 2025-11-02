import { useAuth } from '../../context/app.context'
import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { SideBarItem } from './Component/SideBarItem'
import {
  ArchiveBox,
  ArrowDown2,
  More,
  Bill,
  Element,
  Hospital,
  MedalStar,
  ReceiptEdit,
  Setting2,
  User,
  UserAdd,
  UserSquare,
  Logout,
  Car,
  Star
} from 'iconsax-react'
import './Sidebar.css'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Sidebar = forwardRef((_, ref) => {
  const navigate = useNavigate()
  const { isProfile, logout } = useAuth()
  const location = useLocation()

  //#region info admin
  const [adminFullName, setAdminFullName] = useState('')
  const [email, setEmail] = useState('')
  const [Avatar, setAvatar] = useState(null)
  const [adminRole, setAdminRole] = useState('')
  //#endregion

  //#region nav and subNav
  //nav selected and active state change
  const [selectedId, setSelectedId] = useState(null)
  const [activeNav, setActiveNav] = useState(null)

  //subNav data
  const Inventory = [
    { id: 'products', name: 'Products' },
    { id: 'categories', name: 'Categories' }
  ]

  const Users = [
    { id: 'manage-users', name: 'Users' },
    { id: 'manage-admins', name: 'Admin' },
    { id: 'roles', name: 'Roles' }
  ]

  //show subNav
  const [showInventory, setShowInventory] = useState(false)
  const [showUser, setShowUser] = useState(false)
  const [maxHeightProduct, setMaxHeightProduct] = useState('0px')
  const [maxHeightUser, setMaxHeightUser] = useState('0px')
  const productRef = useRef(null)
  const userRef = useRef(null)

  //handle nav and subNav click
  const handleNavClick = (navId) => {
    setActiveNav(navId)
    setShowInventory(navId === 'inventory' ? !showInventory : false)
    setShowUser(navId === 'users' ? !showUser : false)
  }

  const handleSubNavClick = (itemId) => {
    const subNavIDProducts = ['products', 'categories']
    const subNavIDUsers = ['manage-users', 'manage-admins', 'roles']
    setSelectedId(itemId)
    if (subNavIDUsers.includes(itemId)) setShowUser(true)
    if (subNavIDProducts.includes(itemId)) setShowInventory(true)
    setActiveNav(null)
  }

  useImperativeHandle(ref, () => ({
    handleNavClick,
    handleSubNavClick,
    setSelectedId
  }))

  useEffect(() => {
    if (showInventory) {
      setMaxHeightProduct(`${productRef.current.scrollHeight}px`)
    } else {
      setMaxHeightProduct('0px')
    }
  }, [showInventory])

  useEffect(() => {
    if (showUser) {
      setMaxHeightUser(`${userRef.current.scrollHeight}px`)
    } else {
      setMaxHeightUser('0px')
    }
  }, [showUser])

  //handle subNav active when refresh page
  useEffect(() => {
    try {
      const path = location.pathname
      const navID = path.split('/')[2]
      const subNavID = ['products', 'categories', 'Users', 'manage-admins', 'manage-users', 'roles']
      if (subNavID.includes(navID)) {
        if (navID === 'products' || navID === 'categories' || navID === 'orders') {
          setActiveNav(null)
          setShowInventory(true)
          setSelectedId(navID)
        } else if (navID === 'manage-admins' || navID === 'manage-users' || navID === 'roles') {
          setActiveNav(null)
          setShowUser(true)
          setSelectedId(navID)
        }
      } else {
        if (navID !== 'comment_review') handleNavClick(navID)
        else handleNavClick('review')
      }
    } catch (err) {}
  }, [])
  //#endregion

  //#region admin profile
  //#region fetch admin profile
  const fetchAdminProfile = async () => {
    try {
      const data = isProfile
      if (!data) {
        toast.error('Unauthorized or token expired or invalid. Please login again!')
        logout()
        navigate('/admin/login')
        return
      }
      setAdminFullName(data.username)
      setEmail(data.email)
      setAvatar(data.avatarUrl)
      setAdminRole(data.role ? data.role.charAt(0).toUpperCase() + data.role.slice(1) : 'admin')
    } catch (err) {}
  }

  useEffect(() => {
    fetchAdminProfile()
  }, [isProfile])

  //#endregion

  //#region show admin profile options
  const [showProfileOptions, setShowProfileOptions] = useState(false)
  const MoreRef = useRef(null)
  const ProfileSettingRef = useRef(null)
  let closeTimeout

  //handle show profile options
  const handleMouseEnterShowProfile = () => {
    clearTimeout(closeTimeout)
    setShowProfileOptions(true)
  }

  const handleMouseLeaveCloseProfile = () => {
    closeTimeout = setTimeout(() => {
      setShowProfileOptions(false)
    }, 200)
  }

  useEffect(() => {
    return () => {
      clearTimeout(closeTimeout)
    }
  }, [])

  //handle click profile options
  const handleMyProfileClick = () => {
    setShowProfileOptions(false)
    handleNavClick('setting')
  }

  const handleLogoutClick = () => {
    logout()
    navigate('/admin/login')
  }
  //#endregion
  return (
    <nav className='navBar w-[256px] bg-[#283342] text-[#ffffff] h-[100vh] overflow-y-auto overflow-x-hidden'>
      <header className='sticky top-0 left-0 w-full z-10'>
        <div className='bg-[#1d242e] py-[9px] px-[24px] flex items-center w-full h-[60px] justify-between gap-4'>
          <img
            src='/assets/images/Logo_Pbl6.png'
            alt='Admin-homepage-logo'
            className='w-[2.813rem] h-[2.813rem] object-contain'
          />
          <span className='w-full font-semibold text-sm'>MediCare Central</span>
        </div>
        <div className='h-[102px] flex justify-between items-center px-[25px] py-[30px] bg-[#283342] w-full gap-4'>
          <div className='flex relative w-full gap-4'>
            <img
              src={Avatar || '/assets/images/default-avatar.png'}
              alt='no image'
              className='w-[2.813rem] h-[2.813rem] rounded object-cover'
              onError={(e) => {
                e.target.onerror = null
                e.target.src = '/assets/images/default-avatar.png'
              }}
            />
            <span className='inline-block absolute w-4 h-4 rounded-[50%] bg-[#2ed47a] bottom-1 left-9 animate-ping'></span>
            <span className='inline-block absolute w-4 h-4 rounded-[50%] bg-[#2ed47a] bottom-1 left-9 border border-solid border-[#2e3744]'></span>
            <div className='text-xs flex flex-col justify-between items-start w-[6.688rem]'>
              <span className='text-sm whitespace-nowrap overflow-hidden text-ellipsis w-full'>{adminFullName}</span>
              <span className='text-[#d6b80d]'>{adminRole}</span>
            </div>
          </div>
          <More
            ref={MoreRef}
            size={20}
            color='#ffffff'
            className='cursor-pointer'
            onMouseEnter={handleMouseEnterShowProfile}
            onMouseLeave={handleMouseLeaveCloseProfile}
          />
          <div
            ref={ProfileSettingRef}
            className='w-32 h-max bg-[#ffffff] absolute right-4 top-[85%] flex flex-col box-border rounded-md text-xs after:content-[""] after:absolute after:bottom-[85%] after:right-2 after:w-4 after:h-4 after:bg-[#ffffff] after:rotate-45 after:rounded-tl-md after:shadow-[-2px_-2px_0_0_#ffffff] border border-solid border-[#1D242E] origin-[87.8%_0%] transition-all duration-500 ease'
            onMouseEnter={handleMouseEnterShowProfile}
            onMouseLeave={handleMouseLeaveCloseProfile}
            style={{
              opacity: showProfileOptions ? 1 : 0,
              visibility: showProfileOptions ? 'visible' : 'hidden',
              transform: showProfileOptions ? 'scale(1)' : 'scale(0)'
            }}
          >
            <Link to='/admin/setting'>
              <button
                className='w-full px-4 py-2.5 flex gap-3 text-[#1D242E] items-center justify-start border-b border-b-solid border-b-[rgba(29,36,46,0.3)]'
                type='button'
                onClick={handleMyProfileClick}
              >
                <UserSquare size={20} />
                <span className='select-none'>My Profile</span>
              </button>
            </Link>
            <button
              className='w-full px-4 py-2.5 flex gap-3 text-[red] items-center justify-start'
              type='button'
              onClick={handleLogoutClick}
            >
              <Logout size={20} />
              <span className='select-none'>LogOut</span>
            </button>
          </div>
        </div>
      </header>
      <div className='navBar__menu flex flex-col text-[14px] min-w-[256px]'>
        <NavLink
          to='/admin/overview'
          className={activeNav === 'overview' ? 'bg-[#008f99]' : ''}
          onClick={() => handleNavClick('overview')}
        >
          <SideBarItem name='Overview' iconName={<Element className='w-6' />} />
        </NavLink>
        <NavLink
          to='/admin/inventory'
          className={activeNav === 'inventory' ? 'bg-[#008f99]' : ''}
          onClick={() => {
            handleNavClick('inventory')
            setSelectedId(null)
          }}
        >
          <SideBarItem
            name='Inventory'
            iconName={<ArchiveBox className='w-6' />}
            arrowIcon={
              <ArrowDown2
                size={16}
                color='#ffffff'
                onClick={() => {
                  handleNavClick('inventory')
                  setSelectedId(null)
                }}
              />
            }
          />
        </NavLink>
        {
          <div
            ref={productRef}
            className={`bg-[#283342] overflow-hidden transition-[max-height] duration-[0.5s] ease-in-out`}
            style={{
              maxHeight: maxHeightProduct
            }}
          >
            <ul>
              {Inventory.map((item) => (
                <li
                  key={item.id}
                  className=''
                  onClick={() => {
                    handleSubNavClick(item.id)
                  }}
                  style={{ backgroundColor: item.id === selectedId ? '#008f99' : '' }}
                >
                  <NavLink
                    to={`/admin/${item.id}`}
                    className='pl-[62px] px-[24px] h-[46px] flex items-center justify-start cursor-pointer'
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        }
        <NavLink
          to='/admin/orders'
          className={activeNav === 'orders' ? 'bg-[#008f99]' : ''}
          onClick={() => {
            handleNavClick('orders')
            setSelectedId(null)
          }}
        >
          <SideBarItem name='Orders' iconName={<Bill className='w-6' />} />
        </NavLink>

        <NavLink
          to='/admin/deliveries'
          className={activeNav === 'delivery' ? 'bg-[#008f99]' : ''}
          onClick={() => handleNavClick('delivery')}
        >
          <SideBarItem name='Delivery Methods' iconName={<Car className='w-6' />} />
        </NavLink>
        <NavLink
          to='/admin/imports'
          className={activeNav === 'imports' ? 'bg-[#008f99]' : ''}
          onClick={() => handleNavClick('imports')}
        >
          <SideBarItem name='Imports' iconName={<ReceiptEdit className='w-6' />} />
        </NavLink>
        <NavLink
          to='/admin/suppliers'
          className={activeNav === 'suppliers' ? 'bg-[#008f99]' : ''}
          onClick={() => handleNavClick('suppliers')}
        >
          <SideBarItem name='Suppliers' iconName={<UserAdd className='w-6' />} />
        </NavLink>
        <NavLink
          to='/admin/brands'
          className={activeNav === 'brands' ? 'bg-[#008f99]' : ''}
          onClick={() => handleNavClick('brands')}
        >
          <SideBarItem name='Brands' iconName={<MedalStar className='w-6' />} />
        </NavLink>
        <NavLink
          className={activeNav === 'users' ? 'bg-[#008f99]' : ''}
          onClick={() => {
            handleNavClick('users')
            setSelectedId(null)
          }}
        >
          <SideBarItem
            name='Managers'
            iconName={<User className='w-6' />}
            arrowIcon={
              <ArrowDown2
                size={16}
                color='#ffffff'
                onClick={() => {
                  handleNavClick('users')
                  setSelectedId(null)
                }}
              />
            }
          />
        </NavLink>
        {
          <div
            ref={userRef}
            className={`bg-[#283342] overflow-hidden transition-[max-height] duration-[0.5s] ease-in-out`}
            style={{
              maxHeight: maxHeightUser
            }}
          >
            <ul>
              {Users.filter((item) => {
                if (adminRole.toLowerCase() === 'admin') {
                  return item.id === 'manage-users'
                } else if (adminRole.toLowerCase() === 'superadmin') {
                  return item.id === 'manage-users' || item.id === 'manage-admins'
                }
                return item
              }).map((item) => {
                return (
                  <li
                    key={item.id}
                    onClick={() => {
                      handleSubNavClick(item.id)
                    }}
                    style={{
                      backgroundColor: item.id === selectedId ? '#008f99' : ''
                    }}
                  >
                    <NavLink
                      to={`/admin/${item.id}`}
                      className='pl-[62px] px-[24px] h-[46px] flex items-center justify-start cursor-pointer'
                    >
                      {item.name}
                    </NavLink>
                  </li>
                )
              })}
            </ul>
          </div>
        }

        <NavLink
          to='/admin/disease'
          className={activeNav === 'disease' ? 'bg-[#008f99]' : ''}
          onClick={() => handleNavClick('disease')}
        >
          <SideBarItem name='Diseases' iconName={<Hospital className='w-6' />} />
        </NavLink>
        <NavLink
          to='/admin/comment_review'
          className={activeNav === 'review' ? 'bg-[#008f99]' : ''}
          onClick={() => handleNavClick('review')}
        >
          <SideBarItem name='Reviews' iconName={<Star className='w-6' />} />
        </NavLink>
        <NavLink
          to='/admin/setting'
          className={activeNav === 'setting' ? 'bg-[#008f99]' : ''}
          onClick={() => handleNavClick('setting')}
        >
          <SideBarItem name='Setting' iconName={<Setting2 className='w-6' />} />
        </NavLink>
      </div>
    </nav>
  )
})

export default Sidebar
