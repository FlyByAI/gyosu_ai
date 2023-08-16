



import './index.css'

import {
    useNavigate,
    Routes,
    Route,
} from "react-router-dom";
import Home from './pages/Home.tsx';
import Blog from './pages/Blog.tsx';
import Contact from './pages/Contact.tsx';
import Post from './components/Post.tsx';
import Navbar from './components/Navbar.tsx';
import Tools from './pages/Tools.tsx';
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
import MathTeacherApp from './pages/tools/MathTeacherApp.tsx';
import Attributions from './pages/Attributions.tsx';
import FAQPage from './pages/FAQPage.tsx';

const clerkPubKey = "pk_test_Y2F1c2FsLWJ1bm55LTQ0LmNsZXJrLmFjY291bnRzLmRldiQ";

export default function ClerkProviderWithRoutes() {
    const navigate = useNavigate();

    return (
        <ClerkProvider
            publishableKey={clerkPubKey}
            navigate={(to) => navigate(to)}
            appearance={getGyosuClerkTheme()}
        >
            <Routes>
                <Route
                    path="/"
                    element={
                        <>
                            <Navbar />
                            <ContentWrapper>
                                <Home />
                                <Footer />
                            </ContentWrapper>
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
                            <ContentWrapper>
                                <MathTeacherApp />
                                <Footer />
                            </ContentWrapper>

                        </>
                    }
                />
                <Route
                    path="/materials"
                    element={
                        <>
                            <Navbar />
                            <ContentWrapper>
                                <MathTeacherApp />
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