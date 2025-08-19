'use client';

import { useEffect, useState, useCallback } from "react";
import Swal from "sweetalert2";
import PageWrapper from "../components/PageWrapper";
import PageHeader from "../components/PageHeader";
import Card from "../components/Card";
import axios from "axios";
import { config } from "@/app/config"; 

// --- UPDATED: Added `price` to the Sale interface ---
interface Sale {
    id: string;
    serial: string;
    createdAt: string;
    price: number; // To display the price in the recent sales list
}

export default function Page() {
    const [serial, setSerial] = useState('');
    // --- FIX #1: Initialize price as a string to match the input's value ---
    const [price, setPrice] = useState(''); 
    const [recentSales, setRecentSales] = useState<Sale[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            const res = await axios.get(`${config.apiUrl}/sell/list`);
            setRecentSales(res.data);
        } catch (err) {
            console.error("Could not fetch recent sales", err);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSave = async () => {
        // --- Added validation for the price field ---
        if (!serial || !price) {
            Swal.fire('กรุณากรอกข้อมูล', 'กรุณากรอกหมายเลขซีเรียลและราคาให้ครบถ้วน', 'warning');
            return;
        }

        const numericPrice = parseFloat(price);
        if (isNaN(numericPrice) || numericPrice < 0) {
            Swal.fire('ราคาไม่ถูกต้อง', 'กรุณากรอกราคาเป็นตัวเลขที่ถูกต้อง', 'warning');
            return;
        }

        setIsLoading(true);

        try {
            const payload = { 
                serial: serial,
                price: numericPrice // Send the price as a number
            };
            await axios.post(`${config.apiUrl}/sell/create`, payload);

            Swal.fire('บันทึกสำเร็จ', `บันทึกการขายสำหรับ S/N: ${serial}`, 'success');
            // --- Reset both fields after saving ---
            setSerial('');
            setPrice('');
            await fetchData();

        } catch (err: any) {
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: err.response?.data?.message || err.message
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    // Helper function to format dates
    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleString('th-TH');
    };

    // Helper function to format price for display
    const formatPrice = (value: number) => {
        if (value === null || value === undefined) return '-';
        return new Intl.NumberFormat('th-TH').format(value);
    };

    return (
        <PageWrapper>
            <PageHeader
                title="ขายสินค้า"
                subtitle="บันทึกรายการขายสินค้าหน้าร้านด้วยหมายเลขซีเรียล"
            />
            <Card>
                <div className="flex flex-col sm:flex-row gap-3">
                    <input
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        type="text"
                        placeholder="สแกนหรือกรอกหมายเลขซีเรียล..."
                        value={serial}
                        onChange={(e) => setSerial(e.target.value)}
                        disabled={isLoading}
                    />
                    {/* --- FIX #2: Correctly bind `value` and `onChange` to the `price` state --- */}
                    <input
                        className="w-full sm:w-1/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        type="number" // Changed to type="number" for better UX
                        placeholder="ราคา"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        disabled={isLoading} 
                    />
                    <button className="btn" onClick={handleSave} disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                กำลังบันทึก...
                            </>
                        ) : (
                            <>
                                <i className="fa-solid fa-save mr-2"></i>
                                บันทึกการขาย
                            </>
                        )}
                    </button>
                </div>
            </Card>

            <Card>
                <h2 className="text-lg font-semibold text-gray-700 mb-4">รายการขายล่าสุด</h2>
                {recentSales.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                        {recentSales.map((sale) => (
                            <li key={sale.id} className="py-3 flex justify-between items-center">
                                <div>
                                    <span className="font-mono text-gray-800">{sale.serial}</span>
                                </div>
                                <div className="text-right">
                                    {/* --- Display the price in the list --- */}
                                    <span className="font-semibold text-gray-800">{formatPrice(sale.price)} บาท</span>
                                    <span className="block text-xs text-gray-500">{formatDate(sale.createdAt)}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-gray-500 py-4">ยังไม่มีรายการขายวันนี้</p>
                )}
            </Card>
        </PageWrapper>
    );
}