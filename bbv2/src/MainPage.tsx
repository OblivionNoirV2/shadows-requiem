import React, { useState, useRef, useEffect, createContext, useContext, Dispatch, SetStateAction } from 'react';
import { Link } from 'react-router-dom';
import * as sm from './StatManagement';
import * as iv from './Inventory';
import * as pa from './PlayerActions';
import * as sfx from './sfxManagement';
import * as e from './Encyclopedia';
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
    RmageNameContext
} from './Context';
import { RNGResult } from './PlayerActions';
import { new_set_hp } from './PlayerActions';
import { selected_difficulty } from './StartMenu';
import knightbg from './assets/images/bg-and-effects/knightultimabg.png';
import dmagebg from './assets/images/bg-and-effects/dmageultimabg.png';
import wmagebg from './assets/images/bg-and-effects/wmageultimabg.png';
import rmagebg from './assets/images/bg-and-effects/rmageultimabg.png';
import defaultbg from './assets/images/bg-and-effects/newbg.png';

interface GoBackProps {
    onBackToTitle: () => void;
}

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
    player: string | null;

}

export const BossArea = () => {

    const [bossStage, setBossStage] = useState(1);

    console.log("rendered bossarea")
    useEffect(() => {
        console.log("boss stage updated", selected_difficulty)
        if (new_set_hp >= 666666) {
            setBossStage(1);
        } else if (new_set_hp >= 333333 && new_set_hp < 666666) {
            setBossStage(2);
        } else {
            setBossStage(3);
        }
    }, [new_set_hp]);
    //update the boss stage based on the hp value
    useEffect(() => {
        if (bossStage === 2) {
            //Boss gets further buffed or debuffed based on difficulty
            //when attacking using the multipliers
            sm.boss_stats.set('m_def', 1.25);
            sm.boss_stats.set('p-def', 1.25);
            sm.boss_stats.set('m_atk', 1.10);
            sm.boss_stats.set('p_atk', 1.10);
        } else if (bossStage === 3) {
            sm.boss_stats.set('m_def', 1.50);
            sm.boss_stats.set('p-def', 1.50);
            sm.boss_stats.set('m_atk', 1.20);
            sm.boss_stats.set('p_atk', 1.20);

        }

    }, [bossStage]);

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
                       text-black stage-label'>
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
            value={new_set_hp} max={sm.boss_stats.get("max_hp")}>
        </progress>
    )
}


interface PlayerMenuProps {
    player: string;
    isPlayerTurn: boolean;

}

function bossAttackAlgo() {

    console.log("boss attack");


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



    function HandleAttacksMenu() {
        setIsAttacksActive(!isAttacksActive);
        console.log("AA: " + isAttacksActive);
    }
    //do the same for attacks
    function GetItemDesc(item: string): string {
        switch (item) {
            case "HP Potion":
                return "Restores 50% of one character's HP";
            case "MP Potion":
                return "Restores 50% of one character's MP";
            case "Revive":
                return "Revives a character with 60% HP";
        }
        return "";
    }

    function HandleDefend() {

    }

    //global
    const { currentAttack, setCurrentAttack } = useContext(CurrentAttackContext);
    //clicking the top button will show attacks and remove the other two
    //if the attacks are shown, change "attacks" to "back"

    const { BossHP, setBossHP } = useContext(BossContext);
    const { TurnNumber, setTurnNumber } = useContext(TurnNumberContext);

    useEffect(() => {

        bossAttackAlgo();

    }, [TurnNumber, setTurnNumber]);
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



    const MatchToMpMap: Map<string, number | undefined> = new Map([
        ["knight", sm.knight_stats.get("mp")],
        ["dmage", sm.dmage_stats.get("mp")],
        ["wmage", sm.wmage_stats.get("mp")],
        ["rmage", sm.rmage_stats.get("mp")]
    ]);

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
    //Pulls from a map of objects like the attacks do 
    //Store the stock in a map

    function UseItem(item: string, target: string) {
        console.log("item", item)
        console.log("target", target)

    }
    //Forces it to wait till the target has been set, eliminating latency issues
    useEffect(() => {
        UseItem(currentItem, itemTarget!)
    }, [itemTarget])
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
                                    <button onClick={() => { HandleDefend(); sfx.playClickSfx() }} >
                                        Defend
                                    </button>
                                </li>
                            }
                        </>
                        :
                        //if there's not enough mp, disable the button and grey it out
                        //Use the encyclopaedia to get the mp cost
                        //Mp subtraction is done HERE, then the bar updates through context

                        <>
                            <div className='w-full gap-x-2 grid grid-cols-3 grid-rows-auto'>

                                {current_attacks.map(
                                    (attack, index) =>
                                        <li key={index} className='atk-btn'
                                        >
                                            <button onClick={() => {
                                                const attack_encyclopedia_entry = e.AttackEncyclopedia.get(attack)?.mp_cost;
                                                //max mp for that character
                                                const mp_map_value = MatchToMpMap.get(player);
                                                console.log("e entry:", attack_encyclopedia_entry);
                                                console.log("mpMapValue:", mp_map_value);
                                                console.log("dmagehp:", DmageHP);
                                                console.log("dmagemp:", DmageMP);

                                                sfx.playClickSfx();
                                                if (attack_encyclopedia_entry
                                                    && mp_map_value !== undefined
                                                    && attack_encyclopedia_entry > mp_map_value) {
                                                    setMessage("Not enough MP!");
                                                    //Just makes the message appear
                                                    setIsAttackMade(true)
                                                    setTimeout(() => {
                                                        setIsAttackMade(false);
                                                    }, 1000)
                                                } else {
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
                                                            setRmageMP(RmageMP! - attack_encyclopedia_entry!);
                                                            break;
                                                    }

                                                    handleAtkClick(attack);
                                                    setIsAttackAreaShown(true);


                                                    {
                                                        setTimeout(() => {
                                                            setTurnNumber(TurnNumber + 1)
                                                            setIsAttackAreaShown(false);
                                                            setIsAttackMade(false);

                                                        }, 2000);
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

//then pass the given global state to the playermenu
export const MainPage: React.FC<GoBackProps> = ({ onBackToTitle }) => {
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
                            {MatchToHPState.get(player)}/{sm[stat_name].get('max_hp')}
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
                            {MatchToMPState.get(player)}/{sm[stat_name].get("max_mp")}
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
            document.body.style.backgroundImage = original_bg;
        };
    }, []);

    //For mobile, move the characters under the boss and enable scroll
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
                                !isAttackAreaShown &&
                                    isPlayerTurn ?
                                    () => HandleSelection("knight")
                                    : undefined
                            }
                                className={
                                    selectedCharacter === 'knight' ? 'is-selected character-btn' : 'is-not-selected character-btn'}>
                                <img src={require('./assets/images/player/sprites/knight.png')}
                                    alt='knight'>
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
                                className={selectedCharacter === 'dmage' ? 'is-selected character-btn' : 'is-not-selected character-btn'}>
                                <img src={require('./assets/images/player/sprites/dmage.png')}
                                    alt='dark mage'></img>
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
                                <img src={require('./assets/images/player/sprites/wmage.png')}
                                    alt='white mage'></img>
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
                                className={selectedCharacter === 'rmage' ? 'is-selected character-btn' : 'is-not-selected character-btn'}>
                                <img src={require('./assets/images/player/sprites/rmage.png')}
                                    alt='red mage'></img>
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
                <section className=''>
                    <BossArea
                    />
                </section>
            </main >
        </>
    );
};

export default MainPage;