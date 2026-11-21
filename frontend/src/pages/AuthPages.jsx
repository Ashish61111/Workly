import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import BrandBadge from "../components/BrandBadge";
import WorklyWordmark from "../components/WorklyWordmark";
import "./AuthPages.css";

function AuthPageFrame({heading, children}) {
    return (
        <main className="auth-page">
            <section className="auth-shell">
                <header className="auth-topbar">{heading}</header>
                <div className="auth-content">{children}</div>
            </section>
        </main>
    );
}

function PasswordField({
                           id,
                           value,
                           onChange,
                           placeholder = "Enter your password",
                           autoComplete = "current-password",
                           required = true,
                       }) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="auth-password-wrap">
            <input
                id={id}
                className="auth-field-input"
                type={showPassword ? "text" : "password"}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                autoComplete={autoComplete}
                required={required}
            />

            <button
                className="auth-password-toggle"
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Hide password" : "Show password"}
            >
                {showPassword ? "Hide" : "Show"}
            </button>
        </div>
    );
}

function AppleIcon() {
    return (
        <svg
            className="auth-provider-icon"
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path
                fill="currentColor"
                d="M16.7 12.8c0-2.1 1.7-3.2 1.8-3.3-1-1.5-2.6-1.7-3.2-1.7-1.4-.2-2.7.9-3.4.9-.7 0-1.8-.9-3-.9-1.5 0-2.9.9-3.7 2.2-1.6 2.8-.4 6.9 1.2 9.2.8 1.1 1.6 2.3 2.8 2.2 1.1 0 1.6-.7 3-.7s1.8.7 3 .7c1.2 0 2-1.1 2.7-2.3.9-1.3 1.2-2.6 1.2-2.7-.1 0-2.4-.9-2.4-3.6ZM14.5 6.4c.6-.8 1-1.9.9-2.9-1 .1-2.2.7-2.9 1.5-.6.7-1.1 1.8-1 2.8 1.1.1 2.3-.5 3-1.4Z"
            />
        </svg>
    );
}

function FacebookIcon() {
    return (
        <svg
            className="auth-provider-icon"
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <circle cx="12" cy="12" r="11" fill="#1877F2"/>
            <path
                fill="#FFFFFF"
                d="M13.5 20v-7h2.4l.4-2.8h-2.8V8.4c0-.8.2-1.4 1.4-1.4h1.5V4.5c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v1.8H7.6V13h2.6v7h3.3Z"
            />
        </svg>
    );
}

function GoogleIcon() {
    return (
        <svg
            className="auth-provider-icon"
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path
                fill="#4285F4"
                d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.7 4.7 0 0 1-2 3.1v2.5h3.2c1.9-1.8 3-4.3 3-7.4Z"
            />
            <path
                fill="#34A853"
                d="M12 22c2.7 0 5-.9 6.7-2.4l-3.3-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22Z"
            />
            <path
                fill="#FBBC05"
                d="M6.4 14a6 6 0 0 1 0-3.9V7.5H3.1a10 10 0 0 0 0 9.1L6.4 14Z"
            />
            <path
                fill="#EA4335"
                d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.9-2.9C16.9 2.9 14.6 2 12 2a10 10 0 0 0-8.9 5.5l3.3 2.6C7.2 7.7 9.4 5.9 12 5.9Z"
            />
        </svg>
    );
}

function SocialOptions() {
    const navigate = useNavigate();

    return (
        <div className="auth-social-options">
            <button
                type="button"
                className="auth-social-button auth-social-apple"
                onClick={() => navigate("/auth/apple")}
            >
                <AppleIcon/>
                <span>Continue with Apple</span>
            </button>

            <div className="auth-social-grid">
                <button
                    type="button"
                    className="auth-social-button"
                    onClick={() => navigate("/auth/facebook")}
                >
                    <FacebookIcon/>
                    <span>Facebook</span>
                </button>

                <button
                    type="button"
                    className="auth-social-button"
                    onClick={() => navigate("/auth/google")}
                >
                    <GoogleIcon/>
                    <span>Google</span>
                </button>
            </div>
        </div>
    );
}

function AuthNotice({children}) {
    if (!children) return null;

    return (
        <div className="auth-notice" role="status" aria-live="polite">
            {children}
        </div>
    );
}

export function SignInPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [notice, setNotice] = useState("");

    function handleSubmit(event) {
        event.preventDefault();

        setNotice(
            "Sign-in is not available yet. Account authentication will be enabled when the backend is connected."
        );
    }

    return (
        <AuthPageFrame heading="Sign in">
            <BrandBadge className="auth-brand-badge" size={68}/>

            <WorklyWordmark
                prefix="Welcome to"
                className="auth-wordmark"
            />

            <p className="auth-subtitle">
                Please enter your registration email and password.
            </p>

            <form className="auth-form" onSubmit={handleSubmit}>
                <div className="auth-form-group">
                    <label className="auth-visually-hidden" htmlFor="signin-email">
                        Registration email
                    </label>

                    <input
                        id="signin-email"
                        className="auth-field-input"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="Registration email"
                        autoComplete="email"
                        required
                    />
                </div>

                <div className="auth-form-group">
                    <div className="auth-label-row">
                        <label htmlFor="signin-password">Password</label>
                        <Link to="/forgot-password">Forgot Password</Link>
                    </div>

                    <PasswordField
                        id="signin-password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        autoComplete="current-password"
                    />
                </div>

                <button className="auth-primary-button" type="submit">
                    Continue
                </button>
            </form>

            <AuthNotice>{notice}</AuthNotice>

            <div className="auth-divider-label">Or continue with</div>

            <SocialOptions/>

            <p className="auth-footer-text">
                Don&apos;t have an account? <Link to="/signup">Sign up</Link>
            </p>
        </AuthPageFrame>
    );
}

export function SignUpPage() {
    return (
        <AuthPageFrame heading="Create account">
            <BrandBadge className="auth-brand-badge" size={68}/>

            <WorklyWordmark
                prefix="Join"
                className="auth-page-heading"
            />

            <p className="auth-subtitle">
                Create an account to find work or offer your services.
            </p>

            <SocialOptions/>

            <div className="auth-divider-label">Or continue with email</div>

            <Link
                className="auth-primary-button auth-button-link"
                to="/signup/email"
            >
                Sign up with Email
            </Link>

            <p className="auth-terms-text">
                By continuing, you agree to our{" "}
                <Link to="/terms">Terms of Service</Link>.
            </p>

            <p className="auth-footer-text">
                Already have an account? <Link to="/login">Sign in</Link>
            </p>
        </AuthPageFrame>
    );
}

export function EmailSignUpPage() {
    const navigate = useNavigate();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function handleSubmit(event) {
        event.preventDefault();

        navigate("/verify-email", {
            state: {email},
        });
    }

    return (
        <AuthPageFrame heading="Sign up with email">
            <BrandBadge className="auth-brand-badge" size={68}/>

            <WorklyWordmark
                prefix="Create your"
                className="auth-page-heading"
            />

            <p className="auth-subtitle">
                Enter your details to get started with WORKLY.
            </p>

            <form className="auth-form" onSubmit={handleSubmit}>
                <div className="auth-form-group">
                    <label htmlFor="signup-name">Full name</label>
                    <input
                        id="signup-name"
                        className="auth-field-input"
                        type="text"
                        value={fullName}
                        onChange={(event) => setFullName(event.target.value)}
                        placeholder="Enter your full name"
                        autoComplete="name"
                        required
                    />
                </div>

                <div className="auth-form-group">
                    <label htmlFor="signup-email">Email address</label>
                    <input
                        id="signup-email"
                        className="auth-field-input"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="Enter your email address"
                        autoComplete="email"
                        required
                    />
                </div>

                <div className="auth-form-group">
                    <label htmlFor="signup-password">Create password</label>

                    <PasswordField
                        id="signup-password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Create a password"
                        autoComplete="new-password"
                    />

                    <p className="auth-helper-text">
                        Choose a password you can keep secure.
                    </p>
                </div>

                <button className="auth-primary-button" type="submit">
                    Continue
                </button>
            </form>

            <p className="auth-terms-text">
                By continuing, you agree to our{" "}
                <Link to="/terms">Terms of Service</Link>.
            </p>

            <p className="auth-footer-text">
                Already have an account? <Link to="/login">Sign in</Link>
            </p>
        </AuthPageFrame>
    );
}

export function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [notice, setNotice] = useState("");

    function handleSubmit(event) {
        event.preventDefault();

        setNotice(
            "Password recovery is not active yet. Email delivery will be enabled when the backend is connected."
        );
    }

    return (
        <AuthPageFrame heading="Forgot password">
            <BrandBadge className="auth-brand-badge" size={68}/>

            <WorklyWordmark
                prefix="Reset your"
                className="auth-page-heading"
            />

            <p className="auth-subtitle">
                Enter your registration email to start the password recovery process.
            </p>

            <form className="auth-form" onSubmit={handleSubmit}>
                <div className="auth-form-group">
                    <label htmlFor="recovery-email">Email address</label>

                    <input
                        id="recovery-email"
                        className="auth-field-input"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="Enter your registration email"
                        autoComplete="email"
                        required
                    />
                </div>

                <button className="auth-primary-button" type="submit">
                    Continue
                </button>
            </form>

            <AuthNotice>{notice}</AuthNotice>

            <p className="auth-footer-text">
                Remember your password? <Link to="/login">Back to sign in</Link>
            </p>
        </AuthPageFrame>
    );
}
