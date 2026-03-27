# CG-PWMU Digital Dashboard 🚀

A comprehensive, multi-stakeholder digital platform for monitoring and managing **Plastic Waste Management Units (PWMU)** across Chhattisgarh. Developed in collaboration with **UNICEF** and **AILSG**, this platform provides real-time data visibility from the village level to the state administration.

## 🌟 Key Features

### 📊 Multi-Level Analytics
-   **State Dashboard**: High-level overview of waste processing, efficiency, and system health across the state.
-   **District & Block Views**: Granular filtering for regional nodal officers.
-   **PWMU Hub**: Focused operational metrics for center managers (Intake vs. Sales vs. Stock).
-   **Village Performance Hub**: New high-fidelity reports for Sarpanches to track their daily waste logs and user charges.
-   **Vendor Hub**: Real-time tracking of waste pickups and revenue generation.

### 🔐 Security & Administration
-   **5-Click Logo Lock**: Discreet access control for the sensitive Database Manager.
-   **Role-Based Access Control (RBAC)**: Personalized views for State Admins, Nodal Officers, PWMU Managers, and Village Sarpanches.
-   **Profile Security**: Self-service password management and verified account updates.
-   **User Management**: Admin-controlled password resets and auto-approval workflows.

### 💾 Data Integrity & Backups
-   **Weekly Auto-Sync**: Automated database backups to Google Sheets via Apps Script.
-   **Manual Backup Trigger**: Supervisors can initiate a fresh cloud backup with a single click in Settings.
-   **CSV Export**: One-click downloads for individual tables or full database backups.

### 🌍 Accessibility
-   **Multilingual Support**: Fully operational in both **English** and **Hindi**.
-   **Mobile Responsive**: Optimized for use on tablets and smartphones by field officers.
-   **Export Ready**: Generate and download reports in **PDF, CSV, and JPG** formats.

---

## 🛠 Tech Stack

-   **Frontend**: React (Vite), TailwindCSS, Lucide-React (Icons), Recharts (Analytics)
-   **Backend**: Node.js, Express
-   **Database**: SQLite (via Better-SQLite3)
-   **Security**: JWT Authentication, BcryptJS Password Hashing
-   **Integration**: Supabase (Backend Bridge), Google Apps Script (Backup Engine)

---

## 🚀 Getting Started

### Prerequisites
-   Node.js (v18+)
-   npm

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/ksyamgar/cgpwmu-dashboard.git
    cd cgpwmu-dashboard
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment**:
    Create a `.env` file in the root directory:
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    JWT_SECRET=your_jwt_secret
    BACKEND_PORT=5000
    ```

4.  **Initialize Database**:
    ```bash
    npm run reset-db
    ```

5.  **Run the Application**:
    ```bash
    npm run dev:full
    ```
    -   Frontend: `http://localhost:5173/cgpwmu`
    -   Backend: `http://localhost:5000`

---

## 📖 Available Scripts

-   `npm run dev:full`: Runs both the Express server and Vite frontend concurrently.
-   `npm run reset-db`: Wipes the local SQLite database and re-initializes with seed data.
-   `npm run backup`: Manually triggers the Google Sheets sync script.
-   `npm run build`: Generates the production build.

---

## 🤝 Acknowledgments

Special thanks to the teams at **UNICEF India** and **Panchayat Raj Department ** for their vision and support in building this digital infrastructure for a cleaner, greener Chhattisgarh.

---
© 2026 CG-PWMU Digital Platform. All rights reserved.
