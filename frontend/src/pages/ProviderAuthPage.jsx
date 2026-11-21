import {useState} from "react";
import {Link, Navigate, useParams} from "react-router-dom";
import BrandBadge from "../components/BrandBadge";
import "./ProviderAuthPage.css";

const providers = {
    google: {
        name: "Google",
        description: "Continue securely with your Google account.",
    },
    apple: {
        name: "Apple",
        description: "Continue securely with your Apple Account.",
    },
    facebook: {
        name: "Facebook",
        description: "Continue securely with your Facebook account.",
    },
};

function ProviderIcon({provider}) {
    if (provider === "google") {
        return (
            <svg
                className="provider-auth-icon"
                viewBox="0 0 48 48"
                role="img"
                aria-label="Google"
            >
                <path
                    fill="#4285F4"
                    d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5h6.6c3.9-3.6 6.1-8.8 6.1-14.9Z"
                />
                <path
                    fill="#34A853"
                    d="M24 44c5.5 0 10.1-1.8 13.5-4.8l-6.6-5c-1.8 1.2-4.1 2-6.9 2-5.3 0-9.8-3.6-11.4-8.4H5.8v5.1A20 20 0 0 0 24 44Z"
                />
                <path
                    fill="#FBBC05"
                    d="M12.6 27.8a12 12 0 0 1 0-7.6v-5.1H5.8a20 20 0 0 0 0 17.8l6.8-5.1Z"
                />
                <path
                    fill="#EA4335"
                    d="M24 11.8c3 0 5.7 1 7.8 3l5.9-5.9C34.1 5.6 29.5 4 24 4A20 20 0 0 0 5.8 15.1l6.8 5.1c1.6-4.8 6.1-8.4 11.4-8.4Z"
                />
            </svg>
        );
    }

    if (provider === "apple") {
        return (
            <svg
                className="provider-auth-icon"
                viewBox="0 0 24 24"
                role="img"
                aria-label="Apple"
            >
                <path
                    fill="currentColor"
                    d="M16.7 12.8c0-2.1 1.7-3.2 1.8-3.3-1-1.5-2.6-1.7-3.2-1.7-1.4-.2-2.7.9-3.4.9-.7 0-1.8-.9-3-.9-1.5 0-2.9.9-3.7 2.2-1.6 2.8-.4 6.9 1.2 9.2.8 1.1 1.6 2.3 2.8 2.2 1.1 0 1.6-.7 3-.7s1.8.7 3 .7c1.2 0 2-1.1 2.7-2.3.9-1.3 1.2-2.6 1.2-2.7-.1 0-2.4-.9-2.4-3.6ZM14.5 6.4c.6-.8 1-1.9.9-2.9-1 .1-2.2.7-2.9 1.5-.6.7-1.1 1.8-1 2.8 1.1.1 2.3-.5 3-1.4Z"
                />
            </svg>
        );
    }

    return (
        <svg
            className="provider-auth-icon"
            viewBox="0 0 24 24"
            role="img"
            aria-label="Facebook"
        >
            <circle cx="12" cy="12" r="12" fill="#1877F2"/>
            <path
                fill="#FFFFFF"
                d="M13.7 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V3.9c-.3 0-1.4-.1-2.6-.1-2.6 0-4.4 1.6-4.4 4.5V10H7v3h3v8h3.7Z"
            />
        </svg>
    );
}

export default function ProviderAuthPage() {
    const {provider} = useParams();
    const [notice, setNotice] = useState("");

    const providerKey = provider?.toLowerCase();
    const selectedProvider = providers[providerKey];

    if (!selectedProvider) {
        return <Navigate to="/login" replace/>;
    }

    function handleContinue() {
        setNotice(
            `${selectedProvider.name} sign-in is not connected yet. Once the official authentication integration is configured, you will continue securely with ${selectedProvider.name}.`
        );
    }

    return (
        <main className="provider-auth-page">
            <section className="provider-auth-card">
                <header className="provider-auth-topbar">
                    WORKLY Account Access
                </header>

                <div className="provider-auth-content">
                    <BrandBadge className="provider-auth-badge" size={68}/>

                    <h1>Continue with {selectedProvider.name}</h1>

                    <p className="provider-auth-subtitle">
                        {selectedProvider.description}
                    </p>

                    <div className="provider-auth-brand-row">
                        <ProviderIcon provider={providerKey}/>
                        <div>
                            <p className="provider-auth-provider-name">
                                {selectedProvider.name}
                            </p>
                            <p className="provider-auth-provider-caption">
                                Sign-in provider
                            </p>
                        </div>
                    </div>

                    <div className="provider-auth-security-note">
                        <strong>Your account security matters.</strong>
                        <p>
                            Workly will not ask you to type your{" "}
                            {selectedProvider.name} password into this page. Sign-in will
                            use the provider&apos;s official authentication process once
                            integration is enabled.
                        </p>
                    </div>

                    <button
                        className="provider-auth-primary-button"
                        type="button"
                        onClick={handleContinue}
                    >
                        Continue with {selectedProvider.name}
                    </button>

                    {notice && (
                        <p className="provider-auth-notice" role="status" aria-live="polite">
                            {notice}
                        </p>
                    )}

                    <div className="provider-auth-divider">
                        <span>OR</span>
                    </div>

                    <Link className="provider-auth-secondary-button" to="/login">
                        Sign in with email
                    </Link>

                    <p className="provider-auth-footer">
                        New to WORKLY? <Link to="/signup">Create an account</Link>
                    </p>

                    <p className="provider-auth-terms">
                        By continuing, you agree to our <Link to="/terms">Terms of Service</Link>.
                    </p>
                </div>
            </section>
        </main>
    );
}