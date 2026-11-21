import {useEffect, useMemo, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import WorklyWordMark from "../components/WorklyWordMark";
import FreelancerMessageCenter from "../components/FreelancerMessageCenter";
import "./FreelancerPages.css";

const PROJECTS = [
    {
        id: "p101", title: "Redesign a modern e-commerce website", client: "Northstar Retail",
        category: "Web Development", budget: 18000, budgetType: "Fixed price", duration: "2–3 weeks",
        posted: "2 hours ago", experience: "Intermediate", proposals: 8,
        skills: ["React", "UI/UX", "Responsive Design"],
        description: "Refresh our online store with a clean, responsive interface. Improve product discovery, product details, and the mobile shopping experience.",
    },
    {
        id: "p102", title: "Create a brand identity for a coffee company", client: "Hearth & Bean",
        category: "Logo Design", budget: 8500, budgetType: "Fixed price", duration: "1–2 weeks",
        posted: "5 hours ago", experience: "Entry level", proposals: 12,
        skills: ["Logo Design", "Brand Identity", "Adobe Illustrator"],
        description: "Create a memorable logo, a small color palette, typography recommendations, and basic brand guidelines for a specialty coffee brand.",
    },
    {
        id: "p103", title: "Edit short-form videos for a tech channel", client: "Pixel Circuit Media",
        category: "Video Editing", budget: 12000, budgetType: "Fixed price", duration: "Ongoing · 4 weeks",
        posted: "Yesterday", experience: "Intermediate", proposals: 6,
        skills: ["Premiere Pro", "Short-form Video", "Motion Graphics"],
        description: "Turn supplied footage into polished vertical videos with strong pacing, clean captions, sound design, and consistent delivery.",
    },
    {
        id: "p104", title: "Design a SaaS dashboard in Figma", client: "Orbit Metrics",
        category: "UI/UX Design", budget: 15000, budgetType: "Fixed price", duration: "2 weeks",
        posted: "Yesterday", experience: "Intermediate", proposals: 4,
        skills: ["Figma", "Dashboard Design", "Prototyping"],
        description: "Design an intuitive analytics dashboard with overview cards, charts, filters, and a responsive layout using supplied product requirements.",
    },
    {
        id: "p105", title: "Write SEO-friendly articles for a technology blog", client: "The Daily Byte",
        category: "Content Writing", budget: 900, budgetType: "Per article", duration: "Ongoing",
        posted: "2 days ago", experience: "Entry level", proposals: 19,
        skills: ["SEO", "Content Writing", "Research"],
        description: "Write clear, well-researched technology articles for a general audience. Topics, outlines, and target keywords will be supplied.",
    },
    {
        id: "p106", title: "Build a landing page for a fitness app", client: "Form & Function",
        category: "Web Development", budget: 10000, budgetType: "Fixed price", duration: "1 week",
        posted: "3 days ago", experience: "Intermediate", proposals: 10,
        skills: ["HTML", "CSS", "JavaScript", "Responsive Design"],
        description: "Create a fast, mobile-first landing page that explains a fitness app, highlights its features, and guides visitors to a clear call to action.",
    },
];

const CATEGORIES = ["All categories", ...new Set(PROJECTS.map((project) => project.category))];
const PROPOSALS_KEY = "workly_demo_proposals";
const MAX_SAMPLE_FILES = 2;
const MAX_SAMPLE_FILE_SIZE = 350 * 1024;

const ALLOWED_SAMPLE_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const ALLOWED_SAMPLE_EXTENSIONS = /\.(jpe?g|png|webp|pdf|doc|docx)$/i;

export function formatWorklyMoney(amount) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(Number(amount) || 0);
}

function readLocalArray(key) {
    try {
        const value = JSON.parse(localStorage.getItem(key) || "[]");
        return Array.isArray(value) ? value : [];
    } catch {
        return [];
    }
}

function readSavedProposals() {
    return readLocalArray(PROPOSALS_KEY);
}

function localDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function dateAfterDays(days) {
    const date = new Date();
    date.setDate(date.getDate() + Number(days));
    return localDateString(date);
}

function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            if (typeof reader.result === "string") {
                resolve(reader.result);
            } else {
                reject(new Error("Could not read this file."));
            }
        };

        reader.onerror = () => reject(new Error("Could not read this file."));
        reader.readAsDataURL(file);
    });
}

function formatFileSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(0)} KB`;
}

function PaymentPolicyNotice({compact = false}) {
    return (
        <aside className={`fw-policy-notice ${compact ? "is-compact" : ""}`} role="note">
            <span className="fw-policy-icon" aria-hidden="true">⛨</span>
            <div>
                <strong>Keep every payment on Workly</strong>
                <p>
                    All project payments and optional tips must be processed through Workly.
                    Clients or freelancers who arrange or complete payments outside Workly
                    will be banned from the platform.
                </p>
            </div>
        </aside>
    );
}

/* =====================================================
   WORKLY SCROLL-SYNCHRONIZED STAR + GOLDEN GLITTER
   ===================================================== */

export function FreelancerSidebarStarAnimation() {
    useEffect(() => {
        if (
            window.matchMedia &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ) {
            return;
        }

        const source = document.querySelector(
            ".fw-wordmark .workly-wordmark-star"
        );
        const destination = document.querySelector(
            ".fw-sidebar-note .fw-note-star"
        );

        if (!source || !destination) return;

        const flyingStar = document.createElement("span");
        flyingStar.className = "fw-flying-star";
        flyingStar.textContent = "★";
        flyingStar.setAttribute("aria-hidden", "true");

        const trail = document.createElement("span");
        trail.className = "fw-star-trail";
        trail.setAttribute("aria-hidden", "true");

        ["one", "two", "three", "four", "five", "six"].forEach((name) => {
            const particle = document.createElement("span");
            particle.className = `fw-star-particle fw-star-particle--${name}`;
            particle.textContent = "✦";
            trail.appendChild(particle);
        });

        document.body.appendChild(trail);
        document.body.appendChild(flyingStar);

        const originalSourceVisibility = source.style.visibility;
        const originalDestinationVisibility = destination.style.visibility;

        let frameId = null;
        let fadeTimer = null;
        let lastScrollY = window.scrollY;
        let lastDirection = "down";
        let scrollTriggered = false;

        const clamp = (value, min, max) =>
            Math.min(max, Math.max(min, value));

        const updateStarPosition = (fromScroll = false) => {
            frameId = null;

            const scrollTop = Math.max(0, window.scrollY);
            const scrollDelta = scrollTop - lastScrollY;

            if (scrollDelta > 0) {
                lastDirection = "down";
            } else if (scrollDelta < 0) {
                lastDirection = "up";
            }

            lastScrollY = scrollTop;

            const documentHeight = Math.max(
                document.documentElement.scrollHeight,
                document.body.scrollHeight
            );

            const maxScroll = Math.max(
                0,
                documentHeight - window.innerHeight
            );

            const progress = maxScroll > 0
                ? clamp(scrollTop / maxScroll, 0, 1)
                : 0;

            const easedProgress =
                progress * progress * (3 - 2 * progress);

            const start = source.getBoundingClientRect();
            const target = destination.getBoundingClientRect();

            const startX = start.left + start.width / 2;
            const startY = start.top + start.height / 2;
            const endX = target.left + target.width / 2;

            const destinationDocumentY =
                target.top + scrollTop + target.height / 2;

            const endY = destinationDocumentY - maxScroll;

            const curveAmount = Math.min(
                42,
                Math.abs(endX - startX) * 0.25
            );

            const curveOffset =
                Math.sin(Math.PI * easedProgress) * curveAmount;

            const currentX =
                startX +
                (endX - startX) * easedProgress +
                curveOffset;

            const currentY =
                startY + (endY - startY) * easedProgress;

            const atStart = progress <= 0.001;
            const atEnd = progress >= 0.999;

            flyingStar.style.left = `${currentX}px`;
            flyingStar.style.top = `${currentY}px`;

            const starScale =
                1 + Math.sin(Math.PI * easedProgress) * 0.14;

            flyingStar.style.transform =
                `translate(-50%, -50%) scale(${starScale})`;

            if (maxScroll === 0) {
                source.style.visibility = originalSourceVisibility;
                destination.style.visibility = originalDestinationVisibility;
                flyingStar.style.opacity = "0";
                trail.style.opacity = "0";
                trail.classList.remove("is-moving");
                return;
            }

            source.style.visibility = atStart
                ? originalSourceVisibility
                : "hidden";

            destination.style.visibility = atEnd
                ? originalDestinationVisibility
                : "hidden";

            flyingStar.style.opacity = atStart || atEnd ? "0" : "1";

            if (atStart || atEnd) {
                trail.style.opacity = "0";
                trail.classList.remove("is-moving");
                window.clearTimeout(fadeTimer);
                return;
            }

            trail.style.left = `${currentX}px`;
            trail.style.top = `${currentY}px`;

            trail.style.transform = lastDirection === "down"
                ? "translate(-50%, -50%) rotate(0deg)"
                : "translate(-50%, -50%) rotate(180deg)";

            if (fromScroll && scrollDelta !== 0) {
                const scrollSpeed = Math.abs(scrollDelta);

                const intensity = clamp(
                    0.30 + scrollSpeed / 28,
                    0.30,
                    1
                );

                trail.style.opacity = String(intensity);
                trail.classList.add("is-moving");

                const particleDuration = Math.max(
                    420,
                    1100 - Math.min(600, scrollSpeed * 15)
                );

                trail.style.setProperty(
                    "--trail-duration",
                    `${particleDuration}ms`
                );

                window.clearTimeout(fadeTimer);

                fadeTimer = window.setTimeout(() => {
                    trail.style.opacity = "0";
                    trail.classList.remove("is-moving");
                }, 160);
            }
        };

        const scheduleUpdate = (fromScroll = false) => {
            scrollTriggered = scrollTriggered || fromScroll;

            if (frameId !== null) return;

            frameId = window.requestAnimationFrame(() => {
                const isScrollUpdate = scrollTriggered;
                scrollTriggered = false;
                updateStarPosition(isScrollUpdate);
            });
        };

        const handleScroll = () => scheduleUpdate(true);
        const handleResize = () => scheduleUpdate(false);

        window.addEventListener("scroll", handleScroll, {passive: true});
        window.addEventListener("resize", handleResize);

        const resizeObserver =
            typeof ResizeObserver !== "undefined"
                ? new ResizeObserver(handleResize)
                : null;

        resizeObserver?.observe(document.body);

        updateStarPosition(false);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleResize);
            resizeObserver?.disconnect();

            if (frameId !== null) {
                window.cancelAnimationFrame(frameId);
            }

            window.clearTimeout(fadeTimer);

            source.style.visibility = originalSourceVisibility;
            destination.style.visibility = originalDestinationVisibility;

            flyingStar.remove();
            trail.remove();
        };
    }, []);

    return null;
}

/* =====================================================
   FREELANCER NAVIGATION
   ===================================================== */

const FREELANCER_NAV_ITEMS = [
    {label: "Dashboard", mobileLabel: "Home", to: "/freelancer/dashboard", icon: "⌂"},
    {label: "Find projects", mobileLabel: "Projects", to: "/freelancer/projects", icon: "⌕"},
    {label: "My gigs", mobileLabel: "Gigs", to: "/freelancer/my-gigs", icon: "gigs"},
    {label: "My proposals", mobileLabel: "Proposals", to: "/freelancer/proposals", icon: "proposals"},
    {label: "Client services", mobileLabel: "Services", to: "/explore-services", icon: "✦"},
];

function FreelancerNavIcon({icon}) {
    const iconProps = {
        viewBox: "0 0 24 24",
        width: "18",
        height: "18",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "1.7",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        focusable: "false",
    };

    if (icon === "gigs") {
        return (
            <svg {...iconProps}>
                <rect x="3" y="7" width="18" height="14" rx="2.5"/>
                <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                <path d="M3 12h18M10 12v2h4v-2"/>
            </svg>
        );
    }

    if (icon === "proposals") {
        return (
            <svg {...iconProps}>
                <path d="M7 3h7l4 4v14H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/>
                <path d="M14 3v5h5M9 12h6M9 16h6"/>
            </svg>
        );
    }

    return icon;
}

function FreelancerNavigation({active, mobile = false}) {
    return (
        <nav
            className={mobile ? "fw-mobile-nav" : "fw-sidebar-nav"}
            aria-label={mobile ? "Mobile freelancer navigation" : "Freelancer navigation"}
        >
            {FREELANCER_NAV_ITEMS.map((item) => (
                <Link
                    key={item.label}
                    to={item.to}
                    className={`fw-nav-link ${active === item.label ? "is-active" : ""}`}
                    aria-current={active === item.label ? "page" : undefined}
                >
                    <span className="fw-nav-icon" aria-hidden="true">
                        <FreelancerNavIcon icon={item.icon}/>
                    </span>

                    <span className="fw-nav-label">{item.label}</span>
                    <span className="fw-nav-mobile-label">{item.mobileLabel}</span>
                </Link>
            ))}
        </nav>
    );
}

/* =====================================================
   FREELANCER PAGE LAYOUT
   ===================================================== */

function FreelancerLayout({
                              active,
                              eyebrow,
                              title,
                              subtitle,
                              children,
                              showBrowseButton = true,
                          }) {
    return (
        <main className="fw-page">
            <header className="fw-topbar">
                <Link className="fw-brand-link" to="/home" aria-label="Workly home">
                    <WorklyWordMark prefix="" className="fw-wordmark"/>
                </Link>

                <div className="fw-topbar-right">
                    <span className="fw-role-pill">Freelancer workspace</span>
                </div>
            </header>

            <div className="fw-layout">
                <aside className="fw-sidebar">
                    <div className="fw-sidebar-label">WORKSPACE</div>
                    <FreelancerNavigation active={active}/>

                    <div className="fw-sidebar-note">
                        <span className="fw-note-star" aria-hidden="true">✦</span>
                        <strong>Your next opportunity starts here.</strong>
                        <p>Keep your profile and proposals up to date.</p>
                    </div>

                    <PaymentPolicyNotice compact/>
                </aside>

                <section className="fw-main">
                    <div className="fw-page-heading">
                        <div className="fw-page-heading-copy">
                            <p className="fw-eyebrow">{eyebrow}</p>
                            <h1>{title}</h1>
                            {subtitle && <p className="fw-subtitle">{subtitle}</p>}
                        </div>

                        {showBrowseButton && (
                            <Link className="fw-primary-button fw-heading-action" to="/freelancer/projects">
                                Browse projects <span aria-hidden="true">↗</span>
                            </Link>
                        )}
                    </div>

                    {children}

                    <p className="fw-demo-notice">
                        Preview mode · Listings, proposals, and uploads are stored in this browser only.
                        No real client or payment processing is connected.
                    </p>
                </section>
            </div>

            <FreelancerNavigation active={active} mobile/>
        </main>
    );
}

/* =====================================================
   PROJECT CARD
   ===================================================== */

function ProjectCard({project}) {
    return (
        <article className="fw-project-card">
            <div className="fw-project-card-top">
                <div className="fw-project-symbol" aria-hidden="true">{project.category.slice(0, 1)}</div>
                <span className="fw-posted-time">{project.posted}</span>
            </div>

            <Link className="fw-project-title" to={`/freelancer/projects/${project.id}`}>
                {project.title}
            </Link>

            <div className="fw-client-name">
                {project.client} <span>·</span> {project.experience}
            </div>

            <p className="fw-project-description">{project.description}</p>

            <div className="fw-skill-list">
                {project.skills.map((skill) => (
                    <span className="fw-skill-chip" key={skill}>{skill}</span>
                ))}
            </div>

            <div className="fw-project-card-footer">
                <div>
                    <strong>{formatWorklyMoney(project.budget)}</strong>
                    <span>{project.budgetType}</span>
                </div>

                <Link className="fw-outline-button" to={`/freelancer/projects/${project.id}`}>
                    View project <span aria-hidden="true">→</span>
                </Link>
            </div>
        </article>
    );
}

/* =====================================================
   FREELANCER DASHBOARD
   ===================================================== */

export function FreelancerDashboardPage() {
    const proposals = readSavedProposals();
    const gigs = readLocalArray("workly_demo_gigs");
    const featured = PROJECTS.slice(0, 3);

    return (
        <FreelancerLayout
            active="Dashboard"
            eyebrow="YOUR WORK, YOUR GROWTH"
            title="Good work starts with the right project."
            subtitle="Find client briefs, showcase your best work, and build trusted relationships."
        >
            <section className="fw-welcome-banner">
                <div>
                    <p className="fw-banner-kicker">READY FOR YOUR NEXT PROJECT?</p>
                    <h2>Make your next move count.</h2>
                    <p>Discover new briefs, publish up to three gigs, and find work that fits your goals.</p>
                    <Link className="fw-banner-button" to="/freelancer/projects">
                        Find projects <span aria-hidden="true">→</span>
                    </Link>
                </div>

                <div className="fw-banner-art" aria-hidden="true"><span>✦</span><i/><b/></div>
            </section>

            <section className="fw-stat-grid" aria-label="Workspace overview">
                <div className="fw-stat-card">
                    <span className="fw-stat-label">Projects to explore</span>
                    <strong>{PROJECTS.length}</strong>
                    <span className="fw-stat-foot">Sample opportunities</span>
                </div>

                <div className="fw-stat-card">
                    <span className="fw-stat-label">Your proposals</span>
                    <strong>{proposals.length}</strong>
                    <span className="fw-stat-foot">Saved in this browser</span>
                </div>

                <div className="fw-stat-card">
                    <span className="fw-stat-label">Published gigs</span>
                    <strong>{gigs.length}/3</strong>
                    <span className="fw-stat-foot">Portfolio showcase</span>
                </div>
            </section>

            <PaymentPolicyNotice/>
            <FreelancerMessageCenter/>

            <div className="fw-section-heading">
                <div>
                    <p className="fw-eyebrow">SHOW CLIENTS YOUR VALUE</p>
                    <h2>Your gig showcase</h2>
                </div>

                <Link to="/freelancer/my-gigs" className="fw-text-link">
                    Manage my gigs →
                </Link>
            </div>

            {gigs.length ? (
                <div className="fw-gig-mini-grid">
                    {gigs.slice(0, 3).map((gig) => (
                        <article className="fw-gig-mini-card" key={gig.id}>
                            {gig.sampleData && gig.sampleType?.startsWith("image/") ? (
                                <img src={gig.sampleData} alt={`Sample for ${gig.title}`}/>
                            ) : (
                                <div className="fw-gig-mini-placeholder">
                                    ✦<small>WORK SAMPLE</small>
                                </div>
                            )}

                            <div className="fw-gig-mini-copy">
                                <span className="fw-category-tag">{gig.category}</span>
                                <h3>{gig.title}</h3>
                                <p>{formatWorklyMoney(gig.minPrice)} – {formatWorklyMoney(gig.maxPrice)}</p>
                            </div>
                        </article>
                    ))}
                </div>
            ) : (
                <div className="fw-empty-inline">
                    <span>✦</span>

                    <div>
                        <strong>Your portfolio starts here</strong>
                        <p>
                            Create up to three gigs and attach one sample to each so clients can understand your work.
                        </p>
                    </div>

                    <Link className="fw-outline-button" to="/freelancer/my-gigs">
                        Create a gig →
                    </Link>
                </div>
            )}

            <div className="fw-section-heading">
                <div>
                    <p className="fw-eyebrow">HAND-PICKED FOR YOU</p>
                    <h2>Featured projects</h2>
                </div>

                <Link to="/freelancer/projects" className="fw-text-link">
                    View all projects →
                </Link>
            </div>

            <div className="fw-project-grid">
                {featured.map((project) => (
                    <ProjectCard key={project.id} project={project}/>
                ))}
            </div>
        </FreelancerLayout>
    );
}

/* =====================================================
   BROWSE PROJECTS
   ===================================================== */

export function BrowseProjectsPage() {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All categories");
    const [sort, setSort] = useState("recommended");

    const visibleProjects = useMemo(() => {
        const query = search.trim().toLowerCase();

        const filtered = PROJECTS.filter((project) => {
            const matchesCategory =
                category === "All categories" || project.category === category;

            const text = [
                project.title,
                project.client,
                project.description,
                ...project.skills,
            ].join(" ").toLowerCase();

            return matchesCategory && (!query || text.includes(query));
        });

        if (sort === "budget-high") {
            return [...filtered].sort((a, b) => b.budget - a.budget);
        }

        if (sort === "budget-low") {
            return [...filtered].sort((a, b) => a.budget - b.budget);
        }

        return filtered;
    }, [search, category, sort]);

    return (
        <FreelancerLayout
            active="Find projects"
            eyebrow="PROJECT MARKETPLACE"
            title="Find projects worth your time."
            subtitle="Explore client briefs, compare budgets, and find work that fits your strengths."
        >
            <section className="fw-filter-panel" aria-label="Filter projects">
                <label className="fw-search-field">
                    <span aria-hidden="true">⌕</span>

                    <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search projects, skills, or clients"
                        aria-label="Search projects"
                    />
                </label>

                <label className="fw-select-field">
                    <span>Category</span>

                    <select
                        value={category}
                        onChange={(event) => setCategory(event.target.value)}
                    >
                        {CATEGORIES.map((item) => (
                            <option key={item} value={item}>{item}</option>
                        ))}
                    </select>
                </label>

                <label className="fw-select-field">
                    <span>Sort by</span>

                    <select
                        value={sort}
                        onChange={(event) => setSort(event.target.value)}
                    >
                        <option value="recommended">Recommended</option>
                        <option value="budget-high">Highest budget</option>
                        <option value="budget-low">Lowest budget</option>
                    </select>
                </label>
            </section>

            <div className="fw-results-row">
                <span><strong>{visibleProjects.length}</strong> projects found</span>
                <span>Budgets shown in INR</span>
            </div>

            {visibleProjects.length ? (
                <div className="fw-project-grid">
                    {visibleProjects.map((project) => (
                        <ProjectCard key={project.id} project={project}/>
                    ))}
                </div>
            ) : (
                <div className="fw-empty-state">
                    <span>⌕</span>
                    <h2>No projects match your search</h2>
                    <p>Try a different keyword or reset the category filter.</p>

                    <button
                        type="button"
                        className="fw-outline-button"
                        onClick={() => {
                            setSearch("");
                            setCategory("All categories");
                        }}
                    >
                        Clear filters
                    </button>
                </div>
            )}
        </FreelancerLayout>
    );
}

/* =====================================================
   PROJECT DETAILS AND PROPOSAL SUBMISSION
   ===================================================== */

export function ProjectDetailsPage() {
    const {projectId} = useParams();
    const navigate = useNavigate();
    const project = PROJECTS.find((item) => item.id === projectId);

    const [minBid, setMinBid] = useState(project ? String(Math.max(1, Math.round(project.budget * 0.9))) : "");
    const [maxBid, setMaxBid] = useState(project ? String(project.budget) : "");
    const [delivery, setDelivery] = useState("7");
    const [submissionDate, setSubmissionDate] = useState(() => dateAfterDays(7));
    const [express, setExpress] = useState(false);
    const [expressDays, setExpressDays] = useState("3");
    const [expressFee, setExpressFee] = useState("1500");
    const [coverLetter, setCoverLetter] = useState("");
    const [workDescription, setWorkDescription] = useState("");
    const [sampleFiles, setSampleFiles] = useState([]);
    const [sampleUploadError, setSampleUploadError] = useState("");
    const [policyAccepted, setPolicyAccepted] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    if (!project) {
        return (
            <FreelancerLayout
                active="Find projects"
                eyebrow="PROJECT NOT FOUND"
                title="We couldn't find that project."
                subtitle="Choose another opportunity from the marketplace."
            >
                <Link className="fw-primary-button" to="/freelancer/projects">
                    Back to projects
                </Link>
            </FreelancerLayout>
        );
    }

    async function handleSampleUpload(event) {
        const selectedFiles = Array.from(event.target.files || []);
        event.target.value = "";
        setSampleUploadError("");

        if (!selectedFiles.length) return;

        const availableSlots = MAX_SAMPLE_FILES - sampleFiles.length;

        if (availableSlots <= 0) {
            setSampleUploadError(
                "You can attach up to two work samples. Remove a file to add another."
            );
            return;
        }

        if (selectedFiles.length > availableSlots) {
            setSampleUploadError(
                `Only ${availableSlots} more file${availableSlots === 1 ? "" : "s"} can be added.`
            );
        }

        const filesToProcess = selectedFiles.slice(0, availableSlots);
        const newSamples = [];

        for (const file of filesToProcess) {
            const supported =
                ALLOWED_SAMPLE_TYPES.has(file.type) ||
                ALLOWED_SAMPLE_EXTENSIONS.test(file.name);

            if (!supported) {
                setSampleUploadError(
                    `${file.name} is not supported. Use JPG, PNG, WEBP, PDF, DOC, or DOCX.`
                );
                continue;
            }

            if (file.size > MAX_SAMPLE_FILE_SIZE) {
                setSampleUploadError(
                    `${file.name} is larger than 350 KB. Please choose a smaller file.`
                );
                continue;
            }

            try {
                const data = await readFileAsDataUrl(file);

                newSamples.push({
                    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                    name: file.name,
                    type: file.type || "application/octet-stream",
                    size: file.size,
                    data,
                });
            } catch {
                setSampleUploadError(
                    `Could not read ${file.name}. Please try another file.`
                );
            }
        }

        if (newSamples.length) {
            setSampleFiles((current) =>
                [...current, ...newSamples].slice(0, MAX_SAMPLE_FILES)
            );
        }
    }

    function removeSampleFile(fileId) {
        setSampleFiles((current) =>
            current.filter((file) => file.id !== fileId)
        );

        setSampleUploadError("");
    }

    function handleSubmit(event) {
        event.preventDefault();

        if (Number(minBid) <= 0 || Number(maxBid) < Number(minBid)) return;
        if (workDescription.trim().length < 30) return;

        const proposal = {
            id: `${project.id}-${Date.now()}`,
            projectId: project.id,
            projectTitle: project.title,
            client: project.client,
            minBid: Number(minBid),
            maxBid: Number(maxBid),
            bid: Number(maxBid),
            deliveryDays: Number(delivery),
            submissionDate,
            expressAvailable: express,
            expressDays: express ? Number(expressDays) : null,
            expressFee: express ? Number(expressFee || 0) : 0,
            coverLetter: coverLetter.trim(),
            workDescription: workDescription.trim(),
            workSamples: sampleFiles,
            status: "Submitted",
            submittedAt: new Date().toISOString(),
            paymentPolicyAccepted: true,
        };

        try {
            localStorage.setItem(
                PROPOSALS_KEY,
                JSON.stringify([proposal, ...readSavedProposals()])
            );

            setSubmitted(true);
        } catch {
            window.alert(
                "The browser could not save this demo proposal and its work samples. Try removing a sample or clearing some site storage, then submit again."
            );
        }
    }

    return (
        <FreelancerLayout
            active="Find projects"
            eyebrow="PROJECT DETAILS"
            title={project.title}
            subtitle={`Posted by ${project.client} · ${project.posted}`}
        >
            <FreelancerSidebarStarAnimation/>

            <div className="fw-detail-layout">
                <article className="fw-detail-card">
                    <div className="fw-detail-meta">
                        <span className="fw-category-tag">{project.category}</span>
                        <span>{project.experience}</span>
                        <span>{project.proposals} proposals so far</span>
                    </div>

                    <h2>Project overview</h2>
                    <p>{project.description}</p>

                    <h3>Skills required</h3>

                    <div className="fw-skill-list">
                        {project.skills.map((skill) => (
                            <span className="fw-skill-chip" key={skill}>{skill}</span>
                        ))}
                    </div>

                    <div className="fw-detail-divider"/>

                    <h3>Project details</h3>

                    <div className="fw-detail-facts">
                        <div>
                            <span>Client budget</span>
                            <strong>
                                {formatWorklyMoney(project.budget)}
                                <small>{project.budgetType}</small>
                            </strong>
                        </div>

                        <div>
                            <span>Estimated duration</span>
                            <strong>{project.duration}</strong>
                        </div>

                        <div>
                            <span>Client</span>
                            <strong>{project.client}</strong>
                        </div>
                    </div>

                    <PaymentPolicyNotice/>

                    <div className="fw-tip-note">
                        <strong>Tips are optional.</strong>
                        <span>
                            Clients can leave a tip after delivery through Workly's checkout flow.
                            Tips must stay on Workly too.
                        </span>
                    </div>

                    <Link to="/freelancer/projects" className="fw-text-link">
                        ← Back to all projects
                    </Link>
                </article>

                <aside className="fw-proposal-card">
                    {submitted ? (
                        <div className="fw-success-state">
                            <span className="fw-success-icon">✓</span>
                            <h2>Proposal saved</h2>
                            <p>
                                Your demo proposal and work samples were saved in this browser.
                                They haven't been sent to a real client.
                            </p>

                            <button
                                type="button"
                                className="fw-primary-button fw-full-button"
                                onClick={() => navigate("/freelancer/proposals")}
                            >
                                View my proposals →
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="fw-proposal-form">
                            <p className="fw-eyebrow">MAKE YOUR MOVE</p>
                            <h2>Submit a proposal</h2>
                            <p className="fw-form-intro">
                                Offer a clear price range, realistic deadline, and an approach to this brief.
                            </p>

                            <div className="fw-input-two-col">
                                <label>
                                    Minimum price (₹)
                                    <input
                                        type="number"
                                        min="1"
                                        required
                                        value={minBid}
                                        onChange={(event) => setMinBid(event.target.value)}
                                    />
                                </label>

                                <label>
                                    Maximum price (₹)
                                    <input
                                        type="number"
                                        min="1"
                                        required
                                        value={maxBid}
                                        onChange={(event) => setMaxBid(event.target.value)}
                                    />
                                </label>
                            </div>

                            {Number(maxBid) > 0 && Number(minBid) > Number(maxBid) && (
                                <p className="fw-field-error">
                                    Maximum price must be at least the minimum price.
                                </p>
                            )}

                            <label>
                                Standard delivery
                                <select
                                    value={delivery}
                                    onChange={(event) => {
                                        const days = event.target.value;
                                        setDelivery(days);
                                        setSubmissionDate(dateAfterDays(days));
                                    }}
                                >
                                    <option value="3">3 days</option>
                                    <option value="7">7 days</option>
                                    <option value="14">14 days</option>
                                    <option value="21">21 days</option>
                                    <option value="30">30 days</option>
                                </select>
                            </label>

                            <label>
                                Expected submission date
                                <input
                                    type="date"
                                    min={localDateString(new Date())}
                                    required
                                    value={submissionDate}
                                    onChange={(event) => setSubmissionDate(event.target.value)}
                                />
                            </label>

                            <div className="fw-express-box">
                                <label className="fw-check-row">
                                    <input
                                        type="checkbox"
                                        checked={express}
                                        onChange={(event) => setExpress(event.target.checked)}
                                    />

                                    <span>
                                        <strong>Offer express delivery</strong>
                                        <small>Charge extra for a faster deadline.</small>
                                    </span>
                                </label>

                                {express && (
                                    <div className="fw-input-two-col">
                                        <label>
                                            Express days
                                            <select
                                                value={expressDays}
                                                onChange={(event) => setExpressDays(event.target.value)}
                                            >
                                                <option value="1">1 day</option>
                                                <option value="2">2 days</option>
                                                <option value="3">3 days</option>
                                                <option value="5">5 days</option>
                                            </select>
                                        </label>

                                        <label>
                                            Extra express fee (₹)
                                            <input
                                                type="number"
                                                min="0"
                                                required
                                                value={expressFee}
                                                onChange={(event) => setExpressFee(event.target.value)}
                                            />
                                        </label>
                                    </div>
                                )}
                            </div>

                            <label>
                                Proposal message
                                <textarea
                                    required
                                    minLength={20}
                                    rows={5}
                                    value={coverLetter}
                                    onChange={(event) => setCoverLetter(event.target.value)}
                                    placeholder="Explain your experience, delivery plan, and what is included (at least 20 characters)."
                                />
                            </label>

                            <section className="fw-work-samples-section">
                                <div className="fw-work-samples-heading">
                                    <p className="fw-eyebrow">SHOW YOUR EXPERIENCE</p>
                                    <h3>Work description & samples</h3>
                                    <p>
                                        Help the client understand the work you have done and why it is relevant to this
                                        project.
                                    </p>
                                </div>

                                <label>
                                    Describe your relevant work
                                    <textarea
                                        required
                                        minLength={30}
                                        rows={4}
                                        value={workDescription}
                                        onChange={(event) => setWorkDescription(event.target.value)}
                                        placeholder="Describe a similar project you completed, your role, the tools you used, and the result (at least 30 characters)."
                                    />
                                </label>

                                <div className="fw-sample-upload-block">
                                    <div>
                                        <strong>Attach work samples</strong>
                                        <small>Up to 2 files · 350 KB maximum per file</small>
                                    </div>

                                    <label className="fw-sample-upload-button">
                                        <input
                                            className="fw-sample-file-input"
                                            type="file"
                                            accept=".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx"
                                            multiple
                                            onChange={handleSampleUpload}
                                            disabled={sampleFiles.length >= MAX_SAMPLE_FILES}
                                        />

                                        <span aria-hidden="true">＋</span>

                                        {sampleFiles.length >= MAX_SAMPLE_FILES
                                            ? "Maximum files added"
                                            : "Choose files"}
                                    </label>
                                </div>

                                <p className="fw-sample-upload-hint">
                                    Supported: JPG, PNG, WEBP, PDF, DOC and DOCX.
                                    Attachments are optional in this demo.
                                </p>

                                {sampleUploadError && (
                                    <p className="fw-field-error" role="alert">
                                        {sampleUploadError}
                                    </p>
                                )}

                                {sampleFiles.length > 0 && (
                                    <div className="fw-sample-file-list">
                                        {sampleFiles.map((file) => (
                                            <div className="fw-sample-file-row" key={file.id}>
                                                {file.type.startsWith("image/") ? (
                                                    <img
                                                        className="fw-sample-file-thumbnail"
                                                        src={file.data}
                                                        alt={`Preview of ${file.name}`}
                                                    />
                                                ) : (
                                                    <span className="fw-sample-file-icon" aria-hidden="true">
                                                        {file.type === "application/pdf" ? "PDF" : "DOC"}
                                                    </span>
                                                )}

                                                <div className="fw-sample-file-info">
                                                    <strong title={file.name}>{file.name}</strong>
                                                    <small>{formatFileSize(file.size)}</small>
                                                </div>

                                                <button
                                                    type="button"
                                                    className="fw-sample-remove-button"
                                                    onClick={() => removeSampleFile(file.id)}
                                                    aria-label={`Remove ${file.name}`}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>

                            <label className="fw-check-row fw-policy-check">
                                <input
                                    type="checkbox"
                                    checked={policyAccepted}
                                    onChange={(event) => setPolicyAccepted(event.target.checked)}
                                    required
                                />

                                <span>
                                    I agree to keep all project payments and tips on Workly
                                    and not request or make off-platform payments.
                                </span>
                            </label>

                            <button
                                type="submit"
                                disabled={
                                    !policyAccepted ||
                                    Number(minBid) <= 0 ||
                                    Number(maxBid) < Number(minBid) ||
                                    workDescription.trim().length < 30
                                }
                                className="fw-primary-button fw-full-button"
                            >
                                Submit proposal <span aria-hidden="true">→</span>
                            </button>

                            <p className="fw-form-disclaimer">
                                Demo only: no client receives this proposal until the backend is connected.
                            </p>
                        </form>
                    )}
                </aside>
            </div>
        </FreelancerLayout>
    );
}

/* =====================================================
   MY PROPOSALS
   ===================================================== */

export function MyProposalsPage() {
    const proposals = readSavedProposals();

    return (
        <FreelancerLayout
            active="My proposals"
            eyebrow="YOUR APPLICATIONS"
            title="Keep track of your proposals."
            subtitle="Review your price ranges, deadlines, and submitted applications."
            showBrowseButton={false}
        >
            {proposals.length ? (
                <div className="fw-proposal-list">
                    {proposals.map((proposal) => (
                        <article className="fw-proposal-row" key={proposal.id}>
                            <div className="fw-project-symbol" aria-hidden="true">↗</div>

                            <div className="fw-proposal-row-copy">
                                <Link
                                    to={`/freelancer/projects/${proposal.projectId}`}
                                    className="fw-project-title"
                                >
                                    {proposal.projectTitle}
                                </Link>

                                <p>
                                    {proposal.client} ·{" "}
                                    <strong>
                                        {formatWorklyMoney(proposal.minBid ?? proposal.bid)} – {formatWorklyMoney(proposal.maxBid ?? proposal.bid)}
                                    </strong>
                                    {" "}· {proposal.deliveryDays} days
                                </p>

                                {proposal.submissionDate && (
                                    <span>
                                        Expected submission:{" "}
                                        {new Date(`${proposal.submissionDate}T00:00:00`).toLocaleDateString("en-IN")}
                                    </span>
                                )}

                                {proposal.expressAvailable && (
                                    <span>
                                        Express option: {proposal.expressDays} days for an additional{" "}
                                        {formatWorklyMoney(proposal.expressFee)}
                                    </span>
                                )}

                                <span>
                                    Submitted {new Date(proposal.submittedAt).toLocaleDateString("en-IN")}
                                </span>

                                {proposal.workDescription && (
                                    <div className="fw-proposal-work-description">
                                        <strong>Your work description</strong>
                                        <p>{proposal.workDescription}</p>
                                    </div>
                                )}

                                {proposal.workSamples?.length > 0 && (
                                    <div className="fw-proposal-work-attachments">
                                        <strong>
                                            Attached work samples ({proposal.workSamples.length})
                                        </strong>

                                        <div className="fw-proposal-attachment-list">
                                            {proposal.workSamples.map((file) => (
                                                <a
                                                    key={file.id}
                                                    href={file.data}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="fw-proposal-attachment-link"
                                                >
                                                    <span aria-hidden="true">
                                                        {file.type?.startsWith("image/")
                                                            ? "▧"
                                                            : file.type === "application/pdf"
                                                                ? "PDF"
                                                                : "DOC"}
                                                    </span>

                                                    <span>{file.name}</span>
                                                    <small>{formatFileSize(file.size)}</small>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <span className="fw-status-pill">{proposal.status}</span>
                        </article>
                    ))}
                </div>
            ) : (
                <div className="fw-empty-state">
                    <div
                        className="fw-empty-proposal-icon"
                        aria-hidden="true"
                        style={{
                            width: "56px",
                            height: "56px",
                            margin: "0 auto 18px",
                            display: "grid",
                            placeItems: "center",
                            borderRadius: "16px",
                            border: "1px solid #EAD8B6",
                            background: "#F7EBD6",
                            color: "#B18A45",
                        }}
                    >
                        <svg
                            viewBox="0 0 32 32"
                            width="30"
                            height="30"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M9 3.75h9l6 6V27a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V5.75a2 2 0 0 1 2-2Z"/>
                            <path d="M18 3.75v6h6"/>
                            <path d="M11.5 15h9M11.5 19.5h9M11.5 24h6"/>
                        </svg>
                    </div>

                    <h2>No proposals yet</h2>
                    <p>Find a project and submit a proposal to see it here.</p>

                    <Link className="fw-primary-button" to="/freelancer/projects">
                        Explore projects →
                    </Link>
                </div>
            )}

            <PaymentPolicyNotice/>
        </FreelancerLayout>
    );
}
