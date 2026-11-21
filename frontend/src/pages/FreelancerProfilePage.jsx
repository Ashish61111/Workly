import {useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import BrandBadge from "../components/BrandBadge";
import BottomNavigation from "../components/BottomNavigation";
import "./FreelancerProfilePage.css";

const FREELANCERS = [
    {
        id: 1,
        name: "Olivia Bennett",
        initials: "OB",
        role: "Brand & Logo Designer",
        image: "/images/services/logo-design.png",
        rating: 4.9,
        reviews: 128,
        projects: 86,
        response: "Within a few hours",
        about: "I help businesses turn their ideas into distinctive visual identities. My focus is thoughtful design, clear communication and creating work that fits each brand.",
        skills: ["Logo Design", "Brand Identity", "Typography", "Visual Design"],
        portfolio: [
            {title: "Brand Identity", image: "/images/services/branding.png"},
            {title: "Logo Concepts", image: "/images/services/logo-design.png"},
            {title: "Interface Design", image: "/images/services/ui-ux.png"},
        ],
    },
    {
        id: 2,
        name: "Noah Williams",
        initials: "NW",
        role: "Web Developer",
        image: "/images/services/web-development.png",
        rating: 4.9,
        reviews: 96,
        projects: 71,
        response: "Within a few hours",
        about: "I build responsive websites with an emphasis on usability, maintainable code and consistent experiences across desktop and mobile screens.",
        skills: ["React", "JavaScript", "Responsive Design", "Web Development"],
        portfolio: [
            {title: "Business Website", image: "/images/services/web-development.png"},
            {title: "Interface Concepts", image: "/images/services/ui-ux.png"},
            {title: "Interactive Prototype", image: "/images/services/prototyping.png"},
        ],
    },
    {
        id: 3,
        name: "Mia Chen",
        initials: "MC",
        role: "Video Editor",
        image: "/images/services/video-editing.png",
        rating: 4.8,
        reviews: 84,
        projects: 63,
        response: "Within a day",
        about: "I edit video content for digital platforms, balancing pacing, transitions and visual consistency to help every project tell its story.",
        skills: ["Video Editing", "Short-form Video", "Storytelling", "Audio"],
        portfolio: [
            {title: "Product Video", image: "/images/services/video-editing.png"},
            {title: "Social Campaign", image: "/images/services/social-media.png"},
            {title: "Audio Production", image: "/images/services/audio-music.png"},
        ],
    },
    {
        id: 4,
        name: "Ethan Brooks",
        initials: "EB",
        role: "Content Creator",
        image: "/images/services/content-creation.png",
        rating: 4.7,
        reviews: 62,
        projects: 48,
        response: "Within a day",
        about: "I develop clear, audience-focused content around your goals, brand voice and preferred format.",
        skills: ["Content Writing", "Editing", "Research", "Copywriting"],
        portfolio: [
            {title: "Content Campaign", image: "/images/services/content-creation.png"},
            {title: "Portfolio Layout", image: "/images/services/portfolio-building.png"},
            {title: "Brand Presentation", image: "/images/services/branding.png"},
        ],
    },
    {
        id: 5,
        name: "Sophia Turner",
        initials: "ST",
        role: "Brand Strategist",
        image: "/images/services/branding.png",
        rating: 4.9,
        reviews: 73,
        projects: 59,
        response: "Within a few hours",
        about: "I help businesses establish a consistent visual direction, from colour palettes and typography to the assets customers recognise.",
        skills: ["Branding", "Brand Strategy", "Art Direction", "Design"],
        portfolio: [
            {title: "Brand System", image: "/images/services/branding.png"},
            {title: "Logo Collection", image: "/images/services/logo-design.png"},
            {title: "Social Graphics", image: "/images/services/social-media.png"},
        ],
    },
    {
        id: 6,
        name: "Ava Mitchell",
        initials: "AM",
        role: "UI/UX Designer",
        image: "/images/services/ui-ux.png",
        rating: 4.8,
        reviews: 91,
        projects: 68,
        response: "Within a few hours",
        about: "I design clear digital experiences that balance visual quality with practical user flows, helping teams move from ideas to implementation.",
        skills: ["UI Design", "UX Research", "Wireframes", "Prototyping"],
        portfolio: [
            {title: "Mobile Interface", image: "/images/services/ui-ux.png"},
            {title: "Clickable Prototype", image: "/images/services/prototyping.png"},
            {title: "Web Experience", image: "/images/services/web-development.png"},
        ],
    },
    {
        id: 7,
        name: "Liam Carter",
        initials: "LC",
        role: "Voice-over Artist",
        image: "/images/services/voice-overs.png",
        rating: 4.7,
        reviews: 45,
        projects: 36,
        response: "Within a day",
        about: "I record voice-over audio for explainers, short promotions and digital content, following your script and direction.",
        skills: ["Voice-over", "Narration", "Audio Recording", "Editing"],
        portfolio: [
            {title: "Voice Recording", image: "/images/services/voice-overs.png"},
            {title: "Audio Production", image: "/images/services/audio-music.png"},
            {title: "Video Project", image: "/images/services/video-editing.png"},
        ],
    },
    {
        id: 8,
        name: "Isabella Reed",
        initials: "IR",
        role: "Audio Producer",
        image: "/images/services/audio-music.png",
        rating: 4.8,
        reviews: 54,
        projects: 42,
        response: "Within a day",
        about: "I work with audio editing and music production for digital content, helping projects achieve a more consistent sound.",
        skills: ["Audio Editing", "Music Production", "Sound Design", "Mixing"],
        portfolio: [
            {title: "Audio Production", image: "/images/services/audio-music.png"},
            {title: "Voice-over Project", image: "/images/services/voice-overs.png"},
            {title: "Video Soundtrack", image: "/images/services/video-editing.png"},
        ],
    },
    {
        id: 9,
        name: "James Wilson",
        initials: "JW",
        role: "SEO & Marketing Specialist",
        image: "/images/services/seo-analytics.png",
        rating: 4.8,
        reviews: 67,
        projects: 51,
        response: "Within a day",
        about: "I help teams review their website content and discover practical opportunities to improve search visibility and measurement.",
        skills: ["SEO", "Analytics", "Keyword Research", "Marketing"],
        portfolio: [
            {title: "Analytics Overview", image: "/images/services/seo-analytics.png"},
            {title: "Content Strategy", image: "/images/services/content-creation.png"},
            {title: "Social Campaign", image: "/images/services/social-media.png"},
        ],
    },
    {
        id: 10,
        name: "Grace Lee",
        initials: "GL",
        role: "Portfolio Designer",
        image: "/images/services/portfolio-building.png",
        rating: 4.7,
        reviews: 38,
        projects: 29,
        response: "Within a day",
        about: "I help creative professionals organise their work into clear portfolios that communicate their skills and experience.",
        skills: ["Portfolio Design", "Layout", "Visual Storytelling", "Branding"],
        portfolio: [
            {title: "Creative Portfolio", image: "/images/services/portfolio-building.png"},
            {title: "Brand Identity", image: "/images/services/branding.png"},
            {title: "UI Showcase", image: "/images/services/ui-ux.png"},
        ],
    },
    {
        id: 11,
        name: "Daniel Scott",
        initials: "DS",
        role: "Prototype Designer",
        image: "/images/services/prototyping.png",
        rating: 4.9,
        reviews: 42,
        projects: 34,
        response: "Within a few hours",
        about: "I turn product ideas into clickable prototypes that help teams explore screen flows and communicate design decisions.",
        skills: ["Prototyping", "Product Design", "UI/UX", "Wireframes"],
        portfolio: [
            {title: "Interactive Prototype", image: "/images/services/prototyping.png"},
            {title: "App Interface", image: "/images/services/ui-ux.png"},
            {title: "Website Concept", image: "/images/services/web-development.png"},
        ],
    },
    {
        id: 12,
        name: "Chloe Adams",
        initials: "CA",
        role: "Social Media Designer",
        image: "/images/services/social-media.png",
        rating: 4.6,
        reviews: 57,
        projects: 43,
        response: "Within a day",
        about: "I help brands prepare visually consistent social content that follows their identity and speaks to their audience.",
        skills: ["Social Media", "Content Design", "Branding", "Campaigns"],
        portfolio: [
            {title: "Social Campaign", image: "/images/services/social-media.png"},
            {title: "Brand Assets", image: "/images/services/branding.png"},
            {title: "Content Series", image: "/images/services/content-creation.png"},
        ],
    },
    {
        id: 13,
        name: "Lucas Martin",
        initials: "LM",
        role: "Communication Specialist",
        image: "/images/services/global-communication.png",
        rating: 4.6,
        reviews: 31,
        projects: 24,
        response: "Within a day",
        about: "I support clear, professional communication for project documents, business correspondence and cross-team collaboration.",
        skills: ["Communication", "Editing", "Business Writing", "Research"],
        portfolio: [
            {title: "Communication Project", image: "/images/services/global-communication.png"},
            {title: "Content Project", image: "/images/services/content-creation.png"},
            {title: "Portfolio Project", image: "/images/services/portfolio-building.png"},
        ],
    },
];

function StarIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m12 2.8 2.8 5.7 6.3.9-4.55 4.45 1.08 6.28L12 17.2l-5.63 2.96 1.08-6.28L2.9 9.4l6.3-.9L12 2.8Z"/>
        </svg>
    );
}

function CheckIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m5 12 4 4L19 6"/>
        </svg>
    );
}

function ArrowLeftIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M19 12H5"/>
            <path d="m12 19-7-7 7-7"/>
        </svg>
    );
}

export default function FreelancerProfilePage() {
    const navigate = useNavigate();
    const {freelancerId} = useParams();

    const freelancer = FREELANCERS.find(
        (item) => item.id === Number(freelancerId)
    );

    const [isSaved, setIsSaved] = useState(false);
    const [notice, setNotice] = useState("");

    if (!freelancer) {
        return (
            <main className="freelancer-page">
                <div className="freelancer-shell freelancer-not-found">
                    <BrandBadge
                        className="freelancer-brand-badge"
                        size="54px"
                    />
                    <h1>Profile not found</h1>
                    <p>
                        This freelancer is not available in the demo directory.
                    </p>
                    <button
                        type="button"
                        className="freelancer-primary-button"
                        onClick={() => navigate("/explore-services")}
                    >
                        <ArrowLeftIcon/>
                        Back to services
                    </button>
                    <BottomNavigation activeTab="Profile"/>
                </div>
            </main>
        );
    }

    function handleMessage() {
        navigate(
            `/inbox?contact=${encodeURIComponent(freelancer.name)}`
        );
    }

    function handleViewService() {
        navigate(`/service/${freelancer.id}`);
    }

    return (
        <main className="freelancer-page">
            <div className="freelancer-shell">
                <header className="freelancer-header">
                    <button
                        type="button"
                        className="freelancer-back-button"
                        onClick={() => navigate(`/service/${freelancer.id}`)}
                        aria-label="Back to service details"
                        title="Back to service details"
                    >
                        <ArrowLeftIcon/>
                    </button>

                    <BrandBadge
                        className="freelancer-brand-badge"
                        size="46px"
                    />

                    <div className="freelancer-header-copy">
                        <p>YOUR WORKLY SPACE</p>
                        <h1>Freelancer profile</h1>
                    </div>
                </header>

                <div className="freelancer-content">
                    <nav className="freelancer-breadcrumb" aria-label="Breadcrumb">
                        <button type="button" onClick={() => navigate("/home")}>
                            Home
                        </button>
                        <span aria-hidden="true">/</span>
                        <button
                            type="button"
                            onClick={() => navigate("/explore-services")}
                        >
                            Explore services
                        </button>
                        <span aria-hidden="true">/</span>
                        <span>{freelancer.name}</span>
                    </nav>

                    <section className="freelancer-hero-card">
                        <div
                            className={`freelancer-cover ${
                                freelancer.coverImage ? "has-cover-image" : ""
                            }`}
                            aria-hidden="true"
                        >
                            {freelancer.coverImage && (
                                <img
                                    src={freelancer.coverImage}
                                    alt=""
                                />
                            )}
                        </div>

                        <div className="freelancer-hero-body">
                            <div className="freelancer-avatar">
                                {freelancer.initials}
                                <span className="freelancer-verified">
                                    <CheckIcon/>
                                </span>
                            </div>

                            <div className="freelancer-hero-details">
                                <div className="freelancer-name-row">
                                    <div>
                                        <p className="freelancer-eyebrow">
                                            FREELANCER PROFILE · DEMO
                                        </p>
                                        <h2>{freelancer.name}</h2>
                                        <p className="freelancer-role">
                                            {freelancer.role}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        className={`freelancer-save-button ${
                                            isSaved ? "saved" : ""
                                        }`}
                                        onClick={() =>
                                            setIsSaved((current) => !current)
                                        }
                                        aria-pressed={isSaved}
                                    >
                                        <span aria-hidden="true">
                                            {isSaved ? "♥" : "♡"}
                                        </span>
                                        {isSaved ? "Saved" : "Save"}
                                    </button>
                                </div>

                                <div className="freelancer-status-row">
                                    <span className="freelancer-availability-dot"/>
                                    Available for projects
                                    <span className="freelancer-status-divider">
                                        ·
                                    </span>
                                    Remote
                                </div>

                                <p className="freelancer-about">
                                    {freelancer.about}
                                </p>

                                <div className="freelancer-hero-actions">
                                    <button
                                        type="button"
                                        className="freelancer-primary-button"
                                        onClick={handleMessage}
                                    >
                                        Message freelancer
                                        <span aria-hidden="true">→</span>
                                    </button>

                                    <button
                                        type="button"
                                        className="freelancer-secondary-button"
                                        onClick={handleViewService}
                                    >
                                        View service
                                    </button>
                                </div>

                                {notice && (
                                    <p className="freelancer-notice" role="status">
                                        {notice}
                                    </p>
                                )}
                            </div>
                        </div>
                    </section>

                    <section className="freelancer-stats">
                        <div>
                            <span className="freelancer-stat-icon">
                                <StarIcon/>
                            </span>
                            <strong>{freelancer.rating.toFixed(1)}/5</strong>
                            <span>Sample rating</span>
                        </div>

                        <div>
                            <span className="freelancer-stat-icon">✦</span>
                            <strong>{freelancer.reviews}</strong>
                            <span>Sample reviews</span>
                        </div>

                        <div>
                            <span className="freelancer-stat-icon">↗</span>
                            <strong>{freelancer.projects}</strong>
                            <span>Sample projects</span>
                        </div>

                        <div>
                            <span className="freelancer-stat-icon">◷</span>
                            <strong>{freelancer.response}</strong>
                            <span>Response time</span>
                        </div>
                    </section>

                    <section className="freelancer-section">
                        <div className="freelancer-section-heading">
                            <div>
                                <p className="freelancer-eyebrow">
                                    WHAT I DO
                                </p>
                                <h2>Skills & expertise</h2>
                            </div>
                            <span aria-hidden="true">✦</span>
                        </div>

                        <div className="freelancer-skills">
                            {freelancer.skills.map((skill) => (
                                <span key={skill}>{skill}</span>
                            ))}
                        </div>
                    </section>

                    <section className="freelancer-section">
                        <div className="freelancer-section-heading">
                            <div>
                                <p className="freelancer-eyebrow">
                                    SELECTED WORK
                                </p>
                                <h2>Portfolio</h2>
                            </div>
                            <span className="freelancer-section-note">
                                Sample projects
                            </span>
                        </div>

                        <div className="freelancer-portfolio-grid">
                            {freelancer.portfolio.map((project) => (
                                <article
                                    className="freelancer-project-card"
                                    key={project.title}
                                >
                                    <div className="freelancer-project-image">
                                        <img src={project.image} alt=""/>
                                    </div>
                                    <div className="freelancer-project-copy">
                                        <h3>{project.title}</h3>
                                        <span>{freelancer.role}</span>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section className="freelancer-review-section">
                        <div>
                            <p className="freelancer-eyebrow">
                                CLIENT FEEDBACK
                            </p>
                            <h2>Build trust through great work.</h2>
                            <p>
                                Reviews and verified work history will be
                                loaded from real completed projects after
                                backend integration.
                            </p>
                        </div>
                        <div className="freelancer-review-symbol" aria-hidden="true">
                            “
                        </div>
                    </section>

                    <footer className="freelancer-footer">
                        <span aria-hidden="true">✦</span>
                        <p>Better work begins with the right connection.</p>
                        <strong>WORKLY</strong>
                    </footer>
                </div>

                <BottomNavigation activeTab="Profile"/>
            </div>
        </main>
    );
}
