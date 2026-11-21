import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {useNavigate} from "react-router-dom";
import WorklyWordMark from "../components/WorklyWordMark";
import BottomNavigation from "../components/BottomNavigation";
import "./HomePage.css";

const NOTIFICATIONS_KEY = "workly_demo_notifications";

const SERVICES = [
    {
        name: "Logo Design",
        image: "/images/services/logo-design.png",
        icon: "✦",
    },
    {
        name: "Web Development",
        image: "/images/services/web-development.png",
        icon: "</>",
    },
    {
        name: "Video Editing",
        image: "/images/services/video-editing.png",
        icon: "▶",
    },
    {
        name: "Content Creation",
        image: "/images/services/content-creation.png",
        icon: "✎",
    },
    {
        name: "Branding",
        image: "/images/services/branding.png",
        icon: "↗",
    },
    {
        name: "UI/UX",
        image: "/images/services/ui-ux.png",
        icon: "▧",
    },
    {
        name: "Voice Overs",
        image: "/images/services/voice-overs.png",
        icon: "♫",
    },
    {
        name: "Audio & Music",
        image: "/images/services/audio-music.png",
        icon: "♫",
    },
    {
        name: "SEO & Analytics",
        image: "/images/services/seo-analytics.png",
        icon: "⌕",
    },
    {
        name: "Portfolio Building",
        image: "/images/services/portfolio-building.png",
        icon: "▤",
    },
    {
        name: "Prototyping",
        image: "/images/services/prototyping.png",
        icon: "✓",
    },
    {
        name: "Social Media",
        image: "/images/services/social-media.png",
        icon: "#",
    },
    {
        name: "Global Communication",
        image: "/images/services/global-communication.png",
        icon: "◎",
    },
];


// ---------------------------------------------------------
// SERVICE CARD
// ---------------------------------------------------------

function ServiceCard({service, onSelect}) {
    const [imageUnavailable, setImageUnavailable] = useState(false);

    return (
        <button
            type="button"
            className="home-service-card"
            onClick={() => onSelect(service.name)}
            aria-label={`Explore ${service.name}`}
        >
            <div className="home-service-art">
                {!imageUnavailable ? (
                    <img
                        src={service.image}
                        alt=""
                        draggable="false"
                        onError={() => setImageUnavailable(true)}
                    />
                ) : (
                    <span
                        className="home-service-fallback"
                        aria-hidden="true"
                    >
                        {service.icon}
                    </span>
                )}
            </div>

            <span className="home-service-label">
                {service.name}
            </span>
        </button>
    );
}


// ---------------------------------------------------------
// NOTIFICATION STORAGE
// ---------------------------------------------------------

function readNotifications() {
    try {
        const saved = JSON.parse(
            localStorage.getItem(NOTIFICATIONS_KEY) || "[]"
        );

        if (!Array.isArray(saved)) {
            return [];
        }

        return saved
            .filter((item) => item && typeof item === "object")
            .map((item, index) => ({
                ...item,
                id: item.id ?? `notification-${index}`,
                title: item.title || "Workly notification",
                message: item.message || item.body || "",
                read: Boolean(item.read ?? item.isRead),
            }));
    } catch {
        return [];
    }
}


function saveNotifications(notifications) {
    try {
        localStorage.setItem(
            NOTIFICATIONS_KEY,
            JSON.stringify(notifications)
        );

        return true;
    } catch {
        return false;
    }
}


function formatNotificationDate(value) {
    if (!value) {
        return "Recently";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Recently";
    }

    return date.toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    });
}


// ---------------------------------------------------------
// NOTIFICATION ICON
// ---------------------------------------------------------

function NotificationBellIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/>
            <path d="M10 21h4"/>
        </svg>
    );
}


// ---------------------------------------------------------
// NOTIFICATION PANEL
// ---------------------------------------------------------

function NotificationPanel({
                               notifications,
                               onClose,
                               onMarkRead,
                               onMarkAllRead,
                               onOpenNotification,
                           }) {
    const unreadCount = notifications.filter(
        (item) => !item.read
    ).length;

    return (
        <section
            className="home-notification-panel"
            aria-label="Notifications"
            aria-live="polite"
        >
            <div className="home-notification-heading">

                <div>
                    <h2>Notifications</h2>

                    <span>
                        {unreadCount > 0
                            ? `${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}`
                            : "Your Workly updates"}
                    </span>
                </div>

                <button
                    type="button"
                    className="home-notification-close"
                    aria-label="Close notifications"
                    onClick={onClose}
                >
                    ×
                </button>

            </div>


            {notifications.length === 0 ? (

                <div className="home-notification-empty">

                    <span
                        className="home-notification-empty-icon"
                        aria-hidden="true"
                    >
                        <svg viewBox="0 0 24 24">
                            <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/>
                            <path d="M10 21h4"/>
                        </svg>
                    </span>

                    <strong>No notifications</strong>

                    <p>
                        You're all caught up. When there's an
                        update about your projects, messages or
                        account, you'll see it here.
                    </p>

                </div>

            ) : (

                <>

                    {unreadCount > 0 && (
                        <div className="home-notification-actions">
                            <button
                                type="button"
                                onClick={onMarkAllRead}
                            >
                                Mark all as read
                            </button>
                        </div>
                    )}


                    <div className="home-notification-list">

                        {notifications.map((item) => (

                            <article
                                key={item.id}
                                className={`home-notification-item ${
                                    item.read ? "is-read" : "is-unread"
                                }`}
                            >

                                <button
                                    type="button"
                                    className="home-notification-item-content"
                                    onClick={() => {
                                        onMarkRead(item.id);
                                        onOpenNotification(item);
                                    }}
                                >

                                    <span
                                        className="home-notification-item-icon"
                                        aria-hidden="true"
                                    >
                                        ✦
                                    </span>

                                    <span className="home-notification-item-copy">

                                        <strong>
                                            {item.title}
                                        </strong>

                                        <span>
                                            {item.message}
                                        </span>

                                        <small>
                                            {formatNotificationDate(
                                                item.createdAt || item.time
                                            )}
                                        </small>

                                    </span>

                                    {!item.read && (
                                        <span
                                            className="home-notification-unread-dot"
                                            aria-label="Unread"
                                        />
                                    )}

                                </button>

                            </article>

                        ))}

                    </div>

                </>

            )}

        </section>
    );
}


// ---------------------------------------------------------
// HOME PAGE
// ---------------------------------------------------------

export default function HomePage() {

    const navigate = useNavigate();

    const notificationRef = useRef(null);

    const [search, setSearch] = useState("");

    const [notice, setNotice] = useState("");

    const [notifications, setNotifications] = useState(
        readNotifications
    );

    const [notificationsOpen, setNotificationsOpen] = useState(false);


    // Filter services

    const visibleServices = useMemo(() => {

        const query = search.trim().toLowerCase();

        if (!query) {
            return SERVICES;
        }

        return SERVICES.filter((service) =>
            service.name.toLowerCase().includes(query)
        );

    }, [search]);


    // Unread notifications

    const unreadCount = notifications.filter(
        (item) => !item.read
    ).length;


    // Close the notification panel when clicking outside.

    useEffect(() => {

        function handleOutsideClick(event) {

            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target)
            ) {
                setNotificationsOpen(false);
            }

        }

        function handleEscape(event) {

            if (event.key === "Escape") {
                setNotificationsOpen(false);
            }

        }

        document.addEventListener(
            "mousedown",
            handleOutsideClick
        );

        document.addEventListener(
            "touchstart",
            handleOutsideClick
        );

        document.addEventListener(
            "keydown",
            handleEscape
        );

        return () => {

            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );

            document.removeEventListener(
                "touchstart",
                handleOutsideClick
            );

            document.removeEventListener(
                "keydown",
                handleEscape
            );

        };

    }, []);


    // Toggle notifications

    function handleNotificationToggle() {

        setNotificationsOpen((current) => !current);

    }


    // Mark one notification as read

    function handleMarkRead(notificationId) {

        const updated = notifications.map((item) =>
            item.id === notificationId
                ? {...item, read: true}
                : item
        );

        setNotifications(updated);

        saveNotifications(updated);

    }


    // Mark every notification as read

    function handleMarkAllRead() {

        const updated = notifications.map((item) => ({
            ...item,
            read: true,
        }));

        setNotifications(updated);

        saveNotifications(updated);

    }


    // Open notification destination if supplied.

    function handleOpenNotification(notification) {

        setNotificationsOpen(false);

        const destination = notification.href || notification.link;

        if (
            typeof destination === "string" &&
            destination.startsWith("/") &&
            !destination.startsWith("//")
        ) {
            navigate(destination);
        }

    }


    // Service card navigation

    function handleServiceSelect() {

        setNotice("");

        navigate("/explore-services");

    }


    // See more services

    function handleSeeMore() {

        navigate("/explore-services");

    }


    // Search submit

    function handleSearchSubmit(event) {

        event.preventDefault();

        const query = search.trim();

        navigate(
            query
                ? `/explore-services?search=${encodeURIComponent(query)}`
                : "/explore-services"
        );

    }


    return (
        <main className="home-page">

            <div className="home-shell">

                {/* HEADER */}

                <header className="home-header">

                    <div className="home-brand-row">

                        <WorklyWordMark
                            prefix=""
                            className="home-wordmark"
                        />


                        {/* NOTIFICATION BUTTON */}

                        <div
                            className="home-notification-wrap"
                            ref={notificationRef}
                        >

                            <button
                                className="home-notification-button"
                                type="button"
                                aria-label={
                                    unreadCount > 0
                                        ? `Notifications, ${unreadCount} unread`
                                        : "Notifications"
                                }
                                aria-expanded={notificationsOpen}
                                aria-controls="home-notification-panel"
                                onClick={handleNotificationToggle}
                            >

                                <NotificationBellIcon/>

                                {unreadCount > 0 && (
                                    <span className="home-notification-dot"/>
                                )}

                            </button>


                            {notificationsOpen && (
                                <div id="home-notification-panel">
                                    <NotificationPanel
                                        notifications={notifications}
                                        onClose={() =>
                                            setNotificationsOpen(false)
                                        }
                                        onMarkRead={handleMarkRead}
                                        onMarkAllRead={handleMarkAllRead}
                                        onOpenNotification={handleOpenNotification}
                                    />
                                </div>
                            )}

                        </div>

                    </div>


                    {/* SEARCH */}

                    <form
                        className="home-search"
                        role="search"
                        onSubmit={handleSearchSubmit}
                    >

                        <svg
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <circle
                                cx="10.8"
                                cy="10.8"
                                r="6.8"
                            />

                            <path d="m16 16 4.2 4.2"/>

                        </svg>


                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Search for services"
                            aria-label="Search services"
                            autoComplete="off"
                        />


                        {search && (
                            <button
                                type="button"
                                className="home-clear-search"
                                aria-label="Clear search"
                                onClick={() => setSearch("")}
                            >
                                ×
                            </button>
                        )}

                    </form>

                </header>


                {/* MAIN CONTENT */}

                <div className="home-content">

                    <section className="home-services-section">

                        <div className="home-section-heading">

                            <h2>Popular services</h2>

                            {visibleServices.length > 2 && (
                                <button
                                    type="button"
                                    onClick={handleSeeMore}
                                >
                                    See more →
                                </button>
                            )}

                        </div>


                        <div
                            className="home-service-rail"
                            aria-label="Popular services. Swipe horizontally to explore."
                        >

                            {visibleServices.length > 0 ? (

                                visibleServices.map((service) => (

                                    <ServiceCard
                                        key={service.name}
                                        service={service}
                                        onSelect={handleServiceSelect}
                                    />

                                ))

                            ) : (

                                <p className="home-no-results">
                                    No matching services. Try another search.
                                </p>

                            )}

                        </div>

                    </section>


                    {/* PROMOTIONAL BANNER */}

                    <section
                        className="home-promo"
                        aria-labelledby="home-promo-title"
                    >

                        <img
                            className="home-promo-illustration"
                            src="/images/workly-promo-terracotta.png"
                            alt=""
                            draggable="false"
                            onError={(event) => {
                                event.currentTarget.style.display = "none";
                            }}
                        />


                        <div className="home-promo-copy">

                            <p className="home-promo-eyebrow">
                                YOUR NEXT BIG IDEA STARTS HERE
                            </p>


                            <h2 id="home-promo-title">
                                Explore beautiful work, picked for you.
                            </h2>


                            <button
                                className="home-promo-button"
                                type="button"
                                onClick={() =>
                                    navigate("/explore-services")
                                }
                            >
                                Find a freelancer{" "}
                                <span aria-hidden="true">→</span>
                            </button>

                        </div>

                    </section>


                    {notice && (
                        <p
                            className="home-notice"
                            role="status"
                            aria-live="polite"
                        >
                            {notice}
                        </p>
                    )}

                </div>


                {/* BOTTOM NAVIGATION */}

                <BottomNavigation activeTab="Home"/>

            </div>

        </main>
    );
}
