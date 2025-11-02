import React from 'react'
import { useState } from 'react'
import Footer from '../../../Component/Footer'
import Header from '../../../Pages/User/HomeUser/Component/HeaderUser/Header'
export default function MainLayout({ children }) {
  const [openCategory, setopenCategory] = useState(false)

  return (
    <div>
      <Header />

      {children}

      <Footer />
    </div>
  )
}
