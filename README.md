# Assignment 4: Secure Project Management System with MVC Architecture

## Project Overview

This project is an evolution of my previous work. The main goal for this assignment was to refactor a simple backend application into a professional, scalable architecture. I moved away from a monolithic single-file structure to a modular Model-View-Controller (MVC) pattern. Additionally, I implemented robust security measures, including password hashing and Role-Based Access Control (RBAC), to differentiate between regular users and administrators.

## Architectural Choices (MVC Refactoring)

In the previous assignment, all the logic was contained within `server.js`. As the application grew, this became difficult to maintain. For this version, I separated the concerns into distinct directories:

**Models:** I created Mongoose schemas in the `models/` directory. This keeps the data definitions separate from the business logic.
**Controllers:** All the functional logic, such as creating a project or deleting a category, was moved to the `controllers/` directory. This makes the code reusable and easier to test.
**Routes:** The API endpoints are defined in the `routes/` directory. These files map specific URLs (like `/projects`) to the corresponding functions in the controllers.
**Middleware:** I created a `middleware/` folder to handle authentication checks. This ensures that security logic is not mixed with the core business logic.

This structure allows the project to scale easily. If I need to add new features later, I know exactly where each piece of code belongs.

## Database Design and Related Objects

To demonstrate relationships between data, I implemented two primary objects: **Projects** and **Categories**.

The **Category** object represents a grouping, such as "IT", "Marketing", or "Design". It has a name and a unique ID.
The **Project** object holds the main data, such as title, description, and budget.

I created a relationship between them by adding a reference in the Project schema. Each project stores the ObjectId of a Category. On the frontend, when fetching projects, the backend automatically "populates" this field so the user sees the actual category name instead of just an ID code. This fulfills the requirement for multi-object CRUD operations.

## Security Implementation

Security was a major focus of this assignment. I implemented a User model that includes an email, a password, and a role.

**Password Hashing:**
I used the `bcryptjs` library to secure user passwords. I set up a pre-save hook in the User model that automatically hashes the password before it is stored in the MongoDB database. This ensures that even if the database is compromised, the actual passwords remain safe.

**Authentication (JWT):**
For logging in, I implemented JSON Web Tokens (JWT). When a user successfully logs in, the server generates a signed token containing their User ID and Role. The client (browser) must send this token in the headers of subsequent requests to prove their identity.

## Role-Based Access Control (RBAC)

I implemented a strict permission system using custom middleware functions called `authenticate` and `authorizeAdmin`.

**Public Access:** Anyone can view the list of projects and categories (GET requests).
**Protected Access:** Operations that modify data (POST, PUT, DELETE) are protected.
**Admin Privileges:** I distinguished between "user" and "admin" roles. Regular users can log in to view content, but they cannot modify it. If a regular user tries to create or delete a project, the middleware checks their role inside the token and rejects the request with a 403 Forbidden error. Only users with the "admin" role are allowed to execute these changes.

## Setup and Installation

To run this project locally, you need to have Node.js and MongoDB installed.

1. Clone the repository to your local machine.
2. Open your terminal in the project folder and run `npm install` to download the dependencies (express, mongoose, bcryptjs, jsonwebtoken, cors, dotenv).
3. Create a `.env` file in the root directory. You will need to define your `MONGODB_URI` connection string and a `JWT_SECRET` key for signing tokens.
4. Run the server using `npm run dev` or `node server.js`.
5. Open `http://localhost:3000` in your browser to use the interface.

## API Usage

I have included a Postman collection in the submission to demonstrate the API testing. You will see that requests to create or delete items fail when using a standard user token but succeed when using an admin token. The frontend handles this gracefully by hiding or showing elements based on the logged-in user's role.