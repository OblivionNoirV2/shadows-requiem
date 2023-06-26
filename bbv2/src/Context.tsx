import { createContext, useState, useEffect } from 'react';
import * as sm from './StatManagement';
import { PlayerMenu, BossHpBar, BossArea, MainPage } from './MainPage';

interface BossContextValue {
    BossHP: number;
    setBossHP: (value: number) => void;
}

export const BossContext = createContext<BossContextValue>({
    BossHP: sm.boss_stats.hp,
    setBossHP: () => { },
});

export function BossContextProvider({ children }: { children: React.ReactElement }) {
    const [BossHP, setBossHP] = useState(999999);

    useEffect(() => {
        console.log('BossHP updated:', BossHP);
    }, [BossHP]);

    return (
        <BossContext.Provider value={{ BossHP, setBossHP }}>
            {children}
        </BossContext.Provider>
    )
}
/*turn number management*/
interface TurnNumberContextValue {
    TurnNumber: number;
    setTurnNumber: (value: number) => void;
}

export const TurnNumberContext = createContext<TurnNumberContextValue>({
    TurnNumber: 1,
    setTurnNumber: () => { },
})

export function TurnNumberContextProvider({ children }: { children: React.ReactElement }) {
    const [TurnNumber, setTurnNumber] = useState(1);

    useEffect(() => {
        console.log('TurnNumber updated:', TurnNumber);
    }, [TurnNumber]);

    return (
        <TurnNumberContext.Provider value={{ TurnNumber, setTurnNumber }}>
            {children}
        </TurnNumberContext.Provider>
    )
}


//states for MP 

interface KnightMPContextValue {
    KnightMP: number;
    setKnightMP: (value: number) => void;
}

export const KnightMPContext = createContext<KnightMPContextValue>({
    KnightMP: sm.knight_stats.mp,
    setKnightMP: () => { },
});

export function KnightMPContextProvider({ children }: { children: React.ReactElement }) {
    const [KnightMP, setKnightMP] = useState(180);

    useEffect(() => {
        console.log('KnightMP updated:', KnightMP);
    }, [KnightMP]);

    return (
        <KnightMPContext.Provider value={{ KnightMP, setKnightMP }}>
            {children}
        </KnightMPContext.Provider>
    )
}



