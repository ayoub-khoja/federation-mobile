"use client";

import React from 'react';
import Toast from './Toast';
import { ToastData } from '../../hooks/useToast';

interface ToastContainerProps {
  toasts: ToastData[];
  onRemoveToast: (id: string) => void;
}

export default function ToastContainer({ toasts, onRemoveToast }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{ 
            animationDelay: `${index * 100}ms`,
            transform: `translateY(${index * 10}px)`
          }}
        >
          <Toast
            message={toast.message}
            type={toast.type}
            isVisible={true}
            onClose={() => onRemoveToast(toast.id)}
            duration={0} // Géré par le hook
          />
        </div>
      ))}
    </div>
  );
}












