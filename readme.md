# CourseMaster Server

## Screenshots

![CourseMaster Screenshot](https://raw.githubusercontent.com/ashikurahman1/course-master/refs/heads/main/public/course-master-black.vercel.app_.png)
![CourseMaster Dashboard](https://raw.githubusercontent.com/ashikurahman1/course-master/refs/heads/main/public/course-master-black.vercel.app_dashboard.png)

## Overview

CourseMaster Server is the backend API for the **CourseMaster** online learning
platform. It is a **full-stack learning management system (LMS)** backend built
with **Node.js**, **Express**, and **MongoDB**, providing APIs for users,
courses, enrollments, and authentication.

This server works together with the
[CourseMaster Client](https://github.com/ashikurahman1/course-master) to deliver
a complete e-learning experience.

**Live Client:** [CourseMaster Live](https://course-master-black.vercel.app/)

---

## Features

- User authentication and authorization (JWT-based)
- Role-based access: Admin, Instructor, Student
- Course CRUD operations
- Enrollment management
- Progress tracking for students
- Secure password hashing with bcrypt
- Integration-ready for frontend consumption

---

## Technology Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** JWT, bcrypt
- **Other Libraries:** cors, dotenv
- **Development:** nodemon

---

## Getting Started

### Prerequisites

- Node.js >= 18.x
- npm >= 9.x
- MongoDB Atlas or local MongoDB

## API Endpoints

> All endpoints are prefixed with `/api`

### Authentication

| Method | Endpoint         | Description             | Access |
| ------ | ---------------- | ----------------------- | ------ |
| POST   | `/auth/register` | Register a new user     | Public |
| POST   | `/auth/login`    | Login and get JWT token | Public |

### Users (Admin Only)

| Method | Endpoint           | Description              | Access |
| ------ | ------------------ | ------------------------ | ------ |
| GET    | `/admin/dashboard` | Admin dashboard overview | Admin  |
| GET    | `/admin/users`     | Get all users            | Admin  |

### Courses

| Method | Endpoint                   | Description         | Access |
| ------ | -------------------------- | ------------------- | ------ |
| GET    | `/courses`                 | List all courses    | Public |
| POST   | `/admin/create-course`     | Create a new course | Admin  |
| PUT    | `/admin/update-course/:id` | Update a course     | Admin  |
| DELETE | `/admin/delete-course/:id` | Delete a course     | Admin  |

### Enrollment

| Method | Endpoint                   | Description                   | Access  |
| ------ | -------------------------- | ----------------------------- | ------- |
| POST   | `/enrollment/enroll`       | Enroll a student to a course  | Student |
| GET    | `/student/:id/consumption` | Track student course progress | Student |

---

## Dependencies

### Main Dependencies

- `express` – Web framework for Node.js
- `mongoose` – MongoDB object modeling
- `dotenv` – Environment variable management
- `bcryptjs` – Password hashing
- `jsonwebtoken` – JWT-based authentication
- `cors` – Cross-Origin Resource Sharing

### Dev Dependencies

- `nodemon` – Auto-restarts server during development

---

### Installation

1. Clone the repository:

```bash
git clone https://github.com/ashikurahman1/course-master-server.git
cd course-master-server
```

2. Install dependencies:

```bash
npm install
```

3. Create a .env file in the root directory:

```bash
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

4. Create a .env file in the root directory:

```bash
npm run dev
```
