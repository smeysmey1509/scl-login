import { lazy, useState } from 'react'
import './App.css'
const LoginPage =  lazy(() => import('./pages/Login/LoginPage'))

function App() {

  return (
    <>
      <LoginPage />
    </>
  )
}

export default App
