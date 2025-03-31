'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';

export function useModal() {
    const [isOpen, setIsOpen] = useState(false);

    /**
     * Returns a configured modal component and state controls
     * @param title Title of the modal
     */
    const getModal = (title: string) => {
        return {
            isOpen,
            Modal: ({ children }: { children: React.ReactNode }) => (
                <Modal
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    title={title}
                >
                    {children}
                </Modal>
            )
        };
    };

    return {
        getModal,
        isOpen,
        setIsOpen,
    };
} 