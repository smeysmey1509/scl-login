import './Sidebar.css'
import DashboardSodexLogo from '../../assets/DashbaordSodexLogo.png'

const Sidebar = () => {
    return (
        <div className='scl--sidebar-container'>
            <div className='scl--sidebar-co-container'>
                <div className='scl--sidebar-logo'>
                    <img src={DashboardSodexLogo} alt='DashboardSodexLogo' />
                </div>
                <div className='scl--sidebar-menu'>
                    <div className='scl--sidebar-overview'>
                        <span>Home</span>
                        <div className='scl--sidebar-overview-box'>
                            <button>Overview</button>
                        </div>
                    </div>
                    <p>--------------------</p>
                    <div className='scl--sidebar-modules'>2</div>
                </div>
            </div>
        </div>
    )
}

export default Sidebar;