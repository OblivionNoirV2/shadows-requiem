
import React, { useContext, useEffect, useState } from 'react';
import { BossContext } from './Context';
import { TurnNumberContext } from './Context';
import * as sm from './StatManagement';
import { type } from 'os';
import { all_player_defs } from './StatManagement';


const attack_sfx: { [key: string]: string } = {

}
function playAttackSfx() {

}
export function MissCheck(missed: boolean) {
    if (missed) {
        return (
            <h1>Missed!</h1>
        )
    }
    return null;
}
interface RNGProps {
    min: number;
    crit_rate: number;
    phys_or_mag: string;
    variance: number; //float to 2 dec points
    is_ult: boolean;
    miss_rate?: number;
}
const convertToStat: { [key: string]: number } = {
    "phys": sm.boss_stats.p_def,
    "mag": sm.boss_stats.m_def
}

//default crit rate is 5%, so 0.05. 1.5x damage, ults cannot crit
//if crit, play a specific sfx

export type RNGResult = "Missed!" | { result: number, crit: boolean };
function RNG(props: RNGProps) {

    let miss: boolean;
    //calc a miss if miss rate is defined
    if (props.miss_rate) {
        miss = Math.random() < props.miss_rate;
        if (miss) {
            return "Missed!";
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
    }
    console.log("is crit: " + crit);
    console.log("calculated damage: " + calculated_damage);

    //account for defense
    const result = (
        (calculated_damage / convertToStat[props.phys_or_mag])
    ).toFixed(2);

    console.log("attack result: ", parseInt(result));
    return {
        result: parseInt(result),
        crit: crit,
    };
}

//nothing can stack, so check if the status is already there
export const attacks_object: { [attack: string]: Function } = {
    /*knight attacks*/

    //Standard attack
    'Sword Slash': function SwordSlash() {
        return (
            RNG(
                {
                    min: 4000,
                    crit_rate: 0.08,
                    phys_or_mag: "phys",
                    variance: 1.2,
                    is_ult: false,
                    miss_rate: 0.08
                }
            )
        );

    },
    //High risk high reward
    //Can range from 3181 to 23100(max damage with crit)
    'Whims Of Fate': function WhimsOfFate(): RNGResult {
        console.log("whims of fate")
        return (
            RNG(
                {
                    min: 7000,
                    crit_rate: 0.35,
                    phys_or_mag: "phys",
                    variance: 2.2,
                    is_ult: false,
                    miss_rate: 0.35
                }
            )
        )

    },
    //med-heavy damage, slightly higher crit rate
    'Deathblow': function Deathblow(): RNGResult {
        return (
            RNG(
                {
                    min: 7800,
                    crit_rate: 0.12,
                    phys_or_mag: "phys",
                    variance: 1.20,
                    is_ult: false,
                    miss_rate: 0.08
                }
            )
        );
    },
    //also lowers defense for 60 seconds

    //use icons to indicate stat debuffs for boss
    'Skull Crusher': function SkullCrusher(): RNGResult {


        console.log("original", sm.boss_stats.p_def);
        sm.boss_stats.p_def -= parseFloat(0.20.toFixed(2));
        console.log("defense lowered", sm.boss_stats.p_def);

        setTimeout(() => {
            sm.boss_stats.p_def += 0.20;
            console.log("defense restored", sm.boss_stats.p_def);

        }, 60000);

        return (
            RNG(
                {
                    min: 10900,
                    crit_rate: 0.08,
                    phys_or_mag: "phys",
                    variance: 1.10,
                    is_ult: false,
                    miss_rate: 0.10
                }
            )
        );
    },

    //Raises entire parties def and mdef by 1.5x for 90 seconds
    //won't return anything
    'Rebellion': function Rebellion() {
        console.log(all_player_defs)



    },

    //ult
    'Thousand Men': function ThousandMen() {

    },

    /*mage attacks*/
    //moderate phys attack, cannot miss
    'Mirage Blade': function MirageBlade() {

    },
    //freezes boss for 2 turns
    'Entrapment': function Entrapment() {

    },
    //moderate mag attack
    'Black Fire': function BlackFire() {

    },
    //heavy mag attack
    "Eclipse": function Eclipse() {

    },
    //cut boss def and mdef by 30% for 3 turns
    'Shattered Mirror': function ShatteredMirror() {

    },

    'Radiant Supernova': function RadiantSupernova() {

    },

    /*wmage attacks*/
    //light magic atk
    'Pierce Evil': function PierceEvil() {

    },
    //heals all by 40% of their max hp
    'Radiant Sky': function RadiantSky() {

    },
    //revives one with 1/2 hp
    'Rebirth': function Rebirth() {

    },
    //heals one by 80% of their max hp
    'Moonlight': function Moonlight() {

    },
    //Removes status effects from one
    'Purification': function Purification() {

    },
    //Fully restores party hp/mp and removes any ailments
    'Supreme Altar': function SupremeAltar() {

    },

    /*rmage attacks*/
    //Cuts own hp in exchange for huge damage on next turn
    //SS already scales with hp and isn't affected by this
    'Border Of Life': function BorderOfLife() {

    },

    'Bloody Vengeance': function BloodyVengeance() {

    },

    'Chain Lightning': function ChainLightning() {

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
    "Entrapment",
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
export let new_set_hp: number = 999999;
export function PlayerAttack(attack: string, BossHP: number, setBossHP: (hp: number) => void) {
    selected_attack = attack;
    console.log("inside playerattack, attack:" + attack);
    //function returns a damage value
    //temp, will use a global message to display the result
    let result = attacks_object[attack]();

    if (typeof result === "object") {
        new_set_hp -= result.result;
        console.log("hp_subtracted: ", new_set_hp)

    }


    is_attack_triggered = !is_attack_triggered;
    //use this outcome to display a message
    //returns either a miss message or an object with the damage and crit message
    return attacks_object[attack]();
}


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