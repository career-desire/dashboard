import { faAngleLeft, faAngleRight, faCircleUser, faFile, faFolderOpen, faGlobe, faHouse, faPrint } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom';

function DashNav({ navClose, setNavClose, user, setAvtiveTab, widthSize }) {

    const isMobile = 1000

    const navItems = [
        { icon: faHouse, label: "Home", tab: "default" },
        { icon: faPrint, label: "Check ATS Score", path: "https://valorald.com" },
        { icon: faFile, label: "Resume builder", tab: "resume" },
        { icon: faFile, label: "Cover letter builder", tab: "cover-letter" },
        { icon: faFolderOpen, label: "Files", path: "/" },
        { icon: faGlobe, label: "Blogs", path: "/" },
    ]

    const handleNavigation = (activeTab) => {
        setAvtiveTab(activeTab)
        if (widthSize < isMobile) {
            setNavClose(prev => !prev)
        }
    }

    return (
        <div className={`home-nav-container ${navClose ? "close" : "open"}`}>
            <div className="nav-menu-icon" onClick={() => setNavClose(prev => !prev)}>
                <FontAwesomeIcon icon={navClose ? faAngleRight : faAngleLeft} />
            </div>
            <div className="home-nav">
                <div className="profile-container">
                    <FontAwesomeIcon icon={faCircleUser} className="profile-img" />
                    <p>{user?.name || "User"}</p>
                </div>
                {navItems.map(({ icon, label, tab, path }) => 
                    path ? (
                        <Link to={path} className="home-nav-link" key={label}>
                            <FontAwesomeIcon icon={icon} />
                            {label}
                        </Link>
                    ) : (
                        <div
                            className='home-nav-link'
                            onClick={() => handleNavigation(tab)}
                            key={label}
                        >
                            <FontAwesomeIcon icon={icon} />
                            {label}
                        </div>
                    )
                )}
            </div>
            <div className="upgrade-option" id={navClose ? "upgrade-option-close" : ""}>
                <button className="upgrade-btn">
                    Upgrade to Pro
                </button>
            </div>
        </div>
    )
}

export default DashNav