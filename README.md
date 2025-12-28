🎓 CampusConnect – University Talent Finder

🔗 Live Demo:
👉 https://web-production-1cd52.up.railway.app/

CampusConnect is a MERN-stack application that serves as an intra-university job marketplace. Students can find campus internships, projects, and jobs, while recruiters or student organizations can post opportunities and manage applicants.

🚀 Features
For Recruiters

Secure company authentication (with logo upload)

Dashboard to manage job postings and applicants

Create detailed job posts (description, salary, level, category)

View applicant profiles and resumes

Shortlist, Accept, or Reject candidates

Close job posts (auto-notify applicants)

View analytics for applicant counts

For Students

Secure student signup/login

Profile setup (skills, bio, profile picture)

Upload and update resume (PDF via Cloudinary)

Filter jobs by category, location, and title

Job recommendations based on skill matching

Track application status (Pending, Shortlisted, Accepted, Rejected)

General Features

Real-time notifications

Fully responsive UI (Tailwind CSS)

Smooth animations and loading states

🛠 Tech Stack
Frontend

React.js

Tailwind CSS

Context API

React Router

Framer Motion

Backend

Node.js

Express.js

MongoDB

JWT Authentication

Cloudinary (file uploads)

⚙️ Installation
1. Clone the Repository
git clone https://github.com/your-username/CampusConnect.git
cd CampusConnect

2. Environment Setup

Backend: copy backend/.env.example to backend/.env and fill values:

DATABASE_CONNECTION_URL (MongoDB)

JWT_SECRET

CLOUDINARY_* keys

optional: CORS_ORIGINS, GEMINI_*

Frontend: for production, set frontend/.env with:

VITE_BACKEND_URL=https://your-api.example.com

Dev uses a proxy automatically.

3. Development

Start backend:

cd backend
node app.js


Start frontend:

cd ../frontend
node ./node_modules/vite/bin/vite.js


Open http://localhost:5173/.
