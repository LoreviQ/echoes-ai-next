"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ImagePreviewContextType {
    openPreview: (src: string) => void;
    setIsOpen: (isOpen: boolean) => void;
}

const ImagePreviewContext = createContext<ImagePreviewContextType | null>(null);

export function ImagePreviewProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [imageSrc, setImageSrc] = useState<string>('');

    const openPreview = (src: string) => {
        setImageSrc(src);
        setIsOpen(true);
    };

    return (
        <ImagePreviewContext.Provider value={{ openPreview, setIsOpen }}>
            {children}
            {isOpen && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="fixed top-4 right-4 bg-black/50 rounded-full p-2 text-zinc-400 hover:text-white z-[60]"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <div className="relative max-h-[90vh] max-w-[90vw]">
                        <img
                            src={imageSrc}
                            alt="Preview"
                            className="max-h-[90vh] max-w-[90vw] object-contain"
                        />
                    </div>
                </div>
            )}
        </ImagePreviewContext.Provider>
    );
}

export function useImagePreview() {
    const context = useContext(ImagePreviewContext);
    if (!context) {
        throw new Error('useImagePreview must be used within an ImagePreviewProvider');
    }
    return context;
} 