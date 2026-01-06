import { useState } from "react";
import {
    Menu,
    LogOut,
    User,
    ChevronDown,
} from "lucide-react";

interface HeaderProps {
    toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
    const [open, setOpen] = useState(false);

    return (
        <header className="h-14 bg-white border-b shadow-sm flex items-center justify-between px-4">
            {/* Left Section */}
            <div className="flex items-center gap-3">
                <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-md hover:bg-gray-100 transition"
                    aria-label="Toggle Sidebar"
                >
                    <Menu size={20} />
                </button>

                <h1 className="text-lg font-semibold text-gray-800 tracking-wide">
                    SmartBilling
                </h1>
            </div>

            {/* Right Section */}
            <div className="relative">
                <button
                    onClick={() => setOpen(!open)}
                    className="flex items-center gap-2 rounded-md px-3 py-1.5 hover:bg-gray-100 transition"
                >
                    <User size={18} className="text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
            Admin
          </span>
                    <ChevronDown size={16} />
                </button>

                {/* Dropdown */}
                {open && (
                    <div className="absolute right-0 mt-2 w-40 rounded-md border bg-white shadow-lg">
                        <button
                            className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                        >
                            <User size={16} />
                            Profile
                        </button>

                        <button
                            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                            <LogOut size={16} />
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
