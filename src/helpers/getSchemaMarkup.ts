// this function adds head and meta tags for SEO purposes. ChatGPT was used to create these. They will need to be updated if routes change. 
import { Location } from 'react-router-dom';

export const getSchemaMarkup = (location: Location) => {
    switch (location.pathname) {
        case "/":
            return `
                {
                    "@context": "http://schema.org",
                    "@type": "Course",
                    "name": "Generative AI for Math Teachers",
                    "description": "An AI-powered platform to create math worksheets, problems, quizzes, and exams.",
                    "provider": {
                        "@type": "Organization",
                        "name": "Gyosu.ai",
                        "sameAs": "https://www.gyosu.ai"
                    },
                    "image": "https://www.gyosu.ai/svg/teacher1.svg",
                    "courseCode": "MATH-AI-101",
                    "offers": {
                        "@type": "Offer",
                        "availability": "http://schema.org/InStock",
                        "url": "https://www.gyosu.ai/math-app",
                        "priceCurrency": "USD",
                        "price": "0"
                    },
                    "coursePrerequisites": {
                        "@type": "EducationalOccupationalCredential",
                        "name": "Basic understanding of Math"
                    }
                }`;
        case "/math-app":
            return `
                {
                "@context": "http://schema.org",
                "@type": "SoftwareApplication",
                "name": "Math Problem Selector",
                "applicationCategory": "EducationalApplication",
                "operatingSystem": "Web",
                "description": "An interface for teachers to select math problems and add them to a problem bank.",
                "featureList": [
                    "Select from a variety of math problems",
                    "Add problems to a problem bank",
                    "Tailored for educational use"
                ]}`;
        case "/math-app/document/:id":
            return `
                {
                "@context": "http://schema.org",
                "@type": "WebPage",
                "name": "Problem Bank",
                "description": "A customizable problem bank where teachers can use math problems to create worksheets.",
                "keywords": "Math, Education, Problem Bank, Worksheets",
                "primaryImageOfPage": {
                    "@type": "ImageObject",
                    "url": "none"
                },
                "significantLink": ["/math-app"],
                "breadcrumb": {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "item": {
                        "@type": "WebPage",
                        "@id": "/",
                        "url": "/",
                        "name": "Home"
                        }
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "item": {
                        "@type": "WebPage",
                        "@id": "/math-app",
                        "url": "/math-app",
                        "name": "Math App"
                        }
                    },
                    {
                        "@type": "ListItem",
                        "position": 3,
                        "item": {
                        "@type": "WebPage",
                        "@id": "/math-app/document/:id",
                        "url": "/math-app/document/:id",
                        "name": "Problem Bank"
                        }
                    }
                    ]
                }
                }`;
        case "/math-app/documents":
            return `
                    {
                    "@context": "http://schema.org",
                    "@type": "WebPage",
                    "name": "Documents",
                    "description": "A management page for teachers to view and download generated math documents.",
                    "keywords": "Math, Education, Documents, Worksheets, Answer Keys, PDF, DOCX",
                    "primaryImageOfPage": {
                        "@type": "ImageObject",
                        "url": "URL_of_some_image_that_represents_this_page"
                    },
                    "significantLink": ["/math-app"],
                    "breadcrumb": {
                        "@type": "BreadcrumbList",
                        "itemListElement": [
                        {
                            "@type": "ListItem",
                            "position": 1,
                            "item": {
                            "@type": "WebPage",
                            "@id": "/",
                            "url": "/",
                            "name": "Home"
                            }
                        },
                        {
                            "@type": "ListItem",
                            "position": 2,
                            "item": {
                            "@type": "WebPage",
                            "@id": "/math-app",
                            "url": "/math-app",
                            "name": "Math App"
                            }
                        },
                        {
                            "@type": "ListItem",
                            "position": 3,
                            "item": {
                            "@type": "WebPage",
                            "@id": "/math-app/documents",
                            "url": "/math-app/documents",
                            "name": "Documents"
                            }
                        }
                        ]
                    }
                    }`;

        default:
            console.log("note: no schema markup for this page")
            return null;
    }
};