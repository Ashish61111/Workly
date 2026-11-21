import {useMemo, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import BrandBadge from "../components/BrandBadge";
import BottomNavigation from "../components/BottomNavigation";
import "./ExploreServicesPage.css";

const CATEGORIES = [
    "All services",
    "Design & Creative",
    "Development & Tech",
    "Video & Animation",
    "Writing & Content",
    "Marketing",
    "Audio",
];

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
    },
];

function SearchIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="10.8" cy="10.8" r="6.8"/>
            <path d="m16 16 4.5 4.5"/>
        </svg>
    );
}

function ArrowIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14"/>
            <path d="m13 6 6 6-6 6"/>
        </svg>
    );
}

export default function ExploreServicesPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [search, setSearch] = useState(
        () => searchParams.get("search") ?? ""
    );
    const [selectedCategory, setSelectedCategory] =
        useState("All services");
    const [sortBy, setSortBy] = useState("recommended");
    const [selectedService, setSelectedService] = useState(null);

    const visibleServices = useMemo(() => {
        const query = search.trim().toLowerCase();

        const results = SERVICES.filter((service) => {
            const matchesCategory =
                selectedCategory === "All services" ||
                service.category === selectedCategory;

            const searchableText = [
                service.title,
                service.category,
                service.provider,
                service.description,
            ]
                .join(" ")
                .toLowerCase();

            const matchesSearch =
                !query || searchableText.includes(query);

            return matchesCategory && matchesSearch;
        });

        if (sortBy === "price-low") {
            results.sort((a, b) => a.price - b.price);
        } else if (sortBy === "price-high") {
            results.sort((a, b) => b.price - a.price);
        } else if (sortBy === "rating") {
            results.sort((a, b) => b.rating - a.rating);
        }

        return results;
    }, [search, selectedCategory, sortBy]);

    function clearFilters() {
        setSearch("");
        setSelectedCategory("All services");
        setSortBy("recommended");
    }

    return (
        <main className="explore-page">
            <div className="explore-shell">
                <header className="explore-header">
                    <button
                        type="button"
                        className="explore-back-button"
                        onClick={() => navigate("/home")}
                        aria-label="Back to Home"
                        title="Back to Home"
                    >
                        ←
                    </button>

                    <BrandBadge
                        className="explore-logo-badge"
                        size="48px"
                    />

                    <div className="explore-header-copy">
                        <p>YOUR WORKLY SPACE</p>
                        <h1>Explore services</h1>
                    </div>
                </header>

                <div className="explore-content">
                    <section className="explore-hero">
                        <p className="explore-eyebrow">
                            MAKE YOUR NEXT IDEA HAPPEN
                        </p>

                        <h2>
                            Great work starts
                            <br/>
                            <span>with the right people.</span>
                        </h2>

                        <p className="explore-hero-description">
                            Discover creative talent and services made
                            for your next project.
                        </p>

                        <label className="explore-search">
                            <SearchIcon/>

                            <input
                                type="search"
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Search services, skills or people"
                                aria-label="Search services, skills or people"
                            />

                            {search && (
                                <button
                                    type="button"
                                    onClick={() => setSearch("")}
                                    aria-label="Clear search"
                                >
                                    ×
                                </button>
                            )}
                        </label>
                    </section>

                    <section className="explore-categories">
                        <div className="explore-section-heading">
                            <div>
                                <p className="explore-eyebrow">
                                    FIND YOUR MATCH
                                </p>
                                <h2>Browse categories</h2>
                            </div>
                            <span aria-hidden="true">✦</span>
                        </div>

                        <div
                            className="explore-category-rail"
                            aria-label="Service categories"
                        >
                            {CATEGORIES.map((category) => (
                                <button
                                    key={category}
                                    type="button"
                                    className={`explore-category-chip ${
                                        selectedCategory === category
                                            ? "selected"
                                            : ""
                                    }`}
                                    aria-pressed={
                                        selectedCategory === category
                                    }
                                    onClick={() =>
                                        setSelectedCategory(category)
                                    }
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </section>

                    <section className="explore-listings">
                        <div className="explore-listings-heading">
                            <div>
                                <p className="explore-eyebrow">
                                    HANDPICKED FOR YOUR NEXT PROJECT
                                </p>
                                <h2>Popular services</h2>
                                <p className="explore-results-count">
                                    {visibleServices.length} services found
                                </p>
                            </div>

                            <label className="explore-sort">
                                <span>Sort by</span>
                                <select
                                    value={sortBy}
                                    onChange={(event) =>
                                        setSortBy(event.target.value)
                                    }
                                    aria-label="Sort services"
                                >
                                    <option value="recommended">
                                        Recommended
                                    </option>
                                    <option value="rating">
                                        Top rated
                                    </option>
                                    <option value="price-low">
                                        Price: low to high
                                    </option>
                                    <option value="price-high">
                                        Price: high to low
                                    </option>
                                </select>
                            </label>
                        </div>

                        <div className="explore-service-grid">
                            {visibleServices.map((service) => (
                                <article
                                    className="explore-service-card"
                                    key={service.id}
                                >
                                    <button
                                        type="button"
                                        className="explore-card-image"
                                        onClick={() => navigate(`/service/${service.id}`)
                                        }
                                        aria-label={`Preview ${service.title}`}
                                    >
                                        <img
                                            src={service.image}
                                            alt=""
                                            loading="lazy"
                                            onError={(event) => {
                                                event.currentTarget.style.visibility =
                                                    "hidden";
                                            }}
                                        />

                                        <span className="explore-image-category">
                                            {service.category}
                                        </span>
                                    </button>

                                    <div className="explore-card-body">
                                        <div className="explore-provider">
                                            <span className="explore-provider-avatar">
                                                {service.initials}
                                            </span>

                                            <span className="explore-provider-name">
                                                {service.provider}
                                            </span>

                                            <span className="explore-demo-tag">
                                                Demo
                                            </span>
                                        </div>

                                        <h3>{service.title}</h3>

                                        <p className="explore-card-description">
                                            {service.description}
                                        </p>

                                        <div className="explore-rating">
                                            <span aria-label={`${service.rating} out of 5 stars`}>
                                                ★ {service.rating.toFixed(1)}
                                            </span>
                                            <span>
                                                ({service.reviews} reviews)
                                            </span>
                                        </div>

                                        <div className="explore-card-footer">
                                            <div className="explore-price">
                                                <span>Starting at</span>
                                                <strong>
                                                    ₹{service.price.toLocaleString("en-IN")}
                                                </strong>
                                            </div>

                                            <button
                                                type="button"
                                                className="explore-details-button"
                                                onClick={() => navigate(`/service/${service.id}`)
                                                }
                                            >
                                                View <ArrowIcon/>
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>

                        {visibleServices.length === 0 && (
                            <div className="explore-empty">
                                <span aria-hidden="true">✦</span>
                                <h3>No services found</h3>
                                <p>
                                    Try another search or choose a different
                                    category.
                                </p>
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                >
                                    Clear filters
                                </button>
                            </div>
                        )}

                        <p className="explore-demo-disclaimer">
                            Demo marketplace · Names, ratings, reviews and
                            prices are sample content, not live listings.
                        </p>
                    </section>
                </div>

                <BottomNavigation activeTab="Home"/>
            </div>

            {selectedService && (
                <div
                    className="explore-preview-overlay"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            setSelectedService(null);
                        }
                    }}
                >
                    <section
                        className="explore-preview-dialog"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="explore-preview-title"
                    >
                        <button
                            type="button"
                            className="explore-preview-close"
                            onClick={() => setSelectedService(null)}
                            aria-label="Close service preview"
                        >
                            ×
                        </button>

                        <img
                            className="explore-preview-image"
                            src={selectedService.image}
                            alt=""
                        />

                        <p className="explore-eyebrow">
                            {selectedService.category}
                        </p>

                        <h2 id="explore-preview-title">
                            {selectedService.title}
                        </h2>

                        <p className="explore-preview-description">
                            {selectedService.description}
                        </p>

                        <div className="explore-preview-provider">
                            <span className="explore-provider-avatar">
                                {selectedService.initials}
                            </span>
                            <div>
                                <strong>{selectedService.provider}</strong>
                                <span>Sample freelancer profile</span>
                            </div>
                        </div>

                        <div className="explore-preview-facts">
                            <div>
                                <span>Starting price</span>
                                <strong>
                                    ₹{selectedService.price.toLocaleString("en-IN")}
                                </strong>
                            </div>
                            <div>
                                <span>Estimated delivery</span>
                                <strong>{selectedService.delivery}</strong>
                            </div>
                            <div>
                                <span>Sample rating</span>
                                <strong>
                                    ★ {selectedService.rating.toFixed(1)}
                                </strong>
                            </div>
                        </div>

                        <p className="explore-preview-note">
                            This is a preview using sample data. The full
                            service details and ordering flow will be connected
                            next.
                        </p>

                        <button
                            type="button"
                            className="explore-preview-done"
                            onClick={() => setSelectedService(null)}
                        >
                            Back to services
                        </button>
                    </section>
                </div>
            )}
        </main>
    );
}
