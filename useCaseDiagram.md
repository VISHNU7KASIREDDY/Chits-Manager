# Use Case Diagram — Chits-Manager

## Overview

This diagram captures the functional requirements of the system, categorized by the actors (Admin and Member) who interact with the Chits-Manager platform.

---

```mermaid
flowchart LR
    Admin([Admin])
    Member([Member])

    subgraph "Chit Management System"
        direction TB
        UC1(Login / Register)
        
        %% Admin Cases
        UC_CreateChit(Create New Chit)
        UC_ManageMembers(Manage Members)
        UC_RecordAuction(Record Auction Results)
        UC_UpdatePayment(Update Payment Status)
        UC_CloseChit(Close Completed Chit)
        UC_AdminStats(View Overall Analytics)
        
        %% Member Cases
        UC_ViewChits(View My Chits)
        UC_CheckHistory(Check Payment History)
        UC_CheckDues(View Upcoming Dues)
        UC_UpdateProfile(Update Profile)
        UC_Notifications(Receive Notifications)
    end

    Admin --> UC1
    Member --> UC1

    Admin --> UC_CreateChit
    Admin --> UC_ManageMembers
    Admin --> UC_RecordAuction
    Admin --> UC_UpdatePayment
    Admin --> UC_CloseChit
    Admin --> UC_AdminStats

    Member --> UC_ViewChits
    Member --> UC_CheckHistory
    Member --> UC_CheckDues
    Member --> UC_UpdateProfile
    Member --> UC_Notifications
    
    %% Relationships
    UC_RecordAuction -.->|triggers| UC_Notifications
    UC_UpdatePayment -.->|update| UC_CheckDues

    %% Styling for Actors
    style Admin fill:#f9f,stroke:#333,stroke-width:2px
    style Member fill:#f9f,stroke:#333,stroke-width:2px
```

---

## Detailed Use Cases

### Admin
1.  **Create New Chit**: Setup a new financial group, defining value, duration, and adding participating members.
2.  **Record Auction**: Monthly task to input the winner and bid amount, triggering automated calculations for everyone's payable amount.
3.  **Update Payment Status**: Mark members as "Paid" when offline payment is received.

### Member
1.  **View My Chits**: See a list of all active and completed chits they are part of.
2.  **Check Upcoming Dues**: See exactly how much they owe for the current month (Regular installment - Dividend).
3.  **Payment History**: Verify that their previous payments have been correctly recorded by the admin.
