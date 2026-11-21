import {useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import BrandBadge from "../components/BrandBadge";
import BottomNavigation from "../components/BottomNavigation";
import "./ServiceDetailsPage.css";
import {FreelancerSidebarStarAnimation} from "./FreelancerPages";

const SERVICES = [
    {
        id: 1,
        title: "Logo Design",
        category: "Design & Creative",
        image: "/images/services/logo-design.png",
        provider: "Olivia Bennett",
        initials: "OB",
        description: "Distinctive logos for your next big idea.",
        price: 1500,
        rating: 4.9,
        reviews: 128,
        delivery: "3 days",
        about: "I help businesses turn their ideas into distinctive visual identities. My approach focuses on clear communication, thoughtful design and creating artwork that suits your brand.",
        deliverables: [
            "Custom logo concept",
            "Colour and typography direction",
            "High-resolution export files",
            "Files ready for digital use",
        ],
        review: "The concepts were thoughtful and the overall design direction was exactly what I needed.",
    },
    {
        id: 2,
        title: "Web Development",
        category: "Development & Tech",
        image: "/images/services/web-development.png",
        provider: "Noah Williams",
        initials: "NW",
        description: "Modern, responsive websites built for your business.",
        price: 5000,
        rating: 4.9,
        reviews: 96,
        delivery: "7 days",
        about: "I build responsive websites with an emphasis on usability, maintainable code and a consistent experience across desktop and mobile screens.",
        deliverables: [
            "Responsive page layout",
            "Core website sections",
            "Mobile and desktop styling",
            "Source files for handover",
        ],
        review: "The website layout was clean, responsive and easy to navigate.",
    },
    {
        id: 3,
        title: "Video Editing",
        category: "Video & Animation",
        image: "/images/services/video-editing.png",
        provider: "Mia Chen",
        initials: "MC",
        description: "Professional edits for videos, reels and campaigns.",
        price: 2000,
        rating: 4.8,
        reviews: 84,
        delivery: "3 days",
        about: "I edit video content for digital platforms, balancing pacing, transitions and visual consistency to help each project tell its story.",
        deliverables: [
            "Edited video sequence",
            "Basic transitions and cuts",
            "Audio level balancing",
            "Export in an agreed format",
        ],
        review: "The edit felt polished and the pacing worked well for the project.",
    },
    {
        id: 4,
        title: "Content Creation",
        category: "Writing & Content",
        image: "/images/services/content-creation.png",
        provider: "Ethan Brooks",
        initials: "EB",
        description: "Engaging content tailored to your audience.",
        price: 1800,
        rating: 4.7,
        reviews: 62,
        delivery: "4 days",
        about: "I develop clear, audience-focused content around your goals, brand voice and preferred format.",
        deliverables: [
            "Content outline",
            "Original written copy",
            "Headline suggestions",
            "One round of revisions",
        ],
        review: "The content was clear, organised and matched the brief.",
    },
    {
        id: 5,
        title: "Branding",
        category: "Design & Creative",
        image: "/images/services/branding.png",
        provider: "Sophia Turner",
        initials: "ST",
        description: "Build a consistent and memorable brand identity.",
        price: 3500,
        rating: 4.9,
        reviews: 73,
        delivery: "5 days",
        about: "I help shape a consistent visual direction for brands, from colour choices to the visual elements customers recognise.",
        deliverables: [
            "Visual direction",
            "Suggested colour palette",
            "Typography recommendations",
            "Brand asset handover",
        ],
        review: "The visual direction made the brand feel much more consistent.",
    },
    {
        id: 6,
        title: "UI/UX Design",
        category: "Design & Creative",
        image: "/images/services/ui-ux.png",
        provider: "Ava Mitchell",
        initials: "AM",
        description: "Thoughtful app and website experiences.",
        price: 4000,
        rating: 4.8,
        reviews: 91,
        delivery: "5 days",
        about: "I design interfaces that balance visual clarity with practical user flows, giving teams a clear foundation for implementation.",
        deliverables: [
            "Screen layout concepts",
            "Reusable interface elements",
            "User flow considerations",
            "Design handover files",
        ],
        review: "The screens were clear and the overall interface felt cohesive.",
    },
    {
        id: 7,
        title: "Voice Overs",
        category: "Audio",
        image: "/images/services/voice-overs.png",
        provider: "Liam Carter",
        initials: "LC",
        description: "Clear, expressive voice recordings for your project.",
        price: 1000,
        rating: 4.7,
        reviews: 45,
        delivery: "2 days",
        about: "I record voice-over audio for explainers, short promotional videos and other digital content, based on your script and direction.",
        deliverables: [
            "Voice recording",
            "Basic audio cleanup",
            "One agreed file format",
            "One round of pickup corrections",
        ],
        review: "The recording was clear and suitable for the video.",
    },
    {
        id: 8,
        title: "Audio & Music",
        category: "Audio",
        image: "/images/services/audio-music.png",
        provider: "Isabella Reed",
        initials: "IR",
        description: "Audio editing and music production for your content.",
        price: 2500,
        rating: 4.8,
        reviews: 54,
        delivery: "4 days",
        about: "I work with audio editing and music production for digital content, helping projects achieve a more consistent sound.",
        deliverables: [
            "Audio editing",
            "Basic sound balancing",
            "Exported audio file",
            "Project-specific revisions",
        ],
        review: "The audio was well balanced and ready for the next editing stage.",
    },
    {
        id: 9,
        title: "SEO & Analytics",
        category: "Marketing",
        image: "/images/services/seo-analytics.png",
        provider: "James Wilson",
        initials: "JW",
        description: "Improve discoverability with data-informed SEO.",
        price: 3000,
        rating: 4.8,
        reviews: 67,
        delivery: "5 days",
        about: "I help teams review website content and discover practical opportunities to improve search visibility and measurement.",
        deliverables: [
            "Initial SEO review",
            "Keyword recommendations",
            "Page-level improvement suggestions",
            "Summary report",
        ],
        review: "The recommendations were easy to understand and prioritise.",
    },
    {
        id: 10,
        title: "Portfolio Building",
        category: "Design & Creative",
        image: "/images/services/portfolio-building.png",
        provider: "Grace Lee",
        initials: "GL",
        description: "Present your best work in a professional portfolio.",
        price: 2200,
        rating: 4.7,
        reviews: 38,
        delivery: "4 days",
        about: "I help creative professionals organise their work into a clear portfolio that communicates their skills and experience.",
        deliverables: [
            "Portfolio structure",
            "Project presentation guidance",
            "Content organisation",
            "Final layout recommendations",
        ],
        review: "The portfolio structure made my work much easier to present.",
    },
    {
        id: 11,
        title: "Prototyping",
        category: "Development & Tech",
        image: "/images/services/prototyping.png",
        provider: "Daniel Scott",
        initials: "DS",
        description: "Bring product ideas to life with interactive prototypes.",
        price: 3200,
        rating: 4.9,
        reviews: 42,
        delivery: "4 days",
        about: "I turn product ideas into clickable prototypes that help teams explore screen flows and communicate design decisions.",
        deliverables: [
            "Screen flow",
            "Clickable prototype",
            "Interaction examples",
            "Editable design handover",
        ],
        review: "The prototype helped everyone understand the intended user flow.",
    },
    {
        id: 12,
        title: "Social Media",
        category: "Marketing",
        image: "/images/services/social-media.png",
        provider: "Chloe Adams",
        initials: "CA",
        description: "Creative social content for your brand.",
        price: 1800,
        rating: 4.6,
        reviews: 57,
        delivery: "3 days",
        about: "I help brands prepare visually consistent social content that follows their identity and speaks to their audience.",
        deliverables: [
            "Social post concepts",
            "Caption suggestions",
            "Visual direction",
            "Exported post assets",
        ],
        review: "The content fit our visual style and campaign direction.",
    },
    {
        id: 13,
        title: "Global Communication",
        category: "Writing & Content",
        image: "/images/services/global-communication.png",
        provider: "Lucas Martin",
        initials: "LM",
        description: "Clear communication support for global projects.",
        price: 1500,
        rating: 4.6,
        reviews: 31,
        delivery: "3 days",
        about: "I support clear, professional communication for project documents, business correspondence and cross-team collaboration.",
        deliverables: [
            "Review of supplied material",
            "Clarity and tone improvements",
            "Edited final copy",
            "One round of corrections",
        ],
        review: "The revised copy was clearer and easier for the team to use.",
    },
];


const PACKAGE_NAMES = ["Basic", "Standard", "Premium"];

const DEFAULT_PACKAGE_MULTIPLIERS = {
    Basic: 1,
    Standard: 2,
    Premium: 3,
};

function readPublishedGigs() {
    try {
        const saved = JSON.parse(
            localStorage.getItem("workly_demo_gigs") || "[]"
        );
        return Array.isArray(saved) ? saved : [];
    } catch {
        return [];
    }
}

function normalizeText(value) {
    return String(value || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .trim();
}

function findMatchingGig(service, gigs) {
    const serviceTitle = normalizeText(service.title);
    const serviceCategory = normalizeText(service.category);

    // Prefer a specific service title or service ID match.
    const exactMatch = gigs.find((gig) => {
        const values = [
            gig.serviceId,
            gig.title,
            gig.category,
            gig.serviceTitle,
        ];

        return values.some((value) => {
            if (value === undefined || value === null) return false;

            if (String(value) === String(service.id)) {
                return true;
            }

            return normalizeText(value) === serviceTitle;
        });
    });

    if (exactMatch) return exactMatch;

    // Next, check whether a gig title contains the service title.
    const titleMatch = gigs.find((gig) => {
        const title = normalizeText(gig.title);
        return title && title.includes(serviceTitle);
    });

    if (titleMatch) return titleMatch;

    // Use a broad category match only when it is unambiguous.
    const categoryMatches = gigs.filter(
        (gig) => normalizeText(gig.category) === serviceCategory
    );

    return categoryMatches.length === 1
        ? categoryMatches[0]
        : null;
}

function findStoredPackage(gig, packageName) {
    if (!gig) return null;

    const collections = [
        gig.packages,
        gig.packageDetails,
        gig.pricingPackages,
    ];

    for (const collection of collections) {
        if (!collection) continue;

        if (Array.isArray(collection)) {
            const match = collection.find(
                (item) =>
                    normalizeText(item.name) === normalizeText(packageName)
            );

            if (match) return match;
        } else if (typeof collection === "object") {
            const key = Object.keys(collection).find(
                (item) => normalizeText(item) === normalizeText(packageName)
            );

            if (key) return collection[key];
        }
    }

    return null;
}

function formatPackageDelivery(value, fallback) {
    const days = Number.parseInt(value, 10);
    const safeDays = Number.isFinite(days) && days > 0 ? days : fallback;

    return `${safeDays} ${safeDays === 1 ? "day" : "days"}`;
}

function normalizePackageFeatures(value, fallback) {
    if (Array.isArray(value)) {
        return value.map((item) => String(item).trim()).filter(Boolean);
    }

    if (typeof value === "string" && value.trim()) {
        return value
            .split(/\n|,/)
            .map((item) => item.trim())
            .filter(Boolean);
    }

    return fallback;
}

function buildClientPackages(service, gig) {
    return PACKAGE_NAMES.map((name) => {
        const stored = findStoredPackage(gig, name);
        const multiplier = DEFAULT_PACKAGE_MULTIPLIERS[name];

        const fallbackPrice =
            name === "Basic" && Number(gig?.minPrice) > 0
                ? Number(gig.minPrice)
                : Number(service.price) * multiplier;

        const price = Number(stored?.price);

        const revisions =
            stored?.revisions ?? (multiplier === 1 ? 1 : multiplier);

        const revisionLabel =
            Number.isFinite(Number(revisions))
                ? `${Number(revisions)} ${Number(revisions) === 1 ? "revision" : "revisions"}`
                : String(revisions);

        return {
            name,
            description:
                stored?.description ||
                `${name} package for this service`,
            price:
                Number.isFinite(price) && price > 0
                    ? price
                    : fallbackPrice,
            deliveryDays: formatPackageDelivery(
                stored?.deliveryDays ?? stored?.delivery,
                multiplier === 1 ? 3 : multiplier === 2 ? 5 : 7
            ),
            revisions: revisionLabel,
            features: normalizePackageFeatures(
                stored?.features,
                service.deliverables.slice(0, multiplier + 1)
            ),
        };
    });
}

function ArrowLeftIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M19 12H5"/>
            <path d="m12 19-7-7 7-7"/>
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

function StarIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m12 2.8 2.8 5.7 6.3.9-4.55 4.45 1.08 6.28L12 17.2l-5.63 2.96 1.08-6.28L2.9 9.4l6.3-.9L12 2.8Z"/>
        </svg>
    );
}

export default function ServiceDetailsPage() {
    const navigate = useNavigate();
    const {serviceId} = useParams();

    const service = SERVICES.find(
        (item) => item.id === Number(serviceId)
    );
    const [publishedGigs] = useState(readPublishedGigs);

    const [selectedPackage, setSelectedPackage] = useState("Standard");
    const [isSaved, setIsSaved] = useState(false);
    const [notice, setNotice] = useState("");

    if (!service) {
        return (
            <main className="service-details-page">
                <div className="service-details-shell service-not-found">
                    <BrandBadge
                        className="service-details-logo"
                        size="54px"
                    />
                    <p className="service-details-eyebrow">
                        WORKLY MARKETPLACE
                    </p>
                    <h1>Service not found</h1>
                    <p>
                        This listing is not available in the current demo.
                    </p>
                    <button
                        type="button"
                        className="service-primary-button"
                        onClick={() => navigate("/explore-services")}
                    >
                        <ArrowLeftIcon/>
                        Back to services
                    </button>
                    <BottomNavigation activeTab="Home"/>
                </div>
            </main>
        );
    }

    const matchingGig = findMatchingGig(service, publishedGigs);

    const clientPackages = buildClientPackages(service, matchingGig);

    const activePackage =
        clientPackages.find((item) => item.name === selectedPackage) ??
        clientPackages[1];

    const activePrice = activePackage.price;

    const sellerName =
        matchingGig?.freelancerName ||
        matchingGig?.provider ||
        matchingGig?.sellerName ||
        matchingGig?.ownerName ||
        service.provider;

    function handleOrderClick() {
        const params = new URLSearchParams({
            package: selectedPackage,
            price: String(activePrice),
            deliveryDays: String(
                Number.parseInt(activePackage.deliveryDays, 10)
            ),
        });

        if (matchingGig?.id) {
            params.set("gigId", String(matchingGig.id));
        }

        navigate(`/checkout/${service.id}?${params.toString()}`);
    }

    return (
        <main className="service-details-page">
            <div className="service-details-shell">
                <FreelancerSidebarStarAnimation/>

                <header className="service-details-header">
                    <button
                        type="button"
                        className="service-back-button"
                        onClick={() => navigate("/explore-services")}
                        aria-label="Back to services"
                        title="Back to services"
                    >
                        <ArrowLeftIcon/>
                    </button>

                    {/* Original Workly logo restored. Duplicate star overlay removed. */}
                    <BrandBadge
                        className="service-details-logo"
                        size="46px"
                    />

                    <div className="service-header-copy">
                        <p>YOUR WORKLY SPACE</p>
                        <h1>Service details</h1>
                    </div>
                </header>

                <div className="service-details-content">
                    <nav
                        className="service-breadcrumb"
                        aria-label="Breadcrumb"
                    >
                        <button
                            type="button"
                            onClick={() => navigate("/home")}
                        >
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
                        <span>{service.title}</span>
                    </nav>

                    <section className="service-detail-hero">
                        <div className="service-gallery">
                            <img
                                src={service.image}
                                alt={`${service.title} service artwork`}
                            />
                            <span className="service-gallery-badge">
                                {service.category}
                            </span>
                        </div>

                        <div className="service-summary">
                            <p className="service-details-eyebrow">
                                WORKLY SERVICE LISTING
                            </p>

                            <h2>{service.title}</h2>

                            <p className="service-summary-description">
                                {service.description}
                            </p>

                            <div className="service-rating-line">
                                <StarIcon/>
                                <strong>{service.rating.toFixed(1)}</strong>
                                <span>
                                    ({service.reviews} sample reviews)
                                </span>
                            </div>

                            <div className="service-seller-line">
                                <span className="service-seller-avatar">
                                    {service.initials}
                                </span>

                                <div>
                                    <strong>{service.provider}</strong>
                                    <span>Sample freelancer profile</span>
                                </div>
                            </div>

                            <div className="service-summary-price">
                                <span>Starting from</span>
                                <strong>
                                    ₹{clientPackages[0].price.toLocaleString("en-IN")}
                                </strong>
                                <span className="service-demo-pill">
                                    Demo listing
                                </span>
                            </div>

                            <button
                                type="button"
                                className={`service-save-button ${
                                    isSaved ? "saved" : ""
                                }`}
                                onClick={() => setIsSaved((current) => !current)}
                                aria-pressed={isSaved}
                            >
                                <span aria-hidden="true">
                                    {isSaved ? "♥" : "♡"}
                                </span>
                                {isSaved ? "Saved to favourites" : "Save service"}
                            </button>
                        </div>
                    </section>

                    <section className="service-packages-section">
                        <div className="service-section-heading">
                            <p className="service-details-eyebrow">
                                CHOOSE WHAT FITS
                            </p>
                            <h2>Packages & pricing</h2>
                            <p>
                                Select a package to review its sample price
                                and delivery estimate.
                            </p>
                        </div>

                        <div className="service-package-grid">
                            {clientPackages.map((item) => {
                                const isSelected = selectedPackage === item.name;

                                return (
                                    <button
                                        key={item.name}
                                        type="button"
                                        className={`service-package-card ${
                                            isSelected ? "selected" : ""
                                        }`}
                                        onClick={() => setSelectedPackage(item.name)}
                                        aria-pressed={isSelected}
                                    >
                                        <span className="service-package-top">
                                            {item.name}

                                            {isSelected && (
                                                <span className="service-package-check">
                                                    <CheckIcon/>
                                                </span>
                                            )}
                                        </span>

                                        <span className="service-package-description">
                                            {item.description}
                                        </span>

                                        <strong className="service-package-price">
                                            ₹{item.price.toLocaleString("en-IN")}
                                        </strong>

                                        <span className="service-package-detail">
                                            {item.deliveryDays} delivery
                                        </span>

                                        <span className="service-package-detail">
                                            {item.revisions}
                                        </span>

                                        <span className="service-package-features">
                                            {item.features.map((feature) => (
                                                <span key={feature}>
                                                    ✓ {feature}
                                                </span>
                                            ))}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="service-order-summary">
                            <div>
                                <span>Selected package</span>
                                <strong>
                                    {activePackage.name} · ₹
                                    {activePrice.toLocaleString("en-IN")}
                                </strong>
                            </div>

                            <button
                                type="button"
                                className="service-primary-button"
                                onClick={handleOrderClick}
                            >
                                Continue to order
                                <span aria-hidden="true">→</span>
                            </button>
                        </div>

                        {notice && (
                            <p
                                className="service-action-notice"
                                role="status"
                                aria-live="polite"
                            >
                                {notice}
                            </p>
                        )}
                    </section>

                    <section className="service-information-grid">
                        <article className="service-information-card">
                            <p className="service-details-eyebrow">
                                THE DETAILS
                            </p>
                            <h2>About this service</h2>
                            <p className="service-information-copy">
                                {service.about}
                            </p>

                            <h3>What's included</h3>
                            <ul className="service-deliverables">
                                {service.deliverables.map((item) => (
                                    <li key={item}>
                                        <span>
                                            <CheckIcon/>
                                        </span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </article>

                        <article className="service-information-card seller-card">
                            <p className="service-details-eyebrow">
                                MEET THE FREELANCER
                            </p>

                            <div className="service-seller-profile">
                                <span className="service-seller-avatar large">
                                    {service.initials}
                                </span>

                                <div>
                                    <h2>{service.provider}</h2>
                                    <p>{service.category} specialist</p>
                                </div>
                            </div>

                            <div className="service-seller-stats">
                                <div>
                                    <StarIcon/>
                                    <strong>{sellerName}</strong>
                                    <span>Sample rating</span>
                                </div>
                                <div>
                                    <strong>{service.reviews}</strong>
                                    <span>Sample reviews</span>
                                </div>
                                <div>
                                    <strong>{service.delivery}</strong>
                                    <span>Delivery estimate</span>
                                </div>
                            </div>

                            <p className="service-information-copy">
                                {service.about}
                            </p>

                            <button
                                type="button"
                                className="service-secondary-button"
                                onClick={() =>
                                    navigate(
                                        `/inbox?contact=${encodeURIComponent(
                                            service.provider
                                        )}`
                                    )
                                }
                            >
                                Message freelancer
                            </button>

                            <button
                                type="button"
                                className="service-secondary-button"
                                onClick={() => navigate(`/freelancer/${service.id}`)}
                            >
                                View freelancer profile →
                            </button>
                        </article>
                    </section>

                    <section
                        className="service-review-card"
                        style={{position: "relative"}}
                    >
                        <div
                            className="fw-sidebar-note"
                            aria-hidden="true"
                            style={{
                                position: "absolute",
                                top: "18px",
                                right: "22px",
                                margin: 0,
                                padding: 0,
                                background: "transparent",
                                color: "inherit",
                            }}
                        >
                            <span className="fw-note-star">✦</span>
                        </div>

                        <p className="service-details-eyebrow">
                            CLIENT FEEDBACK
                        </p>
                        <h2>A sample client review</h2>
                        <div className="service-review-stars" aria-label="5 stars">
                            ★★★★★
                        </div>
                        <blockquote>{service.review}</blockquote>
                        <p className="service-review-disclaimer">
                            Example review text for the design preview.
                            Reviews are not from verified customers.
                        </p>
                    </section>

                    <footer className="service-details-footer">
                        <span aria-hidden="true">✦</span>
                        <p>Find the right people for meaningful work.</p>
                        <strong>WORKLY</strong>
                    </footer>
                </div>

                <BottomNavigation activeTab="Home"/>
            </div>
        </main>
    );
}
