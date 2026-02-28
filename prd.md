Here is the comprehensive project plan, PRD, Design Guide, and Content Strategy for the **UNICEF Chhattisgarh: Plastic Waste Management Unit (PWMU) Digital Platform**.

I have structured this into three files as requested: `PRD.md`, `Design.md`, and `text.md`.

---

### 🚀 Tech Stack Recommendation

Before diving into the documents, here is the answer to your technical query:

**Can Supabase do this?**
**Yes.** For the UAT phase, **Supabase** is the best choice.
1.  **Database:** It uses PostgreSQL (very fast and reliable for government data).
2.  **Auth:** Built-in, secure, and handles "Row Level Security" (so a Village User only sees Village data).
3.  **Real-time:** Great for live dashboards.
4.  **Free Tier:** Generous enough for UAT.

**Migration to Windows Server (PM2):**
Since you want to eventually move to your own Windows Server:
*   **The Strategy:** Build the app using **Next.js (React)**.
*   **The Backend:** For UAT, use the Supabase API. When moving to the Windows Server, you will migrate your PostgreSQL database to your local server and write a simple **Node.js + Express** API to replace the Supabase API calls. The Frontend (React) won't need many changes.
*   **Domain:** Freenom is currently suspended/unreliable. I recommend using **Vercel** or **Netlify** for free hosting (e.g., `pwmu-chhattisgarh.vercel.app`) which is faster and more secure.

---

### File 1: PRD.md
```markdown
# Product Requirements Document (PRD)
## Project Name: UNICEF Chhattisgarh - PWMU Digital Platform

### 1. Executive Summary
This project aims to digitize the Plastic Waste Management Unit (PWMU) ecosystem for the PRD Chhattisgarh Government. It replaces physical forms with a bilingual (Hindi/English) mobile-responsive web app. The platform enables registration, daily/monthly reporting, and provides a high-level visual dashboard for officials to monitor waste flow, financials, and operational efficiency across Districts, Blocks, and Villages.

### 2. Objectives
1.  **Digitization:** Eliminate paper-based data entry for PWMUs, Villages, and Vendors.
2.  **Transparency:** Create a visual "Sankey" flow of waste from source to disposal/recycling.
3.  **Efficiency:** Enable real-time monitoring of machine status and waste processing.
4.  **Financial Tracking:** Track revenue (sales) vs. expenditure (O&M, Honorarium) across the chain.
5.  **Planning:** Use data analytics to identify gaps in village coverage or machine downtime.

### 3. User Personas & Access Levels

| Role | Language | Access View | Key Actions |
| :--- | :--- | :--- | :--- |
| **Admin (State/District)** | Eng/Hin | Full Dashboard, Map View, Compliance, All Reports | Approve registrations, view aggregated stats, download reports. |
| **PWMU Nodal Officer** | Eng/Hin | PWMU Dashboard, Linked Villages, Vendor List | Register Villages/Vendors, Daily Log entry, Monthly Report, Manage Assets. |
| **Village Nodal (Sarpanch)** | Hindi (Def) | Village Dashboard | Report daily waste, Track Swachhata workers, View income. |
| **Vendor (Kabadiwala)** | Hindi (Def) | Vendor Dashboard | View available waste at PWMUs, Update pickup details. |

### 4. Functional Modules

#### Module A: Registration Portal (Onboarding)
*   **PWMU Registration:** Capture location (District/Block), Nodal details, and auto-generate ID.
*   **Village Linking:** PWMU selects villages (Dropdown: Block -> GP -> Village). Auto-generates Village ID & Login for Sarpanch.
*   **Vendor Registration:** Capture waste types (Plastic codes, Cement, Road Construction) and location.

#### Module B: Reporting Portal (Data Entry)
*   **Authentication:** Login via Mobile/OTP or Email/Password.
*   **Daily Log (PWMU):**
    *   Date Picker.
    *   Waste Inflow: Table listing Linked Villages with auto-filled or manual entry of waste (kg).
*   **Monthly Report (PWMU):**
    *   Asset Status: Machine functionality (Yes/No/Reason).
    *   Financials: Vendor selection (Dropdown), Waste Type (MCQ), Quantity (kg), Revenue (Rs).
    *   Expenses: Electricity, Honorarium, O&M.
*   **Daily Report (Village):**
    *   Date, Auto-populated Village Name.
    *   Waste Breakdown: Wet, Plastic, Metal, Glass, E-waste, Other (kg).
*   **Monthly Report (Village):**
    *   Recycler selection, Sales (kg/Amount), Worker Count & Honorarium calculation.

#### Module C: Monitoring Portal (Progress Tracking)
*   **Compliance Dashboard:** Which PWMUs/Villages have submitted reports for the current month?
*   **Pending Actions:** List of entities that haven't logged data for >7 days.

#### Module D: Analytics & Planning Dashboard (The "Brain")
*   **Geo-Visualization:** Interactive Chhattisgarh Map (GeoJSON). Drill-down: State -> District -> Block -> GP -> Village.
    *   *Color coding:* Green (Active), Red (Non-reporting), Orange (Machine Down).
*   **Waste Flow (Sankey Diagram):**
    *   *Nodes:* Villages -> PWMU -> [Recyclers / Road Construction / Cement Factory].
    *   *Metrics:* Thickness of lines = Volume of waste (kg).
*   **Financial View:**
    *   Revenue vs. Cost chart.
    *   "Per Kg" profitability analysis.
*   **Machine Intelligence:**
    *   Uptime/Downtime tracking.
    *   Reasons for failure (Pie chart: Electricity vs. Technical).
*   **Efficiency:**
    *   Collection Efficiency: (Waste Collected / Estimated Waste Generation) * 100.
    *   Diversion Rate: (Waste Sold / Total Waste Processed) * 100.

### 5. Non-Functional Requirements
*   **Performance:** Load maps and dashboards under 3 seconds on 4G networks.
*   **Responsiveness:** Must work perfectly on low-end Android smartphones (primary device for Sarpanchs).
*   **Offline Mode:** Capability to save daily logs offline and sync when internet is available (Critical for rural areas).
*   **Bilingual:** Default Hindi, toggleable to English. All system labels and validation messages must be translated.

### 6. Data & Constraints
*   **Data Structure:** Relational (SQL). Tables: `Users`, `PWMUs`, `Villages`, `Vendors`, `DailyLogs`, `MonthlyReports`, `Machines`.
*   **Validations:**
    *   Mobile: 10 digits.
    *   Date: DD-MM-YYYY.
    *   Quantity: Positive numbers only.
    *   Dropdowns: Strictly bound to JSON lists (District/Block/GP/Village).

### 7. Roadmap
1.  **Phase 1 (UAT):** Core Registration + PWMU Monthly Reporting. Hosted on Vercel/Supabase.
2.  **Phase 2:** Daily Reporting + Vendor Login + Sankey Dashboard.
3.  **Phase 3:** Migration to Govt Windows Server + Advanced Analytics/ML predictions.
```

---

### File 2: Design.md
```markdown
# Design System & Visual Style Guide

### 1. Design Philosophy
"Government-grade clarity with consumer-grade delight."
The design must be **high-contrast**, **icon-driven**, and **illustrative**. It should feel like a modern app (Swiggy/Amazon) rather than a boring government portal. It must be accessible for users with low literacy levels (use icons alongside text).

### 2. Color Palette
*   **Primary (Trust):** `#005DAA` (UNICEF Blue) - Used for Headers, Primary Buttons.
*   **Secondary (Action):** `#FF9933` (Saffron/Orange) - Used for "Add New", "Submit", "Edit".
*   **Success (Growth):** `#28A745` (Green) - Used for "Functional", "Profit", "Completed".
*   **Alert (Attention):** `#DC3545` (Red) - Used for "Non-Functional", "Loss", "Pending".
*   **Background:** `#F4F7F6` (Light Grey) - Reduces eye strain compared to pure white.
*   **Surface:** `#FFFFFF` (White) - Cards and input fields.

### 3. Typography
*   **Hindi Font:** `Mukta` or `Poppins` (Open Source, highly legible on mobile).
*   **English Font:** `Inter` or `Roboto`.
*   **Hierarchy:**
    *   **H1:** 24px (Screen Titles - e.g., "प्लास्टिक अपशिष्ट प्रबंधन")
    *   **H2:** 20px (Section Headers - e.g., "मासिक रिपोर्ट")
    *   **Body:** 16px (Inputs, Labels - Minimum readable size).

### 4. Iconography & Illustrations
*   **Style:** Line icons (outlined) with soft background fills.
*   **Usage:** Every section must have an illustrative icon.
    *   *Registration:* User Plus icon.
    *   *Dashboard:* Chart Pie icon.
    *   *Waste:* Recycle icon.
    *   *Money:* Rupee Sign icon.
*   **Animations:**
    *   *Micro-interactions:* Button press scales down slightly.
    *   *Loading:* Custom animated SVG of a truck collecting waste (not a generic spinner).
    *   *Dashboard Entry:* Charts grow from bottom up.

### 5. Layout Patterns

#### A. Mobile (App View)
*   **Navigation:** Bottom Tab Bar (Home, Report, Dashboard, Profile).
*   **Forms:** Single column. Cards with rounded corners (12px radius). Floating labels for inputs.
*   **Dropdowns:** Large touch targets (44px height).

#### B. Desktop (Dashboard View)
*   **Sidebar:** Navigation on the left (collapsed to icons on small screens).
*   **Grid:** 12-column grid.
    *   Top Row: Key Stats Cards (Total Waste, Total Revenue, Active Units).
    *   Middle: Map (Left) + Sankey Diagram (Right).
    *   Bottom: Detailed Data Tables.

### 6. Component Specifics

#### The "Sankey" Flow Map
*   **Visual:** Horizontal flow. Left: Village Icons. Middle: PWMU Factory Icon. Right: Split into Recycler, Road, Cement.
*   **Animation:** Dots moving along the lines to signify active flow.
*   **Interactivity:** Hover over a line to see exact Kg and Revenue.

#### The "GeoJSON" Map
*   **Style:** Minimalist. White fill, Blue stroke.
*   **Overlay:** Heatmap colors based on "Waste Collected per Month".
*   **Popups:** Click a district/block to show summary card.

### 7. Accessibility
*   **Contrast Ratio:** Minimum 4.5:1 for text.
*   **Error Handling:** Red outline on invalid fields + Error icon. Message below field in Red (e.g., "कृपया 10 अंकों का मोबाइल नंबर दर्ज करें").
```

---

### File 3: text.md
```markdown
# Text & Content Strategy (Bilingual)

## 1. Application Naming
*   **English:** Chhattisgarh PWMU Digital Platform
*   **Hindi:** छत्तीसगढ़ प्लास्टिक अपशिष्ट प्रबंधन पोर्टल

## 2. Common Labels (UI Elements)

| English | Hindi | Context |
| :--- | :--- | :--- |
| **Dashboard** | डैशबोर्ड | Navigation |
| **Report** | रिपोर्ट / रिपोर्टिंग | Navigation |
| **Registration** | पंजीकरण | Navigation |
| **Profile** | प्रोफाइल | Navigation |
| **Select** | चुनें | Dropdown placeholders |
| **Submit** | जमा करें | Buttons |
| **Save** | सहेजें | Buttons |
| **Cancel** | रद्द करें | Buttons |
| **Search** | खोजें | Search bars |
| **Logout** | लॉग आउट | Menu |
| **Total** | कुल योग | Stats |

## 3. Registration Module Text

### PWMU Registration
*   **Eng:** Register New PWMU
*   **Hin:** नया PWMU पंजीकृत करें
*   **District Name:** जिले का नाम
*   **Block Name:** ब्लॉक का नाम
*   **Nodal Officer:** नोडल अधिकारी
*   **Mobile Number:** मोबाइल नंबर
*   **Generate ID:** ID जनरेट करें

### Village Linking
*   **Eng:** Link Villages to your PWMU
*   **Hin:** अपने PWMU में गाँव जोड़ें
*   **Instruction:** Select the number of villages, then choose them from the list.
*   **Hindi Instruction:** गाँवों की संख्या चुनें, फिर सूची से उन्हें चुनें।
*   **Village ID (Auto):** गाँव ID (स्वचालित)

## 4. Reporting Module Text

### Daily Log (PWMU)
*   **Eng:** Daily Waste Log
*   **Hin:** दैनिक कचरा लॉग
*   **Date:** तारीख
*   **Select Village:** गाँव चुनें
*   **Waste Quantity (kg):** कचरे की मात्रा (किलोग्राम)

### Monthly Report (PWMU)
*   **Eng:** Monthly Operations Report
*   **Hin:** मासिक संचालन रिपोर्ट
*   **Asset Status:** संपत्ति की स्थिति
*   **Machine Functional:** क्या मशीन कार्यात्मक है?
*   **Yes/No:** हाँ / नहीं
*   **If No, Reason:** यदि नहीं, तो कारण
*   **Sold To:** किसे बेचा गया?
*   **Waste Type:** कचरे का प्रकार
*   **Amount Earned:** प्राप्त राशि
*   **Expenses:** व्यय

### Village Report
*   **Eng:** Village Waste Report
*   **Hin:** ग्रामीण कचरा रिपोर्ट
*   **Wet Waste:** गीला कचरा
*   **Plastic Waste:** प्लास्टिक कचरा
*   **E-Waste:** ई-कचरा
*   **Honorarium:** मानदेय

## 5. Dashboard Module Text

### Key Metrics
*   **Eng:** Total Waste Processed
*   **Hin:** कुल प्रोसेस किया गया कचरा
*   **Eng:** Total Revenue
*   **Hin:** कुल आय
*   **Eng:** Active Units
*   **Hin:** सक्रिय इकाइयाँ
*   **Eng:** Efficiency Rate
*   **Hin:** दक्षता दर

### Alerts/Notifications
*   **Eng:** Machine Down at [Block Name]
*   **Hin:** [ब्लॉक का नाम] में मशीन बंद
*   **Eng:** Report Pending for [Month]
*   **Hin:** [माह] के लिए रिपोर्ट लंबित

## 6. Error Messages & Validations

| Scenario | English | Hindi |
| :--- | :--- | :--- |
| **Invalid Mobile** | Please enter a valid 10-digit number. | कृपया एक वैध 10 अंकों का नंबर दर्ज करें। |
| **Required Field** | This field is required. | यह फ़ील्ड अनिवार्य है। |
| **Invalid Date** | Date format must be DD-MM-YYYY. | दिनांक प्रारूप DD-MM-YYYY होना चाहिए। |
| **Network Error** | Connection failed. Please try again. | कनेक्शन विफल। कृपया पुनः प्रयास करें। |
| **Success** | Data saved successfully! | डेटा सफलतापूर्वक सहेजा गया! |

## 7. Onboarding / Empty States
*   **Welcome:** Welcome to the Chhattisgarh Waste Management Portal. / छत्तीसगढ़ अपशिष्ट प्रबंधन पोर्टल में आपका स्वागत है।
*   **No Data:** No reports found for this month. / इस माह के लिए कोई रिपोर्ट नहीं मिली।
*   **Get Started:** Tap 'Report' to add your first entry. / अपनी पहली एंट्री जोड़ने के लिए 'रिपोर्ट' पर टैप करें।
```

### Summary of Next Steps
1.  **Setup:** Create a Supabase project. Define the schema based on the PRD.
2.  **Frontend:** Initialize a Next.js project. Install Tailwind CSS (for the Design.md styles).
3.  **Map:** Prepare the Chhattisgarh GeoJSON file for the map component.
4.  **Development:** Build the 4 Portals sequentially, starting with Registration.

This structure provides a solid foundation for a "World Class" government application that is scalable, user-friendly, and data-rich.