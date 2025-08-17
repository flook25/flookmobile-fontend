'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';
import { config } from '@/app/config';
import Swal from 'sweetalert2';
import Modal from '../modal';

interface Product {
    id: string;
    serial: string;
    name: string;
    release: string;
    color: string;
    price: number;
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    remarks: string;
    createdAt: string;
}

export default function Page() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Form states
    const [name, setName] = useState('');
    const [release, setRelease] = useState('');
    const [color, setColor] = useState('');
    const [price, setPrice] = useState(0);
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerAddress, setCustomerAddress] = useState('');
    const [remarks, setRemarks] = useState('');

    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${config.apiUrl}/buy/list`);
            setProducts(response.data);
        } catch (err: any) {
            Swal.fire({
                icon: 'error',
                title: 'ผิดพลาด',
                text: err.message || 'ไม่สามารถโหลดข้อมูลได้',
            });
        } finally {
            setIsLoading(false);
        }
    }

    const resetForm = () => {
        setName('');
        setRelease('');
        setColor('');
        setPrice(0);
        setCustomerName('');
        setCustomerPhone('');
        setCustomerAddress('');
        setRemarks('');
        setEditingProduct(null);
    }

    const handleOpenModal = (product?: Product) => {
        if (product) {
            setEditingProduct(product);
            setName(product.name);
            setRelease(product.release);
            setColor(product.color);
            setPrice(product.price);
            setCustomerName(product.customerName);
            setCustomerPhone(product.customerPhone);
            setCustomerAddress(product.customerAddress);
            setRemarks(product.remarks);
        } else {
            resetForm();
        }
        setIsOpen(true);
    }

    const handleCloseModal = () => {
        setIsOpen(false);
        resetForm();
    }

    const handleSave = async () => {
        if (!name || !release || !price || !customerName) {
            Swal.fire({
                icon: 'warning',
                title: 'ข้อมูลไม่ครบถ้วน',
                text: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน',
            });
            return;
        }

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

            if (editingProduct) {
                await axios.put(`${config.apiUrl}/buy/update/${editingProduct.id}`, payload);
                Swal.fire({
                    icon: 'success',
                    title: 'อัปเดตข้อมูลเรียบร้อย',
                    text: 'ข้อมูลถูกอัปเดตเรียบร้อยแล้ว',
                    timer: 2000
                });
            } else {
                await axios.post(`${config.apiUrl}/buy/create`, payload);
                Swal.fire({
                    icon: 'success',
                    title: 'บันทึกข้อมูลเรียบร้อย',
                    text: 'ข้อมูลถูกบันทึกเรียบร้อยแล้ว',
                    timer: 2000
                });
            }

            resetForm();
            setIsOpen(false);
            fetchData();
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'ผิดพลาด',
                text: error.response?.data?.message || 'ไม่สามารถบันทึกข้อมูลได้'
            });
        }
    };

    const handleDelete = async (productId: string) => {
        const result = await Swal.fire({
            title: 'ยืนยันการลบ',
            text: 'คุณต้องการลบรายการนี้หรือไม่? การดำเนินการนี้ไม่สามารถยกเลิกได้',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'ลบ',
            cancelButtonText: 'ยกเลิก'
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`${config.apiUrl}/buy/delete/${productId}`);
                Swal.fire({
                    icon: 'success',
                    title: 'ลบข้อมูลเรียบร้อย',
                    text: 'รายการถูกลบเรียบร้อยแล้ว',
                    timer: 2000
                });
                fetchData();
            } catch (error: any) {
                Swal.fire({
                    icon: 'error',
                    title: 'ผิดพลาด',
                    text: error.response?.data?.message || 'ไม่สามารถลบข้อมูลได้'
                });
            }
        }
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.release.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.serial.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('th-TH', {
            style: 'currency',
            currency: 'THB'
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('th-TH');
    };

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Header Section */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800 mb-2">รายการซื้อ</h1>
                                <p className="text-gray-600">จัดการรายการซื้อสินค้าและวัสดุ</p>
                            </div>
                            <button
                                className='btn hover:bg-teal-700 transition-colors duration-200 shadow-md'
                                onClick={() => handleOpenModal()}
                            >
                                <i className='fa-solid fa-plus mr-2'></i>
                                เพิ่มรายการ
                            </button>
                        </div>
                    </div>

                    {/* Search and Filter Section */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                {/* --- Start of Corrected Code --- */}
                                <div className="flex items-center border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-transparent">
                                    <i className="fa-solid fa-search text-gray-400 pl-3 pointer-events-none"></i>
                                    <input
                                        type="text"
                                        placeholder="ค้นหารายการ..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-2 pr-4 py-2 bg-transparent border-none rounded-md focus:outline-none focus:ring-0"
                                    />
                                </div>
                                {/* --- End of Corrected Code --- */}
                            </div>
                            <div className="text-sm text-gray-600 flex items-center">
                                <span>พบ {filteredProducts.length} รายการ</span>
                            </div>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                                <span className="ml-3 text-gray-600">กำลังโหลดข้อมูล...</span>
                            </div>
                        ) : filteredProducts.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ลำดับ</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อลูกค้า</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">รุ่น</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สี</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ราคา</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">เบอร์โทรศัพท์</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">หมายเหตุ</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่</th>
                                            <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">จัดการ</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredProducts.map((product, index) => (
                                            <tr key={product.id} className="hover:bg-gray-50 transition-colors duration-150">
                                                <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.customerName}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900">{product.release}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                    {product.color && (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                            {product.color}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                                    {formatPrice(product.price)}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900">{product.customerPhone}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate" title={product.remarks}>
                                                    {product.remarks || '-'}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {product.createdAt ? formatDate(product.createdAt) : '-'}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex items-center justify-center space-x-2">
                                                        <button
                                                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors duration-150"
                                                            onClick={() => handleOpenModal(product)}
                                                            title="แก้ไข"
                                                        >
                                                            <i className="fa-solid fa-edit"></i>
                                                        </button>
                                                        <button
                                                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors duration-150"
                                                            onClick={() => handleDelete(product.id)}
                                                            title="ลบ"
                                                        >
                                                            <i className="fa-solid fa-trash"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            /* Empty State */
                            <div className="text-center py-12 text-gray-500">
                                <i className="fa-solid fa-shopping-cart text-6xl mb-4 text-gray-300"></i>
                                <p className="text-xl font-medium text-gray-600 mb-2">
                                    {searchTerm ? 'ไม่พบรายการที่ค้นหา' : 'ยังไม่มีรายการซื้อ'}
                                </p>
                                <p className="text-sm text-gray-500 mb-4">
                                    {searchTerm ? 'ลองเปลี่ยนคำค้นหาหรือ' : 'คลิกปุ่ม "เพิ่มรายการ" เพื่อเริ่มต้น'}
                                </p>
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="text-teal-600 hover:text-teal-700 font-medium"
                                    >
                                        ล้างการค้นหา
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal */}
            <Modal
                title={editingProduct ? "แก้ไขรายการซื้อ" : "เพิ่มรายการซื้อ"}
                isOpen={isOpen}
                onClose={handleCloseModal}
                size="lg"
            >
                <div className="space-y-6">
                    {/* Product Information Section */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-800 mb-4 pb-2 border-b border-gray-200">
                            <i className="fa-solid fa-box mr-2 text-teal-600"></i>
                            ข้อมูลสินค้า
                        </h3>
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
    type="text" // Changed from "number" to "text"
    value={price}
    onChange={(e) => setPrice(e.target.value)} // Removed the Number() conversion
    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
    placeholder="Enter price..." // Added a placeholder for better UX
    required
/>
                            </div>
                        </div>
                    </div>

                    {/* Customer Information Section */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-800 mb-4 pb-2 border-b border-gray-200">
                            <i className="fa-solid fa-user mr-2 text-teal-600"></i>
                            ข้อมูลลูกค้า
                        </h3>
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
                                    เบอร์โทรศัพท์
                                </label>
                                <input
                                    type="tel"
                                    value={customerPhone}
                                    onChange={(e) => setCustomerPhone(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    placeholder="เบอร์โทรศัพท์"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    ที่อยู่
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

                    {/* Additional Information Section */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-800 mb-4 pb-2 border-b border-gray-200">
                            <i className="fa-solid fa-info-circle mr-2 text-teal-600"></i>
                            ข้อมูลเพิ่มเติม
                        </h3>
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

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                        <button
                            onClick={handleCloseModal}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
                        >
                            ยกเลิก
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors duration-200 flex items-center"
                        >
                            <i className={`fa-solid ${editingProduct ? 'fa-save' : 'fa-plus'} mr-2`}></i>
                            {editingProduct ? 'อัปเดต' : 'บันทึก'}
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    )
}