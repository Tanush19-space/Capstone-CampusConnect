# CampusConnect – University Campus Management System

## Overview
CampusConnect is a full-stack university campus management system developed using Node.js, Express.js, MongoDB, Mongoose and React.

It provides centralized management of courses, sections, student enrollment, attendance and announcements.

## Technology Stack
- Frontend: React, Vite, CSS
- Backend: Node.js, Express.js
- Database: MongoDB Atlas, Mongoose
- Authentication: JWT and bcrypt
- Real-time communication: Socket.IO
- API testing: Postman

## Main Features
- User registration and login
- Role-based access control for Admin, Faculty and Students
- Course management (CRUD)
- Section management and student enrollment
- Attendance management
- Attendance and course analytics using MongoDB aggregation
- Real-time announcements using Socket.IO
- Event-driven attendance logging using EventEmitter
- MongoDB indexes
- Centralized error handling and request logging

## Project Structure
```text
CampusConnect/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
└── frontend/
    ├── src/
    └── package.json
```

## Installation

### Backend
```bash
cd backend
npm install
```

Create a `.env` file:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

Start the backend:
```bash
npm run dev
```

### Frontend
Open another terminal:
```bash
cd frontend
npm install
npm run dev
```

Open the local Vite URL shown in the terminal.

## API Base URL
`http://localhost:5000/api`

## User Roles
- Admin: manages courses, sections and announcements.
- Faculty: manages attendance and announcements.
- Student: views academic information and announcements.

## Team
Developed as a Backend Development Capstone Project.

<img width="1920" height="1080" alt="Screenshot (94)" src="https://github.com/user-attachments/assets/aed5616e-00bb-4d6b-8679-961e31961d12" />
<img width="1920" height="1080" alt="Screenshot (93)" src="https://github.com/user-attachments/assets/aefc57a9-dd16-4221-8626-6fb39ff9f87b" />
<img width="1920" height="1080" alt="Screenshot (92)" src="https://github.com/user-attachments/assets/0412bd58-d617-405d-9e48-3ddf1a6f871a" />
<img width="1920" height="1080" alt="Screenshot (91)" src="https://github.com/user-attachments/assets/0b9b8e0c-fd3c-4a91-949e-ac831ec57860" />
<img width="1920" height="1080" alt="Screenshot (90)" src="https://github.com/user-attachments/assets/d85172f4-7b2c-4720-b932-7c2477c918e3" />
<img width="1920" height="1080" alt="Screenshot (43) - Copy" src="https://github.com/user-attachments/assets/cf260e42-ac80-4ba9-88b0-de439e99e7ba" />
<img width="1920" height="1080" alt="Screenshot (74)" src="https://github.com/user-attachments/assets/b28b9cc8-fc7d-4e1a-ad4c-5743795869ab" />
<img width="1920" height="1080" alt="Screenshot (44)" src="https://github.com/user-attachments/assets/774e13e8-4177-4f4e-8668-9ecba1058aaa" />
<img width="1920" height="1080" alt="Screenshot (45)" src="https://github.com/user-attachments/assets/4660eb14-58e4-4166-b444-6eff09fd3e29" />
<img width="1920" height="1080" alt="Screenshot (46)" src="https://github.com/user-attachments/assets/abd1df6f-5850-4553-9c69-4ffbec9bb936" />
<img width="1920" height="1080" alt="Screenshot (47)" src="https://github.com/user-attachments/assets/8497551d-5b04-4b0d-ac29-a08822a319c5" />
<img width="1920" height="1080" alt="Screenshot (48) - Copy" src="https://github.com/user-attachments/assets/d0a83286-4cc4-4714-bd4d-ddb71ea991b1" />
<img width="1920" height="1080" alt="Screenshot (49) - Copy" src="https://github.com/user-attachments/assets/be25d521-5ab3-4b8d-838d-c84cefbf0f8a" />
<img width="1920" height="1080" alt="Screenshot (50) - Copy" src="https://github.com/user-attachments/assets/0e0c67fd-2ed9-4649-9763-9b2a731c5676" />
<img width="1920" height="1080" alt="Screenshot (50)" src="https://github.com/user-attachments/assets/704f6747-4c67-4d9a-aaf8-7892b3cf40d0" />
