'use client';

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import axios from "axios";
import { config } from "../../config"; // Verify the path is correct

// Interface for data from the API
interface SellItem {
    id: string; // MongoDB ID is a string
    price: number;
    createdAt: string;
    product: {
        serial: string;
        name: string;
    };
}

export default function Page() {
    const router = useRouter();
    const [serial, setSerial] = useState('');
    const [price, setPrice] = useState('');
    const [sells, setSells] = useState<SellItem[]>([]);
    const [totalAmount, setTotalAmount] = useState(0);

    // --- State Management for UX ---
    const [isLoading, setIsLoading] = useState(true); // For initial data loading
    const [isSaving, setIsSaving] = useState(false); // To disable button on save
    const [isConfirming, setIsConfirming] = useState(false); // To disable button on confirm

    const serialInputRef = useRef<HTMLInputElement>(null); // To focus the input field

    // --- Data Fetching ---
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await axios.get<SellItem[]>(`${config.apiUrl}/sell/list`);
            const fetchedSells = response.data;
            setSells(fetchedSells);

            // Recalculate total amount
            const total = fetchedSells.reduce((sum, item) => sum + item.price, 0);
            setTotalAmount(total);
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Could not load data',
                text: error.response?.data?.message || error.message
            });
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // --- Event Handlers ---
    const handleSave = async () => {
        if (!serial.trim() || !price) {
            Swal.fire('Incomplete Information', 'Please enter both Serial and Price.', 'warning');
            return;
        }
        const numericPrice = Number(price);
        if (isNaN(numericPrice) || numericPrice <= 0) {
            Swal.fire('Invalid Price', 'Please enter a price greater than 0.', 'warning');
            return;
        }

        setIsSaving(true);
        try {
            const payload = { serial: serial.trim(), price: numericPrice };
            await axios.post(`${config.apiUrl}/sell/create`, payload);
            setSerial('');
            setPrice('');
            await fetchData();
            serialInputRef.current?.focus(); // UX Improvement: Focus input for next entry
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Could not save the data.'
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "This action cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`${config.apiUrl}/sell/remove/${id}`);
                await fetchData();
            } catch (error: any) {
                Swal.fire({
                    icon: 'error',
                    title: 'Deletion Failed',
                    text: error.response?.data?.message || error.message
                });
            }
        }
    };

    const handleConfirm = async () => {
        if (sells.length === 0) {
            Swal.fire('No items to sell', 'Please add items to the list before confirming.', 'info');
            return;
        }

        const result = await Swal.fire({
            title: 'Confirm Sale',
            html: `Confirm the sale of <b>${sells.length}</b> items for a total of <b>${totalAmount.toLocaleString()}</b> Baht?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            setIsConfirming(true);
            try {
                await axios.post(`${config.apiUrl}/sell/confirm`);
                Swal.fire('Success!', 'The sale has been confirmed.', 'success');
                await fetchData(); // Refresh data, which should now be empty
            } catch (error: any) {
                Swal.fire({
                    icon: 'error',
                    title: 'Confirmation Failed',
                    text: error.response?.data?.message || error.message
                });
            } finally {
                setIsConfirming(false);
            }
        }
    };

    // UX Improvement: Allow 'Enter' key to save
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSave();
        }
    };

    return (
        <div className="p-4 md:p-6">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Sell Products</h1>
                <button className="btn btn-outline mt-2 md:mt-0" onClick={() => router.push('/backoffice/sell/history')}>
                    <i className="fa-solid fa-file-alt mr-2"></i>
                    Sales History
                </button>
            </header>

            {/* --- Input Form --- */}
            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                 <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    <div className="md:col-span-2">
                        <label htmlFor="serial" className="block text-sm font-medium text-gray-700">Serial</label>
                        <input
                            id="serial"
                            type="text"
                            ref={serialInputRef}
                            value={serial}
                            onChange={(e) => setSerial(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="input-form"
                            placeholder="Enter product serial"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                        <input
                            id="price"
                            type="number"
                            className="input-form text-right"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="0.00"
                        />
                    </div>
                    <div className="md:col-span-1">
                        <button className="btn w-full flex items-center justify-center" onClick={handleSave} disabled={isSaving}>
                            {isSaving ? (
                                <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                            ) : (
                                <i className="fa-solid fa-plus mr-2"></i>
                            )}
                            {isSaving ? 'Adding...' : 'Add Item'}
                        </button>
                    </div>
                </div>
            </div>

            {/* --- Sales Table --- */}
            <div className="bg-white p-4 rounded-lg shadow-md">
                {isLoading ? (
                    <div className="text-center py-10">
                        <i className="fa-solid fa-spinner fa-spin text-2xl text-gray-500"></i>
                        <p>Loading items...</p>
                    </div>
                ) : sells.length > 0 ? (
                    <>
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th className="text-left">Serial</th>
                                    <th className="text-left">Product Name</th>
                                    <th className="text-right">Price</th>
                                    <th className="w-[50px]">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sells.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td>{item.product.serial}</td>
                                        <td>{item.product.name}</td>
                                        <td className="text-right">{item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                        <td className="text-center">
                                            <button className="btn-delete" onClick={() => handleDelete(item.id)}>
                                                <i className="fa-solid fa-trash-alt"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* --- Summary and Confirmation --- */}
                        <div className="mt-6 border-t pt-4">
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-lg font-medium text-gray-600">Total Amount</span>
                                <div className="text-xl font-bold bg-gray-200 text-gray-800 px-4 py-2 rounded-md">
                                    {totalAmount.toLocaleString('en-US', { style: 'currency', currency: 'THB' })}
                                </div>
                            </div>
                            <div className="text-center">
                                <button className="btn btn-primary" onClick={handleConfirm} disabled={isConfirming}>
                                    {isConfirming ? (
                                        <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                                    ) : (
                                        <i className="fa-solid fa-check mr-2"></i>
                                    )}
                                    {isConfirming ? 'Confirming...' : 'Confirm Sale'}
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-10 text-gray-500">
                        <i className="fa-solid fa-shopping-cart text-4xl mb-3"></i>
                        <h3 className="text-lg font-semibold">No Items in the List</h3>
                        <p>Use the form above to add products to the sale.</p>
                    </div>
                )}
            </div>
        </div>
    );
}