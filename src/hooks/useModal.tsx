'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';

export function useModal() {
    const [isOpen, setIsOpen] = useState(false);

    /**
     * Returns a configured modal component and state controls
     * @param title Title of the modal
     * @param redirectPath Optional path to redirect to when clicking the expand button
     */
    const getModal = (title: string, redirectPath?: string) => {
        return {
            isOpen,
            Modal: ({ children }: { children: React.ReactNode }) => (
                <Modal
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    title={title}
                    redirectPath={redirectPath}
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