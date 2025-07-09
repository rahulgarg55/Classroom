# LIVE Classroom Project

## Overview
A virtual classroom system with real-time presence, role-based access, and event logging. Built with React, Node.js, Socket.IO, and MongoDB.

## Project Structure
- `backend/` — Node.js, Express, Socket.IO, MongoDB
- `frontend/` — React, Socket.IO client

## Setup Instructions

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB (local or Atlas)

### Backend
1. `cd classroom/backend`
2. `npm install`
3. Create a `.env` file with:
   ```
   MONGODB_URI=mongodb://localhost:27017/classroom
   PORT=5000
   ```
4. `npm run dev` (for development with nodemon) or `npm start`

### Frontend
1. `cd classroom/frontend`
2. `npm install`
3. Create a `.env` file with:
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```
4. `npm start`

### Testing
- **Backend:** `cd classroom/backend && npm test`
- **Frontend:** `cd classroom/frontend && npm test`

## Features
- Real-time classroom presence (students/teachers)
- Teacher controls: Start/End class
- Students can only join when class is started
- Manager can view event logs (join/leave/start/end) for any classroom

## Folder Structure
See code for details. All code is modular, clean, and ready for extension.
