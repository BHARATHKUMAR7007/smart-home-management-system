# Smart Home Energy Management System

A comprehensive web application designed to help homeowners monitor, manage, and predict their energy consumption. It provides a real-time dashboard, device management, and admin capabilities.

## 🚀 Technologies Used

### Backend
*   **Java 17** & **Spring Boot 3.2**
*   **Spring Security** + **JWT** for Authentication & Authorization
*   **Spring Data JPA** with **SQLite** Database
*   **Lombok** (Code reduction)
*   **Maven** for dependency management

### Frontend
*   **React 19** with **Vite**
*   **Tailwind CSS 4** for styling
*   **Recharts** for beautiful data visualization
*   **Framer Motion** for animations
*   **Axios** for API requests
*   **Lucide React** for icons

## 📸 Screenshots

*(Place your project screenshots in the `screenshots/` directory at the root of the project and uncomment the links below to display them)*

<!--
### Login Page
![Login Page](./screenshots/login.png)

### Homeowner Dashboard
![Homeowner Dashboard](./screenshots/dashboard.png)

### Admin Dashboard
![Admin Dashboard](./screenshots/admin-dashboard.png)

### Device Management
![Device Management](./screenshots/devices.png)
-->

## 🛠️ Setup & Installation

### Prerequisites
*   Java Development Kit (JDK) 17 or higher
*   Node.js (v18+ recommended) and npm/yarn
*   Maven

### 1. Clone the repository
```bash
git clone https://github.com/BHARATHKUMAR7007/smart-home-management-system.git
cd home
```

### 2. Backend Setup
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
The backend will run on `http://localhost:8080`. SQLite database will be created automatically.

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
The frontend will run on `http://localhost:5173`.

## 📁 Project Structure

```text
home/
├── backend/                  # Spring Boot application
│   ├── src/main/java/com/smarthome/backend/
│   │   ├── config/           # Security and App configurations
│   │   ├── controller/       # REST API endpoints
│   │   ├── dto/              # Data Transfer Objects
│   │   ├── model/            # Database Entities
│   │   ├── repository/       # Data Access Layer
│   │   ├── security/         # JWT and Security filters
│   │   └── service/          # Business Logic
│   └── pom.xml               # Maven dependencies
└── frontend/                 # React frontend application
    ├── src/
    │   ├── components/       # Reusable React components
    │   ├── context/          # React Context (Auth)
    │   ├── pages/            # Page components (Home, Login, Admin, etc.)
    │   ├── services/         # API integration (Axios calls)
    │   └── App.jsx           # Main React App routing
    ├── package.json          # NPM dependencies
    └── tailwind.config.js    # Tailwind configuration
```

## ✨ Features
*   **Role-Based Access Control:** Distinct interfaces for `Admin` and `Homeowner`.
*   **Energy Dashboard:** Visual analytics using Recharts for daily and monthly power consumption.
*   **Device Management:** View, add, edit, and control IoT devices.
*   **Automation & Recommendations:** Energy-saving insights and scheduling (Backend support).
*   **Secure:** JWT-based stateless authentication.
*   **Responsive UI:** Fully responsive and modern dark theme UI using Tailwind CSS and Framer Motion.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.
