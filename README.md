# 💰 Full Stack Personal Finance Tracker

A robust and modern Personal Finance Tracker application built with the **MERN Stack (PostgreSQL variant)**. This application allows users to track their income and expenses, visualize financial data with interactive charts, and manage transactions with granular role-based access control (RBAC).

---

## 🚀 Features

### 🔐 Authentication & Security
- **Secure Login/Register**: JWT-based authentication with `bcrypt` password hashing.
- **Role-Based Access Control (RBAC)**:
  - **Admin**: Full access to all data, including managing other users and deleting accounts.
  - **User**: Manage own transactions (Add/Edit/Delete) and view own analytics.
  - **Read-Only**: View-only access to transactions and analytics (cannot modify data).
- **Security Best Practices**: Implemented `helmet` for headers, `cors` policy, and `express-rate-limit` to prevent brute-force attacks.

### 📊 Dashboard & Analytics
- **Interactive Charts**: Visualized using `Recharts` with a modern Glassmorphism UI.
  - **Pie Chart**: Category-wise expense breakdown.
  - **Trend Line**: Monthly income vs. expense trends.
  - **Bar Chart**: Overall financial summary.
- **Real-time Stats**: Instant calculation of Total Income, Total Expense, and Net Balance.

### 💸 Transaction Management
- **CRUD Operations**: Create, Read, Update, and Delete transactions.
- **Advanced Filtering**: Filter transactions by type (Income/Expense) and search by category.
- **Pagination**: Server-side pagination for efficient data loading.

### 👥 Admin Panel
- **User Management**: Admins can view a list of all registered users and delete accounts if necessary.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: React 18 (Vite)
- **Styling**: Modern CSS with Glassmorphism UI & Animated Backgrounds
- **Routing**: React Router DOM v6
- **Charts**: Recharts
- **HTTP Client**: Axios (with Interceptors)

### **Backend**
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Documentation**: Swagger UI

---

## ⚙️ Setup Instructions

Follow these steps to run the application locally.

### **1. Prerequisites**
- **Node.js** (v16+ recommended)
- **PostgreSQL** installed and running locally.
- Create a database named `finance_tracker`.
  ### **2. Backend Setup**
```bash
cd backend
npm install

# Create .env file
# PORT
# DATABASE_URL
# JWT_SECRET

# Seed Database (Creates tables & demo users)
npm run seed

# Start Server
npm run dev
```

### **3. Frontend Setup**
```bash


cd frontend
npm install

# Create .env file
# VITE_API_URL

# Start React App
npm run dev
```
---
### 📚 API Documentation
- Complete API documentation is available via Swagger UI.
  - Local: http://localhost:5000/api-docs
  - Live: https://finance-tracker1-idlb.onrender.com/api-docs
---
### 📁 Project Structure
```
finance-tracker/
├── backend/
│   ├── config/         # Database configuration
│   ├── controllers/    # Logic (Auth, Transactions, Analytics, Users)
│   ├── middleware/     # Auth & Role middleware
│   ├── models/         # Sequelize Models (User, Transaction)
│   ├── routes/         # API Routes
│   ├── utils/          # Token generation helpers
│   ├── seed.js         # Database seeder
│   └── server.js       # Entry point
│
└── frontend/
    ├── src/
    │   ├── api/        # Axios API setup
    │   ├── charts/     # Recharts components
    │   ├── components/ # Navbar, ProtectedRoute
    │   ├── context/    # Auth & Theme Context
    │   ├── pages/      # Login, Dashboard, Transactions, Analytics, Users
    │   └── styles/     # Global Glassmorphism CSS
    └── main.jsx        # Entry point
```

---

