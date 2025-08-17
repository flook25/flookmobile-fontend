// sidebar.tsx

import Link from "next/link";

export default function Sidebar() {
    return (
        <div className="bg-teal-400 h-screen w-64">
            <div className="p-5 bg-teal-800 text-white">
                <h1 className="font-bold">
                    FlookMobile Version 1.0
                </h1>
            </div>

            <div className="p-5 text-white text-xl flex flex-col gap-2">
                {/* 
                แต่ละเมนูจะถูกครอบด้วย div ของตัวเอง
                เพื่อให้ยืดหยุ่นในการเพิ่ม Badge หรือองค์ประกอบอื่นๆ ในอนาคต
                 */}
                <div>
                    <Link
                        href="/backoffice/dashboard"
                        className="flex items-center p-2 rounded-md transition-colors duration-200 hover:bg-teal-500"
                    >
                        <i className="fa fa-tachometer-alt w-6 text-center mr-3"></i>
                        <span>Dashboard</span>
                    </Link>
                </div>

                <div>
                    <Link
                        href="/backoffice/buy"
                        className="flex items-center p-2 rounded-md transition-colors duration-200 hover:bg-teal-500"
                    >
                        {/* เปลี่ยนไอคอนให้สื่อความหมายมากขึ้น */}
                        <i className="fa fa-shopping-cart w-6 text-center mr-3"></i>
                        <span>ซื้อสินค้า</span>
                    </Link>
                </div>

                <div>
                    <Link
                        href="/backoffice/sell"
                        className="flex items-center p-2 rounded-md transition-colors duration-200 hover:bg-teal-500"
                    >
                        {/* เปลี่ยนไอคอนให้สื่อความหมายมากขึ้น */}
                        <i className="fa fa-tag w-6 text-center mr-3"></i>
                        <span>ขายสินค้า</span>
                    </Link>
                </div>


                <div>
                    <Link
                        href="/backoffice/repair"
                        className="flex items-center p-2 rounded-md transition-colors duration-200 hover:bg-teal-500"
                    >
                        {/* ไอคอนรูปประแจ สื่อถึงการซ่อมแซม */}
                        <i className="fa fa-wrench w-6 text-center mr-3"></i>
                        <span>ซ่อมสินค้า</span>
                    </Link>
                </div>

                <div>
                    <Link
                        href="/backoffice/company"
                        className="flex items-center p-2 rounded-md transition-colors duration-200 hover:bg-teal-500"
                    >
                        {/* เปลี่ยนไอคอนให้ไม่ซ้ำและสื่อถึงร้านค้า */}
                        <i className="fa fa-store w-6 text-center mr-3"></i>
                        <span>ข้อมูลร้าน</span>
                    </Link>
                </div>

                <div>
                    <Link
                        href="/backoffice/users"  // หรือ path อื่นๆ ที่ต้องการ
                        className="flex items-center p-2 rounded-md transition-colors duration-200 hover:bg-teal-500"
                    >
                        {/* ไอคอนรูปกลุ่มคน สื่อถึงผู้ใช้งานหลายคน */}
                        <i className="fa fa-users w-6 text-center mr-3"></i>
                        <span>ผู้ใช้งาน</span>
                    </Link>
                </div>

            </div>


        </div>
    )
}