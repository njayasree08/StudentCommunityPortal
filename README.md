# 🎓 Student Community & Education Announcement Portal

A modern full-stack **MERN-based Student Community Portal** designed to provide students with a centralized platform for communication, educational announcements, file sharing, profiles, and community interaction.

The application provides separate experiences for **students and administrators**, with secure authentication, private messaging, file management, community resources, and real-time communication.

<img width="300" height="300" alt="Screenshot 2026-09-27 194546" src="https://github.com/user-attachments/assets/52535eab-5822-4978-b7a4-adcf83e8115a" />
<img width="300" height="300" alt="Screenshot 2026-09-27 194157" src="https://github.com/user-attachments/assets/f7a4e9a1-9813-4502-af69-a67dda1cfa2c" />


---

## 🚀 Live Deployment

### Frontend

> Add your deployed frontend URL here after deployment.

```text
https://studentcommunityportal-9.onrender.com
```

### Backend API

```text
https://studentcommunityportal-10.onrender.com/
```

### Database

MongoDB Atlas

---

## 📌 Project Overview

The Student Community Portal helps students access important educational information and communicate within a single platform.

The system supports:

* Student registration and login
* Secure JWT authentication
* Student profiles
* Private messaging
* Real-time messaging
* Private file storage
* Community file sharing
* Educational announcements
* Personal events and reminders
* Admin management
* Admin-to-student communication
* Role-based access control
* MongoDB data persistence
* Responsive user interface

---

## ✨ Key Features

### 👨‍🎓 Student Features

* Create a student account
* Login securely
* View personal dashboard
* Manage profile information
* Change account password
* Send private messages
* Receive messages from other users
* Edit and delete messages
* Upload private files
* View personal files
* Open/read uploaded files
* Delete personal files
* Access community-shared files
* View educational announcements
* View personal events, exams, and reminders

---

### 👨‍💼 Admin Features

Administrators have additional management capabilities.

* Admin authentication
* View registered users
* Manage community communication
* Send messages to students
* Send community-wide messages
* Manage admin messages
* Upload personal/private files
* Manage administrator profile
* Monitor portal activity

---

### 💬 Messaging System

The portal provides private and community messaging.

Users can:

* Send messages to other registered users
* Receive messages in real time
* Edit their own messages
* Delete their own messages
* View conversation history

The application uses **Socket.IO** for real-time communication.

---

### 📁 File Management

The portal supports two types of files:

#### Private Files

Private files are accessible only to the file owner and authorized administrators.

#### Community Files

Community files can be shared with authenticated members of the portal.

Supported functionality includes:

* Upload files
* View files
* Open/read files
* Delete permitted files
* File ownership management
* File visibility control

Maximum upload size:

```text
10 MB
```

---

## 🛠️ Technology Stack

### Frontend

* React.js
* Vite
* JavaScript
* CSS
* React Router
* Socket.IO Client

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs
* Multer
* Socket.IO
* CORS
* dotenv

### Deployment

* Vercel / Render — Frontend
* Render — Backend
* MongoDB Atlas — Database

---

## 🏗️ Project Architecture

```text
StudentCommunityPortal/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Messages.jsx
│   │   │   ├── PrivateFiles.jsx
│   │   │   ├── CommunityFiles.jsx
│   │   │   └── AdminDashboard.jsx
│   │   │
│   │   ├── App.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   ├── vite.config.js
│   └── .env
│
├── server/
│   ├── models/
│   │   ├── User.js
│   │   ├── Announcement.js
│   │   ├── Message.js
│   │   └── File.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── announcementRoutes.js
│   │   ├── messageRoutes.js
│   │   └── fileRoutes.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── adminMiddleware.js
│   │
│   ├── uploads/
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── .gitignore
└── README.md
```

---

## 🔐 Authentication & Authorization

The application uses **JSON Web Tokens (JWT)** for authentication.

### Authentication Flow

```text
User
  ↓
Registration
  ↓
Password Hashing
  ↓
MongoDB
  ↓
Login
  ↓
JWT Token
  ↓
Authenticated Requests
```

Passwords are securely hashed using:

```text
bcryptjs
```

Authentication tokens are generated using:

```text
jsonwebtoken
```

---

## 👥 User Roles

The system supports two roles:

```text
student
admin
```

### Student

Regular portal user with access to:

* Dashboard
* Profile
* Messages
* Private Files
* Community Files

### Admin

Administrative user with additional access to:

* User management
* Community communication
* Administrative features
* Portal management

---

## 🗄️ Database

The project uses **MongoDB Atlas**.

Main collections/models include:

```text
Users
Messages
Files
Announcements
```

### User

Stores:

* Name
* Email
* Password hash
* Role
* Profile image
* Account timestamps

### Message

Stores:

* Sender
* Receiver
* Message content
* Read status
* Created/updated timestamps

### File

Stores:

* Original filename
* Stored filename
* File path
* MIME type
* File size
* Owner
* Visibility
* Created/updated timestamps

---

## ⚙️ Local Installation

### 1. Clone the repository

```bash
git clone https://github.com/njayasree08/StudentCommunityPortal.git
```

Navigate into the project:

```bash
cd StudentCommunityPortal
```

---

# 💻 Backend Setup

Navigate to the server:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create:

```text
server/.env
```

Add:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secure_jwt_secret
```

> Never commit your `.env` file to GitHub.

Start the backend in development mode:

```bash
npm run dev
```

Or start normally:

```bash
npm start
```

The backend will run at:

```text
http://localhost:5000
```

---

# 🌐 Frontend Setup

Open a new terminal.

Navigate to:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Create:

```text
client/.env
```

Add:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

The application will normally be available at:

```text
http://localhost:5173
```

---

## 🏭 Production Build

To create a production build:

```bash
cd client
npm run build
```

The generated production files will be created inside:

```text
client/dist
```

---

## 🔌 API Structure

The backend API uses the following base URL:

```text
/api
```

### Authentication

```text
POST /api/auth/login
POST /api/students/register
```

### Users

```text
GET  /api/users
GET  /api/users/me
PUT  /api/users/me
```

### Messages

```text
POST   /api/messages/send
POST   /api/messages/broadcast
GET    /api/messages/:userId
PUT    /api/messages/:id
DELETE /api/messages/:id
```

### Files

```text
POST   /api/files/private
GET    /api/files/private

POST   /api/files/community
GET    /api/files/community

GET    /api/files/:id/open
DELETE /api/files/:id
```

---

## 🔄 Real-Time Communication

The portal uses **Socket.IO** to support real-time messaging.

Communication flow:

```text
Student A
    ↓
Socket.IO
    ↓
Backend Server
    ↓
Socket.IO
    ↓
Student B
```

This allows new messages and message updates to appear without manually refreshing the page.

---

## 📦 Environment Variables

### Backend

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secure_secret
```

### Frontend

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

For production, replace the local backend URL with your deployed backend URL.

Example:

```env
VITE_API_URL=https://studentcommunityportal-5.onrender.com/api
VITE_SOCKET_URL=https://studentcommunityportal-5.onrender.com
```

---

## 🚀 Deployment

### Recommended Architecture

```text
                ┌─────────────────────┐
                │      Students       │
                └──────────┬──────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │ React + Vite Client │
                │       Vercel        │
                └──────────┬──────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │  Node + Express API │
                │       Render        │
                └──────────┬──────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │    MongoDB Atlas    │
                └─────────────────────┘
```

### Frontend

Recommended:

```text
Vercel
```

Build command:

```bash
npm run build
```

Output directory:

```text
dist
```

Root directory:

```text
client
```

### Backend

Recommended:

```text
Render
```

Build command:

```bash
npm install
```

Start command:

```bash
npm start
```

Backend URL:

```text
https://studentcommunityportal-5.onrender.com
```

---

## 🔒 Security

The project implements several security practices:

* Password hashing with bcrypt
* JWT-based authentication
* Role-based authorization
* Protected API routes
* Private file ownership validation
* Authenticated community file access
* Environment variables for sensitive configuration
* `.env` excluded from Git
* File upload size restrictions

### Important

Never commit credentials such as:

```text
MongoDB passwords
JWT secrets
API keys
Cloud credentials
```

to GitHub.

---

## 📱 Responsive Design

The frontend is designed to work across:

* 💻 Desktop
* 💻 Laptop
* 📱 Mobile
* 📲 Tablet

The interface includes dedicated pages for:

* Login
* Registration
* Dashboard
* Messages
* Files
* Profile
* Administration

---

## 🎯 Project Objectives

The main objectives of the Student Community Portal are:

1. Provide students with a centralized communication platform.
2. Simplify educational information sharing.
3. Enable secure private communication.
4. Provide private and community file sharing.
5. Provide administrators with communication and management capabilities.
6. Create a scalable MERN-stack application.
7. Provide a responsive and user-friendly experience.

---

## 🔮 Future Enhancements

Potential future improvements include:

* 📢 Advanced announcement management
* 📅 Calendar integration
* 🔔 Push notifications
* 📧 Email notifications
* ☁️ Cloud file storage
* 🔍 Advanced search
* 🧑‍🤝‍🧑 Student groups
* 💬 Group conversations
* 📊 Student activity analytics
* 🌙 Dark mode
* 📱 Progressive Web App support
* 🔐 Two-factor authentication
* 🛡️ Advanced security monitoring

---

## 🧪 Development

Run backend:

```bash
cd server
npm run dev
```

Run frontend:

```bash
cd client
npm run dev
```

Build frontend:

```bash
cd client
npm run build
```

---

## 📂 Git Workflow

After making changes:

```bash
git add .
git commit -m "Update Student Community Portal"
git push origin main
```

---

## 📝 Project Status

```text
Development Status: Active
Project Type: Full-Stack Web Application
Architecture: MERN
Authentication: JWT
Database: MongoDB Atlas
Real-Time Communication: Socket.IO
Frontend: React + Vite
Backend: Node.js + Express
```

---

## 👩‍💻 Author

**N. Jayasree**

B.Tech Computer Science and Engineering (AI & Data Analytics)

GitHub:

```text
https://github.com/njayasree08
```

---

## 📄 License

This project is intended for educational and portfolio purposes.

You may modify and extend the project according to your requirements.

---

## ⭐ Acknowledgements

This project was developed using modern web technologies from the JavaScript ecosystem, including React, Node.js, Express, MongoDB, and Socket.IO.

---

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.
