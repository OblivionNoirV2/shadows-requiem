import * as sm from './StatManagement';

import { Randomizer, selected_attack } from './PlayerActions';
import {
    KnightStatusContext,
    DmageStatusContext, WmageStatusContext,
    RmageStatusContext
} from './Context';
import { useState, useEffect } from 'react';
import * as sfx from './sfxManagement';

//This is going to work exactly the same as the player side, 
//except it's automated

/*how this is going to be weighted:
Target is somewhat random, but allies with 
a: status effects or
b: low hp 
are more likely to be targeted
Obviously he will check if a character is dead or not(if their hp is 0)

*/
let current_boss_attack: string;

interface BossAttackProps {
    phase: number;
    knight_status: string[];
    dmage_status: string[];
    wmage_status: string[];
    rmage_status: string[];
    knight_hp: number;
    dmage_hp: number;
    wmage_hp: number;
    rmage_hp: number;
    knight_mp: number;
    dmage_mp: number;
    wmage_mp: number;
    rmage_mp: number;
    current_turn: number;
}
let potential_targets: string[] = [];
let boss_atk_message: string = "";

//use this to ensure a gap between unholy symphonys
//If the list count gets to 10, he uses it then it resets
//Also use this for My Turn
export let last_boss_attacks: string[] = []
export function bossAttackAlgo(attackProps: BossAttackProps) {
    potential_targets = [];

    console.log("attackProps", attackProps)
    current_boss_attack = "Unholy Symphony";
    //first rule out any dead characters as potential targets
    let current_statuses = [
        attackProps.knight_status,
        attackProps.dmage_status,
        attackProps.wmage_status,
        attackProps.rmage_status
    ];

    let current_hp = [
        attackProps.knight_hp,
        attackProps.dmage_hp,
        attackProps.wmage_hp,
        attackProps.rmage_hp
    ]
    const allies = ["knight", "dmage", "wmage", "rmage"];


    current_statuses.forEach((condition, index) => {
        if (!condition.includes("dead")) {
            potential_targets.push(allies[index]);
        }
    })


    /*
    Give each a number (start at 1 and go up accordingly) then 
    it’ll go in a chain to determine who he attacks, 
    starting with the highest number(s). 
    Eg, if a character ends up at 8, he has an 80% chance to target 
    that character. If he doesn’t, it moves to the next and sets 
    that as the target. Do this multiple times depending on how 
    many targets the attack has. To get around Inversion having 
    special requirements, remove it from the moveset first if 
    the conditions are not met 
     */

    let knight_weight = 1;
    let dmage_weight = 1;
    let wmage_weight = 1;
    let rmage_weight = 1;

    let character_weights = [
        knight_weight,
        dmage_weight,
        wmage_weight,
        rmage_weight
    ];
    //Breakpoint and the weight associated with it
    const CharacterWeightsMap: Map<number, number> = new Map([
        [350, 1],
        [300, 2],
        [250, 3],
        [200, 4],
        [150, 5],
        [100, 6],
        [50, 7]
    ])
    //determines how likely each character is to be targeted
    function DetermineWeights() {
        current_statuses.forEach((condition, index) => {
            if (condition.includes("poison")) {
                character_weights[index] += 2;
            }
            if (condition.includes("freeze")) {
                character_weights[index] += 2;
            }
            if (condition.includes("curse")) {
                character_weights[index] += 4;
            }
        })
        current_hp.forEach((hp, index) => {
            CharacterWeightsMap.forEach((weight, breakpoint) => {
                if (hp <= breakpoint) {
                    character_weights[index] += weight;
                    console.log("character_weights", character_weights)

                }
            }
            )
        })
    }

    //Target first, then the attack 

    //use a randomizer and set the max to the sum of all the weights
    let chosen_target: string;
    /*GALAXY BRAIN TIME*/
    function Targeting() {
        //Get max range for the randomizer
        const total_weights = character_weights.reduce((a, b) => a + b, 0);
        //Get a random value between 1 and the total weights
        const random_value = Randomizer(1, total_weights);

        //Sort the weights in descending order 
        //and calculate cumulative weights
        const weights_with_cumulative = character_weights
            //Map to an original array to prevent it 
            //from getting stuck on the first index
            .map((weight, index) => ({ weight, index }))
            //Then sort THAT array based on weight
            .sort((a, b) => b.weight - a.weight)
            //Map until the cumulative weight is calculated
            //item, index, and the array itself
            .map((item, i, arr) => ({
                ...item,
                //add the current weight to the previous weight
                cumulative_weight: arr.slice(0, i + 1).reduce(
                    (total, current) => total + current.weight, 0),
            }));

        for (let weight of weights_with_cumulative) {
            //Compare the value from above to the cumulative weight 
            //The higher the individual weight, the higher the chance
            //it has to hit
            if (random_value <= weight.cumulative_weight) {
                chosen_target = potential_targets[weight.index];
                console.log("chosen_target", chosen_target);
                break;
            }
        }
    }

    //use event listeners to determine when certain attacks are eligible
    //Then determine current moveset and weights for each move...
    DetermineWeights();
    Targeting();


    //He will only use this if everyone's mp is lower than their hp
    //MP must be <= 25% of max hp
    let inversion_eligible: boolean = false;

    /*
    First check conditionals for special attacks. 
    If any are met, set the moveset probabilities accordingly so 
    it still matches 100%. Inversion should have a quite high chance 
    of occurring if the condition is met. 
    After that, just do it based on a simple range. 
    Ie the range it falls into determines his attack  
    */

    function CheckForInversion() {
        let mp_is_lower_than_hp = true;
        current_hp.forEach((hp, index) => {
            if (hp > current_hp[index] * 0.25) {
                mp_is_lower_than_hp = false;
            }
        })
        if (mp_is_lower_than_hp) {
            inversion_eligible = true;
        }

    }
    //Determines damage and image to show


    let moveset: AttackWeightsObject;
    let chosen_attack_num: number;

    let secondary_targets: string[] = [];
    let potential_secondary: string[];
    //use this for things like devourment
    //Also have Unholy Synphony be the sum of the 
    //last 10 attacks(divided by 2 maybe). Use a tritone for that sfx!
    let prev_dmg: number[];

    interface CharacterRespectiveStats {
        hp: number;
        mp?: number;
        pdef: number;
        mdef: number;
        ev: number;
    }

    const MatchToStat: Map<string, CharacterRespectiveStats> = new Map(
        [
            [
                "knight", {
                    hp: sm.knight_stats.get("hp")!,
                    mp: sm.knight_stats.get("mp")!,
                    pdef: sm.knight_stats.get("p_def")!,
                    mdef: sm.knight_stats.get("m_def")!,
                    ev: sm.knight_stats.get("ev")!
                }
            ],
            [
                "dmage", {
                    hp: sm.dmage_stats.get("hp")!,
                    mp: sm.dmage_stats.get("mp")!,
                    pdef: sm.dmage_stats.get("p_def")!,
                    mdef: sm.dmage_stats.get("m_def")!,
                    ev: sm.dmage_stats.get("ev")!
                }
            ],
            [
                "wmage", {
                    hp: sm.wmage_stats.get("hp")!,
                    mp: sm.wmage_stats.get("mp")!,
                    pdef: sm.wmage_stats.get("p_def")!,
                    mdef: sm.wmage_stats.get("m_def")!,
                    ev: sm.wmage_stats.get("ev")!
                }
            ],
            [
                "rmage", {
                    hp: sm.rmage_stats.get("hp")!,
                    mp: sm.rmage_stats.get("mp")!,
                    pdef: sm.rmage_stats.get("p_def")!,
                    mdef: sm.rmage_stats.get("m_def")!,
                    ev: sm.rmage_stats.get("ev")!
                }
            ]
        ]
    )

    interface CalculateFinalProps {
        pre_dmg: number;
        target: string;
        atk_type: string;

    }
    function DeductHP(target: string, final_dmg: number) {
        switch (target) {
            case "knight":
                sm.knight_stats.set("hp", sm.knight_stats.get("hp")! - final_dmg);
                break;
            case "dmage":
                sm.dmage_stats.set("hp", sm.dmage_stats.get("hp")! - final_dmg);
                break;
            case "wmage":
                sm.wmage_stats.set("hp", sm.wmage_stats.get("hp")! - final_dmg);
                break;
            case "rmage":
                sm.rmage_stats.set("hp", sm.rmage_stats.get("hp")! - final_dmg);
                break;
        }

    }
    //Match the target to their respective stats and get the final output
    function CalculateFinal(props: CalculateFinalProps): number {
        let final_dmg: number;
        let target_stats;
        //First check for evasion
        if (MatchToStat.get(props.target)!.ev <= Percentage()) {
            //then add defense
            if (props.atk_type === "phys") {
                final_dmg = (props.pre_dmg / MatchToStat.get(props.target)!.pdef);
                return final_dmg;
            } else if (props.atk_type === "mag") {
                final_dmg = (props.pre_dmg / MatchToStat.get(props.target)!.mdef);
                return final_dmg;
            }
        } else {
            console.log("evaded")
            boss_atk_message = `${props.target} evaded the attack!`

        }
        return 0;
    }
    function Percentage() {
        return Math.random();
    }
    interface BossRNGProps {
        current_boss_attack: string;
        min: number;
        variance: number;
        atk_sfx: string;
        secondary_targets?: string[];
        //if an attack hits multiple targets, 
        //the others are calculated in that function from the 
        //remaining pool (at random) and passed here
        attack_type: string; //mag, phys or none
    }
    //attacks like inversion thast have unique damage methods 
    //take place in the function itself
    function BossRNG(props: BossRNGProps): number | void {
        current_boss_attack = props.current_boss_attack;

        const atk_max = props.min * props.variance;
        //remember to accoount for pdef/mdef/ev
        last_boss_attacks.push(current_boss_attack);
        console.log("chosen", chosen_target)
        //also sets the message to be displayed
        boss_atk_message = props.current_boss_attack;

        if (props.current_boss_attack === "Devourment") {
            //heal by whatever the final damage is
        }
        //Before def is taken into account
        let pre_dmg = Randomizer(props.min, atk_max);
        console.log("pre_dmg", pre_dmg)
        if (props.secondary_targets) {
            props.secondary_targets.push(chosen_target)
            props.secondary_targets.forEach((target) => {
                console.log("target", target)
                //add def/ev/mdef to the equation
                let x = CalculateFinal({
                    pre_dmg: pre_dmg,
                    target: target,
                    atk_type: props.attack_type
                })
                DeductHP(target, x);
            })

        }

    }

    //DO NOT TOUCH
    function TargetMulti(additional_targets: number) {
        potential_secondary = [];

        potential_secondary = potential_targets.filter(
            (target) => target !== chosen_target);
        console.log("potential_secondary", potential_secondary)
        while (secondary_targets.length < additional_targets) {
            console.log("potential_secondary in loop", potential_secondary)
            let rand = Randomizer(0, additional_targets + 1);
            console.log("rand", rand)
            if (!secondary_targets.includes(potential_secondary[rand])) {
                secondary_targets.push(potential_secondary[rand]);
            }
        }
        console.log("secondary_targets", secondary_targets)
        return secondary_targets;

    }
    //target is already chosen
    function LowerAllyStat(stat: string, amount: number) {

    }
    const boss_attack_functions: Map<string, Function> = new Map(
        [
            [
                "Shadow Blade", function ShadowBlade() {

                    BossRNG
                        (
                            {
                                current_boss_attack: "Shadow Blade",
                                min: 50,
                                variance: 1.10,
                                atk_sfx: "placeholder",
                                attack_type: "phys"
                            }
                        )

                }
            ],
            [   //Targets 3, starting with the previously chosen
                "Spheres of Madness", function SpheresOfMadness() {

                    BossRNG(
                        {
                            current_boss_attack: "Spheres of Madness",
                            min: 35,
                            variance: 1.10,
                            secondary_targets: TargetMulti(2),
                            atk_sfx: "placeholder",
                            attack_type: "mag"
                        }

                    )
                }
            ],
            [
                "Devourment", function Devourment() {
                    //also heals boss by 2* damage inflicted
                    BossRNG(
                        {
                            current_boss_attack: "Devourment",
                            min: 120,
                            variance: 1.10,
                            atk_sfx: "placeholder",
                            attack_type: "phys"
                        }
                    )
                }
            ],
            [ //drops target's phys def
                "Disintegration", function Disintegration() {
                    BossRNG(
                        {
                            current_boss_attack: "Disintegration",
                            min: 70,
                            variance: 1.10,
                            atk_sfx: "placeholder",
                            attack_type: "phys"
                        }
                    )

                }
            ],
            [ //drops target's mag def
                "Soul Crusher", function SoulCrusher() {

                    BossRNG(
                        {
                            current_boss_attack: "Soul Crusher",
                            min: 70,
                            variance: 1.10,
                            atk_sfx: "placeholder",
                            attack_type: "mag"
                        }
                    )


                }
            ],
            [
                "Inversion", function Inversion() {

                }
            ],
            [
                "Frozen Soul", function FrozenSoul() {

                }
            ],
            [
                "Unending Grudge", function UnendingGrudge() {

                }
            ],
            [
                "Unholy Symphony", function UnholySymphony() {
                    //min given to the RNG is tht total 
                    //of the past 10 attacks 
                    //Targets all allies

                    BossRNG(
                        {
                            current_boss_attack: "Unholy Symphony",
                            min: prev_dmg.reduce(
                                (accumulator, currentValue) => accumulator + currentValue, 0),
                            variance: 1.05,
                            atk_sfx: "US",
                            attack_type: "none"
                        }
                    )


                }
            ],
            [
                "Death's Touch", function DeathsTouch() {

                }
            ],
            [
                "Chaos Blade", function ChaosBlade() {

                }
            ]
        ]
    );

    switch (attackProps.phase) {
        case 1:
            moveset = attack_weights.get(1)!;
            chosen_attack_num = Percentage();
            boss_attack_functions.get("Spheres of Madness")!();

            break;
        case 2:
            if (inversion_eligible) {
                //adjust the percentages accordingly
            } else {
                //use the default moveset, 
                //which has inversion at a 0% chance
                moveset = attack_weights.get(2)!;
            }


            break;
        case 3:
            if (last_boss_attacks.length >= 10) {
                //use unholy symphony
                last_boss_attacks = [];

            } else {
                if (inversion_eligible) {
                    //adjust the percentages accordingly
                } else {
                    //use the default moveset, 
                    //which has inversion at a 0% chance
                    moveset = attack_weights.get(3)!;
                }

            }
            break;
    }
    console.log("potential targets", potential_targets)





    //phase, percentage chance of being used is determined by phase

    //undefined = has special conditions 

    //show the attack
}//algo function ends here 


interface AttackWeightsObject {
    [key: string]: number | undefined
}
const attack_weights: Map<number, AttackWeightsObject> = new Map(
    [
        [
            1, {
                "Shadow Blade": 0.3, //standard atk, med phys
                "Spheres of Madness": 0.2, //low mag dmg, hits all allies
                "Devourment": 0.1, //Heavy phys, heals boss by damage dealt
                "Disintegration": 0.2, //med phys dmg, Med chance to lower phys def
                "Soul Crusher": 0.2 //med mag dmg, med chance to lower mag def
            }
        ],
        [
            2, {
                "Shadow Blade": 0.2,
                "Spheres of Madness": 0.1,
                "Devourment": 0.1,
                "Disintegration": 0.2,
                "Soul Crusher": 0.2,
                "Inversion": 0, //Strong chance of occuring whenever all allies have lower mp than 25% of their max hp
                "Frozen Soul": 0.05,
                "Unending Grudge": 0.05,
            }
        ],
        [
            3, {
                "Shadow Blade": 0.20,
                "Spheres of Madness": 0.1,
                "Devourment": 0.1,
                "Disintegration": 0.1,
                "Soul Crusher": 0.1,
                "Inversion": 0.1,
                "Frozen Soul": 0.05,
                "Unending Grudge": 0.05,
                "Unholy Symphony": 0, //Runs every 10 turns
                "Death's Touch": 0.10,
                "Chaos Blade": 0.10

            }
        ]
    ])

//probably don't need these 
const boss_attacks: string[] = [
    'Shadow Blade', //standard atk, med phys
    'Spheres of Madness', //low mag dmg, hits all allies
    "Devourment", //Heavy phys, heals boss by damage dealt
    "Disintegration", //med phys dmg, Med chance to lower phys def
    "Soul Crusher", //med mag dmg, med chance to lower mag def

]
//2 and 3 are just what gets added into it each phase
//He starts uying status effects in phase 2 
const phase2_attacks: string[] = [
    "Inversion" /*Flips everyone's hp and mp 
    (Does not raise mp, only sets hp to whatever the mp value is) 
    //He will only use this if everyon's mp is lower than their hp
    */,
    "Frozen Soul", //chance of freeze
    "Unending Grudge", //chance of poison,

]

const phase3_attacks: string[] = [
    "Unholy Symphony",/*his ultimate, 
    ignores defenses, high damage to all, chance of curse*/
    "Death's Touch", //chance of curse
    "Chaos Blade" //very heavy single target

]
export const BossAttackArea: React.FC = () => {
    const [isBossAttackShown, setIsBossAttackShown] = useState(false);
    //Change the image whenver the attack changes
    useEffect(() => {
        setIsBossAttackShown(true);
        setTimeout(() => {
            setIsBossAttackShown(false);
        }, 2000);
        console.log("current_boss_attack", current_boss_attack)
    }, [current_boss_attack]);


    return (
        <section className='max-w-[32rem] absolute top-40 z-50  border-red-700'>
            {isBossAttackShown &&
                <>
                    <h1 className='text-7xl text-white'>
                        {boss_atk_message}
                    </h1>

                    <img className='z-50'
                        src={
                            require(`./assets/images/boss/attacks/${current_boss_attack}.png`)}>
                    </img>

                </>
            }
        </section>
    )
}