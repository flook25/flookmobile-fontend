'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import axios from "axios";
import { config } from "../config"; // Make sure this path is correct
import { useEffect, useState, useCallback, FormEvent } from "react";
import Modal from "./modal"; // Make sure this path is correct

// UI Component #1: Reusable NavLink for clean navigation
const NavLink = ({ href, icon, label }) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors duration-200 hover:bg-teal-700 ${isActive ? 'bg-teal-600 font-semibold shadow-lg' : ''}`}
        >
            <i className={`fa-solid ${icon} w-6 text-center text-lg`}></i>
            <span>{label}</span>
        </Link>
    );
};

// UI Component #2: Reusable ActionButton for footer buttons
const ActionButton = ({ icon, label, onClick }) => (
    <button
        onClick={onClick}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-md hover:bg-teal-700 transition-colors duration-200 text-left"
    >
        <i className={`fa-solid ${icon} w-6 text-center text-lg`}></i>
        <span>{label}</span>
    </button>
);

// Data for the navigation menu, makes it easy to manage
const menuItems = [
    { href: '/backoffice/dashboard', icon: 'fa-tachometer-alt', label: 'Dashboard', adminOnly: true },
    { href: '/backoffice/buy', icon: 'fa-shopping-cart', label: 'ซื้อสินค้า', adminOnly: true },
    { href: '/backoffice/sell', icon: 'fa-dollar-sign', label: 'ขายสินค้า', adminOnly: false },
    { href: '/backoffice/repair', icon: 'fa-wrench', label: 'รับซ่อม', adminOnly: false },
    { href: '/backoffice/company', icon: 'fa-building', label: 'ข้อมูลร้าน', adminOnly: true },
    { href: '/backoffice/user', icon: 'fa-users', label: 'ผู้ใช้งาน', adminOnly: true },
];


export default function Sidebar() {
    // --- FIX #1: Initialize all state variables to empty strings (''). ---
    // This makes the inputs "controlled" from the very first render, fixing the error.
    const [name, setName] = useState('');
    const [level, setLevel] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isShowModal, setIsShowModal] = useState(false);
    const router = useRouter();

    const handleShowModal = () => setIsShowModal(true);
    const handleCloseModal = () => {
        setIsShowModal(false);
        // Reset passwords when closing so they don't persist
        setPassword('');
        setConfirmPassword('');
    };

    const fetchData = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) { router.push('/'); return; }
        try {
            const res = await axios.get(`${config.apiUrl}/user/info`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            // --- FIX #2: Ensure API data doesn't set state to null or undefined. ---
            // If `res.data.name` is null, it will default to an empty string.
            setName(res.data.name || '');
            setUsername(res.data.username || '');
            setLevel(res.data.level || '');
        } catch (error) {
            console.error("Failed to fetch user data (likely expired token):", error);
            Swal.fire('Session Expired', 'Please log in again.', 'warning').then(() => {
                localStorage.removeItem('token');
                router.push('/');
            });
        }
    }, [router]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleLogout = () => {
        Swal.fire({
            title: 'Are you sure you want to log out?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, log out'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('token');
                router.push('/');
            }
        });
    };

    const handleSave = async (e: FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            Swal.fire({ icon: 'error', title: 'รหัสผ่านไม่ตรงกัน' });
            return;
        }

        // This payload is perfectly compatible with your backend's `data: req.body`
        const payload = { name, username };
        
        // This check is CRITICAL. It ensures you don't send an empty password.
        if (password) {
            payload.password = password;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.put(`${config.apiUrl}/user/update`, payload, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            Swal.fire('Success', 'Profile updated successfully!', 'success');
            await fetchData();
            handleCloseModal();
        } catch (error) {
            console.error("Update failed:", error);
            Swal.fire('Error', 'Failed to update profile.', 'error');
        }
    };

    return (
        <>
            <div className="fixed left-0 top-0 h-screen w-64 bg-teal-800 text-white z-50 shadow-lg flex flex-col">
                <header className="p-5 text-center border-b border-teal-700">
                    <h1 className="font-bold text-xl">FlookMobile</h1>
                    <p className="text-xs text-teal-300">Version 1.0</p>
                </header>

                <nav className="flex-grow p-4 space-y-2">
                    {menuItems
                        .filter(item => !item.adminOnly || level === 'admin')
                        .map((item) => (
                            <NavLink key={item.href} {...item} />
                        ))}
                </nav>

                <footer className="p-4 border-t border-teal-700 space-y-2">
                    <div className="flex items-center gap-3 px-4 py-3 text-teal-200">
                        <i className="fa-solid fa-user-circle w-6 text-center text-xl"></i>
                        <div>
                            <div className="font-semibold text-white">{name}</div>
                            <div className="text-xs">{level}</div>
                        </div>
                    </div>
                    <ActionButton icon="fa-edit" label="แก้ไขข้อมูลผู้ใช้งาน" onClick={handleShowModal} />
                    <ActionButton icon="fa-sign-out-alt" label="ออกจากระบบ" onClick={handleLogout} />
                </footer>
            </div>

            <Modal title="แก้ไขข้อมูลผู้ใช้งาน" isOpen={isShowModal} onClose={handleCloseModal}>
                {/* The form JSX itself is correct. The problem was fixed in the state management. */}
                <form onSubmit={handleSave}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">ชื่อผู้ใช้งาน</label>
                        <input type="text" value={name}
                            onChange={(e) => setName(e.target.value)} 
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md" />
                    </div>
                    <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <input type="text" value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md" />
                    </div>
                    <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700">New Password</label>
                        <input type="password" value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md" />
                    </div>
                    <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                        <input type="password" value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md" />
                    </div>
                    <div className="mt-4 pt-4 border-t flex justify-end">
                        <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700">
                            <i className="fa fa-save mr-2"></i>
                            บันทึก
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    );
}