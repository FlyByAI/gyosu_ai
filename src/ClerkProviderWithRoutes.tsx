



import './index.css';

import {
    Route,
    Routes,
    useLocation,
    useNavigate,
} from "react-router-dom";
import Navbar from './components/navbars/Navbar.tsx';
import Contact from './pages/Contact.tsx';
//Clerk
import {
    ClerkProvider,
    SignIn,
    SignUp,
} from "@clerk/clerk-react";
import { Helmet } from "react-helmet-async";
import ContentMultipleStreamedExample from './components/ContentMultipleStreamedExample.tsx';
import ContentPlaygroundStreamed from './components/ContentPlaygroundStreamed.tsx';
import ContentWrapper from './components/ContentWrapper.tsx';
import Footer from './components/Footer.tsx';
import Pricing from './components/Pricing.tsx';
import { notSecretConstants } from './constants/notSecretConstants.tsx';
import { getSchemaMarkup } from './helpers/getSchemaMarkup.ts';
import useEnvironment from './hooks/useEnvironment.tsx';
import Attributions from './pages/Attributions.tsx';
import Documents from './pages/Documents.tsx';
import FAQPage from './pages/FAQPage.tsx';
import GyosuAIChat from './pages/GyosuAIChat.tsx';
import GyosuAIChatShare from './pages/GyosuAIChatShare.tsx';
import LandingPage from './pages/Landing.tsx';
import MathGenerate from './pages/MathGenerate.tsx';
import MyProblemBanks from './pages/MathProblemBanks.tsx';
import PrivacyPolicy from './pages/PrivacyPolicy.tsx';
import ProblemBank from './pages/ProblemBank.tsx';
import Terms from './pages/Terms.tsx';
import { getGyosuClerkTheme } from './theme/customClerkTheme.ts';


export default function ClerkProviderWithRoutes() {
    const navigate = useNavigate();

    const { env } = useEnvironment();

    const clerkKey = env == "production" ? notSecretConstants.clerk.PUBLISHABLE_KEY : notSecretConstants.clerk.PUBLISHABLE_DEV_KEY

    const location = useLocation();

    return (
        <ClerkProvider
            publishableKey={clerkKey}
            allowedRedirectOrigins={["https://gyosu.ai", "https://www.gyosu.ai"]}
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
                    path="/math-app/agent"
                    element={
                        <>
                            <Navbar />
                            <ContentWrapper>
                                <GyosuAIChat />
                            </ContentWrapper>
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
                    path="/math-app/chat/:sessionId"
                    element={
                        <>
                            <Navbar />
                            <GyosuAIChat />
                            {/* <Footer /> */}
                        </>
                    }
                />
                <Route
                    path="/math-app/chat/share/:token"
                    element={
                        <>
                            <Navbar />
                            <GyosuAIChatShare />
                            <Footer />
                        </>
                    }
                />
                 <Route
                    path="/math-app/chat/"
                    element={
                        <>
                            <Navbar />
                            <GyosuAIChat />
                            {/* <Footer /> */}
                        </>
                    }
                />
                <Route
                    path="/math-app/playground"
                    element={
                        <>
                            <Navbar />
                            <ContentWrapper>
                                <ContentPlaygroundStreamed />
                            </ContentWrapper>
                        </>
                    }
                />
                <Route
                    path="/math-app/multipleKeyStreamExample"
                    element={
                        <>
                            <Navbar />
                            <ContentWrapper>
                                <ContentMultipleStreamedExample />
                            </ContentWrapper>
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