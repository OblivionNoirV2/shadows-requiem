
export type player_stats = {
    hp: number,
    max_hp: number,
    mp: number,
    max_mp: number,
    p_def: number,
    m_def: number,
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

//don't think I need most of these, but keep it for now
export const knight_stats: player_stats = {
    hp: 550,
    max_hp: 550,
    mp: 180,
    max_mp: 180,
    p_def: 1.45,
    m_def: 1.00,
    ev: 0.05
};

export const dmage_stats: player_stats = {
    hp: 470,
    max_hp: 470,
    mp: 390,
    max_mp: 390,
    p_def: 1.30,
    m_def: 1.50,
    ev: 0.10
};

export const wmage_stats: player_stats = {
    hp: 400,
    max_hp: 400,
    mp: 420,
    max_mp: 420,
    p_def: 1.00,
    m_def: 1.45,
    ev: 0.10
};

export const rmage_stats: player_stats = {
    hp: 375,
    max_hp: 375,
    mp: 540,
    max_mp: 540,
    p_def: 0.90,
    m_def: 0.90,
    ev: 0.20
};

export const boss_stats: boss_stats = {
    hp: 999999,
    max_hp: 999999,
    p_def: 1.00,
    m_def: 1.00,
};
//changes that get taken into account when player or boss attacks
//both def types go up the same
export const boss_stat_changes: { [difficulty: string]: { atk: number, def: number } } = {

    very_easy: {
        atk: 0.5,
        def: 0.5
    },
    easy: {
        atk: 0.75,
        def: 0.75
    },
    //default, no changes
    normal: {
        atk: 1.0,
        def: 1.0
    },
    hard: {
        atk: 1.25,
        def: 1.25
    },
    nightmare: {
        atk: 1.5,
        def: 1.5
    }
}

/*These are so we can efficiently loop through and update multiple 
characters at a time*/
export const player_mdef_list = [
    { stat: knight_stats, key: 'm_def' },
    { stat: dmage_stats, key: 'm_def' },
    { stat: wmage_stats, key: 'm_def' },
    { stat: rmage_stats, key: 'm_def' }
];

export const player_pdef_list = [
    { stat: knight_stats, key: 'p_def' },
    { stat: dmage_stats, key: 'p_def' },
    { stat: wmage_stats, key: 'p_def' },
    { stat: rmage_stats, key: 'p_def' }
];

export const all_player_defs = [...player_mdef_list, ...player_pdef_list];

//link the hp/mp bars to the values here
//doesn't need to return anything, just update the values

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