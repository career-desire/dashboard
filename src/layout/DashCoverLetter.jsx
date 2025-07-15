import React, { useContext, useState } from 'react'
import NotFound from "/images/not-found.svg";
import Warning from "../layout/Warning.jsx";
import CoverLetterPreview from "/images/cd-cover-letter-preview.png";
import { deleteCoverLetter } from "../services/coverLetterService.js";
import { CoverLetterContext } from "../context/CoverLetterContext.jsx";
import { AlertContext } from '../context/AlertContext.jsx';
import { faLink, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

function DashCoverLetter() {
    const { setAlert, setAlertMessage } = useContext(AlertContext);
    const { allCoverLetter, fetchCoverLetter } = useContext(CoverLetterContext);
    const [coverLetterToDelete, setCoverLetterToDelete] = useState(null);

    const handleCoverLetterCopyLink = (id) => {
        const shareURL = `${import.meta.env.VITE_COVER_LETTER_BUILDER_URL}/view-cover-letter/${id}`;
        navigator.clipboard.writeText(shareURL).then(() => {
            setAlertMessage("Share link copied!");
            setAlert("success");
        }).catch(() => {
            setAlertMessage("Failed to copy link.");
            setAlert("failed");
        });
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
        <>
            <div className="home-header">
                <h3>
                    {`You currently have ${allCoverLetter?.length} cover letter${allCoverLetter.length > 1 ? "s" : ""}.`}
                </h3>
                <Link to="https://cover-letter.careerdesire.in" target="_blank">
                    <div className="create-btn">
                        <p><span>+</span> Create New Cover Letter</p>
                    </div>
                </Link>
            </div>

            <div className="home-body">

                {allCoverLetter.length > 0 && (
                    <div className="preview-container">
                        <h2>Your Cover Letter</h2>
                        <div className="preview">
                            {allCoverLetter.map((coverLetter, index) => (
                                <div key={index}>
                                    <img src={CoverLetterPreview} alt="Career desire cover letter icon" className="preview-img" />
                                    <p>{`Cover Letter ${index + 1}`}</p>
                                    <div className="preview-options">
                                        <Link to={`${import.meta.env.VITE_COVER_LETTER_BUILDER_URL}/cover-letter/${coverLetter._id}`} target="_blank">
                                            <p><FontAwesomeIcon icon={faPen} /></p>
                                        </Link>
                                        <p onClick={() => handleCoverLetterCopyLink(coverLetter._id)}><FontAwesomeIcon icon={faLink} /></p>
                                        <p className="delete-resume" onClick={() => setCoverLetterToDelete(index)}>
                                            <FontAwesomeIcon icon={faTrash} />
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {allCoverLetter.length < 1 && (
                    <div className="not-found">
                        <img src={NotFound} alt="No cover letter found" />
                    </div>
                )}

                {coverLetterToDelete !== null && (
                    <Warning
                        warnText="Are you sure you want to delete this cover letter?"
                        actionTextOne="Yes, Delete"
                        actionOne={() => handleDeleteCoverLetter(coverLetterToDelete)}
                        cancelText="Cancel"
                        noAction={() => setCoverLetterToDelete(null)}
                    />
                )}

            </div>
        </>
    )
}

export default DashCoverLetter