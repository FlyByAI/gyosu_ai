// this is a really simple server we use for development to return fake data for development
import express from "express";
import cors from "cors";

import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const exampleDoc = require("./src/json/example.json");
const exampleDoc2 = require("./src/json/example2.json");

const app = express();
const port = 8000;

//cors enabled, since this is only used for local dev

app.use(cors());

// Combined list of all posts
const allPosts = [
  {
    id: "1",
    title: "The Ultimate Guide to Supercharging Your Productivity",
    author: "John Smith",
    date: "May 15, 2023",
    content:
      "In today's fast-paced world, maximizing productivity has become more important than ever. Whether you're a student, a professional, or an entrepreneur, having the ability to get things done efficiently can make a significant difference in achieving your goals. In this guide, we'll explore a range of powerful productivity hacks that will revolutionize the way you work and help you accomplish more in less time.\n\n1. Master the Art of Time Blocking:\n\nTime blocking is a game-changing technique that involves dividing your day into distinct blocks of time dedicated to specific tasks or activities. By assigning specific time slots for different activities, you can eliminate distractions and maintain a laser-like focus on your priorities.\n\n2. Embrace the Power of Prioritization:\n\nOne of the keys to productivity is understanding what truly matters and focusing your energy on those tasks. Make a habit of identifying your most important tasks and tackling them first. This way, you'll ensure that you make progress on crucial objectives.\n\n3. Leverage Technology Tools:\n\nWe live in an era of remarkable technological advancements, and there's no shortage of tools and apps designed to boost productivity. From project management software to task automation tools, find the ones that align with your workflow and leverage them to streamline your work processes.\n\n4. Optimize Your Work Environment:\n\nYour physical environment can have a significant impact on your productivity. Organize your workspace, declutter your surroundings, and create a pleasant atmosphere that promotes focus and creativity. Consider incorporating elements such as natural lighting, plants, and ergonomic furniture to enhance your comfort and productivity.\n\n5. Cultivate Healthy Habits:\n\nProductivity is not just about working harder; it's also about taking care of yourself. Prioritize self-care activities like regular exercise, healthy eating, and sufficient sleep. Taking breaks throughout the day and engaging in activities that rejuvenate your mind can also enhance your overall productivity.\n\n6. Practice Mindfulness and Deep Work:\n\nIn our increasingly distracted world, it's crucial to train your mind to stay focused. Embrace mindfulness techniques like meditation or deep breathing exercises to improve your ability to concentrate. Additionally, adopt the practice of deep work, which involves dedicating uninterrupted blocks of time to deeply engage with complex tasks.\n\n7. Continuously Learn and Grow:\n\nThe most productive individuals are lifelong learners. Commit yourself to continuous personal and professional growth by investing time in reading books, attending seminars, or taking online courses. Expanding your knowledge and skill set will equip you with the tools to tackle new challenges and improve your productivity.\n\nRemember, productivity is not about cramming more tasks into your day but about working smarter and accomplishing what truly matters. By implementing these productivity hacks into your routine, you'll unlock your full potential and achieve greater success in all areas of your life.",
  },
  {
    id: "2",
    title: "10 Delicious Recipes for Summer BBQ",
    author: "Jane Doe",
    date: "June 2, 2023",
    content:
      "Get ready for the ultimate summer BBQ with these delicious recipes:\n\n1. Grilled Lemon Herb Chicken\n\nIngredients:\n- Chicken breasts\n- Lemon juice\n- Fresh herbs (such as rosemary, thyme, and parsley)\n\nInstructions:\n1. Marinate the chicken breasts in lemon juice and fresh herbs for at least 1 hour.\n2. Preheat the grill and cook the chicken until it reaches an internal temperature of 165°F.\n3. Serve hot and enjoy!\n\n2. BBQ Pulled Pork Sandwiches\n\nIngredients:\n- Pork shoulder\n- BBQ sauce\n- Buns\n\nInstructions:\n1. Slow cook the pork shoulder in BBQ sauce until it becomes tender and easily shreddable.\n2. Shred the pork and mix it with more BBQ sauce.\n3. Toast the buns and fill them with the pulled pork.\n4. Serve with coleslaw and pickles.\n\n3. Grilled Veggie Skewers\n\nIngredients:\n- Assorted vegetables (such as bell peppers, zucchini, onions, and mushrooms)\n- Olive oil\n- Seasonings of your choice\n\nInstructions:\n1. Cut the vegetables into bite-sized pieces.\n2. Thread them onto skewers and brush with olive oil.\n3. Season with salt, pepper, and your favorite spices.\n4. Grill until tender and slightly charred.\n\nEnjoy these mouthwatering recipes at your next summer BBQ!",
  },
  {
    id: "3",
    title: "Traveling on a Budget: Tips and Tricks",
    author: "Sarah Johnson",
    date: "July 10, 2023",
    content:
      "Traveling can be one of life's most enriching experiences. However, it's a common misconception that you need a fortune to explore new destinations. That's why we've put together a guide for traveling on a budget.\n\n1. **Plan and Book in Advance**: One of the best ways to save money is by planning your trip and booking flights and accommodations as early as possible. It is usually cheaper to book months ahead, and you'll have more options to choose from.\n\n2. **Travel Off-Peak**: The time of year can significantly impact the cost of your trip. If possible, avoid traveling during the peak tourist season. Instead, aim for the shoulder season - the period just before or after peak season.\n\n3. **Pack Wisely**: Avoid additional costs for checked luggage by packing light. This also makes traveling more convenient and flexible.\n\n4. **Use Public Transportation**: Rather than taking taxis or renting a car, consider using public transportation or walking.\n\n5. **Eat Local**: Instead of dining at expensive restaurants, consider trying street food or shopping at local markets. It's usually cheaper, and you get to experience local cuisine and culture.\n\n6. **Free Activities**: Look for free or inexpensive activities, such as visiting public parks, free museums, or even just exploring the city on foot.\n\nRemember, traveling doesn't have to be a luxury. With a little planning and smart decisions, you can make your travel dreams come true on a budget.",
  },
  {
    id: "4",
    title: "5 Tips for Effective Remote Work",
    author: "James Wilson",
    date: "May 10, 2023",
    content:
      "With the prevalence of remote work, it's important to understand how to maximize your efficiency. Here are five tips to help you make the most of working from home...",
  },
  {
    id: "5",
    title: "Exploring the Wonders of Space",
    author: "Emma Johnson",
    date: "May 20, 2023",
    content:
      "Space exploration continues to capture the public imagination. In this post, we delve into some of the most fascinating aspects of space travel and astronomy...",
  },
  {
    id: "6",
    title: "The Future of AI Technology",
    author: "Oliver Brown",
    date: "May 30, 2023",
    content:
      "Artificial intelligence is rapidly evolving and transforming various sectors. From healthcare to finance, let's explore the potential impact of AI in the coming years...",
  },
  {
    id: "7",
    title: "Maintaining Mental Health During a Pandemic",
    author: "Sophia Davis",
    date: "June 5, 2023",
    content:
      "The ongoing pandemic has presented unique challenges to mental health. Discover strategies to cope with stress and maintain mental well-being in these trying times...",
  },
  {
    id: "8",
    title: "Understanding the Basics of Blockchain",
    author: "Liam Thompson",
    date: "June 15, 2023",
    content:
      "Blockchain technology underpins cryptocurrencies like Bitcoin, but its potential applications go far beyond digital money. In this post, we explore the basics of blockchain...",
  },
];

const sortedPosts = allPosts.sort((a, b) => {
  let dateA = new Date(a.date);
  let dateB = new Date(b.date);

  // If dateA is later than dateB, sort a to an index lower than b, i.e. a comes first.
  return dateB - dateA;
});

// body-parser middleware - needed to be able to use req.body, otherwise undefined
app.use(express.json());

// Filter all posts to get recent posts
const recentPosts = sortedPosts.slice(0, 3);

app.get("/blogPosts", (req, res) => {
  res.json(allPosts);
});

app.get("/blogPosts/recent", (req, res) => {
  res.json(recentPosts);
});

app.post("/youtube/summary", (req, res) => {
  const url = req.body.url;

  // Just an example response, replace with your actual logic
  res.json({
    message: `Summary: ${url} 
   This Youtube video is a recap of Apple's new AR/VR headset, the Vision Pro. It is a first generation device that starts at $3,500 and will go on sale early next year. It has a 4K micro OLED display for each eye, speakers above each ear, and a dedicated R1 chip for real-time processing. It is controlled with the user's hands, eyes, and voice, and has a variety of sensors to track the user's movements. The eye tracking is particularly impressive, and the user can select items by touching their fingers together.`,
  });
});

const restaurantData = {
  results: [
    {
      name: "Asti D'Italia",
      contact: "(303) 457-3900",
      website: "https://astiditalia.com/",
      address: "14648 Delaware St, Westminster, CO 80023, USA",
      selectionReason:
        "It has the highest rating of 4.2 among the Italian restaurants within the search radius.",
    },
    {
      name: "Johnny's Italian Steakhouse & Event Center",
      contact: "(303) 255-2525",
      website: "http://www.johnnysitaliansteakhouse.com/",
      address: "14275 Lincoln St, Thornton, CO 80023, USA",
      selectionReason:
        "This restaurant has a rating of 4.1 and is closer to you than some of the other Italian restaurants.",
    },
    // Add more restaurant data here...
  ],
};

let chatSessions = {};

app.get("/chat/:sessionId", (req, res) => {
  const { sessionId } = req.params;
  res.json(chatSessions[sessionId] || []);
});

// Add a chat message
app.post("/chat/:sessionId", (req, res) => {
  const { sessionId } = req.params;
  const message = req.body;
  if (!chatSessions[sessionId]) {
    chatSessions[sessionId] = [];
  }

  chatSessions[sessionId].push(message);
  res.json(message);
});

const mathResponse2 = String.raw`
**Problem 1**
Instructions: For the following exercises, determine whether the relation is a function.
$$\{(a,b),(c,d),(e,d)\}$$

**Problem 2**
Instructions: For the following exercises, determine whether the relation is a function.
$$\{(5,2),(6,1),(6,2),(4,8)\}$$

**Problem 3**
Instructions: For the following exercises, determine whether the relation is a function.
$$y^2+4=x$$
, for $x$ the independent variable and $y$ the dependent variable.
  
**Problem 4**
Instructions: Is the graph in Figure 1 a function?
![Graph of a parabola](https://openstax.org/apps/image-cdn/v1/f=webp/apps/archive/20230220.155442/resources/bf41b5b90d8fa6abbca6d2a1170501c75ebb1497)

**Problem 5**
Instructions: For the following exercises, evaluate the function at the indicated values: $f(-3);f(2);f(-a);-f(a);f(a+h)$.
$$f(x)=-2x^2+3x$$

`;

const mathResponseDoc = exampleDoc2;

const documents = [
  {
    ...exampleDoc,
    id: 1,
  },
  {
    ...exampleDoc2,
    id: 2,
  },
];

app.post("/api/math_app/generate", (req, res) => {
  res.json({
    response: mathResponseDoc.content,
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

app.post("/api/math_app/document/save", (req, res) => {
  console.log("Delaying for 2 second.");
  setTimeout(() => {
    res.json({
      document: req.body.document,
      id: 1,
    });
    console.log("Sent.");
  }, "2000");
});

app.get("/api/user_data/get_subscription_info/", (req, res) => {
  res.json({
    has_valid_subscription: false,
    active_trial: false,
    has_activated_trial: false,
    time_left_in_trial: 3,
  });
});
//localhost:8000/api/math_app/document

app.post("/api/math_app/document/", (req, res) => {
  setTimeout(() => {
    res.json({
      ...req.body.document,
      id: 1,
    });
  }, 1000);
});

app.patch("/api/math_app/document/:id", (req, res) => {
  setTimeout(() => {
    res.json({
      ...req.body.document,
      id: 1,
    });
  }, 1000);
});

app.get("/api/math_app/document/:id", (req, res) => {
  res.json({
    ...mathResponseDoc,
    id: 1,
  });
});

app.get("/api/math_app/documents", (req, res) => {
  setTimeout(() => {
    res.json(documents);
  }, 1000);
});
