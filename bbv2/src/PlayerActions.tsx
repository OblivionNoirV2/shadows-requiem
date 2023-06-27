
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

type phys_or_mag = 'phys' | 'mag';

interface RNGProps {
    min: number;
    crit_rate: number;
    phys_or_mag: phys_or_mag;
    variance: number; //float to 2 dec points
    is_ult: boolean;
    miss_rate?: number;
    sfx_type: string;//run multiple times if lightning
    sfx_count?: number;
    is_cl?: boolean;
}
//export so we can use them to display status icons for the boss 
export let phys = sm.boss_stats.get('p_def');
export let mag = sm.boss_stats.get('m_def');

let difficulty_stats = boss_stat_changes.get(selected_difficulty);
export const getConvertToStat = () => (
    {
        "phys":
            (
                phys !== undefined &&
                    difficulty_stats !== undefined ?
                    phys * difficulty_stats.def : 0 //should never be 0 but it satisifies TS
            ),
        "mag":
            (
                mag !== undefined &&
                    difficulty_stats !== undefined ?
                    mag * difficulty_stats.def : 0
            ),
    }
);


//if crit or miss, play a specific sfx
//for moves that don't use rng just look it up in the function itself
let miss_sfx = new Audio(AttackSfxLookup['miss']);
let crit_sfx = new Audio(AttackSfxLookup['crit']);
let healsfx = new Audio(AttackSfxLookup["heal"]);
let statup_sfx = new Audio(AttackSfxLookup["statup"]);
let statdown_sfx = new Audio(AttackSfxLookup["statdown"]);
let glass_shatter = new Audio(AttackSfxLookup["glass"]);
export type RNGResult = string | { result: number, crit: boolean };

function RNG(props: RNGProps) {
    console.log("in rng", selected_difficulty)


    const sfx = new Audio(AttackSfxLookup[props.sfx_type]);
    sfx.volume = 0.2;
    console.log("sfx: ", sfx);
    let playCount = 0;
    function playNext() {
        if (props.sfx_count) {
            if (playCount < props.sfx_count) {
                const clone = new Audio(sfx.src);
                clone.volume = sfx.volume;
                clone.play();
                playCount++;
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
    if (!props.is_ult) {
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
    const converted = getConvertToStat();
    //account for defense
    const result = (
        (calculated_damage / converted[props.phys_or_mag])
    ).toFixed(2);
    console.log(selected_difficulty)
    console.log("def value", converted[props.phys_or_mag])
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

function Randomizer(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
}


function StatBuffDebuff(stat_map: Map<string, number | undefined>,
    min_val: number, max_val: number) {
    statup_sfx.play();
    stat_map.forEach((value, key, map) => {
        if (value !== undefined && value < max_val) {
            map.set(key, value + 0.25);
            console.log(key, map.get(key));
            setTimeout(() => {
                let current_value = map.get(key);
                //makes sure we don't lower it too low
                if (current_value !== undefined
                    && current_value > min_val) {
                    //Decrease the defense value
                    map.set(key, current_value - 0.25);
                }
            }, 90000);
        }
    }
    );

}
export const attacks_map: Map<string, Function> = new Map([
    /*knight attacks*/

    [
        'Sword Slash', function SwordSlash() {
            return (
                RNG(
                    {
                        min: 4000,
                        crit_rate: 0.08,
                        phys_or_mag: "phys",
                        variance: 1.20,
                        is_ult: false,
                        miss_rate: 0.08,
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
                        miss_rate: 0.08,
                        sfx_type: "sword"
                    }
                )
            );
        }
    ],

    [
        'Skull Crusher', function SkullCrusher() {
            let bossminmax = min_max_vals_map.get("boss");
            let boss_pdef = sm.boss_stats.get('p_def');
            //only reduce the defense if it's higher than the threshold
            //of 0.60
            //todo: use a map for that instead of hardcoding
            if (bossminmax && boss_pdef !== undefined && boss_pdef > 0.60
                && Randomizer(0, 100) < bossminmax["p_def"].min) {
                // Decrease the defense value
                sm.boss_stats.set('p_def', boss_pdef - parseFloat(0.10.toFixed(2)));
                console.log("defense lowered", sm.boss_stats.get('p_def'));

                setTimeout(() => {
                    // Restore the original defense value
                    sm.boss_stats.set('p_def', boss_pdef! + parseFloat(0.10.toFixed(2)));
                    console.log("defense restored", sm.boss_stats.get('p_def'));
                }, 60000);

            }
            return (
                RNG(
                    {
                        min: 10900,
                        crit_rate: 0.10,
                        phys_or_mag: "phys",
                        variance: 1.10,
                        is_ult: false,
                        miss_rate: 0.10,
                        sfx_type: "sword"
                    }
                )
            );
        }
    ],

    [
        'Rebellion', function Rebellion() {

            StatBuffDebuff(player_pdef_map, 0.60, 2.50);

        }
    ],

    ['Thousand Men', function ThousandMen() {
        // Function implementation for "Thousand Men"
    }],

    /*mage attacks*/

    [
        'Mirage Blade', function MirageBlade() {
            return (
                RNG(
                    {
                        min: 5700,
                        crit_rate: 0.08,
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
    //Rebellion but for mag def
    [
        'Crystallize', function Crystallize() {
            //use a map for that instead of hardcoding
            StatBuffDebuff(player_mdef_map, 0.60, 2.50);
        }
    ],
    [
        'Black Fire', function BlackFire() {
            return (
                RNG(
                    {
                        min: 8200,
                        crit_rate: 0.08,
                        phys_or_mag: "mag",
                        variance: 1.10,
                        is_ult: false,
                        miss_rate: 0.08,
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
                        crit_rate: 0.08,
                        phys_or_mag: "mag",
                        variance: 1.10,
                        is_ult: false,
                        miss_rate: 0.08,
                        sfx_type: "darkmag"
                    }
                )
            );
        }
    ],
    [
        'Shattered Mirror', function ShatteredMirror() {
            glass_shatter.play();
            if (mag !== undefined && mag > .60) {
                setTimeout(() => {
                    statdown_sfx.play();
                }, 500)
                mag -= .40;
                console.log("mdef lowered", mag);
                setTimeout(() => {
                    if (mag !== undefined) {
                        mag += 0.30;
                        console.log("mdef restored", mag);
                    }

                }, 30000);
            }
        }
    ],
    ['Radiant Supernova', function RadiantSupernova() {

    }],
    [
        'Pierce Evil', function PierceEvil() {
            healsfx.play();
            return (
                RNG(
                    {
                        min: 3500,
                        crit_rate: 0.08,
                        phys_or_mag: "mag",
                        variance: 1.10,
                        is_ult: false,
                        miss_rate: 0.08,
                        sfx_type: "lightmag"
                    }
                )
            );
        }
    ],
    ['Radiant Sky', function RadiantSky() {
        healsfx.play();

    }],
    ['Rebirth', function Rebirth() {
        healsfx.play();

    }],
    ['Moonlight', function Moonlight() {
        healsfx.play();

    }],
    ['Purification', function Purification() {
        healsfx.play();

    }],
    ['Supreme Altar', function SupremeAltar() {

    }],
    ['Border Of Life', function BorderOfLife() {

    }],
    ['Bloody Vengeance', function BloodyVengeance() {
        return (
            RNG(
                {
                    min: 13000,
                    crit_rate: 0.20,
                    phys_or_mag: "phys",
                    variance: 1.10,
                    is_ult: false,
                    miss_rate: 0.08,
                    sfx_type: "sword"
                }
            )
        );
    }],
    ['Chain Lightning', function ChainLightning() {
        const num_of_hits = Randomizer(2, 6);

        return (
            RNG({
                min: (4800 * num_of_hits),
                crit_rate: 0.08,
                phys_or_mag: "mag",
                variance: 1.10,
                is_ult: false,
                miss_rate: 0.08,
                sfx_type: "lightning",
                sfx_count: num_of_hits,
                is_cl: true
            })
        );
    }],
    ['My Turn', function MyTurn() {

    }],
    ['Scarlet Subversion', function ScarletSubversion() {

    }],
    ['Desperation', function Desperation() {
        return (
            RNG(
                {
                    min: 800,
                    crit_rate: 0.04,
                    phys_or_mag: "phys",
                    variance: 1.10,
                    is_ult: false,
                    miss_rate: 0.08,
                    sfx_type: "punch"
                }
            )
        );
    }],
]);


//holds descriptions and mp costs 

export const AttackEncyclopedia: Map<string, object> = new Map([
    [
        'Sword Slash', {
            description: "A basic sword slash.",
            mp_cost: 0
        }
    ],
])



export const knight_attacks = [
    "Sword Slash", //light
    "Whims Of Fate",
    "Deathblow", //med-heavy
    "Rebellion",
    "Skull Crusher", //very heavy, 50% chance lowers boss def
    "Desperation" //Everyone has this. Last resort, weak, costs nothing
]
//ultima should appear as the 6th attack once the bar is full
export const knight_ultima = "Thousand Men";
//Buttons are formed from these 
export const dmage_attacks = [
    "Mirage Blade",
    "Crystallize",
    "Black Fire",
    "Shattered Mirror", //heavily lowers boss m def
    "Eclipse",
    "Desperation"
]
export const dmage_ultima = "Radiant Supernova"
export const wmage_attacks = [
    "Pierce Evil",
    "Radiant Sky",
    "Rebirth",
    "Moonlight",
    "Purification",
    "Desperation"
]
export const wmage_ultima = "Supreme Altar"
export const rmage_attacks = [
    "Border Of Life",
    "Bloody Vengeance",
    "Chain Lightning",
    "My Turn",
    "Hypervelocity",
    "Desperation"
]
export const rmage_ultima = "Scarlet Subversion"


export function Shadow_Self() {
    console.log("Shadow Self");
}

export let selected_attack: string | null = null;
export let is_attack_triggered: boolean = false;

//cannot use state here, so we're doing it this way
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

//use this outcome to display a message
//returns either a miss message or an object with the damage and crit message




interface Attack {
    attack: string | null;
    player: string | null;
    isPlayerTurn: boolean;
}
//Need to add in checks to make sure it's the right character, 
//and de select the attack when it's done 
//Also need to lock the menus when an attack is happening
//And needs to show when button is clicked, not the character
export const ShowAttack: React.FC<Attack> = ({ attack, player }) => {
    console.log("inside show attack:" + player, attack)

    //console.log("turn number:" + turn_number)
    if (player === null || attack === null) {
        return null;
    } else {
        return (
            <img
                src={
                    attack == 'Desperation' ?
                        //no img for desperation, just sfx
                        null :
                        require(`./assets/images/player/attacks/${player}/${attack}.png`)}
                className='w-1/4 ml-[41.5%] mt-[14%] z-[4] rounded-xl '
                alt='attack image'
                style={{ position: 'absolute', top: 0, left: 0 }}
            />
        );

    }

}


/*
Flash the image, then call the attack function with the props already 
passed over here

*/