import { createContext, useState } from 'react';
import * as sm from './StatManagement';

//used for the boss hp bar

interface BossContextValue {
    BossHP: number;
    setBossHP: (hp: number) => void;
}

// Initialize the context with that type
export const BossContext = createContext<BossContextValue | undefined>(undefined);
