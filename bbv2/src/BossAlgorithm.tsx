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
export function bossAttackAlgo(attackProps: BossAttackProps) {
    //first rule out any dead characters as potential targets
    let current_statuses = [
        attackProps.knight_status,
        attackProps.dmage_status,
        attackProps.wmage_status,
        attackProps.rmage_status
    ];
    const allies = ["knight", "dmage", "wmage", "rmage"];
    let potential_targets: string[] = [];

    current_statuses.forEach((condition, index) => {
        if (!condition.includes("dead")) {
            potential_targets.push(allies[index]);
        }
    })
    let moveset: string[] = [];
    //Then determine current moveset...
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

    //weights are determined by phase
    //Choose t


}

//This gets added to each phase
const boss_attack_functions: Map<string, Function> = new Map(


);

function Percentage() {
    return Math.random();
}
//name, percentage chance of being used is determined by phase
const weights: Map<number, object> = new Map([
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