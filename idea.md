# Chits-Manager — Chit Fund Management System

## Overview

**Chits-Manager** is a full-stack web application designed to digitize and simplify the management of Chit Funds. It provides a transparent, efficient, and secure platform for Chit Organizers (Admins) and Members to manage chit groups, track payments, conduct auctions, and monitor dividends.

Traditionally, chit funds are managed using pen and paper or simple spreadsheets, leading to errors, lack of transparency, and difficulties in tracking historical data. **Chits-Manager** automates these processes, ensuring accurate calculations for dividends, interest, and payable amounts while providing real-time updates to all stakeholders.

---

## Problem Statement

1.  **Manual Tracking Errors** — Manual calculation of dividends, interest, and monthly payable amounts is prone to human error.
2.  **Lack of Transparency** — Members often lack real-time visibility into the chit status, who the winner is, and what their exact payable amount is.
3.  **Payment Tracking Issues** — keeping track of who has paid and who is pending for each month across multiple chit groups is cumbersome.
4.  **Communication Gaps** — Informing all members about auction dates, winners, and due dates requires manual effort (calls/messages).
5.  **Data Security** — Physical records can be lost or damaged.

---

## Scope

### In Scope
-   **User Management**: Secure registration and login for Admins and Members.
-   **Chit Group Management**: Creation and configuration of new chits (Value, Duration, Members).
-   **Auction Management**: Recording auction winners and bid amounts for each month.
-   **Financial Calculations**: Automated calculation of auction dividends (bonus per member) and net payable amounts.
-   **Payment Tracking**: Admin can mark member payments as paid; Members can view their payment history.
-   **Dashboards**:
    -   **Admin**: Overview of all chits, total collections, pending payments, and quick actions.
    -   **Member**: View participated chits, payment status, dividends earned, and upcoming dues.
-   **Notifications**: Real-time or system alerts for auction results and payment reminders.
-   **Reporting**: Monthly breakdowns of auctions and payments.

### Out of Scope (for Current Version)
-   **Online Payment Gateway**: Actual money transfer happens offline; system only records the status.
-   **Mobile App**: Currently a responsive web application.
-   **Public Chit Marketplace**: Private group management only; no public listing of chits.

---

## Key Features

### 1. Chit Group Administration
-   **Create Chits**: Define total value, monthly contribution, duration, and add members.
-   **Member Management**: Add or remove members from chit groups.
-   **Lifecycle Management**: Start chits, track progress through months, and close completed chits.

### 2. Auction & Dividend System
-   **Auction Recording**: Record the auction winner and the winning bid amount.
-   **Auto-Calculation**: System automatically calculates:
    -   Commission (Organizer's fee)
    -   Total Dividend (Auction discount)
    -   Dividend per Member
    -   Net Payable Amount for the month.

### 3. Payment Tracking
-   **Status Tracking**: Mark individual payments as "Paid" or "Pending".
-   **Bulk Updates**: Admin can mark all payments for a month as paid (optional convenience).
-   **History**: Complete history of payments for every member in every chit.

### 4. User Dashboards
-   **Admin Dashboard**: High-level view of active chits, recent activities, and pending actions.
-   **Member Dashboard**: Personalized view showing:
    -   Total Invested Amount.
    -   Total Dividends Earned.
    -   Upcoming Payments.
    -   Chits Won/Lifted.

### 5. Notification System
-   **Alerts**: Notify members when an auction is completed or a payment is due.
-   **Updates**: Status updates on chit progression.

---

## Tech Stack

| Layer          | Technology                                      |
|----------------|--------------------------------------------------|
| **Frontend**   | React.js, Tailwind CSS (Stitch Design), Vite    |
| **Backend**    | Node.js, Express.js, TypeScript                 |
| **Database**   | MongoDB (Mongoose ODM)                           |
| **Auth**       | JWT (JSON Web Tokens), Bcryptjs                  |
| **Architecture**| MVC (Model-View-Controller), RESTful API        |
| **Deployment** | Vercel (Frontend), Render/Railway (Backend)      |

---

## Architecture Principles

-   **MVC Pattern**: Clear separation of concerns (Models, Controllers, Routes).
-   **RESTful Design**: Standard HTTP methods for resource manipulation.
-   **Middleware**: Centralized error handling and authentication checks (`protect`, `admin`).
-   **Scalability**: MongoDB schema designed for efficient querying of nested documents (Chits -> Months -> Payments).
-   **Security**: Password hashing, protected routes, role-based access control (RBAC).

---

## User Roles

| Role       | Description                                                   |
|------------|---------------------------------------------------------------|
| **Admin**  | Full access. Can create chits, add members, record auctions, and manage payments. |
| **Member** | Restricted access. Can view their chits, payment status, and history. |
| **Viewer** | (Optional) Read-only access to specific public data (if enabled). |
