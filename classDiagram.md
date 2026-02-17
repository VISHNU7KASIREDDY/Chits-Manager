# Class Diagram — Chits-Manager

## Overview

This class diagram illustrates the backend structure of the Chits-Manager application, following the **MVC (Model-View-Controller)** pattern with TypeScript. It highlights the relationships between Routes, Controllers, Models, and Middleware.

---

```mermaid
classDiagram
    direction TB

    %% Middlewares
    class AuthMiddleware {
        +protect(req, res, next)
        +admin(req, res, next)
    }

    %% Routes Interfaces
    class Routes {
        <<interface>>
        +path: string
        +router: Router
    }

    %% Controllers
    class AdminChitController {
        +getAllChits(req, res)
        +getChitById(req, res)
        +createChit(req, res)
        +editChit(req, res)
        +deleteChit(req, res)
        +addMonthData(req, res)
        +editMonthData(req, res)
        +addMembers(req, res)
        +markAllPaid(req, res)
    }

    class AdminUserController {
        +getAllUsers(req, res)
        +createUser(req, res)
        +editUser(req, res)
        +deleteUser(req, res)
    }

    class ChitController {
        +getMyChits(req, res)
        +getChitById(req, res)
        +participateInAuction(req, res)
    }

    class UserController {
        +register(req, res)
        +login(req, res)
        +profile(req, res)
        +admin(req, res)
        +getAllUsers(req, res)
    }

    class NotificationController {
        +getMyNotifications(req, res)
        +markAsRead(req, res)
        +getUnreadCount(req, res)
    }

    %% Models (Mongoose Schemas)
    class User {
        +name: String
        +phone: String
        +password: String
        +role: Enum
        +matchPassword(enteredPassword): boolean
    }

    class Chit {
        +name: String
        +chitValue: Number
        +monthlyAmount: Number
        +totalMembers: Number
        +duration: Number
        +members: User[]
        +months: Month[]
        +status: Enum
    }

    class Month {
        +monthNumber: Number
        +auctionAmount: Number
        +winner: User
        +bonusPerMember: Number
        +finalChitAmount: Number
        +payments: Payment[]
    }

    class Payment {
        +member: User
        +isPaid: Boolean
        +paidDate: Date
    }

    class Notification {
        +type: Enum
        +chitId: Chit
        +message: String
        +isRead: Boolean
        +fromUser: User
        +toUser: User
    }

    %% Relationships
    Routes <|.. AdminChitRoutes
    Routes <|.. AdminUserRoutes
    Routes <|.. ChitRoutes
    Routes <|.. UserRoutes
    Routes <|.. NotificationRoutes

    AdminChitRoutes --> AdminChitController : uses
    AdminUserRoutes --> AdminUserController : uses
    ChitRoutes --> ChitController : uses
    UserRoutes --> UserController : uses
    NotificationRoutes --> NotificationController : uses

    AdminChitRoutes ..> AuthMiddleware : uses
    AdminUserRoutes ..> AuthMiddleware : uses
    ChitRoutes ..> AuthMiddleware : uses

    AdminChitController ..> Chit : manipulates
    AdminChitController ..> User : queries
    ChitController ..> Chit : queries
    UserController ..> User : manipulates
    NotificationController ..> Notification : manipulates

    Chit *-- Month : contains
    Month *-- Payment : contains
    Chit o-- User : references
    Notification o-- User : references
```

---

## Architecture Components

### Controllers
Handle the incoming HTTP requests, process business logic (often delegating to services or interacting directly with models), and return responses.
-   `AdminChitController`: Manages chit lifecycle (Creation, Auctions, Payments).
-   `ChitController`: Handles member-specific read operations and actions.
-   `UserController`: Authentication and profile management.

### Models
Define the data structure and schema using Mongoose.
-   `User`: Handles authentication and profile data.
-   `Chit`: Complex aggregate root containing embedded Months and Payments.
-   `Notification`: Ephemeral user alerts.

### Interfaces & Routes in TypeScript
-   `Routes` interface ensures all route classes (`AdminChitRoutes`, etc.) follow a consistent structure.
-   `AuthMiddleware` is injected into routes to secure endpoints.
