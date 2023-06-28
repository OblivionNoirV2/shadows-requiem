
import React, { useContext, useEffect, useState } from 'react';
import { BossContext } from './Context';
import { TurnNumberContext } from './Context';
import * as sm from './StatManagement';
import { type } from 'os';
import { all_player_defs } from './StatManagement';
import { AttackSfxLookup, playClickSfx } from './sfxManagement';
import { stat } from 'fs';
import { boss_stat_changes } from './StatManagement';
import { selected_difficulty } from './StartMenu';
import { player_mdef_map, player_pdef_map } from './StatManagement';
import { min_max_vals_map } from './StatManagement';

type phys_or_mag = "phys" | "mag"



export const getConvertToStat = () => {
    //DO NOT TOUCH
    const difficulty_stats = boss_stat_changes.get(selected_difficulty);

    let phys = sm.boss_stats.get('p_def');
    let mag = sm.boss_stats.get('m_def');
    console.log("phys: ", phys);
    console.log("mag: ", mag);
    //stats here are wrong!
    console.log("difficulty_stats: ", difficulty_stats);
    //but this is right
    console.log("selected_difficulty: ", selected_difficulty);

    console.log("diff stats def", difficulty_stats!.def);

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
    console.log("in rng", selected_difficulty)


    const sfx = new Audio(AttackSfxLookup[props.sfx_type]);
    sfx.volume = 0.4;
    console.log("sfx: ", sfx);
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
    console.log("is crit: " + crit);

    console.log("calculated damage: " + calculated_damage);
    //won't update properly if I don't do this first?
    //this is correct
    console.log("in rng", selected_difficulty)
    const converted = getConvertToStat();

    //account for defense
    const result = (
        (calculated_damage / converted[props.phys_or_mag])
    ).toFixed(2);

    //console.log("def value", converted[props.phys_or_mag])
    let crit_msg: boolean;
    //don't show the crit message if it's cl, it would be misleading
    //since it's multiple attacks
    if (!props.is_cl) {
        crit_msg = crit;
    } else {
        crit_msg = false;
    }
    console.log("attack result: ", parseInt(result));
    return {
        result: parseInt(result),
        crit: crit_msg,
    };
};

export function Randomizer(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
}

//for raising all player stats
function StatBuffDebuff(stat_map: Map<string, number | undefined>,
    min_val: number, max_val: number) {
    statup_sfx.play();
    stat_map.forEach((value, key, map) => {
        if (value !== undefined && value < max_val) {
            map.set(key, value + 0.25);
            console.log(key, map.get(key));
            setTimeout(() => {
                const current_value = map.get(key);
                //makes sure we don't lower it too low
                if (current_value !== undefined
                    && current_value > min_val) {
                    //revert
                    map.set(key, current_value - 0.25);
                }
            }, 90000);
        }
    }
    );
}
const player_def = min_max_vals_map.get("player") as sm.Stats | undefined;
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
            let boss_pdef = sm.boss_stats.get('p_def');
            //only reduce the defense if it's higher than the threshold
            //of 0.60
            //todo: use a map for that instead of hardcoding
            if (bossminmax && boss_pdef !== undefined
                && boss_pdef > bossminmax["p_def"].min
                && Randomizer(0, 100) < 50) {
                statdown_sfx.play();
                //Decrease the defense value
                sm.boss_stats.set('p_def', boss_pdef - parseFloat(0.20.toFixed(2)));
                console.log("defense lowered", sm.boss_stats.get('p_def'));

                setTimeout(() => {
                    // Restore the original defense value
                    sm.boss_stats.set('p_def', boss_pdef! + parseFloat(0.20.toFixed(2)));
                    console.log("defense restored", sm.boss_stats.get('p_def'));
                }, 60000);

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
                StatBuffDebuff(
                    player_pdef_map,
                    player_def.p_def.min,
                    player_def.p_def.max
                );
            }
        }
    ],

    [
        'Thousand Men', function ThousandMen() {
            statup_sfx.play();
            //also reduces boss attack for a bit
            sm.boss_stats.set('p_atk', parseFloat((sm.boss_stats.get('p_atk')! - 0.30).toFixed(2)));
            setTimeout(() => {
                sm.boss_stats.set('p_atk', parseFloat((sm.boss_stats.get('p_atk')! + 0.30).toFixed(2)));
            }, 90000);
            return (
                RNG(
                    {
                        min: 55000,
                        phys_or_mag: "phys",
                        variance: 1.05,//lower for ults
                        is_ult: true,
                        sfx_type: "sword"//change
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
                StatBuffDebuff(
                    player_mdef_map,
                    player_def.m_def.min,
                    player_def.m_def.max
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
            let mag = sm.boss_stats.get('m_def');

            if (bossminmax && mag !== undefined
                && mag > bossminmax["m_def"].min) {
                glass_shatter.play();
                setTimeout(() => {
                    statdown_sfx.play();
                }, 500)
                sm.boss_stats.set('m_def', mag - parseFloat(0.30.toFixed(2)));
                console.log("mdef lowered", sm.boss_stats.get('m_def'));
                setTimeout(() => {
                    if (mag !== undefined) {
                        sm.boss_stats.set('m_def', mag + parseFloat(0.30.toFixed(2)));
                        console.log("mdef restored", sm.boss_stats.get('m_def'));
                    }
                }, 60000);
            }
        }
    ],
    [
        'Nightmare Supernova', function NightmareSupernova() {
            statup_sfx.play();
            //Also restores her mp a good bit

            //make sure it doesn't go over the max
            if (sm.dmage_stats.get('mp')! + 80 > sm.dmage_stats.get('maxmp')!) {
                sm.dmage_stats.set('mp', sm.dmage_stats.get('maxmp')!);
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
                        sfx_type: "sword"//change
                    }
                )
            )

        }
    ],
    [
        'Pierce Evil', function PierceEvil() {
            healsfx.play();
            return (
                RNG(
                    {
                        min: 3500,
                        crit_rate: 0.06,
                        phys_or_mag: "mag",
                        variance: 1.10,
                        is_ult: false,
                        miss_rate: 0.05,
                        sfx_type: "lightmag"
                    }
                )
            );
        }
    ],
    [
        //light heal, targets all
        'Radiant Sky', function RadiantSky() {
            healsfx.play();

        }
    ],
    [ //revives one with 66% hp
        'Rebirth', function Rebirth() {
            healsfx.play();

        }
    ],
    [   //Big heal, targets one
        'Moonlight', function Moonlight() {
            healsfx.play();

        }
    ],
    [ //Removes status effects from one
        'Purification', function Purification() {
            healsfx.play();

        }
    ],
    [   //Heals all, restores mp and removes any debuffs
        'Supreme Altar', function SupremeAltar() {

        }
    ],
    [   //Huge damage, but sacrifices hp instead of mp
        //This attack can kill her if she's not careful
        //Could be used to build up a SS
        'Border Of Life', function BorderOfLife() {

            return (
                RNG(
                    {
                        min: 18500,
                        crit_rate: 0.06,
                        phys_or_mag: "mag",
                        variance: 1.10,
                        is_ult: false,
                        miss_rate: 0.05,
                        sfx_type: "BOL" //sparkle?
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
    //boss does nothing next turn, ie immediately switches back to you
    [
        'My Turn', function MyTurn() {

        }
    ],
    [
        'Scarlet Subversion', function ScarletSubversion() {
            //Scales based on her current hp. 
            //Less hp = more damage
            const max_dmg = 100250;
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
    [   //like crystallize but for ev
        'Hypervelocity', function Hypervelocity() {

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
export let new_set_hp: number = 999999;

export function PlayerAttack(attack: string) {
    selected_attack = attack;
    console.log("inside playerattack, attack:" + attack);
    //function returns a damage value
    //temp, will use a global message to display the result
    let check = attacks_map.get(attack);
    if (check) {
        let result = check();
        console.log("result type:", typeof result)

        if (typeof result === "object") {
            new_set_hp -= result.result;

            console.log("hp_subtracted: ", new_set_hp)

        }
        return result;

    }
}


interface Attack {
    attack: string | null;
    player: string | null;
    isPlayerTurn: boolean;
}

export const ShowAttack: React.FC<Attack> = ({ attack, player }) => {
    console.log("inside show attack:" + player, attack)

    //console.log("turn number:" + turn_number)
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
                className='w-1/4 ml-[41.5%] mt-[14%] z-[4] rounded-xl'
                //prevents text from showing for desperation
                alt={attack === 'Desperation' ? undefined : attack}
                style={{ position: 'absolute', top: 0, left: 0 }}
            />
        );
    }
}


/*
Flash the image, then call the attack function with the props already 
passed over here

*/