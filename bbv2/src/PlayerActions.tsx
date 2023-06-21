
import React, { useContext, useEffect, useState } from 'react';
import { BossContext } from './Context';
import { TurnNumberContext } from './Context';
import * as sm from './StatManagement';
import { type } from 'os';
import { all_player_defs } from './StatManagement';
import { AttackSfxLookup, playClickSfx } from './sfxManagement';
import { stat } from 'fs';



interface RNGProps {
    min: number;
    crit_rate: number;
    phys_or_mag: string;
    variance: number; //float to 2 dec points
    is_ult: boolean;
    miss_rate?: number;
    sfx_type: string;//run multiple times if lightning
    sfx_count?: number;
    is_cl?: boolean;
}
const convertToStat: { [key: string]: number } = {
    "phys": sm.boss_stats.p_def,
    "mag": sm.boss_stats.m_def
}

//if crit or miss, play a specific sfx
//for moves that don't use rng just look it up in the function itself
let miss_sfx = new Audio(AttackSfxLookup['miss']);
let crit_sfx = new Audio(AttackSfxLookup['crit']);
let healsfx = new Audio(AttackSfxLookup["heal"]);
let statup_sfx = new Audio(AttackSfxLookup["statup"]);
export type RNGResult = string | { result: number, crit: boolean };

function RNG(props: RNGProps) {

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
                setTimeout(playNext, 500);  // Play the next one after 500 ms
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

    //account for defense
    const result = (
        (calculated_damage / convertToStat[props.phys_or_mag])
    ).toFixed(2);
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
}

function Randomizer(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
}

//can stack, to a max of +50%
export const attacks_object: { [attack: string]: Function } = {
    /*knight attacks*/

    //Standard attack
    'Sword Slash': function SwordSlash() {
        return (
            RNG(
                {
                    min: 4000,
                    crit_rate: 0.90,
                    phys_or_mag: "phys",
                    variance: 1.2,
                    is_ult: false,
                    miss_rate: 0.08,
                    sfx_type: "sword"
                }
            )
        );

    },
    //High risk high reward
    //Can range from 3181 to 23100(max damage with crit)
    'Whims Of Fate': function WhimsOfFate() {
        console.log("whims of fate")
        return (
            RNG(
                {
                    min: 7000,
                    crit_rate: 0.35,
                    phys_or_mag: "phys",
                    variance: 2.2,
                    is_ult: false,
                    miss_rate: 0.35,
                    sfx_type: "dice"
                }
            )
        )

    },
    //med-heavy damage, slightly higher crit rate
    'Deathblow': function Deathblow() {
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
    },
    //also lowers defense for 60 seconds

    //use icons to indicate stat debuffs for boss

    'Skull Crusher': function SkullCrusher() {
        //there's a cap on how much you can lower it
        if (sm.boss_stats.p_def > 0.60) {
            if (Randomizer(0, 100) < 50) {
                sm.boss_stats.p_def -= parseFloat(0.10.toFixed(2));
                console.log("defense lowered", sm.boss_stats.p_def);
                setTimeout(() => {
                    sm.boss_stats.p_def += 0.10;
                    console.log("defense restored", sm.boss_stats.p_def);

                }, 60000);

            }
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
    },

    //Raises entire parties def for 90 seconds
    //won't return anything
    'Rebellion': function Rebellion() {
        statup_sfx.play();
        sm.player_pdef_list.forEach((player_def_ref) => {
            //2.5 cap
            if (player_def_ref.key in player_def_ref.stat &&
                player_def_ref.stat[player_def_ref.key] < 2.50) {

                player_def_ref.stat[player_def_ref.key] += 0.25;

                console.log(player_def_ref.stat[player_def_ref.key]);

                setTimeout(() => {
                    if (player_def_ref.key in player_def_ref.stat) {
                        player_def_ref.stat[player_def_ref.key] -= 0.25;
                    }
                }, 90000);
            }
        });
    },

    //ult
    'Thousand Men': function ThousandMen() {

    },

    /*mage attacks*/
    //moderate phys attack, cannot miss
    'Mirage Blade': function MirageBlade() {
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
    },
    //Rebellion but for mag def, change 
    'Crystallize': function Crystallize() {
        statup_sfx.play();
        sm.player_mdef_list.forEach((player_def_ref) => {
            //2.5 cap
            if (player_def_ref.key in player_def_ref.stat &&
                player_def_ref.stat[player_def_ref.key] < 2.50) {

                player_def_ref.stat[player_def_ref.key] += 0.25;

                console.log(player_def_ref.stat[player_def_ref.key]);

                setTimeout(() => {
                    if (player_def_ref.key in player_def_ref.stat) {
                        player_def_ref.stat[player_def_ref.key] -= 0.25;
                    }
                }, 90000);
            }
        });


    },
    //moderate mag attack
    'Black Fire': function BlackFire() {
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
        )
    },
    //heavy mag attack
    "Eclipse": function Eclipse() {
        return (
            RNG(
                {
                    min: 13000,
                    crit_rate: 0.08,
                    phys_or_mag: "mag",
                    variance: 1.1,
                    is_ult: false,
                    miss_rate: 0.08,
                    sfx_type: "darkmag"
                }
            )
        )

    },
    //cut boss mdef by 0.3 for 30 sec
    'Shattered Mirror': function ShatteredMirror() {

    },

    'Radiant Supernova': function RadiantSupernova() {

    },

    /*wmage attacks*/
    //light magic atk
    'Pierce Evil': function PierceEvil() {

        healsfx.play();

    },
    //heals all by 40% of their max hp
    'Radiant Sky': function RadiantSky() {
        healsfx.play();

    },
    //revives one with 1/2 hp
    'Rebirth': function Rebirth() {
        healsfx.play();

    },
    //heals one by 80% of their max hp
    'Moonlight': function Moonlight() {
        healsfx.play();

    },
    //Removes status effects from one
    'Purification': function Purification() {
        healsfx.play();

    },
    //Fully restores party hp/mp and removes any ailments
    'Supreme Altar': function SupremeAltar() {


    },

    /*rmage attacks*/
    //Cuts own hp in exchange for huge damage on next turn
    //SS already scales with hp and isn't affected by this
    //Her gimmick is she does the most damage, but is fragile
    'Border Of Life': function BorderOfLife() {

    },

    'Bloody Vengeance': function BloodyVengeance() {

    },

    'Chain Lightning': function ChainLightning() {
        //This one is unique in that it runs 2-5 times

        const lightning_results: RNGResult[] = [];
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

        )

    },

    'My Turn': function MyTurn() {

    },

    //ult
    'Scarlet Subversion': function ScarletSubversion() {

    }
};
//holds descriptions and mp costs 
export const AttackEncyclopedia: { [key: string]: [string, number] } = {

}
export const knight_attacks = [
    "Sword Slash", //light
    "Whims Of Fate",
    "Deathblow", //med-heavy
    "Rebellion",
    "Skull Crusher" //very heavy, lowers boss def
]
//ultima should appear as the 6th attack once the bar is full
export const knight_ultima = "Thousand Men";
//Buttons are formed from these 
export const dmage_attacks = [
    "Mirage Blade",
    "Crystallize",
    "Black Fire",
    "Shattered Mirror", //heavily lowers boss m def
    "Eclipse"
]
export const dmage_ultima = "Radiant Supernova"
export const wmage_attacks = [
    "Pierce Evil",
    "Radiant Sky",
    "Rebirth",
    "Moonlight",
    "Purification",
]
export const wmage_ultima = "Supreme Altar"
export const rmage_attacks = [
    "Border Of Life",
    "Bloody Vengeance",
    "Chain Lightning",
    "My Turn",
    "Hypervelocity"
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
    let result = attacks_object[attack]();
    console.log("result type:", typeof result)

    if (typeof result === "object") {
        new_set_hp -= result.result;
        //getting NaN here
        console.log("hp_subtracted: ", new_set_hp)

    }
    return result;

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
                src={require(`./assets/images/player/attacks/${player}/${attack}.png`)}
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