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

## API Documentation

### Auth & Users (`/`)

| Method | Endpoint | URL Params | Request Body | Description |
|---|---|---|---|---|
| `POST` | `/register` | - | `name`, `phone`, `password` | Register a new user |
| `POST` | `/login` | - | `phone`, `password` | Login user |
| `POST` | `/demo-login` | - | `role` ('member' or 'admin') | Demo login |
| `GET` | `/profile` | - | - | Get logged-in user profile (Protected) |
| `GET` | `/admin` | - | - | Validate Admin profile (Protected, Admin) |

### Admin Chits (`/admin/chits`)

| Method | Endpoint | URL Params | Request Body | Description |
|---|---|---|---|---|
| `GET` | `/admin/chits/` | - | - | Get all chits |
| `GET` | `/admin/chits/:id` | `id` (Chit ID) | - | Get specific chit details |
| `POST` | `/admin/chits/` | - | `name`, `chitValue`, `monthlyAmount`, `totalMembers`, `duration`, `startDate`, `endDate` | Create a new chit group |
| `PUT` | `/admin/chits/:id` | `id` (Chit ID) | *(Optional fields from Create)* | Update chit details |
| `DELETE` | `/admin/chits/:id` | `id` (Chit ID) | - | Delete a chit completely |
| `POST` | `/admin/chits/:id/members` | `id` (Chit ID) | `members` (Array of Member IDs), `slots` (Optional) | Add one or more members to chit |
| `DELETE` | `/admin/chits/:id/members/:memberId` | `id`, `memberId` | - | Remove a single member slot from chit |
| `POST` | `/admin/chits/:id/months` | `id` (Chit ID) | `monthNumber`, `auctionAmount`, `winner` | Record new auction (month) data |
| `PUT` | `/admin/chits/:id/months` | `id` (Chit ID) | `monthNumber`, `auctionAmount` (Optional), `winner` (Optional) | Edit month/auction data |
| `DELETE` | `/admin/chits/:id/months` | `id` (Chit ID) | `monthNumber` | Remove month data |
| `PUT` | `/admin/chits/:id/months/payments` | `id` (Chit ID) | `monthNumber`, `memberId`, `isPaid`, `paymentIndex` (Optional) | Update individual member's payment status |
| `PUT` | `/admin/chits/:id/months/payments/mark-all-paid` | `id` (Chit ID) | `monthNumber` | Mark all participants in a month as paid |
| `PUT` | `/admin/chits/:id/lifted/:memberId` | `id`, `memberId` | - | Toggle member's "lifted" flag (won the auction) |
| `POST` | `/admin/chits/:id/months/send-reminders` | `id` (Chit ID) | `monthNumber` | Send auction reminder notifications to all |

### Admin Users (`/admin/users`)

| Method | Endpoint | URL Params | Request Body | Description |
|---|---|---|---|---|
| `GET` | `/admin/users/` | - | - | Get all users |
| `POST` | `/admin/users/` | - | `name`, `phone`, `password`, `role` | Create a new system user |
| `PUT` | `/admin/users/:id` | `id` (User ID) | *(Optional fields from Create)* | Modify an existing user |
| `DELETE` | `/admin/users/:id` | `id` (User ID) | - | Delete a user |

### Member Chits (`/my-chits`)

| Method | Endpoint | URL Params | Request Body | Description |
|---|---|---|---|---|
| `GET` | `/my-chits` | - | - | Retrieve all chits the logged-in member has joined |
| `GET` | `/my-chits/:id` | `id` (Chit ID) | - | Get detailed breakdown of a specific joined chit |
| `POST` | `/my-chits/:id/participate` | `id` (Chit ID) | `monthNumber` | Express interest in a specific auction to admin |

### Notifications (`/notifications`)

| Method | Endpoint | URL Params | Request Body | Description |
|---|---|---|---|---|
| `GET` | `/notifications` | - | - | Get list of user's notifications |
| `GET` | `/notifications/unread-count` | - | - | Get count of unread notifications |
| `PUT` | `/notifications/:id/read` | `id` (Notification ID) | - | Mark a specific notification as read |

## Default Credentials

After running `npm run seed`:

| Role   | Phone        | Password   |
| ------ | ------------ | ---------- |
| Admin  | 1000000001   | admin123   |
