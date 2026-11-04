# Shipping Management System

**Developed by Gunawan Brothers**

A full-stack Ferry Shipping Management System designed to manage ferry operators, shipping routes, and sailing schedules.

## 1. Project Overview

The Shipping Management System is a web-based application developed to organize and manage ferry shipping operations.

The application provides three main management modules:

- **Ferry Operators** – Manage ferry operator information.
- **Ferry Routes** – Manage shipping routes, ports, and countries.
- **Ferry Schedules** – Manage vessel schedules, departure and arrival times, seat availability, and ticket prices.

The project demonstrates full-stack application development using Vue.js, Node.js, Express.js, and SQLite.

## 2. Technology Stack

### Frontend
- Vue.js 3
- Vite
- JavaScript
- HTML5
- CSS3

### Backend
- Node.js
- Express.js 5
- REST API
- better-sqlite3
- CORS
- dotenv

### Database
- SQLite
- Relational database
- Foreign key constraints

## 3. System Architecture

The application follows a frontend-backend architecture.

```text
             USER
               |
               v
       VUE 3 FRONTEND
          (Vite)
               |
               | HTTP / REST API
               |
               v
       NODE.JS BACKEND
          (Express)
               |
       -----------------
       |       |       |
       v       v       v
   Operators Routes Schedules
       |       |       |
       -----------------
               |
               v
         SQLITE DATABASE
         ferry_booking.db
```

## 4. Main Application Modules

### 4.1 Ferry Operators

Manage ferry operator records.

Available operations:
- View all operators
- Create new operators
- Update operator information
- Delete operators

### 4.2 Ferry Routes

Manage ferry shipping routes.

Available operations:
- View all routes
- Create new routes
- Update route information
- Delete routes

Route information includes origin port, destination port, country, operator, and estimated duration.

### 4.3 Ferry Schedules

Manage ferry vessel schedules.

Available operations:
- View all schedules
- Create new schedules
- Update schedule information
- Delete schedules

Schedule information includes vessel name, departure time, arrival time, total seats, available seats, ticket price, and schedule status.

## 5. Database Structure

Database engine: SQLite

Database file:

`Backend/database/ferry_booking.db`

Main database tables:

| Table | Description |
|---|---|
| ferry_operators | Ferry operator information |
| ferry_routes | Ferry route information |
| ferry_schedules | Vessel scheduling information |

The application uses relational database queries and LEFT JOIN operations to retrieve related operator and route information.

SQLite foreign key enforcement is enabled in the database configuration.

**Note:** The included database is intended for demonstration purposes and contains dummy/sample data.

## 6. REST API Documentation

Base URL:

`http://localhost:3000`

### 6.1 Operators API

Base endpoint: `/api/operators`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/operators` | Get all operators |
| POST | `/api/operators` | Create an operator |
| PUT | `/api/operators/:id` | Update an operator |
| DELETE | `/api/operators/:id` | Delete an operator |

### 6.2 Routes API

Base endpoint: `/api/routes`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/routes` | Get all routes |
| POST | `/api/routes` | Create a route |
| PUT | `/api/routes/:id` | Update a route |
| DELETE | `/api/routes/:id` | Delete a route |

### 6.3 Schedules API

Base endpoint: `/api/schedules`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/schedules` | Get all schedules |
| POST | `/api/schedules` | Create a schedule |
| PUT | `/api/schedules/:id` | Update a schedule |
| DELETE | `/api/schedules/:id` | Delete a schedule |

### API Response Example

Successful GET request:

```json
{
  "success": true,
  "total": 2,
  "data": []
}
```

The actual data array contains the returned database records.

### HTTP Status Codes

| Status | Description |
|---|---|
| 200 | Request successful |
| 201 | Resource created |
| 400 | Invalid request |
| 404 | Resource not found |
| 409 | Data conflict |
| 500 | Internal server error |

## 7. Project Structure

```text
Shipping_MS/
│
├── Backend/
│   ├── config/
│   │   └── database.js
│   │
│   ├── database/
│   │   └── ferry_booking.db
│   │
│   ├── routes/
│   │   ├── operatorRoutes.js
│   │   ├── routeRoutes.js
│   │   └── SchedRoutes.js
│   │
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── Frontend/
│   ├── public/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
├── readme.md
└── test.http
```

## 8. Installation Guide

### Prerequisites

Install the following software:

- Node.js
- npm
- Git
- Visual Studio Code

### Step 1: Clone the Repository

```bash
git clone https://github.com/Davidabigunawan2026/shipping_management_system.git
```

### Step 2: Navigate to the Project

```bash
cd shipping_management_system
```

### Step 3: Install Backend Dependencies

```bash
cd Backend
npm install
```

### Step 4: Start the Backend Server

```bash
node server.js
```

Expected console output:

```text
SQLite database connected successfully!
Shipping Management System API running at http://localhost:3000
```

The backend API is now available at:

`http://localhost:3000`

### Step 5: Install Frontend Dependencies

Open another terminal:

```bash
cd Frontend
npm install
```

### Step 6: Start the Frontend

```bash
npm run dev
```

Open the local development URL displayed by Vite in your browser, usually:

`http://localhost:5173`

## 9. Building the Frontend

To create a production build:

```bash
cd Frontend
npm run build
```

To preview the production build:

```bash
npm run preview
```

## 10. Testing

The REST API can be tested using:

- Visual Studio Code REST Client extension
- Postman
- Browser for GET requests

Example API health check:

`GET http://localhost:3000/`

Expected response:

```json
{
  "success": true,
  "message": "Shipping Management System API is running!"
}
```

## 11. Future Development

Potential future improvements include:

- User authentication and authorization
- Role-based access control
- Passenger booking management
- Online ticket booking
- Payment integration
- Advanced reporting and analytics
- Deployment to a production hosting environment

## 12. Developer

**Gunawan Brothers**

Shipping Management System

Full-Stack Application Development

Technologies: Vue.js, Node.js, Express.js, and SQLite.

---

© 2026 Gunawan Brothers. All rights reserved.
