
import React, { useContext, useEffect, useState } from 'react';
import { BossContext } from './Context';
import * as sm from './StatManagement';


/*All attacks are handled in the PlayerAttack function, so no need 
to export these*/
//attack has a string key, and a function value
interface RNGProps {
    min: number;
    crit_rate: number;
    phys_or_mag: string;
    is_ult: boolean;
}
//default crit rate is 5%, so 0.05. 1.5x damage, ults cannot crit
//if crit, play a specific sfx
function RNG(props: RNGProps) {
    //min is the "normal" damage, max is calculated from a 10% variance
    const max = props.min * 1.1;
    let crit: boolean;
    //bool to check for crit if it's not an ult
    if (!props.is_ult) {
        crit = Math.random() < props.crit_rate;
    } else {
        //always false if it's an ult
        crit = false;
    }
    let calculated_damage = Math.floor(Math.random() * (max - props.min) + props.min);

    if (crit == true) {
        calculated_damage *= 1.5;
    }
    console.log("is crit: " + crit);
    console.log("calculated damage: " + calculated_damage);
    //account for defense
    if (props.phys_or_mag === "phys") {
        return (calculated_damage / sm.boss_stats.p_def);
    } else {
        return (calculated_damage / sm.boss_stats.m_def);
    }
}
//nothing can stack, so check if the status is already there
export const attacks_object: { [attack: string]: Function } = {
    /*knight attacks*/

    //Doubles EV, 1.5x def for 3 turns 
    'Shadow Self': function ShadowSelf() {
        //calls update stats, this function will maintain 
        //a list of status effects and their durations


    },

    'Whims Of Fate': function WhimsOfFate() {

    },
    //Heavy damage, high crit rate
    'Deathblow': function Deathblow() {
        return (
            RNG(
                {
                    min: 100000,
                    crit_rate: 0.20,
                    phys_or_mag: "phys",
                    is_ult: false
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
    let newHp = BossHP - attacks_object[attack]();
    setBossHP(newHp);
    console.log("boss hp:" + newHp);
    is_attack_triggered = !is_attack_triggered;

    return BossHP;
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
                className='w-1/4 ml-[48.5%] mt-[14%] z-[4] rounded-xl '
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