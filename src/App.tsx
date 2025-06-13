import {lazy} from 'react'
import './App.css'
import {Routes, Route} from "react-router-dom";
import Loading from "./components/Loading/Barloader/Loading.tsx";

const LoginPage = lazy(() => import('./pages/Login/LoginPage'))
const Home = lazy(() => import('../src/pages/Home/Home.tsx'))
const Dashboard = lazy(() => import('../src/pages/Dashboard/Dashboard.tsx'))

function App() {

    return (
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/login/otp" element={<LoginPage/>}/>
            <Route path="/dashboard" element={<Dashboard/>}/>
            <Route path="loading" element={<Loading/>}/>
        </Routes>
    )
}

export default App
