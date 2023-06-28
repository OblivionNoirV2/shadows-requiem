
interface AttackData {
    description: string;
    mp_cost?: number; //because ultima and desperation have no mp cost
}
//holds descriptions and mp costs 
/*
short time = 30sec
moderate time = 60sec
a while= 90sec
*/
export const AttackEncyclopedia: Map<string, AttackData> = new Map
    (
        [
            //knight
            [
                'Sword Slash', {
                    description: "A basic sword slash. Light physical damage.",
                    mp_cost: 4
                }
            ],
            [
                'Whims Of Fate', {
                    description: "Is Lady Luck on your side today?",
                    mp_cost: 15
                }
            ],
            [
                'Deathblow', {
                    description: "A powerful sword slash. Moderate physical damage.",
                    mp_cost: 8
                }
            ],
            [
                'Rebellion', {
                    description: "Slightly raises everyone's physical defense for a moderate time. ",
                    mp_cost: 20
                }
            ],
            [
                'Skull Crusher', {
                    description: "A brutal sword slam with a chance to lower physical defense for a moderate time. Heavy physical damage.",
                    mp_cost: 15
                }
            ],
            [
                'Thousand Men', {
                    description: "Unleash an army of pain upon the enemy. Reduces boss attack for a while.",

                }
            ],

            //dmage
            [
                'Mirage Blade', {
                    description: "Attack with a blade of dark energy. Cannot miss. Low-moderate physical damage.",
                    mp_cost: 12
                }
            ],
            [
                'Crystallize', {
                    description: "Slightly raises everyone's magic defense for a moderate time.",
                    mp_cost: 20
                }
            ],
            [
                'Black Fire', {
                    description: "Attack with a ball of dark fire. Moderate magic damage.",
                    mp_cost: 14
                }

            ],
            [
                'Shattered Mirror', {
                    description: "Greatly reduces the King's magic defense for a short time.",
                    mp_cost: 15
                }
            ],
            [
                'Eclipse', {
                    description: "Eclipse the very sun itself. Heavy magic damage.",
                    mp_cost: 23

                }
            ],
            [
                'Nightmare Supernova', {
                    description: "Unleash a supernova of darkness upon the enemy. Deals huge magic damage and restores the user's MP a bit.",

                }
            ],
            //wmage
            [
                'Pierce Evil', {
                    description: "Attack with a blade of holy energy. Low magic damage.",
                    mp_cost: 6
                }
            ],
            [
                'Radiant Sky', {
                    description: "Restores everyone's HP by a small amount.",
                    mp_cost: 20
                }
            ],
            [
                'Rebirth', {
                    description: "Revive a fallen ally with most of their HP.",
                    mp_cost: 35
                }
            ],
            [
                'Moonlight', {
                    description: "Heal one ally by a large amount",
                    mp_cost: 20
                }
            ],
            [
                'Purification', {
                    description: "Relieves one ally of all status effects.",
                    mp_cost: 10
                }
            ],
            [
                'Supreme Altar', {
                    description: "Fully restores entire party's HP and MP, and removes any status effects."
                }
            ],
            //rmage
            [   //Since this one CAN kill you, there's no need to check for sufficient hp
                'Border Of Life', {
                    description: "Sacrifice your own life force to deal huge magic damage. Uses HP insteasd of MP.",
                    mp_cost: 0
                }
            ],
            [
                'Bloody Vengeance', {
                    description: "A vicious scythe attack that deals heavy physical damage with a high critical rate.",
                    mp_cost: 28
                }
            ],
            [
                'Chain Lightning', {
                    description: "2-5 lightning strikes in quick succession. Deals magic damage.",
                    mp_cost: 35
                }
            ],
            [ //Short timer, 15 sec or so
                'My Turn', {
                    description: "Negates the King's turns for a very short period",
                    mp_cost: 40
                }
            ],
            [
                'Hypervelocity', {
                    description: "Slightly raises everyone's evasion for a moderate time.",
                    mp_cost: 20
                }
            ],
            //Everyone has this
            [
                'Desperation', {
                    description: "Absolute last resort, costs nothing but does hardly anything. You are essentially smacking him with a wet noodle. Physical damage.",
                    mp_cost: 0
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
    "Desperation"
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
export const dmage_ultima = "Nightmare Supernova"
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