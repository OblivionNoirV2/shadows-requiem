import React, { useState, useRef, useEffect, createContext, useContext, Dispatch, SetStateAction, } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import * as sm from './StatManagement';
import * as iv from './Inventory';
import * as pa from './PlayerActions';
import * as sfx from './sfxManagement';
import * as e from './Encyclopedia';
import YouDied from './YouDied';
import { BossContext } from './Context';
import Timer from './Timer';
import {
    TurnNumberContext,
    MessageContext,
    AttackShownContext,
    CurrentAttackContext,
    AttackMadeContext,
    UltimaContext,
    KnightStatusContext,
    DmageStatusContext,
    AssassinStatusContext,
    RmageStatusContext,
    KnightNameContext,
    DmageNameContext,
    AssassinNameContext,
    RmageNameContext,
    BossAttackingContext,
    PrecipTypeContext,

} from './Context';

import { MatchToMpMap, MatchToHpMap } from './hpmpmaps';

import { RNGResult } from './PlayerActions';

import { selected_difficulty } from './StartMenu';
import knightbg from './assets/images/bg-and-effects/knightultimabg.png';
import dmagebg from './assets/images/bg-and-effects/dmageultimabg.png';
import assassinbg from './assets/images/bg-and-effects/assassinultimabg.png';
import rmagebg from './assets/images/bg-and-effects/rmageultimabg.png';
import defaultbg from './assets/images/bg-and-effects/battlebgv3.png';
import { bossAttackAlgo, BossAttackArea, last_boss_attacks, MatchToStat } from './BossAlgorithm';
import knight_icon from './assets/images/player/sprites/knight.png';
import dmage_icon from './assets/images/player/sprites/dmage.png';
import assassin_icon from './assets/images/player/sprites/assassin.png';
import rmage_icon from './assets/images/player/sprites/rmage.png';
import dead_icon from './assets/images/icons/dead.png';
import { prev_dmg } from './BossAlgorithm';
import { Occurences } from './victory';
import heartbeat from './assets/sound/sfx/heartbeatlouder.wav';
import { Percentage } from './BossAlgorithm';
import { NameToIndex } from './BossAlgorithm';
import { is_my_turn_active } from './PlayerActions';


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
    assassin: e.assassin_attacks,
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



let targets_list = []
export const MatchToMaxHpMap: Map<string, number | undefined> = new Map
    (
        [
            [
                "knight", sm.knight_stats.get("max_hp")
            ],
            [
                "dmage", sm.dmage_stats.get("max_hp")
            ],
            [
                "assassin", sm.assassin_stats.get("max_hp")
            ],
            [
                "rmage", sm.rmage_stats.get("max_hp")
            ]
        ]
    );

export const MatchToMaxMpMap: Map<string, number | undefined> = new Map
    (
        [
            [
                "knight", sm.knight_stats.get("max_mp")
            ],
            [
                "dmage", sm.dmage_stats.get("max_mp")
            ],
            [
                "assassin", sm.assassin_stats.get("max_mp")
            ],
            [
                "rmage", sm.rmage_stats.get("max_mp")
            ]
        ]
    );

//string just for the sake of reusability 
let NameToStats: Map<string, number | sm.StatMap> = new Map
    (
        [
            ["knight", sm.knight_stats],
            ["dmage", sm.dmage_stats],
            ["assassin", sm.assassin_stats],
            ["rmage", sm.rmage_stats]

        ]
    )


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
    const { AssassinStatus, setAssassinStatus } = useContext(AssassinStatusContext);
    const { RmageStatus, setRmageStatus } = useContext(RmageStatusContext);




    //warning for incoming US
    useEffect(() => {
        const b_image = document.getElementById("b-image"); //fixes race condition
        if (b_image) {
            if (last_boss_attacks.length > 7 && last_boss_attacks.length <= 10) {
                b_image.classList.add("warning");
                console.log("added warning")
            } else {
                b_image.classList.remove("warning");
            }
        }
    }, [last_boss_attacks.length]);






    const { isBossAttacking, setIsBossAttacking } = useContext(BossAttackingContext)

    const IndexToName: Map<number, string> = new Map(
        [
            [0, "knight"],
            [1, "dmage"],
            [2, "assassin"],
            [3, "rmage"]
        ])


    //Then do the status effect stuff.
    //Each have a small chance of auto-removal

    //because I need a string to use the maps for these 
    function ConvertToStr(char_num: number) {
        return IndexToName.get(char_num)

    }

    //5% of max hp. Can kill. 
    function PoisonDamage(char_id: number) {
        console.log("CHRID", char_id)
        const char_str = ConvertToStr(char_id)
        //then use the str to subtract hp accordingly 

        switch (char_str) {
            case "knight":
                sm.knight_stats.set("hp", (sm.knight_stats.get("hp")! - sm.knight_stats.get("max_hp")! * 0.05))
                break;
            case "dmage":
                sm.dmage_stats.set("hp", (sm.dmage_stats.get("hp")! - sm.dmage_stats.get("max_hp")! * 0.05))
                break;
            case "assassin":
                sm.assassin_stats.set("hp", (sm.assassin_stats.get("hp")! - sm.assassin_stats.get("max_hp")! * 0.05))
                break;
            case "rmage":
                sm.rmage_stats.set("hp", (sm.rmage_stats.get("hp")! - sm.rmage_stats.get("max_hp")! * 0.05))
        }
    };



    //lock player menus while boss is attacking
    useEffect(() => {
        //if it's an even turn, the boss attacks
        //chance of him attacking will be higher each stage
        //something like 70% -> 80% -> 90%
        console.log("boss attack")
        if (is_my_turn_active === true) {//wears off on next player attack
            console.log("can't attack!")

        } else {
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
                    assassin_status: AssassinStatus,
                    rmage_status: RmageStatus,
                    current_turn: TurnNumber,
                });
                console.log("boss return", boss_return)
                //special cases. Any stat lowering is done in the attack algo
                console.log("last attacks", boss_return.last_boss_attacks[last_boss_attacks.length - 1])
                //this is by index
                console.log("final targets", boss_return.final_targets)
                //convert index to names
                boss_return.final_targets.forEach((item: number) => {
                    targets_list.push(IndexToName.get(item))
                });
                //for single target attacks
                const single_target = boss_return.final_targets[boss_return.final_targets.length - 1];

                function SingleTargetSpecial(percentage: number,
                    single_target: number, effect: string) {
                    if (Percentage() < percentage) {
                        const setTarget = player_set_statuses.get(single_target);
                        if (!player_statuses.get(single_target)!.includes(effect)) {
                            setTarget!(prevStatus => [...prevStatus, effect])
                        }
                    }
                };
                //from here on we're using indexes
                switch (boss_return.last_boss_attacks[last_boss_attacks.length - 1]) {
                    case "Devourment":
                        //heal boss by prev dmg * 2
                        sm.boss_stats.set("hp", sm.boss_stats.get("hp")! +
                            (prev_dmg[prev_dmg.length - 1] * 2))
                        console.log("in devourment switch", typeof sm.boss_stats.get("hp"))
                        console.log("prev dmg dev", prev_dmg[prev_dmg.length - 1])

                        break;
                    case "Frozen Soul":
                        SingleTargetSpecial(
                            .25,
                            single_target,
                            "freeze"
                        )
                        break;
                    case "Unending Grudge":
                        SingleTargetSpecial(
                            .25,
                            single_target,
                            "poison"
                        )
                        break;
                    case "Death's Touch":
                        SingleTargetSpecial(
                            .15,
                            single_target,
                            "curse"
                        )
                        break;
                    case "Unholy Symphony": //this uses foreach since it's multi-target
                        boss_return.final_targets.forEach((target: number) => {
                            if (Percentage() < 0.33) {
                                //apply curse to the target
                                const setTarget = player_set_statuses.get(target)
                                if (!player_statuses.get(target)!.includes("curse")) {
                                    setTarget!(prevStatus => [...prevStatus, "curse"])
                                }
                            }
                        })
                        break;

                    default:
                        console.log("no special attacks used")
                        break;
                }
            }
        }

        /*
        20% chance of death.
        counting the prev 20% chance to remove it that comes before, 
        this is actually a 16% chance
        */
        function HandleCurse(char_id: number) {
            if (Percentage() < 0.20) {
                const char_str = ConvertToStr(char_id)!;
                const setter = NameToStats.get(char_str)!
                //should always be a statmap, but I don't want to mess with it now. This works fine
                if (typeof setter !== 'number') {
                    setter.set("hp", 0)
                };
            };
        };

        function RemovalManagement
            (
                set_status: Function,
                rate: number,
                status_name: string,
                function_to_execute: Function | null,
                char_id: number
            ) {
            if (Percentage() < rate) {
                //remove it
                set_status!((prev: string[]) => prev.filter(status => status !== status_name));
            } else {
                //function to run, or nothing in the case of freeze
                function_to_execute !== null &&
                    function_to_execute(char_id)

            };
        };
        for (let [char_id, statuses] of player_statuses.entries()) {

            const set_status = player_set_statuses.get(char_id)

            if (statuses.includes("poison")) {
                RemovalManagement(
                    set_status!,
                    0.10,
                    "poison",
                    PoisonDamage,
                    char_id
                );
            };
            //No else if, needs to check for all
            if (statuses.includes("freeze")) {
                RemovalManagement(
                    set_status!,
                    0.25,
                    "freeze",
                    null, //no function, just stays as is
                    char_id
                )
            }
            //this one's a bit cruel, but only happens in phase 3
            if (statuses.includes("curse")) {
                RemovalManagement(
                    set_status!,
                    0.20,
                    "curse",
                    HandleCurse,
                    char_id
                )
            }
        }
    }, [TurnNumber]);


    const player_statuses: Map<number, string[]> = new Map
        (
            [
                [0, KnightStatus],
                [1, DmageStatus],
                [2, AssassinStatus],
                [3, RmageStatus]
            ]
        )
    const player_set_statuses: Map<number,
        React.Dispatch<React.SetStateAction<string[]>>> = new Map
            (
                [
                    [0, setKnightStatus],
                    [1, setDmageStatus],
                    [2, setAssassinStatus],
                    [3, setRmageStatus]
                ]
            )


    //control dead and revive status
    function HandleDeath(character: string, killed_or_revived: string) {
        const char_index = NameToIndex.get(character)!
        const setStatus = player_set_statuses.get(char_index);
        const status = player_statuses.get(char_index);

        if (killed_or_revived === "killed") {
            if (!status!.includes("dead")) {
                setStatus!(["dead"]);//also removes everything else
                Occurences.set("death", (Occurences.get("death")! + 1));
            }
        } else {
            //remove dead, since this means they were revived
            setStatus!(prevStatus => prevStatus.filter(status => status !== "dead"));

        }
    }

    useEffect(() => {

        //the get value is still set to 10 after the death,
        //which is why this breaks
        let khp = parseInt(sm.knight_stats.get("hp")!.toFixed(0));
        console.log("initial khp", khp)
        if (khp <= 0) {
            //prevent negatives
            sm.knight_stats.set("hp", 0)
            HandleDeath("knight", "killed");
        } else {
            sm.knight_stats.set("hp", khp)
        }
        //try setting the new value with THIS, not state
    }, [sm.knight_stats.get("hp")])




    useEffect(() => {
        let kmp = parseInt(sm.knight_stats.get("mp")!.toFixed(0));
        if (kmp <= 0) {
            sm.knight_stats.set("mp", 0)
        } else {
            sm.knight_stats.set("mp", kmp) //fixed version
        }
    }, [sm.knight_stats.get("mp")])

    useEffect(() => {
        let dhp = parseInt(sm.dmage_stats.get("hp")!.toFixed(0));
        if (dhp <= 0) {
            sm.dmage_stats.set("hp", 0)
            HandleDeath("dmage", "killed");
        } else {
            sm.dmage_stats.set("hp", dhp)
        }
    }, [sm.dmage_stats.get("hp")])



    useEffect(() => {
        let dmp = parseInt(sm.dmage_stats.get("mp")!.toFixed(0));
        if (dmp <= 0) {
            sm.dmage_stats.set("mp", 0)
        } else {
            sm.dmage_stats.set("mp", dmp)

        }
    }, [sm.dmage_stats.get("mp")])

    useEffect(() => {
        let ahp = parseInt(sm.assassin_stats.get("hp")!.toFixed(0));
        if (ahp <= 0) {
            sm.assassin_stats.set("hp", 0);
            HandleDeath("assassin", "killed");
        } else {
            sm.assassin_stats.set("hp", ahp)
        }

    }, [sm.assassin_stats.get("hp")])


    useEffect(() => {
        let wmp = parseInt(sm.assassin_stats.get("mp")!.toFixed(0));
        if (wmp <= 0) {
            sm.assassin_stats.set("mp", 0)
        } else {
            sm.assassin_stats.set("mp", wmp)
        }
    }, [sm.assassin_stats.get("mp")])

    useEffect(() => {
        let rhp = parseInt(sm.rmage_stats.get("hp")!.toFixed(0));
        if (rhp <= 0) {
            sm.rmage_stats.set("hp", 0)
            HandleDeath("rmage", "killed");
        } else {
            sm.rmage_stats.set("hp", rhp)//differnce is this version is tofixed, no decimals
        }
    }, [sm.rmage_stats.get("hp")])


    useEffect(() => {
        let rmp = parseInt(sm.rmage_stats.get("mp")!.toFixed(0));
        if (rmp <= 0) {
            sm.rmage_stats.set("mp", 0)
        } else {
            sm.rmage_stats.set("mp", rmp)
        }

    }, [sm.rmage_stats.get("mp")])


    useEffect(() => {
        let boss_hp = sm.boss_stats.get("hp")!
        console.log("boss stage updated", selected_difficulty)
        if (boss_hp >= 468000) {
            setBossStage(1); //60%
        } else if (boss_hp >= 195000 && boss_hp < 467999) {
            setBossStage(2);
        } else {
            setBossStage(3); //25%
            document.documentElement.style.filter = "brightness(50%)"

        }
    }, [sm.boss_stats.get("hp")]);

    interface MaxStatsObject {
        max_p_def: number,
        max_m_def: number,
        max_m_atk: number,
        max_p_atk: number
    }


    /*this will run every turn, checks for any stat abnormalities 
    and makes adjustments accordingly. stats go up/down .25 each turn 
    accordingly if they're abnormal. Same goes for boss
    */
    function StatReversion() {
        console.log("sr running")
        //list of character names
        const character_names = ['knight', 'dmage', 'assassin', 'rmage'];
        //list of stats to check for each character
        const stat_names = ['m_def', 'p_def', 'p_atk', 'm_atk', 'ev'];

        //Loop over each character
        for (let character_name of character_names) {
            // Get the corresponding stat map for the current character
            const stat_map = (sm as any)[`${character_name}_stats`];

            //Loop over each stat to check
            for (let statName of stat_names) {
                //Get the current and default stat values
                const current_stat = stat_map.get(statName)!;
                const default_stat = stat_map.get(`d_${statName}`)!;

                //If the current stat is higher than the default, decrease it
                if (current_stat > default_stat) {
                    let new_stat = current_stat - 0.25;
                    //ensure it's not less than the min
                    new_stat = Math.max(new_stat, (sm.min_max_vals_map.get("player") as any)[statName].min);
                    stat_map.set(statName, new_stat);
                }
                //If the current stat is lower than the default, increase it
                else if (current_stat < default_stat) {
                    let new_stat = current_stat + 0.25;
                    //ensure it's not more than the max
                    new_stat = Math.min(new_stat, (sm.min_max_vals_map.get("player") as any)[statName].max);
                    stat_map.set(statName, new_stat);
                }
            }
        }
    }
    //check for abnormalities each turn
    useEffect(() => {
        console.log("original", sm.knight_stats.get("p_def"))
        StatReversion()

    }, [TurnNumber])





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
        mr-[15rem]
        '>
            <section className='flex flex-col items-center w-[80rem]
             relative'>
                <img id='b-image'
                    src={boss_images[bossStage - 1]}
                    className='boss-sprite opacity-95 rounded-xl max-w-4xl'
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
};


export const BossHpBar = () => {
    const nav = useNavigate();
    useEffect(() => {
        if (sm.boss_stats.get("hp")! <= 0) {
            nav('/Victory')
        }
    }, [sm.boss_stats.get("hp")])

    return (
        <div className="relative w-full h-8 flex">
            <span className='text-white text-3xl mr-1'>
                &#167;
            </span>

            <progress className="block h-8 glow-ani-border-black boss-prog w-full" id='boss-hp-bar'
                value={sm.boss_stats.get("hp")} max={sm.boss_stats.get("max_hp")}>
            </progress>
            <h1 className="text-white absolute top-0 left-0 w-full h-full flex items-center justify-center z-[99999999]">
                {sm.boss_stats.get("hp")!.toFixed(0)} / {sm.boss_stats.get("max_hp")}
            </h1>
            <span className='text-white text-3xl ml-1'>
                &#167;
            </span>
        </div>
    )
}





interface PlayerMenuProps {
    player: string;
    isPlayerTurn: boolean;
    MpMap: Map<string, any>;

}


/*if it's a number, that's the damage dealt. If it's a string,
 it's a miss/critical message. Crits include the message and the damage
all as one string*/

export const PlayerMenu: React.FC<PlayerMenuProps> = ({ player, isPlayerTurn, MpMap }) => {

    const current_attacks = player_attacks[player];
    //if it's active, hide the other options
    const [isAttacksActive, setIsAttacksActive] = useState(false);
    const [isItemsActive, setIsItemsActive] = useState(false);
    const HandleItemsMenu = () => setIsItemsActive(!isItemsActive);

    //global, starts false
    const { isAttackAreaShown, setIsAttackAreaShown } = useContext(AttackShownContext);


    const { KnightName } = useContext(KnightNameContext);
    const { DmageName } = useContext(DmageNameContext);
    const { AssassinName } = useContext(AssassinNameContext);
    const { RmageName } = useContext(RmageNameContext);


    const { KnightStatus, setKnightStatus } = useContext(KnightStatusContext);
    const { DmageStatus, setDmageStatus } = useContext(DmageStatusContext);
    const { AssassinStatus, setAssassinStatus } = useContext(AssassinStatusContext);
    const { RmageStatus, setRmageStatus } = useContext(RmageStatusContext);






    function HandleAttacksMenu() {
        setIsAttacksActive(!isAttacksActive);
        console.log("AA: " + isAttacksActive);
    }

    //doubles defense (up to a max of whatever that character's max is), 
    //
    function HandleDefend(player: string, current_turn: number) {

        console.log("og mdef", sm.player_mdef_map.get(player)!)
        //first check that it doesn't exceed maximums 
        if (sm.player_mdef_map.get(player)! < sm.min_max_vals_map.get("player")!.m_def.max) {
            //if it's less than max, apply the buff
            sm.player_mdef_map.set(player, (sm.player_mdef_map.get(player)! + 0.50));
            console.log("new mdef", sm.player_mdef_map.get(player)!)
            //if it exceeds after setting, revert back to the max
            if (sm.player_mdef_map.get(player)! > sm.min_max_vals_map.get("player")!.m_def.max) {
                sm.player_mdef_map.set(player, sm.min_max_vals_map.get("player")!.m_def.max)
            }
        }
        //then the same thing for pdef
        if (sm.player_pdef_map.get(player)! < sm.min_max_vals_map.get("player")!.p_def.max) {
            //if it's less than max, apply the buff
            sm.player_pdef_map.set(player, (sm.player_pdef_map.get(player)! + 0.50));
            console.log("new pdef", sm.player_pdef_map.get(player)!)
            //if it exceeds after setting, revert back to the max
            if (sm.player_pdef_map.get(player)! > sm.min_max_vals_map.get("player")!.p_def.max) {
                sm.player_pdef_map.set(player, sm.min_max_vals_map.get("player")!.p_def.max)
            }
        }
        setTurnNumber(TurnNumber + 1)
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
    function HandleAtkClick(attack: string) {
        let atk_result = pa.PlayerAttack(attack);
        console.log("Handleclick atkresult:", atk_result);
        setMessage(atk_result);

        setIsAttackAreaShown(true);
        setCurrentAttack(attack);
        /*Using this instead of turns 
        fixes weird bug where the attack area doesn't show up*/
        setIsAttackMade(true);

    }



    const [isSecondaryItemMenuShown, setIsSecondaryItemMenuShown] = useState(false);
    type validItemTargets = "knight" | "dmage" | "assassin" | "rmage";

    const [itemTarget, setItemTarget] = useState<validItemTargets>()
    const [currentItem, setCurrentItem] = useState("")


    function HandleItemChange(e: string) {
        console.log(iv.player_inventory.get(e))
        if (iv.player_inventory.get(e)!.stock <= 0) {
            setMessage("Not enough stock!");
            setIsAttackMade(true)
            ShowMessage()
        } else {
            setIsSecondaryItemMenuShown(true)
            setCurrentItem(e);
        }
    }









    function ShowMessage() {
        setIsAttackMade(true)
        setTimeout(() => {
            setIsAttackMade(false);
        }, 1000)
    }
    //to filter out what no longer belongs + check for usage validity
    //might warrant a global
    const TargetToStatus: Map<string, string[]> = new Map
        (
            [
                ["knight", KnightStatus],
                ["dmage", DmageStatus],
                ["assassin", AssassinStatus],
                ["rmage", RmageStatus]
            ]
        )

    const TargetToSetStatus: Map<string, React.Dispatch<SetStateAction<string[]>>> = new Map
        (
            [
                ["knight", setKnightStatus],
                ["dmage", setDmageStatus],
                ["assassin", setAssassinStatus],
                ["rmage", setRmageStatus]
            ]
        )
    function RemoveStatus(target: string, status_removed: string) {
        const set_status = TargetToSetStatus.get(target)!;
        set_status(TargetToStatus.get(target)!.filter(
            status => status !== status_removed));
    }

    //Pulls from a map of objects like the attacks do 
    //Store the stock in a map
    //type is hp, mp, status. Add it to the dictionairy
    function UseItem(item: string, target: string) {
        const item_details = iv.player_inventory.get(item);
        //for future score
        Occurences.set("item", (Occurences.get("item")! + 1))
        console.log("item", item)
        console.log("target", target)
        //use the return value to determine what happens
        //number means it heals hp or mp. string means 
        //it heals a status, string will specify which status
        //Need to set the mp/hp maps too for consistency

        //if a useless item is attempted, a notice will pop up.
        //this needs to happen before inventory subtraction


        function HealSwitch(target: string, amount: number) {
            //can probably actually use the one in boss algo for this
            switch (target) {
                case "knight":
                    sm.knight_stats.set("hp", amount);
                    break;
                case "dmage":
                    sm.dmage_stats.set("hp", amount);
                    break;
                case "assassin":
                    sm.assassin_stats.set("hp", amount)
                    break;
                case "rmage":
                    sm.rmage_stats.set("hp", amount)
            }
        }

        function MpSwitch(target: string, amount: number) {
            switch (target) {
                case "knight":
                    sm.knight_stats.set("mp", amount);
                    break;
                case "dmage":
                    sm.dmage_stats.set("mp", amount);
                    break;
                case "assassin":
                    sm.assassin_stats.set("mp", amount)
                    break;
                case "rmage":
                    sm.rmage_stats.set("mp", amount)
            }
        }



        switch (item_details!.type) {
            case "hp"://set to the current + the max * healing factor (such as .33)
                HealSwitch(target, (MatchToHpMap.get(target)!) +
                    (MatchToMaxHpMap.get(target)! * item_details!.amount!));
                break;
            case "mp":
                MpSwitch(target, (MatchToMpMap.get(target)!) +
                    (MatchToMaxMpMap.get(target)! * item_details!.amount!));
                console.log("mmt", MatchToMpMap.get(target)!)
                break;
            case "revive":
                //remove dead status
                RemoveStatus(target, "dead");
                console.log("knight status", KnightStatus)
                //then heal depending on revive type(the given amount in details)
                HealSwitch(target, (MatchToHpMap.get(target)!) +
                    (MatchToMaxHpMap.get(target)! * item_details!.amount!));
                break;
            case "de-toxin":
                //remove poison status
                RemoveStatus(target, "poison");
                break;
            case "de-curse":
                //remove curse status
                RemoveStatus(target, "curse");
                break;
            case "de-frost":
                //remove freeze status
                RemoveStatus(target, "freeze")
                break;
            case "status-all":
                //if it reaches this point the character 
                //is not dead, so clear the list 
                TargetToStatus.set(target, [])
                break;
        };
        console.log("item details", item_details)
        if (item_details) {
            item_details.stock -= 1;
            iv.player_inventory.set(item, item_details);
            console.log("updated item", item_details)
        }
    };
    //change "freeze" to "frozen", etc for proper formatting
    const FixMessage: Map<string, string> = new Map(
        [
            ["freeze", "frozen"],
            ["poison", "poisoned"],
            ["curse", "cursed"]

        ]
    );
    function CheckStatusEffectValidity(effect: string, target: string, status: string) {
        if (iv.player_inventory.get(currentItem)!.type === effect
            && !TargetToStatus.get(target)!.includes(status)) {
            setMessage(`This character is not ${FixMessage.get(status)}!`);

            ShowMessage();
            return true;
        } else {
            return false;
        }
    }
    //Forces it to wait till the target has been set, eliminating latency issues
    useEffect(() => {
        //Everything must be reset here or it gets all weird and buggy
        if (itemTarget !== undefined) {
            //check for validity here, these are all INVALID. 
            ///Default is if it passes the test
            switch (true) {
                //revives
                case iv.player_inventory.get(currentItem)!.type === "revive"
                    && !TargetToStatus.get(itemTarget)!.includes("dead"):
                    setMessage("This character is not dead!");
                    ShowMessage();
                    break;
                //hp items
                case iv.player_inventory.get(currentItem)!.type === "hp"
                    && MatchToHpMap.get(itemTarget)! >= MatchToMaxHpMap.get(itemTarget)!:
                    setMessage("This character is already at max HP!");
                    ShowMessage();
                    break;
                //mp items
                case iv.player_inventory.get(currentItem)!.type === "mp"
                    && MatchToMpMap.get(itemTarget)! >= MatchToMaxMpMap.get(itemTarget)!:
                    setMessage("This character is already at max MP!");
                    ShowMessage();
                    break;
                //curse
                case CheckStatusEffectValidity("de-curse", itemTarget, "curse"):
                    break;
                //freeze
                case CheckStatusEffectValidity("de-frost", itemTarget, "freeze"):
                    break;
                //poison
                case CheckStatusEffectValidity("poison", itemTarget, "poison"):
                    break;
                default: //if it reaches here, it is VALID
                    UseItem(currentItem, itemTarget!)
                    setIsSecondaryItemMenuShown(false)
                    setItemTarget(undefined)
                    setIsItemsActive(false)
                    setCurrentItem("")
                    break;
            }
        }
    }, [itemTarget]);

    function HandleMP(attack: string, attack_encyclopedia_entry: number) {
        switch (player) {
            case "knight":
                sm.knight_stats.set("mp", (sm.knight_stats.get("mp")! - attack_encyclopedia_entry!));
                break;
            case "dmage":
                sm.dmage_stats.set("mp", (sm.dmage_stats.get("mp")! - attack_encyclopedia_entry!));
                break;
            case "assassin":
                sm.assassin_stats.set("mp", (sm.assassin_stats.get("mp")! - attack_encyclopedia_entry!));
                break;
            case "rmage":
                attack !== "Border Of Life" ? //bol uses hp
                    sm.rmage_stats.set("mp", (sm.rmage_stats.get("mp")! - attack_encyclopedia_entry!)) :
                    console.log("bol uses hp", attack_encyclopedia_entry)
                console.log("rmage hp", sm.rmage_stats.get("hp"))
                sm.rmage_stats.set("hp", sm.rmage_stats.get("hp")! - attack_encyclopedia_entry)
                console.log("rmage hp after bol", sm.rmage_stats.get("hp")!)
                break;
        }

        HandleAtkClick(attack);
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
                                                        setItemTarget("assassin")
                                                    }>
                                                    {AssassinName}
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
                                    <button onClick={() => { HandleDefend(player, TurnNumber); sfx.playClickSfx() }} >
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

                                                //for BOL
                                                const hp_map_value = MatchToHpMap.get(player)

                                                sfx.playClickSfx();
                                                console.log("attack:", attack)
                                                if (attack == "Border Of Life") {
                                                    if (attack_encyclopedia_entry! > hp_map_value!) {
                                                        setMessage("Not enough HP!");
                                                        ShowMessage()
                                                    } else {
                                                        HandleMP(attack, attack_encyclopedia_entry!)

                                                    }

                                                } else {

                                                    if (attack_encyclopedia_entry! > MpMap.get(player)) {
                                                        setMessage("Not enough MP!");
                                                        ShowMessage()
                                                    } else {
                                                        HandleMP(attack, attack_encyclopedia_entry!)

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

    const { KnightStatus, setKnightStatus } = useContext(KnightStatusContext);
    const { DmageStatus, setDmageStatus } = useContext(DmageStatusContext);
    const { AssassinStatus, setAssassinStatus } = useContext(AssassinStatusContext);
    const { RmageStatus, setRmageStatus } = useContext(RmageStatusContext);


    const nav = useNavigate()


    useEffect(() => {
        if (KnightStatus.includes("dead") &&
            DmageStatus.includes("dead") &&
            AssassinStatus.includes("dead") &&
            RmageStatus.includes("dead")) {
            //navigate to YouDied page
            nav('/YouDied')
        }

    }, [KnightStatus, DmageStatus, AssassinStatus, RmageStatus])

    //Manage the turn based system
    //Score will go up by 1 each player turn


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
    function getClassName(status_effect: string): string | void {
        //no break because these can stack
        switch (status_effect) {
            case "poison":
                return 'w-6 status-icon status-icon-poison';
            case "curse":
                return 'w-6 status-icon status-icon-curse';
            case "freeze":
                return 'w-6 status-icon status-icon-freeze';
        }
    }
    function GetStatusEffectDesc(status_effect: string): string {
        switch (status_effect) {
            case "poison":
                return "Poisoned";
            case "curse":
                return "Cursed";
            case "freeze":
                return "Frozen";
            default:
                return '';
        }
    }
    //match returned target to their statuses, for status effects
    const IndexToStatus: Map<number, string[]> = new Map
        (
            [
                [0, KnightStatus],
                [1, DmageStatus],
                [2, AssassinStatus],
                [3, RmageStatus]
            ]
        )
    const IndexToSetStatus: Map<number, React.Dispatch<SetStateAction<string[]>>> = new Map
        (
            [
                [0, setKnightStatus],
                [1, setDmageStatus],
                [2, setAssassinStatus],
                [3, setRmageStatus]
            ]
        )

    //match it to the image
    function UpdateStatusEffects(player: string) {
        // Map the player to the corresponding status effects array
        let status_effects: string[];
        //convert to index
        const player_num = NameToIndex.get(player)!
        status_effects = IndexToStatus.get(player_num)!.filter(status => status !== "dead")

        //Render the status effects
        return (
            status_effects.map((status_effect, index) => (
                <ul key={index}>
                    <li>
                        <img
                            src={require(`./assets/images/icons/${status_effect}.png`)}
                            alt={status_effect}
                            className={getClassName(status_effect)!}
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
    function HandleUltMenu() {
        setIsUltMenuShown(!isUltMenuShown);
    }
    //Match the ult buttons to their appropriate styling
    const ultBtnClassLookup: Map<string, string> = new Map(
        [
            ["Thousand Men", "knight-ult-btn"],
            ["Nightmare Supernova", "dmage-ult-btn"],
            ["Supreme Altar", "assassin-ult-btn"],
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
            ["Supreme Altar", assassinbg],
            ["Scarlet Subversion", rmagebg]
        ]
    )

    function HandleUltimaClick(attack: string) {
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
    type validMapKeys = "knight_stats" | "dmage_stats" | "assassin_stats" | "rmage_stats";
    interface PlayerComponentProps {
        player: string;
        stat_name: validMapKeys;
        character_name?: string;
    }


    const PlayerComponent: React.FC<PlayerComponentProps> = ({ player, stat_name }) => {

        const { KnightName } = useContext(KnightNameContext);
        const { DmageName } = useContext(DmageNameContext);
        const { AssassinName } = useContext(AssassinNameContext);
        const { RmageName } = useContext(RmageNameContext);

        const [knightVisualMp] = useState(sm.knight_stats.get("mp")!);
        const [knightVisualHp] = useState(sm.knight_stats.get("hp")!);
        const [dmageVisualMp] = useState(sm.dmage_stats.get("mp")!);
        const [dmageVisualHp] = useState(sm.dmage_stats.get("hp")!);
        const [assassinVisualMp] = useState(sm.assassin_stats.get("mp")!);
        const [assassinVisualHp] = useState(sm.assassin_stats.get("hp")!);
        const [rmageVisualMp] = useState(sm.rmage_stats.get("mp")!);
        const [rmageVisualHp] = useState(sm.rmage_stats.get("hp")!);

        const MatchToVisualMP: Map<string, number> = new Map
            (
                [
                    ["knight", knightVisualMp],
                    ["dmage", dmageVisualMp],
                    ["assassin", assassinVisualMp],
                    ["rmage", rmageVisualMp]
                ]
            );

        const MatchToVisualHP: Map<string, number> = new Map
            (
                [
                    ["knight", knightVisualHp],
                    ["dmage", dmageVisualHp],
                    ["assassin", assassinVisualHp],
                    ["rmage", rmageVisualHp]
                ]
            );

        const MatchToName: Map<string, any> = new Map(
            [
                ["knight", KnightName],
                ["dmage", DmageName],
                ["assassin", AssassinName],
                ["rmage", RmageName]
            ]
        )

        return (
            <>
                <section className='flex flex-row text-white'>
                    <div className='flex flex-col'>
                        <h1 className='text-xl'>{MatchToName.get(player)}</h1>
                        <br></br>
                        <div className='flex '>
                            <h1 className='mr-4 text-xl'>HP</h1>
                            <ul className='flex flex-row space-x-4'>
                                {UpdateStatusEffects(player)}
                            </ul>
                        </div>
                    </div>

                </section>
                <div className='flex flex-row'>


                    <progress className='p-hp'
                        max={sm[stat_name].get('max_hp')}
                        value={
                            MatchToVisualHP.get(player)!.toFixed(0)
                        }>
                    </progress>
                    <div className='ml-2 text-xl hp-text'>

                        <strong>
                            {
                                MatchToHpMap.get(player)! > sm[stat_name].get('max_hp')!
                                    ? `${sm[stat_name].get('max_hp')!} / ${sm[stat_name].get('max_hp')!}`
                                    : `${MatchToVisualHP.get(player)!.toFixed(0)} / ${sm[stat_name].get('max_hp')}`
                            }

                        </strong>
                    </div>
                </div>
                <h1 className='mr-4 text-xl text-white'>MP</h1>
                <div className='flex flex-row'>
                    <progress className='mb-4 p-mb p-mp'
                        max={sm[stat_name].get('max_mp')}
                        value={
                            MatchToVisualMP.get(player)!.toFixed(0)
                        }>
                    </progress>
                    <div className='ml-2 text-xl mp-text'>
                        <strong>
                            {
                                MatchToMpMap.get(player)! > sm[stat_name].get('max_mp')!
                                    ? `${sm[stat_name].get('max_mp')!} / ${sm[stat_name].get('max_mp')!}`
                                    : `${MatchToVisualMP.get(player)!.toFixed(0)} / ${sm[stat_name].get('max_mp')}`
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





    const { isBossAttacking, setIsBossAttacking } = useContext(BossAttackingContext)
    const [seconds, setSeconds] = useState(0);
    const [minutes, setMinutes] = useState(0);

    useEffect(() => {
        const interval_id = setInterval(() => {
            setSeconds((prev_seconds) => {
                if (prev_seconds === 59) {
                    setMinutes((prev_minutes) => prev_minutes + 1);
                    return 0;
                }
                return prev_seconds + 1;
            });
        }, 1000);

        return () => {
            clearInterval(interval_id);
        };
    }, []);

    return (
        <>
            {/*darkens screen during ultimas*/}
            {isScreenDark && (
                <div className='fade'></div>
            )}

            {/*score tracker*/}
            <strong>

                <section className='text-white text-4xl flex 
                justify-end 
                 mr-4 mt-4'>
                    <Timer />
                    <br></br>
                    Turn # {TurnNumber}
                </section>
            </strong>
            <main className='w-full flex '>


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
                                !isBossAttacking &&
                                    !KnightStatus.includes("dead") &&
                                    !isAttackAreaShown &&
                                    !KnightStatus.includes("freeze") &&

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
                                        MpMap={MatchToMpMap}

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
                                !isBossAttacking &&
                                    !DmageStatus.includes("dead") &&
                                    !isAttackAreaShown &&
                                    !DmageStatus.includes("freeze") &&
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
                                        MpMap={MatchToMpMap}

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
                                !isBossAttacking &&
                                    !AssassinStatus.includes("dead") &&
                                    !isAttackAreaShown &&
                                    !AssassinStatus.includes("freeze") &&
                                    isPlayerTurn ?
                                    () => HandleSelection("assassin") :
                                    undefined
                            }
                                className={selectedCharacter === 'assassin' ? 'is-selected character-btn' : 'is-not-selected character-btn'}>
                                <img src={
                                    !AssassinStatus.includes("dead") ?
                                        assassin_icon :
                                        dead_icon
                                }
                                    alt={
                                        !AssassinStatus.includes("dead") ?
                                            "white mage icon" :
                                            "dead character"
                                    }
                                >

                                </img>
                            </button>
                            <span>
                                {
                                    isPlayerTurn && selectedCharacter === 'assassin' &&
                                    <PlayerMenu
                                        player='assassin'
                                        isPlayerTurn={isPlayerTurn}
                                        MpMap={MatchToMpMap}

                                    />

                                }
                                <PlayerComponent
                                    player='assassin'
                                    stat_name='assassin_stats'
                                    character_name='White Mage'
                                />

                            </span>
                        </li>
                        <li>
                            <button onClick={
                                !isBossAttacking &&
                                    !isAttackAreaShown &&
                                    !RmageStatus.includes("dead") &&
                                    !RmageStatus.includes("freeze") &&
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
                                        MpMap={MatchToMpMap}

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
                            {
                                !isBossAttacking &&
                                    isUltimaReady ?
                                    <button className={
                                        !isUltMenuShown ? 'ult-btn text-2xl ' : 'ult-close-btn'
                                    }
                                        onClick={HandleUltMenu}>
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
                                                        onClick={() => HandleUltimaClick(attack)}
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
                <section>
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