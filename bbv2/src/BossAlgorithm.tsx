import * as sm from './StatManagement';

import { Randomizer } from './PlayerActions';
import {
    KnightStatusContext,
    DmageStatusContext, WmageStatusContext,
    RmageStatusContext
} from './Context';

//This is going to work exactly the same as the player side, 
//except it's automated
export function bossAttackAlgo(phase: number) {
    sm.knight_stats.set("hp", sm.knight_stats.get("hp")! - 1000);

    console.log("boss attack");


}

//This gets added to each phase
const boss_attack_functions: Map<string, Function> = new Map(


);

const phase1_attacks: string[] = [

]
//2 and 3 are just what gets added into it each phase
const phase2_attacks: string[] = [

]

const phase3_attacks: string[] = [

]
//show the attack
export const BossAttackArea: React.FC = () => {
    return (
        <section className='max-w-[32rem] absolute top-40 z-50  border-red-700'>
            <img className='  z-50   '
                src={require('./assets/images/boss/sprites/phase3v2.png')}>
            </img>
        </section>
    )
}