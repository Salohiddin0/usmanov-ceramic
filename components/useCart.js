'use client';
import { useSyncExternalStore } from 'react';
import { getCart, subscribe } from '@/lib/cart';

const EMPTY = [];

export default function useCart() {
  return useSyncExternalStore(subscribe, getCart, () => EMPTY);
}
