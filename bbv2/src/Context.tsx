import { createContext, useState, useEffect } from 'react';
import * as sm from './StatManagement';
import { PlayerMenu, BossHpBar, BossArea, MainPage } from './MainPage';
import React from 'react';
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
    KnightMP: sm.knight_stats.get('mp'),
    setKnightMP: () => { },
});

export function KnightMPContextProvider({ children }: { children: React.ReactElement }) {
    const [KnightMP, setKnightMP] = useState(sm.knight_stats.get('mp'));

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
    DmageMP: sm.dmage_stats.get('mp'),
    setDmageMP: () => { },
})

export function DmageMPContextProvider({ children }: { children: React.ReactElement }) {
    const [DmageMP, setDmageMP] = useState(sm.dmage_stats.get('mp'));

    useEffect(() => {
        console.log('DmageMP updated:', DmageMP);
    }, [DmageMP]);

    return (
        <DmageMPContext.Provider value={{ DmageMP, setDmageMP }}>
            {children}
        </DmageMPContext.Provider>
    )
}

export interface WmageMPContextValue {
    WmageMP: number | undefined;
    setWmageMP: (value: number) => void;
}

export const WmageMPContext = createContext<WmageMPContextValue>({
    WmageMP: sm.wmage_stats.get('mp'),
    setWmageMP: () => { },
})

export function WmageMPContextProvider({ children }: { children: React.ReactElement }) {
    const [WmageMP, setWmageMP] = useState(sm.wmage_stats.get('mp'));

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
    RmageMP: sm.rmage_stats.get('mp'),
    setRmageMP: () => { },
})

export function RmageMPContextProvider({ children }: { children: React.ReactElement }) {
    const [RmageMP, setRmageMP] = useState(sm.rmage_stats.get('mp'));

    useEffect(() => {
        console.log('RmageMP updated:', RmageMP);
    }, [RmageMP]);

    return (
        <RmageMPContext.Provider value={{ RmageMP, setRmageMP }}>
            {children}
        </RmageMPContext.Provider>
    )
}

//states for HP, link them to the maps 

interface KnightHPContextValue {
    KnightHP: number | undefined;
    setKnightHP: (value: number) => void;
}

export const KnightHPContext = createContext<KnightHPContextValue>({
    KnightHP: sm.knight_stats.get('hp'),
    setKnightHP: () => { },
})

export function KnightHPContextProvider({ children }: { children: React.ReactElement }) {
    const [KnightHP, setKnightHP] = useState(sm.knight_stats.get('hp'));

    useEffect(() => {
        console.log('KnightHP updated:', KnightHP);
    }, [KnightHP]);

    return (
        <KnightHPContext.Provider value={{ KnightHP, setKnightHP }}>
            {children}
        </KnightHPContext.Provider>
    )
}

interface DmageHPContextValue {
    DmageHP: number | undefined;
    setDmageHP: (value: number) => void;
}

export const DmageHPContext = createContext<DmageHPContextValue>({
    DmageHP: sm.dmage_stats.get('hp'),
    setDmageHP: () => { },
})

export function DmageHPContextProvider({ children }: { children: React.ReactElement }) {
    const [DmageHP, setDmageHP] = useState(sm.dmage_stats.get('hp'));

    useEffect(() => {
        console.log('DmageHP updated:', DmageHP);
    }, [DmageHP]);

    return (
        <DmageHPContext.Provider value={{ DmageHP, setDmageHP }}>
            {children}
        </DmageHPContext.Provider>
    )
}
interface WmageHPContextValue {
    WmageHP: number | undefined;
    setWmageHP: (value: number) => void;
}
export const WmageHPContext = createContext<WmageHPContextValue>({
    WmageHP: sm.wmage_stats.get('hp'),
    setWmageHP: () => { },
})

export function WmageHPContextProvider({ children }: { children: React.ReactElement }) {
    const [WmageHP, setWmageHP] = useState(sm.wmage_stats.get('hp'));

    useEffect(() => {
        console.log('WmageHP updated:', WmageHP);
    }, [WmageHP]);

    return (
        <WmageHPContext.Provider value={{ WmageHP, setWmageHP }}>
            {children}
        </WmageHPContext.Provider>
    )
}

interface RmageHPContextValue {
    RmageHP: number | undefined;
    setRmageHP: (value: number) => void;
}

export const RmageHPContext = createContext<RmageHPContextValue>({
    RmageHP: sm.rmage_stats.get('hp'),
    setRmageHP: () => { },
})

export function RmageHPContextProvider({ children }: { children: React.ReactElement }) {
    const [RmageHP, setRmageHP] = useState(sm.rmage_stats.get('hp'));

    useEffect(() => {
        console.log('RmageHP updated:', RmageHP);
    }, [RmageHP]);

    return (
        <RmageHPContext.Provider value={{ RmageHP, setRmageHP }}>
            {children}
        </RmageHPContext.Provider>
    )
}
//status effects, list of strings for each character
//"dead" is treated as a status effect

interface KnightStatusContextValue {
    KnightStatus: string[];
    //allows use to use () => spread syntax for adding to the list
    setKnightStatus: React.Dispatch<React.SetStateAction<string[]>>;
}

export const KnightStatusContext = createContext<KnightStatusContextValue>({
    KnightStatus: [],
    setKnightStatus: () => { },
})

export function KnightStatusContextProvider({ children }: { children: React.ReactElement }) {
    const [KnightStatus, setKnightStatus] = useState<string[]>([]);

    useEffect(() => {
        console.log('KnightStatus updated:', KnightStatus);
    }, [KnightStatus]);

    return (
        <KnightStatusContext.Provider value={{ KnightStatus, setKnightStatus }}>
            {children}
        </KnightStatusContext.Provider>
    )
}

interface DmageStatusContextValue {
    DmageStatus: string[];
    setDmageStatus: React.Dispatch<React.SetStateAction<string[]>>;
}

export const DmageStatusContext = createContext<DmageStatusContextValue>({
    DmageStatus: [],
    setDmageStatus: () => { },
})

export function DmageStatusContextProvider({ children }: { children: React.ReactElement }) {
    const [DmageStatus, setDmageStatus] = useState<string[]>([]);

    useEffect(() => {
        console.log('DmageStatus updated:', DmageStatus);
    }, [DmageStatus]);

    return (
        <DmageStatusContext.Provider value={{ DmageStatus, setDmageStatus }}>
            {children}
        </DmageStatusContext.Provider>
    )
}

interface WmageStatusContextValue {
    WmageStatus: string[];
    setWmageStatus: React.Dispatch<React.SetStateAction<string[]>>;
}

export const WmageStatusContext = createContext<WmageStatusContextValue>({
    WmageStatus: [],
    setWmageStatus: () => { },
})

export function WmageStatusContextProvider({ children }: { children: React.ReactElement }) {
    const [WmageStatus, setWmageStatus] = useState<string[]>([]);

    useEffect(() => {
        console.log('WmageStatus updated:', WmageStatus);
    }, [WmageStatus]);

    return (
        <WmageStatusContext.Provider value={{ WmageStatus, setWmageStatus }}>
            {children}
        </WmageStatusContext.Provider>
    )
}

interface RmageStatusContextValue {
    RmageStatus: string[];
    setRmageStatus: React.Dispatch<React.SetStateAction<string[]>>;
}

export const RmageStatusContext = createContext<RmageStatusContextValue>({
    RmageStatus: [],
    setRmageStatus: () => { },
})

export function RmageStatusContextProvider({ children }: { children: React.ReactElement }) {
    const [RmageStatus, setRmageStatus] = useState<string[]>([]);

    useEffect(() => {
        console.log('RmageStatus updated:', RmageStatus);
    }, [RmageStatus]);

    return (
        <RmageStatusContext.Provider value={{ RmageStatus, setRmageStatus }}>
            {children}
        </RmageStatusContext.Provider>
    )
}

//Names

interface KnightNameContextValue {
    KnightName: string;
    setKnightName: (value: string) => void;
}

export const KnightNameContext = createContext<KnightNameContextValue>({
    KnightName: 'Knight',
    setKnightName: () => { },
})

export function KnightNameContextProvider({ children }: { children: React.ReactElement }) {
    const [KnightName, setKnightName] = useState('Knight');

    useEffect(() => {
        console.log('KnightName updated:', KnightName);
    }, [KnightName]);

    return (
        <KnightNameContext.Provider value={{ KnightName, setKnightName }}>
            {children}
        </KnightNameContext.Provider>
    )
}

interface DmageNameContextValue {
    DmageName: string;
    setDmageName: (value: string) => void;
}

export const DmageNameContext = createContext<DmageNameContextValue>({
    DmageName: 'Dark Mage',
    setDmageName: () => { },
})

export function DmageNameContextProvider({ children }: { children: React.ReactElement }) {
    const [DmageName, setDmageName] = useState('Dark Mage');

    useEffect(() => {
        console.log('DmageName updated:', DmageName);
    }, [DmageName]);

    return (
        <DmageNameContext.Provider value={{ DmageName, setDmageName }}>
            {children}
        </DmageNameContext.Provider>
    )
}

interface WmageNameContextValue {
    WmageName: string;
    setWmageName: (value: string) => void;
}

export const WmageNameContext = createContext<WmageNameContextValue>({
    WmageName: 'White Mage',
    setWmageName: () => { },
})

export function WmageNameContextProvider({ children }: { children: React.ReactElement }) {
    const [WmageName, setWmageName] = useState('White Mage');

    useEffect(() => {
        console.log('WmageName updated:', WmageName);
    }, [WmageName]);

    return (
        <WmageNameContext.Provider value={{ WmageName, setWmageName }}>
            {children}
        </WmageNameContext.Provider>
    )
}

interface RmageNameContextValue {
    RmageName: string;
    setRmageName: (value: string) => void;
}

export const RmageNameContext = createContext<RmageNameContextValue>({
    RmageName: 'Red Mage',
    setRmageName: () => { },
})

export function RmageNameContextProvider({ children }: { children: React.ReactElement }) {
    const [RmageName, setRmageName] = useState('Red Mage');

    useEffect(() => {
        console.log('RmageName updated:', RmageName);
    }, [RmageName]);

    return (
        <RmageNameContext.Provider value={{ RmageName, setRmageName }}>
            {children}
        </RmageNameContext.Provider>
    )
}