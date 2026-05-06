# Team Task Manager — Backend

A RESTful API for a collaborative team task management application built with **Node.js**, **Express**, and **MongoDB (Atlas)**. Features JWT authentication, role-based access control (Admin / Member), and a real-time dashboard.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js (ESM) |
| Framework | Express.js v5 |
| Database | MongoDB Atlas (Mongoose v9) |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Deployment | Railway |

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── dashboardController.js
│   │   ├── projectController.js
│   │   ├── taskController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT protect
│   │   └── roleMiddleware.js  # adminOnly guard
│   ├── models/
│   │   ├── Project.js
│   │   ├── Task.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── taskRoutes.js
│   │   └── userRoutes.js
│   └── server.js
├── .env.example
├── package.json
└── Procfile
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js ≥ 18
- A MongoDB Atlas account and cluster

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/your-username/team-task-manager.git
cd team-task-manager/backend

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env and fill in your MONGO_URI and JWT_SECRET

# 4. Start in development mode (with hot reload)
npm run dev

# 5. Or start in production mode
npm start
```

The API will be available at `http://localhost:5000`.

---

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port (default: 5000) | No |
| `MONGO_URI` | MongoDB Atlas connection string | **Yes** |
| `JWT_SECRET` | Secret key for signing JWTs | **Yes** |
| `CLIENT_URL` | Frontend URL for CORS (e.g. https://your-app.railway.app) | No |

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login and receive JWT | No |

### Users
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/users/me` | Get current user profile | ✅ |
| GET | `/api/users` | List all users | ✅ Admin only |

### Projects
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/projects` | Create a project | ✅ |
| GET | `/api/projects` | Get all my projects | ✅ |
| GET | `/api/projects/:id` | Get project details | ✅ Member |
| DELETE | `/api/projects/:id` | Delete a project | ✅ Project Admin |
| POST | `/api/projects/:id/members` | Add member by email | ✅ Project Admin |
| DELETE | `/api/projects/:id/members/:userId` | Remove a member | ✅ Project Admin |

### Tasks
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/tasks` | Create a task | ✅ Admin |
| GET | `/api/tasks?projectId=` | Get tasks for a project | ✅ |
| GET | `/api/tasks/:id` | Get single task | ✅ |
| PUT | `/api/tasks/:id` | Update task (Admin: all fields; Member: status only) | ✅ |
| DELETE | `/api/tasks/:id` | Delete a task | ✅ Admin |

### Dashboard
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/dashboard` | Get stats (optionally scoped with `?projectId=`) | ✅ |

---

## 🎯 Role-Based Access

| Action | Admin | Member |
|--------|-------|--------|
| Create project | ✅ | ✅ |
| Add/remove members | ✅ | ❌ |
| Create task | ✅ | ❌ |
| Update any task field | ✅ | ❌ |
| Update task **status** only | ✅ | ✅ (own tasks) |
| Delete task | ✅ | ❌ |
| View all users | ✅ | ❌ |
| View all dashboard stats | ✅ | Own tasks only |

---

## 🚂 Deployment on Railway

1. Push your code to GitHub
2. Go to [railway.app](https://railway.app) and create a new project from your GitHub repo
3. In Railway's **Variables** tab, add:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `CLIENT_URL` (your frontend URL)
4. Railway will automatically detect the `Procfile` and run `node src/server.js`
5. Your API will be live at the Railway-assigned URL

> **Health Check**: `GET /api/health` — returns `{ "status": "ok" }` for uptime monitoring.

---

## 📝 License

MIT
