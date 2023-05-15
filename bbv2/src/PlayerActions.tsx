import * as sm from './StatManagement';

/*It is crucial that ALL stat and status changes take place in this file. 
For my own sanity. */

/*All attacks are handled in the PlayerAttack function, so no need 
to export these*/

/*knight attacks*/
function ShadowSelf() {

};

function WhimsOfFate() {

};

function Deathblow() {

};

function Rebellion() {

};
//ult
function ThousandMen() {

};
/*dmage attacks*/
function MirageBlade() {

};

function Entrapment() {

};

function BlackFire() {

};

function ShatteredMirror() {

};
//ult
function RadiantSupernova() {

};

/*wmage attacks*/
function PierceEvil() {

};

function AngelsGrace() {

};

function Rebirth() {

};

function Moonlight() {

};
//ult
function SupremeAltar() {

};
/*rmage attacks*/
function BorderOfLife() {

};

function BloodyVengeance() {

};

function ChainLightning() {

};

function MyTurn() {

};
//ult
function ScarletSubversion() {

};

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
    "Angel's Grace",
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
//Use both parameters to filter more effectively
export function PlayerAttack(attack: string, player: string) {
    console.log(attack);
}

