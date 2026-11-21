import {useEffect, useMemo, useState} from "react";
import {Link} from "react-router-dom";
import {
    getWorklyConversations,
    saveWorklyConversations,
    getWorklyUnreadCount,
} from "../utils/worklyMessages";
import "./FreelancerMessageCenter.css";

function MessageSendIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m21 3-7.2 18-3.8-7-7-3.8L21 3Z"/>
            <path d="M10 14 21 3"/>
        </svg>
    );
}

function MessageSearchIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="10.8" cy="10.8" r="6.8"/>
            <path d="m16 16 4.5 4.5"/>
        </svg>
    );
}

function formatMessageTime(value) {
    if (!value) return "";

    const date = new Date(value);

    if (!Number.isNaN(date.getTime()) && value.includes("T")) {
        return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    return value;
}

export default function FreelancerMessageCenter() {
    const [conversations, setConversations] = useState(() =>
        getWorklyConversations()
    );
    const [activeId, setActiveId] = useState(null);
    const [search, setSearch] = useState("");
    const [draft, setDraft] = useState("");

    const activeConversation =
        conversations.find((item) => item.id === activeId) || conversations[0] || null;

    const unreadCount = getWorklyUnreadCount(conversations);

    const filteredConversations = useMemo(() => {
        const term = search.trim().toLowerCase();

        if (!term) return conversations;

        return conversations.filter((item) =>
            `${item.name} ${item.role} ${item.project} ${item.preview}`
                .toLowerCase()
                .includes(term)
        );
    }, [conversations, search]);

    // Save every message and unread-count change to the shared store.
    useEffect(() => {
        saveWorklyConversations(conversations);
    }, [conversations]);

    // Keep this dashboard panel updated if Inbox changes in another browser tab.
    useEffect(() => {
        function handleStorageChange(event) {
            if (event.key !== "workly_demo_conversations") return;

            setConversations(getWorklyConversations());
        }

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    function openConversation(id) {
        setActiveId(id);
        setDraft("");

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
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            from: "me",
            time: now,
            text: value,
        };

        setConversations((current) =>
            current.map((item) =>
                item.id === activeConversation.id
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

    return (
        <section className="fw-message-center">
            <div className="fw-message-center-heading">
                <div>
                    <p className="fw-eyebrow">CLIENT COMMUNICATION</p>
                    <h2>Messages</h2>
                    <p>Keep your project conversations moving.</p>
                </div>

                <div className="fw-message-center-heading-actions">
                    {unreadCount > 0 && (
                        <span className="fw-message-unread-total">
              {unreadCount} unread
            </span>
                    )}

                    <Link to="/inbox" className="fw-message-open-inbox">
                        Full inbox <span aria-hidden="true">↗</span>
                    </Link>
                </div>
            </div>

            {conversations.length === 0 ? (
                <div className="fw-message-empty">
                    <span aria-hidden="true">✉</span>
                    <strong>No conversations yet</strong>
                    <p>Client messages will appear here when conversations are available.</p>
                    <Link to="/inbox">Open Inbox →</Link>
                </div>
            ) : (
                <div className="fw-message-center-layout">
                    <aside className="fw-message-list-panel">
                        <label className="fw-message-search">
                            <MessageSearchIcon/>
                            <input
                                type="text"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search conversations"
                                aria-label="Search conversations"
                            />
                        </label>

                        <div className="fw-message-list">
                            {filteredConversations.map((conversation) => (
                                <button
                                    key={conversation.id}
                                    type="button"
                                    className={`fw-message-contact ${
                                        activeConversation?.id === conversation.id ? "is-active" : ""
                                    }`}
                                    onClick={() => openConversation(conversation.id)}
                                >
                  <span className={`fw-message-avatar ${conversation.color || ""}`}>
                    {conversation.initials || conversation.name?.slice(0, 2) || "CL"}
                      {conversation.online && <i/>}
                  </span>

                                    <span className="fw-message-contact-copy">
                    <span className="fw-message-contact-top">
                      <strong>{conversation.name}</strong>
                      <time>{conversation.time}</time>
                    </span>
                    <span className="fw-message-contact-project">
                      {conversation.project}
                    </span>
                    <span className="fw-message-contact-preview">
                      {conversation.preview}
                    </span>
                  </span>

                                    {conversation.unread > 0 && (
                                        <span className="fw-message-unread-badge">
                      {conversation.unread}
                    </span>
                                    )}
                                </button>
                            ))}

                            {filteredConversations.length === 0 && (
                                <div className="fw-message-search-empty">
                                    No conversations match your search.
                                </div>
                            )}
                        </div>
                    </aside>

                    {activeConversation && (
                        <div className="fw-message-chat-panel">
                            <div className="fw-message-chat-header">
                <span className={`fw-message-avatar ${activeConversation.color || ""}`}>
                  {activeConversation.initials || activeConversation.name?.slice(0, 2) || "CL"}
                    {activeConversation.online && <i/>}
                </span>

                                <div>
                                    <strong>{activeConversation.name}</strong>
                                    <span>
                    {activeConversation.role || "Client"}
                                        {activeConversation.online ? " · Online" : ""}
                  </span>
                                </div>
                            </div>

                            <div className="fw-message-project-strip">
                                <span>PROJECT</span>
                                <strong>{activeConversation.project}</strong>
                            </div>

                            <div className="fw-message-chat-history">
                                {activeConversation.messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`fw-message-bubble-row ${
                                            message.from === "me" ? "is-sent" : "is-received"
                                        }`}
                                    >
                                        <div className="fw-message-bubble">
                                            <p>{message.text}</p>
                                            <time>{formatMessageTime(message.time)}</time>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <form className="fw-message-compose" onSubmit={sendMessage}>
                                <input
                                    type="text"
                                    value={draft}
                                    onChange={(event) => setDraft(event.target.value)}
                                    placeholder={`Message ${activeConversation.name}…`}
                                    aria-label={`Message ${activeConversation.name}`}
                                    maxLength={2000}
                                />

                                <button
                                    type="submit"
                                    disabled={!draft.trim()}
                                    aria-label="Send message"
                                >
                                    <MessageSendIcon/>
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            )}

            <p className="fw-message-center-footnote">
                Dashboard and Inbox share the same conversation history on this device.
            </p>
        </section>
    );
}
