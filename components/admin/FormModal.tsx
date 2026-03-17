'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface FormModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export default function FormModal({ open, onClose, title, children }: FormModalProps) {
    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                    />

                    {/* Slide-over panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-lg bg-bg-secondary border-l border-border overflow-y-auto"
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-bg-secondary/95 backdrop-blur-sm border-b border-border px-6 py-4 flex items-center justify-between z-10">
                            <h2 className="text-lg font-body font-medium text-text-primary">
                                {title}
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-1.5 rounded-md hover:bg-bg-elevated text-text-secondary transition-colors"
                                aria-label="Close"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6">{children}</div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
