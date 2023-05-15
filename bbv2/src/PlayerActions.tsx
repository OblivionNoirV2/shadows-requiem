//knight attacks



//dmage attacks 



//wmage attacks 



//rmage attacks




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
