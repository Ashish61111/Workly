import {useState} from "react";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import BrandBadge from "../components/BrandBadge";
import BottomNavigation from "../components/BottomNavigation";
import "./OrderCheckoutPage.css";

const SERVICES = [
    {
        id: 1,
        title: "Logo Design",
        provider: "Olivia Bennett",
        price: 1500,
        delivery: "3 days",
        image: "/images/services/logo-design.png"
    },
    {
        id: 2,
        title: "Web Development",
        provider: "Noah Williams",
        price: 5000,
        delivery: "7 days",
        image: "/images/services/web-development.png"
    },
    {
        id: 3,
        title: "Video Editing",
        provider: "Mia Chen",
        price: 2000,
        delivery: "3 days",
        image: "/images/services/video-editing.png"
    },
    {
        id: 4,
        title: "Content Creation",
        provider: "Ethan Brooks",
        price: 1800,
        delivery: "4 days",
        image: "/images/services/content-creation.png"
    },
    {
        id: 5,
        title: "Branding",
        provider: "Sophia Turner",
        price: 3500,
        delivery: "5 days",
        image: "/images/services/branding.png"
    },
    {
        id: 6,
        title: "UI/UX Design",
        provider: "Ava Mitchell",
        price: 4000,
        delivery: "5 days",
        image: "/images/services/ui-ux.png"
    },
    {
        id: 7,
        title: "Voice Overs",
        provider: "Liam Carter",
        price: 1000,
        delivery: "2 days",
        image: "/images/services/voice-overs.png"
    },
    {
        id: 8,
        title: "Audio & Music",
        provider: "Isabella Reed",
        price: 2500,
        delivery: "4 days",
        image: "/images/services/audio-music.png"
    },
    {
        id: 9,
        title: "SEO & Analytics",
        provider: "James Wilson",
        price: 3000,
        delivery: "5 days",
        image: "/images/services/seo-analytics.png"
    },
    {
        id: 10,
        title: "Portfolio Building",
        provider: "Grace Lee",
        price: 2200,
        delivery: "4 days",
        image: "/images/services/portfolio-building.png"
    },
    {
        id: 11,
        title: "Prototyping",
        provider: "Daniel Scott",
        price: 3200,
        delivery: "4 days",
        image: "/images/services/prototyping.png"
    },
    {
        id: 12,
        title: "Social Media",
        provider: "Chloe Adams",
        price: 1800,
        delivery: "3 days",
        image: "/images/services/social-media.png"
    },
    {
        id: 13,
        title: "Global Communication",
        provider: "Lucas Martin",
        price: 1500,
        delivery: "3 days",
        image: "/images/services/global-communication.png"
    },
];

const PACKAGES = [
    {
        name: "Starter",
        multiplier: 1,
        description: "A simple starting point",
        revisions: "1 revision",
    },
    {
        name: "Standard",
        multiplier: 2,
        description: "More room for refinement",
        revisions: "2 revisions",
    },
    {
        name: "Premium",
        multiplier: 3,
        description: "A comprehensive package",
        revisions: "3 revisions",
    },
];

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

function formatPrice(amount) {
    return `₹${amount.toLocaleString("en-IN")}`;
}

export default function OrderCheckoutPage() {
    const navigate = useNavigate();
    const {serviceId} = useParams();
    const [searchParams] = useSearchParams();

    const service = SERVICES.find(
        (item) => item.id === Number(serviceId)
    );

    const requestedPackage = searchParams.get("package");
    const validPackage = PACKAGES.some(
        (item) => item.name === requestedPackage
    );

    const [selectedPackage, setSelectedPackage] = useState(
        () => validPackage ? requestedPackage : "Standard"
    );

    const [customerName, setCustomerName] = useState("");
    const [customerEmail, setCustomerEmail] = useState("");
    const [projectTitle, setProjectTitle] = useState("");
    const [requirements, setRequirements] = useState("");
    const [deadline, setDeadline] = useState("");
    const [confirmedDetails, setConfirmedDetails] = useState(false);
    const [notice, setNotice] = useState("");
    const [isReviewing, setIsReviewing] = useState(false);

    if (!service) {
        return (
            <main className="checkout-page">
                <div className="checkout-shell checkout-not-found">
                    <BrandBadge size="54px"/>
                    <p className="checkout-eyebrow">WORKLY MARKETPLACE</p>
                    <h1>Service not found</h1>
                    <p>
                        We couldn't find this service in the current demo.
                    </p>
                    <button
                        type="button"
                        className="checkout-primary-button"
                        onClick={handleConfirmDemoOrder}
                    >
                        <ArrowLeftIcon/>
                        Back to services
                    </button>
                    <BottomNavigation activeTab="Home"/>
                </div>
            </main>
        );
    }

    const activePackage = PACKAGES.find(
        (item) => item.name === selectedPackage
    ) ?? PACKAGES[1];

    const subtotal = service.price * activePackage.multiplier;
    const total = subtotal;


    function handleSubmit(event) {
        event.preventDefault();
        setNotice("");
        setIsReviewing(true);
    }

    function handleConfirmDemoOrder() {
        const orderId = `WK-${Date.now().toString().slice(-8)}`;

        const demoOrder = {
            id: orderId,
            serviceId: service.id,
            serviceTitle: service.title,
            provider: service.provider,
            packageName: activePackage.name,
            subtotal,
            total,
            delivery: service.delivery,
            customerName,
            customerEmail,
            projectTitle,
            requirements,
            deadline,
            createdAt: new Date().toISOString(),
        };

        try {
            const existingOrders = JSON.parse(
                localStorage.getItem("workly_demo_orders") || "[]"
            );

            if (!Array.isArray(existingOrders)) {
                throw new Error("Stored demo orders are invalid.");
            }

            localStorage.setItem(
                "workly_demo_orders",
                JSON.stringify([demoOrder, ...existingOrders])
            );

            navigate(`/order-confirmation/${orderId}`);
        } catch (error) {
            console.error("Could not save demo order:", error);

            setNotice(
                "Unable to save the demo order in this browser. " +
                "Please check browser storage and try again."
            );
        }
    }


    function handleConfirmDemoOrder() {
        const orderId = `WK-${Date.now().toString().slice(-8)}`;

        const demoOrder = {
            id: orderId,
            serviceId: service.id,
            serviceTitle: service.title,
            provider: service.provider,
            packageName: activePackage.name,
            subtotal,
            total,
            delivery: service.delivery,
            customerName,
            customerEmail,
            projectTitle,
            requirements,
            deadline,
            createdAt: new Date().toISOString(),
        };

        try {
            const existingOrders = JSON.parse(
                localStorage.getItem("workly_demo_orders") || "[]"
            );

            localStorage.setItem(
                "workly_demo_orders",
                JSON.stringify([demoOrder, ...existingOrders])
            );

            navigate(`/order-confirmation/${orderId}`);
        } catch {
            setNotice(
                "The demo order could not be saved in this browser. " +
                "Check browser storage and try again."
            );
        }
    }


    return (
        <main className="checkout-page">
            <div className="checkout-shell">
                <header className="checkout-header">
                    <button
                        type="button"
                        className="checkout-back-button"
                        onClick={() => navigate(`/service/${service.id}`)}
                        aria-label="Back to service details"
                        title="Back to service details"
                    >
                        <ArrowLeftIcon/>
                    </button>

                    <BrandBadge
                        className="checkout-logo-badge"
                        size="46px"
                    />

                    <div className="checkout-header-copy">
                        <p>YOUR WORKLY SPACE</p>
                        <h1>Order & Checkout</h1>
                    </div>
                </header>

                <div className="checkout-content">
                    <nav className="checkout-breadcrumb" aria-label="Breadcrumb">
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
                        <span>Checkout</span>
                    </nav>

                    <section className="checkout-heading">
                        <p className="checkout-eyebrow">ONE STEP CLOSER</p>
                        <h2>Let's make it happen.</h2>
                        <p>
                            Review your package and tell the freelancer
                            what you need.
                        </p>
                    </section>

                    <div className="checkout-step-indicator">
                        <div className="checkout-step active">
                            <span>1</span>
                            <p>Requirements</p>
                        </div>
                        <div className="checkout-step-line"/>
                        <div className="checkout-step">
                            <span>2</span>
                            <p>Review order</p>
                        </div>
                        <div className="checkout-step-line"/>
                        <div className="checkout-step">
                            <span>3</span>
                            <p>Payment</p>
                        </div>
                    </div>

                    <form
                        className="checkout-form"
                        onSubmit={handleSubmit}
                    >
                        <section className="checkout-section">
                            <div className="checkout-section-heading">
                                <div>
                                    <p className="checkout-eyebrow">
                                        TELL US ABOUT YOUR PROJECT
                                    </p>
                                    <h2>Project requirements</h2>
                                </div>
                                <span className="checkout-section-number">
                                    01
                                </span>
                            </div>

                            <label className="checkout-field">
                                <span>Your name</span>
                                <input
                                    type="text"
                                    value={customerName}
                                    onChange={(event) =>
                                        setCustomerName(event.target.value)
                                    }
                                    placeholder="Enter your full name"
                                    autoComplete="name"
                                    required
                                />
                            </label>

                            <label className="checkout-field">
                                <span>Email address</span>
                                <input
                                    type="email"
                                    value={customerEmail}
                                    onChange={(event) =>
                                        setCustomerEmail(event.target.value)
                                    }
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    required
                                />
                            </label>

                            <label className="checkout-field">
                                <span>Project title</span>
                                <input
                                    type="text"
                                    value={projectTitle}
                                    onChange={(event) =>
                                        setProjectTitle(event.target.value)
                                    }
                                    placeholder={`e.g. My new ${service.title.toLowerCase()} project`}
                                    maxLength={120}
                                    required
                                />
                            </label>

                            <label className="checkout-field">
                                <span>Project requirements</span>
                                <textarea
                                    value={requirements}
                                    onChange={(event) =>
                                        setRequirements(event.target.value)
                                    }
                                    placeholder="Describe your goals, preferences, reference material and what a successful result looks like..."
                                    rows={5}
                                    minLength={10}
                                    maxLength={3000}
                                    required
                                />
                                <small>
                                    {requirements.length}/3000 characters
                                </small>
                            </label>

                            <label className="checkout-field">
                                <span>
                                    Preferred deadline
                                    <small className="checkout-optional">
                                        Optional
                                    </small>
                                </span>
                                <input
                                    type="date"
                                    value={deadline}
                                    min={new Date().toLocaleDateString("en-CA")}
                                    onChange={(event) =>
                                        setDeadline(event.target.value)
                                    }
                                />
                            </label>

                            <p className="checkout-field-note">
                                Please don't include passwords, verification
                                codes or other sensitive information in your
                                project description.
                            </p>
                        </section>

                        <section className="checkout-section">
                            <div className="checkout-section-heading">
                                <div>
                                    <p className="checkout-eyebrow">
                                        CHOOSE YOUR PACKAGE
                                    </p>
                                    <h2>What works for you?</h2>
                                </div>
                                <span className="checkout-section-number">
                                    02
                                </span>
                            </div>

                            <div className="checkout-package-options">
                                {PACKAGES.map((item) => {
                                    const selected = item.name === selectedPackage;
                                    const packagePrice =
                                        service.price * item.multiplier;

                                    return (
                                        <button
                                            type="button"
                                            key={item.name}
                                            className={`checkout-package-option ${
                                                selected ? "selected" : ""
                                            }`}
                                            onClick={() => {
                                                setSelectedPackage(item.name);
                                                setNotice("");
                                            }}
                                            aria-pressed={selected}
                                        >
                                            <span className="checkout-package-radio">
                                                {selected && (
                                                    <span/>
                                                )}
                                            </span>

                                            <span className="checkout-package-copy">
                                                <strong>{item.name}</strong>
                                                <span>{item.description}</span>
                                                <small>{item.revisions}</small>
                                            </span>

                                            <strong className="checkout-package-price">
                                                {formatPrice(packagePrice)}
                                            </strong>
                                        </button>
                                    );
                                })}
                            </div>

                            <p className="checkout-package-note">
                                Package prices are demonstration values.
                                Final pricing and delivery terms must be
                                confirmed with the freelancer.
                            </p>
                        </section>

                        <section className="checkout-confirmation">
                            <label className="checkout-confirmation-label">
                                <input
                                    type="checkbox"
                                    checked={confirmedDetails}
                                    onChange={(event) => {
                                        setConfirmedDetails(event.target.checked);
                                        setNotice("");
                                    }}
                                    required
                                />
                                <span>
                                    I have reviewed the information above and
                                    confirm that it describes my project.
                                </span>
                            </label>
                        </section>

                        <button
                            type="submit"
                            className="checkout-primary-button checkout-submit-button"
                        >
                            Review order
                            <span aria-hidden="true">→</span>
                        </button>

                        {notice && (
                            <p
                                className="checkout-notice"
                                role="status"
                                aria-live="polite"
                            >
                                <CheckIcon/>
                                <span>{notice}</span>
                            </p>
                        )}
                    </form>

                    <aside className="checkout-order-summary">

                        {isReviewing && (
                            <section
                                className="checkout-review-panel"
                                aria-labelledby="checkout-review-heading"
                            >
                                <p className="checkout-eyebrow">FINAL CHECK</p>
                                <h2 id="checkout-review-heading">Review your order</h2>
                                <p className="checkout-review-intro">
                                    Check your details before proceeding.
                                </p>

                                <div className="checkout-review-row">
                                    <span>Service</span>
                                    <strong>{service.title}</strong>
                                </div>

                                <div className="checkout-review-row">
                                    <span>Freelancer</span>
                                    <strong>{service.provider}</strong>
                                </div>

                                <div className="checkout-review-row">
                                    <span>Package</span>
                                    <strong>{activePackage.name}</strong>
                                </div>

                                <div className="checkout-review-row">
                                    <span>Customer</span>
                                    <strong>{customerName}</strong>
                                </div>

                                <div className="checkout-review-row">
                                    <span>Email</span>
                                    <strong>{customerEmail}</strong>
                                </div>

                                <div className="checkout-review-row">
                                    <span>Project title</span>
                                    <strong>{projectTitle}</strong>
                                </div>

                                <div className="checkout-review-requirements">
                                    <span>Project requirements</span>
                                    <p>{requirements}</p>
                                </div>

                                {deadline && (
                                    <div className="checkout-review-row">
                                        <span>Preferred deadline</span>
                                        <strong>{deadline}</strong>
                                    </div>
                                )}

                                <div className="checkout-review-total">
                                    <span>Estimated package price</span>
                                    <strong>{formatPrice(total)}</strong>
                                </div>

                                <div className="checkout-review-actions">
                                    <button
                                        type="button"
                                        className="checkout-edit-button"
                                        onClick={() => {
                                            setIsReviewing(false);
                                            setNotice("");
                                        }}
                                    >
                                        Edit details
                                    </button>


                                    <button
                                        type="button"
                                        className="checkout-primary-button"
                                        onClick={handleConfirmDemoOrder}
                                    >
                                        Confirm demo order
                                    </button>

                                </div>

                                {notice && (
                                    <p className="checkout-notice" role="status" aria-live="polite">
                                        <span>{notice}</span>
                                    </p>
                                )}
                            </section>
                        )}

                        <div className="checkout-summary-heading">
                            <div>
                                <p className="checkout-eyebrow">
                                    YOUR SELECTION
                                </p>
                                <h2>Order summary</h2>
                            </div>
                            <span aria-hidden="true">✦</span>
                        </div>

                        <div className="checkout-summary-service">
                            <img src={service.image} alt=""/>

                            <div>
                                <strong>{service.title}</strong>
                                <span>by {service.provider}</span>
                                <span className="checkout-demo-label">
                                    Demo listing
                                </span>
                            </div>
                        </div>

                        <div className="checkout-summary-row">
                            <span>Selected package</span>
                            <strong>{activePackage.name}</strong>
                        </div>

                        <div className="checkout-summary-row">
                            <span>Delivery estimate</span>
                            <strong>{service.delivery}</strong>
                        </div>

                        <div className="checkout-summary-row">
                            <span>Package subtotal</span>
                            <strong>{formatPrice(subtotal)}</strong>
                        </div>

                        <div className="checkout-summary-row">
                            <span>Additional fees</span>
                            <strong>Not calculated</strong>
                        </div>

                        <div className="checkout-summary-total">
                            <span>Estimated package price</span>
                            <strong>{formatPrice(total)}</strong>
                        </div>

                        <div className="checkout-payment-note">
                            <span aria-hidden="true">◇</span>
                            <p>
                                Payment options will appear here after secure
                                payment processing is implemented.
                            </p>
                        </div>

                        <div className="checkout-summary-assurance">
                            <span>
                                <CheckIcon/>
                            </span>
                            <p>
                                Your selection can be reviewed before any
                                future payment step.
                            </p>
                        </div>
                    </aside>

                    <footer className="checkout-footer">
                        <span aria-hidden="true">✦</span>
                        <p>Better work begins with a clear plan.</p>
                        <strong>WORKLY</strong>
                    </footer>
                </div>

                <BottomNavigation activeTab="Home"/>
            </div>
        </main>
    );
}
