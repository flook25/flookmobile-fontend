'use client';

import React from 'react';

// A simple white box for holding content, with consistent padding, borders, and shadows.
const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
    return (
        <div className={`bg-white rounded-lg border border-gray-200 p-6 shadow-sm ${className}`}>
            {children}
        </div>
    );
};

export default Card;