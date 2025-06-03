import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";
import { AuthContext } from "../context/AuthContext.jsx";
import { useResumeData } from "../context/ResumeContext.jsx";
import NotFound from "/images/not-found.svg";
import AtsIcon from "/images/icons/ats-ico.png";
import ResumePreview from "/images/cd-resume-preview.png";
import CoverLetterPreview from "/images/cd-cover-letter-preview.png";
import CoverLetterIcon from "/images/icons/cover-letter-ico.png";
import Warning from "../layout/Warning.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCircleUser, faFolderOpen, faHouse, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { CoverLetterContext } from "../context/CoverLetterContext.jsx";
import { AlertContext } from "../context/AlertContext.jsx";
import { deleteResume } from "../services/resumeService.js";
import { deleteCoverLetter } from "../services/coverLetterService.js";

const Home = () => {
    const { allResume, fetchResumes } = useResumeData();
    const { allCoverLetter, fetchCoverLetter } = useContext(CoverLetterContext);
    const { user } = useContext(AuthContext);
    const { setAlert, setAlertMessage } = useContext(AlertContext);
    const [navClose, setNavClose] = useState();
    const [resumeToDelete, setResumeToDelete] = useState(null);
    const [coverLetterToDelete, setCoverLetterToDelete] = useState(null);
    const [widthSize, setWidthSize] = useState(window.innerWidth);

    useEffect(() => {
        const handleWidth = () => setWidthSize(window.innerWidth);
        window.addEventListener("resize", handleWidth);

        setNavClose(widthSize < 1000);

        return () => {
            window.removeEventListener("resize", handleWidth);
        };
    }, [widthSize]);

    const handleDeleteResume = async (index) => {
        const resume = allResume[index];
        if (!resume) return;

        try {
            await deleteResume(resume._id);
            setAlertMessage("Resume deleted successfully");
            setAlert("success");
            fetchResumes();
        } catch (error) {
            console.error("Error deleting resume:", error);
            setAlertMessage("Failed to delete resume");
            setAlert("failed");
        }

        setResumeToDelete(null);
    };

    const handleDeleteCoverLetter = async (index) => {
        const coverLetter = allCoverLetter[index];
        if (!coverLetter) return;

        try {
            await deleteCoverLetter(coverLetter._id);
            setAlertMessage("Cover letter deleted successfully");
            setAlert("success");
            fetchCoverLetter();
        } catch (error) {
            console.error("Error deleting cover letter:", error);
            setAlertMessage("Failed to delete cover letter");
            setAlert("failed");
        }

        setCoverLetterToDelete(null);
    };

    return (
        <div className="home-container">
            <div className={"home-nav-container"} id={navClose ? "home-nav-close" : "home-nav-open"}>
                <div className="home-nav-icon" onClick={() => setNavClose(!navClose)}>
                    {navClose ? ">" : "<"}
                </div>
                <div className="home-nav">
                    <div className="profile-container">
                        <FontAwesomeIcon icon={faCircleUser} className="profile-img" />
                        <p>{user?.name || "User"}</p>
                    </div>
                    <div className="home-nav-link">
                        <FontAwesomeIcon icon={faHouse} />
                        <Link to="https://careerdesire.in/" target="_blank">Home</Link>
                    </div>
                    <div className="home-nav-link">
                        <img src={AtsIcon} alt="ats icon" />
                        <Link to="https://valorald.com/" target="_blank">Check ATS Score</Link>
                    </div>
                    <div className="home-nav-link">
                        <img src={CoverLetterIcon} alt="resume icon" />
                        <Link to="https://resume.careerdesire.in" target="_blank">Resume builder</Link>
                    </div>
                    <div className="home-nav-link">
                        <img src={CoverLetterIcon} alt="cover letter icon" />
                        <Link to="https://cover-letter.careerdesire.in" target="_blank">Cover letter builder</Link>
                    </div>
                    <div className="home-nav-link">
                        <FontAwesomeIcon icon={faFolderOpen} />
                        <Link to="/">Files</Link>
                    </div>
                </div>
            </div>

            <div className="home-body-container" id={navClose ? "home-body-close" : "home-body-open"}>
                <div className="home-header">
                    <h3>
                        Hey <span>{user?.name || "User"},</span>
                        {` Welcome back! You have ${allResume.length} document${allResume.length !== 1 ? "s" : ""}.`}
                    </h3>
                    <div className="create-btns">
                        <div className="create-btn">
                            <p><span>+</span> Create New</p>
                            <p className="dropdown"><FontAwesomeIcon icon={faCaretDown} /></p>
                        </div>
                        <div className="create-new-options">
                            <p><Link to="https://resume.careerdesire.in" target="_blank">Resume</Link></p>
                            <p><Link to="https://cover-letter.careerdesire.in" target="_blank">Cover Letter</Link></p>
                        </div>
                    </div>
                </div>

                <div className="home-body">
                    {allResume.length > 0 && (
                        <div className="preview-container">
                            <h2>My Resume</h2>
                            <div className="preview">
                                {allResume.map((resume, index) => (
                                    <div key={index}>
                                        <img src={ResumePreview} alt="Career desire resume icon" className="preview-img" />
                                        <p>{`Resume ${index + 1}`}</p>
                                        <div className="preview-options">
                                            <Link to={`${import.meta.env.VITE_RESUME_BUILDER_URL}/${resume._id}`} target="_blank">
                                                <p><FontAwesomeIcon icon={faPen} /></p>
                                            </Link>
                                            <p className="delete-resume" onClick={() => setResumeToDelete(index)}>
                                                <FontAwesomeIcon icon={faTrash} />
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {allCoverLetter.length > 0 && (
                        <div className="preview-container">
                            <h2>My Cover Letter</h2>
                            <div className="preview">
                                {allCoverLetter.map((coverLetter, index) => (
                                    <div key={index}>
                                        <img src={CoverLetterPreview} alt="Career desire cover letter icon" className="preview-img" />
                                        <p>{`Cover Letter ${index + 1}`}</p>
                                        <div className="preview-options">
                                            <Link to={`${import.meta.env.VITE_COVER_LETTER_BUILDER_URL}/${coverLetter._id}`} target="_blank">
                                                <p><FontAwesomeIcon icon={faPen} /></p>
                                            </Link>
                                            <p className="delete-resume" onClick={() => setCoverLetterToDelete(index)}>
                                                <FontAwesomeIcon icon={faTrash} />
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {(allResume.length < 1 && allCoverLetter.length < 1) && (
                        <div className="not-found">
                            <img src={NotFound} alt="Document not found" />
                        </div>
                    )}

                    {resumeToDelete !== null && (
                        <Warning
                            warnText="Are you sure you want to delete this resume?"
                            actionTextOne="Yes"
                            actionOne={() => handleDeleteResume(resumeToDelete)}
                            cancelText="No"
                            noAction={() => setResumeToDelete(null)}
                        />
                    )}

                    {coverLetterToDelete !== null && (
                        <Warning
                            warnText="Are you sure you want to delete this cover letter?"
                            actionTextOne="Yes"
                            actionOne={() => handleDeleteCoverLetter(coverLetterToDelete)}
                            cancelText="No"
                            noAction={() => setCoverLetterToDelete(null)}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
