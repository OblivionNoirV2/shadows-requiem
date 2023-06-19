
import React, { useContext, useEffect, useState } from 'react';
import { BossContext } from './Context';
import * as sm from './StatManagement';
import { type } from 'os';


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
        calculated_damage / convertToStat[props.phys_or_mag]
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

    //Doubles EV, 1.5x def for 3 turns 
    'Shadow Self': function ShadowSelf() {
        //calls update stats, this function will maintain 
        //a list of status effects and their durations


    },
    //High risk high reward
    'Whims Of Fate': function WhimsOfFate() {

    },
    //Heavy damage, higher crit rate
    'Deathblow': function Deathblow(): RNGResult {
        return (
            RNG(
                {
                    min: 60000,
                    crit_rate: 0.90,
                    phys_or_mag: "phys",
                    variance: 1.10,
                    is_ult: false,
                    miss_rate: 0.90
                }
            )
        );
    },

    'Rebellion': function Rebellion() {

    },

    //ult
    'Thousand Men': function ThousandMen() {

    },

    /*mage attacks*/
    'Mirage Blade': function MirageBlade() {

    },

    'Entrapment': function Entrapment() {

    },

    'Black Fire': function BlackFire() {

    },

    'Shattered Mirror': function ShatteredMirror() {

    },

    'Radiant Supernova': function RadiantSupernova() {

    },

    /*wmage attacks*/
    'Pierce Evil': function PierceEvil() {

    },

    'Radiant Sky': function RadiantSky() {

    },

    'Rebirth': function Rebirth() {

    },

    'Moonlight': function Moonlight() {

    },

    'Supreme Altar': function SupremeAltar() {

    },

    /*rmage attacks*/
    'Border Of Life': function BorderOfLife() {

    },

    'Bloody Vengeance': function BloodyVengeance() {

    },

    'Chain Lightning': function ChainLightning() {

    },

    'My Turn': function MyTurn() {

    },

    //ult
    'ScarletSubversion': function ScarletSubversion() {

    }
};

export const knight_attacks = [
    "Shadow Self",
    "Whims Of Fate",
    "Deathblow",
    "Rebellion"
]
//ultima should appear to the right once the bar is full
export const knight_ultima = "Thousand Men";
export const dmage_attacks = [
    "Mirage Blade",
    "Entrapment",
    "Black Fire",
    "Shattered Mirror"
]
export const dmage_ultima = "Radiant Supernova"
export const wmage_attacks = [
    "Pierce Evil",
    "Radiant Sky",
    "Rebirth",
    "Moonlight"
]
export const wmage_ultima = "Supreme Altar"
export const rmage_attacks = [
    "Border Of Life",
    "Bloody Vengeance",
    "Chain Lightning",
    "My Turn"
]
export const rmage_ultima = "Scarlet Subversion"


export function Shadow_Self() {
    console.log("Shadow Self");
}

export let selected_attack: string | null = null;
export let is_attack_triggered: boolean = false;

export function PlayerAttack(attack: string, BossHP: number, setBossHP: (hp: number) => void) {
    selected_attack = attack;
    console.log("inside playerattack, attack:" + attack);
    //function returns a damage value
    //temp, will use a global message to display the result
    let newHp = BossHP - attacks_object[attack]();
    setBossHP(newHp);
    console.log("boss hp:" + newHp);
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