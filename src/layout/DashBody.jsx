function DashBody({ user }) {
    return (
        <>
            <div className="home-header">
                <h3>
                    Welcome back, <span>{user?.name || "User"}!</span>
                    {" We're glad to have you on the Career Desire Dashboard."}
                </h3>
            </div>
            <div className="home-body">
                <div className="home-grid-container">
                    <div className="grid-item ai-credit">
                        <strong>AI Credits:</strong> You currently have <b>1</b> available
                    </div>
                    <div className="grid-item subscription">
                        <strong>Subscription Status: </strong>Premium
                    </div>
                </div>
            </div>
            <div className="grid-item personalized-resume">
                <strong>Need a tailored resume?</strong> Reach out to us for a <b>personalized resume service</b>.
            </div>
        </>
    );
}

export default DashBody;