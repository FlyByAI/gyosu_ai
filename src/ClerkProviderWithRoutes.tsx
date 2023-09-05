



import './index.css'

import {
    useNavigate,
    Routes,
    Route,
} from "react-router-dom";
import Home from './pages/Home.tsx';
import Blog from './pages/Blog.tsx';
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
import DocumentDisplay from './pages/tools/DocumentDisplay.tsx';
import Subscription from './components/Subscription.tsx';
import LandingPage from './pages/Landing.tsx';
import MathDocumentSearch from './pages/tools/MathDocumentSearch.tsx';
import MathGenerate from './pages/tools/MathGenerate.tsx';
import Subscribe from './components/Subscribe.tsx';
import Documents from './pages/Documents.tsx';
import MyProblemBanks from './pages/tools/MathProblemBanks.tsx';
import { notSecretConstants } from './constants/notSecretConstants.tsx';


export default function ClerkProviderWithRoutes() {
    const navigate = useNavigate();

    
    const isDevelopment = import.meta.env.MODE !== 'production';
    console.log(isDevelopment);
    if (isDevelopment) console.log("Development mode");

    const clerkKey = isDevelopment ? notSecretConstants.clerk.PUBLISHABLE_DEV_KEY : notSecretConstants.clerk.PUBLISHABLE_KEY

    return (
        <ClerkProvider
            publishableKey={clerkKey}
            navigate={(to) => navigate(to)}
            appearance={getGyosuClerkTheme()}
        >
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
                    path="/home"
                    element={
                        <>
                            <Navbar />
                            <ContentWrapper>
                                <Home />
                                <Footer />
                            </ContentWrapper>
                            <Subscription />
                        </>
                    }
                />
                <Route
                    path="/blog"
                    element={
                        <>
                            <Navbar />
                            <ContentWrapper>
                                <Blog />
                                <Footer />
                            </ContentWrapper>
                        </>
                    }
                />
                <Route
                    path="/math-app"
                    element={
                        <>
                            <Navbar />
                            <MathGenerate />
                            <Footer />
                            <Subscription />
                        </>
                    }
                />
                <Route
                    path="/math-app/document/:id"
                    element={
                        <>
                            <Navbar />
                            <DocumentDisplay />
                            <Subscription />
                        </>
                    }
                />
                <Route
                    path="/math-app/search"
                    element={
                        <>
                            <Navbar />
                            <MathDocumentSearch />
                            <Footer />
                            <Subscription />
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
                            <Subscription />
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
                            <Subscription />
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
                                <Subscribe />
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