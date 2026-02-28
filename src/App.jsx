import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import PublicLayout from './components/PublicLayout';
import FocusLayout from './components/FocusLayout';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import AboutUs from './pages/AboutUs';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import PWMUReg from './pages/Registration/PWMUReg';
import VillageReg from './pages/Registration/VillageReg';
import VendorReg from './pages/Registration/VendorReg';
import PWMUHub from './pages/Reporting/PWMUHub';
import DailyLogPWMU from './pages/Reporting/DailyLogPWMU';
import PWMUMonthlyReport from './pages/Reporting/PWMUMonthlyReport';
import VillageDailyReport from './pages/Reporting/VillageDailyReport';
import VillageMonthlyReport from './pages/Reporting/VillageMonthlyReport';
import MachineInt from './pages/Dashboards/MachineInt';
import ComplianceDashboard from './pages/Dashboards/ComplianceDashboard';
import PolicyPlanDashboard from './pages/Dashboards/PolicyPlanDashboard';
import VillageDashboard from './pages/Dashboards/VillageDashboard';
import VendorDashboard from './pages/Dashboards/VendorDashboard';
import DistrictView from './pages/Dashboards/DistrictView';
import FinancialView from './pages/Dashboards/FinancialView';
import MonitoringAnalytics from './pages/Dashboards/MonitoringAnalytics';
import SettingsDashboard from './pages/Dashboards/SettingsDashboard';
import { useAuth } from './context/AuthContext';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<PublicLayout />}>
                    <Route index element={<Landing />} />
                    <Route path="about" element={<AboutUs />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="register/pwmu" element={<PWMUReg />} />
                    <Route path="register/village" element={<VillageReg />} />
                    <Route path="register/vendor" element={<VendorReg />} />
                </Route>

                {/* Protected/Admin Routes */}
                <Route path="/dashboard" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                    <Route index element={<Dashboard />} />
                    {/* PWMU Routes in Standard Layout (Hub) */}
                    <Route path="pwmu" element={<PWMUHub />} />

                    {/* Village Routes */}
                    <Route path="village/daily-log" element={<VillageDailyReport />} />
                    <Route path="village/monthly-report" element={<VillageMonthlyReport />} />

                    {/* Advanced Dashboards */}
                    <Route path="district" element={<DistrictView />} />
                    <Route path="financial" element={<FinancialView />} />
                    <Route path="machine" element={<MachineInt />} />
                    <Route path="compliance" element={<ComplianceDashboard />} />
                    <Route path="monitoring" element={<MonitoringAnalytics />} />
                    <Route path="policy" element={<PolicyPlanDashboard />} />

                    {/* Role-based Hubs (Demoing inside Main Layout) */}
                    <Route path="village-hub" element={<VillageDashboard />} />
                    <Route path="vendor-hub" element={<VendorDashboard />} />
                    <Route path="settings" element={<SettingsDashboard />} />

                    {/* Other protected routes will be added here */}
                </Route>
                {/* Focus Layout Routes (No Sidebar) */}
                <Route path="/pwmu" element={<ProtectedRoute><FocusLayout /></ProtectedRoute>}>
                    <Route path="daily-log" element={<DailyLogPWMU />} />
                    <Route path="monthly-report" element={<PWMUMonthlyReport />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
