# ER Diagram — Chits-Manager

## Overview

This Entity-Relationship diagram represents the database schema for the Chits-Manager platform. It utilizes MongoDB's flexible schema design, with some relationships embedded (e.g., Months and Payments within Chits) and others referenced (e.g., Users).

---

```mermaid
erDiagram
    USERS {
        ObjectId _id PK
        string name
        string phone UK
        string password
        enum role "admin | member | viewer"
        timestamp createdAt
        timestamp updatedAt
    }

    CHITS {
        ObjectId _id PK
        string name
        number chitValue
        number monthlyAmount
        number totalMembers
        number duration
        date startDate
        date endDate
        enum status "active | completed"
        ObjectId[] members FK "Ref: USERS"
        ObjectId[] liftedMembers FK "Ref: USERS"
        timestamp createdAt
        timestamp updatedAt
    }

    MONTHS {
        ObjectId _id PK "Embedded in CHITS"
        number monthNumber
        number auctionAmount
        ObjectId winner FK "Ref: USERS"
        number bonusPerMember
        number finalChitAmount
        ObjectId[] auctionParticipants FK "Ref: USERS"
    }

    PAYMENTS {
        ObjectId _id PK "Embedded in MONTHS"
        ObjectId member FK "Ref: USERS"
        boolean isPaid
        date paidDate
    }

    NOTIFICATIONS {
        ObjectId _id PK
        enum type "auction_participation | auction_reminder"
        ObjectId chitId FK "Ref: CHITS"
        string chitName
        number monthNumber
        ObjectId fromUser FK "Ref: USERS"
        ObjectId toUser FK "Ref: USERS"
        string message
        boolean isRead
        timestamp createdAt
        timestamp updatedAt
    }

    %% Relationships

    CHITS ||--o{ MONTHS : "contains (embedded)"
    MONTHS ||--o{ PAYMENTS : "contains (embedded)"
    
    CHITS }o--|{ USERS : "has members"
    CHITS }o--|{ USERS : "lifted by"
    
    MONTHS }o--|| USERS : "won by"
    MONTHS }o--|{ USERS : "participants"
    
    PAYMENTS }o--|| USERS : "paid by"
    
    NOTIFICATIONS }o--|| USERS : "to"
    NOTIFICATIONS }o--|| USERS : "from"
    NOTIFICATIONS }o--|| CHITS : "related to"
```

---

## Schema Details

### Collections

| Collection | Description | Key References |
|------------|-------------|----------------|
| **USERS** | Stores user profiles and authentication data. | - |
| **CHITS** | The core entity. Contains config, members, and lifecycle data. Embeds `MONTHS`. | `members` -> `USERS` |
| **NOTIFICATIONS** | Stores system alerts and messages for users. | `toUser` -> `USERS`, `chitId` -> `CHITS` |

### Embedded Documents

| Entity | Parent | Description |
|--------|--------|-------------|
| **MONTHS** | `CHITS` | Represents a specific month/round of the chit. Stores auction data. |
| **PAYMENTS** | `MONTHS` | Represents the payment status for each member for that specific month. |

### Relationships

-   **Users & Chits**: Many-to-Many. A user can be in multiple chits, and a chit has multiple users.
-   **Chit & Month**: One-to-Many (Embedded). A chit has exactly `duration` number of months.
-   **Month & Payment**: One-to-Many (Embedded). A month has `totalMembers` payment records.
