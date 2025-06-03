import { lazy } from 'react'
import './App.css'
import {Routes, Route} from "react-router-dom";
const LoginPage =  lazy(() => import('./pages/Login/LoginPage'))
const Home = lazy(() => import('../src/pages/Home/Home.tsx'))
const Dashboard = lazy(() => import('../src/pages/Dashboard/Dashboard.tsx'))

function App() {

  return (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  )
}

export default App
