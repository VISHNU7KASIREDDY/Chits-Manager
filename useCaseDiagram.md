# Use Case Diagram — Chits-Manager

## Overview

This diagram captures the functional requirements of the system, categorized by the actors (Admin and Member) who interact with the Chits-Manager platform.

---

```mermaid
useCaseDiagram
    actor Admin
    actor Member

    package "Chit Management System" {
        usecase "Login / Register" as UC1
        
        %% Admin Cases
        usecase "Create New Chit" as UC_CreateChit
        usecase "Manage Members" as UC_ManageMembers
        usecase "Record Auction Results" as UC_RecordAuction
        usecase "Update Payment Status" as UC_UpdatePayment
        usecase "Close Completed Chit" as UC_CloseChit
        usecase "View Overall Analytics" as UC_AdminStats
        
        %% Member Cases
        usecase "View My Chits" as UC_ViewChits
        usecase "Check Payment History" as UC_CheckHistory
        usecase "View Upcoming Dues" as UC_CheckDues
        usecase "Update Profile" as UC_UpdateProfile
        usecase "Receive Notifications" as UC_Notifications
    }

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
    UC_RecordAuction ..> UC_Notifications : <<triggers>>
    UC_UpdatePayment ..> UC_CheckDues : <<updates>>
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
