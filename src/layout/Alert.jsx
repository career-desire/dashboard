import React, { useContext, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTriangleExclamation, faXmark } from '@fortawesome/free-solid-svg-icons';
import { AlertContext } from '../context/AlertContext';
import '../styles/Alert.css';

function Alert() {
    const { alert, setAlert, alertMessage } = useContext(AlertContext);

    useEffect(() => {
        if (alert) {
            const timer = setTimeout(() => {
                setAlert(null); 
            }, 3000);

            return () => clearTimeout(timer); 
        }
    }, [alert, setAlert]);

    return (
        <>
            {alert && (
                <div className='alert-container slide-in-blurred-top'>
                    {alert === "success" && (
                        <div className='success-alert alert'>
                            <FontAwesomeIcon icon={faCheck} />
                            <p>{alertMessage}</p>
                        </div>
                    )}
                    {alert === "failed" && (
                        <div className='failed-alert alert'>
                            <FontAwesomeIcon icon={faXmark} />
                            <p>{alertMessage}</p>
                        </div>
                    )}
                    {alert === "warn" && (
                        <div className='warn-alert alert'>
                            <FontAwesomeIcon icon={faTriangleExclamation} />
                            <p>{alertMessage}</p>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}

export default Alert;
