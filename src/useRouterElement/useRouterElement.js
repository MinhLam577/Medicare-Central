import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import React, { useContext } from 'react'
import {
  AdminVerifyEmail,
  AdminMainLayout,
  AdminProducts,
  AdminCategories,
  AdminAddProduct,
  AdminEditProduct,
  AdminViewProduct,
  AdminBrands,
  AdminManagement,
  AdminSetting,
  AdminImports,
  AdminDetailImport,
  AdminOverview,
  AdminLogin,
  AdminSuppliers,
  AdminCustomer,
  AdminResetPassword,
  AdminOrders,
  AdminIllness,
  AdminAddIllness,
  AdminUpdateIllness,
  AdminViewOrder,
  AdminDelivery,
  AdminReviewComment,
  AdminInventory,
  AdminManageRole
} from '../Component'
import { AuthContext } from '../context/app.context.jsx'
import NotPermitted from '../Component/NotPermitted/NotPermitted.jsx'

import NotFound from '../Pages/User/NotFound/NotFound.jsx'
export default function useRouterElement() {
  const { isAuthenticated, isProfile } = useContext(AuthContext)
  const role = isProfile?.role ?? '' // Giả sử profile có field 'role'
  const OnlyAdmin = () => {
    if (!isAuthenticated) return <Navigate to='/admin/login' replace />
    if (role !== 'admin') {
      return (
        <AdminMainLayout>
          <NotPermitted />
        </AdminMainLayout>
      )
    }
    return <Outlet />
  }
  return useRoutes([
    // 1. Redirect root
    { path: '/', element: <Navigate to='/admin/overview' replace /> },
    {
      path: '/admin/login',
      element: <AdminLogin />
    },
    // 2. Toàn bộ khu admin (đã bảo vệ)
    {
      path: '/admin',
      element: <OnlyAdmin />,
      children: [
        { index: true, element: <Navigate to='/admin/overview' replace /> },

        // Layout chung
        {
          element: (
            <AdminMainLayout scrollBar='simpleBar'>
              <Outlet />
            </AdminMainLayout>
          ),
          children: [
            { path: 'overview', element: <AdminOverview /> },
            { path: 'inventory', element: <AdminInventory /> },

            // Products
            {
              path: 'products',
              element: <Outlet />,
              children: [
                { index: true, element: <AdminProducts /> },
                { path: 'add-product', element: <AdminAddProduct /> },
                { path: 'update/:productID', element: <AdminEditProduct /> },
                { path: ':productID', element: <AdminViewProduct /> }
              ]
            },

            { path: 'categories', element: <AdminCategories /> },
            { path: 'manage-admins', element: <AdminManagement /> },
            { path: 'roles', element: <AdminManageRole /> },
            { path: 'manage-users', element: <AdminCustomer /> },

            // Orders
            {
              path: 'orders',
              element: <Outlet />,
              children: [
                { index: true, element: <AdminOrders /> },
                { path: ':id', element: <AdminViewOrder /> }
              ]
            },

            { path: 'deliveries', element: <AdminDelivery /> },

            // Imports
            {
              path: 'imports',
              element: <Outlet />,
              children: [
                { index: true, element: <AdminImports /> },
                { path: ':id', element: <AdminDetailImport /> }
              ]
            },

            { path: 'suppliers', element: <AdminSuppliers /> },
            { path: 'brands', element: <AdminBrands /> },
            { path: 'comment_review', element: <AdminReviewComment /> },

            // Disease
            {
              path: 'disease',
              element: <Outlet />,
              children: [
                { index: true, element: <AdminIllness /> },
                { path: 'add', element: <AdminAddIllness /> },
                { path: 'update/:id', element: <AdminUpdateIllness /> }
              ]
            },

            { path: 'setting', element: <AdminSetting /> }
          ]
        }
      ]
    },

    // 3. 404
    {
      path: '*',
      element: (
        <AdminMainLayout>
          <NotFound />
        </AdminMainLayout>
      )
    }
  ])
}
