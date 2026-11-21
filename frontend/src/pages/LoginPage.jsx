import {useState} from "react";
import {useNavigate} from "react-router-dom";
import BrandBadge from "../components/BrandBadge";
import "./LoginPage.css";

function LoginPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState("");

    function handleSubmit(event) {
        event.preventDefault();

        setMessage(
            "The login UI is ready. Backend authentication will be connected next."
        );
    }

    function handleSocialLogin(provider) {
        setMessage(
            `${provider} sign-in will be connected when authentication is implemented.`
        );
    }

    return (
        <main className="login-page">
            <section className="login-shell">

                {/* Brand */}
                <header className="login-header">
                    <button
                        type="button"
                        className="login-back"
                        onClick={() => navigate("/welcome")}
                        aria-label="Back to welcome page"
                    >
                        ←
                    </button>

                    <button
                        type="button"
                        className="login-brand"
                        onClick={() => navigate("/welcome")}
                        aria-label="Workly home"
                    >
                        <BrandBadge size="40px"/>

                        <span className="login-brand-name">
              WORKLY
              <span className="login-brand-star" aria-hidden="true">
                ★
              </span>
            </span>
                    </button>
                </header>

                {/* Heading */}
                <section className="login-intro">
                    <p className="login-eyebrow">WELCOME BACK</p>

                    <h1>Sign in to Workly</h1>

                    <p className="login-subtitle">
                        Your next great project starts here.
                    </p>
                </section>

                {/* Login form */}
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="login-field">
                        <label htmlFor="login-email">
                            Email or username
                        </label>

                        <input
                            id="login-email"
                            name="email"
                            type="text"
                            autoComplete="username"
                            placeholder="Enter your email or username"
                            value={email}
                            onChange={(event) => {
                                setEmail(event.target.value);
                                setMessage("");
                            }}
                            required
                        />
                    </div>

                    <div className="login-field">
                        <div className="login-password-label">
                            <label htmlFor="login-password">
                                Password
                            </label>

                            <button
                                type="button"
                                className="login-text-button"
                                onClick={() => navigate("/forgot-password")}
                            >
                                Forgot password?
                            </button>
                        </div>

                        <div className="login-password-wrapper">
                            <input
                                id="login-password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(event) => {
                                    setPassword(event.target.value);
                                    setMessage("");
                                }}
                                required
                            />

                            <button
                                type="button"
                                className="login-show-password"
                                onClick={() => setShowPassword((current) => !current)}
                                aria-label={
                                    showPassword ? "Hide password" : "Show password"
                                }
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="login-submit">
                        Sign in
                        <span aria-hidden="true">→</span>
                    </button>

                    {message && (
                        <p className="login-message" role="status">
                            {message}
                        </p>
                    )}
                </form>

                {/* Divider */}
                <div className="login-divider">
                    <span/>
                    <p>OR CONTINUE WITH</p>
                    <span/>
                </div>

                {/* Social login buttons */}
                <div className="login-social-buttons">
                    <button
                        type="button"
                        className="login-social-button"
                        onClick={() => handleSocialLogin("Google")}
                    >
            <span className="google-symbol" aria-hidden="true">
              G
            </span>
                        Google
                    </button>

                    <button
                        type="button"
                        className="login-social-button"
                        onClick={() => handleSocialLogin("Apple")}
                    >
            <span className="apple-symbol" aria-hidden="true">
              ●
            </span>
                        Apple
                    </button>
                </div>

                {/* Registration link */}
                <footer className="login-footer">
                    <p>
                        New to Workly?

                        <button
                            type="button"
                            className="login-text-button login-signup-link"
                            onClick={() => navigate("/signup")}
                        >
                            Create an account
                        </button>
                    </p>

                    <p className="login-legal">
                        By continuing, you agree to Workly's Terms of Service
                        and Privacy Policy.
                    </p>
                </footer>

            </section>
        </main>
    );
}

export default LoginPage;