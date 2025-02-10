import Login from '@/pages/Login'
import Signup from '@/pages/Signup'
import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

const AppRoutes = () => {
  return (
    <BrowserRouter>
    <Routes>
        <Route path="/user/signup" element={<Signup />} />
        <Route path="/user/login" element={<Login />} />
    </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes