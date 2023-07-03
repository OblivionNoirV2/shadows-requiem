import React from "react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import * as e from './Encyclopedia';
import paperbg from './assets/images/bg-and-effects/paper.png';
import { playClickSfx } from "./sfxManagement";
interface AttacksComponent {
    player: string;
    map_name: string;
}
const AttackingDesc = () => {
    return (
        <p className="text-2xl my-2 leading-relaxed">
            This game uses a combination of turn-based and real-time combat.
            Anytime you perform an action, it switches to the enemy, then back to you, and so forth, but
            status changes (such as status ailments or buffs/debuffs) happen in real time. so don't just sit there
            and do nothing! Most attacks consume MP, and the amount is indicated next to the attack name. Each character also has an Ultima, which are extremely powerful attacks unlocked when the progress bar is full. It charges a little every turn
        </p>

    )

}
const AttacksComponent: React.FC<AttacksComponent> = ({ player, map_name }) => {
    return (
        <section>
            <hr></hr>
            <h1 className="text-4xl mt-4">{player}</h1>
            <hr className="max-w-sm mb-4"></hr>
            <ul className="max-w-md">
                {((e as any)[map_name] as Array<string>).map((attack, index) => {
                    const attack_data = e.AttackEncyclopedia.get(attack);
                    return (
                        <React.Fragment key={index}>
                            <li className="text-2xl">
                                {attack !== "Desperation" && attack}
                            </li>
                            {attack_data && attack !== "Desperation" &&
                                <li className="text-lg my-2">
                                    {attack_data.description}
                                    {attack_data.mp_cost
                                        &&
                                        <div className="mb-4">
                                            {
                                                attack === "Border Of Life" ?
                                                    `HP Cost: ${attack_data.mp_cost}`
                                                    : `MP Cost: ${attack_data.mp_cost}`

                                            }

                                        </div>
                                    }
                                </li>
                            }
                        </React.Fragment>
                    )
                })}
            </ul>
        </section>
    )
}

//make it look like a book
const EncylopediaPage = () => {
    useEffect(() => {
        const original_bg = document.body.style.backgroundImage;
        document.body.style.backgroundImage = `url(${paperbg})`;

        return () => {
            document.body.style.backgroundImage = original_bg;
        };
    }, []);

    return (
        <main className="en-main flex flex-row
         text-white space-x-32 justify-center w-full mx-auto 
         items-start ">
            <button className="z-[9999] -ml-36 mt-2"
                onClick={playClickSfx}>
                <Link to="/">
                    Return to title
                </Link>
            </button>
            <div className="flex flex-col z-[9999] max-w-2xl">
                <h1 className="text-7xl mt-4">
                    Attacking
                </h1>
                <hr></hr>
                <AttackingDesc />
                <AttacksComponent
                    player="Knight"
                    map_name="knight_attacks"
                />
                <AttacksComponent
                    player="Dark Mage"
                    map_name="dmage_attacks"
                />
                <AttacksComponent
                    player="White Mage"
                    map_name="wmage_attacks"
                />
                <AttacksComponent
                    player="Red Mage"
                    map_name="rmage_attacks"
                />

            </div>
            <div className="flex flex-col z-[9999] max-w-2xl">
                <h1 className="text-7xl my-2">
                    Defending
                </h1>
                <hr></hr>
                <p className="text-2xl mt-2">
                    Defending uses no MP and greatly raises that character's
                    defense for a short time.
                    It can be used consecutively,
                    but stat buffs do have an upper limit.
                    It does count as a turn. The King is intelligent and
                    targets weaker characters, so use this to your advantage.
                </p>
            </div>
            <div className="flex flex-col z-[9999] max-w-lg">
                <h1 className="text-7xl my-2">
                    Items
                </h1>
                <hr></hr>
                <p className="text-2xl mt-2">
                    Items are in limited stock, but use no MP. They do use a turn, and are used on whichever character selects it.
                </p>
            </div>
        </main>
    )

}

export default EncylopediaPage;