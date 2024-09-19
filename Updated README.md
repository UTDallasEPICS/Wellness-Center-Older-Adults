# Project Overview: WCOA Staff and Volunteer Communication System

## Project Objective
The aim of this project is to develop a streamlined communication system for WCOA staff and volunteer drivers. This system will facilitate volunteer registration for rides and track volunteer hours effectively. The system features two primary views:

## System Features

### Administrator View
- **Ride Management:**
  - Create, edit, and delete ride requests.
  - View ride details, including client's name, date, time, phone number, and locations.
  - Monitor rides by their status: added, reserved, and completed.
  
- **Volunteer Management:**
  - Create, edit, and delete volunteer accounts, with new accounts requiring approval.
  - Access volunteer information and track volunteer hours.
  - Send account creation emails to new volunteers for password setup.
  
- **System Settings:**
  - Manage system configurations and settings.

### Volunteer View
- **Ride Listings:**
  - Browse available rides.
  - Sign up for rides.
  - Cancel ride sign-ups at least 48 hours before the scheduled time.
  - View current and past rides and track accumulated hours.
  
- **Account Management:**
  - Create, edit, and delete personal accounts, with changes needing approval.
  - Manage personal details such as name, email, and password.

## Functional Requirements

### General
- **Layout:** 
  - Ensure easy navigation between pages and components.
  - Maintain a consistent design throughout the application.
- **User Login:**
  - Implement secure login with access limited by permission levels.
  - Ensure HIPAA compliance for handling sensitive information.

### Administrator/Employee Mode
- **Dashboard Page:**
  - Display a menu with general information (e.g., number of rides needing confirmation).
  
- **Rides Page:**
  - Create, edit, and delete ride requests.
  - Ride details: client's name, date, time, phone number, and locations.
  - View added, reserved, and completed rides in an easy-to-read format.

- **Volunteers Page:**
  - Create new volunteer drivers, storing name, password, and email.
  - Admin-created accounts send email to new volunteers for password setup.
  - View and edit volunteer information.
  - Track total volunteer hours.
  
- **Settings Page:**
  - For managing system settings and configurations.

### Volunteer Mode
- **Dashboard Page:**
  - Displays menu and helpful general information (e.g., hours completed in the past week or total hours).
  
- **Ride Listings Page:**
  - View available rides (non-editable).
  - Sign up for available rides.
  - Cancel rides if it's 48 hours before the scheduled time.
  - See rides the volunteer is signed up for.
  
- **Hours Page:**
  - View total hours and history of past rides.
  
- **Settings Page:**
  - Edit limited account details such as name, email, or password.

## Technology Stack

- **Frontend:** Next.js
- **Database:** PostgreSQL
- **ORM:** Prisma


## Third party Integration

- **Authentication:** Auth0
