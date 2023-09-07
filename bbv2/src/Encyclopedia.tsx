
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
                    description: "Is Lady Luck on your side today? Physical damage.",
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
                    mp_cost: 25
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
            //assassin
            [
                'Execution', {
                    description: "Deals moderate-heavy damage and greatly lowers both boss defenses.",
                    mp_cost: 28
                }
            ],
            [
                "Night's Whisper", {
                    description: "Deal a quick jab and disarm your opponent. Low damagem, high chance to lower boss attack.",
                    mp_cost: 10
                }
            ],
            [
                'Smokescreen', {
                    description: "Raises the entire party's evasion by a small amount.",
                    mp_cost: 20
                }
            ],
            [
                'Dual Slash', {
                    description: "Moderate physical damage, 50% chance of double damage",
                    mp_cost: 12
                }
            ],
            [
                'Nightshade', {
                    description: "Devour the enemy with creatures of another realm. Deals huge physical damage.",
                    mp_cost: 52
                }
            ],
            //rmage
            [   //Since this one CAN kill you, there's no need to check for sufficient hp
                'Border Of Life', {
                    description: "Sacrifice your own life force to restore MP. Uses HP instead of MP. Heavy magic damage.",
                    mp_cost: 125 //actually hp
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
            [
                'My Turn', {
                    description: "Deals light physical damage and forces the turn counter back by two. The King only attacks on even turns, so use this to your advantage",
                    mp_cost: 40
                }
            ],
            [
                'Incinerate', {
                    description: "An epic fire spell that deals massive magic damage",
                    mp_cost: 86
                }
            ],
            //Everyone has this
            [
                'Desperation', {
                    description: "Absolute last resort, costs nothing but does hardly anything. You are essentially smacking him with a wet noodle. Physical damage. Everyone has this attack",
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


//Buttons are formed from these 
export const dmage_attacks = [
    "Mirage Blade",
    "Crystallize",
    "Black Fire",
    "Shattered Mirror", //heavily lowers boss m def
    "Eclipse",
    "Desperation"
]

export const assassin_attacks = [
    "Execution",
    "Night's Whisper",
    "Smokescreen",
    "Nightshade",
    "Dual Slash",
    "Desperation",
]

export const rmage_attacks = [
    "Border Of Life",
    "Bloody Vengeance",
    "Chain Lightning",
    "My Turn",
    "Incinerate",
    "Desperation"
]

export const ultimas = [
    "Thousand Men",
    "Nightmare Supernova",
    "Deathwind",
    "Scarlet Subversion"
]