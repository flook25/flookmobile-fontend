'use client';

import React from 'react';

// This component wraps every page to give it the consistent background and layout.
const PageWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {children}
            </div>
        </div>
    );
};

export default PageWrapper;