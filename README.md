# IDKAcademy

A simple student score management system built with React, Redux, Express, MongoDB, JWT, and Google OAuth.

## 📝 Table of Contents

- [Project Overview](#project-overview)  
- [Tech Stack](#tech-stack)  
- [Team & Responsibilities](#team--responsibilities)  
- [Getting Started](#getting-started)  
  - [Prerequisites](#prerequisites)  
  - [Environment Variables](#environment-variables)  
  - [Installation](#installation)  
  - [Running the App](#running-the-app)  
- [API Documentation](#api-documentation)  
- [Features](#features)  
- [Folder Structure](#folder-structure)  
- [License](#license)  

---

## 🎯 Project Overview

IDKAcademy is a Single-Page Application (SPA) that allows:

- **Admins** to record and manage scores, and view score history.  
- **Students** to sign up, log in, and see their recorded scores with pagination.  
- Users to authenticate via email/password **and** Google OAuth.  
- Email verification for e-mail sign-ups.

---

## 🛠 Tech Stack

- **Frontend:** React (Function Components), react-router-dom v6, Redux Toolkit, CSS Modules  
- **Backend:** Node.js, Express, MongoDB & Mongoose, Passport.js (Google OAuth), JWT, Nodemailer  
- **Dev Tools:** Nodemon

---

## 👥 Team & Responsibilities

| Team Member | Area                                        |
| ----------- | ------------------------------------------- |
| 1           | tinggal       |
| 2           | diisi         |
| 3           | satu-satu     |
| 4           | sampai        |
| 5           | lengkap       |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ and **npm**  
- **MongoDB** running locally on `mongodb://localhost:27017` (or a connection string of your choice)  

### Environment Variables

Create a file at `server/.env` with the following keys:

### MongoDB
MONGO_URI=mongodb://localhost:27017/idkAcademyDB

### JWT
JWT_SECRET=your_jwt_secret_here

### React client URL
CLIENT_URL=http://localhost:3000

### Email (for Nodemailer)
EMAIL_USER=your@gmail.com
EMAIL_PASS=app-password

### Google OAuth
GOOGLE_ID=your_google_client_id
GOOGLE_SECRET=your_google_client_secret

### Installation

### Clone the repo
git clone https://github.com/your-org/IDKAcademy.git
cd IDKAcademy

### Install backend dependencies
cd server
npm install

### Install frontend dependencies
cd ../client
npm install

### Running the App

Open two terminals:
### Terminal 1: start backend
cd server
npm run dev      # nodemon server.js on port 5000

### Terminal 2: start frontend
cd client
npm start        # React app on port 3000

- Navigate to http://localhost:3000
- The React app will proxy API calls to http://localhost:5000/api/...

## 📚 API Documentation

### Authentication
POST /api/auth/register
Register with name, email, password, role.

json
Copy code
// request body
{ "name": "Alice", "email": "alice@mail.com", "password": "secret", "role": "student" }
Responses:

201 { message: 'Registered! …' }

400 { message: 'That email is already registered.' }

POST /api/auth/login
Login with email & password.

json
Copy code
// request body
{ "email": "alice@mail.com", "password": "secret" }
Responses:

200 { token, id, name, role }

400 { message: 'Invalid creds' }

GET /api/auth/verify/:token
Verify email link.
Response: 200 { message: 'Email verified' }

GET /api/auth/me
Get current user (JWT required).
Response:

json
Copy code
{ "id": "...", "name": "Alice", "role": "student", "email": "alice@mail.com" }
GET /api/auth/google → Google OAuth login

GET /api/auth/google/callback → Redirects to client /oauth?token=…

### Users
GET /api/users?role=student
List all students (admin only).
Response:

json
Copy code
[{ "_id": "...", "name": "Bob", "email": "bob@mail.com" }, …]
PUT /api/users/:id/role
Update a user’s role (admin only).

json
Copy code
{ "role": "admin" }

### Scores
Scores
POST /api/scores
Create a score (admin only).

json
Copy code
{ "student": "<userId>", "subject": "Math", "score": 85, "feedback": "Good job" }
GET /api/scores?studentId=<id>&page=1&limit=5
List scores paginated (student sees own; admin can view any).
Response:

json
Copy code
{
  "docs": [ { "_id": "...", "subject": "...", … }, … ],
  "page": 1, "totalPages": 3, "totalDocs": 15
}
PUT /api/scores/:id
Update a score (admin only).

DELETE /api/scores/:id
Delete a score (admin only).

## ✨ Features
- SPA with React Router
- State managed by Redux Toolkit
- Email verification via Nodemailer
- Google OAuth with Passport.js
- Protected routes and middleware guards
- Responsive, card-based UI with CSS Modules
- Pagination on student & admin score listings

## 📂 Folder Structure
IDKAcademy/
├── client/          # React app
│   ├── src/
│   │   ├── api/
│   │   ├── app/
│   │   ├── components/
│   │   ├── features/
│   │   └── pages/
│   └── package.json
└── server/          # Express API
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── utils/
    ├── .env
    └── server.js

## 📄 License
This project is licensed under the MIT License. See LICENSE for details.
