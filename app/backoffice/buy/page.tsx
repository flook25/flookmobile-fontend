'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';
import { config } from '@/app/config';
import Swal from 'sweetalert2';
import Modal from '../modal';

export default function Page() {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');
    const [release, setRelease] = useState('');
    const [color, setColor] = useState('');
    const [price, setPrice] = useState(0);
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerAddress, setCustomerAddress] = useState('');
    const [remarks, setRemarks] = useState('');
    const [products, setProduct] = useState(''); // สินค้าที่ซื้อ


    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {

        } catch (err: any) {
            Swal.fire({
                icon: 'error',
                title: 'ผิดพลาด',
                text: err.message,
            });
        }
    }

    const handleOpenModal = () => {
        setIsOpen(true);
    }

    const handleCloseModal = () => {
        setIsOpen(false);
    }

    const handleSave = async () => {
        try {
            const payload = {
                name,
                release,
                color,
                price,
                customerName,
                customerPhone,
                customerAddress,
                remarks
            };

            await axios.post(`${config.apiUrl}/buy/create`, payload);
            
            Swal.fire({
                icon: 'success',
                title: 'บันทึกข้อมูลเรียบร้อย',
                text: 'ข้อมูลถูกบันทึกเรียบร้อยแล้ว',
                timer: 2000
            });

            // Reset form
            setName('');
            setRelease('');
            setColor('');
            setPrice(0);
            setCustomerName('');
            setCustomerPhone('');
            setCustomerAddress('');
            setRemarks('');
            
            // Close modal
            setIsOpen(false);
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'ผิดพลาด',
                text: error.response?.data?.message || 'ไม่สามารถบันทึกข้อมูลได้'
            });
        }
    };


    return (
        <>
            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="content-header">รายการซื้อ</h1>
                        <p className="text-gray-600 mt-1">จัดการรายการซื้อสินค้าและวัสดุ</p>
                    </div>
                    <button
                        className='btn hover:bg-teal-700 transition-colors duration-200 shadow-md'
                        onClick={handleOpenModal}
                    >
                        <i className='fa-solid fa-plus mr-2'></i>
                        เพิ่มรายการ
                    </button>
                </div>

                {/* Content Section */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="text-center py-12 text-gray-500">
                        <i className="fa-solid fa-shopping-cart text-4xl mb-4 text-gray-300"></i>
                        <p className="text-lg">ยังไม่มีรายการซื้อ</p>
                        <p className="text-sm">คลิกปุ่ม "เพิ่มรายการ" เพื่อเริ่มต้น</p>
                    </div>
                </div>
            </div>

            <Modal title="เพิ่มรายการซื้อ" isOpen={isOpen} onClose={handleCloseModal} size="lg">
                <div className="space-y-4">
                    {/* Product Information Section */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-800 mb-3 pb-2 border-b border-gray-200">ข้อมูลสินค้า</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    ชื่อสินค้า <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    placeholder="ชื่อสินค้า"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    รุ่น <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={release}
                                    onChange={(e) => setRelease(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    placeholder="รุ่นสินค้า"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    สี
                                </label>
                                <input
                                    type="text"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    placeholder="สีสินค้า"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    ราคา <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(Number(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    placeholder="0"
                                    min="0"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Customer Information Section */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-800 mb-3 pb-2 border-b border-gray-200">ข้อมูลลูกค้า</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    ชื่อลูกค้า <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    placeholder="ชื่อลูกค้า"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    เบอร์โทรลูกค้า
                                </label>
                                <input
                                    type="tel"
                                    value={customerPhone}
                                    onChange={(e) => setCustomerPhone(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    placeholder="เบอร์โทรลูกค้า"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    ที่อยู่ลูกค้า
                                </label>
                                <input
                                    type="text"
                                    value={customerAddress}
                                    onChange={(e) => setCustomerAddress(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    placeholder="ที่อยู่ลูกค้า"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                เบอร์โทรลูกค้า
                            </label>
                            <input
                                type="tel"
                                value={customerPhone}
                                onChange={(e) => setCustomerPhone(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                placeholder="เบอร์โทรลูกค้า"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                ที่อยู่ลูกค้า
                            </label>
                            <input
                                type="text"
                                value={customerAddress}
                                onChange={(e) => setCustomerAddress(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                placeholder="ที่อยู่ลูกค้า"
                            />
                        </div>
                    </div>

                    {/* Additional Information Section */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-800 mb-3 pb-2 border-b border-gray-200">ข้อมูลเพิ่มเติม</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                หมายเหตุ
                            </label>
                            <textarea
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                rows={3}
                                placeholder="หมายเหตุเพิ่มเติม เช่น เงื่อนไขการชำระเงิน, วันที่ส่งมอบ..."
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            onClick={handleCloseModal}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
                        >
                            ยกเลิก
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors duration-200"
                        >
                            บันทึก
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    )
}