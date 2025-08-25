'use client';

import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in');
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-accent"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary-text mb-4">
            Giriş Gerekli
          </h2>
          <p className="text-gray-600 mb-4">
            Bu sayfayı görüntülemek için giriş yapmanız gerekiyor.
          </p>
          <button
            onClick={() => router.push('/sign-in')}
            className="btn-primary"
          >
            Giriş Yap
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
