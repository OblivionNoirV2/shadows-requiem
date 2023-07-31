
export type player_stats = {
    hp: number,
    max_hp: number,
    mp: number,
    max_mp: number,
    p_def: number,
    d_p_def: number,//d = defaults to use for stat page
    m_def: number,
    d_m_def: number,
    d_ev: number,
    ev: number,
    [key: string]: number // Index signature
};


interface boss_stats {
    hp: number;
    max_hp: number;
    p_def: number;
    m_def: number;
};
/*
for defenses, divide the attack power by the def value(between 1 and 2) 
and round it to the nearest whole number.
Defenses go 2 decimal places out.
EX a boss attack with 125 phys attack against a character with 1.25 
p_def would do 100 damage.
ev is a percentage, so 0.1 is 10% evasion.
*/

//Need to add seperate max stats for hp/mp

export interface StatMap extends Map<string, number> { }

export const knight_stats: StatMap = new Map
    (
        [
            ["hp", 10],
            ["max_hp", 730],
            ["mp", 140],
            ["max_mp", 140],
            ["p_def", 1.45],
            ["d_p_def", 1.45],
            ["m_def", 1.00],
            ["d_m_def", 1.00],
            ["ev", 0.05],
            ["d_ev", 0.05]
        ]
    );

export const dmage_stats: StatMap = new Map
    (
        [
            ["hp", 470],
            ["max_hp", 470],
            ["mp", 270],
            ["max_mp", 270],
            ["p_def", 1.20],
            ["d_p_def", 1.20],
            ["m_def", 1.50],
            ["d_m_def", 1.50],
            ["ev", 0.07],
            ["d_ev", 0.07]
        ]
    );

export const wmage_stats: StatMap = new Map
    (
        [
            ["hp", 400],
            ["max_hp", 400],
            ["mp", 310],
            ["max_mp", 310],
            ["p_def", 1.00],
            ["d_p_def", 1.00],
            ["m_def", 1.45],
            ["d_m_def", 1.45],
            ["ev", 0.07],
            ["d_ev", 0.07]
        ]
    );

export const rmage_stats: StatMap = new Map
    (
        [
            ["hp", 375], //max is 375
            ["max_hp", 375],
            ["mp", 50],
            ["max_mp", 530],
            ["p_def", 0.90],
            ["d_p_def", 0.90],
            ["m_def", 0.90],
            ["d_m_def", 0.90],
            ["ev", 0.15],
            ["d_ev", 0.15]
        ]
    );
//is adjusted later based on difficulty
export const boss_stats: StatMap = new Map
    (
        [
            ["hp", 780000],
            ["max_hp", 780000],
            ["p_def", 1.00],
            ["m_def", 1.00],
            ["atk", 1.00],

        ]
    );

//changes that get taken into account when player or boss attacks
//they're multipliers
//both def and atk types go up the same
//These are NOT the actual stat (see above), 
//just what gets added for the difficulty

export const boss_stat_changes: Map<string, { atk: number, def: number }> = new Map
    (
        [
            [
                "very_easy", {
                    atk: 0.50,
                    def: 0.50
                }
            ],
            [
                "easy", {
                    atk: 0.75,
                    def: 0.75
                }
            ],
            [
                "normal", {
                    atk: 1.00,
                    def: 1.00
                }
            ],
            [
                "hard", {
                    atk: 1.25,
                    def: 1.25
                }
            ],
            [
                "nightmare", {
                    atk: 1.50,
                    def: 1.50
                }
            ]
        ]
    );

/*These are so we can efficiently loop through and update multiple 
characters at a time*/
//should never be undefined but it satisfies TS
export const player_mdef_map: Map<string, number | undefined> = new Map
    (
        [
            ['knight', knight_stats.get('m_def')],
            ['dmage', dmage_stats.get('m_def')],
            ['wmage', wmage_stats.get('m_def')],
            ['rmage', rmage_stats.get('m_def')]

        ]
    );


export const player_pdef_map: Map<string, number | undefined> = new Map
    (
        [
            ['knight', knight_stats.get('p_def')],
            ['dmage', dmage_stats.get('p_def')],
            ['wmage', wmage_stats.get('p_def')],
            ['rmage', rmage_stats.get('p_def')]
        ]
    );


export const all_player_defs = new Map([...player_mdef_map, ...player_pdef_map])

//determines how high or low a stat can go through buffs/debuffs. 
//Same limits shared across all players
interface StatRange {
    min: number;
    max: number;
}

export interface Stats {
    p_def: StatRange;
    m_def: StatRange;
    p_atk: StatRange;
    m_atk: StatRange;
    ev?: StatRange;
}

export const min_max_vals_map: Map<string, Stats> = new Map([
    [
        "player", {
            "p_def": {
                "min": 0.50,
                "max": 2.20
            },
            "m_def": {
                "min": 0.50,
                "max": 2.20
            },
            "p_atk": {
                "min": 0.50,
                "max": 2.20
            },
            "m_atk": {
                "min": 0.50,
                "max": 2.20
            },
            "ev": {
                "min": 0.00,
                "max": 0.40
            }
        }
    ],
    [
        "boss", {
            "p_def": {
                "min": 0.50,
                "max": 2.50
            },
            "m_def": {
                "min": 0.50,
                "max": 2.50
            },
            "p_atk": {
                "min": 0.50,
                "max": 2.50
            },
            "m_atk": {
                "min": 0.50,
                "max": 2.50
            },
        }
    ]
]
)

//probably don't need this
function UpdateStats(player_name: string, stats_to_update: string[], is_boss: boolean): void {
    const updated_stats = new Map<string, player_stats>();


}
/*function UpdateStats(player_name: string, changing_stat: string, is_boss: boolean): ts.ESMap<string, number> {

}*/


//status effects: 
//poison - 5% of max hp per turn
//curse - insta death in 10 turns
//frozen - can't move for 3 turns
export default UpdateStats;