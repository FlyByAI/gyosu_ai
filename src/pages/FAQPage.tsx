import React from 'react';
import Accordion from '../components/Accordion';
import { Link } from 'react-router-dom';

const faqs = [
    {
        question: 'What is Gyosu?',
        answer: 'Gyosu is a collection of tools for teachers to empower them to create personalized learning experiences for their students. We have one prototype available, the "generate math worksheets" tool. We\'ve launched early as we want to develop in public, so think of the bugs as those surprise insects in your backyard – always there to keep gardening interesting. But we\'re improving every day, with your feedback as our guide!'
    },
    {
        question: 'How do I create and use a problem bank?',
        answer: (
            <>
                <p className="text-base mb-4">Creating and using a problem bank involves the following steps:</p>

                <div className="text-lg font-semibold mb-2">Step 1: Go to Problem Search</div>
                <p className="text-base mb-4">Navigate to the <Link className="text-blue-300 underline" to='/math-app'>problem search</Link> section to find the problems you want to include in your problem bank.</p>

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
                <p className="text-base mb-4">Once your problem bank is ready, go to the <Link className="text-blue-300 underline" to='/math-app/playground'>playground</Link> where you can use the problems to create a document.</p>

                <div className="text-lg font-semibold mb-2">Step 5: Create a Document</div>
                <p className="text-base mb-4">In the playground, plug in your problem bank, make necessary adjustments, and finalize the document creation process by following the on-screen instructions.</p>
            </>
        )
    },
    {
        question: 'How do I create a worksheet?',
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
        question: 'How can I search for problems?',
        answer: (
            <>
                <p className="text-base mb-4">Searching for problems is now more streamlined. Follow these steps:</p>

                <ol className="">
                    <li className="mb-2">
                        <div className="text-lg font-semibold">Head to the Search Page:</div>
                        <p>Navigate to the search page by clicking on this <Link className="text-blue-300 underline" to='/math-app'>link</Link>.</p>
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
        question: 'How do I delete a problem?',
        answer: 'Click the trash icon on the problem you wish to delete.'
    },
    {
        question: 'Is there any support available if I run into issues?',
        answer: (
            <>
                Lost in the labyrinth of logarithms? Our support team has the compass of clarity. Email <a href="mailto:support@gyosu.ai" className="text-blue-300 underline">support@gyosu.ai</a>, and we'll help you find your way!
            </>
        )
    }
];

const FAQPage: React.FC = () => {
    return (
        <div className="faq-container text-white">
            <h1 className="text-4xl font-semibold text-center mb-6">Frequently Asked Questions</h1>
            {faqs.map((faq, index) => (
                <Accordion key={index} title={faq.question} visible={false}>
                    <div className='my-4'>{faq.answer}</div>
                </Accordion>
            ))}
        </div>
    );
};


export default FAQPage;
