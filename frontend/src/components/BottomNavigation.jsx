import {useNavigate} from "react-router-dom";
import "./BottomNavigation.css";

const iconShapes = {
    Home: (
        <>
            <path d="m3 10 9-7 9 7"/>
            <path d="M5 9v12h14V9M9 21v-7h6v7"/>
        </>
    ),
    Inbox: (
        <>
            <rect x="3" y="4" width="18" height="16" rx="2"/>
            <path d="M3 13h5l2 3h4l2-3h5"/>
        </>
    ),
    Profile: (
        <>
            <circle cx="12" cy="8" r="4"/>
            <path d="M4 21v-2a8 8 0 0 1 16 0v2Z"/>
        </>
    ),
};

function NavIcon({name}) {
    return (
        <svg
            viewBox="0 0 24 24"
            width="21"
            height="21"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            {iconShapes[name]}
        </svg>
    );
}

export default function BottomNavigation({activeTab}) {
    const navigate = useNavigate();
    const tabs = ["Home", "Inbox", "Profile"];

    return (
        <nav className="app-bottom-nav" aria-label="Main navigation">
            {tabs.map((tab) => {
                const isActive = tab === activeTab;

                return (
                    <button
                        key={tab}
                        type="button"
                        className={`app-bottom-nav-item${isActive ? " is-active" : ""}`}
                        aria-label={tab}
                        aria-current={isActive ? "page" : undefined}
                        onClick={() => navigate(
                            tab === "Home"
                                ? "/home"
                                : tab === "Inbox"
                                    ? "/inbox"
                                    : "/profile"
                        )}
                    >
                        <NavIcon name={tab}/>
                        <span>{tab}</span>
                    </button>
                );
            })}
        </nav>
    );
}
