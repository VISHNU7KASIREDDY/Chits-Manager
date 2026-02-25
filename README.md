# Chits Manager

A full-stack web application for managing chit funds. It allows administrators to create and manage chit groups, conduct monthly auctions, track member payments, and send notifications. Members can view their chit details, payment history, and participate in auctions.

## Tech Stack

| Layer    | Technologies                          |
| -------- | ------------------------------------- |
| Frontend | React, Vite, React Router, Axios      |
| Backend  | Express, TypeScript, Mongoose, JWT    |
| Database | MongoDB                               |
| Hosting  | Vercel                                |

## Features

**Admin**
- Create and manage chit groups with configurable value, duration, and member count
- Add or remove members from chit groups
- Conduct monthly auctions and record winners
- Track and update payment statuses for each member
- Send notifications to members
- View dashboard with overall statistics

**Member**
- View enrolled chit groups and detailed monthly breakdowns
- Track personal payment history and upcoming dues
- View auction results and bonus distributions
- Receive notifications from admin

**General**
- Role-based access control (Admin, Member, Viewer)
- Phone number based authentication with JWT
- Password hashing with bcrypt
- Landing page with animated sections and contact form
- Responsive design

## Project Structure

```
├── backend/
│   └── src/
│       ├── controllers/    API logic for chits, users, notifications
│       ├── middlewares/     Auth and role-based access middleware
│       ├── models/         Mongoose schemas (User, Chit, Notification)
│       ├── routes/         Express route definitions
│       ├── utils/          Interfaces, helpers, and config
│       ├── app.ts          Express app setup
│       └── server.ts       Server entry point
├── frontend/
│   └── src/
│       ├── components/     Reusable UI components
│       ├── pages/
│       │   ├── admin/      Admin dashboard, chit management, user management
│       │   └── member/     Member dashboard, chit details, payments
│       ├── context/        Auth context provider
│       └── utils/          API helper and constants
└── stitch/                 Design reference
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance (local or Atlas)

### Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

```bash
npm run seed
npm run dev
```

### Frontend

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```

## API Overview

| Route Prefix             | Description                            |
| ------------------------ | -------------------------------------- |
| `/api/users`             | Auth (register, login, profile)        |
| `/api/chits`             | Member chit views and details          |
| `/api/admin/chits`       | Admin chit CRUD, auctions, payments    |
| `/api/admin/users`       | Admin user management                  |
| `/api/notifications`     | Send and fetch notifications           |

## Default Credentials

After running `npm run seed`:

| Role   | Phone        | Password   |
| ------ | ------------ | ---------- |
| Admin  | 1234567890   | admin123   |
