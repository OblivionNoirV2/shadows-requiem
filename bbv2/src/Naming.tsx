import React, { useContext } from "react";
import {
    KnightNameContext,
    DmageNameContext,
    WmageNameContext,
    RmageNameContext
} from "./Context";

export const NameCharacters = () => {
    const { KnightName, setKnightName } = useContext(KnightNameContext);
    const { DmageName, setDmageName } = useContext(DmageNameContext);
    const { WmageName, setWmageName } = useContext(WmageNameContext);
    const { RmageName, setRmageName } = useContext(RmageNameContext);

    return (
        <div>
            <h1>Character Naming</h1>
        </div>
    )

}