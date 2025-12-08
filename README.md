# WCOA Staff and Volunteer Communication System

## 🌟 Conceptual Overview

This project is a centralized **Communication and Management System** designed for the Wellness Center for Older Adults (WCOA). Its primary goal is to **streamline ride coordination** for staff and volunteer drivers, ensuring efficient client transportation and accurate tracking of volunteer service hours.

### User Roles and Descriptions

| Role | Access Level | Primary Functions |
| :--- | :--- | :--- |
| **Administrator/Employee** | High | Manages the system: Creates, edits, and tracks all ride requests; manages and approves all volunteer accounts; monitors and verifies volunteer hours. |
| **Volunteer Driver** | Medium | Utilizes the system to view and sign up for available rides; views scheduled and completed rides; manages personal account details and tracks accumulated hours. |

---

## ⚙️ Functional Requirements (Broken Down by Page)

### General Requirements
* **Authentication:** Secure login enforced by **Auth0**, restricting access based on `Admin` or `Volunteer` role.
* **Compliance:** Strict adherence to **HIPAA compliance** protocols for handling sensitive client information.

### Administrator/Employee Mode
* **Rides Page:** Create, edit, and delete ride requests; view all rides organized by status (Added, Reserved, Completed).
* **Volunteers Page:** Manage volunteer accounts (creation, editing, archival); approve new accounts; track total volunteer hours.
* **System Settings:** Manage global configurations, such as default cancellation policies or system email templates.

### Volunteer Mode
* **Ride Listings Page:** Browse available rides; sign up for open rides; cancel reservations (subject to a 48-hour deadline).
* **Dashboard/Hours Page:** View total accumulated volunteer hours and a history of all past and reserved rides.
* **Settings Page:** Edit personal contact details and manage password via Auth0.

---

## 💻 Technology Stack

This project is built using modern frameworks to ensure performance and maintainability.

### Core Architecture
* **Meta-Framework:** **Next.js (v14+)** - Provides a combined development environment for the frontend and API routes.
* **Language:** **TypeScript**
* **Styling:** **Tailwind CSS**

### Data & Persistence
* **Database (Development):** **SQLite** - Used for local file-based development/testing.
* **Database (Target Production):** **PostgreSQL** - The intended production database, supported by the adapter dependencies.
* **ORM:** **Prisma** - Used for schema definition, migrations, and type-safe database access.

### Third-Party Integrations
| Integration | Purpose in Project |
| :--- | :--- |
| **Auth0** | **Authentication & Authorization** (OIDC): Handles secure login, user session management, and role-based access control (RBAC). |
| **Nodemailer** | **Email Service:** Used for sending transactional emails, such as secure links for volunteer account creation/password setup. |
| **Google Maps Platform** | **Mapping & Location Services:** Used for displaying ride locations, calculating distances, and potentially visualizing available routes. |

---

## 🚀 Deployment and Setup

### Deployment Notes
The project is intended for cloud deployment on a serverless platform (e.g., Vercel, AWS Amplify) using a cloud-hosted **PostgreSQL** database.

* **Migration Scripts:** Database schema changes are managed via **Prisma Migrations** (located in `prisma/migrations`). Initial data for development is seeded via the **`scripts/seed.js`** file.

### 🛠️ Instructions for Setting Up the Development Environment

Assume that **Node.js (v18+), pnpm,** and a command-line interface are already installed.

#### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone [YOUR_REPO_URL]

# Navigate to the project directory
cd [YOUR_PROJECT_NAME]

# Install all project dependencies using pnpm
pnpm install

#### 2. Configure Environment Variables

Create a file named **`.env`** in the root directory by copying the example file:

```bash
cp .env.example .env

You must fill in the specific credentials for your Auth0 application and third-party services in the new `.env` file (replace example placeholders):

* `DATABASE_URL`: Set this to your local **SQLite** connection string (e.g., `file:./mydb.db`).
* `AUTH0_ISSUER_BASE_URL`, `AUTH0_CLIENT_ID`, etc.: Set these to your **Auth0** application credentials.
* `EMAIL_HOST`, `EMAIL_USER`, etc.: Set these to your **Nodemailer/SMTP** service credentials.
* `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Set your public API key for **Google Maps** services.

#### 3. Initialize the Database

Use **Prisma** to initialize the database file, run migrations, and populate it with seed data:

```bash
# Run existing migrations to create the database tables
npx prisma migrate dev --name init

# Seed the database with initial development data (using the updated script path)
pnpm prisma:seed

#### 4. Start the Project

The project can be started in development mode using the following command:

```bash
pnpm dev

