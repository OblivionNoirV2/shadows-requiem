import React, { useState, useRef, useEffect, createContext, useContext, Dispatch, SetStateAction } from 'react';
import { Link } from 'react-router-dom';
import * as sm from './StatManagement';
import * as iv from './Inventory';
import * as pa from './PlayerActions';
import * as sfx from './sfxManagement';
import * as e from './Encyclopedia';
import YouDied from './YouDied';
import { BossContext } from './Context';
import {
    TurnNumberContext,
    MessageContext,
    AttackShownContext,
    CurrentAttackContext,
    AttackMadeContext,
    UltimaContext,
    KnightMPContext,
    DmageMPContext,
    WmageMPContext,
    RmageMPContext,
    KnightHPContext,
    DmageHPContext,
    WmageHPContext,
    RmageHPContext,
    KnightStatusContext,
    DmageStatusContext,
    WmageStatusContext,
    RmageStatusContext,
    KnightNameContext,
    DmageNameContext,
    WmageNameContext,
    RmageNameContext,
    BossAttackingContext,
    PrecipTypeContext
} from './Context';
import { RNGResult } from './PlayerActions';

import { selected_difficulty } from './StartMenu';
import knightbg from './assets/images/bg-and-effects/knightultimabg.png';
import dmagebg from './assets/images/bg-and-effects/dmageultimabg.png';
import wmagebg from './assets/images/bg-and-effects/wmageultimabg.png';
import rmagebg from './assets/images/bg-and-effects/rmageultimabg.png';
import defaultbg from './assets/images/bg-and-effects/battlebgv3.png';
import { bossAttackAlgo, BossAttackArea, last_boss_attacks } from './BossAlgorithm';
import knight_icon from './assets/images/player/sprites/knight.png';
import dmage_icon from './assets/images/player/sprites/dmage.png';
import wmage_icon from './assets/images/player/sprites/wmage.png';
import rmage_icon from './assets/images/player/sprites/rmage.png';
import dead_icon from './assets/images/icons/dead.png';
import { prev_dmg } from './BossAlgorithm';
import { Occurences } from './victory';
import heartbeat from './assets/sound/sfx/heartbeatlouder.wav';
import { kill } from 'process';


interface MenuProps {
    current_player: string;
}
interface AttackList {
    [key: string]: string[];
}
interface ItemList {
    [key: string]: number[];
}
//match keywords to the lists above
const player_attacks: AttackList = {
    knight: e.knight_attacks,
    dmage: e.dmage_attacks,
    wmage: e.wmage_attacks,
    rmage: e.rmage_attacks
};


//can use player to retrieve the attacks just like in the below components
interface BossAreaProps {
    selectedCharacter: string | null;
    setSelectedCharacter: (value: string | null) => void
    bossStage: number;
    setBossStage: any;

}
let hb = new Audio(heartbeat)




export const BossArea: React.FC<BossAreaProps> = ({
    selectedCharacter, setSelectedCharacter, bossStage, setBossStage }) => {
    //just in case
    const { precipType, setPrecipType } = useContext(PrecipTypeContext)
    useEffect(() => {
        setPrecipType("flake")

    }, [])

    const { TurnNumber, setTurnNumber } = useContext(TurnNumberContext);
    const { KnightStatus, setKnightStatus } = useContext(KnightStatusContext);
    const { DmageStatus, setDmageStatus } = useContext(DmageStatusContext);
    const { WmageStatus, setWmageStatus } = useContext(WmageStatusContext);
    const { RmageStatus, setRmageStatus } = useContext(RmageStatusContext);

    const { KnightMP, setKnightMP } = useContext(KnightMPContext);
    const { DmageMP, setDmageMP } = useContext(DmageMPContext);
    const { WmageMP, setWmageMP } = useContext(WmageMPContext);
    const { RmageMP, setRmageMP } = useContext(RmageMPContext);

    const { KnightHP, setKnightHP } = useContext(KnightHPContext);
    const { DmageHP, setDmageHP } = useContext(DmageHPContext);
    const { WmageHP, setWmageHP } = useContext(WmageHPContext);
    const { RmageHP, setRmageHP } = useContext(RmageHPContext);

    const { isBossAttacking, setIsBossAttacking } = useContext(BossAttackingContext)
    //match returned target to their statuses, for status effects
    const IndexToStatus: Map<number, string[]> = new Map(
        [

        ]
    )
    //lock player menus while boss is attacking
    useEffect(() => {
        //if it's an even turn, the boss attacks
        //chance of him attacking will be higher each stage
        //something like 70% -> 80% -> 90%
        console.log("boss attack")
        if (TurnNumber % 2 === 0) {
            setIsBossAttacking(true)
            setSelectedCharacter(null); //Prevents being able to use 
            //the menu if the character that died was previously
            // selected
            //If the chosen attack(returned) has a chance to inflict
            //a status effect, do that here
            const boss_return = bossAttackAlgo({
                phase: bossStage,
                knight_status: KnightStatus,
                dmage_status: DmageStatus,
                wmage_status: WmageStatus,
                rmage_status: RmageStatus,
                knight_hp: KnightHP!,
                dmage_hp: DmageHP!,
                wmage_hp: WmageHP!,
                rmage_hp: RmageHP!,
                knight_mp: KnightMP!,
                dmage_mp: DmageMP!,
                wmage_mp: WmageMP!,
                rmage_mp: RmageMP!,
                current_turn: TurnNumber,
            });
            console.log("boss return", boss_return)
            //special cases. Any stat lowering is done in the attack algo
            console.log("last attacks", boss_return.last_boss_attacks[last_boss_attacks.length - 1])
            //this is by index
            console.log("final targets", boss_return.final_targets)
            switch (boss_return.last_boss_attacks[last_boss_attacks.length - 1]) {
                case "Devourment":
                    //heal boss by prev dmg * 2
                    sm.boss_stats.set("hp", sm.boss_stats.get("hp")! +
                        (prev_dmg[prev_dmg.length - 1] * 2))
                    console.log("in dev switch")
                    console.log("prev dmg dev", prev_dmg[prev_dmg.length - 1])

                    break;
                case "Frozen Soul": //each of these is a 20% chance
                    //chance of freeze
                    break;
                case "Unending Grudge":
                    //chance of poison
                    break;
                case "Death's Touch":
                    //chance of curse
                    break;
                case "Unholy Symphony"://chance of curse to all
                    break;
                default:
                    console.log("no special attacks used")
                    break;
            }
        }
    }, [TurnNumber]);

    const PlayerStatuses: Map<string, string[]> = new Map
        (
            [
                ["knight", KnightStatus],
                ["dmage", DmageStatus],
                ["wmage", WmageStatus],
                ["rmage", RmageStatus]
            ]
        )
    const PlayerSetStatuses: Map<string,
        React.Dispatch<React.SetStateAction<string[]>>> = new Map
            (
                [
                    ["knight", setKnightStatus],
                    ["dmage", setDmageStatus],
                    ["wmage", setWmageStatus],
                    ["rmage", setRmageStatus]
                ]
            )


    //control dead and revive status
    function HandleDeath(character: string, killed_or_revived: string) {
        const setStatus = PlayerSetStatuses.get(character);
        const status = PlayerStatuses.get(character);

        if (killed_or_revived === "killed") {
            if (!status!.includes("dead")) {
                setStatus!(prev => [...prev, "dead"]);
                Occurences.set("death", (Occurences.get("death")! + 1));
            }
        } else {
            //remove dead, since this means they were revived
            setStatus!(prevStatus => prevStatus.filter(status => status !== "dead"));
        }

        console.log(`${character} status`, status);
    }

    //keep track of the last hp. If it was previously 0 then it changes, 
    //it's a revive because dead characters do not get targeted in any way
    //except for revives
    const [lastKnightHP, setLastKnightHP] = useState<number>();
    const [lastDmageHP, setLastDmageHP] = useState<number>();
    const [lastWmageHP, setLastWmageHP] = useState<number>();
    const [lastRmageHP, setLastRmageHP] = useState<number>();

    useEffect(() => {
        let khp = parseInt(sm.knight_stats.get("hp")!.toFixed(0));
        if (khp <= 0) {
            //prevent negatives
            setKnightHP(0)
            HandleDeath("knight", "killed");
        } else {
            setKnightHP(khp);
        }

        setLastKnightHP(khp);

    }, [sm.knight_stats.get("hp")])

    useEffect(() => {
        if (lastKnightHP === 0 && KnightHP! > 0) {
            HandleDeath("knight", "revived");
        }

    }, [lastKnightHP])


    useEffect(() => {
        let kmp = parseInt(sm.knight_stats.get("mp")!.toFixed(0));
        if (kmp <= 0) {
            setKnightMP(0);
        } else {
            setKnightMP(kmp)
        }

        setKnightMP(kmp);
    }, [sm.knight_stats.get("mp")])

    useEffect(() => {
        let dhp = parseInt(sm.dmage_stats.get("hp")!.toFixed(0));
        if (dhp <= 0) {
            setDmageHP(0);
            HandleDeath("dmage", "killed");
        } else {
            setDmageHP(dhp)
        }

        setLastDmageHP(dhp);
    }, [sm.dmage_stats.get("hp")])

    useEffect(() => {
        if (lastDmageHP === 0 && DmageHP! > 0) {
            HandleDeath("dmage", "revived");
        }
    }, [lastDmageHP])


    useEffect(() => {
        let dmp = parseInt(sm.dmage_stats.get("mp")!.toFixed(0));
        if (dmp <= 0) {
            setDmageMP(0);
        } else {
            setDmageMP(dmp);

        }
    }, [sm.dmage_stats.get("mp")])

    useEffect(() => {
        let whp = parseInt(sm.wmage_stats.get("hp")!.toFixed(0));
        if (whp <= 0) {
            setWmageHP(0);
            HandleDeath("wmage", "killed");
        } else {
            setWmageHP(whp);
        }
        setLastWmageHP(whp)

    }, [sm.wmage_stats.get("hp")])

    useEffect(() => {
        if (lastWmageHP === 0 && WmageHP! > 0) {
            HandleDeath("wmage", "revived");
        }
    }, [lastWmageHP])


    useEffect(() => {
        let wmp = parseInt(sm.wmage_stats.get("mp")!.toFixed(0));
        if (wmp <= 0) {
            setWmageMP(0);
        } else {
            setWmageMP(wmp);

        }

    }, [sm.wmage_stats.get("mp")])

    useEffect(() => {
        let rhp = parseInt(sm.rmage_stats.get("hp")!.toFixed(0));
        if (rhp <= 0) {
            setRmageHP(0);
            HandleDeath("rmage", "killed");
        } else {
            setRmageHP(rhp);

        }
        setLastRmageHP(rhp)
    }, [sm.rmage_stats.get("hp")])

    useEffect(() => {
        if (lastRmageHP === 0 && RmageHP! > 0) {
            HandleDeath("rmage", "revived");
        }
    }, [lastRmageHP])

    useEffect(() => {
        let rmp = parseInt(sm.rmage_stats.get("mp")!.toFixed(0));
        if (rmp <= 0) {
            setRmageMP(0);
        } else {
            setRmageMP(rmp);
        }

    }, [sm.rmage_stats.get("mp")])

    console.log("rendered bossarea")
    useEffect(() => {
        let boss_hp = sm.boss_stats.get("hp")!
        console.log("boss stage updated", selected_difficulty)
        if (boss_hp >= 468000) {
            setBossStage(1); //60%
        } else if (boss_hp >= 195000 && boss_hp < 467999) {
            setBossStage(2);
        } else {
            setBossStage(3); //25%
        }
    }, [sm.boss_stats.get("hp")]);
    //update the boss stage based on the hp value

    const [isSFXTriggered, setIsSFXTriggered] = useState(false)

    useEffect(() => {
        if (bossStage === 2) {
            //Boss gets further buffed or debuffed based on difficulty
            //when attacking using the multipliers
            sm.boss_stats.set('m_def', 1.25);
            sm.boss_stats.set('p-def', 1.25);
            sm.boss_stats.set('atk', 1.10);
        } else if (bossStage === 3) {
            sm.boss_stats.set('m_def', 1.50);
            sm.boss_stats.set('p-def', 1.50);
            sm.boss_stats.set('atk', 1.20);
            document.body.style.backgroundImage = "none"
            document.body.style.backgroundColor = "black"
            //prevent duplicate audios
            if (!isSFXTriggered) {
                hb.play();//heartbeat sfx
                hb.loop = true;
            } else {
                setIsSFXTriggered(true)
                hb.pause()
                hb.currentTime = 0;

            }
        }
        //Both, because if the boss stage hasn't changed during dev 
        //it won't update otherwise
    }, [[], bossStage]);

    //have to specify exact paths because of how webpack works
    const boss_images = [
        require('./assets/images/boss/sprites/phase1v4.png'),
        require('./assets/images/boss/sprites/phase2v3.png'),
        require('./assets/images/boss/sprites/phase3v2.png')
    ];
    const boss_labels = [
        "The Fallen King",
        "Corrupted Shade of the King",
        "True Form of the Fallen"
    ];

    return (
        <main className='boss-container flex flex-col mt-48
        mr-[40rem]
        '>
            <section className='flex flex-col items-center w-[56rem]
             relative'>
                <img
                    src={boss_images[bossStage - 1]}
                    className='boss-sprite opacity-95'
                    alt={`boss phase ${bossStage}`}
                />
                <strong>
                    <div className='flex justify-center relative mt-8
                     z-10 
                    text-4xl
                       text-white stage-label'>
                        {boss_labels[bossStage - 1]}
                    </div>
                </strong>
                <BossHpBar />
            </section>
        </main>
    );
}


export const BossHpBar = () => {
    return (
        <progress className={
            'block h-8 glow-ani-border-black boss-prog w-full'
        }
            value={sm.boss_stats.get("hp")} max={sm.boss_stats.get("max_hp")}>
        </progress>
    )
}

export let MatchToMaxHpMap: Map<string, number | undefined> = new Map([
    ["knight", sm.knight_stats.get("max_hp")],
    ["dmage", sm.dmage_stats.get("max_hp")],
    ["wmage", sm.wmage_stats.get("max_hp")],
    ["rmage", sm.rmage_stats.get("max_hp")]
]);

export let MatchToMaxMpMap: Map<string, number | undefined> = new Map([
    ["knight", sm.knight_stats.get("max_mp")],
    ["dmage", sm.dmage_stats.get("max_mp")],
    ["wmage", sm.wmage_stats.get("max_mp")],
    ["rmage", sm.rmage_stats.get("max_mp")]
]);


interface PlayerMenuProps {
    player: string;
    isPlayerTurn: boolean;

}


/*if it's a number, that's the damage dealt. If it's a string,
 it's a miss/critical message. Crits include the message and the damage
all as one string*/

export const PlayerMenu: React.FC<PlayerMenuProps> = ({ player, isPlayerTurn }) => {

    console.log("player menu rendered")
    const current_attacks = player_attacks[player];
    //if it's active, hide the other options
    const [isAttacksActive, setIsAttacksActive] = useState(false);
    const [isItemsActive, setIsItemsActive] = useState(false);
    const HandleItemsMenu = () => setIsItemsActive(!isItemsActive);

    //global, starts false
    const { isAttackAreaShown, setIsAttackAreaShown } = useContext(AttackShownContext);

    const { KnightMP, setKnightMP } = useContext(KnightMPContext);
    const { DmageMP, setDmageMP } = useContext(DmageMPContext);
    const { WmageMP, setWmageMP } = useContext(WmageMPContext);
    const { RmageMP, setRmageMP } = useContext(RmageMPContext);

    const { KnightHP, setKnightHP } = useContext(KnightHPContext);
    const { DmageHP, setDmageHP } = useContext(DmageHPContext);
    const { WmageHP, setWmageHP } = useContext(WmageHPContext);
    const { RmageHP, setRmageHP } = useContext(RmageHPContext);

    const { KnightName } = useContext(KnightNameContext)
    const { DmageName } = useContext(DmageNameContext)
    const { WmageName } = useContext(WmageNameContext)
    const { RmageName } = useContext(RmageNameContext)


    const { KnightStatus, setKnightStatus } = useContext(KnightStatusContext);
    const { DmageStatus, setDmageStatus } = useContext(DmageStatusContext);
    const { WmageStatus, setWmageStatus } = useContext(WmageStatusContext);
    const { RmageStatus, setRmageStatus } = useContext(RmageStatusContext);

    const MatchToHpMap: Map<string, number | undefined> = new Map([
        ["knight", KnightHP],
        ["dmage", DmageHP],
        ["wmage", WmageHP],
        ["rmage", RmageHP]
    ]);
    const MatchToMpMap: Map<string, number | undefined> = new Map([
        ["knight", KnightMP],
        ["dmage", DmageMP],
        ["wmage", WmageMP],
        ["rmage", RmageMP]
    ]);


    function HandleAttacksMenu() {
        setIsAttacksActive(!isAttacksActive);
        console.log("AA: " + isAttacksActive);
    }

    //doubles defense for 3 turns
    function HandleDefend(player: string) {


    }


    //global
    const { currentAttack, setCurrentAttack } = useContext(CurrentAttackContext);
    //clicking the top button will show attacks and remove the other two
    //if the attacks are shown, change "attacks" to "back"

    const { BossHP, setBossHP } = useContext(BossContext);
    const { TurnNumber, setTurnNumber } = useContext(TurnNumberContext);


    //global
    const { isAttackMade, setIsAttackMade } = useContext(AttackMadeContext);
    //global
    const { message, setMessage } = useContext(MessageContext);
    function handleAtkClick(attack: string) {
        let atk_result = pa.PlayerAttack(attack);
        console.log("handleclick atkresult:", atk_result);
        setMessage(atk_result);

        setIsAttackAreaShown(true);
        setCurrentAttack(attack);
        /*Using this instead of turns 
        fixes weird bug where the attack area doesn't show up*/
        setIsAttackMade(true);

    }



    const [isSecondaryItemMenuShown, setIsSecondaryItemMenuShown] = useState(false);
    type validItemTargets = "knight" | "dmage" | "wmage" | "rmage";

    const [itemTarget, setItemTarget] = useState<validItemTargets>()
    const [currentItem, setCurrentItem] = useState("")

    function HandleItemChange(e: string) {
        console.log(iv.player_inventory.get(e))
        if (iv.player_inventory.get(e)!.stock <= 0) {
            setMessage("Not enough stock!");
            setIsAttackMade(true)
            //just shows the message
            setTimeout(() => {
                setIsAttackMade(false);
            }, 1000)
        } else {
            setIsSecondaryItemMenuShown(true)
            setCurrentItem(e);
        }
    }
    //sets hp with items
    function HpFunction(target: string, amount: number) {
        switch (target) {
            case "knight":
                setKnightHP(parseInt((amount).toFixed(0)))
                break;
            case "dmage":
                setDmageHP(parseInt((amount).toFixed(0)))
                break;
            case "wmage":
                setWmageHP(parseInt((amount).toFixed(0)))
                break;
            case "rmage":
                setRmageHP(parseInt((amount).toFixed(0)))
                break;
        }
    }

    function MpFunction(target: string, amount: number) {
        switch (target) {
            case "knight":
                setKnightMP(parseInt((amount).toFixed(0)))
                break;
            case "dmage":
                setDmageMP(parseInt((amount).toFixed(0)))
                break;
            case "wmage":
                setWmageMP(parseInt((amount).toFixed(0)))
                break;
            case "rmage":
                setRmageMP(parseInt((amount).toFixed(0)))
                break;
        }
    }
    //Pulls from a map of objects like the attacks do 
    //Store the stock in a map
    //type is hp, mp, status. Add it to the dictionairy
    function UseItem(item: string, target: string) {
        //Need to do the stat changes from the items HERE
        //have the function return whatever it's healing
        //Use the item encyclopedia to check what to do with 
        //the returned number 
        const item_details = iv.player_inventory.get(item);
        //for future score
        Occurences.set("item", (Occurences.get("item")! + 1))
        console.log("item", item)
        console.log("target", target)
        //sm.dmage_stats.set("mp", sm.dmage_stats.get("mp")! - 100)
        //setDmageMP(DmageMP! * item_details?.amount!)
        //use the return value to determine what happens
        //number means it heals hp or mp. string means 
        //it heals a status, string will specify which status
        //Need to set the mp/hp maps too for consistency

        switch (item_details!.type) {
            case "hp"://set to the current + the max * healing factor (such as .33)
                MatchToHpMap.set(target, (MatchToHpMap.get(target)!) +
                    (MatchToMaxHpMap.get(target)! * item_details!.amount!))
                HpFunction(target, (MatchToHpMap.get(target)!))
                break;
            case "mp":
                MatchToMpMap.set(target, MatchToMpMap.get(target)! +
                    (MatchToMaxMpMap.get(target)! * item_details!.amount!))
                MpFunction(target, MatchToMpMap.get(target)!)
                break;
            case "revive":
                //revive and heal by the amount
                break;
            case "de-toxin":
                break;
            case "de-curse":
                break;
            case "de-freeze":
                break;
            case "status-all":
                break;

        }



        console.log("item details", item_details)
        //update stock
        if (item_details) {
            item_details.stock -= 1;
            iv.player_inventory.set(item, item_details);
            console.log("updated item", item_details)
        }
    }
    //Forces it to wait till the target has been set, eliminating latency issues
    useEffect(() => {
        //Everything must be reset here or it gets all weird and buggy
        if (itemTarget !== undefined) {

            UseItem(currentItem, itemTarget!)
            setIsSecondaryItemMenuShown(false)
            setItemTarget(undefined)
            setIsItemsActive(false)
            setCurrentItem("")
        }
    }, [itemTarget])

    function handleMP(attack: string, attack_encyclopedia_entry: number) {
        switch (player) {
            case "knight":
                setKnightMP(KnightMP! - attack_encyclopedia_entry!);
                break;
            case "dmage":
                setDmageMP(DmageMP! - attack_encyclopedia_entry!);
                break;
            case "wmage":
                setWmageMP(WmageMP! - attack_encyclopedia_entry!);
                break;
            case "rmage":
                attack !== "Border Of Life" ?
                    setRmageMP(RmageMP! - attack_encyclopedia_entry!) :
                    setRmageHP(RmageHP! - attack_encyclopedia_entry!)

                break;
        }

        handleAtkClick(attack);
        setIsAttackAreaShown(true);


        {
            setTimeout(() => {
                setTurnNumber(TurnNumber + 1)
                //for future score
                Occurences.set("turn", (Occurences.get("turn")! + 1))
                console.log("Occurences", Occurences)
                setIsAttackAreaShown(false);
                setIsAttackMade(false);

            }, 2000);
        }
    }

    return (

        <main className='w-full'>
            {!isAttackMade ?
                <ul className='-mt-24 battle-menu'>
                    {isItemsActive ? null :
                        <li>
                            <button onClick={() => { HandleAttacksMenu(); sfx.playClickSfx(); }}
                            >
                                {isAttacksActive ?

                                    "Back" : "Attacks"}
                            </button>
                        </li>
                    }
                    {!isAttacksActive ?
                        <>
                            <li>
                                <button onClick={() => { sfx.playClickSfx(); HandleItemsMenu() }}>
                                    {
                                        isSecondaryItemMenuShown ? null :
                                            isItemsActive ? "Back" : "Items"}
                                </button>
                            </li>

                            <div className='flex flex-row'>
                                <div className='flex flex-col'>
                                    {isSecondaryItemMenuShown &&
                                        <button className='atk-btn mb-2 '
                                            onClick={() => setIsSecondaryItemMenuShown(false)}>
                                            Back
                                        </button>
                                    }
                                    {isItemsActive &&
                                        <select
                                            onChange={//Will then show a "use on who? menu"
                                                (e) => { HandleItemChange(e.target.value); sfx.playClickSfx(); }}
                                            className='bg-black p-2 rounded-xl text-[1.2rem]'>
                                            <option>Select an item to use...</option>
                                            {[...iv.player_inventory.entries()].map(([item, details], index) => (
                                                <>
                                                    <option
                                                        key={index}
                                                        value={item}
                                                        title={details.description}
                                                        className='bg-black atk-btn text-sm'>
                                                        {item} ({details.stock})
                                                    </option>
                                                </>
                                            ))}
                                        </select>
                                    }
                                </div>
                                {isSecondaryItemMenuShown &&
                                    <section className='flex flex-col justify-end  '>
                                        <div className='flex flex-row'>
                                            <h1 className=' justify-center mx-auto'>Use on who?</h1>
                                        </div>
                                        <ul className=' space-x-4 grid grid-cols-2 grid-rows-2'>
                                            <li>
                                                <button className='atk-btn'
                                                    onClick={() =>
                                                        setItemTarget("knight")
                                                    }>
                                                    {KnightName}
                                                </button>
                                            </li>
                                            <li>
                                                <button className='atk-btn'
                                                    onClick={() =>
                                                        setItemTarget("dmage")
                                                    }>
                                                    {DmageName}
                                                </button>
                                            </li>
                                            <li>
                                                <button className='atk-btn'
                                                    onClick={() =>
                                                        setItemTarget("wmage")
                                                    }>
                                                    {WmageName}
                                                </button>
                                            </li>
                                            <li>
                                                <button className='atk-btn'
                                                    onClick={() =>
                                                        setItemTarget("rmage")
                                                    }>
                                                    {RmageName}
                                                </button>
                                            </li>

                                        </ul>
                                    </section>

                                }
                            </div>
                            {isItemsActive ? null :
                                <li>
                                    <button onClick={() => { HandleDefend(player); sfx.playClickSfx() }} >
                                        Defend
                                    </button>
                                </li>
                            }
                        </>
                        :
                        //if there's not enough mp, display a message
                        //Use the encyclopaedia to get the mp cost
                        //Mp subtraction is done HERE, then the bar updates through context

                        <>
                            <div className='w-full gap-x-2 grid grid-cols-3 grid-rows-auto'>

                                {current_attacks.map(
                                    (attack, index) =>
                                        <li key={index} className='atk-btn'
                                        >
                                            <button onClick={() => {
                                                const attack_encyclopedia_entry = e.AttackEncyclopedia.get(attack)!.mp_cost;
                                                //max mp for that character
                                                const mp_map_value = MatchToMpMap.get(player);
                                                //for BOL
                                                const hp_map_value = MatchToHpMap.get(player)

                                                sfx.playClickSfx();
                                                console.log("attack:", attack)
                                                if (attack == "Border Of Life") {
                                                    if (attack_encyclopedia_entry! > hp_map_value!) {
                                                        setMessage("Not enough HP!");
                                                        //Just makes the message appear
                                                        setIsAttackMade(true)
                                                        setTimeout(() => {
                                                            setIsAttackMade(false);
                                                        }, 1000)
                                                    } else {
                                                        handleMP(attack, attack_encyclopedia_entry!)

                                                    }

                                                } else {
                                                    if (attack_encyclopedia_entry! > mp_map_value!) {
                                                        setMessage("Not enough MP!");
                                                        //Just makes the message appear
                                                        setIsAttackMade(true)
                                                        setTimeout(() => {
                                                            setIsAttackMade(false);
                                                        }, 1000)
                                                    } else {
                                                        handleMP(attack, attack_encyclopedia_entry!)

                                                    }

                                                }

                                                //check for mp here and subtract it

                                            }}
                                                title={e.AttackEncyclopedia.get(attack)?.description}>

                                                {attack}
                                                <span className={
                                                    attack == "Border Of Life" ? 'ml-2 text-[rgb(0,128,0)]' : 'ml-2 text-[rgb(93,93,255)]'
                                                }
                                                >
                                                    {e.AttackEncyclopedia.get(attack)?.mp_cost}
                                                </span>
                                            </button>
                                        </li>
                                )
                                }
                            </div>

                        </>
                    }
                </ul>
                :
                <>
                    <section>

                        {isAttackAreaShown &&

                            <PlayerAttackArea
                                attack={currentAttack}
                                player={player}
                                isPlayerTurn={isPlayerTurn}

                            />

                        }
                    </section>
                    <MessageArea message={message} />

                </>

            }
        </main>

    )
}
interface PlayerAttackAreaProps {
    attack: string;
    player: string | null;
    isPlayerTurn: boolean;
}
interface MessageAreaProps {
    message: RNGResult | string;
}
const MessageArea: React.FC<MessageAreaProps> = ({ message }) => {

    useEffect(() => {
        console.log("inside msg area", message)
    }, [message]);

    //convert to proper string if necessary
    const message_string = typeof message === "object"
        ? `${message.crit === true ?
            "Critical hit! " : ""} Damage dealt: ${message.result}`
        : message;
    return (
        <h1 className='text-7xl absolute z-20  text-white ml-[90rem]  '>
            {message_string}
        </h1>
    )
}
//Need to keep this independent of the bossarea component
const PlayerAttackArea: React.FC<PlayerAttackAreaProps> = ({ attack, player, isPlayerTurn }) => {
    const { isUltima, setIsUltima } = useContext(UltimaContext);

    let current_attack = pa.selected_attack;
    //console.log("current_attack:" + current_attack);

    console.log("isultima:" + isUltima)
    return (
        <div>
            <span className='w-1/4 ml-[41.5%] mt-[14%] z-[4] rounded-xl 
            absolute top-0 right-0'>

            </span>
            <pa.ShowAttack
                attack={current_attack}
                player={player}
                is_player_turn={isPlayerTurn}
                is_ultima={isUltima}
            />
        </div>
    )
}


//Status effects, these will be image sources
//poison - 5% of max hp per turn
//curse - insta death in 10 turns
//frozen - can't move for 3 turns
const StatusEffectsHash: { [name: string]: string } = {
    "Poison": "poison.png",
    "Curse": "curse.png",
    "Freeze": "freeze.png",
}
//onBackToTitle is a void function that comes from the interface
//in the render below it flips the state of the page to the title
interface GoBackProps {
    onBackToTitle: () => void;
    bossStage: number;
    setBossStage: any;
}
//then pass the given global state to the playermenu
export const MainPage: React.FC<GoBackProps> = ({ onBackToTitle,
    bossStage, setBossStage }) => {
    //state holds a string to hold the selected character, or null to reset it
    //default null because no outline should be shown on load
    const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
    const { isAttackAreaShown, setIsAttackAreaShown } = useContext(AttackShownContext);
    const { message, setMessage } = useContext(MessageContext);
    const { currentAttack, setCurrentAttack } = useContext(CurrentAttackContext);
    const [isUltimaReady, setIsUltimaReady] = useState(false);


    //Manage the turn based system
    //Score will go up by 1 each player turn

    console.log("MainPage rendered");
    const [isPlayerTurn, setIsPlayerTurn] = useState(true);
    function HandleSelection(sel_character: string): void {

        if (selectedCharacter === sel_character) {
            //If the selected character is clicked again, deselect it
            setSelectedCharacter(null);
        } else {
            //Otherwise, select the clicked character
            setSelectedCharacter(sel_character);
        }
        sfx.playClickSfx();
    }



    //assign the correct class name to the status effect
    function getClassName(status_effect: string): string {
        switch (status_effect) {
            case "poison.png":
                return 'w-6 status-icon status-icon-poison';
            case "curse.png":
                return 'w-6 status-icon status-icon-curse';
            case "freeze.png":
                return 'w-6 status-icon status-icon-freeze';
            default:
                return '';
        }
    }
    function GetStatusEffectDesc(status_effect: string): string {
        switch (status_effect) {
            case "poison.png":
                return "Poisoned";
            case "curse.png":
                return "Cursed";
            case "freeze.png":
                return "Frozen";
            default:
                return '';
        }
    }

    //these will all be state
    function UpdateStatusEffects(player: string) {
        // Map the player to the corresponding status effects array
        let status_effects: string[];
        switch (player) {
            case "knight":
                status_effects = [];
                break;
            case "dmage":
                status_effects = []
                break;
            case "wmage":
                status_effects = []
                break;
            case "rmage":
                status_effects = []
                break;
            default:
                status_effects = [];
                break;
        }


        //Render the status effects
        return (
            status_effects.map((status_effect, index) => (
                <ul key={index}>
                    <li>
                        <img
                            src={require(`./assets/images/icons/${status_effect}`)}
                            alt={status_effect}
                            className={getClassName(status_effect)}
                            title={GetStatusEffectDesc(status_effect)}
                        />
                    </li>
                </ul>
            ))
        );
    }

    const { TurnNumber, setTurnNumber } = useContext(TurnNumberContext);
    const { isAttackMade, setIsAttackMade } = useContext(AttackMadeContext);

    //Then reset to -1 after used(or 0?)
    const [ultValue, setUltValue] = useState(-1);
    //ult management
    useEffect(() => {
        if (ultValue < 20) {
            setUltValue(ultValue + 1);
            //is actually 20 turns, but I need the -1 offset 
            //or it starts with it already filled a little
            if (ultValue === 19) {
                setIsUltimaReady(true);
            }
        }
    }, [TurnNumber])
    const [isUltMenuShown, setIsUltMenuShown] = useState(false);
    function handleUltMenu() {
        setIsUltMenuShown(!isUltMenuShown);
    }
    //Match the ult buttons to their appropriate styling
    const ultBtnClassLookup: Map<string, string> = new Map(
        [
            ["Thousand Men", "knight-ult-btn"],
            ["Nightmare Supernova", "dmage-ult-btn"],
            ["Supreme Altar", "wmage-ult-btn"],
            ["Scarlet Subversion", "rmage-ult-btn"]
        ]
    );
    const { isUltima, setIsUltima } = useContext(UltimaContext);
    const [isScreenDark, setIsScreenDark] = useState(false);
    //switch background based on ult used
    const UltimaBgLookup: Map<string, string> = new Map(
        [
            ["Thousand Men", knightbg],
            ["Nightmare Supernova", dmagebg],
            ["Supreme Altar", wmagebg],
            ["Scarlet Subversion", rmagebg]
        ]
    )

    function handleUltimaClick(attack: string) {
        setIsScreenDark(true);
        console.log("inside ult click", attack)
        setIsUltima(true);
        //ultima is used, so reset the ultValue
        setUltValue(0);
        setIsUltimaReady(false);
        //Hide the ult menu
        setIsUltMenuShown(false);
        //Tried to put this in its own function, messes up image paths 
        //and I don't know why
        let atk_result = pa.PlayerAttack(attack);
        console.log("ult atkresult:", atk_result);
        setMessage(atk_result);
        setIsAttackAreaShown(true);
        setCurrentAttack(attack);
        setIsAttackMade(true);
        document.body.style.backgroundImage = `url(${UltimaBgLookup.get(attack)})`;
        setTimeout(() => {
            document.body.style.backgroundImage = `url(${defaultbg})`;
        }, 3000)

        sfx.playClickSfx();
        {
            setTimeout(() => {
                setTurnNumber(TurnNumber + 1)
                setIsAttackAreaShown(false);
                setIsAttackMade(false);
                setIsUltima(false);
                setIsScreenDark(false);
            }, 4000);
        }
    }
    type validMapKeys = "knight_stats" | "dmage_stats" | "wmage_stats" | "rmage_stats";
    interface PlayerComponentProps {
        player: string;
        stat_name: validMapKeys;
        character_name?: string;
    }

    const PlayerComponent: React.FC<PlayerComponentProps> = ({ player, stat_name, character_name }) => {


        const { KnightMP, setKnightMP } = useContext(KnightMPContext);
        const { DmageMP, setDmageMP } = useContext(DmageMPContext);
        const { WmageMP, setWmageMP } = useContext(WmageMPContext);
        const { RmageMP, setRmageMP } = useContext(RmageMPContext);

        const { KnightHP, setKnightHP } = useContext(KnightHPContext);
        const { DmageHP, setDmageHP } = useContext(DmageHPContext);
        const { WmageHP, setWmageHP } = useContext(WmageHPContext);
        const { RmageHP, setRmageHP } = useContext(RmageHPContext);


        const { KnightName, setKnightName } = useContext(KnightNameContext);
        const { DmageName, setDmageName } = useContext(DmageNameContext);
        const { WmageName, setWmageName } = useContext(WmageNameContext);
        const { RmageName, setRmageName } = useContext(RmageNameContext);

        //ts won't cooperate, so we're YOLO-ing it with any
        const MatchToMPState: Map<string, any> = new Map(
            [
                ["knight", KnightMP],
                ["dmage", DmageMP],
                ["wmage", WmageMP],
                ["rmage", RmageMP]

            ]
        )
        const MatchToHPState: Map<string, any> = new Map(
            [
                ["knight", KnightHP],
                ["dmage", DmageHP],
                ["wmage", WmageHP],
                ["rmage", RmageHP]

            ]
        )

        const MatchToName: Map<string, any> = new Map(
            [
                ["knight", KnightName],
                ["dmage", DmageName],
                ["wmage", WmageName],
                ["rmage", RmageName]
            ]
        )
        return (
            <>
                <section className='flex flex-row text-white'>
                    <div className='flex flex-col'>
                        <h1 className='text-xl'>{MatchToName.get(player)}</h1>
                        <br></br>
                        <h1 className='mr-4 text-xl'>HP</h1>
                    </div>
                    <ul className='flex flex-row space-x-4'>
                        {UpdateStatusEffects(player)}
                    </ul>
                </section>
                <div className='flex flex-row'>

                    <progress className='p-hp'
                        max={sm[stat_name].get('max_hp')}
                        value={
                            MatchToHPState.get(player)
                        }>
                    </progress>
                    <div className='ml-2 text-xl hp-text'>
                        <strong>
                            {
                                MatchToHPState.get(player) > sm[stat_name].get('max_hp')!
                                    ? `${sm[stat_name].get('max_hp')!} / ${sm[stat_name].get('max_hp')!}`
                                    : `${MatchToHPState.get(player)} / ${sm[stat_name].get('max_hp')}`
                            }

                        </strong>
                    </div>
                </div>
                <h1 className='mr-4 text-xl text-white'>MP</h1>
                <div className='flex flex-row'>
                    <progress className='mb-4 p-mb p-mp'
                        max={sm[stat_name].get('max_mp')}
                        value={
                            MatchToMPState.get(player)
                        }>
                    </progress>
                    <div className='ml-2 text-xl mp-text'>
                        <strong>
                            {
                                MatchToMPState.get(player) > sm[stat_name].get('max_hp')!
                                    ? `${sm[stat_name].get('max_mp')!} / ${sm[stat_name].get('max_mp')!}`
                                    : `${MatchToMPState.get(player)} / ${sm[stat_name].get('max_mp')}`
                            }
                        </strong>
                    </div>
                </div>
            </>
        )
    }
    useEffect(() => {
        const original_bg = document.body.style.backgroundImage;
        document.body.style.backgroundImage = `url(${defaultbg})`;

        return () => {
            document.body.style.backgroundImage = original_bg
            //make it black
        };
    }, []);

    const { KnightStatus, setKnightStatus } = useContext(KnightStatusContext);
    const { DmageStatus, setDmageStatus } = useContext(DmageStatusContext);
    const { WmageStatus, setWmageStatus } = useContext(WmageStatusContext);
    const { RmageStatus, setRmageStatus } = useContext(RmageStatusContext);

    const { isBossAttacking, setIsBossAttacking } = useContext(BossAttackingContext)

    return (
        <>
            {/*darkens screen during ultimas*/}
            {isScreenDark && (
                <div className='fade'></div>
            )}

            {/*score tracker*/}
            <strong>

                <section className='text-white text-4xl flex justify-end 
                mr-24 mt-4 -mb-4'>
                    Turn # {TurnNumber}
                </section>
            </strong>
            <main className='w-full flex dark-overlay'>


                {/*party members*/}
                {!isBossAttacking &&
                    <section className='party-col w-full h-full flex 
                 -mt-4 ml-4'>
                        <ul className='w-full'>
                            <li>
                                <div>
                                    <Link to='/Startmenu' >
                                        <button className='4 text-lg
                                 text-white '
                                            onClick={() => { sfx.playClickSfx(); onBackToTitle() }}>
                                            Back to title
                                        </button>
                                    </Link>
                                </div>
                            </li>
                            <li>
                                {/*buttons get locked when attack is happening*/}
                                <button onClick={
                                    !KnightStatus.includes("dead") &&
                                        !isAttackAreaShown &&

                                        isPlayerTurn ?
                                        () => HandleSelection("knight")
                                        : undefined
                                }
                                    className={
                                        selectedCharacter === 'knight' ?
                                            'is-selected character-btn' :
                                            'is-not-selected character-btn'}>
                                    {/*different image if dead*/}
                                    <img src={
                                        !KnightStatus.includes("dead") ?
                                            knight_icon :
                                            dead_icon
                                    }
                                        alt={
                                            !KnightStatus.includes("dead") ?
                                                "knight icon" :
                                                "dead character"
                                        }
                                    >
                                    </img>
                                </button>
                                <span>
                                    {
                                        isPlayerTurn && selectedCharacter === 'knight' &&
                                        <PlayerMenu
                                            player='knight'
                                            isPlayerTurn={isPlayerTurn}

                                        />
                                    }
                                    <PlayerComponent
                                        player='knight'
                                        stat_name='knight_stats'
                                        character_name='Knight'
                                    />
                                </span>
                            </li>
                            <li>
                                <button onClick={
                                    !isAttackAreaShown &&
                                        isPlayerTurn ?
                                        () => HandleSelection("dmage")
                                        : undefined
                                }
                                    className={selectedCharacter === 'dmage' ?
                                        'is-selected character-btn' :
                                        'is-not-selected character-btn'}>
                                    <img src={
                                        !DmageStatus.includes("dead") ?
                                            dmage_icon :
                                            dead_icon
                                    }
                                        alt={
                                            !DmageStatus.includes("dead") ?
                                                "dark mage icon" :
                                                "dead character"
                                        }
                                    >
                                    </img>
                                </button>
                                <span>
                                    {

                                        isPlayerTurn && selectedCharacter === 'dmage' &&
                                        <PlayerMenu
                                            player='dmage'
                                            isPlayerTurn={isPlayerTurn}

                                        />

                                    }
                                    <PlayerComponent
                                        player='dmage'
                                        stat_name='dmage_stats'
                                        character_name='Dark Mage'
                                    />
                                </span>
                            </li>
                            <li>
                                <button onClick={
                                    !isAttackAreaShown &&
                                        isPlayerTurn ?
                                        () => HandleSelection("wmage") :
                                        undefined
                                }
                                    className={selectedCharacter === 'wmage' ? 'is-selected character-btn' : 'is-not-selected character-btn'}>
                                    <img src={
                                        !WmageStatus.includes("dead") ?
                                            wmage_icon :
                                            dead_icon
                                    }
                                        alt={
                                            !WmageStatus.includes("dead") ?
                                                "white mage icon" :
                                                "dead character"
                                        }
                                    >

                                    </img>
                                </button>
                                <span>
                                    {
                                        isPlayerTurn && selectedCharacter === 'wmage' &&
                                        <PlayerMenu
                                            player='wmage'
                                            isPlayerTurn={isPlayerTurn}

                                        />

                                    }
                                    <PlayerComponent
                                        player='wmage'
                                        stat_name='wmage_stats'
                                        character_name='White Mage'
                                    />

                                </span>
                            </li>
                            <li>
                                <button onClick={
                                    !isAttackAreaShown &&
                                        isPlayerTurn ?
                                        () => HandleSelection("rmage") :
                                        undefined
                                }
                                    className={selectedCharacter === 'rmage' ?
                                        'is-selected character-btn' :
                                        'is-not-selected character-btn'}>
                                    <img src={
                                        !RmageStatus.includes("dead") ?
                                            rmage_icon :
                                            dead_icon
                                    }
                                        alt={
                                            !RmageStatus.includes("dead") ?
                                                "red mage icon" :
                                                "dead character"
                                        }
                                    >
                                    </img>
                                </button>
                                <span>
                                    {
                                        isPlayerTurn && selectedCharacter === 'rmage' &&
                                        <PlayerMenu
                                            player='rmage'
                                            isPlayerTurn={isPlayerTurn}

                                        />

                                    }
                                    <PlayerComponent
                                        player='rmage'
                                        stat_name='rmage_stats'
                                        character_name='Red Mage'
                                    />
                                </span>
                            </li>
                            <li className='flex-row flex'>
                                {/*Goes up each player turn,by 1, to 20. 
                            Switches to a button when full
                            Will pull up a menu of 4 cells as a row*/}
                                {isUltimaReady ?
                                    <button className={
                                        !isUltMenuShown ? 'ult-btn text-2xl ' : 'ult-close-btn'
                                    }
                                        onClick={handleUltMenu}>
                                        <strong>
                                            {
                                                isUltMenuShown ?
                                                    'Close' : 'Use Ultima'
                                            }
                                        </strong>
                                    </button>

                                    :
                                    <progress
                                        className='ultima-bar flex 
                                justify-start w-2/5 mt-4 h-6'
                                        value={ultValue} max={20}>
                                    </progress>
                                }
                                {
                                    isUltMenuShown &&
                                    <div className='flex flex-row'>
                                        {e.ultimas.map((attack, index) => {
                                            return (
                                                <ul>
                                                    <li >
                                                        <button key={index}
                                                            className={`ult-atk-btn ${ultBtnClassLookup.get(attack)}`}
                                                            onClick={() => handleUltimaClick(attack)}
                                                            title={e.AttackEncyclopedia.get(attack)?.description}>
                                                            {attack}
                                                        </button>
                                                    </li>
                                                </ul>
                                            )
                                        })}
                                    </div>
                                }
                            </li>
                        </ul>
                    </section>
                }
                <section className=''>
                    {/*later on link this to the final version of 
                    when he attacks, which will be slightly randomized 
                    as opposed to a simple back and forth*/}
                    {TurnNumber % 2 === 0 &&
                        <BossAttackArea />
                    }
                    <BossArea
                        selectedCharacter={selectedCharacter}
                        setSelectedCharacter={setSelectedCharacter}
                        bossStage={bossStage}
                        setBossStage={setBossStage}
                    />
                </section>
            </main >
        </>
    );
};

export default MainPage;