import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfilePage.css";

const initialProfile = {
  name: "Ashish",
  username: "ashish_workly",
  email: "ashish@example.com",
  role: "Founder & Developer",
  memberSince: "October 2025",
  about:
    "Hey there! I'm Ashish, the creator of Workly. I'm building a productivity-focused freelance marketplace that helps people discover talented professionals, share ideas, and get meaningful work done.",
};

const iconShapes = {
  bell: (
    <>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </>
  ),
  edit: (
    <>
      <path d="m15 5 4 4" />
      <path d="M4 20l4.2-.9L20 7.3 16.7 4 4.9 15.8 4 20Z" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21v-2a8 8 0 0 1 16 0v2Z" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  at: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3.5" />
      <path d="M15.5 12v2a2 2 0 0 0 4 0v-2" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3" y="7" width="18" height="14" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18" />
    </>
  ),
  home: (
    <>
      <path d="m3 10 9-7 9 7" />
      <path d="M5 9v12h14V9M9 21v-7h6v7" />
    </>
  ),
  inbox: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 13h5l2 3h4l2-3h5" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
};

function Icon({ name, size = 20 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
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

function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(initialProfile);
  const [draft, setDraft] = useState(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  const beginEditing = () => {
    setDraft(profile);
    setSavedMessage(false);
    setIsEditing(true);
  };

  const updateDraft = (field, value) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const saveProfile = (event) => {
    event.preventDefault();
    setProfile({ ...draft, name: draft.name.trim() || profile.name });
    setIsEditing(false);
    setSavedMessage(true);
  };

  const cancelEditing = () => {
    setDraft(profile);
    setIsEditing(false);
  };

  const detailRows = [
    { label: "Username", field: "username", icon: "at", prefix: "@" },
    { label: "Email address", field: "email", icon: "mail" },
    { label: "Role", field: "role", icon: "briefcase" },
  ];

  return (
    <main className="profile-page">
      <div className="profile-shell">
        <header className="profile-topbar">
          <div className="profile-wordmark" aria-label="Workly">
            WORKLY<span aria-hidden="true">★</span>
          </div>
          <button
            type="button"
            className="profile-icon-button"
            aria-label="Notifications"
            onClick={() => setSavedMessage(false)}
          >
            <Icon name="bell" size={21} />
            <span className="profile-notification-dot" />
          </button>
        </header>

        <div className="profile-main">
          <div className="profile-page-heading">
            <div>
              <p className="profile-eyebrow">YOUR WORKLY SPACE</p>
              <h1>My Profile</h1>
              <p className="profile-subtitle">A little introduction goes a long way.</p>
            </div>
            <span className="profile-status-pill">
              <span className="profile-status-dot" /> Active
            </span>
          </div>

          {savedMessage && (
            <div className="profile-save-message" role="status">
              <Icon name="check" size={16} /> Profile changes saved for this session.
            </div>
          )}

          <section className="profile-hero-card" aria-label="Profile summary">
            <div className="profile-cover">
              <span className="profile-cover-star profile-cover-star-one">✦</span>
              <span className="profile-cover-star profile-cover-star-two">✧</span>
              <span className="profile-cover-caption">YOUR STORY. YOUR WORK.</span>
            </div>
            <div className="profile-identity-row">
              <div className="profile-avatar-wrap">
                <div className="profile-avatar">
                  {(profile.name.trim().split(/\s+/).map((part) => part[0]).join("").slice(0, 2) || "W").toUpperCase()}
                </div>
                <span className="profile-avatar-online" title="Active" />
              </div>
              <div className="profile-identity-copy">
                <span className="profile-member-tag"><span>✦</span> WORKLY MEMBER</span>
                <h2>{profile.name}</h2>
                <p>@{profile.username.replace(/^@/, "")}</p>
                <span className="profile-role-chip">{profile.role}</span>
              </div>
              <button type="button" className="profile-edit-button" onClick={beginEditing}>
                <Icon name="edit" size={16} /> <span>Edit profile</span>
              </button>
            </div>
          </section>

          <div className="profile-content-grid">
            <section className="profile-card profile-details-card">
              <div className="profile-card-heading">
                <div>
                  <p className="profile-card-kicker">THE ESSENTIALS</p>
                  <h2>Profile details</h2>
                </div>
                <span className="profile-card-symbol"><Icon name="user" size={19} /></span>
              </div>

              {isEditing ? (
                <form className="profile-edit-form" onSubmit={saveProfile}>
                  <label className="profile-field">
                    <span>Full name</span>
                    <input value={draft.name} onChange={(event) => updateDraft("name", event.target.value)} required />
                  </label>
                  {detailRows.map((row) => (
                    <label className="profile-field" key={row.field}>
                      <span>{row.label}</span>
                      <input
                        type={row.field === "email" ? "email" : "text"}
                        value={draft[row.field]}
                        onChange={(event) => updateDraft(row.field, event.target.value)}
                        required
                      />
                    </label>
                  ))}
                  <div className="profile-form-actions">
                    <button type="button" className="profile-secondary-button" onClick={cancelEditing}>Cancel</button>
                    <button type="submit" className="profile-primary-button">Save changes</button>
                  </div>
                </form>
              ) : (
                <div className="profile-details-list">
                  {detailRows.map((row) => (
                    <div className="profile-detail-row" key={row.field}>
                      <span className="profile-detail-icon"><Icon name={row.icon} size={17} /></span>
                      <div className="profile-detail-copy">
                        <span className="profile-detail-label">{row.label}</span>
                        <span className="profile-detail-value">
                          {row.field === "username" ? `@${profile.username.replace(/^@/, "")}` : profile[row.field]}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className="profile-detail-row">
                    <span className="profile-detail-icon"><Icon name="calendar" size={17} /></span>
                    <div className="profile-detail-copy">
                      <span className="profile-detail-label">Member since</span>
                      <span className="profile-detail-value">{profile.memberSince}</span>
                    </div>
                  </div>
                </div>
              )}
            </section>

            <section className="profile-card profile-about-card">
              <div className="profile-card-heading">
                <div>
                  <p className="profile-card-kicker">NICE TO MEET YOU</p>
                  <h2>About me</h2>
                </div>
                <span className="profile-about-sparkle" aria-hidden="true">✦</span>
              </div>
              {isEditing ? (
                <label className="profile-field profile-about-field">
                  <span>Your introduction</span>
                  <textarea
                    rows={6}
                    value={draft.about}
                    onChange={(event) => updateDraft("about", event.target.value)}
                  />
                </label>
              ) : (
                <>
                  <p className="profile-about-copy">{profile.about}</p>
                  <div className="profile-about-note">
                    <span className="profile-about-note-mark">“</span>
                    <p>Good work starts with good people.</p>
                  </div>
                  <button type="button" className="profile-text-button" onClick={beginEditing}>
                    Tell your story <span aria-hidden="true">→</span>
                  </button>
                </>
              )}
            </section>
          </div>

          <div className="profile-bottom-note">
            <span className="profile-bottom-note-icon">✦</span>
            <p><strong>Make it yours.</strong> Keep your profile up to date so people know who they're working with.</p>
          </div>
        </div>

        <nav className="profile-bottom-nav" aria-label="Main navigation">
          <button type="button" className="profile-nav-item" onClick={() => navigate("/home")}>
            <Icon name="home" size={21} /> <span>Home</span>
          </button>
          <button type="button" className="profile-nav-item" onClick={() => navigate("/inbox")}>
            <Icon name="inbox" size={21} /> <span>Inbox</span>
          </button>
          <button type="button" className="profile-nav-item is-active" aria-current="page" onClick={() => navigate("/profile")}>
            <Icon name="user" size={21} /> <span>Profile</span>
          </button>
        </nav>
      </div>
    </main>
  );
}

export default ProfilePage;
