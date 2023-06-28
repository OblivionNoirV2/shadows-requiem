
interface AttackData {
    description: string;
    mp_cost: number;
}
//holds descriptions and mp costs 
export const AttackEncyclopedia: Map<string, AttackData> = new Map
    (
        [
            [
                'Sword Slash', {
                    description: "A basic sword slash.",
                    mp_cost: 5
                }
            ],
            [
                'Whims Of Fate', {
                    description: "Is Lady Luck on your side today?",
                    mp_cost: 15
                }
            ]
        ]
    )


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