import * as sm from './StatManagement';

import { Randomizer } from './PlayerActions';
import {
    KnightStatusContext,
    DmageStatusContext, WmageStatusContext,
    RmageStatusContext
} from './Context';
import { useState, useEffect } from 'react';

//This is going to work exactly the same as the player side, 
//except it's automated

/*how this is going to be weighted:
Target is somewhat random, but allies with 
a: status effects or
b: low hp 
are more likely to be targeted
Obviously he will check if a character is dead or not(if their hp is 0)

*/
let current_boss_attack: string = "Shadow Blade";

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
}
let potential_targets: string[] = [];
export function bossAttackAlgo(attackProps: BossAttackProps) {
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
    let moveset: string[] = [];

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

    // use a randomzier and set the max to the sum of all the weights
    let chosen_target: string;
    //GALAXY BRAIN TIME
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
    switch (attackProps.phase) {
        case 1:
            moveset = boss_attacks;

            break;
        case 2:
            moveset = boss_attacks.concat(phase2_attacks);

            break;
        case 3:
            moveset = boss_attacks.concat(phase2_attacks, phase3_attacks);

            break;
    }
    console.log("targets", potential_targets)
    console.log("moveset", moveset);




}

//This gets added to each phase
const boss_attack_functions: Map<string, Function> = new Map(


);

function Percentage() {
    return Math.random();
}
//phase, percentage chance of being used is determined by phase
const weights: Map<number, object> = new Map(
    [
        [
            1, {
                "Shadow Blade": 0.3,
                "Spheres of Madness": 0.2,
                "Devourment": 0.1,
                "Disintegration": 0.2,
                "Soul Crusher": 0.2
            }
        ]
    ])
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
//show the attack
export const BossAttackArea: React.FC = () => {
    const [isBossAttackShown, setIsBossAttackShown] = useState(false);
    //Change the image whenver the attack changes
    useEffect(() => {
        setIsBossAttackShown(true);
        setTimeout(() => {
            setIsBossAttackShown(false);
        }, 2000);
    }, [current_boss_attack]);


    return (
        <section className='max-w-[32rem] absolute top-40 z-50  border-red-700'>
            {isBossAttackShown &&
                <img className='z-50'
                    src={require(`./assets/images/boss/attacks/${current_boss_attack}.png`)}>
                </img>
            }
        </section>
    )
}