Overview:
The project involves creating a system to facilitate communication between WCOA staff and volunteer drivers, allowing volunteers to register for rides and track hours. The system will consist of two main modes or views, the administrator, and the volunteer view. The administrator view would have the ability to create, edit, and delete needed rides and to see the information and hours for volunteer drivers. The volunteer driver mode of the web app would have the ability to view needed ride listings, the ability to sign up for rides and the ability to view their own rides as well as past rides and hours. For each of the administrators and volunteers, there would need to be a way to create, edit and delete the account, although restrictions would need to be placed on creating a new account to ensure it has approval. In the future, the app could be made salesforce compatible, as this is something our project partner would like to be available. Due to time constraints, this semester we were not able to implement the full functionality of all the pages or components, but we sought to show where the needed components might be located or implemented.

Functional Requirements:
General:

- Layout should allow for easy navigation between pages and components
- Layout should generally match
- Ability to login to website with an account and only be able to access the functionality associated with their permission level - Ensure information is stored securely and remains HIPAA compliant

  Administrator/Employee mode:

  - Dashboard page displays menu and general information that might be helpful for viewing at first glance (such as number of rides needing confirmation)
  - Page for rides
    - Ability to add new rides, edit, and delete
    - Rides include information for: name of client, date, time, phone number, and locations
    - Ability to access added, reserved, and completed drives in a easy to view format
  - Page for volunteers
    - Component to create new volunteer driver- should store information like name, password, and email
      - something we were considering with account creation is to create account from admin side (as specified by client) that includes name and email and then automatically send the account holder an email to set up password and other info
    - Ability to view/edit volunteers
    - View total volunteer hours
  - Settings Page

  Volunteer mode:

  - Dashboard page displays menu and general information that might be helpful for viewing at first glance (such as number of hours completed in the past week or total hours)
  - Page for ride listings
    - Ability to view (but not edit) available rides
    - Ability to sign up for an available ride
    - Ability to cancel if it is 48 hours before the ride
    - Component to see what rides the user is sign up for
  - Page for hours
    - Ability to view total hours and past rides (history)
  - Page for settings
    - Ability to edit a limited amount of account details such as name, email, or password

Third Party Integrations:

- Auth0 management API route used to create accounts and made sure that the accounts were added to local DB via Prisma

Tech Stack:
Uses Next.js, PostgreSQL, Prisma

Deployment Notes:

- Project was just started this semester and is not yet in deployment phase

Migration Scripts:

- Project partner mentioned having information that is currently being used with Salesforce that they would appreciate being integrated with the app

Instructions for setting up development environment:
TO DO:
Instructions for setting up development environment. Assume that the needed software is already installed (Node.js, Docker, etc.). - How do you start your project? - How do you initialize the database? - How do you set up authentication? - Etc.
