🎓 CampusConnect – The University Talent Finder

CampusConnect is a full-stack MERN application built to connect students with on-campus opportunities. It serves as an intra-university job marketplace, enabling both students and recruiters to interact seamlessly.

📌 Table of Contents

Features

Tech Stack

Installation

Environment Variables

Folder Structure

API Overview

Contributing

License

🚀 Features
👨‍💼 Recruiters (Organizations / Clubs / Companies)

Secure authentication with company logo upload

Dashboard to manage job posts and applicants

Create job listings with:

Rich text description

Job levels (Intern, Junior, Senior)

Salary range

Categories

Manage applicants (view profile & resume)

Shortlist, Accept, Reject candidates

Close job openings (auto-notify all applicants)

Analytics: View applicant count per job

👩‍💻 Students

Secure student signup/login

Complete profile setup (skills, bio, picture)

Upload & update resume (PDF, Cloudinary storage)

Smart job search (filter by Category, Title, Location)

Job recommendations based on skill matching

Track application status:

Pending

Shortlisted

Accepted

Rejected

🔔 Global Features

Real-time notification system

Fully responsive UI (Tailwind CSS)

Smooth animations (Framer Motion)

Clean and modern UI with skeleton loaders

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

⚙ Installation

Follow the steps below to run the project locally:

1. Clone the Repository
git clone https://github.com/your-username/CampusConnect.git
cd CampusConnect

2. Backend Setup
cd backend
npm install


Run backend locally:

npm run dev

3. Frontend Setup
cd ../frontend
npm install
npm run dev


Your project will run at:
👉 http://localhost:5173/

🔐 Environment Variables
Backend .env
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
PORT=5000

Frontend .env
VITE_API_URL=http://localhost:5000

📁 Folder Structure
CampusConnect/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── context/
    │   ├── hooks/
    │   └── App.jsx

📡 API Overview (short)

/api/auth/student – student register/login

/api/auth/company – company register/login

/api/jobs – create & fetch job posts

/api/applications – apply, shortlist, accept, reject

/api/notifications – real-time notifications

🤝 Contributing

Contributions are welcome!

git checkout -b feature/YourFeature
git commit -m "Add new feature"
git push origin feature/YourFeature


Then open a Pull Request.
