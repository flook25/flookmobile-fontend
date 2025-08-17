'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";

// Define the menu items in an array for easy management
const menuItems = [
    { href: '/backoffice/dashboard', icon: 'fa-tachometer-alt', label: 'Dashboard' },
    { href: '/backoffice/buy', icon: 'fa-shopping-cart', label: 'ซื้อสินค้า' },
    { href: '/backoffice/sell', icon: 'fa-tag', label: 'ขายสินค้า' },
    { href: '/backoffice/repair', icon: 'fa-wrench', label: 'ซ่อมสินค้า' },
    { href: '/backoffice/company', icon: 'fa-store', label: 'ข้อมูลร้าน' },
];

export default function Sidebar() {
    const pathname = usePathname();

    const isActive = (path: string) => {
        // Use startsWith for parent routes to also be active, or === for exact match
        return pathname === path;
    };

    const handleLogout = () => {
        // Add your logout logic here, e.g., clearing tokens, redirecting, etc.
        console.log("Logout action triggered");
        // Example: router.push('/login');
    };

    return (
        // Single sidebar container with a professional, dark theme
        <div className="fixed left-0 top-0 h-screen w-64 bg-teal-800 text-white z-50 shadow-lg flex flex-col">

            {/* Header / Logo Section */}
            <div className="p-5 text-center border-b border-teal-700">
                <h1 className="font-bold text-xl">
                    FlookMobile
                </h1>
                <p className="text-xs text-teal-300">Version 1.0</p>
            </div>

            {/* Main Navigation (dynamically generated and takes up the available space) */}
            <nav className="flex-grow p-4 space-y-2">
                {menuItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        // Conditionally apply active styles
                        className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors duration-200 hover:bg-teal-700 ${
                            isActive(item.href) ? 'bg-teal-600 font-semibold shadow-lg' : ''
                        }`}
                    >
                        <i className={`fa-solid ${item.icon} w-6 text-center text-lg`}></i>
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>

            {/* Footer / User & Logout Section (Pushed to the bottom) */}
            <div className="p-4 border-t border-teal-700 space-y-2">
                <Link
                    href="/backoffice/users"
                    className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors duration-200 hover:bg-teal-700 ${
                        isActive('/backoffice/users') ? 'bg-teal-600 font-semibold shadow-lg' : ''
                    }`}
                >
                    <i className="fa-solid fa-users w-6 text-center text-lg"></i>
                    <span>ผู้ใช้งาน</span>
                </Link>

                <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-md hover:bg-teal-700 transition-colors duration-200"
                >
                    <i className="fa-solid fa-sign-out-alt w-6 text-center text-lg"></i>
                    <span>ออกจากระบบ</span>
                </button>
            </div>
        </div>
    );
}