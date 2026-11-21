import {useEffect, useMemo, useState} from "react";
import {useNavigate} from "react-router-dom";
import "./InboxPage.css";
import BrandBadge from "../components/BrandBadge";
import {
    getWorklyConversations,
    saveWorklyConversations,
} from "../utils/worklyMessages";

function SearchIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="10.8" cy="10.8" r="6.8"/>
            <path d="m16 16 4.5 4.5"/>
        </svg>
    );
}

function BackIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m15 18-6-6 6-6"/>
        </svg>
    );
}

function SendIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m21 3-7.2 18-3.8-7-7-3.8L21 3Z"/>
            <path d="M10 14 21 3"/>
        </svg>
    );
}

function HomeIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10Z"/>
        </svg>
    );
}

function InboxIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3" y="4" width="18" height="16" rx="2"/>
            <path d="M3 13h5l2 3h4l2-3h5"/>
        </svg>
    );
}

function ProfileIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="8" r="4"/>
            <path d="M4 21a8 8 0 0 1 16 0"/>
        </svg>
    );
}

export default function InboxPage() {
    const navigate = useNavigate();

    // Load existing conversations from the shared Workly store.
    const [conversations, setConversations] = useState(() =>
        getWorklyConversations()
    );

    const [activeId, setActiveId] = useState(null);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All messages");
    const [draft, setDraft] = useState("");

    // Persist every conversation update to the shared store.
    useEffect(() => {
        saveWorklyConversations(conversations);
    }, [conversations]);

    const activeConversation = conversations.find(
        (item) => item.id === activeId
    );

    const filteredConversations = useMemo(() => {
        const term = search.trim().toLowerCase();

        return conversations.filter((item) => {
            const searchableText = [
                item.name,
                item.role,
                item.project,
                item.preview,
            ].join(" ").toLowerCase();

            const matchesSearch = !term || searchableText.includes(term);
            const matchesFilter =
                filter === "All messages" || item.unread > 0;

            return matchesSearch && matchesFilter;
        });
    }, [conversations, search, filter]);

    function openConversation(id) {
        setActiveId(id);
        setDraft("");

        // Opening a conversation marks its existing messages as read.
        setConversations((current) =>
            current.map((item) =>
                item.id === id ? {...item, unread: 0} : item
            )
        );
    }

    function sendMessage(event) {
        event.preventDefault();

        const value = draft.trim();

        if (!value || !activeConversation) return;

        const now = new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });

        const newMessage = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            from: "me",
            time: now,
            text: value,
        };

        setConversations((current) =>
            current.map((item) =>
                item.id === activeId
                    ? {
                        ...item,
                        time: now,
                        preview: value,
                        unread: 0,
                        messages: [...item.messages, newMessage],
                    }
                    : item
            )
        );

        setDraft("");
    }

    function navigateTab(tab) {
        if (tab === "Home") navigate("/home");
        if (tab === "Profile") navigate("/profile");
    }

    return (
        <main className="inbox-page">
            <div className={`inbox-shell ${activeConversation ? "has-conversation" : ""}`}>
                <header className="inbox-header">
                    {activeConversation ? (
                        <button
                            type="button"
                            className="inbox-back-button"
                            aria-label="Back to conversations"
                            onClick={() => setActiveId(null)}
                        >
                            <BackIcon/>
                        </button>
                    ) : (
                        <BrandBadge
                            className="inbox-logo-badge"
                            size="clamp(64px, 6vw, 82px)"
                        />
                    )}

                    <div className="inbox-header-copy">
                        <p className="inbox-overline">YOUR WORKLY SPACE</p>
                        <h1>{activeConversation ? activeConversation.name : "Inbox"}</h1>
                    </div>

                    {activeConversation ? (
                        <span
                            className={`inbox-online-indicator ${activeConversation.online ? "is-online" : ""}`}
                            title={activeConversation.online ? "Online" : "Offline"}
                        />
                    ) : (
                        <button
                            className="inbox-help-button"
                            type="button"
                            onClick={() => navigate("/support")}
                            aria-label="Get support"
                        >
                            ?
                        </button>
                    )}
                </header>

                {!activeConversation ? (
                    <>
                        <section className="inbox-intro">
                            <p>Good work starts with a conversation.</p>
                            <span>Keep your projects moving, all in one place.</span>
                        </section>

                        <label className="inbox-search">
                            <SearchIcon/>
                            <input
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search people or projects"
                                aria-label="Search people or projects"
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

                        <div className="inbox-filter-row" role="group" aria-label="Filter messages">
                            {["All messages", "Unread"].map((item) => (
                                <button
                                    key={item}
                                    type="button"
                                    className={`inbox-filter ${filter === item ? "selected" : ""}`}
                                    onClick={() => setFilter(item)}
                                >
                                    {item}
                                    {item === "Unread" && (
                                        <span className="inbox-filter-count">
                      {conversations.filter((chat) => chat.unread > 0).length}
                    </span>
                                    )}
                                </button>
                            ))}

                            <span className="inbox-message-total">
                {filteredConversations.length} chats
              </span>
                        </div>

                        <section className="inbox-conversation-list" aria-label="Conversations">
                            {filteredConversations.map((item) => (
                                <button
                                    type="button"
                                    className="inbox-conversation"
                                    key={item.id}
                                    onClick={() => openConversation(item.id)}
                                >
                  <span className={`inbox-avatar ${item.color}`}>
                    {item.initials}
                      <i className={item.online ? "online" : ""}/>
                  </span>

                                    <span className="inbox-conversation-body">
                    <span className="inbox-conversation-top">
                      <strong>{item.name}</strong>
                      <time>{item.time}</time>
                    </span>

                    <span className="inbox-project-name">{item.project}</span>
                    <span className="inbox-preview-text">{item.preview}</span>
                  </span>

                                    {item.unread > 0 && (
                                        <span className="inbox-unread-count">{item.unread}</span>
                                    )}
                                </button>
                            ))}

                            {filteredConversations.length === 0 && (
                                <div className="inbox-empty">
                                    <span>✦</span>
                                    <strong>No conversations found</strong>
                                    <p>Try another name or switch to all messages.</p>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearch("");
                                            setFilter("All messages");
                                        }}
                                    >
                                        Clear filters
                                    </button>
                                </div>
                            )}
                        </section>
                    </>
                ) : (
                    <>
                        <div className="inbox-chat-project">
                            <span>PROJECT</span>
                            <strong>{activeConversation.project}</strong>
                            <button type="button" onClick={() => navigate("/home")}>
                                View project <span>↗</span>
                            </button>
                        </div>

                        <section
                            className="inbox-chat-messages"
                            aria-label={`Messages with ${activeConversation.name}`}
                        >
                            <div className="inbox-chat-day">THIS CONVERSATION</div>

                            {activeConversation.messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`inbox-message-row ${message.from === "me" ? "sent" : "received"}`}
                                >
                                    {message.from === "them" && (
                                        <span className={`inbox-avatar tiny ${activeConversation.color}`}>
                      {activeConversation.initials}
                    </span>
                                    )}

                                    <div className="inbox-message-stack">
                                        <div className="inbox-bubble">{message.text}</div>
                                        <time>{message.time}</time>
                                    </div>
                                </div>
                            ))}
                        </section>

                        <form className="inbox-compose" onSubmit={sendMessage}>
                            <input
                                value={draft}
                                onChange={(event) => setDraft(event.target.value)}
                                placeholder="Write a message…"
                                aria-label="Write a message"
                            />
                            <button
                                type="submit"
                                disabled={!draft.trim()}
                                aria-label="Send message"
                            >
                                <SendIcon/>
                            </button>
                        </form>

                        <p className="inbox-demo-note">
                            Demo inbox · Messages are saved in this browser on this device.
                        </p>
                    </>
                )}

                <nav className="inbox-bottom-nav" aria-label="Main navigation">
                    <button
                        type="button"
                        className="inbox-nav-item"
                        onClick={() => navigateTab("Home")}
                    >
                        <HomeIcon/>
                        <span>Home</span>
                    </button>

                    <button
                        type="button"
                        className="inbox-nav-item active"
                        aria-current="page"
                    >
                        <InboxIcon/>
                        <span>Inbox</span>
                    </button>

                    <button
                        type="button"
                        className="inbox-nav-item"
                        onClick={() => navigateTab("Profile")}
                    >
                        <ProfileIcon/>
                        <span>Profile</span>
                    </button>
                </nav>
            </div>
        </main>
    );
}
