import { NavLink } from "react-router-dom";
import {
    Package,
    Receipt,
    Boxes,
    BarChart3,
} from "lucide-react";
import clsx from "clsx";

interface SidebarProps {
    isOpen: boolean;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
    return (
        <aside
            className={clsx(
                "h-screen bg-gray-900 text-gray-200 transition-all duration-300 ease-in-out",
                isOpen ? "w-64" : "w-16"
            )}
        >
            {/* Logo */}
            <div className="h-14 flex items-center justify-center border-b border-gray-800">
        <span className="text-lg font-bold tracking-wide">
          {isOpen ? "SmartBilling" : "SB"}
        </span>
            </div>

            {/* Navigation */}
            <nav className="mt-4 flex flex-col gap-1">
                <NavItem
                    to="/dashboard/products"
                    label="Products"
                    icon={<Package size={18} />}
                    isOpen={isOpen}
                />
                <NavItem
                    to="/dashboard/billing"
                    label="Billing"
                    icon={<Receipt size={18} />}
                    isOpen={isOpen}
                />
                <NavItem
                    to="/dashboard/inventory"
                    label="Inventory"
                    icon={<Boxes size={18} />}
                    isOpen={isOpen}
                />
                <NavItem
                    to="/dashboard/reports"
                    label="Reports"
                    icon={<BarChart3 size={18} />}
                    isOpen={isOpen}
                />
            </nav>
        </aside>
    );
};

interface NavItemProps {
    to: string;
    label: string;
    icon: React.ReactNode;
    isOpen: boolean;
}

const NavItem = ({ to, label, icon, isOpen }: NavItemProps) => {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                clsx(
                    "group relative flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-md mx-2 transition-colors",
                    isActive
                        ? "bg-gray-800 text-white"
                        : "hover:bg-gray-800 hover:text-white"
                )
            }
        >
            {/* Icon */}
            <span className="min-w-[20px] flex justify-center text-gray-400 group-hover:text-white">
        {icon}
      </span>

            {/* Label */}
            {isOpen && <span className="whitespace-nowrap">{label}</span>}

            {/* Tooltip when collapsed */}
            {!isOpen && (
                <span className="absolute left-14 z-50 hidden rounded-md bg-black px-2 py-1 text-xs text-white group-hover:block">
          {label}
        </span>
            )}
        </NavLink>
    );
};

export default Sidebar;
