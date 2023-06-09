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
    //Set these on input change, THEN the save button (or enter) retrieves
    //this data and uses it to set the name states
    const [names, setNames] = React.useState(
        {
            "Knight": "",
            "Dark Mage": "",
            "White Mage": "",
            "Red Mage": ""
        }
    );

    const handleInputChange = (character: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setNames({ ...names, [character]: event.target.value });
    }

    const handleSaveClick = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        //set to default names if left empty, this prevents blank names
        setKnightName(names['Knight'] || 'Knight');
        setDmageName(names['Dark Mage'] || 'Dark Mage');
        setWmageName(names['White Mage'] || 'White Mage');
        setRmageName(names['Red Mage'] || 'Red Mage');
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
                        <section className="flex flex-col space-y-11 mt-2 ">
                            {characters.map((character, index) => (
                                <ul key={index}>
                                    <li>
                                        <label htmlFor={character}
                                            className="
                                            text-white 
                                            text-3xl">
                                            {character}
                                        </label>
                                    </li>
                                </ul>
                            ))}
                        </section>
                        <section className="flex flex-col -mt-10">
                            {characters.map((character, index) => (
                                <ul key={index}>
                                    <li className="mt-14">
                                        <input
                                            placeholder={character}
                                            type="text"
                                            maxLength={20}
                                            id={character}
                                            name={character}
                                            className="text-black w-52"
                                            onChange={handleInputChange(character)}
                                        />
                                    </li>
                                </ul>
                            ))}
                            <SaveButton />
                        </section>
                    </section>
                </form>
            </div>
        </main>
    )
}

interface SaveButtonProps {
    onClick: () => void;
}

const SaveButton = () => {
    return (
        <button className="bg-black text-white px-4 
        rounded-xl text-2xl mt-4 "
            type="submit">
            Save
        </button>
    )
}
