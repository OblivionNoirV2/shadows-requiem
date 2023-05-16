import * as sm from './StatManagement';

/*It is crucial that ALL stat and status changes take place in this file. 
For my own sanity. */

/*All attacks are handled in the PlayerAttack function, so no need 
to export these*/
//attack has a string key, and a function value
const attacks_object: { [attack: string]: Function } = {
    /*knight attacks*/
    'ShadowSelf': function ShadowSelf() {

    },

    'WhimsOfFate': function WhimsOfFate() {

    },

    'Deathblow': function Deathblow() {

    },

    'Rebellion': function Rebellion() {

    },

    //ult
    'ThousandMen': function ThousandMen() {

    },

    /*mage attacks*/
    'MirageBlade': function MirageBlade() {

    },

    'Entrapment': function Entrapment() {

    },

    'BlackFire': function BlackFire() {

    },

    'ShatteredMirror': function ShatteredMirror() {

    },

    'RadiantSupernova': function RadiantSupernova() {

    },

    /*wmage attacks*/
    'PierceEvil': function PierceEvil() {

    },

    'RadiantSky': function RadiantSky() {

    },

    'Rebirth': function Rebirth() {

    },

    'Moonlight': function Moonlight() {

    },

    'SupremeAltar': function SupremeAltar() {

    },

    /*rmage attacks*/
    'BorderOfLife': function BorderOfLife() {

    },

    'BloodyVengeance': function BloodyVengeance() {

    },

    'ChainLightning': function ChainLightning() {

    },

    'MyTurn': function MyTurn() {

    },

    //ult
    'ScarletSubversion': function ScarletSubversion() {

    }
};

//triggers for the image showing
export const effect_dependencies = [
    attacks_object['ShadowSelf'],
    attacks_object['WhimsOfFate'],
    attacks_object['Deathblow'],
    attacks_object['Rebellion'],
    attacks_object['ThousandMen'],
    attacks_object['MirageBlade'],
    attacks_object['Entrapment'],
    attacks_object['BlackFire'],
    attacks_object['ShatteredMirror'],
    attacks_object['RadiantSupernova'],
    attacks_object['PierceEvil'],
    attacks_object['RadiantSky'],
    attacks_object['Rebirth'],
    attacks_object['Moonlight'],
    attacks_object['SupremeAltar'],
    attacks_object['BorderOfLife'],
    attacks_object['BloodyVengeance'],
    attacks_object['ChainLightning'],
    attacks_object['MyTurn'],
    attacks_object['ScarletSubversion']
];

export const knight_attacks = [
    "Shadow Self",
    "Whims of Fate",
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
    "Border of Life",
    "Bloody Vengeance",
    "Chain Lightning",
    "My Turn"
]
export const rmage_ultima = "Scarlet Subversion"


export function Shadow_Self() {
    console.log("Shadow Self");
}
//This one does the actual damage
export function PlayerAttack(attack: string) {
    attacks_object[attack]();
}

//and this one shows the image 
//Ultimas also change the background
export function ShowAttack(attack: string, player: string, is_ultima: boolean) {
    return (
        <img
            src={require(`./assets/images/player/attacks/${player}/${attack}.png`)} // replace with your actual overlay image
            className='atk-image'
            alt='attack image'
            style={{ position: 'absolute', top: 0, left: 0 }}
        />
    );
}

/*
Click the attack button, which triggers a UseEffect 
(passing in the player and attack), which calls 
ShowAttack and renders the return. The image then disappears after 
a couple seconds then PlayerAttack is called with the same parameters, 
which does the damage.

*/