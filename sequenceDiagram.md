# Sequence Diagram — Chits-Manager

## Overview

These sequence diagrams depict key workflows in the Chits-Manager system, illustrating the interaction between Users (Admin/Member), the API/Controller layer, and the Database.

---

## 1. Create New Chit Group (Admin)

```mermaid
sequenceDiagram
    participant Admin
    participant Client as Frontend
    participant API as AdminChitController
    participant DB as MongoDB (Chit Model)

    Admin->>Client: Fills Create Chit Form (Value, Duration, Members)
    Client->>API: POST /admin/chits/ (token, chitData)
    activate API
    API->>API: Validate Input & Calculate Monthly Payments
    API->>DB: Save New Chit
    activate DB
    DB-->>API: returns Created Chit
    deactivate DB
    API-->>Client: 201 Created
    deactivate API
    Client-->>Admin: Shows Success Message
```

---

## 2. Record Auction Result (Admin)

This flow occurs when an auction is held for a specific month, and the admin records the winner and bid amount.

```mermaid
sequenceDiagram
    participant Admin
    participant API as AdminChitController
    participant DB as MongoDB

    Admin->>API: POST /admin/chits/:id/months (monthNum, winnerId, bidAmount)
    activate API
    API->>DB: Find Chit by ID
    activate DB
    DB-->>API: Chit Document
    deactivate DB
    
    API->>API: Calculate Dividend (Bonus) & Net Payable
    note right of API: Dividend = Bid Amount / Total Members<br/>Payable = Regular Installment - Dividend
    
    API->>API: Create Month Object & Initialize Payments (Pending)
    
    API->>DB: Update Chit (push new Month)
    activate DB
    DB-->>API: Success
    deactivate DB
    
    API-->>Admin: 200 OK (Auction Recorded)
    deactivate API
```

---

## 3. Member Login & View Dashboard

```mermaid
sequenceDiagram
    participant Member
    participant LoginAPI as UserController
    participant DashboardAPI as ChitController
    participant DB as MongoDB

    Member->>LoginAPI: POST /login (phone, password)
    activate LoginAPI
    LoginAPI->>DB: Find User by Phone
    DB-->>LoginAPI: User Data + Reference
    LoginAPI->>LoginAPI: Validate Password (Bcrypt)
    LoginAPI->>LoginAPI: Generate JWT Token
    LoginAPI-->>Member: Return Token & User Info
    deactivate LoginAPI

    Member->>DashboardAPI: GET /my-chits (with Token)
    activate DashboardAPI
    DashboardAPI->>API: Verify Token (Middleware)
    DashboardAPI->>DB: Find Chits where members contains userID
    activate DB
    DB-->>DashboardAPI: List of Chits
    deactivate DB
    DashboardAPI-->>Member: JSON Data (Chits, Status, Payments)
    deactivate DashboardAPI
```
