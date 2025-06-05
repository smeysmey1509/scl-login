import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import Content from '../../components/Content/Content';
import './Dashboard.css'

const Dashboard = () => {
    return (
        <div className='scl--dashboard-container'>
            <Sidebar />
            <div className='scl--dashboard-co-container'>
                <Header />
                <Content />
            </div>
        </div>
    )
}

export default Dashboard;