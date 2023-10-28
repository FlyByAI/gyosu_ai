



import './index.css'

import {
    useNavigate,
    Routes,
    Route,
    useLocation,
} from "react-router-dom";
import Contact from './pages/Contact.tsx';
import Navbar from './components/navbars/Navbar.tsx';
//Clerk
import {
    SignIn,
    SignUp,
    ClerkProvider,
} from "@clerk/clerk-react";
import { getGyosuClerkTheme } from './theme/customClerkTheme.ts';
import PrivacyPolicy from './pages/PrivacyPolicy.tsx';
import Terms from './pages/Terms.tsx';
import Footer from './components/Footer.tsx';
import ContentWrapper from './components/ContentWrapper.tsx';
import Attributions from './pages/Attributions.tsx';
import ProblemBank from './pages/ProblemBank.tsx';
import LandingPage from './pages/Landing.tsx';
import MathGenerate from './pages/MathGenerate.tsx';
import Pricing from './components/Pricing.tsx';
import Documents from './pages/Documents.tsx';
import MyProblemBanks from './pages/MathProblemBanks.tsx';
import { notSecretConstants } from './constants/notSecretConstants.tsx';
import useEnvironment from './hooks/useEnvironment.tsx';
import FAQPage from './pages/FAQPage.tsx';
import { Helmet } from "react-helmet-async";
import { getSchemaMarkup } from './helpers/getSchemaMarkup.ts';
import ContentPlaygroundStreamed from './components/ContentPlaygroundStreamed.tsx';


export default function ClerkProviderWithRoutes() {
    const navigate = useNavigate();

    const { env } = useEnvironment();

    const clerkKey = env == "production" ? notSecretConstants.clerk.PUBLISHABLE_KEY : notSecretConstants.clerk.PUBLISHABLE_DEV_KEY

    const location = useLocation();

    return (
        <ClerkProvider
            publishableKey={clerkKey}
            navigate={(to) => navigate(to)}
            appearance={getGyosuClerkTheme()}
        >
            <Helmet>
                <script type="application/ld+json">
                    {getSchemaMarkup(location)}
                </script>
            </Helmet>
            <Routes>
                <Route
                    path="/"
                    element={
                        <>
                            <Navbar />
                            <LandingPage />
                            <Footer />
                        </>
                    }
                />
                <Route
                    path="/math-app"
                    element={
                        <>
                            <Navbar />
                            <MathGenerate />
                        </>
                    }
                />
                <Route
                    path="/math-app/document/:id"
                    element={
                        <>
                            <Navbar />
                            <ProblemBank />
                        </>
                    }
                />
                <Route
                    path="/math-app/documents"
                    element={
                        <>
                            <Navbar />
                            <Documents />
                            <Footer />
                        </>
                    }
                />
                <Route
                    path="/math-app/bank"
                    element={
                        <>
                            <Navbar />
                            <MyProblemBanks />
                            <Footer />
                        </>
                    }
                />
                <Route
                    path="/math-app/playground"
                    element={
                        <>
                            <Navbar />
                            <ContentPlaygroundStreamed />
                        </>
                    }
                />
                <Route
                    path="/faq"
                    element={
                        <>
                            <Navbar />
                            <ContentWrapper>
                                <FAQPage />
                                <Footer />
                            </ContentWrapper>
                        </>
                    }
                />
                <Route
                    path="/contact"
                    element={
                        <>
                            <Navbar />
                            <ContentWrapper>
                                <Contact />
                                <Footer />
                            </ContentWrapper>
                        </>
                    }
                />
                <Route
                    path="/subscribe"
                    element={
                        <>
                            <Navbar />
                            <ContentWrapper>
                                <Pricing />
                            </ContentWrapper>
                        </>
                    }
                />
                <Route
                    path="/privacy"
                    element={
                        <>
                            <Navbar />
                            <ContentWrapper>
                                <PrivacyPolicy />
                                <Footer />
                            </ContentWrapper>
                        </>
                    }
                />
                <Route
                    path="/terms"
                    element={
                        <>
                            <Navbar />
                            <ContentWrapper>
                                <Terms />
                                <Footer />
                            </ContentWrapper>
                        </>
                    }
                />
                <Route
                    path="/attributions"
                    element={
                        <>
                            <Navbar />
                            <ContentWrapper>
                                <Attributions />
                                <Footer />
                            </ContentWrapper>
                        </>
                    }
                />
                <Route
                    path="/sign-in/*"
                    element={<><Navbar />
                        <ContentWrapper>
                            <SignIn routing="path" path="/sign-in" /><Footer />
                        </ContentWrapper>
                    </>}
                />
                <Route
                    path="/sign-up/*"
                    element={<><Navbar />
                        <ContentWrapper>
                            <SignUp routing="path" path="/sign-up" /><Footer />
                        </ContentWrapper>
                    </>}
                />

            </Routes>
        </ClerkProvider>
    );
}