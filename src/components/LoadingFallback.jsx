import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingFallback = () => {
    return (
        <div className="h-screen w-full flex items-center justify-center bg-[#f2f2f2] dark:bg-[#0A0A0A] text-gray-900 dark:text-white transition-colors duration-300">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                <p className="text-sm font-medium animate-pulse text-gray-500">Initializing...</p>
            </div>
        </div>
    );
};

export default LoadingFallback;
