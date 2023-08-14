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

export interface AssassinMPContextValue {
    AssassinMP: number | undefined;
    setAssassinMP: (value: number) => void;
}

export const AssassinMPContext = createContext<AssassinMPContextValue>({
    AssassinMP: sm.assassin_stats.get('mp'),
    setAssassinMP: () => { },
})

export function AssassinMPContextProvider({ children }: { children: React.ReactElement }) {
    const [AssassinMP, setAssassinMP] = useState(sm.assassin_stats.get('mp'));

    useEffect(() => {
        console.log('AssassinMP updated:', AssassinMP);
    }, [AssassinMP]);

    return (
        <AssassinMPContext.Provider value={{ AssassinMP, setAssassinMP }}>
            {children}
        </AssassinMPContext.Provider>
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
interface AssassinHPContextValue {
    AssassinHP: number | undefined;
    setAssassinHP: (value: number) => void;
}
export const AssassinHPContext = createContext<AssassinHPContextValue>({
    AssassinHP: sm.assassin_stats.get('hp'),
    setAssassinHP: () => { },
})

export function AssassinHPContextProvider({ children }: { children: React.ReactElement }) {
    const [AssassinHP, setAssassinHP] = useState(sm.assassin_stats.get('hp'));

    useEffect(() => {
        console.log('AssassinHP updated:', AssassinHP);
    }, [AssassinHP]);

    return (
        <AssassinHPContext.Provider value={{ AssassinHP, setAssassinHP }}>
            {children}
        </AssassinHPContext.Provider>
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

    useEffect(() => {
        console.log('AssassinStatus updated:', AssassinStatus);
    }, [AssassinStatus]);

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

    useEffect(() => {
        console.log('AssassinName updated:', AssassinName);
    }, [AssassinName]);

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

    useEffect(() => {
        console.log('RmageName updated:', RmageName);
    }, [RmageName]);

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

    useEffect(() => {
        console.log("is boss attacking updated", isBossAttacking)
    }, [isBossAttacking])

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

    useEffect(() => {
        console.log("precip type updated", precipType)

    }, [precipType])

    return (
        <PrecipTypeContext.Provider value={{ precipType, setPrecipType }}>
            {children}
        </PrecipTypeContext.Provider>
    )
}
export const HpMapContext = createContext<any | undefined>(undefined);

export function HpMapContextProvider({ children }: { children: React.ReactElement }) {
    const KnightHP = useContext(KnightHPContext);
    const DmageHP = useContext(DmageHPContext);
    const AssassinHP = useContext(AssassinHPContext);
    const RmageHP = useContext(RmageHPContext);

    const MatchToHpMap = new Map<string, any>(
        [
            ["knight", KnightHP],
            ["dmage", DmageHP],
            ["assassin", AssassinHP],
            ["rmage", RmageHP],
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
    const KnightMP = useContext(KnightMPContext);
    const DmageMP = useContext(DmageMPContext);
    const AssassinMP = useContext(AssassinMPContext);
    const RmageMP = useContext(RmageMPContext);


    const MatchToMpMap = new Map<string, any>(
        [
            ["knight", KnightMP],
            ["dmage", DmageMP],
            ["assassin", AssassinMP],
            ["rmage", RmageMP]

        ]
    );

    return (
        <MpMapContext.Provider value={{ MatchToMpMap }}>
            {children}
        </MpMapContext.Provider>
    )

}