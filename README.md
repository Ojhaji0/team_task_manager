# Team Task Manager

## Overview
Team Task Manager is a full-stack collaborative task management web application where users can create projects, assign tasks, manage team members, and track progress.

## Features

### Authentication
- User Signup/Login
- JWT Authentication
- Protected Routes

### Project Management
- Create Projects
- Add/Remove Members
- Admin & Member Roles

### Task Management
- Create Tasks
- Assign Tasks
- Update Task Status
- Priority & Due Dates

### Dashboard
- Total Tasks
- Tasks by Status
- Overdue Tasks
- Tasks Per User

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Axios
- React Router

### Backend
- Node.js
- Express.js
- JWT Authentication

### Database
- MongoDB Atlas
- Mongoose

### Deployment
- Railway

---

# Installation

## Clone Repository

```bash
git clone https://github.com/Ojhaji0/team_task_manager.git
```

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Backend Setup

```bash
cd backend
npm install
npm run dev
```

---

# Environment Variables

## Backend (.env)

```env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret
CLIENT_URL=http://localhost:5173
```

## Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

---

# Railway Deployment

## Backend
- Deploy backend folder separately
- Set Root Directory = /backend
- Add environment variables
- Generate public domain

## Frontend
- Deploy frontend folder separately
- Set Root Directory = /frontend
- Add VITE_API_URL variable
- Generate public domain

---

# Live URLs

## Frontend
https://resilient-sparkle-production-3c21.up.railway.app

## Backend
https://teamtaskmanager-production-3ee2.up.railway.app

---

# Demo Video
Include:
- Signup/Login
- Project Creation
- Create task
- Task Assignment
- Dashboard
