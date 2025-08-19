'use client';

import React from 'react';

interface PageHeaderProps {
    title: string;
    subtitle: string;
    action?: React.ReactNode; // The 'action' prop can be any component, like a button
}

// The main header for each page, with a title, subtitle, and an optional action button.
const PageHeader = ({ title, subtitle, action }: PageHeaderProps) => {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{title}</h1>
                    <p className="text-gray-600">{subtitle}</p>
                </div>
                {action && <div>{action}</div>}
            </div>
        </div>
    );
};

export default PageHeader;