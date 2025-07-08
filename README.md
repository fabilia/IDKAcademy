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

- **Admins** to register students, record and manage scores, and view score history.  
- **Students** to sign up, log in, and see their recorded scores with pagination.  
- Users to authenticate via email/password **and** Google OAuth.  
- Email verification for all new sign-ups.

---

## 🛠 Tech Stack

- **Frontend:** React (Function Components), react-router-dom v6, Redux Toolkit, CSS Modules  
- **Backend:** Node.js, Express, MongoDB & Mongoose, Passport.js (Google OAuth), JWT, Nodemailer  
- **Dev Tools:** Nodemon, ESLint, Prettier  

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

```dotenv
# MongoDB
MONGO_URI=mongodb://localhost:27017/idkAcademyDB

# JWT
JWT_SECRET=your_jwt_secret_here

# React client URL
CLIENT_URL=http://localhost:3000

# Email (for Nodemailer)
EMAIL_USER=your@gmail.com
EMAIL_PASS=app-password

# Google OAuth
GOOGLE_ID=your_google_client_id
GOOGLE_SECRET=your_google_client_secret
