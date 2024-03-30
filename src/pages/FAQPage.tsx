import React from 'react';
import { Link } from 'react-router-dom';

const faqs = [
    {
        question: 'What is Gyosu?',
        answer: (
            <div>
                <p>Gyosu aims to be a collection of tools for teachers to empower them to create personalized learning experiences for their students. It is built on a foundation of high quality educational materials, ensuring that the contents it creates is high quality as well.</p>
                <br></br>
                <p> We currently have two main features - GyosuChat, an educational content creation assistant, and the problem banks, both of which make it easier for teachers to create customized content for their students.</p>
            </div>
        )
    },
    {
        question: 'What is GyosuChat?',
        answer: (
            <div>
                <p> GysouChat is an assistant that has been custom built for teachers, to help guide you through the process of creating educational materials for your students.</p>
                <p> The goal of GyosuChat is to make it as easy as possible for a teacher to utilize trusted materials, while building content that is customized for their classrooms.</p>
                <p> GyosuChat is currently in beta, and we are working hard to improve it every day. If you have any feedback, please email us at <a href="mailto:support@gyosu.ai" className="text-secondary underline">support@gyosu.ai</a></p>
            </div>
        )
    },
    {
        question: 'How do I use GyosuChat?',
        answer: (
            <>
                <p> Use GyosuChat just like you would with ChatGPT - by chatting to it! Here are some ideas of messages you could send to help get you started: </p>
                <br></br>
                <ul className="list-disc pl-5">
                    <li> I am teaching "topic", can you help me create a lesson plan / worksheet / quiz / exam?</li>
                    <li> Please create a PDF quiz with 3 questions on the order of operations </li>
                    <li> Please create a study guide for my students on Pre-Algebra, chapter 3, section 4. </li>
                    <li> I'd like to create a fun worksheet on functions & function notation </li>
                    <li> I'd like to create an "Escape Room" game using concepts from the quadratic formula </li>
                </ul>
                <br></br>
                <p> Gyosu chat will then ask you a series of questions to help ensure the content it creates is customized to you. Here are some options on how you could customize your content: </p>
                <br></br>
                <ul className="list-disc pl-5">
                    <li> Please make this content easy / medium / difficult </li>
                    <li> Please make this content more fun and engaging, using the peronality of (insert famous person/character here) </li>
                </ul>
            </>
        )
    },
    {
        question: 'What books does GyosuChat have available?',
        answer: (
            <>
                <p>Currently, GyosuChat is focused towards Math teachers.</p>
                <p>We have the following books available, which were open-sourced and provided through <a href="https://openstax.org/subjects/math">OpenStax</a>: </p>
                <br></br>
                <ul className="list-disc pl-5">
                    <li>College Algebra 2e</li>
                    <li>Calculus Volume 2</li>
                    <li>Pre-Algebra 2e</li>
                    <li>Algebra and Trigonometry 2e</li>
                    <li>Calculus Volume 1</li>
                    <li>Calculus Volume 3</li>
                    <li>Intermediate Algebra 2e</li>
                    <li>Precalculus 2e</li>
                    <li>Elementary Algebra 2e</li>
                </ul>
                <br></br>
                <p>In the future, we plan to expand our library out to other topics. </p>
            </>
        )
    },
    {
        question: 'How do I create and use a problem bank?',
        answer: (
            <>
                <p className="text-base mb-4">Creating and using a problem bank involves the following steps:</p>

                <div className="text-lg font-semibold mb-2">Step 1: Go to Problem Search</div>
                <p className="text-base mb-4">Navigate to the <Link className="text-secondary underline" to='/math-app/search'>problem search</Link> section to find the problems you want to include in your problem bank.</p>

                <div className="text-lg font-semibold mb-2">Step 2: Search for Problems</div>
                <p className="text-base mb-4">Use the available filters and search functionalities to find specific problems that align with your objectives.</p>

                <div className="text-lg font-semibold mb-2">Step 3: Add Problems to Your Bank</div>
                <p className="text-base mb-4">
                    After finding relevant problems, you can add them to your problem bank:
                    <ul className="list-disc list-inside pl-5">
                        <li>On desktop: Drag the problems into the problem bank section.</li>
                        <li>On mobile: Click the '+' icon next to a problem, then select a problem bank to add them to.</li>
                    </ul>
                </p>

                <div className="text-lg font-semibold mb-2">Step 4: Visit the Playground</div>
                <p className="text-base mb-4">Once your problem bank is ready, go to the <Link className="text-secondary underline" to='/math-app/playground'>playground</Link> where you can use the problems to create a document.</p>

                <div className="text-lg font-semibold mb-2">Step 5: Create a Document</div>
                <p className="text-base mb-4">In the playground, plug in your problem bank, make necessary adjustments, and finalize the document creation process by following the on-screen instructions.</p>
            </>
        )
    },
    {
        question: 'How do I create a worksheet from a problem bank?',
        answer: (
            <>
                <p className="text-base mb-4">Creating a worksheet involves four main steps:</p>

                <div className="text-lg font-semibold mb-2">Step 1: Search for Problems</div>
                <p className="text-base mb-4">Use the search functionality to find math problems that align with your objectives.</p>

                <div className="text-lg font-semibold mb-2">Step 2: Build a Problem Bank</div>
                <p className="text-base mb-4">Add the problems you've selected to a problem bank until you're satisfied with the list.</p>

                <div className="text-lg font-semibold mb-2">Step 3: Review and Select</div>
                <p className="text-base mb-4">Open your problem bank to review your choices. Select the problems you wish to include in your worksheet, then click the 'Create' button.</p>

                <div className="text-lg font-semibold mb-2">Step 4: Finalize the Worksheet</div>
                <p className="text-base mb-4">Complete the necessary fields, such as the worksheet title and any additional instructions. Once you're done, click 'Create' to let the AI generate a classroom-ready worksheet for you.</p>
            </>
        )
    },
    {
        question: 'How can I search for problems for my problem bank?',
        answer: (
            <>
                <p className="text-base mb-4">Searching for problems is now more streamlined. Follow these steps:</p>

                <ol className="">
                    <li className="mb-2">
                        <div className="text-lg font-semibold">Head to the Search Page:</div>
                        <p>Navigate to the search page by clicking on this <Link className="text-secondary underline" to='/math-app'>link</Link>.</p>
                    </li>

                    <li className="mb-2">
                        <div className="text-lg font-semibold">Search for Problems:</div>
                        <p>Use the search options to select the book, chapter, section, and problem type that meet your needs, then click 'Search'.</p>
                    </li>

                    <li className="mb-2">
                        <div className="text-lg font-semibold">Add to Problem Bank:</div>
                        <p>You can add problems to your problem bank in two ways:</p>
                        <ul className="list-disc list-inside pl-5">
                            <li>Drag the problem into the problem bank section on the left.</li>
                            <li>Click the '+' icon next to the problem you wish to add.</li>
                        </ul>
                    </li>
                </ol>
            </>
        )
    },
    {
        question: 'How do I delete a problem from a problem bank?',
        answer: 'Click the trash icon on the problem you wish to delete.'
    },
    {
        question: 'Is there any support available if I run into issues?',
        answer: (
            <>
                Lost in the labyrinth of logarithms? Email <a href="mailto:support@gyosu.ai" className="text-secondary underline">support@gyosu.ai</a>, and we'll help you find your way!
            </>
        )
    }
];
const FAQPage: React.FC = () => {
    return (
        <div className="faq-container text-base-content p-4">
            <h1 className="text-4xl font-semibold text-center mb-6">Frequently Asked Questions</h1>
            {faqs.map((faq, index) => (
                <div key={index} className="collapse collapse-plus bg-base-200 rounded-box">
                    <input type="radio" name="faq-accordion" id={`faq-${index}`} className="peer" defaultChecked={index === 0} />
                    <div className="collapse-title text-xl font-medium">
                        {faq.question}
                    </div>
                    <div className="collapse-content">
                        <p>{faq.answer}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};


export default FAQPage;
