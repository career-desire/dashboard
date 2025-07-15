function DashBody({ user }) {
    return (
        <div className="home-header">
            <h3>
                Welcome, <span>{user?.name || "User"}!</span>
                {` We're glad to have you on the Career Desire Dashboard.`}
            </h3>
            {/* <p>Your journey toward professional growth starts here.</p> */}
        </div>
    );
}

export default DashBody;
