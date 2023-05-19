import * as sm from './StatManagement';
import React, { useContext, useEffect, useState } from 'react';
import { BossContext } from './Context';
/*It is crucial that ALL stat and status changes take place in this file. 
For my own sanity. */

/*All attacks are handled in the PlayerAttack function, so no need 
to export these*/
//attack has a string key, and a function value


export const attacks_object: { [attack: string]: Function } = {
    /*knight attacks*/
    'Shadow Self': function ShadowSelf() {

    },

    'Whims Of Fate': function WhimsOfFate() {

    },

    'Deathblow': function Deathblow() {

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
//state should start here...
export function PlayerAttack(attack: string, bossHP: number, setBossHP: (hp: number) => void) {
    selected_attack = attack;
    console.log("inside playerattack, attack:" + attack);
    //temporary
    let newHp = bossHP - 10000;
    setBossHP(newHp);
    console.log("boss hp:" + newHp);
    is_attack_triggered = !is_attack_triggered;
    attacks_object[attack]();
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