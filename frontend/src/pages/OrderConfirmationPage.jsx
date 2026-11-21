import {useMemo} from "react";
import {useNavigate, useParams} from "react-router-dom";
import BrandBadge from "../components/BrandBadge";
import BottomNavigation from "../components/BottomNavigation";
import "./OrderConfirmationPage.css";

function formatPrice(amount) {
    return `₹${Number(amount).toLocaleString("en-IN")}`;
}

function CheckIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m5 12 4 4L19 6"/>
        </svg>
    );
}

export default function OrderConfirmationPage() {
    const navigate = useNavigate();
    const {orderId} = useParams();

    const order = useMemo(() => {
        try {
            const orders = JSON.parse(
                localStorage.getItem("workly_demo_orders") || "[]"
            );

            return orders.find((item) => item.id === orderId) ?? null;
        } catch {
            return null;
        }
    }, [orderId]);

    if (!order) {
        return (
            <main className="order-confirmation-page">
                <div className="order-confirmation-shell">
                    <header className="order-confirmation-header">
                        <BrandBadge
                            className="order-confirmation-logo"
                            size="46px"
                        />
                        <div>
                            <p>YOUR WORKLY SPACE</p>
                            <h1>Order confirmation</h1>
                        </div>
                    </header>

                    <section className="order-confirmation-content order-not-found">
                        <h2>Order not found</h2>
                        <p>
                            This demo order is not available in this browser.
                            Return to the marketplace to continue.
                        </p>
                        <button
                            type="button"
                            className="order-confirmation-primary"
                            onClick={() => navigate("/explore-services")}
                        >
                            Explore services →
                        </button>
                    </section>

                    <BottomNavigation activeTab="Home"/>
                </div>
            </main>
        );
    }

    return (
        <main className="order-confirmation-page">
            <div className="order-confirmation-shell">
                <header className="order-confirmation-header">
                    <BrandBadge
                        className="order-confirmation-logo"
                        size="46px"
                    />

                    <div>
                        <p>YOUR WORKLY SPACE</p>
                        <h1>Order confirmation</h1>
                    </div>
                </header>

                <div className="order-confirmation-content">
                    <section className="order-success-card">
                        <div className="order-success-icon">
                            <CheckIcon/>
                        </div>

                        <p className="order-confirmation-eyebrow">
                            DEMO ORDER CONFIRMED
                        </p>

                        <h2>Your project is ready for its next step.</h2>

                        <p>
                            Your order details have been saved in this
                            browser as a demonstration.
                        </p>

                        <span className="order-reference">
                            Reference: {order.id}
                        </span>
                    </section>

                    <section className="order-confirmation-summary">
                        <p className="order-confirmation-eyebrow">
                            ORDER SUMMARY
                        </p>

                        <h2>{order.serviceTitle}</h2>

                        <div className="order-summary-row">
                            <span>Freelancer</span>
                            <strong>{order.provider}</strong>
                        </div>

                        <div className="order-summary-row">
                            <span>Package</span>
                            <strong>{order.packageName}</strong>
                        </div>

                        <div className="order-summary-row">
                            <span>Project title</span>
                            <strong>{order.projectTitle}</strong>
                        </div>

                        <div className="order-summary-row">
                            <span>Estimated delivery</span>
                            <strong>{order.delivery}</strong>
                        </div>

                        {order.deadline && (
                            <div className="order-summary-row">
                                <span>Preferred deadline</span>
                                <strong>{order.deadline}</strong>
                            </div>
                        )}

                        <div className="order-confirmation-total">
                            <span>Estimated package price</span>
                            <strong>{formatPrice(order.total)}</strong>
                        </div>
                    </section>

                    <section className="order-demo-disclaimer">
                        <strong>Important: demo only</strong>
                        <p>
                            This confirmation is stored only in your browser.
                            It has not been sent to a freelancer, saved to
                            Workly's server, or charged to a payment method.
                            Real order creation and payment processing still
                            need backend integration.
                        </p>
                    </section>

                    <div className="order-confirmation-actions">
                        <button
                            type="button"
                            className="order-confirmation-primary"
                            onClick={() => navigate("/explore-services")}
                        >
                            Explore more services
                        </button>

                        <button
                            type="button"
                            className="order-confirmation-secondary"
                            onClick={() => navigate("/home")}
                        >
                            Return Home
                        </button>
                    </div>
                </div>

                <BottomNavigation activeTab="Home"/>
            </div>
        </main>
    );
}
