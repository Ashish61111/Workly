import {useEffect, useRef, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import BrandBadge from "../components/BrandBadge";
import "./VerifyPage.css";

const OTP_LENGTH = 6;

function maskEmail(email) {
    if (!email) return "your email address";

    const atIndex = email.indexOf("@");
    if (atIndex <= 0) return email;

    const name = email.slice(0, atIndex);
    const maskedName =
        name.slice(0, 1) + "*".repeat(Math.max(name.length - 1, 2));

    return `${maskedName}${email.slice(atIndex)}`;
}

function maskPhone(phone) {
    if (!phone) return "your phone number";
    return `••••••${phone.slice(-4)}`;
}

export default function VerifyPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const inputRefs = useRef([]);

    const isPhone = location.pathname === "/verify-phone";
    const email = location.state?.email ?? "";
    const phone = location.state?.phone ?? "";
    const destination = isPhone ? maskPhone(phone) : maskEmail(email);

    const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(""));
    const [secondsLeft, setSecondsLeft] = useState(59);
    const [notice, setNotice] = useState("");

    useEffect(() => {
        if (secondsLeft <= 0) return undefined;

        const timer = window.setTimeout(() => {
            setSecondsLeft((previous) => previous - 1);
        }, 1000);

        return () => window.clearTimeout(timer);
    }, [secondsLeft]);

    function fillFromIndex(startIndex, rawValue) {
        const cleaned = rawValue.replace(/\D/g, "");
        if (!cleaned) return;

        const availableDigits = cleaned.slice(0, OTP_LENGTH - startIndex);

        setDigits((previous) => {
            const next = [...previous];

            availableDigits.split("").forEach((digit, offset) => {
                next[startIndex + offset] = digit;
            });

            return next;
        });

        setNotice("");

        const lastFilledIndex = Math.min(
            startIndex + availableDigits.length - 1,
            OTP_LENGTH - 1
        );

        inputRefs.current[lastFilledIndex]?.focus();
    }

    function handleChange(index, rawValue) {
        const cleaned = rawValue.replace(/\D/g, "");

        if (cleaned.length > 1) {
            fillFromIndex(index, cleaned);
            return;
        }

        setDigits((previous) => {
            const next = [...previous];
            next[index] = cleaned;
            return next;
        });

        setNotice("");

        if (cleaned && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    }

    function handlePaste(event, index) {
        event.preventDefault();
        fillFromIndex(index, event.clipboardData.getData("text"));
    }

    function handleKeyDown(event, index) {
        if (event.key === "Backspace" && !digits[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }

        if (event.key === "ArrowLeft" && index > 0) {
            event.preventDefault();
            inputRefs.current[index - 1]?.focus();
        }

        if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) {
            event.preventDefault();
            inputRefs.current[index + 1]?.focus();
        }
    }

    function handleSubmit(event) {
        event.preventDefault();

        if (digits.some((digit) => digit === "")) {
            setNotice("Please enter all six digits to continue.");
            return;
        }

        // Frontend preview only: no real OTP validation is performed.
        navigate("/verification-success", {
            state: {
                method: isPhone ? "phone" : "email",
                destination: isPhone ? phone : email,
            },
        });
    }

    function handleResend() {
        if (secondsLeft > 0) return;

        setSecondsLeft(59);
        setDigits(Array(OTP_LENGTH).fill(""));
        setNotice(
            "Preview mode: no real code has been sent. Email/SMS delivery will be connected later."
        );

        inputRefs.current[0]?.focus();
    }

    return (
        <main className="verify-page">
            <section className="verify-card">
                <header className="verify-topbar">Account verification</header>

                <div className="verify-content">
                    <BrandBadge className="verify-brand-badge" size={68}/>

                    <div className="verify-icon" aria-hidden="true">
                        {isPhone ? "☎" : "✉"}
                    </div>

                    <h1>{isPhone ? "Verify your phone" : "Verify your email"}</h1>

                    <p className="verify-subtitle">
                        Enter the 6-digit verification code for
                    </p>

                    <p className="verify-destination">{destination}</p>

                    <form className="verify-form" onSubmit={handleSubmit}>
                        <div
                            className="verify-otp-inputs"
                            role="group"
                            aria-label="Six-digit verification code"
                        >
                            {digits.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(element) => {
                                        inputRefs.current[index] = element;
                                    }}
                                    className="verify-otp-input"
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={6}
                                    autoComplete={index === 0 ? "one-time-code" : "off"}
                                    aria-label={`Digit ${index + 1}`}
                                    value={digit}
                                    onChange={(event) =>
                                        handleChange(index, event.target.value)
                                    }
                                    onPaste={(event) => handlePaste(event, index)}
                                    onKeyDown={(event) => handleKeyDown(event, index)}
                                />
                            ))}
                        </div>

                        <button className="verify-primary-button" type="submit">
                            Verify code
                        </button>
                    </form>

                    {notice && (
                        <p className="verify-notice" role="status" aria-live="polite">
                            {notice}
                        </p>
                    )}

                    <div className="verify-resend">
                        {secondsLeft > 0 ? (
                            <p>
                                Resend code in{" "}
                                <strong>00:{String(secondsLeft).padStart(2, "0")}</strong>
                            </p>
                        ) : (
                            <button
                                className="verify-text-button"
                                type="button"
                                onClick={handleResend}
                            >
                                Resend code
                            </button>
                        )}
                    </div>

                    <p className="verify-demo-note">
                        Preview only: real code delivery and verification are not connected yet.
                    </p>

                    <p className="verify-footer">
                        Entered the wrong details? <Link to="/signup/email">Go back</Link>
                    </p>
                </div>
            </section>
        </main>
    );
}

export function VerificationSuccessPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const method = location.state?.method;
    const isPhone = method === "phone";

    return (
        <main className="verify-page">
            <section className="verify-card">
                <header className="verify-topbar">Verification complete</header>

                <div className="verify-content verify-success-content">
                    <BrandBadge className="verify-brand-badge" size={68}/>

                    <div className="verify-success-body">
                        <div className="verify-success-icon" aria-hidden="true">
                            ✓
                        </div>

                        <h1>You're all set!</h1>

                        <p className="verify-subtitle">
                            You've completed the Workly verification preview
                            {isPhone ? " for your phone number." : " for your email."}
                        </p>

                        <p className="verify-demo-note">
                            This is a frontend demo. Real verification will only be confirmed
                            after the backend validates your code.
                        </p>

                        <button
                            className="verify-primary-button"
                            type="button"
                            onClick={() => navigate("/home")}
                        >
                            Continue to Workly
                        </button>

                        <p className="verify-footer">
                            Need to return to sign in? <Link to="/login">Sign in</Link>
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}
