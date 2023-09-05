import { createContext, useState, useEffect, useContext } from 'react';
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


    return (
        <UltimaContext.Provider value={{ isUltima, setIsUltima }}>
            {children}
        </UltimaContext.Provider>
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

    return (
        <DmageStatusContext.Provider value={{ DmageStatus, setDmageStatus }}>
            {children}
        </DmageStatusContext.Provider>
    )
}

interface AssassinStatusContextValue {
    AssassinStatus: string[];
    setAssassinStatus: React.Dispatch<React.SetStateAction<string[]>>;
}

export const AssassinStatusContext = createContext<AssassinStatusContextValue>({
    AssassinStatus: [],
    setAssassinStatus: () => { },
})

export function AssassinStatusContextProvider({ children }: { children: React.ReactElement }) {
    const [AssassinStatus, setAssassinStatus] = useState<string[]>([]);


    return (
        <AssassinStatusContext.Provider value={{ AssassinStatus, setAssassinStatus }}>
            {children}
        </AssassinStatusContext.Provider>
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


    return (
        <DmageNameContext.Provider value={{ DmageName, setDmageName }}>
            {children}
        </DmageNameContext.Provider>
    )
}

interface AssassinNameContextValue {
    AssassinName: string;
    setAssassinName: (value: string) => void;
}

export const AssassinNameContext = createContext<AssassinNameContextValue>({
    AssassinName: 'Assassin',
    setAssassinName: () => { },
})

export function AssassinNameContextProvider({ children }: { children: React.ReactElement }) {
    const [AssassinName, setAssassinName] = useState('Assassin');


    return (
        <AssassinNameContext.Provider value={{ AssassinName, setAssassinName }}>
            {children}
        </AssassinNameContext.Provider>
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

    return (
        <RmageNameContext.Provider value={{ RmageName, setRmageName }}>
            {children}
        </RmageNameContext.Provider>
    )
}


interface BossAttackingContextValue {
    isBossAttacking: boolean;
    setIsBossAttacking: (value: boolean) => void;
}

export const BossAttackingContext = createContext<BossAttackingContextValue>({
    isBossAttacking: false,
    setIsBossAttacking: () => { }
})

export function BossAttackingContextProvider({ children }: { children: React.ReactElement }) {
    const [isBossAttacking, setIsBossAttacking] = useState(false);


    return (
        <BossAttackingContext.Provider value={{ isBossAttacking, setIsBossAttacking }}>
            {children}
        </BossAttackingContext.Provider>
    )
}
//for changing it in the victory/death screens


type valid_precip = "flake" | "confetti" | "blood"
interface PrecipTypeContextValue {
    precipType: valid_precip;
    setPrecipType: (value: valid_precip) => void
}

export const PrecipTypeContext = createContext<PrecipTypeContextValue>({
    precipType: "flake",
    setPrecipType: () => { }
})

export function PrecipTypeContextProvider({ children }: { children: React.ReactElement }) {
    const [precipType, setPrecipType] = useState<valid_precip>("flake")

    return (
        <PrecipTypeContext.Provider value={{ precipType, setPrecipType }}>
            {children}
        </PrecipTypeContext.Provider>
    )
}
export const HpMapContext = createContext<any | undefined>(undefined);

export function HpMapContextProvider({ children }: { children: React.ReactElement }) {

    const MatchToHpMap = new Map<string, any>(
        [
            ["knight", sm.knight_stats.get("hp")],
            ["dmage", sm.dmage_stats.get("hp")],
            ["assassin", sm.assassin_stats.get("hp")],
            ["rmage", sm.rmage_stats.get("hp")],
        ]
    );

    return (
        <HpMapContext.Provider value={{ MatchToHpMap }}>
            {children}
        </HpMapContext.Provider>

    )
}


export const MpMapContext = createContext<any | undefined>(undefined);

export function MpMapContextProvider({ children }: { children: React.ReactElement }) {


    const MatchToMpMap = new Map<string, number>(
        [
            ["knight", sm.knight_stats.get("mp")!],
            ["dmage", sm.dmage_stats.get("mp")!],
            ["assassin", sm.assassin_stats.get("mp")!],
            ["rmage", sm.assassin_stats.get("mp")!]
        ]
    );

    return (
        <MpMapContext.Provider value={{ MatchToMpMap }}>
            {children}
        </MpMapContext.Provider>
    )

}