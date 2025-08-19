'use client';

import { useState } from "react";
import Swal from "sweetalert2";
import PageWrapper from "../components/PageWrapper";
import PageHeader from "../components/PageHeader";
import Card from "../components/Card";

export default function Page() {
    // --- Your logic remains the same ---
    const [serial, setSerial] = useState('');

    const handleSave = () => {
        if (!serial) {
            Swal.fire('กรุณากรอกข้อมูล', 'กรุณากรอกหมายเลขซีเรียล', 'warning');
            return;
        }
        // In a real app, you would make an API call here.
        Swal.fire('บันทึกสำเร็จ', `บันทึกการขายสำหรับ S/N: ${serial}`, 'success');
        setSerial(''); // Clear input after saving
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
                    />
                    <button className="btn" onClick={handleSave}>
                        <i className="fa-solid fa-save mr-2"></i>
                        บันทึกการขาย
                    </button>
                </div>
            </Card>
        </PageWrapper>
    );
}