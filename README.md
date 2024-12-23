# UTDesign EPICS Wellness Center for Older Adults Repository
 
This project is based off the template used for all EPICS CS projects. The core technologies used are:

- [Next.js](https://nextjs.org): A full stack web development framework
- [Prisma](https://prisma.io): A database ORM used to connect Next.js to a database
- [PostgreSQL](https://www.postgresql.org): An open source SQL database

<!-- markdownlint-disable-next-line MD033 -->
<details><summary><h2>Table of Contents</h2></summary>

- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
  - [Installing Node](#installing-node)
    - [Node for Windows](#node-for-windows)
    - [Node for Mac/Linux](#node-for-maclinux)
  - [Installing Docker](#installing-docker)
  - [Installing pnpm (recommended/optional)](#installing-pnpm-recommendedoptional)
- [Running This Project](#running-this-project)
- [Running End to End Tests](#running-end-to-end-tests)
- [Learn More](#learn-more)
  - [Learn HTML, CSS, JavaScript, and TypeScript](#learn-html-css-javascript-and-typescript)
    - [HTML](#html)
    - [CSS](#css)
    - [JavaScript](#javascript)
    - [TypeScript](#typescript)
  - [Learn Next.js](#learn-nextjs)
  - [Learn Prisma](#learn-prisma)
- [Deploying This Project](#deploying-this-project)

</details>

## Getting Started

1. The first thing to do is edit this file. The title and description of the project should reflect your project, the organization it is for, and the target functionality.
2. Setup your development environment to ensure you have everything installed to run the project (see the [prerequisites section](#prerequisites)).
3. Run your project (see the [running the project section].(#running-your-project))
4. Start coding!

## Prerequisites

In order to run this project, a few technologies are required:

- [Node.js](https://nodejs.org)
- [Docker](https://www.docker.com)

If you have these installed already, you can skip to [running this project](#running-this-project).

Node.js is what allows us to write all our applications in JavaScript. Usually, JavaScript is run only in a web browser. By building on top of Node.js, we can write code that is executed on the server, simpler to write, and/or more secure.

Docker is a container framework. Containers allow us to standardize the environment that software runs on. In the case of this project, we use Docker to run the PostgreSQL database. By running the database in a container, the database of every person on the team will be configured exactly the same way. Since databases are quite complex applications, this greatly reduces the likelihood of experiencing issues with the database.

### Installing Node

#### Node for Windows

On windows, you can install node from the [Node.js downloads page](https://nodejs.org/en/download). Make sure you install the LTS (long-term support) version! Download and run the installer.

:warning: If shown a check box to install "tools for native modules" make sure you check the box before clicking next :warning:

Once the installation is finished (and you have restarted you computer if prompted), you can continue to [installing Docker](#installing-docker).

#### Node for Mac/Linux

It is recommended to use [node version manager (nvm)](https://github.com/nvm-sh/nvm) to install and run node on Mac/Linux. You can install is by using the command found [here](https://github.com/nvm-sh/nvm#installing-and-updating) in your terminal application. Alternatively, you can follow the installation instructions in the [windows instructions](#node-for-windows).

Once you have installed node version manager installed, run the following commands in your terminal:

```bash
nvm install --lts # Install latest version of Node.js
nvm install-latest-npm # Update npm to latest version
```

These commands do the following:

1. Install the long-term support (LTS) version of Node. The LTS version is the version of Node that will receive security updates the longest.
2. Update the node package manager (npm) to the latest version.

This completes your installation of Node!

### Installing Docker

Docker Desktop is the recommended way to install Docker. If you choose to install Docker another way, there is no guarantee that you will have everything installed correctly. To install docker desktop download and run the installer from [Docker's Getting Started Page](https://www.docker.com/get-started/).

### Installing pnpm (recommended/optional)

pnpm is an improved version of the Node Package Manager (npm). Though not required, it is highly recommended that you install it. You can install it using the following command in your terminal/powershell after node has been installed

```bash
npm install -g pnpm
```

If you choose to install pnpm, then you can substitute all usage of 'npm' with 'pnpm' and all usage of 'npx' with 'pnpx'. Additionally, you can create an alias in your `.bashrc` (Linux) or `.zshrc` (Mac) files. This will mean that when you type in npm or npx, pnpm and pnpx will be substituted. Use the following commands to add the aliases to the corresponding file:

```bash
# Linux
echo 'alias npm="pnpm"' >> .bashrc

# Mac
echo 'alias npm="pnpm"' >> .zshrc
```

## Running This Project

First, install the project dependencies:

```bash
npm install
```

Then, you must run the docker compose command:

```bash
docker compose up
# or, if you want to keep using the terminal in which you executed the command
docker compose up -d
```

Then, you must run the prisma push command:

```bash
npx prisma db push
``` 

Now, in order for logging in to work, you must seed your account information into the local database, AND add your credentials to Auth0
Edit the seed.js file to match your credentials, and then run this command:

```bash
npx prisma db seed
```

If you dont already have your .env files setup, make sure to do this as well. you may have to restart your
docker containers for new env file changes to take effect:

```bash
docker compose down

docker compose up
# or
docker compose up -d
```

Finally, run this:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Make sure you have created a user in the Auth0 application dashboard as well! After one user has been created through the Auth0 dashboard, additional users can be created using the same method, or directly through our website by navigating to the admin page on the employee dashboard, and clicking the 'Register' button.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Running End to End Tests

Our codebase uses Cypress with Gherkin syntax to write and run end to end tests. Running E2E tests is simple. First, make sure you have the `cypress.env.json` and the `.env.test` files in your root project directory with the proper variables (these files should be provided to you).

In order to run the E2E testing suite, you can run the following command:

```bash
npm run test:e2e
```

This will run a series of commands:
- Creates a new database for the testing enviornment
- Runs the website locally
- Opens the Cypress testing panel

If you see patch notes, simply click next.

When prompted, you can then choose the End to End Testing option. From here, choose Chrome and click the launch button.

After you are in the E2E testing menu, you can choose a .feature file to test the specific feature. More information about how to write tests properly can be found in a seperate README file located under the `cypress` directory in the project.

Once you are finished testing, you can simply exit out of all Cypress related windows. Once all Cypress windows are closed, the cleanup command will automatically execute. This command will:
- Stop running the website
- Kill and destroy the testing database
- Cleanup all docker containers associated with testing

IMPORTANT: DO NOT RUN E2E TESTS USING ANY OTHER COMMAND OTHER THAN THE ONE GIVEN HERE (SUCH AS `npx cypress open` OR `npx cypress test`), UNLESS YOU KNOW EXACTLY WHAT YOU ARE DOING.

## Learn More

### Learn HTML, CSS, JavaScript, and TypeScript

#### HTML

Websites are built using HTML, CSS, and JavaScript. HTML, or Hypertext Markup Language, is a markup language for the web that defines the structure of web pages[^1]. Examples of these structures include paragraphs, headings, headers, footers, lists, navigation, and images. Each one of these components is defined in an HTML file for every website you visit.

[^1]: [What is HTML - Definition and Meaning of Hypertext Markup Language by freeCodeCamp](https://www.freecodecamp.org/news/what-is-html-definition-and-meaning/)

#### CSS

#### JavaScript

#### TypeScript

### Learn Next.js

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Official Next.js Examples](https://github.com/vercel/next.js/tree/canary/examples)
- [Official Next.js with Prisma Example](https://github.com/prisma/prisma-examples/tree/latest/typescript/rest-nextjs-api-routes)

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

### Learn Prisma

To learn more about Prisma, take a look at the following resources:


- [Prisma Documentation](https://www.prisma.io/docs)
- [Learn Prisma](https://www.prisma.io/learn)
- [Official Prisma Examples](https://github.com/prisma/prisma-examples)

### Conceptual Overview: 

**Current Situation and Proposed Solution**

Currently, the Wellness Center relies on a manual system involving phone calls and Google Sheets to coordinate rides and track volunteer hours. The proposed web application will significantly improve this process by:

1. Automating ride selection for volunteers
2. Reducing administrative workload
3. Providing real-time tracking of rides and volunteer hours
4. Centralizing all data in an easily accessible database

**Key Features and Functionality**

1. **Landing Page**
  -	Implements a login button that redirects users to login to their account
  Login Page
  -	After filling out user credentials, should validate that they match in an account in the system which will be handled by Auth0
  -	After logging in, should redirect users to the appropriate dashboard given their account permissions.

2. **Registration Page**
-	Include a registration form that is used for creating user volunteer accounts
Employee Dashboard
-	Display relevant information that admins would like to see at a glance such as recently booked or completed rides

3. **Employee Rides Page**
-	Functionality to add in available rides for reservation that will be added to the database 
-	Include table display that filters rides based on the ride’s status (available, reserved, and completed)

4. **Employee Volunteers Page**
-	Functionality to register volunteer accounts into the system
-	Table Display that shows the status of volunteers such as if they are available to reserve a ride or occupied with a ride

5. **Employee Clients Page**
-	Functionality to register clients that regularly book rides with the organization
-	Table display that shows the clients that are registered with the organization

6. **Employee Admin Page**
-	Implements button that redirects user to the registration page

7. **Volunteer Dashboard**
-	Display rides that users may have reserved. If no rides are reserved, indicate that the user has no ride reserved.

8. **Volunteer Rides Page**
-	Table display that shows all of the available rides that can be reserved by the volunteers (Includes functionality to also cancel rides that the user may have reserved)

9. **Volunteer Hours Page**
-	Table display that includes the rides completed by the volunteer and the hours volunteered

10. **Volunteer Settings Page**
-	Functionality to allow users to change any settings deemed necessary such as how often users may want to be notified about new rides being added such as daily or immediately.
-	Update password / information functionality


## Migration Scripts

Currently the partner uses Salesforce to store information about WCOA Members. They mentioned that there is currently no need to migrate that information over but maybe required in the future. 

## Deploying This Project
