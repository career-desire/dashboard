import { useContext, useEffect, useState } from "react";
import "../styles/Home.css";
import { AuthContext } from "../context/AuthContext.jsx";
import DashNav from "../layout/DashNav.jsx";
import DashBody from "../layout/DashBody.jsx";
import DashResume from "../layout/DashResume.jsx";
import DashCoverLetter from "../layout/DashCoverLetter.jsx";

const Home = () => {
    const { user } = useContext(AuthContext);
    const [navClose, setNavClose] = useState();
    const [widthSize, setWidthSize] = useState(window.innerWidth);
    const [activeTab, setAvtiveTab] = useState("default")

    useEffect(() => {
        const handleWidth = () => setWidthSize(window.innerWidth);
        window.addEventListener("resize", handleWidth);

        setNavClose(widthSize < 1000);

        return () => {
            window.removeEventListener("resize", handleWidth);
        };
    }, [widthSize]);

    return (
        <div className="home-container">

            <DashNav navClose={navClose} setNavClose={setNavClose} user={user} setAvtiveTab={setAvtiveTab} widthSize={widthSize} />

            <div className={`home-body-container ${navClose ? "close" : "open"}`}>

                {activeTab === "default" &&
                    <DashBody user={user} />
                }

                {activeTab === "resume" &&
                    <DashResume navClose={navClose} user={user} />
                }

                {activeTab === "cover-letter" &&
                    <DashCoverLetter navClose={navClose} user={user} />
                }
                
            </div>

        </div>
    );
};

export default Home;
