'use client';

import { useEffect, useRef } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { useCartStore } from '../stores/cart.store';

export function useSyncCartWithAuth() {
  const { isSignedIn, isLoaded, user } = useUser();
  const { getToken } = useAuth();
  const { loadCart, resetCart, mergeGuestCartToUser, initializeGuestCart } = useCartStore();
  const mergedRef = useRef(false);
  const retryTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Initialize guest cart on mount
    initializeGuestCart();
    
    let cancelled = false;
    const sync = async () => {
      if (!isLoaded) {
        console.debug('[useSyncCartWithAuth] Clerk not loaded yet, skipping this tick');
        return; // wait for Clerk to be ready
      }

      const userId = user?.id;
      const storage = typeof window !== 'undefined' ? window.localStorage : undefined;

      if (isSignedIn && userId) {
        console.debug('[useSyncCartWithAuth] Signed in detected', { userId });
        // User-based idempotency flag and lock
        const mergedFor = storage?.getItem('merged_for_user_id');
        if (mergedFor === userId) {
          // Already merged for this user; just load from server
          console.debug('[useSyncCartWithAuth] Already merged for this user, loading server cart');
          const token = await getToken();
          if (token && !cancelled) await loadCart(token);
          return;
        }

        // Acquire simple lock to avoid multi-tab duplicate merges
        const lock = storage?.getItem('guest_merge_lock');
        if (!lock) {
          storage?.setItem('guest_merge_lock', JSON.stringify({ userId, ts: Date.now() }));
          console.debug('[useSyncCartWithAuth] Acquired guest_merge_lock');
        } else {
          console.debug('[useSyncCartWithAuth] guest_merge_lock already present, proceeding anyway');
        }

        // Retry getToken with backoff
        let token: string | null = null;
        for (let attempt = 0; attempt < 5; attempt++) {
          token = await getToken();
          if (!token) console.debug('[useSyncCartWithAuth] getToken attempt failed', { attempt });
          if (token) break;
          await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 100));
        }
        if (cancelled) return;
        if (!token) {
          // Could not get token; schedule another attempt shortly and keep guest cart visible
          console.warn('[useSyncCartWithAuth] Could not obtain token after retries, scheduling retry');
          if (!retryTimerRef.current) {
            retryTimerRef.current = setTimeout(() => {
              retryTimerRef.current = null;
              // fire and forget
              sync();
            }, 1500);
          }
          return;
        }

        try {
          if (!mergedRef.current) {
            console.debug('[useSyncCartWithAuth] Starting mergeGuestCartToUser');
            await mergeGuestCartToUser(token);
            mergedRef.current = true;
            storage?.setItem('merged_for_user_id', userId);
            console.debug('[useSyncCartWithAuth] Merge complete, flag set for user');
          }
          console.debug('[useSyncCartWithAuth] Loading server cart after merge');
          await loadCart(token);
        } finally {
          console.debug('[useSyncCartWithAuth] Releasing guest_merge_lock');
          storage?.removeItem('guest_merge_lock');
        }
      } else {
        // Signed out: reset to guest cart
        console.debug('[useSyncCartWithAuth] Signed out detected, resetting to guest cart');
        mergedRef.current = false;
        resetCart();
        await loadCart(undefined);
      }
    };
    sync();
    return () => {
      cancelled = true;
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
    };
  }, [isSignedIn, isLoaded, user, getToken, loadCart, resetCart, mergeGuestCartToUser, initializeGuestCart]);
}


