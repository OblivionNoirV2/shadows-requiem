
interface player_stats {
    hp: number;
    max_hp: number;
    mp: number;
    max_mp: number;
    p_def: number;
    m_def: number;
    ev: number;
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
//link the hp/mp bars to the values here
//doesn't need to return anything, just update the values
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