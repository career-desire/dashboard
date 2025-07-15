import React, { useContext, useState } from 'react';
import { AlertContext } from '../context/AlertContext';
import ResumePreview from "/images/cd-resume-preview.png";
import NotFound from "/images/not-found.svg";
import { useResumeData } from "../context/ResumeContext.jsx";
import { deleteResume } from "../services/resumeService.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { faLink, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import Warning from './Warning.jsx';

function DashResume() {
    const { allResume, fetchResumes } = useResumeData();
    const [resumeToDelete, setResumeToDelete] = useState(null);
    const { setAlert, setAlertMessage } = useContext(AlertContext);

    const handleDeleteResume = async (index) => {
        const resume = allResume[index];
        if (!resume) return;

        try {
            await deleteResume(resume._id);
            setAlertMessage("Resume deleted successfully.");
            setAlert("success");
            fetchResumes();
        } catch (error) {
            console.error("Error deleting resume:", error);
            setAlertMessage("Unable to delete the resume. Please try again.");
            setAlert("failed");
        }

        setResumeToDelete(null);
    };

    const handleResumeCopyLink = (id) => {
        const shareURL = `${import.meta.env.VITE_RESUME_BUILDER_URL}/view-resume/${id}`;
        navigator.clipboard.writeText(shareURL).then(() => {
            setAlertMessage("Resume link copied to clipboard.");
            setAlert("success");
        }).catch(() => {
            setAlertMessage("Failed to copy the resume link.");
            setAlert("failed");
        });
    };

    return (
        <>
            <div className="home-header">
                <h3>
                    {`You currently have ${allResume?.length} resume${allResume.length > 1 ? "s" : ""}.`}
                </h3>
                <Link to="https://resume.careerdesire.in" target="_blank">
                    <div className="create-btn">
                        <p><span>+</span> Create New Resume</p>
                    </div>
                </Link>
            </div>

            <div className="home-body">
                {allResume.length > 0 && (
                    <div className="preview-container">
                        <h2>Your Resumes</h2>
                        <div className="preview">
                            {allResume.map((resume, index) => (
                                <div key={index}>
                                    <img src={ResumePreview} alt="Resume preview" className="preview-img" />
                                    <p>{`Resume ${index + 1}`}</p>
                                    <div className="preview-options">
                                        <Link to={`${import.meta.env.VITE_RESUME_BUILDER_URL}/resume/${resume._id}`} target="_blank">
                                            <p title="Edit Resume"><FontAwesomeIcon icon={faPen} /></p>
                                        </Link>
                                        <p title="Copy Shareable Link" onClick={() => handleResumeCopyLink(resume._id)}>
                                            <FontAwesomeIcon icon={faLink} />
                                        </p>
                                        <p title="Delete Resume" className="delete-resume" onClick={() => setResumeToDelete(index)}>
                                            <FontAwesomeIcon icon={faTrash} />
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {allResume.length < 1 && (
                    <div className="not-found">
                        <img src={NotFound} alt="No resumes found" />
                    </div>
                )}

                {resumeToDelete !== null && (
                    <Warning
                        warnText="Are you sure you want to delete this resume?"
                        actionTextOne="Yes, Delete"
                        actionOne={() => handleDeleteResume(resumeToDelete)}
                        cancelText="Cancel"
                        noAction={() => setResumeToDelete(null)}
                    />
                )}
            </div>
        </>
    );
}

export default DashResume;