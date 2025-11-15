# Timetable Scheduler (with Leave + Substitution)

## Overview
A starter MERN-style timetable scheduler:
- Backend: Node.js, Express, Mongoose (MongoDB)
- Frontend: React + Vite
- Features:
  - Create teachers, subjects (with priority), classes, rooms, timeslots
  - Generate a base timetable using a backtracking heuristic
  - Teachers can apply for leave
  - Admin can process leave -> automatic substitution based on subject priority & availability
  - Substitution log + timetable viewer

## Quick start (local)
1. MongoDB: use MongoDB Atlas or run MongoDB locally.

2. Backend
```bash
cd backend
cp .env.example .env
# edit .env to set MONGO_URI (your MongoDB Atlas connection string)
npm install
npm run seed      # populate sample data
npm run dev       # run server on port 5000
```

3. Frontend
```bash
cd frontend
npm install
npm run dev       # open http://localhost:5173
```

## APIs
- Teachers: GET/POST/PUT/DELETE `/api/teachers`
- Subjects: GET/POST/PUT/DELETE `/api/subjects`
- Classes: GET/POST/PUT/DELETE `/api/classes`
- Rooms: GET/POST/PUT/DELETE `/api/rooms`
- Timeslots: GET/POST/PUT/DELETE `/api/timeslots`
- Scheduler: `POST /api/scheduler/generate`, `GET /api/scheduler/assignments`
- Leave: `POST /api/leave` (apply), `GET /api/leave`, `POST /api/leave/process/:id` (process)

## Notes & next steps
- Add auth & role-based access (teacher vs admin).
- Improve scheduling (multiple lectures per subject, optimize load).
- Add notifications (email/SMS) for substitutions.
- UI improvements: use Material UI or Tailwind, add drag-and-drop editing.
