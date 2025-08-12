import React, { useEffect, useState } from 'react'

function DashFooter() {
    const [year, setYear] = useState("")

    useEffect(() => {
        const date = new Date
        setYear(date.getFullYear())
    })
    return (
        <div className='dash-footer'>
            <div className="grid-item personalized-resume">
                <strong>Need a tailored resume?</strong> Reach out to us for a <b>personalized resume service</b>.
            </div>
            <ul>
                <li>Email: support@careerdesire.in</li>
                <li>Mobile: +91 9003093936</li>
                <li>Upgrade</li>
            </ul>
            <p>@ {year} Career Desire. All Right Reserved.</p>
        </div>
    )
}

export default DashFooter