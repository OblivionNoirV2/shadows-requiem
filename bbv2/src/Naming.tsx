import React, { useContext } from "react";
import {
    KnightNameContext,
    DmageNameContext,
    WmageNameContext,
    RmageNameContext
} from "./Context";

export const NameCharacters = () => {
    const characters: string[] = ['Knight', 'Dark Mage', 'White Mage', 'Red Mage'];

    const { setKnightName } = useContext(KnightNameContext);
    const { setDmageName } = useContext(DmageNameContext);
    const { setWmageName } = useContext(WmageNameContext);
    const { setRmageName } = useContext(RmageNameContext);

    const [names, setNames] = React.useState({ "Knight": "", "Dark Mage": "", "White Mage": "", "Red Mage": "" });

    const handleInputChange = (character: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setNames({ ...names, [character]: event.target.value });
    }

    const handleSaveClick = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setKnightName(names['Knight']);
        setDmageName(names['Dark Mage']);
        setWmageName(names['White Mage']);
        setRmageName(names['Red Mage']);
        console.log(names);
    };


    return (
        <main className="flex justify-center mx-autos">
            <div className="flex flex-col">
                <h1 className="text-white text-6xl mt-4">
                    Character Naming
                </h1>
                <hr className="bg-white"></hr>
                <form className="text-black" onSubmit={handleSaveClick}>
                    <section className="flex flex-row space-x-4">
                        <section className="flex flex-col space-y-10 mt-2 ">
                            {characters.map((character, index) => (
                                <ul key={index}>
                                    <li>
                                        <label htmlFor={character}
                                            className="text-white text-3xl">
                                            {character}
                                        </label>
                                    </li>
                                </ul>
                            ))}
                        </section>
                        <section className="flex flex-col space-y-14 mt-2">
                            {characters.map((character, index) => (
                                <ul key={index}>
                                    <li>
                                        <input
                                            type="text"
                                            id={character}
                                            name={character}
                                            className="text-black"
                                            onChange={handleInputChange(character)}
                                        />
                                    </li>
                                </ul>
                            ))}
                        </section>
                    </section>
                    <SaveButton onClick={() => handleSaveClick} />
                </form>
            </div>
        </main>
    )
}

interface SaveButtonProps {
    onClick: () => void;
}

const SaveButton: React.FC<SaveButtonProps> = ({ onClick }) => {
    return (
        <button className="bg-black text-white px-4 rounded-xl max-w-[4rem]"
            onClick={onClick}>
            Save
        </button>
    )
}
