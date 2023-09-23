import React from 'react';
import Accordion from '../components/Accordion';
import { Link } from 'react-router-dom';

const faqs = [
    {
        question: 'What is Gyosu?',
        answer: 'Gyosu is a collection of tools for teachers to empower them to create personalized learning experiences for their students. We have one prototype available, the "generate math worksheets" tool. We\'ve launched early as we want to develop in public, so think of the bugs as those surprise insects in your backyard – always there to keep gardening interesting. But we\'re improving every day, with your feedback as our guide!'
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
    // {
    //     question: 'What is the "generate math worksheets" tool, and why would I use it?',
    //     answer: 'Crafting individual math worksheets manually is like tilling a field with a fork or planting a garden with a teaspoon – it\'s doable, but you might want to invest in a plow, a shovel, or better yet, our tool! The generate math worksheets tool simplifies this process, by providing core math problems and then enabling customization through AI. Tailored content is essential for effective learning, and our goal is to make it easier for you to achieve this customization.'
    // },
    // {
    //     question: 'What kind of customization options are currently supported through the “Chat with AI” feature?',
    //     answer: 'While we have big dreams for endless customization, here\'s the reality check of what currently works well:\n- Make the problem more engaging.\n- Change the topic to video games, animals, social media, etc.\n- Adjust the difficulty.\n- Change the numbers.\n- Translate to another language.\nThink of it as your very own customizable math playground (without the swings).'
    // },
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
    // {
    //     question: 'How do I edit a problem?',
    //     answer: 'Each problem comes with an edit button, chat to AI chat box, thumbs up/down button, fix formatting button, and a reroll button. It’s like having a toolbox for each problem.'
    // },
    // {
    //     question: 'Can I create a problem from scratch?',
    //     answer: 'Yes, you can chat with the AI to create new problems or modify existing ones.'
    // },
    {
        question: 'How do I delete a problem?',
        answer: 'Click the trash icon on the problem you wish to delete.'
    },
    // {
    //     question: 'Can I save my work and continue later?',
    //     answer: 'Absolutely. Save your work with the top right button, and it\'ll be waiting like that stack of papers you\'ve been meaning to grade.'
    // },
    // {
    //     question: 'How do I export my worksheet?',
    //     answer: 'You can export your worksheet to a PDF by clicking the print button.'
    // },
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
