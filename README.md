# Octomailer

Octomailer is a project that creates GitHub issues from emails using Cloudflare Workers. This project leverages Cloudflare's serverless platform to process incoming emails and convert them into GitHub issues, streamlining your workflow by automating the creation of issues directly from your email.

## Features

- **Email to Issue**: Converts incoming emails into GitHub issues.
- **Cloudflare Workers**: Utilizes Cloudflare Workers for serverless processing.
- **TypeScript**: Written in TypeScript for robust type-checking and development.
- **Automated Deployment**: Easily deploy with Cloudflare Wrangler.

## Installation

### Prerequisites

- Node.js (>= 16.13)
- npm or yarn
- Cloudflare account
- GitHub account

### Setup

1. **Clone the repository:**

   ```sh
   git clone https://github.com/willswire/octomailer.git
   cd octomailer
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Set up GitHub Authentication:**

   Ensure you have a GitHub token with the necessary permissions to create issues in your repository. Set this token as an environment variable in Cloudflare Workers.

## Scripts

The following scripts are available in the project:

- **Deploy**: Deploy the project to Cloudflare Workers.

  ```sh
  npm run deploy
  ```

- **Development**: Start a development server for Cloudflare Workers.

  ```sh
  npm run dev
  ```

- **Start**: Alias for the development server.

  ```sh
  npm run start
  ```

- **Test**: Run the test suite using Vitest.

  ```sh
  npm run test
  ```

- **Generate Types**: Generate type definitions for Cloudflare Workers.

  ```sh
  npm run cf-typegen
  ```

## Testing

Testing is done using Vitest. Ensure you have configured Vitest in your `vitest.config.ts` file. To run tests, use:

```sh
npm run test
```

## License

This project is licensed under the MIT License.

---

Feel free to contribute to this project by opening issues or submitting pull requests on GitHub.

---

This project is inspired by the need to automate and streamline the process of creating GitHub issues directly from emails, leveraging the power of Cloudflare Workers for serverless processing.

---

For more information on Cloudflare Workers and how to deploy serverless applications, visit the [Cloudflare Workers documentation](https://developers.cloudflare.com/workers/).

---

Happy coding!
