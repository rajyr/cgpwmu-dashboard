# CG-PWMU Digital Platform - Project Guide

Welcome to the **CG-PWMU (Chhattisgarh Plastic Waste Management Unit) Digital Platform** documentation. This guide explains the architecture, design philosophy, and functional breakdown of all pages within the application.

---

## 🎨 Design Style & Philosophy

The platform follows a **Modern, Premium, and Trust-focused** design language tailored for government and NGO operations.

### Core Visual Principles
*   **Glassmorphism**: Headers and cards often use `backdrop-blur` and semi-transparent backgrounds to create depth and a modern "app-like" feel.
*   **Vibrant Consistency**: We use a curated color palette (Blue `#005DAA` for trust, Green `#22c55e` for ecology, and Light Gray `#F4F7F6` for the global background).
*   **Micro-animations**: Subtle `fade-in-up` and hover-scale effects are applied to make the interface feel alive and responsive.
*   **Responsive Layouts**: Every page is built with a mobile-first approach using Tailwind CSS, ensuring smooth transitions between mobile, tablet, and desktop views.

---

## 🏗️ Architecture Overview

*   **Frontend**: React (Vite-based) for high performance and fast development.
*   **Styling**: Tailwind CSS for utility-first, highly customizable UI.
*   **Backend/Auth**: Supabase (PostgreSQL + Auth) for real-time data and secure session management.
*   **Icons**: Lucide React for consistent, crisp SVG iconography.
*   **Charts**: Recharts for dynamic, interactive data visualizations.

---

## 📄 Page Guide (Functional Breakdown)

### 1. Public Pages (Accessible to Everyone)

#### **Landing Page (`/`)**
*   **Purpose**: The gateway to the platform. It showcases the project's impact through high-end visualizations and key metrics.
*   **How to Use**: Scroll to explore the project's vision, see statewide results, and link directly to registration or login.
*   **Output Results**: Users gain a comprehensive understanding of the CG-PWMU network's successes.

#### **About Us (`/about`)**
*   **Purpose**: Provides deep context about the collaboration between the Government of Chhattisgarh, UNICEF, and other partners.
*   **How to Use**: Read through the mission statements, team structure, and impact methodology.
*   **Output Results**: Establishes project credibility and transparency.

---

### 2. Authentication & Onboarding

#### **Login (`/login`)**
*   **Purpose**: Secure entry point for all roles (Admin, PWMU Manager, Vendor, Sarpanch).
*   **How to Use**: Select your role tab, enter credentials, and sign in. It features a role-based redirection system.
*   **Output Results**: Authenticated user session with access to role-specific private dashboards.

#### **Registration Portal (`/register`)**
*   **Purpose**: Central hub for onboarding new entities.
*   **How to Use**: Choose to register as a **PWMU Center**, **Village (GP)**, or **Vendor**.
*   **Output Results**: Submission of registration data for admin approval.

---

### 3. Core Dashboards (Private)

#### **Statewide Dashboard (`/dashboard`)**
*   **Purpose**: The "Command Center" for the entire state. High-level financial and operational overview.
*   **How to Use**: Use the district/block filters to drill down into specific data. View the **Value Chain Sankey Diagram** to see material flow.
*   **Output Results**: Real-time visibility into active units, revenue vs. expense, and waste composition.

#### **Village Hub (`/dashboard/village-hub`)**
*   **Purpose**: Specifically for Sarpanchs and Village Administrators.
*   **How to Use**: Check local collection status and worker attendance.
*   **Output Results**: Ensures village-level accountability and collection efficiency.

#### **PWMU Hub (`/dashboard/pwmu`)**
*   **Purpose**: Operational management for PWMU Managers.
*   **How to Use**: Manage daily processing volumes and truck schedules.
*   **Output Results**: Optimized processing workflows for plastic waste.

#### **Advanced Analytics Pages**
*   **District View**: Geographic breakdown of coverage.
*   **Financial View**: Deep dive into profit/loss and material value chain.
*   **Monitoring**: Technical monitoring of machine health and compliance metrics.

---

## 🤝 Stakeholder Workflows & Benefits

The CG-PWMU platform is designed to be a collaborative ecosystem where data flows from the grassroots level to the highest state offices.

### 1. Village Level (Gram Panchayats)
*   **Who uses it**: Sarpanchs, Village Secretaries, and Swachhagrahis.
*   **How they use it**:
    *   **Daily Logging**: Recording the total weight of wet and dry waste collected from households.
    *   **Worker Attendance**: Tracking the number of Swachhagrahis active in each collection cycle.
    *   **Monthly Summaries**: Reviewing local sanitation efficiency and identifying gaps in collection coverage.
*   **Direct Benefit**: Villages receive transparent data to justify fund allocation and ensure their local environment remains plastic-free.

### 2. PWMU Centers (Processing Units)
*   **Who uses it**: PWMU Managers and Hub Operators.
*   **How they use it**:
    *   **Material Inflow**: Aggregating waste received from multiple linked villages.
    *   **Processing Efficiency**: Tracking "Processing Loss" vs. "Recovered Material" (Plastic, Paper, Metal).
    *   **Commercial Sales**: Logging sales to recyclers, cement factories, and road construction projects.
    *   **Expense Management**: Recording operation costs like electricity, labor, and transport.
*   **Direct Benefit**: Managers can run their centers as profitable social enterprises, moving from dependency on grants to financial self-sufficiency.

### 3. State Officials / Administration
*   **Who uses it**: District Collectors, State Administrators, and Project Heads (UNICEF/Govt).
*   **How they use it**:
    *   **Statewide Monitoring**: Real-time visualization of plastic waste management across all 33 districts.
    *   **Financial Auditing**: Instant access to revenue vs. expenditure reports without waiting for manual paper trails.
    *   **Policy Planning**: Using "Waste Composition" data to decide where to install more machinery or which industries to partner with for co-processing.
*   **Direct Benefit**: 
    *   **Data-Driven Governance**: Decisions are based on live ground reality rather than estimates.
    *   **Impact Transparency**: Easily demonstrate environmental impact (tons of plastic diverted from landfills) to international bodies and the public.
    *   **Resource Optimization**: Identify underperforming units and allocate technical support where it's needed most.

---

## 📂 Data Anatomy (Form Questions)

To ensure high-quality data, the platform collects specific metrics at every stage.

### 1. Registration (The "Digital Identity")
*   **PWMU Centers**: Location (District, Block, GP), Facility Name, Setup Date, Daily Capacity (Tons), Machinery Audit (Baler/Shredder status), Nodal Officer details.
*   **Villages (GP)**: Location, Total Households, Sarpanch Contact, and **Linked PWMU** (defining its service destination).
*   **Vendors/Recyclers**: Firm Name, Tax IDs (GST), Preferred Material Types (PET, LDPE, MLP, etc.), and Operating Capacity.

### 2. Daily Reporting (The "Operational Pulse")
*   **Village Daily Log**:
    *   *Question*: Primary Collection Source? (Door-to-door or central shed)
    *   *Question*: Waste Quantities in Kg? (Segregated into Wet, Plastic, Metal, Glass, E-Waste, and Mixed).
*   **PWMU Intake Log**:
    *   *Question*: How much waste was received from each village? (Auto-filled if the village has already reported, ensuring data reconciliation).

### 3. Monthly Reporting (The "Financial & Health Review")
*   **Village Monthly Report**:
    *   *Question*: Where was the waste sold? (Local Kabadiwala, Registered Vendor, or Recycler)
    *   *Question*: Revenue earned vs. Swachhata workers' honorariums.
*   **PWMU Monthly Report**:
    *   *Question*: Is machinery functional? (If not: Breakdown date & Primary reason like Power, Technical failure, etc.)
    *   *Question*: Complete Sales Ledger (Vendor name, material type, net revenue).
    *   *Question*: Operating Expenses (Electricity bills, labor costs, repairs).

---

## 📊 Visual Intelligence (Data Visualizations)

Data is only useful if it's actionable. We use advanced visuals to turn numbers into strategy.

### 1. Value Chain Sankey Diagram
*   **Visualization**: A multi-stage flow diagram moving from **Villages → PWMU Center → Final Disposal (Recyclers/Cement/Roads)**.
*   **How it helps**: It identifies "Leakage." If 100 MT is collected but only 80 MT is sold, officials can investigate where the 20 MT "Processing Loss" is occurring.

### 2. Financial Performance Charts
*   **Visualization**: Monthly Bar/Line charts comparing **Revenue vs. Operational Spending**.
*   **How it helps**: Allows state officials to see which units are profitable and which need intervention or subsidization.

### 3. Statewide Waste Composition
*   **Visualization**: Interactive Pie Charts showing the % of Plastic, Paper, Organic, and Metal.
*   **How it helps**: If a district has 40% PET plastic, the state can prioritize installing specialized shredders or balers in that specific region.

### 4. Geospatial KPI Cards
*   **Visualization**: High-contrast counters for **Active Units**, **Log Submissions**, and **Worker Strength**.
*   **How it helps**: Instant situational awareness. Red/Green indicators show if reports are on time or if units are falling behind.

---

## 🖥️ Master Dashboard Guide

The platform features multiple specialized dashboards, each serving a unique strategic purpose for different administrative levels.

### 1. The Command Center (Main Dashboard)
*   **Purpose**: Real-time statewide situation awareness.
*   **Key Visuals**: **Value Chain Sankey Diagram** (Material flow), **System Status KPI Cards** (Active units, today's logs).
*   **Decision Support**: Quick overview for top ministers and project heads to see if the state is meeting its waste processing targets today.

### 2. District Performance View
*   **Purpose**: Benchmarking units within a district.
*   **Key Visuals**: **Processing Comparison Bar Chart** (Ranked performance), **Financial Viability Scatter Plot** (Categorizes units into 'Profitable', 'Subsidized', or 'At Risk').
*   **Decision Support**: Helps District Collectors identify which PWMU center is underperforming compared to its neighbors.

### 3. Financial Sustainability Dashboard
*   **Purpose**: Economic health and self-sufficiency tracking.
*   **Key Visuals**: **Subsidy Dependence Stacked Bars** (% of income from sales vs. govt grants), **Break-even Timeline** (Revenue vs. Cost over 6 months).
*   **Decision Support**: Enables financial officers to adjust "User Charges" or "Processing Incentives" based on actual unit expenses.

### 4. Waste Leakage & Compliance
*   **Purpose**: Integrity of the supply chain.
*   **Key Visuals**: **Mass Balance Bar Chart** (Intake vs. Processed kg), **Missing Reports Watchlist**.
*   **Decision Support**: Detects physical waste "leakage" or data entry delays that could indicate operational theft or negligence.

### 5. Machine & Asset Intelligence
*   **Purpose**: Physical infrastructure monitoring.
*   **Key Visuals**: **Statewide Uptime Donut** (Functional vs. Breakdown %), **Asset Utilization Bars** (Weekly machine hours).
*   **Decision Support**: Alerts technical teams to units that have frequent breakdowns, signaling a need for better maintenance or machine replacement.

### 6. Monitoring & Compliance Hub
*   **Purpose**: Audit trail and regulatory adherence.
*   **Key Visuals**: **Compliance Trend Line** (Actual vs. State Target), **Issue Category Distribution** (Log delays, over-capacity flags).
*   **Decision Support**: Used by auditors to track the "Health Score" of every facility over the fiscal year.

### 7. Planning & Policy Framework
*   **Purpose**: Long-term strategy and expansion.
*   **Key Visuals**: **Strategic Project Roadmap** (Timelines for new units), **Resource Allocation Map** (District-wise funding distribution).
*   **Decision Support**: A central repository for Policy Documents (PDFs) and strategic advisory for future investment.

### 8. Village Sanitation Hub
*   **Purpose**: Tailored for Sarpanchs and Village Secretaries.
*   **Key Visuals**: **Daily Target Progress Loop** (Collection achievement %), **Worker Presence Tracking**.
*   **Decision Support**: Empowers local leaders to improve household collection rates and manage their field staff effectively.

### 9. Vendor & Market Hub
*   **Purpose**: Market integration for processed plastic.
*   **Key Visuals**: **Market Availability Hot Items** (Current demand for PET/HDPE), **Pickup History Trend**.
*   **Decision Support**: Helps vendors find stock and helps PWMU managers price their processed materials based on statewide demand.

### 10. Admin Settings & User Control
*   **Purpose**: System governance.
*   **Features**: **User Approval Workflow**, **System Threshold Controls** (Defining what counts as 'Low Efficiency'), **Notification Rules**.
*   **Decision Support**: Global system security and access management for the entire platform.

---

## 🚀 How to Use & Run

### Development Mode
```bash
npm install
npm run dev
```
*   **Local URL**: [http://localhost:5173/](http://localhost:5173/)
*   **Result**: Instant hot-reloading dashboard for development and testing.

### Production Build
```bash
npm run build
```
*   **Result**: A highly optimized, minified `dist/` folder ready for deployment on Netlify, Vercel, or AWS.

---

## 📊 Output & Results
The platform's primary output is **Data-Driven Insight**. By digitizing the waste management lifecycle, the CG-PWMU platform provides:
1.  **Transparency**: Every gram of waste is tracked from village to scavenger/recycler.
2.  **Financial Sustainability**: Automated profit/loss tracking helps individual units become self-sustaining.
3.  **Policy Support**: State admins can use reports to justify new investments and expand the network.

---
**© 2026 CG-PWMU Digital Platform**
*Developed for the Government of Chhattisgarh.*
