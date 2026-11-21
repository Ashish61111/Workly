import {useMemo, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import BrandBadge from "../components/BrandBadge";
import BottomNavigation from "../components/BottomNavigation";
import "./SupportPage.css";

const SUPPORT_TOPICS = [
    {
        title: "Account & profile",
        description: "Profile details and account access",
        icon: "◎",
    },
    {
        title: "Messages",
        description: "Conversations and communication",
        icon: "✉",
    },
    {
        title: "Orders & payments",
        description: "Projects, payments and refunds",
        icon: "◇",
    },
    {
        title: "Safety & privacy",
        description: "Privacy and account safety",
        icon: "⌑",
    },
];

const FAQS = [
    {
        id: 1,
        category: "Account & profile",
        question: "How do I update my profile?",
        answer:
            "Open My Profile to review your account information. " +
            "Editing and permanently saving profile changes will be " +
            "available once the profile API is connected.",
    },
    {
        id: 2,
        category: "Account & profile",
        question: "How can I change my account details?",
        answer:
            "Account changes should be made from your profile or account " +
            "settings. Changes to email addresses and other sensitive details " +
            "should be verified before they are saved.",
    },
    {
        id: 3,
        category: "Messages",
        question: "Where can I find my conversations?",
        answer:
            "Open Inbox from the bottom navigation. You can search " +
            "conversations, filter unread messages and open a conversation " +
            "to view its messages. The current inbox uses demonstration data.",
    },
    {
        id: 4,
        category: "Messages",
        question: "Can I send messages to freelancers?",
        answer:
            "The current Inbox prototype lets you try the messaging interface. " +
            "Messages are not delivered to other users because the real-time " +
            "messaging backend has not been connected yet.",
    },
    {
        id: 5,
        category: "Orders & payments",
        question: "Where can I check my project status?",
        answer:
            "Project tracking will be available through the order and project " +
            "management features. Those features still need to be connected " +
            "to the Workly backend.",
    },
    {
        id: 6,
        category: "Orders & payments",
        question: "What should I do if a payment has a problem?",
        answer:
            "Keep your transaction details and any relevant confirmation " +
            "messages. Once payment support is available, use the support " +
            "request form to describe the problem. Never share passwords or " +
            "one-time verification codes.",
    },
    {
        id: 7,
        category: "Safety & privacy",
        question: "How can I protect my Workly account?",
        answer:
            "Use a strong, unique password, keep verification codes private, " +
            "and avoid sharing sensitive account information in messages.",
    },
    {
        id: 8,
        category: "Safety & privacy",
        question: "How do I report a suspicious message?",
        answer:
            "Do not share personal or payment information with a suspicious " +
            "sender. Workly's reporting and investigation workflow still needs " +
            "to be implemented.",
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

export default function SupportPage() {
    const navigate = useNavigate();
    const formRef = useRef(null);

    const [search, setSearch] = useState("");
    const [selectedTopic, setSelectedTopic] = useState("All topics");
    const [expandedFaq, setExpandedFaq] = useState(1);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [requestTopic, setRequestTopic] = useState(
        "General question"
    );
    const [message, setMessage] = useState("");
    const [formNotice, setFormNotice] = useState("");

    const filteredFaqs = useMemo(() => {
        const query = search.trim().toLowerCase();

        return FAQS.filter((faq) => {
            const matchesTopic =
                selectedTopic === "All topics" ||
                faq.category === selectedTopic;

            const matchesSearch =
                !query ||
                `${faq.question} ${faq.answer} ${faq.category}`
                    .toLowerCase()
                    .includes(query);

            return matchesTopic && matchesSearch;
        });
    }, [search, selectedTopic]);

    function selectTopic(topic) {
        setSelectedTopic(topic);
        setExpandedFaq(null);
    }

    function goToContactForm() {
        formRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    }

    function handleSubmit(event) {
        event.preventDefault();

        // The backend is not connected yet, so no request is sent.
        setFormNotice(
            "This is a frontend preview. Your request was not sent or saved. " +
            "Support submissions will work after the backend is connected."
        );
    }

    return (
        <main className="support-page">
            <div className="support-shell">

                <header className="support-header">
                    <button
                        type="button"
                        className="support-back-button"
                        onClick={() => navigate("/inbox")}
                        aria-label="Back to Inbox"
                        title="Back to Inbox"
                    >
                        <span aria-hidden="true">←</span>
                    </button>

                    <BrandBadge
                        className="support-logo-badge"
                        size="54px"
                    />

                    <div className="support-header-copy">
                        <p>YOUR WORKLY SPACE</p>
                        <h1>Help &amp; Support</h1>
                    </div>
                </header>


                <div className="support-content">
                    <section className="support-hero">
                        <span className="support-eyebrow">
                            WE'RE HERE TO HELP
                        </span>

                        <h2>
                            Let's get things
                            <br/>
                            <span>working smoothly.</span>
                        </h2>

                        <p>
                            Find answers, explore help topics or tell us
                            what's going on.
                        </p>

                        <label className="support-search">
                            <SearchIcon/>

                            <input
                                type="search"
                                value={search}
                                onChange={(event) => {
                                    setSearch(event.target.value);
                                    setExpandedFaq(null);
                                }}
                                placeholder="Search for answers..."
                                aria-label="Search help articles"
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

                    <section
                        className="support-topics-section"
                        aria-labelledby="support-topics-heading"
                    >
                        <div className="support-section-heading">
                            <div>
                                <p className="support-eyebrow">
                                    FIND YOUR ANSWER
                                </p>
                                <h2 id="support-topics-heading">
                                    Browse help topics
                                </h2>
                            </div>

                            <span className="support-sparkle" aria-hidden="true">
                                ✦
                            </span>
                        </div>

                        <div className="support-topic-grid">
                            {SUPPORT_TOPICS.map((topic) => (
                                <button
                                    key={topic.title}
                                    type="button"
                                    className={`support-topic-card ${
                                        selectedTopic === topic.title
                                            ? "selected"
                                            : ""
                                    }`}
                                    onClick={() => selectTopic(topic.title)}
                                    aria-pressed={
                                        selectedTopic === topic.title
                                    }
                                >
                                    <span className="support-topic-icon">
                                        {topic.icon}
                                    </span>

                                    <span className="support-topic-title">
                                        {topic.title}
                                    </span>

                                    <span className="support-topic-description">
                                        {topic.description}
                                    </span>

                                    <span className="support-topic-arrow">
                                        <ArrowIcon/>
                                    </span>
                                </button>
                            ))}
                        </div>
                    </section>

                    <section
                        className="support-faq-section"
                        aria-labelledby="support-faq-heading"
                    >
                        <div className="support-section-heading">
                            <div>
                                <p className="support-eyebrow">
                                    QUICK ANSWERS
                                </p>
                                <h2 id="support-faq-heading">
                                    Frequently asked questions
                                </h2>
                            </div>
                        </div>

                        <div className="support-filter-row">
                            <button
                                type="button"
                                className={`support-filter ${
                                    selectedTopic === "All topics"
                                        ? "selected"
                                        : ""
                                }`}
                                onClick={() => selectTopic("All topics")}
                            >
                                All topics
                            </button>

                            <span>
                                {filteredFaqs.length} articles
                            </span>
                        </div>

                        <div className="support-faq-list">
                            {filteredFaqs.map((faq) => {
                                const isExpanded = expandedFaq === faq.id;

                                return (
                                    <article
                                        className={`support-faq-item ${
                                            isExpanded ? "expanded" : ""
                                        }`}
                                        key={faq.id}
                                    >
                                        <button
                                            type="button"
                                            className="support-faq-question"
                                            onClick={() =>
                                                setExpandedFaq(
                                                    isExpanded ? null : faq.id
                                                )
                                            }
                                            aria-expanded={isExpanded}
                                        >
                                            <span>{faq.question}</span>

                                            <span
                                                className="support-faq-toggle"
                                                aria-hidden="true"
                                            >
                                                {isExpanded ? "−" : "+"}
                                            </span>
                                        </button>

                                        {isExpanded && (
                                            <div className="support-faq-answer">
                                                <p>{faq.answer}</p>
                                                <span>{faq.category}</span>
                                            </div>
                                        )}
                                    </article>
                                );
                            })}

                            {filteredFaqs.length === 0 && (
                                <div className="support-empty-state">
                                    <span aria-hidden="true">✦</span>
                                    <strong>No matching answers yet</strong>
                                    <p>
                                        Try another search or browse all topics.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearch("");
                                            selectTopic("All topics");
                                        }}
                                    >
                                        Clear filters
                                    </button>
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="support-contact-banner">
                        <div>
                            <span className="support-eyebrow">
                                NEED A HAND?
                            </span>
                            <h2>We're listening.</h2>
                            <p>
                                Describe your issue in the support form
                                below.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={goToContactForm}
                        >
                            Contact support <ArrowIcon/>
                        </button>
                    </section>

                    <section
                        className="support-contact-section"
                        ref={formRef}
                        aria-labelledby="support-contact-heading"
                    >
                        <p className="support-eyebrow">
                            GET IN TOUCH
                        </p>

                        <h2 id="support-contact-heading">
                            Send us a message
                        </h2>

                        <p className="support-contact-intro">
                            Share enough detail for the support team to
                            understand your question.
                        </p>

                        <form
                            className="support-contact-form"
                            onSubmit={handleSubmit}
                        >
                            <label className="support-field">
                                <span>Your name</span>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(event) =>
                                        setName(event.target.value)
                                    }
                                    placeholder="Enter your name"
                                    autoComplete="name"
                                    required
                                />
                            </label>

                            <label className="support-field">
                                <span>Email address</span>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(event.target.value)
                                    }
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    required
                                />
                            </label>

                            <label className="support-field">
                                <span>What do you need help with?</span>
                                <select
                                    value={requestTopic}
                                    onChange={(event) =>
                                        setRequestTopic(event.target.value)
                                    }
                                >
                                    <option>General question</option>
                                    <option>Account & profile</option>
                                    <option>Messages</option>
                                    <option>Orders & payments</option>
                                    <option>Safety & privacy</option>
                                    <option>Report a problem</option>
                                </select>
                            </label>

                            <label className="support-field">
                                <span>Describe your issue</span>
                                <textarea
                                    value={message}
                                    onChange={(event) =>
                                        setMessage(event.target.value)
                                    }
                                    placeholder="Tell us what happened and how we can help..."
                                    rows={4}
                                    minLength={10}
                                    required
                                />
                            </label>

                            <button
                                type="submit"
                                className="support-submit-button"
                            >
                                Submit support request
                                <ArrowIcon/>
                            </button>

                            {formNotice && (
                                <p
                                    className="support-form-notice"
                                    role="status"
                                    aria-live="polite"
                                >
                                    {formNotice}
                                </p>
                            )}
                        </form>
                    </section>

                    <footer className="support-footer">
                        <span className="support-footer-star">✦</span>
                        <p>Made for better work, together.</p>
                        <span>WORKLY</span>
                    </footer>
                </div>

                <BottomNavigation activeTab=""/>
            </div>
        </main>
    );
}
