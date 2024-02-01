import { A, Email, Item, Span, renderEmail } from 'react-html-email';

const EmailTemplate = () => {
  return (
    <Email title="GyosuChat: Where Math Education Meets Innovation!">
      <Item align="center">
        <Span fontSize={20}>Dear Math Innovators,</Span>
      </Item>
      <Item>
        <Span>
          We are thrilled to introduce GyosuChat – A chat assistant that can create lessons plans, quizzes, exams, worsheets, and more, all through an easy to use chat interface. At Gyosu, our dream is to make it easier for teachers to create high quality, customized content for their students, and we believe this is a step in that direction.
        </Span>
      </Item>
      <Item>
        <Span>
          To give <A href="https://gyosu.ai/chat">GyosuChat</A>x a try, tell it what topic you are teaching this week and ask it for a lesson plan (or worksheet, quiz, etc.).
        </Span>
      </Item>
        <Item>
            <Span>
            To give GyosuChat a try, go here: <A href="https://gyosu.ai/chat">GyosuChat</A>
            </Span>
        </Item>
      <Item>
        <Span>
          This innovative tool is more than just a chatbot; it is a research assistant built on top of high-quality textbooks provided by <A href="https://openstax.org">OpenStax</A>, an open source textbook provider. Our chatbot is designed to use the educational material from these textbooks when creating it's content, so you can trust that the output is high quality and accurate.
        </Span>
      </Item>
      <Item>
        <Span>
          We value your insights and experiences. Share your feedback by emailing us at <A href="mailto:support@gyosu.ai">support@gyosu.ai</A>. 
        </Span>
      </Item>
      <Item>
        <Span>
          Thank you for being a part of the Education Innovation journey with us.
        </Span>
      </Item>
      <Item align="center">
        <Span fontSize={18}>Happy Teaching,</Span><br/>
        <Span fontSize={18}>The Gyosu Team</Span>
      </Item>
    </Email>
  );
}

// Render the email to HTML (to be sent via email sending service)
const emailHTML = renderEmail(<EmailTemplate />);

export default EmailTemplate;
