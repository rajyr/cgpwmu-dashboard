Here is the detailed Sitemap & Page Specification Document (`Web_Pages_Spec.md`). This document outlines every page, its sections, content logic, and specific animation/illustration requirements to ensure a "World Class" user experience.

```markdown
# Web Pages Specification: UNICEF Chhattisgarh PWMU Platform

## 1. Public Access Pages (No Login Required)

### 1.1 Landing Page (Home)
**Purpose:** First impression, information hub, and entry point for all users.
**Layout:** Modern, Hero-centric, Mobile-first.

| Section | Content Details | Illustration & Animation |
| :--- | :--- | :--- |
| **Header** | Logo (UNICEF + PRD CG), Language Toggle (Hi/En), "Login" Button. | *Micro-interaction:* Language toggle flips with a smooth rotation. |
| **Hero Section** | **Headline:** "Transforming Plastic Waste into Resources" (प्लास्टिक अपशिष्ट को संसाधन में बदलना).<br>**Subtext:** Digital platform for effective waste management in Chhattisgarh.<br>**CTA Buttons:** "Register PWMU", "Login as Official", "Track Waste". | **Animation:** A 2D animated SVG loop showing a village house -> waste bin -> truck -> recycling factory -> new bench/product. (Green & Blue color palette). |
| **Key Features** | 3 Cards: "Real-time Tracking", "Financial Transparency", "Village Empowerment". | **Icon:** Floating icons above cards. <br>**Animation:** Cards float up slightly on hover. |
| **Stats Counter** | Live counters (simulated for public): "Total Waste Processed", "Villages Connected". | **Animation:** Numbers count up from 0 to final value as user scrolls into view. |
| **Footer** | Quick links, Contact info, Government Disclaimer. | Static. |

### 1.2 About Us / Project Info
**Purpose:** Context setting for the initiative.

| Section | Content Details | Illustration & Animation |
| :--- | :--- | :--- |
| **Project Vision** | Text explaining the UNICEF & Govt of Chhattisgarh partnership. | **Illustration:** Handshake illustration (Govt + UNICEF). |
| **The Process (Infographic)** | Step-by-step visual guide: Collection -> Segregation -> Processing -> Disposal. | **Animation:** Vertical timeline where dots light up sequentially as you scroll down. |

---

## 2. Authentication Pages (Gateways)

### 2.1 Login Portal
**Purpose:** Secure entry for different stakeholders.

| Section | Content Details | Illustration & Animation |
| :--- | :--- | :--- |
| **Role Selection** | Tabbed view: "Official", "PWMU Nodal", "Village Sarpanch", "Vendor". | **Animation:** Active tab slides (highlighter effect). |
| **Input Form** | Mobile Number / Email ID. Password / OTP field. | **Icon:** Lock icon shakes if wrong password is entered. |
| **Action Button** | "Secure Login" / "Send OTP". | **Animation:** Button loading spinner (truck moving). |
| **Help** | "Forgot Password?", "Register New Unit". | Text links. |

### 2.2 Forgot Password
**Purpose:** Password recovery.

| Section | Content Details | Illustration & Animation |
| :--- | :--- | :--- |
| **Verification** | Enter Registered Mobile Number. | **Illustration:** Question mark icon with gear. |
| **Reset** | Enter New Password & Confirm. | **Validation:** Green checkmark appears when passwords match. |

---

## 3. Registration Pages (Onboarding)

### 3.1 PWMU Registration (Wizard/Step-by-Step)
**Purpose:** New unit setup.

| Step | Content Details | Illustration & Animation |
| :--- | :--- | :--- |
| **1. Basic Info** | District, Block, Unit Name, Nodal Officer Details, Operational Date. | **Illustration:** Form filling animation. |
| **2. Location Setup** | GPS Capture button (auto-fill Lat/Long), Address. | **Icon:** Map marker pin that pulses. |
| **3. Asset Inventory** | Checkboxes for Machines (Baling, Shredder, etc.). Upload Photos of machines. | **Illustration:** Icon of selected machine glows when checked. |
| **4. Village Linking** | "How many villages?" input. Dynamic rows appear for Block -> GP -> Village selection. | **Animation:** Rows slide down smoothly when "+" is clicked. |
| **5. Success** | "Registration Successful! Auto-generated ID: [BLOCK-2024-001]". | **Animation:** Confetti pop or large Checkmark drawing itself. |

### 3.2 Vendor Registration
**Purpose:** Recycler/Kabadiwala onboarding.

| Section | Content Details | Illustration & Animation |
| :--- | :--- | :--- |
| **Business Details** | Vendor Name, Shop Address (using JSON Geo-location), Mobile, Email. | **Illustration:** Shop/Storefront icon. |
| **Waste Types** | MCQ: Plastic (PET, HDPE...), Cement Factory, Road Construction. | **Interaction:** Clicking a category shows a tooltip explaining it (e.g., "PET: Water bottles"). |
| **Preferred PWMU** | Dropdown to select which PWMU they supply to. | **Icon:** Link chain icon. |

### 3.3 Village Self-Registration
**Purpose:** Sarpanch registering their village.

| Section | Content Details | Illustration & Animation |
| :--- | :--- | :--- |
| **Search PWMU** | Dropdown to find their parent PWMU. | **Animation:** Search bar expands. |
| **Sarpanch Details** | Name, Mobile, Voter ID (optional). | **Illustration:** User icon. |
| **Verification** | "Requesting approval from [PWMU Name]". | **Animation:** Hourglass/Clock timer animation. |

---

## 4. Main Dashboards (Role-Based Hubs)

### 4.1 PWMU Dashboard (Nodal Officer)
**Purpose:** Command center for the unit.

| Section | Content Details | Illustration & Animation |
| :--- | :--- | :--- |
| **Header** | Unit Name, Location, Date. | **Notification Bell:** Red dot if alerts exist. |
| **Quick Actions** | Big Buttons: "Daily Log", "Monthly Report", "Add Village", "Add Vendor". | **Icon:** 3D-ish pressable buttons. |
| **Live Stats Cards** | Waste In (Today), Waste Processed (MT), Available Stock (For Vendors). | **Animation:** Numbers refresh/update every 30s. |
| **Alerts Bar** | "Shredder Machine Non-Functional since 2 days". | **Visual:** Red flashing warning icon. |
| **Linked Villages Map** | Mini-map showing all connected villages. | **Interaction:** Hover shows village name. |

### 4.2 Village Dashboard (Sarpanch)
**Purpose:** Village level monitoring.

| Section | Content Details | Illustration & Animation |
| :--- | :--- | :--- |
| **My Village** | Village Name, Gram Panchayat. | **Illustration:** Village hut icon. |
| **Today's Summary** | Waste Collected (Wet vs Dry), Status (Submitted/Pending). | **Progress Bar:** Fills up based on daily target. |
| **Swachhata Workers** | List of workers + Attendance status (Present/Absent). | **Avatars:** Green ring around active workers. |
| **Financials** | User Charge Collected this month. | **Icon:** Rupee coin stack. |

### 4.3 Vendor Dashboard
**Purpose:** Market intelligence.

| Section | Content Details | Illustration & Animation |
| :--- | :--- | :--- |
| **Market Availability** | List of PWMUs with "Ready to Sell" stock. | **Visual:** "Hot" flame icon next to high stock items. |
| **My Picks** | History of waste collected. | **Chart:** Small line chart showing pickup trends. |

### 4.4 Official Dashboard (Admin/District/State)
**Purpose:** High-level monitoring.

| Section | Content Details | Illustration & Animation |
| :--- | :--- | :--- |
| **Chhattisgarh Map** | Interactive GeoJSON map. Color coded by performance. | **Interaction:** Zoom/Pan. Click District -> Drill down to Block. |
| **State-wide Metrics** | Total Waste Recycled, Total CO2 Saved, Total Revenue Generated. | **Animation:** Counter scrolling effect. |
| **Compliance Heatmap** | Visual grid showing who has reported. | **Color:** Green (Done), Red (Not Done). |

---

## 5. Operational Reporting (Data Entry)

### 5.1 PWMU Daily Log
**Purpose:** Track daily intake.

| Section | Content Details | Illustration & Animation |
| :--- | :--- | :--- |
| **Date Selector** | Calendar widget. | **Interaction:** Highlight today. |
| **Waste Intake Table** | List of Linked Villages. Input field for "Kg Received". | **Smart Feature:** If Village already submitted data, auto-fill it and lock it (show "Source: Village"). |
| **Total Summary** | Auto-sum of all rows. | **Animation:** Total updates instantly as user types. |
| **Submit** | "Save Log". | **Animation:** Button transforms into a checkmark. |

### 5.2 PWMU Monthly Report
**Purpose:** Comprehensive monthly data.

| Section | Content Details | Illustration & Animation |
| :--- | :--- | :--- |
| **Month Selector** | Dropdown (Jan, Feb...). | |
| **Asset Status** | List of machines. Toggle: Functional/Non-Functional. If Non-functional -> Show Date & Reason dropdown. | **Icon:** Green Check / Red Cross. |
| **Financials (Sales)** | "Add Transaction" Button.<br>Select Vendor -> Type -> Kg -> Amount.<br>List of transactions below. | **Animation:** New row slides in from top. |
| **Expenses (O&M)** | Electricity Bill, Honorarium, Repairs. Input fields. | **Icon:** Wallet/Money out icon. |
| **Review & Submit** | Summary of all inputs. | **Visual:** PDF Preview icon. |

### 5.3 Village Daily Reporting
**Purpose:** Village level waste segregation data.

| Section | Content Details | Illustration & Animation |
| :--- | :--- | :--- |
| **Waste Breakdown** | Grid of cards: Wet, Plastic, Metal, Glass, E-Waste, Other. <br>Input Kg in each. | **Interaction:** Card highlights when focused. |
| **Source** | "Shed Collection" or "Door-to-Door". | **Icon:** Truck vs. Hand basket. |

### 5.4 Village Monthly Report
**Purpose:** Village financials and recycling.

| Section | Content Details | Illustration & Animation |
| :--- | :--- | :--- |
| **Sales to Recyclers** | Select Kabadiwala/Vendor. Type of Plastic. Kg & Amount. | **Illustration:** Handshake icon. |
| **Honorarium** | Input: Number of Workers. Input: Amount per worker.<br>Display: "Total Payable = [Auto Calc]". | **Animation:** Calculator icon animating. |
| **User Charges** | Total fee collected from households. | **Icon:** Receipt. |

---

## 6. Advanced Analytics (Monitoring & Planning)

### 6.1 Interactive Map View (Geo-JSON)
**Purpose:** Spatial analysis.

| Section | Content Details | Illustration & Animation |
| :--- | :--- | :--- |
| **Filters** | Year, Month, District, Waste Type. | **Style:** Floating sidebar filter. |
| **The Map** | Chhattisgarh District/Block boundaries. <br>Choropleth shading (Dark Blue = High Waste). | **Tooltip:** Hover shows District Name + Total Kg. |
| **Drill Down** | Click District -> Shows Blocks -> Click Block -> Shows Villages. | **Animation:** Smooth zoom transition. |

### 6.2 Waste Flow (Sankey Diagram)
**Purpose:** Visualizing the chain (Village -> PWMU -> End Destination).

| Section | Content Details | Illustration & Animation |
| :--- | :--- | :--- |
| **The Diagram** | Left Column: Villages (Source).<br>Middle: PWMU (Processing).<br>Right: Recyclers, Road, Cement (Sink). | **Animation:** "Particles" (small dots) moving along the connecting lines representing flow volume. Speed = Volume. |
| **Metrics** | Hover over a line -> "5000 kg", "Revenue: ₹15,000". | **Style:** Gradient lines (Blue to Green). |

### 6.3 Financial & Efficiency Dashboard
**Purpose:** Cost-benefit analysis.

| Section | Content Details | Illustration & Animation |
| :--- | :--- | :--- |
| **Revenue vs Cost** | Combo Bar/Line Chart. <br>X-axis: Months. Y-axis: Rupees. | **Interaction:** Toggle to show "Profit/Loss". |
| **Machine Uptime** | Donut Chart. <br>Slices: Functional, Maintenance, Breakdown. | **Animation:** Chart spins on load. |
| **Diversion Rate** | Gauge/Meter chart. <br>Needle points to % of waste diverted from landfill. | **Animation:** Needle moves from 0 to actual % smoothly. |

### 6.4 Compliance & Planning
**Purpose:** Administrative oversight.

| Section | Content Details | Illustration & Animation |
| :--- | :--- | :--- |
| **Reporting Status** | List view of all PWMUs/Villages. Status badges (Reported, Pending, Late). | **Visual:** Red text for >7 days late. |
| **Action Center** | "Send Reminder" button (Auto-SMS). | **Icon:** Paper plane flying. |

---

## 7. Account & Settings

### 7.1 User Profile
**Purpose:** Manage account.

| Section | Content Details | Illustration & Animation |
| :--- | :--- | :--- |
| **Profile Card** | Name, Role, ID, Photo (placeholder). | **Icon:** Camera to upload photo. |
| **Security** | Change Password. | |
| **App Settings** | Language (Hindi/English), Notification Preferences (SMS/Email). | **Toggle:** Smooth sliding toggle switch. |
| **Logout** | Red button. | **Animation:** Fade out screen. |
```