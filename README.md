## README

# AI NewsLetter

The AI NewsLetter is an innovative project aimed at the curation and distribution of the latest news from the field of Artificial Intelligence (AI). Our platform utilizes a combination of cutting-edge language model technologies to deliver high-quality, curated content to our subscribers on a daily and weekly basis.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Testing the docker build process](#test-docker)
- [Contributing](#contributing)
- [License](#license)

## Tech Stack

This project has been built using the following technologies:

- **Backend**: Django
- **Frontend**: React.js + Typescript + Tailwind CSS
- **API calls**: Python
- **Language Models**: GPT4 and other LLM models
- **Additional tools**: langchain, llama_index, embedding, clerk

## Installation

To set up a local copy of the project:

1. Clone the repository.
2. Install Django and other backend dependencies.
3. Make sure Python is installed to handle API calls.
4. Ensure the necessary APIs (like GPT4) and other tools (like langchain, llama_index, embedding, etc.) are set up correctly.

Run the front end:

1. Clone Newsletter.AI repo
2. cd into repo `cd Newsletter.AI`
3. create .env.local and add these vars (NOTE: these are not secret keys)

```
VITE_API_URL=http://localhost:8000/api
VITE_CLERK_PUBLISHABLE_KEY=pk_test_Y2F1c2FsLWJ1bm55LTQ0LmNsZXJrLmFjY291bnRzLmRldiQ
```

4. run `yarn` to install npm dependencies
5. run `yarn run dev`
6. go to [http://localhost:5173/](http://localhost:5173/) in browser

Run the local dev server:

1. cd into repo `cd Newsletter.AI`
2. run `nodemon server.js`

## Testing the docker build process

Test the build

1. `docker build -t <image name> .`
   ex: `docker build -t kicksent/react-docker:latest .`
2. `docker run -p 8080:443 <image name>`
   ex: `docker run -p 8080:443 kicksent/react-docker:latest`
3. navigate to `http://localhost:8080/` and see the site running

## Usage

The project can be used to read AI-related news in a newsletter format. Users can subscribe to daily or weekly newsletters, depending on their preference. The platform uses LLM models, such as GPT4, to curate the best and most relevant content from various sources.

## Contributing

Contributions to this project are currently restricted to the project team. If you are on the team and would like to contribute:

    Please make sure you have the latest version of the project.
    Create your feature branch (git checkout -b feature/YourFeature).
    Commit your changes (git commit -m 'Add some feature').
    Push to the branch (git push origin feature/YourFeature).
    Open a pull request, and one of our team members will review your contribution.

If you are not on the team and you'd like to contribute, or you have suggestions or feedback, please open an issue to discuss your ideas.

## License

This project is private and its use is restricted. Unauthorized copying, modification, distribution, or any form of exploitation of this material, without express and written permission from the owners, is strictly prohibited. Please respect the work of the creators and maintain the privacy of this project.

For more detailed information, please contact the project owners. We are eager to answer any questions you may have and we appreciate any feedback!

---

For more detailed information, please check the project's wiki or open an issue. We are eager to answer any questions you may have and we appreciate any feedback!
