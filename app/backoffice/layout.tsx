// Layout.tsx
import Sidebar from "./sidebar"



export default function BackofficeLayout({ children }:
    { children: React.ReactNode }) {
    return (
        <div className="flex">
            <Sidebar />

            <div className="flex-1 ml-64 p-5 bg-gray-200 min-h-screen transition-all duration-300 ease-in-out">
                <div className="bg-white p-5 rounded-lg shadow-lg shadow-gray-500">
                    {children}
                </div>
            </div>
        </div>
    )
}