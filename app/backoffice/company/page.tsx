'use client'

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { config } from "@/app/config";
import PageWrapper from "../components/PageWrapper";
import PageHeader from "../components/PageHeader";
import Card from "../components/Card";

// Reusable InputField to keep the form clean
const InputField = ({ label, value, onChange, placeholder = '' }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <input
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
    </div>
);

export default function Page() {
    // --- All your state and logic remains exactly the same ---
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [taxCode, setTaxCode] = useState("");

    useEffect(() => { fetchData(); }, []);
    const fetchData = async () => { try { const res = await axios.get(`${config.apiUrl}/company/list`); if (res.data) { setName(res.data.name); setAddress(res.data.address); setPhone(res.data.phone); setEmail(res.data.email); setTaxCode(res.data.taxCode); } } catch (error) { console.error("Could not fetch company data", error); } };
    const handleSave = async () => { try { const payload = { name, address, phone, email, taxCode }; await axios.post(`${config.apiUrl}/company/create`, payload); Swal.fire({ icon:'success', title: 'บันทึกข้อมูลเรียบร้อย', timer: 2000, showConfirmButton: false }); } catch (error) { Swal.fire({ icon: 'error', title: 'ผิดพลาด', text: 'ไม่สามารถบันทึกข้อมูลได้' }); } };

    return (
        <PageWrapper>
            <PageHeader
                title="ข้อมูลร้าน"
                subtitle="จัดการข้อมูลที่อยู่และรายละเอียดการติดต่อของร้าน"
            />
            
            <Card>
                <div className="space-y-4">
                    <InputField label="ชื่อร้าน" value={name} onChange={(e) => setName(e.target.value)} placeholder="ชื่อบริษัท หรือ ร้านค้า"/>
                    <InputField label="ที่อยู่" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="ที่อยู่"/>
                    <InputField label="เบอร์โทรศัพท์" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="เบอร์โทรศัพท์"/>
                    <InputField label="อีเมล" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="อีเมล"/>
                    <InputField label="รหัสประจำตัวผู้เสียภาษี" value={taxCode} onChange={(e) => setTaxCode(e.target.value)} placeholder="รหัสประจำตัวผู้เสียภาษี"/>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end">
                    <button className="btn" onClick={handleSave}>
                        <i className="fa fa-save mr-2"></i>
                        บันทึกข้อมูล
                    </button>
                </div>
            </Card>
        </PageWrapper>
    );
}