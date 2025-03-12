"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export function useAuth() {
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    // If no token and trying to access protected route
    if (!token && pathname.startsWith('/dashboard')) {
      router.push('/login');
    }
    
    async function verifyToken() {
      try {
        const response = await fetch('http://localhost:8000/auth/verify-token', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) {
          localStorage.removeItem('token');
          router.push('/login');
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        router.push('/login');
      }
    }
    if (token) verifyToken();
    
  }, [pathname, router]);
}