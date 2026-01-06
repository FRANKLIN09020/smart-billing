import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import BillingPage from "../modules/billing/pages/BillingPage.tsx";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/dashboard/products" />} />

            <Route path="/dashboard" element={<DashboardLayout />}>
                <Route path="products" element={<div>Products Page</div>} />
                <Route path="billing" element={<BillingPage/>} />
                <Route path="inventory" element={<div>Inventory Page</div>} />
                <Route path="reports" element={<div>Reports Page</div>} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
