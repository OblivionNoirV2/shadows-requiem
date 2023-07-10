import * as sm from './StatManagement';

import { Randomizer } from './PlayerActions';
import {
    KnightStatusContext,
    DmageStatusContext, WmageStatusContext,
    RmageStatusContext
} from './Context';

//This is going to work exactly the same as the player side, 
//except it's automated

/*how this is going to be weighted:
Target is somewhat random, but allies with 
a: status effects or
b: low hp 
are more likely to be targeted
Obviously he will check if a character is dead or not(if their hp is 0)


*/
export function bossAttackAlgo(phase: number) {
    sm.knight_stats.set("hp", sm.knight_stats.get("hp")! - 500);

    console.log("boss attack");


}

//This gets added to each phase
const boss_attack_functions: Map<string, Function> = new Map(


);

function Percentage() {
    return Math.random();
}
//name, percentage chance of being used is determined by phase

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
    return (
        <section className='max-w-[32rem] absolute top-40 z-50  border-red-700'>
            <img className='z-50'
                src={require('./assets/images/boss/sprites/phase3v2.png')}>
            </img>
        </section>
    )
}