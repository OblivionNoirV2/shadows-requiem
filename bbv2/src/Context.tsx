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

export interface CurrentAttackContextValue {
    currentAttack: string;
    setCurrentAttack: (value: string) => void;
}
export const CurrentAttackContext = createContext<CurrentAttackContextValue>({
    currentAttack: '',
    setCurrentAttack: () => { },
})

export function CurrentAttackContextProvider({ children }: { children: React.ReactElement }) {
    const [currentAttack, setCurrentAttack] = useState('');

    useEffect(() => {
        console.log('CurrentAttack updated:', currentAttack);
    }, [currentAttack]);

    return (
        <CurrentAttackContext.Provider value={{ currentAttack, setCurrentAttack }}>
            {children}
        </CurrentAttackContext.Provider>
    )
}

export interface AttackMadeContextValue {
    isAttackMade: boolean;
    setIsAttackMade: (value: boolean) => void;
}

export const AttackMadeContext = createContext<AttackMadeContextValue>({
    isAttackMade: false,
    setIsAttackMade: () => { },
})

export function AttackMadeContextProvider({ children }: { children: React.ReactElement }) {
    const [isAttackMade, setIsAttackMade] = useState(false);

    useEffect(() => {
        console.log('AttackMade updated:', isAttackMade);
    }, [isAttackMade]);

    return (
        <AttackMadeContext.Provider value={{ isAttackMade, setIsAttackMade }}>
            {children}
        </AttackMadeContext.Provider>
    )
}

export interface UltimaContextValue {
    isUltima: boolean;
    setIsUltima: (value: boolean) => void;
}
export const UltimaContext = createContext<UltimaContextValue>({
    isUltima: false,
    setIsUltima: () => { },
})

export function UltimaContextProvider({ children }: { children: React.ReactElement }) {
    const [isUltima, setIsUltima] = useState(false);

    useEffect(() => {
        console.log('Ultima updated:', isUltima);
    }, [isUltima]);

    return (
        <UltimaContext.Provider value={{ isUltima, setIsUltima }}>
            {children}
        </UltimaContext.Provider>
    )
}

//states for MP, link them to the maps 

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

interface DmageMPContextValue {
    DmageMP: number | undefined;
    setDmageMP: (value: number) => void;
}

export const DmageMPContext = createContext<DmageMPContextValue>({
    DmageMP: sm.dmage_stats.get('max_mp'),
    setDmageMP: () => { },
})

export function DmageMPContextProvider({ children }: { children: React.ReactElement }) {
    const [DmageMP, setDmageMP] = useState(sm.dmage_stats.get('max_mp'));

    useEffect(() => {
        console.log('DmageMP updated:', DmageMP);
    }, [DmageMP]);

    return (
        <DmageMPContext.Provider value={{ DmageMP, setDmageMP }}>
            {children}
        </DmageMPContext.Provider>
    )
}

export interface WmageContextValue {
    WmageMP: number | undefined;
    setWmageMP: (value: number) => void;
}

export const WmageMPContext = createContext<WmageContextValue>({
    WmageMP: sm.wmage_stats.get('max_mp'),
    setWmageMP: () => { },
})

export function WmageMPContextProvider({ children }: { children: React.ReactElement }) {
    const [WmageMP, setWmageMP] = useState(sm.wmage_stats.get('max_mp'));

    useEffect(() => {
        console.log('WmageMP updated:', WmageMP);
    }, [WmageMP]);

    return (
        <WmageMPContext.Provider value={{ WmageMP, setWmageMP }}>
            {children}
        </WmageMPContext.Provider>
    )
}

export interface RmageMPContextValue {
    RmageMP: number | undefined;
    setRmageMP: (value: number) => void;
}

export const RmageMPContext = createContext<RmageMPContextValue>({
    RmageMP: sm.rmage_stats.get('max_mp'),
    setRmageMP: () => { },
})

export function RmageMPContextProvider({ children }: { children: React.ReactElement }) {
    const [RmageMP, setRmageMP] = useState(sm.rmage_stats.get('max_mp'));

    useEffect(() => {
        console.log('RmageMP updated:', RmageMP);
    }, [RmageMP]);

    return (
        <RmageMPContext.Provider value={{ RmageMP, setRmageMP }}>
            {children}
        </RmageMPContext.Provider>
    )
}