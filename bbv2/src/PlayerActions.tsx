
import React, { useContext, useEffect, useState } from 'react';
import { BossContext } from './Context';
import { TurnNumberContext } from './Context';
import * as sm from './StatManagement';
import { type } from 'os';

import { AttackSfxLookup, playClickSfx } from './sfxManagement';
import { stat } from 'fs';
import { boss_stat_changes } from './StatManagement';
import { selected_difficulty } from './StartMenu';
import { player_mdef_map, player_pdef_map } from './StatManagement';
import { min_max_vals_map } from './StatManagement';
import { AttackAnimation, Percentage } from './BossAlgorithm';
import { Stats } from './StatManagement';
type phys_or_mag = "phys" | "mag"

export let is_my_turn_active: boolean = false;

const player_ev_map: Map<string, number | undefined> = new Map
    (
        [
            [
                "knight", sm.knight_stats.get("ev")
            ],
            [
                "dmage", sm.dmage_stats.get("ev")
            ],
            [
                "assassin", sm.assassin_stats.get("ev")
            ],
            [
                "rmage", sm.rmage_stats.get("ev")
            ]
        ]
    )

export const getConvertToStat = () => {
    //DO NOT TOUCH
    const difficulty_stats = boss_stat_changes.get(selected_difficulty);

    let phys = sm.boss_stats.get('p_def');
    let mag = sm.boss_stats.get('m_def');

    return {
        "phys":
            (
                phys !== undefined &&
                    difficulty_stats !== undefined ?
                    phys * difficulty_stats.def : 0
            ),
        "mag":
            (
                mag !== undefined &&
                    difficulty_stats !== undefined ?
                    mag * difficulty_stats.def : 0
            ),
    };
};



//if crit or miss, play a specific sfx
//for moves that don't use rng just look it up in the function itself
let miss_sfx = new Audio(AttackSfxLookup['miss']);
let crit_sfx = new Audio(AttackSfxLookup['crit']);
let healsfx = new Audio(AttackSfxLookup["heal"]);
let statup_sfx = new Audio(AttackSfxLookup["statup"]);
let statdown_sfx = new Audio(AttackSfxLookup["statdown"]);
let glass_shatter = new Audio(AttackSfxLookup["glass"]);
export type RNGResult = string | { result: number, crit: boolean };


interface RNGProps {
    min: number;
    crit_rate?: number; //ults don't crit
    phys_or_mag: phys_or_mag;
    variance: number; //float to 2 dec points
    is_ult: boolean;
    miss_rate?: number;
    sfx_type: string;//run multiple times if lightning
    sfx_count?: number;
    is_cl?: boolean;
}
function RNG(props: RNGProps) {

    const sfx = new Audio(AttackSfxLookup[props.sfx_type]);
    props.is_ult ? sfx.volume = 0.8 : sfx.volume = 0.3;

    let play_count = 0;
    function playNext() {
        if (props.sfx_count) {
            if (play_count < props.sfx_count) {
                const clone = new Audio(sfx.src);
                clone.volume = sfx.volume;
                clone.play();
                play_count++;
                setTimeout(playNext, 500);
            }
        }
    }

    if (props.sfx_count) {
        playNext();
    } else {
        sfx.play();
    }

    //calc a miss if miss rate is defined
    if (props.miss_rate) {
        let miss = Math.random() < props.miss_rate;
        if (miss) {
            setTimeout(() => {
                miss_sfx.play();

            }, 600);
            //cl only displays the total damage, but keep the sfx
            if (!props.is_cl) {
                return "Missed!";
            }
        }
    }
    //min is the "normal" damage, max is calculated from the variance
    const max = props.min * props.variance;
    let crit: boolean;
    //bool to check for crit if it's not an ult
    if (!props.is_ult && props.crit_rate) {
        crit = Math.random() < props.crit_rate;
    } else {
        //always false if it's an ult
        crit = false;
    }
    let calculated_damage = Math.floor(Math.random() * (max - props.min) + props.min);

    if (crit === true) {
        calculated_damage *= 1.5;
        crit_sfx.play();
    }

    const converted = getConvertToStat();

    //account for defense
    const result = (
        (calculated_damage / converted[props.phys_or_mag])
    ).toFixed(2);

    let crit_msg: boolean;
    //don't show the crit message if it's cl, it would be misleading
    //since it's multiple attacks
    if (!props.is_cl) {
        crit_msg = crit;
    } else {
        crit_msg = false;
    }

    return {
        result: parseInt(result),
        crit: crit_msg,
    };
};
//floor because we want to keep everything as ints
export function Randomizer(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
}

//for raising all player stats
function StatBuff(stat_map: Map<string, number | undefined>,
    max_val: number, increment: number) {
    statup_sfx.play();
    stat_map.forEach((value, key, map) => {
        if (value !== undefined && value < max_val) {
            map.set(key, value + increment);


        }
    }
    );
}
function LowerSingle(stat_to_lower: string, increment: number) {

    if (sm.boss_stats.get(stat_to_lower)! >
        min_max_vals_map.get("boss")![stat_to_lower as keyof Stats]!.min!) {
        setTimeout(() => {
            statdown_sfx.play();
        }, 500)
        sm.boss_stats.set(stat_to_lower, (sm.boss_stats.get(stat_to_lower)! - parseFloat(increment.toFixed(2))));
    }
}
const player_def = min_max_vals_map.get("player") as sm.Stats | undefined;
const player_ev = min_max_vals_map.get("player") as sm.Stats | undefined;
const bossminmax = min_max_vals_map.get("boss");
export const attacks_map: Map<string, Function> = new Map([
    /*knight attacks*/

    [
        'Sword Slash', function SwordSlash() {
            return (
                RNG(
                    {
                        min: 4000,
                        crit_rate: 0.06,
                        phys_or_mag: "phys",
                        variance: 1.20,
                        is_ult: false,
                        miss_rate: 0.05,
                        sfx_type: "sword"
                    }
                )
            );
        }
    ],

    [
        'Whims Of Fate', function WhimsOfFate() {
            return (
                RNG(
                    {
                        min: 7000,
                        crit_rate: 0.35,
                        phys_or_mag: "phys",
                        variance: 2.20,
                        is_ult: false,
                        miss_rate: 0.35,
                        sfx_type: "dice"
                    }
                )
            );
        }
    ],

    [
        'Deathblow', function Deathblow() {
            return (
                RNG(
                    {
                        min: 7800,
                        crit_rate: 0.12,
                        phys_or_mag: "phys",
                        variance: 1.20,
                        is_ult: false,
                        miss_rate: 0.05,
                        sfx_type: "sword"
                    }
                )
            );
        }
    ],

    [
        'Skull Crusher', function SkullCrusher() {
            if (Percentage() < 0.30) {
                LowerSingle("p_def", 0.25)
            }
            return (
                RNG(
                    {
                        min: 10900,
                        crit_rate: 0.06,
                        phys_or_mag: "phys",
                        variance: 1.10,
                        is_ult: false,
                        miss_rate: 0.05,
                        sfx_type: "sword"
                    }
                )
            );
        }
    ],

    [   //raises pdef for all
        'Rebellion', function Rebellion() {
            if (player_def !== undefined) {
                StatBuff(
                    player_pdef_map,
                    player_def.p_def.max,
                    0.25
                );
            }
        }
    ],

    [
        'Thousand Men', function ThousandMen() {
            statup_sfx.play();
            //also reduces boss attack for a bit
            LowerSingle("atk", 0.70)
            return (
                RNG(
                    {
                        min: 55000,
                        phys_or_mag: "phys",
                        variance: 1.05,//lower for ults
                        is_ult: true,
                        sfx_type: "army"
                    }
                )
            )
        }
    ],

    /*mage attacks*/

    [
        'Mirage Blade', function MirageBlade() {
            return (
                RNG(
                    {
                        min: 5700,
                        crit_rate: 0.06,
                        phys_or_mag: "phys",
                        variance: 1.10,
                        is_ult: false,
                        miss_rate: 0.00,
                        sfx_type: "darkmag"
                    }
                )
            )
        }
    ],
    [   //Rebellion but for mag def
        'Crystallize', function Crystallize() {
            if (player_def !== undefined) {
                StatBuff(
                    player_mdef_map,
                    player_def.m_def.max,
                    0.25
                );
            }
        }
    ],
    [
        'Black Fire', function BlackFire() {
            return (
                RNG(
                    {
                        min: 8200,
                        crit_rate: 0.06,
                        phys_or_mag: "mag",
                        variance: 1.10,
                        is_ult: false,
                        miss_rate: 0.05,
                        sfx_type: "darkmag"
                    }
                )
            );
        }
    ],
    [
        'Eclipse', function Eclipse() {
            return (
                RNG(
                    {
                        min: 13000,
                        crit_rate: 0.06,
                        phys_or_mag: "mag",
                        variance: 1.10,
                        is_ult: false,
                        miss_rate: 0.05,
                        sfx_type: "darkmag"
                    }
                )
            );
        }
    ],
    [
        'Shattered Mirror', function ShatteredMirror() {
            LowerSingle("m_def", 0.35)
            glass_shatter.play()
        }
    ],
    [
        'Nightmare Supernova', function NightmareSupernova() {
            statup_sfx.play();
            //Also restores her mp a good bit

            //make sure it doesn't go over the max
            if (sm.dmage_stats.get('mp')! + 80 > sm.dmage_stats.get('max_mp')!) {
                sm.dmage_stats.set('mp', sm.dmage_stats.get('max_p')!);
            } else {
                sm.dmage_stats.set('mp', (sm.dmage_stats.get('mp')! + 80));

            }

            return (
                RNG(
                    {
                        min: 62400,
                        phys_or_mag: "mag",
                        variance: 1.05,//lower for ults
                        is_ult: true,
                        sfx_type: "sn"
                    }
                )
            )

        }
    ],
    //assassin attacks
    [
        'Execution', function Execution() {

            LowerSingle("m_def", 0.20)
            LowerSingle("p_def", 0.20)
            return (
                RNG(
                    {
                        min: 9200,
                        crit_rate: 0.06,
                        phys_or_mag: "phys",
                        variance: 1.10,
                        is_ult: false,
                        miss_rate: 0.025,//assassin has half miss rate
                        sfx_type: "sword"
                    }
                )
            )
        }
    ],
    [
        'Backstab', function Backstab() {
            return (
                RNG(
                    {
                        min: 4000,
                        crit_rate: 0.50,
                        phys_or_mag: "phys",
                        variance: 1.10,
                        is_ult: false,
                        miss_rate: 0.025,
                        sfx_type: "sword"
                    }
                )
            )
        }
    ],
    [
        "Night's Whisper", function NightsWhisper() {
            //low damage, high chance to lower boss atk
            if (Percentage() < 0.60) {
                LowerSingle("atk", 0.30)

            }
            return (
                RNG(
                    {
                        min: 2800,
                        crit_rate: 0.25,
                        phys_or_mag: "phys",
                        variance: 1.10,
                        is_ult: false,
                        miss_rate: 0.025,
                        sfx_type: "sword"

                    }
                )
            )
        }
    ],
    [
        "Nightshade", function Nightshade() {
            return (
                RNG(
                    {
                        min: 25400,
                        crit_rate: 0.06,
                        phys_or_mag: "mag",
                        variance: 1.10,
                        is_ult: false,
                        miss_rate: 0.025,
                        sfx_type: "darkmag"

                    }
                )
            )
        }
    ],
    [
        "Dual Slash", function DualSlash() {
            //one or two hits 
            let min_dmg: number;
            if (Percentage() > .50) {
                min_dmg = 6400
            } else {
                min_dmg = 12800
            }
            return (
                RNG(
                    {
                        min: min_dmg,
                        crit_rate: 0.06,
                        phys_or_mag: "phys",
                        variance: 1.10,
                        is_ult: false,
                        miss_rate: 0.025,
                        sfx_type: "sword"
                    }
                )
            )
        }
    ],
    [ //assassin ult
        'Deathwind', function Deathwind() {

            //Greatly raises all player's ev
            StatBuff(player_ev_map, player_ev!.ev!.max, 0.40)
            return (
                RNG(
                    {
                        min: 58000,
                        phys_or_mag: "phys",
                        variance: 1.05,
                        is_ult: true,
                        sfx_type: "DW"
                    }
                )

            )
        }
    ],
    [
        'Smokescreen', function Smokescreen() {
            const as_ev = sm.assassin_stats.get("ev")!

            const max_ev = min_max_vals_map.get("player")!.ev!.max
            if (as_ev < max_ev) {
                sm.assassin_stats.set("ev", as_ev + 0.15)

            }
        }
    ],
    //red mage
    [   //Uses hp to deal huge dmg, doesn't miss
        'Border Of Life', function BorderOfLife() {
            return (
                RNG(
                    {
                        min: 26000,
                        crit_rate: .25,
                        phys_or_mag: "mag",
                        variance: 1.10,
                        is_ult: false,
                        sfx_type: "bol"
                    }
                )
            )
        }
    ],
    [   //Heavy phys, high crit rate
        'Bloody Vengeance', function BloodyVengeance() {
            return (
                RNG(
                    {
                        min: 13000,
                        crit_rate: 0.20,
                        phys_or_mag: "phys",
                        variance: 1.10,
                        is_ult: false,
                        miss_rate: 0.05,
                        sfx_type: "sword"
                    }
                )
            );
        }
    ],
    [
        //Hits 2-5 times 
        'Chain Lightning', function ChainLightning() {
            const num_of_hits = Randomizer(2, 6);

            return (
                RNG(
                    {
                        min: (4800 * num_of_hits),
                        crit_rate: 0.06,
                        phys_or_mag: "mag",
                        variance: 1.10,
                        is_ult: false,
                        miss_rate: 0.05,
                        sfx_type: "lightning",
                        sfx_count: num_of_hits,
                        is_cl: true
                    }
                )
            );
        }
    ],
    //Light physical damage and boss does nothing next turn
    //use a global let variable to determine if active. 
    //The first time the boss tries to attack but this is active, it deacivates.
    [
        'My Turn', function MyTurn() {

            is_my_turn_active = true;

            return (
                RNG(
                    {
                        min: 2560,
                        crit_rate: 0.06,
                        phys_or_mag: "phys",
                        variance: 1.10,
                        is_ult: false,
                        miss_rate: 0.05,
                        sfx_type: "swoosh"//wind sort of thing
                    }
                )
            )

        }
    ],
    [
        'Scarlet Subversion', function ScarletSubversion() {
            //Scales based on her current hp. 
            //Less hp = more damage
            const max_dmg = 150250;
            //then for every hp point she has, 
            //subtract 250 from the max damage
            const dmg = max_dmg - (sm.rmage_stats.get('hp')! * 250);
            //375 hp(max) = 6450 dmg
            //187 hp = 53450
            //1 hp = 100000 dmg
            return (
                RNG(
                    {
                        min: dmg,
                        phys_or_mag: "mag",
                        variance: 1.00, //no variance, purely based on hp 
                        is_ult: true,
                        sfx_type: "explosion"
                    }
                )
            )
        }
    ],
    [
        'Incinerate', function Incinerate() {
            return (

                RNG(
                    {
                        min: 42000,
                        phys_or_mag: "mag",
                        variance: 1.10,
                        is_ult: false,
                        sfx_type: "explosion"

                    }

                )

            )

        }

    ],
    [
        'Desperation', function Desperation() {
            return (
                RNG(
                    {
                        min: 1000,
                        crit_rate: 0.03,
                        phys_or_mag: "phys",
                        variance: 1.10,
                        is_ult: false,
                        miss_rate: 0.05,
                        sfx_type: "punch"
                    }
                )
            );
        }
    ],
]
);




export const rmage_ultima = "Scarlet Subversion"



export let selected_attack: string | null = null;
export let is_attack_triggered: boolean = false;

//cannot use state here, so we're doing it this way
//maybe change to use the map
export function PlayerAttack(attack: string) {
    if (is_my_turn_active === true) {
        is_my_turn_active = false;
    }



    selected_attack = attack;

    //function returns a damage value
    //temp, will use a global message to display the result
    let check = attacks_map.get(attack);
    if (check) {
        let result = check();


        if (typeof result === "object") {
            sm.boss_stats.set("hp", sm.boss_stats.get("hp")! - result.result)

        }
        return result;

    }
}


interface Attack {
    attack: string | null;
    player: string | null;
    is_player_turn: boolean;
    is_ultima: boolean;
}
const UltPathLookup: Map<string, string> = new Map(
    [
        [
            'Thousand Men', require('./assets/images/player/attacks/knight/Thousand Men.png')

        ],
        [
            'Nightmare Supernova', require('./assets/images/player/attacks/dmage/Nightmare Supernova.png')
        ],
        [
            'Deathwind', require('./assets/images/player/attacks/assassin/Deathwind.png')
        ],
        [
            'Scarlet Subversion', require('./assets/images/player/attacks/rmage/Scarlet Subversion.png')
        ],
    ]
)

export const ShowAttack: React.FC<Attack> = ({ attack, player, is_ultima }) => {
    //seperate image lookup for the ults

    useEffect(() => {
        AttackAnimation()
    }, [attack])
    if (is_ultima === true) {
        return (
            <img
                src={
                    attack !== null ?
                        UltPathLookup.get(attack) : undefined}
                className='w-1/4 ml-[41.5%] mt-[14%] z-[4] rounded-xl player-attack'
                style={{ position: 'absolute', top: 0, left: 0 }}
                loading='eager'>
            </img>

        )

    } else {
        if (player === null || attack === null) {
            return null;
        } else {
            return (
                <img
                    src={
                        attack === 'Desperation' ?
                            //no img for desperation, just sfx
                            null :
                            require(`./assets/images/player/attacks/${player}/${attack}.png`)}
                    className='w-1/4 ml-[41.5%] mt-[14%] z-[4] rounded-xl player-attack'
                    //prevents text from showing for desperation
                    alt={attack === 'Desperation' ? undefined : attack}
                    style={{ position: 'absolute', top: 0, left: 0 }}
                    loading='eager'
                />
            );
        }
    }
}


