# Project Management System - Final Project

A full-stack project management application built with Node.js, Express, MongoDB, and vanilla JavaScript. Features JWT authentication, Role-Based Access Control (RBAC), Kanban board, todo lists, analytics dashboard, and a modern dark-themed UI.

## Features

### Core Functionality
- **User Authentication**: JWT-based login/registration system
- **Role-Based Access Control (RBAC)**: Admin and User roles with different permissions
- **Project Management**: Full CRUD operations for projects
- **Category Management**: Organize projects by categories (Admin only)
- **Kanban Board**: Drag-and-drop project status management (Admin only)
- **Todo Lists**: Task management within each project with automatic progress calculation
- **Comments System**: Users can comment on projects
- **Analytics Dashboard**: Visual charts showing budget distribution and project statuses
- **My Projects**: Users can view and manage only their own projects

### Advanced Features
- **Automatic Status Calculation**: Project status updates automatically based on todo completion
- **Progress Tracking**: Visual progress bars based on completed todos
- **Deadline Alerts**: Projects with deadlines within 24 hours are highlighted
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Dark theme with gradient backgrounds

## Architecture

The project follows **MVC (Model-View-Controller)** architecture:

```
backend_4/
├── models/          # Mongoose schemas (User, Project, Category)
├── controllers/     # Business logic (authController, projectController, categoryController)
├── routes/          # API endpoints (authRoutes, projectRoutes, categoryRoutes)
├── middleware/      # Authentication & authorization middleware
├── public/          # Frontend (index.html - Single Page Application)
└── server.js        # Express server entry point
```

## Prerequisites

- **Node.js** (v14 or higher)
- **MongoDB** (local or MongoDB Atlas)
- **npm** or **yarn**

## Local Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd backend_4
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/project-management
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=3000
```

**Important**: Never commit `.env` file to version control. Use `.env.example` as a template.

### 4. Run the Application

**Development mode** (with auto-reload):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

### 5. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## User Roles & Permissions

### Admin
- ✅ Create, update, and delete **all** projects
- ✅ Create and delete categories
- ✅ Change project status via Kanban board (drag-and-drop)
- ✅ Assign users to projects
- ✅ View all projects and analytics

### User
- ✅ Create projects (becomes the owner)
- ✅ Update and delete **only their own** projects
- ✅ Add todos and comments to **any** project
- ✅ View all projects (read-only for others' projects)
- ✅ View analytics
- ❌ Cannot manage categories
- ❌ Cannot change project status via Kanban
- ❌ Cannot assign users to projects

## API Documentation

### Base URL
```
http://localhost:3000
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "role": "user" | "admin"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Note**: Include the token in subsequent requests:
```http
Authorization: Bearer <your-token>
```

### Project Endpoints

#### Get All Projects
```http
GET /projects
```
**Access**: Public

#### Get Project by ID
```http
GET /projects/:id
```
**Access**: Public

#### Create Project
```http
POST /projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Project Title",
  "description": "Project description",
  "budget": 10000,
  "category": "category-id" | null,
  "deadline": "2026-12-31" | null
}
```
**Access**: Authenticated (project owner = current user)

#### Update Project
```http
PUT /projects/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description",
  "budget": 15000,
  "category": "category-id" | null,
  "deadline": "2026-12-31" | null
}
```
**Access**: Project owner or Admin

#### Delete Project
```http
DELETE /projects/:id
Authorization: Bearer <token>
```
**Access**: Project owner or Admin

#### Update Project Status (Kanban)
```http
PATCH /projects/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "backlog" | "in_progress" | "review" | "done"
}
```
**Access**: Admin only

#### Assign Users to Project
```http
PATCH /projects/:id/assign
Authorization: Bearer <token>
Content-Type: application/json

{
  "userIds": ["user-id-1", "user-id-2"]
}
```
**Access**: Admin only

#### Get Analytics Summary
```http
GET /projects/analytics/summary
```
**Access**: Public

### Todo Endpoints

#### Add Todo to Project
```http
POST /projects/:id/todos
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "Task description"
}
```
**Access**: Authenticated (can add to any project)

#### Update Todo
```http
PATCH /projects/:id/todos/:todoId
Authorization: Bearer <token>
Content-Type: application/json

{
  "done": true | false,
  "text": "Updated task text" (optional)
}
```
**Access**: Project owner or Admin (can only modify todos in projects they own/manage)

#### Delete Todo
```http
DELETE /projects/:id/todos/:todoId
Authorization: Bearer <token>
```
**Access**: Project owner or Admin

### Comment Endpoints

#### Add Comment to Project
```http
POST /projects/:id/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "Comment text"
}
```
**Access**: Authenticated

#### Get Project Comments
```http
GET /projects/:id/comments
Authorization: Bearer <token>
```
**Access**: Authenticated

### Category Endpoints

#### Get All Categories
```http
GET /categories
```
**Access**: Public

#### Create Category
```http
POST /categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Category Name",
  "description": "Optional description"
}
```
**Access**: Admin only

#### Delete Category
```http
DELETE /categories/:id
Authorization: Bearer <token>
```
**Access**: Admin only

## Deployment

### Deploy to Render

1. **Create a Render Account**
   - Go to [render.com](https://render.com) and sign up

2. **Create a New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository and branch

3. **Configure Build Settings**
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node

4. **Set Environment Variables**
   In Render dashboard → Environment:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=10000
   ```
   **Note**: Render automatically sets `PORT`, but you can override it.

5. **Deploy**
   - Click "Create Web Service"
   - Render will build and deploy your application
   - Your app will be available at `https://your-app-name.onrender.com`

### MongoDB Atlas Setup (for Production)

1. **Create MongoDB Atlas Account**
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster

2. **Get Connection String**
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password
   - Replace `<dbname>` with your database name

3. **Update Environment Variables**
   - Use the Atlas connection string as `MONGODB_URI` in Render

### Frontend Deployment

Since the frontend is integrated (served via `express.static('public')`), it will be deployed automatically with the backend on Render. No separate deployment needed.

## Project Structure

```
backend_4/
├── controllers/
│   ├── authController.js      # Authentication logic
│   ├── categoryController.js   # Category CRUD operations
│   └── projectController.js    # Project CRUD, todos, comments, analytics
├── middleware/
│   └── authMiddleware.js       # JWT verification & RBAC
├── models/
│   ├── User.js                # User schema (email, password, role)
│   ├── Project.js             # Project schema (with todos, comments)
│   └── Category.js            # Category schema
├── routes/
│   ├── authRoutes.js          # /auth endpoints
│   ├── projectRoutes.js       # /projects endpoints
│   └── categoryRoutes.js      # /categories endpoints
├── public/
│   └── index.html             # Single Page Application (SPA)
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore rules
├── package.json               # Dependencies and scripts
├── server.js                  # Express server entry point
└── README.md                  # This file
```

## Testing with Postman

A Postman collection is included in the repository (`postman_collection.json`). Import it into Postman to test all endpoints.

**Steps**:
1. Open Postman
2. Click "Import" → "File"
3. Select `postman_collection.json`
4. Set environment variables:
   - `base_url`: `http://localhost:3000` (or your Render URL)
   - `token`: (will be set automatically after login)

## Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Tokens**: Secure token-based authentication
- **RBAC**: Role-based access control for sensitive operations
- **Input Validation**: Mongoose schema validation
- **CORS**: Configured for cross-origin requests
- **Environment Variables**: Sensitive data stored in `.env

## Author

Yerulan

## Acknowledgments

- Express.js
- MongoDB & Mongoose
- Chart.js (for analytics)
- Tailwind CSS (via CDN)
