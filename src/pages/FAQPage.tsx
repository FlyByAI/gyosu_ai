import React from 'react';
import Accordion from '../components/Accordion';

const faqs = [
    {
        question: 'What is Gyosu?',
        answer: 'Gyosu is a collection of tools for teachers to empower them to create personalized learning experiences for their students. We have one prototype available, the "generate math worksheets" tool. We\'ve launched early as we want to develop in public, so think of the bugs as those surprise insects in your backyard – always there to keep gardening interesting. But we\'re improving every day, with your feedback as our guide!'
    },
    {
        question: 'What is the "generate math worksheets" tool, and why would I use it?',
        answer: 'Crafting individual math worksheets manually is like tilling a field with a fork or planting a garden with a teaspoon – it\'s doable, but you might want to invest in a plow, a shovel, or better yet, our tool! The generate math worksheets tool simplifies this process, by providing core math problems and then enabling customization through AI. Tailored content is essential for effective learning, and our goal is to make it easier for you to achieve this customization.'
    },
    {
        question: 'What kind of customization options are currently supported through the “Chat with AI” feature?',
        answer: 'While we have big dreams for endless customization, here\'s the reality check of what currently works well:\n- Make the problem more engaging.\n- Change the topic to video games, animals, social media, etc.\n- Adjust the difficulty.\n- Change the numbers.\n- Translate to another language.\nThink of it as your very own customizable math playground (without the swings).'
    },
    {
        question: 'How do I start creating math worksheets?',
        answer: 'Just follow these steps, and you\'ll be on your way:\n1. Select the book, chapter, section, and problem type, then click \'generate.\'\n2. Edit the problems as needed.\n3. Chat with AI to change the problems.\n4. Click the reroll button for a fresh problem.\n5. Delete problems with the trash icon.\n6. Save your documents.\n7. Click the print icon to export as a PDF.'
    },
    {
        question: 'How do I edit a problem?',
        answer: 'Each problem comes with an edit button, chat to AI chat box, thumbs up/down button, fix formatting button, and a reroll button. It’s like having a toolbox for each problem.'
    },
    {
        question: 'Can I create a problem from scratch?',
        answer: 'Yes, you can chat with the AI to create new problems or modify existing ones.'
    },
    {
        question: 'How do I delete a problem?',
        answer: 'Click the trash icon on the problem you wish to delete.'
    },
    {
        question: 'Can I save my work and continue later?',
        answer: 'Absolutely. Save your work with the top right button, and it\'ll be waiting like that stack of papers you\'ve been meaning to grade.'
    },
    {
        question: 'How do I export my worksheet?',
        answer: 'You can export your worksheet to a PDF by clicking the print button.'
    },
    {
        question: 'Is there any support available if I run into issues?',
        answer: 'Lost in the labyrinth of logarithms? Our support team has the compass of clarity. Email [support@gyosu.ai](mailto:support@gyosu.ai), and we\'ll help you find your way!'
    }
];

const FAQPage: React.FC = () => {
    return (
        <div className="faq-container text-white">
            <h1 className="text-4xl font-semibold text-center mb-6">Frequently Asked Questions</h1>
            {faqs.map((faq, index) => (
                <Accordion key={index} title={faq.question} visible={false}>
                    <p className='my-4'>{faq.answer}</p>
                </Accordion>
            ))}
        </div>
    );
};
export default FAQPage;
