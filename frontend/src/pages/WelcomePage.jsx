import {useNavigate} from "react-router-dom";
import BrandBadge from "../components/BrandBadge";
import "./WelcomePage.css";

function SearchIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            width="25"
            height="25"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <circle cx="10.5" cy="10.5" r="6.5"/>
            <path d="m15.5 15.5 5 5"/>
        </svg>
    );
}

function PencilIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            width="25"
            height="25"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="m14 6 4 4"/>
            <path d="M4 20l4.2-.9L20 7.3 16.7 4 4.9 15.8 4 20Z"/>
        </svg>
    );
}

function ArrowIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            width="23"
            height="23"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M4 12h15"/>
            <path d="m13 5 7 7-7 7"/>
        </svg>
    );
}

function WelcomePage() {
    const navigate = useNavigate();

    return (
        <main className="welcome-page">
            <div className="welcome-shell">

                {/* Hero illustration */}
                <section className="welcome-hero">
                    <img
                        className="welcome-illustration"
                        src="/images/workly-welcome-illustration.png"
                        alt="Freelancers collaborating on creative and technical projects"
                    />

                    {/* Reusable, centrally aligned Workly logo */}
                    <BrandBadge
                        className="welcome-logo-badge"
                        size="clamp(64px, 18.3vw, 78px)"
                    />
                </section>

                {/* Full Workly wordmark */}
                <div className="welcome-wordmark-row">
                    <div className="welcome-wordmark-lockup">
                        <span className="welcome-wordmark">WORKLY</span>
                        <span
                            className="welcome-wordmark-star"
                            aria-hidden="true"
                        >
              ★
            </span>
                    </div>
                </div>

                {/* Brand message */}
                <section className="welcome-brand-panel">
                    <h1>
                        Freelance <span>services.</span>
                    </h1>
                </section>

                {/* User choices */}
                <section className="welcome-bottom-sheet">
                    <div className="welcome-role-grid">

                        <button
                            type="button"
                            className="welcome-role-card"
                            onClick={() => navigate("/signup?mode=client")}
                        >
              <span className="welcome-role-icon">
                <SearchIcon/>
              </span>

                            <span className="welcome-role-title">
                Find a service
              </span>

                            <span className="welcome-role-description">
                I'm looking for talented people to work with
              </span>

                            <span className="welcome-card-arrow">
                <ArrowIcon/>
              </span>
                        </button>

                        <button
                            type="button"
                            className="welcome-role-card"
                            onClick={() => navigate("/signup?mode=freelancer")}
                        >
              <span className="welcome-role-icon">
                <PencilIcon/>
              </span>

                            <span className="welcome-role-title">
                Selling service
              </span>

                            <span className="welcome-role-description">
                I'd like to offer my services
              </span>

                            <span className="welcome-card-arrow">
                <ArrowIcon/>
              </span>
                        </button>

                    </div>

                    {/* Bottom navigation */}
                    <nav
                        className="welcome-footer"
                        aria-label="Welcome navigation"
                    >
                        <button
                            type="button"
                            className="welcome-footer-link"
                            onClick={() => navigate("/home")}
                        >
                            Skip
                        </button>

                        <button
                            type="button"
                            className="welcome-footer-link"
                            onClick={() => navigate("/login")}
                        >
                            Sign in
                        </button>
                    </nav>
                </section>
            </div>
        </main>
    );
}

export default WelcomePage;