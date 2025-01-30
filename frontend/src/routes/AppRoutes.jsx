import Login from '@/pages/Login'
import Logout from '@/pages/Logout'
import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

const AppRoutes = () => {
  return (
    <BrowserRouter>
    <Routes>
        <Route path="/user/logout" element={<Logout />} />
        <Route path="/user/login" element={<Login />} />
    </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes