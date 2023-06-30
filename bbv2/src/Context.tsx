import { createContext, useState, useEffect } from 'react';
import * as sm from './StatManagement';
import { PlayerMenu, BossHpBar, BossArea, MainPage } from './MainPage';

interface BossContextValue {
    BossHP: number | undefined;
    setBossHP: (value: number) => void;
}

export const BossContext = createContext<BossContextValue>({
    BossHP: sm.boss_stats.get('max_hp'),
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
//global message updating
interface MessageContextValue {
    message: string;
    setMessage: (value: string) => void;
}

export const MessageContext = createContext<MessageContextValue>({
    message: '',
    setMessage: () => { },
})

export function MessageContextProvider({ children }: { children: React.ReactElement }) {
    const [message, setMessage] = useState('');

    useEffect(() => {
        console.log('Message updated:', message);
    }, [message]);

    return (
        <MessageContext.Provider value={{ message, setMessage }}>
            {children}
        </MessageContext.Provider>
    )
}

interface AttackShownContextValue {
    isAttackAreaShown: boolean;
    setIsAttackAreaShown: (value: boolean) => void;
}

export const AttackShownContext = createContext<AttackShownContextValue>({
    isAttackAreaShown: false,
    setIsAttackAreaShown: () => { },
})

export function AttackShownContextProvider({ children }: { children: React.ReactElement }) {
    const [isAttackAreaShown, setIsAttackAreaShown] = useState(false);

    useEffect(() => {
        console.log('AttackShown updated:', isAttackAreaShown);
    }, [isAttackAreaShown]);

    return (
        <AttackShownContext.Provider value={{ isAttackAreaShown, setIsAttackAreaShown }}>
            {children}
        </AttackShownContext.Provider>
    )
}
//states for MP 

interface KnightMPContextValue {
    KnightMP: number | undefined;
    setKnightMP: (value: number) => void;
}

export const KnightMPContext = createContext<KnightMPContextValue>({
    KnightMP: sm.knight_stats.get('max_mp'),
    setKnightMP: () => { },
});

export function KnightMPContextProvider({ children }: { children: React.ReactElement }) {
    const [KnightMP, setKnightMP] = useState(sm.knight_stats.get('max_mp'));

    useEffect(() => {
        console.log('KnightMP updated:', KnightMP);
    }, [KnightMP]);

    return (
        <KnightMPContext.Provider value={{ KnightMP, setKnightMP }}>
            {children}
        </KnightMPContext.Provider>
    )
}



