'use client';
import { redirect } from 'next/navigation';
import React from 'react'
import { useAuth } from '@/features/auth/hooks/useAuth';
import ErrorCard from './ErrorCard';

export default function ErrorHandler(error: any) {
    const { checkSessionExpiration, logout } = useAuth();
    
    if (error?.status === 401 || error?.response?.status === 401 || checkSessionExpiration() || error?.message === "Unauthorized") {
        logout();
        redirect('/auth/login?logout=true');
    }

    console.log(error)
    return (
        <ErrorCard message={error?.response?.data?.message ?? "Ocurrió un error inesperado, intenta más tarde"} />
    )
}