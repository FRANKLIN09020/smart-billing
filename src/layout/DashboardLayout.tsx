import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} />

            {/* Main Content */}
            <div className="flex flex-col flex-1">
                <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

                <main className="p-4 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
