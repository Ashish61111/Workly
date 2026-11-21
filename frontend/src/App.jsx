import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import ProviderAuthPage from "./pages/ProviderAuthPage";
import SplashPage from "./pages/SplashPage";
import WelcomePage from "./pages/WelcomePage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import InboxPage from "./pages/InboxPage";
import SupportPage from "./pages/SupportPage";

import ExploreServicesPage from "./pages/ExploreServicesPage";
import ServiceDetailsPage from "./pages/ServiceDetailsPage";
import FreelancerProfilePage from "./pages/FreelancerProfilePage";
import OrderCheckoutPage from "./pages/OrderCheckoutPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";

import {
    SignInPage,
    SignUpPage,
    EmailSignUpPage,
    ForgotPasswordPage,
} from "./pages/AuthPages";

import VerifyPage, {
    VerificationSuccessPage,
} from "./pages/VerifyPage";

// Freelancer project pages
import {
    FreelancerDashboardPage,
    BrowseProjectsPage,
    ProjectDetailsPage,
    MyProposalsPage,
} from "./pages/FreelancerPages";

// Freelancer gig management and public showcase pages
import {
    FreelancerGigsPage,
    FreelancerShowcasePage,
} from "./pages/FreelancerGigsPages";


function RoutePlaceholder({title, description}) {
    return (
        <main className="route-placeholder">
            <div>
                <h1>{title}</h1>
                <p>{description}</p>
            </div>
        </main>
    );
}


function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Main application */}
                <Route path="/" element={<SplashPage/>}/>
                <Route path="/welcome" element={<WelcomePage/>}/>
                <Route path="/home" element={<HomePage/>}/>

                {/* Client pages */}
                <Route path="/inbox" element={<InboxPage/>}/>
                <Route path="/profile" element={<ProfilePage/>}/>
                <Route path="/support" element={<SupportPage/>}/>

                <Route
                    path="/explore-services"
                    element={<ExploreServicesPage/>}
                />

                <Route
                    path="/service/:serviceId"
                    element={<ServiceDetailsPage/>}
                />

                <Route
                    path="/freelancer/:freelancerId"
                    element={<FreelancerProfilePage/>}
                />

                {/* Checkout and orders */}
                <Route
                    path="/checkout/:serviceId"
                    element={<OrderCheckoutPage/>}
                />

                <Route
                    path="/order-confirmation/:orderId"
                    element={<OrderConfirmationPage/>}
                />

                {/* Freelancer workspace */}
                <Route
                    path="/freelancer/dashboard"
                    element={<FreelancerDashboardPage/>}
                />

                <Route
                    path="/freelancer/projects"
                    element={<BrowseProjectsPage/>}
                />

                <Route
                    path="/freelancer/projects/:projectId"
                    element={<ProjectDetailsPage/>}
                />

                <Route
                    path="/freelancer/proposals"
                    element={<MyProposalsPage/>}
                />

                {/* Freelancer gig management */}
                <Route
                    path="/freelancer/my-gigs"
                    element={<FreelancerGigsPage/>}
                />

                {/* Public freelancer showcase for clients */}
                <Route
                    path="/freelancer/showcase/:freelancerId"
                    element={<FreelancerShowcasePage/>}
                />

                {/* Authentication */}
                <Route path="/login" element={<SignInPage/>}/>
                <Route path="/signup" element={<SignUpPage/>}/>
                <Route
                    path="/signup/email"
                    element={<EmailSignUpPage/>}
                />
                <Route
                    path="/forgot-password"
                    element={<ForgotPasswordPage/>}
                />

                {/* Verification */}
                <Route path="/verify-email" element={<VerifyPage/>}/>
                <Route path="/verify-phone" element={<VerifyPage/>}/>

                <Route
                    path="/verification-success"
                    element={<VerificationSuccessPage/>}
                />

                {/* Provider authentication */}
                <Route
                    path="/auth/:provider"
                    element={<ProviderAuthPage/>}
                />

                {/* Legal pages */}
                <Route
                    path="/terms"
                    element={
                        <RoutePlaceholder
                            title="Terms of Service"
                            description="Final legal content will be prepared before launch."
                        />
                    }
                />

                {/* Unknown routes */}
                <Route
                    path="*"
                    element={<Navigate to="/" replace/>}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;
