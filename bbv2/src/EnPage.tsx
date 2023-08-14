import React from "react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import * as e from './Encyclopedia';
import * as iv from './Inventory';
import paperbg from './assets/images/bg-and-effects/paper.png';
import { playClickSfx } from "./sfxManagement";
import * as sm from "./StatManagement";
import knight_img from './assets/images/player/sprites/knight.png';
import dmage_img from './assets/images/player/sprites/dmage.png';
import assassin_img from './assets/images/player/sprites/assassin.png';
import rmage_img from './assets/images/player/sprites/rmage.png';
import { MatchToMaxHpMap } from "./MainPage";
import { MatchToMaxMpMap } from "./MainPage";
import { StringMappingType } from "typescript";

const AttackingDesc = () => {
    return (
        <p className="text-2xl my-2 leading-relaxed">
            This game is turn based, heavily inspired by classic JRPGs such as Chrono Trigger or Final Fantasy.
            Most attacks consume MP,
            and the amount is indicated next to the attack name.
            Each character also has an Ultima,
            which are extremely powerful attacks unlocked when the
            progress bar is full. It charges a little every turn. You also have items.
            More on that to the right.
        </p>

    )

}
//default values so they are not affected by any ongoing battle
const MatchToPdef: Map<string, number> = new Map
    (
        [
            ["knight", sm.knight_stats.get("d_p_def")!],
            ["dmage", sm.dmage_stats.get("d_p_def")!],
            ["assassin", sm.assassin_stats.get("d_p_def")!],
            ["rmage", sm.rmage_stats.get("d_p_def")!],

        ]
    );

const MatchToMdef: Map<string, number> = new Map
    (
        [
            ["knight", sm.knight_stats.get("d_m_def")!],
            ["dmage", sm.dmage_stats.get("d_m_def")!],
            ["assassin", sm.assassin_stats.get("d_m_def")!],
            ["rmage", sm.rmage_stats.get("d_m_def")!],

        ]
    );

const MatchToEv: Map<string, number> = new Map
    (
        [
            ["knight", sm.knight_stats.get("d_ev")!],
            ["dmage", sm.dmage_stats.get("d_ev")!],
            ["assassin", sm.assassin_stats.get("d_ev")!],
            ["rmage", sm.rmage_stats.get("d_ev")!],

        ]
    );

const MatchToCharDesc: Map<String, string> = new Map
    (
        [
            ["knight", "The main shield of the party. He is resistant to physical attacks and can take the most damage. Deals all physical damage."],
            ["dmage", "She is a spellcaster with a balanced spread of support, offense and stat debuffing."],
            ["assassin", "High evasion and good at inflicting stat debuffs on the enemy."],
            ["rmage", "High risk, high reward glass cannon. She has potential to deal the most damage out of everyone, but is very fragile."]
        ]
    );
interface CharacterComponentProps {
    name: string;
    img_src: string;
    lookup_name: string;

};
//description will go on the right, so two columns in row
const CharacterStatComponent: React.FC<CharacterComponentProps> = ({
    name, img_src, lookup_name }) => {
    return (
        <>
            <li className="flex flex-row">
                <div className="flex flex-col">
                    <h1>{name}</h1>
                    <hr className="mb-4"></hr>
                    <img src={img_src}
                        className="max-w-[12rem] rounded-xl " />
                    <figcaption className="text-[1.5rem]">
                        <ul>
                            <li title="Maximum HP of the character. If HP reaches 0, they die.">
                                Max HP: {MatchToMaxHpMap.get(lookup_name)}
                            </li>
                            <li title="Maximum MP of the character. Required to use most attacks.">
                                Max MP: {MatchToMaxMpMap.get(lookup_name)}
                            </li>
                            <li title="Determines how much damage the character takes from physical attacks, as a division. Ex. 1.45 = 45% less damage and 0.9 means 10% more.">
                                Physical Defense: {MatchToPdef.get(lookup_name)}
                            </li>
                            <li title="Determines how much damage the character takes from magic attacks, as a division. Ex. 1.2 = 20% less damage and 0.9 means 10% more.">
                                Magical Defense: {MatchToMdef.get(lookup_name)}
                            </li>
                            <li title="Chance of evading attacks, as a percentage. Ex. 0.07 = 7% chance to dodge.">
                                Evasion: {MatchToEv.get(lookup_name)}
                            </li>
                        </ul>
                    </figcaption>
                </div>
                <p className="flex flex-col mt-16 text-[1.5rem] max-w-[12rem] ml-10">
                    {MatchToCharDesc.get(lookup_name)}
                </p>
            </li>
            <br></br>
        </>
    )
}
//show the stats for each character
//put this under defending
const CharacterStats = () => {
    return (
        <section>
            <h1 className="text-4xl mt-2">
                Each character has their own role. Hover over each stat to see its purpose.
                <hr className="max-w-sm mb-4"></hr>
            </h1>
            <ul className="text-4xl">
                <CharacterStatComponent
                    name="Knight"
                    img_src={knight_img}
                    lookup_name="knight"
                />
                <CharacterStatComponent
                    name="Dark Mage"
                    img_src={dmage_img}
                    lookup_name="dmage"
                />
                <CharacterStatComponent
                    name="Assassin"
                    img_src={assassin_img}
                    lookup_name="assassin"
                />
                <CharacterStatComponent
                    name="Red Mage"
                    img_src={rmage_img}
                    lookup_name="rmage"
                />
            </ul>
        </section>
    )
}
//explains how scoring works
//put this under stats
const Scoring = () => {
    return (
        <>
            <h1 className="text-4xl mb-4">
                Scoring is based on a few factors, which are:
            </h1>
            {/*for some reason the type does not work here, but it does 
            with css*/}
            <ol className="text-2xl space-y-8 ml-4">
                <li> Difficulty chosen: Higher difficulties grant more
                    points; easier choices have the opposite effect.
                </li>
                <li>
                    Deaths: More character deaths means a lower score.
                </li>
                <li>
                    Turn count: The more efficient you are, the better.
                </li>
            </ol>
        </>
    )
}
interface AttacksComponentProps {
    player: string;
    map_name: string;
}
const AttacksComponent: React.FC<AttacksComponentProps> = ({ player, map_name }) => {
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

const ItemComponent = () => {
    return (
        <ul>
            {[...iv.player_inventory.entries()].map(([item, details], index) => (
                <li key={index}>
                    <h1 className="text-2xl">{item}</h1>
                    <p className="text-lg">{details.description}</p>
                    <br></br>
                </li>
            ))}
        </ul>
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
            <button className="z-[9999] -ml-72 mt-2"
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
                    player="Assassin"
                    map_name="assassin_attacks"
                />
                <AttacksComponent
                    player="Red Mage"
                    map_name="rmage_attacks"
                />
            </div>
            <div className="flex flex-col z-[9999] max-w-lg">
                <h1 className="text-7xl my-2">
                    Defending
                </h1>
                <hr></hr>
                <p className="text-2xl mt-2 mb-2">
                    Defending uses no MP and greatly raises that character's
                    defense, decreasing back to normal over the span of 3 turns.
                    It can be used consecutively,
                    but stat buffs do have an upper limit.
                    It does count as a turn. The King is intelligent and
                    targets weaker characters, so use this to your advantage.
                </p>
                <hr></hr>
                <h1 className="text-7xl my-2">
                    Character Stats
                </h1>
                <hr></hr>
                <CharacterStats />
                <hr></hr>
                <h1 className="text-7xl my-2">
                    Scoring
                </h1>
                <hr></hr>
                <Scoring />
            </div>
            <div className="flex flex-col z-[9999] max-w-lg">
                <h1 className="text-7xl my-2">
                    Items
                </h1>
                <hr></hr>
                <p className="text-2xl mt-2">
                    Items are in limited stock, but use no MP.
                    They do not use a turn and can be used on any character.
                </p>
                <hr className="my-2"></hr>
                <ItemComponent />
            </div>
        </main>
    )

}

export default EncylopediaPage;