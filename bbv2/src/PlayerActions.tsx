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
//triggers for the image showing
export const effect_dependencies = [
    ShadowSelf,
    WhimsOfFate,
    Deathblow,
    Rebellion,
    ThousandMen,
    MirageBlade,
    Entrapment,
    BlackFire,
    ShatteredMirror,
    RadiantSupernova,
    PierceEvil,
    AngelsGrace,
    Rebirth,
    Moonlight,
    SupremeAltar,
    BorderOfLife,
    BloodyVengeance,
    ChainLightning,
    MyTurn,
    ScarletSubversion
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
//This one does the actual damage
export function PlayerAttack(attack: string, player: string) {
    console.log(attack);
}

//and this one shows the image 
export function ShowAttack(attack: string, player: string) {
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