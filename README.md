# YouTube Clone - MERN Stack

A full-stack **YouTube-like video streaming platform** built with the MERN stack (MongoDB, Express, React, Node.js) featuring **video upload, playback, subscriptions, likes/dislikes, comments, search, and authentication**.

---

## Features

### Authentication
- User **Login** & **Register** (JWT-based)
- Protected routes for logged-in users
- Avatar upload

### Video Management
- Upload videos with title, description, category, and thumbnail
- View videos with embedded player
- Edit & delete own videos
- Track video views, likes, and dislikes

### Channel System
- Create a channel with banner, name, and description
- Subscribe/Unsubscribe to channels
- Subscriber count tracking

### Comments
- Add, edit, and delete comments
- Display usernames & avatars of commenters
- Live update after posting

### Search & Categories
- Search videos by title, description, or category
- Browse videos by category

### Responsive Design
- Fully responsive UI using **Tailwind CSS**
- Sidebar collapse/expand toggle
- Mobile-friendly header with search & sign-in button

---

## Tech Stack

### Frontend:
- **React.js** (with Hooks & React Router v6)
- **Redux Toolkit** for state management
- **Axios** for API calls
- **Tailwind CSS** for styling
- **React Icons** for icons

### Backend:
- **Node.js + Express.js**
- **MongoDB + Mongoose** (with population for relationships)
- **JWT Authentication**
- **Bcrypt.js** for password hashing

---

## Installation & Setup

### Clone Repository
```bash
git clone https://github.com/ManvithGatty/You-Tube-Clone.git
cd You-Tube-Clone
```

### Backend Setup
```bash
cd backend
npm install
```

### Create .env file
```bash
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

### Backend Run
```bash
npm start
```

### Frontend Setup and run
```bash
cd ../frontend
npm install
npm run dev
```
